import { Box } from "@mui/material";
import React from "react";
import Navbar from "../navbar";
import UserWidget from "../widgets/UserWidget";
import { useSelector } from "react-redux";
import { RootState } from "../../state";
import { useMediaQuery } from "@mui/material";
import MyPostWidget from "../widgets/MyPostWidget";

const HomePage: React.FC = () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const user = useSelector((state: RootState) => state.auth?.user);
  const _id = user?._id;
  const picturePath = user?.picturePath;

  console.log("HomePage - Redux User State:", useSelector((state: RootState) => state)); // ✅ Debugging Redux state

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
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={_id || ""} picturePath={picturePath || ""} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : "100%"} // ✅ Ensures visibility on all screens
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          {user && <MyPostWidget picturePath={picturePath || ""} />}  {/* ✅ Prevents crash if user is undefined */}
        </Box>
        {isNonMobileScreens && <Box flexBasis="26%" />}
      </Box>
    </Box>
  );
};

export default HomePage;