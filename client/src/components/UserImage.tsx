import { useState, useEffect } from "react";

interface UserImageProps {
  image?: string;
  size?: string;
}

const UserImage = ({ image = "", size = "60px" }: UserImageProps) => {
  const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5001";

  // Don't include any path — assume image is the filename like "abc123.jpeg"
  const imageName = image.split("/").pop() || "default-profile.png";

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
      style={{ borderRadius: "50%", objectFit: "cover" }}
      onError={() => {
        console.warn("🛑 UserImage - Failed to load:", imgSrc, "→ Using fallback.");
        setImgSrc("/assets/default-profile.png");
      }}
    />
  );
};

export default UserImage;
