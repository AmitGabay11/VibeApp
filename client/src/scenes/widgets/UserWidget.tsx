import {
    ManageAccountsOutlined,
    EditOutlined,
    LocationOnOutlined,
    WorkOutlineOutlined,
    SaveOutlined,
  } from "@mui/icons-material";
  import {
    Box,
    Typography,
    Divider,
    useTheme,
    TextField,
    IconButton,
    Button,
  } from "@mui/material";
  import UserImage from "../../components/UserImage";
  import FlexBetween from "../../components/FlexBetween";
  import WidgetWrapper from "../../components/WidgetWrapper";
  import { useSelector } from "react-redux";
  import { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  
  interface UserWidgetProps {
    userId: string;
    picturePath: string;
  }
  
  const UserWidget = ({ userId, picturePath }: UserWidgetProps) => {
    const [user, setUser] = useState<any>(null);
    const [editMode, setEditMode] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [occupation, setOccupation] = useState("");
    const [newPicture, setNewPicture] = useState<File | null>(null);
  
    const { palette } = useTheme();
    const navigate = useNavigate();
    const token = useSelector((state: { auth: { token: string } }) => state.auth.token);
  
    const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5001";
    const dark = palette.grey[800];
    const medium = palette.grey[500];
    const main = palette.grey[300];
  
    useEffect(() => {
      const getUser = async () => {
        const response = await fetch(`${backendUrl}/users/${userId}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setUser(data);
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setOccupation(data.occupation);
      };
      getUser();
    }, [userId, token, backendUrl]);
  
    const handleSave = async () => {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("occupation", occupation);
      if (newPicture) {
        formData.append("picture", newPicture);
      }
      console.log(firstName,"1111");
      console.log(lastName,"2222");
      console.log(occupation,"3333");
      console.log(newPicture,"5555");
      console.log(userId,"4444");
      const response = await fetch(`${backendUrl}/users/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      const updatedUser = await response.json();
      setUser(updatedUser);
      setEditMode(false);
      setNewPicture(null);
    };
  
    if (!user) return null;
  
    return (
      <WidgetWrapper>
        {/* FIRST ROW */}
        <FlexBetween gap="0.5rem" pb="1.1rem">
          <FlexBetween gap="1rem">
            <UserImage
              image={
                newPicture
                  ? URL.createObjectURL(newPicture)
                  : `${backendUrl}/upload/${user.picturePath}`
              }
            />
            <Box>
              {editMode ? (
                <>
                  <TextField
                    variant="standard"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    sx={{ mb: "0.25rem" }}
                  />
                  <TextField
                    variant="standard"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </>
              ) : (
                <>
                  <Typography
                    variant="h4"
                    color={dark}
                    fontWeight="500"
                    sx={{
                      "&:hover": {
                        color: palette.primary.light,
                        cursor: "pointer",
                      },
                    }}
                    onClick={() => navigate(`/profile/${userId}`)}
                  >
                    {firstName} {lastName}
                  </Typography>
                  <Typography color={medium}>{user.friends?.length ?? 0} friends</Typography>
                </>
              )}
            </Box>
          </FlexBetween>
  
          <Box>
            <input
              type="file"
              accept="image/*"
              hidden
              id="upload-button"
              onChange={(e) => setNewPicture(e.target.files?.[0] || null)}
            />
            {editMode ? (
              <label htmlFor="upload-button">
                <Button variant="text" component="span" size="small">
                  Change Photo
                </Button>
              </label>
            ) : (
              <IconButton onClick={() => setEditMode(true)}>
                <ManageAccountsOutlined />
              </IconButton>
            )}
          </Box>
        </FlexBetween>
  
        <Divider />
  
        {/* SECOND ROW */}
        <Box p="1rem 0">
          <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
            <LocationOnOutlined fontSize="large" sx={{ color: main }} />
            {editMode ? (
              <TextField
                variant="standard"
                value={user.location}
                disabled
                sx={{ flexGrow: 1 }}
              />
            ) : (
              <Typography color={medium}>{user.location}</Typography>
            )}
          </Box>
          <Box display="flex" alignItems="center" gap="1rem">
            <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
            {editMode ? (
              <TextField
                variant="standard"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                sx={{ flexGrow: 1 }}
              />
            ) : (
              <Typography color={medium}>{occupation}</Typography>
            )}
          </Box>
        </Box>
  
        <Divider />
  
        {/* THIRD ROW */}
        <Box p="1rem 0">
          <FlexBetween mb="0.5rem">
            <Typography color={medium}>Who's viewed your profile</Typography>
            <Typography color={main} fontWeight="500">{user.viewedProfile}</Typography>
          </FlexBetween>
          <FlexBetween>
            <Typography color={medium}>Impressions of your post</Typography>
            <Typography color={main} fontWeight="500">{user.impressions}</Typography>
          </FlexBetween>
        </Box>
  
        <Divider />
  
        {/* Save Button */}
        {editMode && (
          <Box textAlign="right">
            <Button
              variant="contained"
              startIcon={<SaveOutlined />}
              sx={{ mt: "1rem", backgroundColor: palette.primary.main }}
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </Box>
        )}
      </WidgetWrapper>
    );
  };
  
  export default UserWidget;
  