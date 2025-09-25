import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PricingSectionProps {
  properties: number;
  hoursPerMonth: number;
  hourlyRate: number;
}

export default function PricingSection({
  properties,
  hoursPerMonth,
  hourlyRate,
}: PricingSectionProps) {
  // Calculate savings for different scenarios
  const calculateSavings = (numProperties: number) => {
    const timeSavedPerProperty = hoursPerMonth * 0.8; // 80% automation
    const totalTimeSaved = timeSavedPerProperty * numProperties;
    const monthlyTimeSaved = totalTimeSaved;
    const monthlyValueSaved = monthlyTimeSaved * hourlyRate;
    return {
      timeSaved: Math.round(monthlyTimeSaved),
      valueSaved: Math.round(monthlyValueSaved),
    };
  };

  // Savings for Solo (always 1 property) and Small Portfolio (actual properties)
  const soloSavings = calculateSavings(1);
  const portfolioSavings = calculateSavings(properties);

  // Small Portfolio pricing calculation
  const smallPortfolioPrice = properties > 1 ? 39 + (properties - 1) * 29 : 39;

  // Format currency
  const fmt = (n: number) =>
    `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  // Check if Solo plan should be disabled
  const isSoloDisabled = properties > 1;
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900" id="pricing">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the plan that fits your portfolio size. No hidden fees,
            cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Solo Host Plan */}
          <Card className={`relative ${isSoloDisabled ? "opacity-60" : ""}`}>
            {isSoloDisabled && (
              <div className="absolute inset-0 bg-gray-500/10 rounded-lg flex items-center justify-center z-10">
                <div className="bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-sm font-medium text-gray-600 dark:text-gray-400 shadow-lg">
                  Plan is unavailable for more than 1 property
                </div>
              </div>
            )}
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Solo Host</CardTitle>
              <CardDescription>Perfect for individual hosts</CardDescription>
              <div className="pt-4">
                <span className="text-4xl font-bold">$39</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              {/* Savings Display */}
              <div className="mt-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="text-sm text-green-700 dark:text-green-300 font-medium">
                  Your Estimated Savings
                </div>
                <div className="text-lg font-bold text-green-700 dark:text-green-300">
                  {fmt(soloSavings.valueSaved - 39)}/month
                </div>
                <div className="text-xs text-green-600 dark:text-green-400">
                  {soloSavings.timeSaved} hours saved monthly
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span>Up to 1 property</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span>Unlimited WhatsApp messages</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span>AI response generation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span>Basic analytics</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span>Email support</span>
                </li>
              </ul>
              <Button
                className="w-full"
                variant="outline"
                disabled={isSoloDisabled}
              >
                Start Free Trial
              </Button>
            </CardContent>
          </Card>

          {/* Small Portfolio Plan */}
          <Card className="relative border-blue-500 border-2">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Small Portfolio</CardTitle>
              <CardDescription>For growing property managers</CardDescription>
              <div className="pt-4">
                <span className="text-4xl font-bold">
                  {fmt(smallPortfolioPrice)}
                </span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {properties > 1
                  ? `For ${properties} properties: $39 base + ${
                      properties - 1
                    } additional properties x $29`
                  : "+ $29/month per additional property (first is included!)"}
              </div>
              {/* Savings Display */}
              <div className="mt-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="text-sm text-green-700 dark:text-green-300 font-medium">
                  Your Estimated Savings
                </div>
                <div className="text-lg font-bold text-green-700 dark:text-green-300">
                  {fmt(portfolioSavings.valueSaved - smallPortfolioPrice)}/month
                </div>
                <div className="text-xs text-green-600 dark:text-green-400">
                  {portfolioSavings.timeSaved} hours saved monthly
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span>Up to 20 properties</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span>Everything in Solo Host</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span>Custom AI training</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span>Priority support</span>
                </li>
              </ul>
              <Button className="w-full">Start Free Trial</Button>
            </CardContent>
          </Card>

          {/* Enterprise Plan */}
          <Card className="relative">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Professional</CardTitle>
              <CardDescription>For large property portfolios</CardDescription>
              <div className="pt-4">
                <span className="text-4xl font-bold">Custom pricing</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span>Unlimited properties</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span>Everything in Small Portfolio</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span>Team collaboration</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span>API access</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span>24/7 phone support</span>
                </li>
              </ul>
              <Button className="w-full" variant="outline">
                Contact Sales
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
}
