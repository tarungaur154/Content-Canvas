import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthRedirect from "./pages/AuthRedirect";
import Authentication from "./router/Authentication";
import Post from "./pages/Post";
import Notifications from "./pages/Notifications";
import User from "./pages/User";
import Write from "./pages/Write";
import { useAuth } from "./contexts/Auth";
import UnAuthNavbar from "./components/UnAuthNavbar";
import SignIn from "./pages/SignIn";
import {
  useState,
  createContext,
  useContext,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { Toaster, toast, Toast } from "react-hot-toast";
import CloseIcon from "@mui/icons-material/Close";
import { io } from "socket.io-client";
import { url } from "./baseUrl";
import SearchResults from "./pages/SearchResults";
import Suggestions from "./pages/Suggestions";

export const DEFAULT_IMG =
  "https://firebasestorage.googleapis.com/v0/b/upload-pics-e599e.appspot.com/o/images%2F1_dmbNkD5D-u45r44go_cf0g.png?alt=media&token=3ef51503-f601-448b-a55b-0682607ddc8a";

type AppContextType = {
  hideNavbar(val: boolean): void;
  handleToast(message: string): void;
  socket: any;
};

const Context = createContext<AppContextType | undefined>(undefined);

export function useAppContext() {
  return useContext(Context) as AppContextType;
}

export default function App() {
  const { isAuthenticated, user } = useAuth();
  const [showNav, setShowNav] = useState(true);

  const [notificationsCount, setNotificationsCount] = useState(0);
  const socket = useMemo(() => io(url), []);

  useEffect(() => {
    if (!user) return;
    socket.emit("start", { userId: user?._id });
    socket.emit("checkNotifications", { userId: user?._id });
    socket.on("notificationsCount", ({ count }) => {
      setNotificationsCount(count);
    });
    socket.on("haveNotifications", (have) => {
      if (have) setNotificationsCount((prev) => prev + 1);
    });
  }, []);

  function hideNavbar(val: boolean) {
    setShowNav(!val);
  }
  function handleToast(message: string) {
    toast((t) => <ToastComponent message={message} t={t} />, {
      style: {
        borderRadius: "4px",
        background: "#333",
        color: "#fff",
        padding: "15px 18px",
      },
    });
  }
  function NullifyNotificationsCount() {
    setNotificationsCount(0);
  }

  const contextValue: AppContextType = {
    hideNavbar,
    handleToast,
    socket,
  };
  return (
    <Context.Provider value={contextValue}>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="App" style={{ height: "100vh" }}>
        {showNav &&
          (isAuthenticated ? (
            <Navbar notificationsCount={notificationsCount} />
          ) : (
            <UnAuthNavbar />
          ))}
        <Routes>
          <Route path="/tag?/:tag?" element={<Home />} />
          <Route path="/signin/:tab" element={<SignIn />} />
          <Route path="/suggestions" element={<Suggestions />} />
          <Route path="/search/:tab/:query" element={<SearchResults />} />
          <Route path="/blog/:id" element={<Post />} />
          <Route path="/user/:id/:tab?" element={<User />} />
          <Route
            path="/notifications"
            element={
              <Authentication>
                <Notifications emptyNotifications={NullifyNotificationsCount} />
              </Authentication>
            }
          />
          <Route
            path="/write/:postId?"
            element={
              <Authentication fallback={<Navigate to="/signin/new" />}>
                <div
                  className="write_page"
                  style={{ width: "50%", margin: "auto", height: "100%" }}
                >
                  <Write />
                </div>
              </Authentication>
            }
          />
          <Route path="/oauth/redirect" element={<AuthRedirect />} />
        </Routes>
      </div>
    </Context.Provider>
  );
}

function ToastComponent({ message, t }: { message: string; t: Toast }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <span
        style={{
          color: "white",
          fontFamily: "Roboto Slab",
          fontSize: "14px",
          marginRight: "30px",
        }}
      >
        {message}
      </span>
      <button
        style={{
          color: "white",
          backgroundColor: "transparent",
          border: "none",
          outline: "none",
          marginLeft: "18px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={() => toast.dismiss(t.id)}
      >
        {<CloseIcon sx={{ fontSize: "17px" }} />}
      </button>
    </div>
  );
}
