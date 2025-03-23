import { Box } from "@mui/material";
import React from "react";
import Navbar from "../navbar";
import UserWidget from "../widgets/UserWidget";
import MyPostWidget from "../widgets/MyPostWidget";
import PostsWidget from "../widgets/PostsWidget";
import GeminiAssistant from "../../components/GeminiAssistant"; // ✅ Import GeminiAssistant
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { useMediaQuery } from "@mui/material";

const HomePage: React.FC = () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const user = useSelector((state: RootState) => state.auth.user);
  const _id = user?._id;
  const picturePath = user?.picturePath;

  console.log(
    "HomePage - Redux User State:",
    useSelector((state: RootState) => state)
  );

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        {/* Left column - User Info */}
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={_id || ""} picturePath={picturePath || ""} />
        </Box>

        {/* Middle column - Post creation and posts feed */}
        <Box
          flexBasis={isNonMobileScreens ? "42%" : "100%"}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          {user && (
            <>
              <MyPostWidget picturePath={picturePath || ""} />
              <PostsWidget userId={_id || ""} />
            </>
          )}
        </Box>

        {/* Right column - Gemini Assistant */}
        {isNonMobileScreens && (
          <Box flexBasis="26%">
            <GeminiAssistant /> {/* ✅ Add GeminiAssistant here */}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;