// ✅ EditProfileWidget.tsx
import { useState } from "react";
import { Box, TextField, Button, useTheme, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { setLogin } from "../../state";

const EditProfileWidget = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { user, token } = useSelector((state: RootState) => state.auth);

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [occupation, setOccupation] = useState(user?.occupation || "");
  const [picturePath, setPicturePath] = useState(user?.picturePath || "");

  const cleanPicturePath = picturePath
    .replace("public/assets/", "")
    .replace("/upload/", "")
    .trim();

  const handleSubmit = async () => {
    console.log("2s");
    const response = await fetch(
      `http://localhost:5001/users/update/${user?._id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName,
          lastName,
          occupation,
          picturePath: cleanPicturePath,
        }),
      }
    );

    const updatedUser = await response.json();
    dispatch(setLogin({ user: updatedUser, token: token || "" }));
  };

  return (
    <Box
      p="1rem"
      borderRadius="0.75rem"
      boxShadow={3}
      bgcolor={theme.palette.background.paper}
    >
      <Typography variant="h6" mb="1rem">
        Edit Profile
      </Typography>
      <TextField
        label="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        fullWidth
      />
      <TextField
        label="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        fullWidth
        sx={{ mt: 2 }}
      />
      <TextField
        label="Occupation"
        value={occupation}
        onChange={(e) => setOccupation(e.target.value)}
        fullWidth
        sx={{ mt: 2 }}
      />
      <TextField
        label="Picture Path"
        value={picturePath}
        onChange={(e) => setPicturePath(e.target.value)}
        fullWidth
        sx={{ mt: 2 }}
      />
      <Button variant="contained" sx={{ mt: 3 }} onClick={handleSubmit}>
        Save
      </Button>
    </Box>
  );
};

export default EditProfileWidget;