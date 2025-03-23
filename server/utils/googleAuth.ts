
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (token: string) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID, // Ensure this matches your Google Client ID
  });
  return ticket;
};