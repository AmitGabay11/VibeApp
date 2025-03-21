import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../state";
import PostWidget from "./PostWidget";
import { RootState } from "../../state/store";
import { AppDispatch } from "../../state/store";

// Define the PostType interface
interface PostType {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  description: string;
  location: string;
  picturePath: string;
  userPicturePath: string;
  likes: Record<string, boolean>;
  comments: string[];
}

interface Props {
  userId: string;
  isProfile?: boolean;
}

const PostsWidget: React.FC<Props> = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.token);
  const posts = useSelector((state: RootState) => state.auth.posts);

  const getPosts = async () => {
    console.log("📡 Fetching all posts...");
    const response = await fetch("http://localhost:5001/posts", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data: PostType[] = await response.json();
    console.log("📨 Posts fetched (global):", data);
    dispatch(setPosts({ posts: data }));
  };

  const getUserPosts = async () => {
    console.log("📡 Fetching user posts for:", userId);
    const response = await fetch(`http://localhost:5001/posts/${userId}/posts`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data: PostType[] = await response.json();
    console.log("📨 Posts fetched (user):", data);
    dispatch(setPosts({ posts: data }));
  };

  useEffect(() => {
    console.log("🧩 PostsWidget mounted");
    console.log("🔍 userId:", userId);
    console.log("🔍 isProfile:", isProfile);
    isProfile ? getUserPosts() : getPosts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    console.log("🧾 Redux posts state updated:", posts);
  }, [posts]);

  if (!posts || posts.length === 0) {
    return (
      <p style={{ color: "gray", textAlign: "center" }}>
        No posts to display.
      </p>
    );
  }

  return (
    <>
      {posts.map((post: PostType) => (
        <PostWidget
          key={post._id}
          postId={post._id}
          postUserId={post.userId}
          name={`${post.firstName} ${post.lastName}`}
          description={post.description}
          location={post.location}
          picturePath={post.picturePath}
          userPicturePath={post.userPicturePath}
          likes={post.likes}
          comments={post.comments}
        />
      ))}
    </>
  );
};

export default PostsWidget;
