import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "Do I need a card to start?",
    answer: "No—Free plan requires no card. Pro trial may require a card depending on region."
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes. You'll keep access until the end of your current period."
  },
  {
    question: "How do yearly discounts work?",
    answer: "20% off the equivalent monthly total, billed annually."
  },
  {
    question: "Is bank sync required?",
    answer: "No. Manual entry and CSV import work great. Bank sync is optional."
  },
  {
    question: "Is my data secure?",
    answer: "Yes—AES-256 at rest, TLS in transit, and regular reviews."
  },
  {
    question: "Can I export my data?",
    answer: "Anytime—CSV/PDF exports are available."
  }
];

export const PricingFAQ = () => {
  const [openFaqs, setOpenFaqs] = useState<Set<number>>(new Set());

  const toggleFaq = (index: number) => {
    const newOpenFaqs = new Set(openFaqs);
    if (newOpenFaqs.has(index)) {
      newOpenFaqs.delete(index);
    } else {
      newOpenFaqs.add(index);
    }
    setOpenFaqs(newOpenFaqs);
  };

  return (
    <section className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">FAQs</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="border-border/50">
              <CardContent className="p-0">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                  aria-expanded={openFaqs.has(index)}
                >
                  <h3 className="font-semibold text-foreground pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    {openFaqs.has(index) ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </button>
                {openFaqs.has(index) && (
                  <div className="px-6 pb-6">
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
