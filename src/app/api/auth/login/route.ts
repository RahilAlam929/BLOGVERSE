import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );
    }

    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );
    }

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
    });

    const response = NextResponse.json({ message: "Login successful" });
    response.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      { message: "Login failed" },
      { status: 500 }
    );
  }
}