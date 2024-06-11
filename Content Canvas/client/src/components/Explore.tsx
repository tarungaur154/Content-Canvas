import { useQuery } from "@tanstack/react-query";
import { url } from "../baseUrl";
import { httpRequest } from "../interceptor/axiosInterceptor";
import Post from "./Post";
import Topics from "./Topics";

export default function Explore() {
  const { data, isError, isLoading } = useQuery({
    queryFn: () => httpRequest.get(`${url}/post/explore`),
    queryKey: ["explore", "unauth"],
  });

  return (
    <div>
      <div
        className="container_70"
        style={{ display: "flex", flexDirection: "row" }}
      >
        <div
          className="postsList"
          style={{
            width: "58%",
            paddingTop: "3vh",
            minHeight: "97vh",
            display: "flex",
            flexDirection: "column",
            gap: "38px",
            marginRight: "auto",
            marginTop: "30px",
          }}
        >
          <div className="inner_container_main">
            {data?.data?.map((item: any) => {
              return (
                <Post
                  unAuth={true}
                  showUserList={true}
                  filterPost={() => {}}
                  filterAuthorPost={() => {}}
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
            marginTop: "30px",
          }}
        >
          <Topics
            text="Discover more of what matters to you"
            style={{
              backgroundColor: "transparent",
              border: "1px solid gray",
              borderRadius: "6px",
            }}
          />
        </div>
      </div>
    </div>
  );
}
