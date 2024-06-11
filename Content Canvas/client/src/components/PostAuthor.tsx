import {
  copyurlIcon,
  facebookIcon,
  linkedinIcon,
  moreIcon,
  savePost,
  twitterIcon,
} from "../assets/icons";
import ReactTimeAgo from "react-time-ago";
import { Link, useNavigate } from "react-router-dom";
import useShare from "../hooks/useShare";
import useClipboard from "../hooks/useClipboard";
import PostMenu from "./PostMenu";

type PostAuthorProps = {
  postId: string;
  username: string;
  avatar: string;
  timestamp: string;
  userId: string;
  title: string;
  postUrl: string;
  anchorEl: any;
  open: boolean;
  ignoreAuthor: () => void;
  handleClose: () => void;
  deletePost(): void;
  editPost(): void;
  handleClick(e: any): void;
};

export default function PostAuthor({
  avatar,
  postId,
  timestamp,
  userId,
  username,
  title,
  handleClick,
  postUrl,
  anchorEl,
  deletePost,
  editPost,
  handleClose,
  ignoreAuthor,
  open,
}: PostAuthorProps) {
  const { socialShare } = useShare();
  const [_, copy] = useClipboard();

  return (
    <div
      className="author_details"
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "22px",
        marginTop: "18px",
      }}
    >
      <div
        className="author_post_details"
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <Link to={`/user/${userId}`}>
          <img
            style={{ width: "50px", borderRadius: "50%" }}
            src={avatar}
            alt=""
          />
        </Link>
        <div
          className="details-sameline"
          style={{
            marginLeft: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <Link
            style={{ color: "inherit", textDecoration: "none" }}
            to={`/user/${userId}`}
          >
            {username}
          </Link>
          <div
            className="sameline"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "18px",
            }}
          >
            <p style={{ fontSize: "13px", color: "gray" }}>
              <ReactTimeAgo
                date={Date.parse(timestamp)}
                locale="en-US"
                timeStyle="round"
              />
            </p>
            <p style={{ fontSize: "13px", color: "gray" }}>3 min read</p>
          </div>
        </div>
      </div>
      <div
        className="shareIcons"
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "25px",
        }}
      >
        <div
          className="oneSide"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span
            onClick={() =>
              socialShare(
                `https://twitter.com/intent/tweet?url=${postUrl}&text=${title}`
              )
            }
            style={iconStyle}
          >
            {twitterIcon}
          </span>
          <span
            onClick={() =>
              socialShare(
                `https://www.facebook.com/sharer/sharer.php?u=${postUrl}`
              )
            }
            style={iconStyle}
          >
            {facebookIcon}
          </span>
          <span
            onClick={() =>
              socialShare(
                `https://www.linkedin.com/shareArticle?mini=true&url=${postUrl}&title=${title}`
              )
            }
            style={iconStyle}
          >
            {linkedinIcon}
          </span>
          <span onClick={() => copy(postUrl, "Link copied")} style={iconStyle}>
            {copyurlIcon}
          </span>
        </div>
        <div
          className="other_side"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span style={iconStyle}>{savePost}</span>
          <span onClick={handleClick} style={iconStyle}>
            {moreIcon}
          </span>
          <PostMenu
            anchorEl={anchorEl}
            deletePost={deletePost}
            open={open}
            handleClose={handleClose}
            editPost={editPost}
            ignoreAuthor={ignoreAuthor}
            userId={userId}
          />
        </div>
      </div>
    </div>
  );
}

const iconStyle = {
  cursor: "pointer",
  color: "gray",
};
