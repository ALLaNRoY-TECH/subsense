import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/auth/callback";
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  const cookieStore = await cookies();

  if (!code) {
    return NextResponse.redirect(new URL("/?error=missing_code", request.url));
  }

  // Demo Sandbox Mode Check
  if (code.includes("sandbox") || !clientId || !clientSecret) {
    const demoUser = {
      id: "demo-user",
      email: "allan@subsense.ai",
      name: "Allan Carter",
      google_access_token: "mock-demo-access-token",
      google_refresh_token: "mock-demo-refresh-token",
      token_expiry: new Date(Date.now() + 3600 * 1000).toISOString()
    };

    // Upsert into Supabase (mock or real)
    await supabase.from("users").upsert(demoUser);

    // Set Session Cookie
    cookieStore.set("subsense_session", "demo-user", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/"
    });

    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  try {
    // Exchange Auth Code for real Tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code"
      })
    });

    if (!tokenResponse.ok) {
      const errText = await tokenResponse.text();
      console.error("Token exchange failed:", errText);
      return NextResponse.redirect(new URL("/?error=token_exchange_failed", request.url));
    }

    const tokens = await tokenResponse.json();
    
    // Fetch User Profile
    const profileResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`
      }
    });

    if (!profileResponse.ok) {
      console.error("Profile fetching failed");
      return NextResponse.redirect(new URL("/?error=profile_fetch_failed", request.url));
    }

    const profile = await profileResponse.json();

    const expiryTime = new Date(Date.now() + tokens.expires_in * 1000).toISOString();

    const userData = {
      id: profile.id,
      email: profile.email,
      name: profile.name || "",
      google_access_token: tokens.access_token,
      google_refresh_token: tokens.refresh_token || null, // Refresh token is only sent on first consent
      token_expiry: expiryTime
    };

    // Upsert User Profile into Database
    await supabase.from("users").upsert(userData);

    // Set Session Cookie
    cookieStore.set("subsense_session", profile.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/"
    });

    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (error) {
    console.error("OAuth Callback error:", error);
    return NextResponse.redirect(new URL("/?error=server_error", request.url));
  }
}
