// FILE: src/app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("subsense_session")?.value;

  if (!sessionId) {
    return NextResponse.json({ success: true, data: { authenticated: false, user: null } });
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", sessionId);

  if (error || !data || data.length === 0) {
    return NextResponse.json({ success: true, data: { authenticated: false, user: null } });
  }

  return NextResponse.json({
    success: true,
    data: {
      authenticated: true,
      user: {
        id: data[0].id,
        email: data[0].email,
        name: data[0].name,
        google_connected: !!data[0].google_access_token
      }
    }
  });
}
