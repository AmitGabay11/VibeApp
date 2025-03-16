import { useState, useEffect } from "react";

interface UserImageProps {
  image?: string;
  size?: string;
}

const UserImage = ({ image, size = "60px" }: UserImageProps) => {
  console.log("UserImage - Received image prop:", image);

  // Extract filename from path (e.g., "public/assets/p2.jpeg" → "p2.jpeg")
  const imageName = image ? image.split("/").pop() : "default-profile.png";

  // Ensure backend URL is correct
  const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5001";
  const imgUrl = `${backendUrl}/upload/${imageName}`;

  const [imgSrc, setImgSrc] = useState(imgUrl);

  useEffect(() => {
    setImgSrc(imgUrl);
  }, [imgUrl]);

  return (
    <img
      src={imgSrc}
      alt="User"
      width={size}
      height={size}
      style={{ borderRadius: "50%" }}
      onError={() => {
        console.error("UserImage - Failed to load image, using fallback.");
        setImgSrc("/assets/default-profile.png"); // ✅ Fallback image
      }}
    />
  );
};

export default UserImage;
