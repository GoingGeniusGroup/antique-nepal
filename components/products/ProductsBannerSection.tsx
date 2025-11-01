"use client";

export default function ProductsBannerSection() {
  return (
    <section
      className="relative w-full h-[20vh] md:h-[200px] lg:h-[220px] flex items-center justify-center text-center bg-cover"
      style={{
        backgroundImage: "url('/ProductsSectionBanner.png')",
        backgroundPosition: "center 25%",
      }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 text-white px-4">
        <h2 className="text-3xl md:text-5xl font-semibold mb-3 font-cinzel">
          {" "}
          Our Hemp Collection{" "}
        </h2>
        <p className="text-sm md:text-lg max-w-2xl mx-auto font-inter">
          {" "}
          Discover handcrafted accessories made from sustainable hemp fiber by
          skilled artisans in the Himalayan foothills.{" "}
        </p>
      </div>
    </section>
  );
}
