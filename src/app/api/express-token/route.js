import { headers } from "next/headers";
import jwt from "jsonwebtoken";
import { auth } from "@/app/lib/auth";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const secret = process.env.BETTER_AUTH_SECRET;

  if (!secret) {
    return Response.json({ message: "Server misconfiguration" }, { status: 500 });
  }

  const token = jwt.sign(
    {
      sub: session.user.id,
      email: session.user.email,
      role: session.user.role || "patient",
    },
    secret,
    { expiresIn: "24h" }
  );

  return Response.json({ token });
}
