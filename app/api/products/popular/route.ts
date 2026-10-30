import { NextResponse } from "next/server";
import { getPopularProduct } from "@/lib/get-featured-products";

export async function GET() {
  try {
    const topProduct = await getPopularProduct();
    if (topProduct) {
      return NextResponse.json(topProduct);
    }
    return NextResponse.json(null);
  } catch (error) {
    console.error("[GET_POPULAR_PRODUCTS_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}