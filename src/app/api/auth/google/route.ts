import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/auth/callback";

  // Check if OAuth is configured
  if (!clientId) {
    console.warn("GOOGLE_CLIENT_ID is missing. Redirecting to Sandbox Demo login callback.");
    // Bypass to Callback with mock code
    return NextResponse.redirect(`${redirectUri}?code=mock-google-authorization-code-sandbox`);
  }

  // Request Profile + Read-only Gmail scopes
  const scopes = [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/gmail.readonly"
  ];

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` + 
    `client_id=${encodeURIComponent(clientId)}` + 
    `&redirect_uri=${encodeURIComponent(redirectUri)}` + 
    `&response_type=code` + 
    `&scope=${encodeURIComponent(scopes.join(" "))}` + 
    `&access_type=offline` + 
    `&prompt=consent`;

  return NextResponse.redirect(googleAuthUrl);
}
