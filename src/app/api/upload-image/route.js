import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

export async function POST(request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.IMGBB_API_KEY;

  if (!apiKey) {
    return Response.json({ message: "Image upload not configured" }, { status: 500 });
  }

  const formData = await request.formData();
  const file = formData.get("image");

  if (!file || typeof file === "string") {
    return Response.json({ message: "No image file provided" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");

  const imgbbBody = new FormData();
  imgbbBody.append("image", base64);

  const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: imgbbBody,
  });

  const imgbbData = await imgbbRes.json();

  if (!imgbbRes.ok || !imgbbData?.data?.url) {
    return Response.json(
      { message: imgbbData?.error?.message || "Image upload failed" },
      { status: 500 }
    );
  }

  return Response.json({ url: imgbbData.data.url });
}
