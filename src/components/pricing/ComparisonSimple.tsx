import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, X, Minus, Info } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const features = [
  {
    name: "Real-time tracking",
    free: "✓",
    pro: "✓"
  },
  {
    name: "Categories",
    free: "10",
    pro: "Unlimited"
  },
  {
    name: "Budgets",
    free: "1",
    pro: "Unlimited"
  },
  {
    name: "AI insights per month",
    free: "5",
    pro: "50+",
    tooltip: "AI tips reset monthly."
  },
  {
    name: "Recurring detection & alerts",
    free: "—",
    pro: "✓"
  },
  {
    name: "Multi-currency",
    free: "Viewer",
    pro: "Full (with live FX)"
  },
  {
    name: "CSV import/export",
    free: "✓",
    pro: "✓"
  },
  {
    name: "Receipt attachments",
    free: "—",
    pro: "✓"
  },
  {
    name: "Support",
    free: "Community",
    pro: "Priority email"
  },
  {
    name: "Data retention",
    free: "6 months",
    pro: "24 months"
  }
];

export const ComparisonSimple = () => {
  const [openRows, setOpenRows] = useState<Set<number>>(new Set());

  const toggleRow = (index: number) => {
    const newOpenRows = new Set(openRows);
    if (newOpenRows.has(index)) {
      newOpenRows.delete(index);
    } else {
      newOpenRows.add(index);
    }
    setOpenRows(newOpenRows);
  };

  const renderValue = (value: string) => {
    if (value === "✓") {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (value === "—") {
      return <X className="w-5 h-5 text-gray-400" />;
    } else {
      return <span className="text-sm font-medium">{value}</span>;
    }
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What you get on Pro</h2>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-6 font-semibold text-foreground">Features</th>
                      <th className="text-center p-6 font-semibold text-foreground">Free</th>
                      <th className="text-center p-6 font-semibold text-foreground">Pro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {features.map((feature, index) => (
                      <tr key={index} className="border-b border-border/50">
                        <td className="p-6 font-medium text-foreground">
                          <div className="flex items-center gap-2">
                            {feature.name}
                            {feature.tooltip && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="w-4 h-4 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{feature.tooltip}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                        </td>
                        <td className="p-6 text-center">{renderValue(feature.free)}</td>
                        <td className="p-6 text-center">{renderValue(feature.pro)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Accordion */}
        <div className="lg:hidden">
          <div className="space-y-4">
            {features.map((feature, index) => (
              <Collapsible
                key={index}
                open={openRows.has(index)}
                onOpenChange={() => toggleRow(index)}
              >
                <Card>
                  <CollapsibleTrigger asChild>
                    <CardContent className="p-4 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{feature.name}</span>
                          {feature.tooltip && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="w-4 h-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{feature.tooltip}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                        <Minus className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0 pb-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-sm font-medium text-muted-foreground mb-2">
                            Free
                          </div>
                          <div className="flex justify-center">
                            {renderValue(feature.free)}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium text-muted-foreground mb-2">
                            Pro
                          </div>
                          <div className="flex justify-center">
                            {renderValue(feature.pro)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
