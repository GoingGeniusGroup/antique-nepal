import { Button } from "@/components/ui/button";
import { ShoppingBag, Award, Leaf, Users, ArrowRight } from "lucide-react";
import heroImage from "@/public/assets/hero-mountains.jpg";
import { Badge } from "@/components/ui/badge";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-8 animate-fade-in">
            <Badge
              variant="secondary"
              className="px-6 py-2 text-sm font-medium bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 backdrop-blur-sm"
            >
              🌿 100% Sustainable • Handcrafted in Nepal • Est. 2010
            </Badge>
          </div>

          {/* Main Content */}
          <div
            className="text-center animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold mb-6 text-primary-foreground leading-tight">
              Antique Nepal
            </h1>

            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-primary-foreground to-transparent mx-auto mb-8" />

            <p className="text-2xl md:text-3xl mb-6 text-primary-foreground font-light leading-relaxed">
              Handcrafted Hemp Bags Woven with Himalayan Heritage
            </p>

            <p className="text-base md:text-lg mb-12 text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
              Every bag tells a story. Crafted by master artisans using
              centuries-old techniques, sustainable hemp, and adorned with
              traditional Nepali paper art. Experience the perfect blend of
              ancient wisdom and modern design.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button
                size="lg"
                className="text-lg px-10 py-7 shadow-2xl hover:scale-105 transition-transform bg-primary hover:bg-primary/90"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Explore Collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-10 py-7 bg-primary-foreground/5 hover:bg-primary-foreground/15 text-primary-foreground border-primary-foreground/30 backdrop-blur-md hover:scale-105 transition-transform"
              >
                Discover Our Story
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="flex flex-col items-center gap-3 p-6 rounded-lg bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10">
                <div className="w-12 h-12 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-primary-foreground text-lg">
                    100% Eco-Friendly
                  </p>
                  <p className="text-sm text-primary-foreground/70">
                    Sustainable hemp fiber
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3 p-6 rounded-lg bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10">
                <div className="w-12 h-12 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-primary-foreground text-lg">
                    Fair Trade
                  </p>
                  <p className="text-sm text-primary-foreground/70">
                    Supporting local artisans
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3 p-6 rounded-lg bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10">
                <div className="w-12 h-12 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                  <Award className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-primary-foreground text-lg">
                    Quality Crafted
                  </p>
                  <p className="text-sm text-primary-foreground/70">
                    15+ years tradition
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary-foreground/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-primary-foreground/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};
