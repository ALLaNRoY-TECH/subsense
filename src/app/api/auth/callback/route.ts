import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectUri =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/api/auth/callback"
      : `${process.env.NEXTAUTH_URL}/api/auth/callback`;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

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
    const { error: upsertError } = await supabase.from("users").upsert(demoUser);
    if (upsertError) {
      console.error("Supabase demo user upsert failed:", upsertError);
      return NextResponse.redirect(new URL("/?error=database_error", request.url));
    }
    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    response.cookies.set("subsense_session", demoUser.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/"
    });

    return response;
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

    console.log("OAuth token exchange success");
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
    console.log("Google profile fetch success:", profile.email);

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
    const { error: upsertError } = await supabase.from("users").upsert(userData);
    if (upsertError) {
      console.error("Supabase user upsert failed:", upsertError);
      return NextResponse.redirect(new URL("/?error=database_error", request.url));
    }
    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    response.cookies.set("subsense_session", profile.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/"
    });

    return response;
  } catch (error) {
    console.error("OAuth Callback error:", error);
    return NextResponse.redirect(new URL("/?error=server_error", request.url));
  }
}
