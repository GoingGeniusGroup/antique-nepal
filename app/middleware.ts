import { auth } from "@/lib/auth";

export default auth((req) => {
  // You can add protected route logic here if needed
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
