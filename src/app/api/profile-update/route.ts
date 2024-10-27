// app/api/profile/route.ts
import { createClient } from "@/utils/supabase/server"; // Adjust the path based on your utils structure
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  try {
    const data = await req.json();

    // Ensure you have user session or the logged-in user info
    const user = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const u_data = user.data.user;
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("email", u_data?.email)
      .single();
    if (existingUser) {
      // If the user already exists, check if the username is taken (excluding their own)
      return NextResponse.json(
        { message: "User already exists" },
        { status: 200 }
      );
    }
    const { error } = await supabase.from("users").insert([
      {
        username: data.username,
        "Full Name": data.name,
        phone: data.phone,
        email: u_data?.email,
      },
    ]);

    if (error) {
      throw error;
    }

    return NextResponse.json(
      { message: "Profile data saved successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
