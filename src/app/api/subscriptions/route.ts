import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";
import { getSubscriptionLogo } from "@/lib/subscription-logos";

// GET: Fetch all user subscriptions
export async function GET() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("subsense_session")?.value;

  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data: { subscriptions: data || [] } });
}

// POST: Add a new custom subscription
export async function POST(request: Request) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("subsense_session")?.value;

  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, price, currency, category, status, billing_frequency } = body;

    if (!name || !price) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const brandAsset = getSubscriptionLogo(name);

    const subItem = {
      user_id: userId,
      name,
      price: parseFloat(price),
      currency: currency || "₹",
      category: category || "Entertainment",
      status: status || "active",
      last_used: "Just added",
      billing_date: "1st of month",
      billing_frequency: billing_frequency || "monthly",
      logo_url: brandAsset.svg
    };

    const { data, error } = await supabase
      .from("subscriptions")
      .insert(subItem);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: { subscription: data ? data[0] : subItem } });
  } catch (error) {
    console.error("Add subscription error:", error);
    return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
  }
}

// DELETE: Delete a subscription
export async function DELETE(request: Request) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("subsense_session")?.value;

  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ success: false, error: "Missing id parameter" }, { status: 400 });
  }

  const { error } = await supabase
    .from("subscriptions")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data: null });
}

// PUT: Update a subscription
export async function PUT(request: Request) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("subsense_session")?.value;

  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status, name, price, category, last_used } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing id parameter" }, { status: 400 });
    }

    const updateFields: Record<string, unknown> = {};
    if (status) updateFields.status = status;
    if (name) {
      updateFields.name = name;
      updateFields.logo_url = getSubscriptionLogo(name).svg;
    }
    if (price) updateFields.price = parseFloat(price);
    if (category) updateFields.category = category;
    if (last_used) updateFields.last_used = last_used;

    const { data, error } = await supabase
      .from("subscriptions")
      .upsert({ id, user_id: userId, ...updateFields });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: { subscription: data ? data[0] : null } });
  } catch (error) {
    console.error("Update subscription error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
