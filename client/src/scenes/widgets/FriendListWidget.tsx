import { Box, Typography, useTheme } from "@mui/material";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useEffect, useCallback } from "react"; // Import useCallback from React
import { RootState } from "../../state/store";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "../../state";
import Friend from "../../components/Friend";

const FriendListWidget = ({ userId }: { userId: string }) => {
    const dispatch = useDispatch();
    const token = useSelector((state: RootState) => state.auth.token);
    const friends = useSelector((state: RootState) => state.auth.user?.friends || []);

    const getFriends = useCallback(async () => {
        const response = await fetch(
            `http://localhost:5001/users/${userId}/friends`,
            {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        const data = await response.json();
        dispatch(setFriends(data));
    }, [dispatch, token, userId]);

    useEffect(() => {
        if (userId) {
            getFriends();
        }
    }, [userId, getFriends]); // Run only when userId or getFriends changes
    

    const theme = useTheme();
    const { palette } = theme;

    return (
        <WidgetWrapper>
            <Typography
                color={palette.text.primary}
                variant="h5"
                fontWeight="500"
                sx={{ mb: "1.5rem" }}
            >
                Friend List
            </Typography>

            <Box display="flex" flexDirection="column" gap="1.5rem">
                {friends.map((friend) => (
                    <Friend
                        key={friend._id}
                        friendId={friend._id}
                        name={`${friend.firstName || ""} ${friend.lastName || ""}`}
                        subtitle={friend.occupation || "No occupation"}
                        userPicturePath={friend.picturePath || ""}
                    />
                ))}
            </Box>
        </WidgetWrapper>
    );
};

export default FriendListWidget;

