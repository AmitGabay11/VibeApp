import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  Send,
  EditOutlined,
  DeleteOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
  InputBase,
  Button,
} from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import Friend from "../../components/Friend";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost, deletePost } from "../../state";
import { RootState } from "../../state/store";
import { AppDispatch } from "../../state/store";

interface Props {
  postId: string;
  postUserId: string;
  name: string;
  description: string;
  location: string;
  picturePath: string;
  userPicturePath: string;
  likes: {
    [userId: string]: boolean;
  };
  comments: string[];
}

const PostWidget: React.FC<Props> = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(description);
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.token);
  const loggedInUserId = useSelector(
    (state: RootState) => state.auth.user?._id
  );
  const isLiked = loggedInUserId ? Boolean(likes[loggedInUserId]) : false;
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.text.primary;
  const primary = palette.primary.main;

  const patchLike = async () => {
    const response = await fetch(`http://localhost:5001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const handleEdit = async () => {
    const response = await fetch(`http://localhost:5001/posts/${postId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description: editedDescription }),
    });

    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
    setIsEditing(false);
  };

  const handleDelete = async () => {
    const response = await fetch(`http://localhost:5001/posts/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      dispatch(deletePost({ postId }));
    }
  };

  const submitComment = async () => {
    if (!newComment.trim()) return;

    const response = await fetch(`http://localhost:5001/posts/${postId}/comment`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment: newComment }),
    });

    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
    setNewComment("");
  };

  const isOwner = loggedInUserId === postUserId;

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      {isEditing ? (
        <Box>
          <InputBase
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            fullWidth
            sx={{
              backgroundColor: palette.grey[100],
              borderRadius: "0.5rem",
              padding: "0.5rem",
              marginBottom: "0.5rem",
            }}
          />
          <Button
            onClick={handleEdit}
            sx={{
              color: palette.background.paper,
              backgroundColor: palette.primary.main,
              borderRadius: "3rem",
              marginRight: "0.5rem",
            }}
          >
            Save
          </Button>
          <Button
            onClick={() => setIsEditing(false)}
            sx={{
              color: palette.background.paper,
              backgroundColor: palette.grey[500],
              borderRadius: "3rem",
            }}
          >
            Cancel
          </Button>
        </Box>
      ) : (
        <Typography color={main} sx={{ mt: "1rem" }}>
          {description}
        </Typography>
      )}
      {picturePath && (
        <img
          width="100%"
          alt="post"
          style={{
            borderRadius: "0.75rem",
            marginTop: "0.75rem",
            maxHeight: "500px",
            objectFit: "cover",
          }}
          src={`http://localhost:5001/upload/${picturePath}`}
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            if (!img.dataset.fallback) {
              console.warn("🛑 Post image failed to load. Falling back.");
              img.src = "/assets/default-post.png";
              img.dataset.fallback = "true";
            } else {
              console.error("❌ Fallback image also failed. Giving up.");
            }
          }}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        <FlexBetween gap="0.3rem">
          {isOwner && (
            <>
              <IconButton onClick={() => setIsEditing(true)}>
                <EditOutlined />
              </IconButton>
              <IconButton onClick={handleDelete}>
                <DeleteOutlined />
              </IconButton>
            </>
          )}
          <IconButton>
            <ShareOutlined />
          </IconButton>
        </FlexBetween>
      </FlexBetween>

      {isComments && (
        <Box mt="0.5rem">
          {comments.map((comment, i) => (
            <Box key={`${name}-${i}`}>
              <Divider />
              <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                {comment}
              </Typography>
            </Box>
          ))}
          <Divider sx={{ mb: "0.5rem" }} />

          {/* New comment input */}
          <FlexBetween gap="1rem">
            <InputBase
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              sx={{
                flexGrow: 1,
                backgroundColor: palette.grey[100],
                borderRadius: "2rem",
                padding: "0.5rem 1rem",
              }}
            />
            <IconButton onClick={submitComment} disabled={!newComment.trim()}>
              <Send sx={{ color: primary }} />
            </IconButton>
          </FlexBetween>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;