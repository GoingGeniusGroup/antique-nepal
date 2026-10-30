import { NextResponse } from "next/server";
import { getBestSellerProduct } from "@/lib/get-featured-products";

export async function GET() {
  try {
    const productData = await getBestSellerProduct();
    if (productData) {
      return NextResponse.json(productData);
    }
    return NextResponse.json(null);
  } catch (error) {
    console.error("[GET_BEST_SELLER_PRODUCT_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}