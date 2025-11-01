"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQ = () => {
  const faqs = [
    {
      question: "What makes your hemp bags special?",
      answer:
        "Our hemp bags are handcrafted by skilled Nepali artisans using 100% organic hemp fiber sourced from the Himalayan region. Each bag is woven using traditional techniques passed down through generations, featuring authentic Nepali paper accents and natural dyes. Every piece is unique and tells a story of heritage and sustainability.",
    },
    {
      question: "How long does shipping take?",
      answer:
        "Domestic orders typically arrive within 3-5 business days. International shipping takes 7-14 business days depending on your location. All orders are carefully packaged using eco-friendly materials. You'll receive a tracking number once your order ships.",
    },
    {
      question: "Are the bags durable and water-resistant?",
      answer:
        "Absolutely! Hemp is naturally one of the strongest natural fibers, making our bags incredibly durable. They're naturally water-resistant and become stronger with age. With proper care, your Antique Nepal bag will last for many years while developing a beautiful, unique patina.",
    },
    {
      question: "How should I care for my hemp bag?",
      answer:
        "Hemp bags require minimal maintenance. Spot clean with a damp cloth and mild soap when needed. Air dry away from direct sunlight. Avoid machine washing. The natural hemp fiber will soften over time while maintaining its strength and durability.",
    },
    {
      question: "Do you support fair trade practices?",
      answer:
        "Yes, we're committed to fair trade and ethical production. We work directly with artisan communities in Nepal, ensuring fair wages, safe working conditions, and supporting traditional craftsmanship. Your purchase directly empowers local families and preserves cultural heritage.",
    },
    {
      question: "Can I customize or request specific designs?",
      answer:
        "We offer custom orders for bulk purchases and special occasions. Contact us at custom@antiquenepal.com with your requirements. Please note that custom orders require 3-4 weeks for production as each piece is handcrafted to order.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer a 30-day satisfaction guarantee. If you're not completely satisfied with your purchase, you can return it for a full refund or exchange. The bag must be in unused condition with original tags. Return shipping costs are covered for defective items.",
    },
    {
      question: "Are the bags eco-friendly?",
      answer:
        "Yes! Hemp is one of the most sustainable crops on Earth, requiring minimal water, no pesticides, and enriching the soil. Our bags are 100% biodegradable, use natural dyes, and are packaged in recycled materials. Choosing hemp helps reduce plastic waste and supports sustainable fashion.",
    },
  ];

  return (
    <section className="py-20 bg-gradient-paper">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-12 animate-fade-in">
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ fontFamily: "Cinzel, serif" }}
            >
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-lg">
              Everything you need to know about our handcrafted hemp bags
            </p>
          </div>

          {/* Accordion */}
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-border/50"
              >
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-semibold font-inter text-foreground">
                    {faq.question}
                  </span>
                </AccordionTrigger>

                {/* Smoothly animated content */}
                <AccordionContent
                  className="overflow-hidden text-muted-foreground font-inter leading-relaxed
                   data-[state=open]:animate-accordion-down
                   data-[state=closed]:animate-accordion-up"
                >
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Contact Info */}
          <div className="mt-12 text-center p-6 bg-card rounded-lg border border-border/50">
            <p className="text-muted-foreground mb-4">
              Still have questions? We're here to help!
            </p>
            <a
              href="mailto:support@antiquenepal.com"
              className="text-primary font-semibold hover:underline"
            >
              support@antiquenepal.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
