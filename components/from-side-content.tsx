"use client";

const SideContent = () => {
  return (
    <div>
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30 dark:bg-black/50"></div>
      <div className="relative z-10 flex flex-col justify-center p-12 text-white space-y-6 max-w-md">
        <img src="/logo.png" alt="Antique Nepal Logo" className="w-40 mb-4" />
        <h2 className="text-2xl font-semibold leading-relaxed">
          Elevate your style with our exclusive range of handcrafted bags.
        </h2>
        <p className="text-sm text-gray-100">
          Sign in to start your journey with{" "}
          <span className="font-medium">Antique Nepal</span>.
        </p>
      </div>
    </div>
  );
};

export default SideContent;
