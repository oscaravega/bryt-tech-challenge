import { NextResponse } from "next/server";
import { getProductByHandle } from "@/lib/shopify/query";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ handle: string }> }
) {
  const { handle } = await ctx.params;

  const product = await getProductByHandle(handle);

  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}
