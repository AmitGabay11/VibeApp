import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { setLogin } from "../state";

const GoogleLoginButton = () => {
  const dispatch = useDispatch();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const res = await fetch("http://localhost:5001/auth/google-login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: response.access_token }),
        });

        const data = await res.json();
        if (res.ok) {
          dispatch(setLogin({ user: data.user, token: data.token }));
        } else {
          console.error("Google login failed:", data.message);
        }
      } catch (err) {
        console.error("Error during Google login:", err);
      }
    },
  });

  return (
    <button
      onClick={() => handleGoogleLogin()}
      style={{
        backgroundColor: "#4285F4",
        color: "white",
        border: "none",
        padding: "10px 20px",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px",
      }}
    >
      Login with Google
    </button>
  );
};

export default GoogleLoginButton;