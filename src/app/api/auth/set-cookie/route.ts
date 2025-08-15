import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { token } = await request.json();

  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  const response = NextResponse.json({ message: "Token saved successfully" });

  response.cookies.set("token", token, {
    expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "strict",
  });

  return response;
}
export async function DELETE() {
  const response = NextResponse.json({ message: "Logout successfully" });
  response.cookies.delete("token");
  return response;
}
