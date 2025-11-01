"use client"; // Required if this component uses client-side animation

export const Stats = () => {
  const stats = [
    { value: "200+", label: "Artisan Families" },
    { value: "15", label: "Years of Heritage" },
    { value: "10K+", label: "Happy Customers" },
    { value: "100%", label: "Natural Materials" },
  ];

  return (
    <section
      className="py-20  text-primary-foreground"
      style={{ background: "var(--gradient-mountain)" }}
    >
      <div className="container px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className="text-5xl md:text-6xl font-bold mb-2"
                style={{ fontFamily: "Cinzel, serif" }}
              >
                {stat.value}
              </div>
              <div className="text-lg text-primary-foreground/80">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
