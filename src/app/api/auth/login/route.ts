import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message:
        "This route is no longer used. Login is handled on the client with Supabase Auth.",
    },
    { status: 200 }
  );
}