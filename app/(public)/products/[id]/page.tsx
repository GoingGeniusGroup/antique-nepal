// "use client";
// import { useState } from "react";
// import { useParams } from "next/navigation";
// import Link from "next/link";
// import {
//   Star,
//   Heart,
//   Share2,
//   ShoppingCart,
//   ChevronLeft,
//   Check,
//   Truck,
//   RotateCcw,
//   Shield,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// import hempBag1 from "@/public/hemp-bag-1 1.png";
// import hempBag2 from "@/public/hemp-bag-2 1.png";
// import hempBag3 from "@/public/hemp-bag-3 1.png";
// import paperTexture from "@/public/paper-texture.jpg";
// import Image from "next/image";
// import { useTheme } from "@/contexts/theme-context";
// import { cn } from "@/lib/utils";
// import toast from "react-hot-toast";

// //mock data
// const productData = {
//   id: 1,
//   name: "Traditional Hemp Tote Bag",
//   category: "Bags",
//   price: 3499,
//   originalPrice: 4999,
//   images: [hempBag1, hempBag2, hempBag3],
//   rating: 4.8,
//   reviews: 127,
//   badge: "Bestseller",
//   inStock: true,
//   description:
//     "Experience the perfect blend of tradition and functionality with our Traditional Hemp Tote Bag. Handwoven by skilled Nepali artisans using 100% organic hemp fiber, this bag represents generations of craftsmanship passed down through time.",
//   features: [
//     "100% organic hemp fiber",
//     "Handwoven by Nepali artisans",
//     "Eco-friendly and sustainable",
//     "Durable and long-lasting",
//     "Unique traditional patterns",
//     "Spacious interior with pockets",
//   ],
//   specifications: {
//     Material: "100% Organic Hemp",
//     Dimensions: '16" x 14" x 5"',
//     Weight: "350g",
//     Color: "Natural Beige",
//     Origin: "Handmade in Nepal",
//     "Care Instructions": "Hand wash cold, air dry",
//   },
//   customerReviews: [
//     {
//       id: 1,
//       author: "Priya S.",
//       rating: 5,
//       date: "2 weeks ago",
//       comment:
//         "Absolutely love this bag! The quality is exceptional and the craftsmanship is evident in every detail.",
//     },
//     {
//       id: 2,
//       author: "Rajesh K.",
//       rating: 5,
//       date: "1 month ago",
//       comment:
//         "Perfect size for daily use. The hemp material is surprisingly durable and gets better with age.",
//     },
//     {
//       id: 3,
//       author: "Anjali M.",
//       rating: 4,
//       date: "2 months ago",
//       comment:
//         "Beautiful bag with authentic Nepali design. Great for shopping or as a beach bag.",
//     },
//   ],
// };

// const ProductDetail = () => {
//   const { id } = useParams(); // paxi use garna lai
//   console.log(id);
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [quantity, setQuantity] = useState(1);
//   const [isWishlisted, setIsWishlisted] = useState(false);
//   const { theme, isReady } = useTheme();
//   const isDark = isReady && theme === "dark";

//   const product = productData;

//   const handleShare = async () => {
//     const shareData = {
//       title: product.name,
//       text: "Check out this amazing product from HempCraft!",
//       url: typeof window !== "undefined" ? window.location.href : "",
//     };

//     try {
//       // browser supports native share (mobile devices)
//       if (navigator.share) {
//         await navigator.share(shareData);
//         toast.success("Shared successfully!");
//       } else {
//         // fallaback for desktop (copy hunxa clipboard ma)
//         await navigator.clipboard.writeText(shareData.url);
//         toast.success("Link copied to clipboard!");
//       }
//     } catch (error) {
//       console.error("Error sharing:", error);
//       toast.error("Failed to share product.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Breadcrumb */}
//       <div className="border-b border-border">
//         <div className="container mx-auto px-4 py-4">
//           <div className="flex items-center gap-2 text-sm text-muted-foreground">
//             <Link
//               href={"/"}
//               className="hover:text-foreground transition-colors"
//             >
//               Home
//             </Link>
//             <span>/</span>
//             <Link
//               href="/products"
//               className="hover:text-foreground transition-colors"
//             >
//               Products
//             </Link>
//             <span>/</span>
//             <span className="text-foreground">{product.name}</span>
//           </div>
//         </div>
//       </div>

//       {/* Product Section */}
//       <section className="py-12">
//         <div className="container mx-auto px-4">
//           <Link
//             href="/products"
//             className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
//           >
//             <ChevronLeft className="h-4 w-4" />
//             Back to Products
//           </Link>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//             {/* Images */}
//             <div className="space-y-4">
//               {/* Main Image */}
//               <Card className="overflow-hidden border-2 relative">
//                 <div
//                   className="absolute inset-0 opacity-[0.03] pointer-events-none z-10"
//                   style={{
//                     backgroundImage: `url(${paperTexture})`,
//                     backgroundSize: "cover",
//                   }}
//                 />
//                 {product.badge && (
//                   <span
//                     className={cn(
//                       "absolute top-4 left-4 z-20 inline-block px-2 py-0.5 text-[10px] md:text-xs font-medium rounded-full",
//                       isDark
//                         ? "bg-emerald-600 text-white"
//                         : "bg-emerald-500/20 text-emerald-700"
//                     )}
//                   >
//                     {product.badge}
//                   </span>
//                 )}
//                 <Image
//                   src={product.images[selectedImage]}
//                   alt={product.name}
//                   className="w-full aspect-square object-cover transition-transform duration-500 cursor-pointer hover:scale-105"
//                 />
//               </Card>

//               {/* Thumbnails */}
//               <div className="grid grid-cols-3 gap-4">
//                 {product.images.map((image, index) => (
//                   <button
//                     key={index}
//                     onClick={() => setSelectedImage(index)}
//                     className={`border-2 rounded-lg overflow-hidden transition-all ${
//                       selectedImage === index
//                         ? "border-primary"
//                         : "border-border hover:border-primary/50"
//                     }`}
//                   >
//                     <Image
//                       src={image}
//                       alt={`${product.name} ${index + 1}`}
//                       className="w-full aspect-square object-cover transition-transform duration-500 cursor-pointer hover:scale-110"
//                     />
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Product Info */}
//             <div className="space-y-6">
//               <div>
//                 <div className="flex items-center gap-2 mb-3">
//                   <Badge variant="outline">{product.category}</Badge>
//                   <div className="flex items-center gap-1">
//                     <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
//                     <span className="font-medium text-orange-400">
//                       {product.rating}
//                     </span>
//                     <span className="text-sm text-muted-foreground">
//                       ({product.reviews} reviews)
//                     </span>
//                   </div>
//                 </div>

//                 <h1 className="font-serif text-4xl font-bold mb-4">
//                   {product.name}
//                 </h1>

//                 <div className="flex items-center gap-3 mb-6">
//                   <span className="text-4xl font-bold text-primary">
//                     ₹{product.price}
//                   </span>
//                   {/* {product.originalPrice && (
//                     <>
//                       <span className="text-xl text-muted-foreground line-through">
//                         ₹{product.originalPrice}
//                       </span>
//                       <Badge variant="destructive">
//                         {Math.round(
//                           ((product.originalPrice - product.price) /
//                             product.originalPrice) *
//                             100
//                         )}
//                         % OFF
//                       </Badge>
//                     </>
//                   )} */}
//                 </div>

//                 <p className="text-muted-foreground leading-relaxed">
//                   {product.description}
//                 </p>
//               </div>

//               <Separator />

//               {/* Features */}
//               {/* <div>
//                 <h3 className="font-semibold mb-3">Key Features</h3>
//                 <ul className="space-y-2">
//                   {product.features.map((feature, index) => (
//                     <li key={index} className="flex items-start gap-2">
//                       <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
//                       <span className="text-sm text-muted-foreground">
//                         {feature}
//                       </span>
//                     </li>
//                   ))}
//                 </ul>
//               </div> */}

//               <Separator />

//               {/* Quantity and Actions */}
//               <div className="space-y-4">
//                 <div className="flex items-center gap-4">
//                   <div className="flex items-center border border-border rounded-md">
//                     <button
//                       onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                       className="px-4 py-2 hover:bg-accent transition-colors"
//                     >
//                       -
//                     </button>
//                     <span className="px-6 py-2 border-x border-border">
//                       {quantity}
//                     </span>
//                     <button
//                       onClick={() => setQuantity(quantity + 1)}
//                       className="px-4 py-2 hover:bg-accent transition-colors"
//                     >
//                       +
//                     </button>
//                   </div>
//                   <Badge
//                     variant={product.inStock ? "default" : "destructive"}
//                     className="px-3 py-1"
//                   >
//                     {product.inStock ? "In Stock" : "Out of Stock"}
//                   </Badge>
//                 </div>

//                 <div className="flex gap-3">
//                   <Button
//                     size="lg"
//                     onClick={() => toast.success("Item added to cart!")}
//                     className="flex-1 text-white bg-green-600 hover:bg-green-700 duration-100 gap-2"
//                   >
//                     <ShoppingCart className="h-5 w-5" />
//                     Add to Cart
//                   </Button>
//                   <Button
//                     size="lg"
//                     variant="outline"
//                     onClick={() => setIsWishlisted(!isWishlisted)}
//                   >
//                     <Heart
//                       className={`h-5 w-5 ${
//                         isWishlisted ? "fill-red-500 text-red-500" : ""
//                       }`}
//                     />
//                   </Button>
//                   <Button size="lg" onClick={handleShare} variant="outline">
//                     <Share2 className="h-5 w-5" />
//                   </Button>
//                 </div>
//               </div>

//               {/* Trust Badges */}
//               <Card>
//                 <CardContent className="p-4">
//                   <div className="grid grid-cols-3 gap-4 text-center">
//                     <div className="space-y-2">
//                       <Truck className="h-6 w-6 mx-auto text-primary" />
//                       <p className="text-xs font-medium">Free Shipping</p>
//                       <p className="text-xs text-muted-foreground">
//                         On orders over ₹999
//                       </p>
//                     </div>
//                     <div className="space-y-2">
//                       <RotateCcw className="h-6 w-6 mx-auto text-primary" />
//                       <p className="text-xs font-medium">Easy Returns</p>
//                       <p className="text-xs text-muted-foreground">
//                         30-day return policy
//                       </p>
//                     </div>
//                     <div className="space-y-2">
//                       <Shield className="h-6 w-6 mx-auto text-primary" />
//                       <p className="text-xs font-medium">Secure Payment</p>
//                       <p className="text-xs text-muted-foreground">
//                         100% secure checkout
//                       </p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>

//           {/* Tabs Section */}
//           <div className="mt-16">
//             <Tabs defaultValue="description" className="w-full">
//               <TabsList className="grid w-full grid-cols-2 max-w-2xl">
//                 <TabsTrigger
//                   className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600"
//                   value="description"
//                 >
//                   Description
//                 </TabsTrigger>
//                 {/* <TabsTrigger
//                   className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600"
//                   value="specifications"
//                 >
//                   Specifications
//                 </TabsTrigger> */}
//                 <TabsTrigger
//                   className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600"
//                   value="reviews"
//                 >
//                   Reviews ({product.customerReviews.length})
//                 </TabsTrigger>
//               </TabsList>

//               <TabsContent value="description" className="mt-8">
//                 <Card>
//                   <CardContent className="p-6 prose prose-sm max-w-none">
//                     <h3 className="font-serif text-2xl font-semibold mb-4">
//                       About This Product
//                     </h3>
//                     <p className="text-muted-foreground leading-relaxed mb-4">
//                       {product.description}
//                     </p>
//                     <p className="text-muted-foreground leading-relaxed">
//                       Each bag is unique, carrying the story of its maker and
//                       the rich cultural heritage of Nepal. By choosing this
//                       product, you&apos;re supporting sustainable practices and
//                       empowering local artisans to preserve their traditional
//                       crafts for future generations.
//                     </p>
//                   </CardContent>
//                 </Card>
//               </TabsContent>

//               {/* <TabsContent value="specifications" className="mt-8">
//                 <Card>
//                   <CardContent className="p-6">
//                     <h3 className="font-serif text-2xl font-semibold mb-6">
//                       Product Specifications
//                     </h3>
//                     <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       {Object.entries(product.specifications).map(
//                         ([key, value]) => (
//                           <div
//                             key={key}
//                             className="flex flex-col gap-1 p-4 border border-border rounded-lg"
//                           >
//                             <dt className="text-sm font-medium text-muted-foreground">
//                               {key}
//                             </dt>
//                             <dd className="text-base font-semibold">{value}</dd>
//                           </div>
//                         )
//                       )}
//                     </dl>
//                   </CardContent>
//                 </Card>
//               </TabsContent> */}

//               <TabsContent value="reviews" className="mt-8">
//                 <Card>
//                   <CardContent className="p-6">
//                     <div className="flex items-center justify-between mb-6">
//                       <h3 className="font-serif text-2xl font-semibold">
//                         Customer Reviews
//                       </h3>
//                       <Button variant="outline">Write a Review</Button>
//                     </div>

//                     <div className="space-y-6">
//                       {product.customerReviews.map((review) => (
//                         <div
//                           key={review.id}
//                           className="border-b pb-6 last:border-b-0"
//                         >
//                           <div className="flex items-center justify-between mb-2">
//                             <div className="flex items-center gap-3">
//                               <div className="flex items-center gap-1">
//                                 {Array.from({ length: 5 }).map((_, i) => (
//                                   <Star
//                                     key={i}
//                                     className={`h-4 w-4 ${
//                                       i < review.rating
//                                         ? "fill-orange-400 text-orange-400"
//                                         : "fill-muted text-muted"
//                                     }`}
//                                   />
//                                 ))}
//                               </div>
//                               <span className="font-semibold">
//                                 {review.author}
//                               </span>
//                             </div>
//                             <span className="text-sm text-muted-foreground">
//                               {review.date}
//                             </span>
//                           </div>
//                           <p className="text-muted-foreground">
//                             {review.comment}
//                           </p>
//                         </div>
//                       ))}
//                     </div>
//                   </CardContent>
//                 </Card>
//               </TabsContent>
//             </Tabs>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default ProductDetail;

import { getProductById } from "../actions/products";
import ProductDetailClient from "./ProductDetailClient";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  console.log("🪵 ProductPage params:", resolvedParams);

  const product = await getProductById(resolvedParams.id);
  // console.log(product);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        Product not found
      </div>
    );
  }

  return <ProductDetailClient product={product} />;
}
