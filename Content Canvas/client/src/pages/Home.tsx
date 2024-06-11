import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { url } from "../baseUrl";
import Post from "../components/Post";
import SuggestionBar from "../components/SuggestionBar";
import Topics from "../components/Topics";
import TopPicks from "../components/TopPicks";
import WhoToFollow from "../components/WhoToFollow";
import { useAuth } from "../contexts/Auth";
import { httpRequest } from "../interceptor/axiosInterceptor";
import UnAuthHome from "./UnAuthHome";

export default function Home() {
  const { tag } = useParams();
  const { isAuthenticated } = useAuth();
  return !isAuthenticated && !tag ? (
    <UnAuthHome />
  ) : (
    <HomeContainer tag={tag as string} />
  );
}

function HomeContainer({ tag }: { tag: string }) {
  const { isAuthenticated } = useAuth();
  const [posts, setposts] = useState<Array<any>>([]);
  document.title = "Content Canvas";
  useQuery({
    queryFn: () => httpRequest.get(`${url}/post/home`),
    queryKey: ["home", "no"],
    enabled: tag == undefined,
    onSuccess: (data) => {
      setposts(data.data);
    },
  });
  useQuery({
    queryFn: () =>
      httpRequest.get(
        `${url}/post/${tag === "Following" ? "users" : "topic"}/${tag}`
      ),
    queryKey: ["home", "topic", tag],
    enabled: tag != undefined,
    onSuccess: (data) => {
      setposts(data.data);
    },
  });

  function filterPost(postId: string) {
    setposts((prev) => prev.filter((item) => item.post._id !== postId));
  }

  function filterAuthorPost(userId: string) {
    setposts((prev) => prev.filter((item) => item.user._id !== userId));
  }
  return (
    <div
      className="container"
      style={{ display: "flex", flexDirection: "row" }}
    >
      <div
        className="postsList"
        style={{
          borderRight: "solid 1px rgba(242, 242, 242, 1)",
          width: "69%",
          paddingTop: "3vh",
          minHeight: "97vh",
          display: "flex",
          flexDirection: "column",
          gap: "38px",
          marginRight: "auto",
        }}
      >
        {isAuthenticated && <SuggestionBar activeTab={tag ?? "For you"} />}
        <div
          className="inner_container_main"
          style={{
            width: "90%",
            marginRight: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "30px",
            marginTop: !isAuthenticated ? "22px" : 0,
          }}
        >
          {posts.map((item) => {
            return (
              <Post
                showUserList={true}
                filterPost={filterPost}
                filterAuthorPost={filterAuthorPost}
                postId={item.post._id}
                timestamp={item.post.createdAt}
                title={item.post.title}
                username={item.user.name}
                userId={item.user._id}
                image={item.post.image}
                tag={item.post.tags.at(0)}
                userImage={item.user.avatar}
                key={item.post._id}
                summary={item.post.summary}
              />
            );
          })}
        </div>
      </div>
      <div
        className="rightbar"
        style={{
          width: "31%",
          paddingTop: "3vh",
          display: "flex",
          flexDirection: "column",
          gap: "38px",
        }}
      >
        {isAuthenticated && <TopPicks text="Top Picks" />}
        <Topics />
        {isAuthenticated && <WhoToFollow />}
      </div>
    </div>
  );
}
