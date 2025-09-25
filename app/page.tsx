import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import HostAgentRoiCalculator from "@/components/roi-calculator";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                Save{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  $250-$510
                </span>{" "}
                per property monthly with AI
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto">
                Replace expensive property managers and automate WhatsApp guest
                messaging for short-term rentals. Reclaim 10-15 hours per
                property each month.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/sign-up">
                <Button size="lg" className="text-lg px-8 py-6">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="#calculator">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-6"
                >
                  Calculate Your Savings
                </Button>
              </Link>
            </div>

            <div className="pt-8">
              <p className="text-sm text-muted-foreground mb-4">
                Trusted by property managers across the globe
              </p>
              <div className="flex items-center justify-center space-x-8 opacity-60">
                <div className="text-2xl font-bold">Airbnb</div>
                <div className="text-2xl font-bold">VRBO</div>
                <div className="text-2xl font-bold">Booking.com</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Benefit Focused Stats */}
      <section className="py-20 bg-white dark:bg-gray-800" id="how-it-works">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold">See How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our AI handles guest messages instantly, saving you time and money
              while improving guest satisfaction.
            </p>
          </div>

          {/* Benefit-focused statistics */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-4xl font-bold text-green-600">
                  10-15hrs
                </CardTitle>
                <CardDescription className="text-lg">
                  Time Saved Per Property Monthly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Stop manually answering repetitive guest questions. Our AI
                  handles check-in instructions, WiFi passwords, local
                  recommendations, and more.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-4xl font-bold text-blue-600">
                  $250-$510
                </CardTitle>
                <CardDescription className="text-lg">
                  Monthly Savings vs Property Manager
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Human property managers typically charge 15-25% of gross
                  rental income. Our AI delivers the same service at a fraction
                  of the cost.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-4xl font-bold text-purple-600">
                  &lt;5min
                </CardTitle>
                <CardDescription className="text-lg">
                  Average Response Time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Instant responses lead to better guest satisfaction and 3-8%
                  increase in booking conversions from faster follow-up to
                  inquiries.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Process Steps */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold">Connect WhatsApp</h3>
              <p className="text-muted-foreground">
                Link your WhatsApp Business account and set up your properties
                with key information.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold">AI Learns Your Property</h3>
              <p className="text-muted-foreground">
                Our AI understands your property details, house rules, and
                common guest questions.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold">Automatic Responses</h3>
              <p className="text-muted-foreground">
                Messages are answered instantly with high accuracy. Complex
                issues are escalated to you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900" id="features">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Powerful Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to automate guest communication and grow your
              short-term rental business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>🤖</span>
                  <span>Smart AI Responses</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Advanced AI that understands context and provides accurate,
                  helpful responses based on your property information and guest
                  history.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>📱</span>
                  <span>WhatsApp Integration</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Seamless integration with WhatsApp Business API. Guests
                  continue using their preferred messaging platform.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>🏠</span>
                  <span>Multi-Property Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Manage multiple properties from a single dashboard. Each
                  property has its own AI assistant with specific information.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>⚡</span>
                  <span>Instant Escalation</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Complex or sensitive issues are immediately escalated to you
                  with full context and suggested responses.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>📊</span>
                  <span>Analytics & Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Track response times, common questions, and guest satisfaction
                  to optimize your property operations.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>🔒</span>
                  <span>Secure & Compliant</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Enterprise-grade security with GDPR compliance. Your guest
                  data is encrypted and handled with the highest standards.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <HostAgentRoiCalculator />
      </section>

      {/* Pricing Section */}
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
            {/* Starter Plan */}
            <Card className="relative">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Solo Host</CardTitle>
                <CardDescription>Perfect for individual hosts</CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-bold">$79</span>
                  <span className="text-muted-foreground">/property/month</span>
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
                <Button className="w-full" variant="outline">
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>

            {/* Professional Plan */}
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
                  <span className="text-4xl font-bold">$89</span>
                  <span className="text-muted-foreground">/property/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <span className="text-green-600">✓</span>
                    <span>Up to 10 properties</span>
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
                  <span className="text-4xl font-bold">$79</span>
                  <span className="text-muted-foreground">/property/month</span>
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

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Ready to Transform Your Property Management?
            </h2>
            <p className="text-xl opacity-90">
              Join hundreds of property managers who save hours daily and
              thousands monthly with Host Agent's AI-powered WhatsApp
              automation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/sign-up">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-lg px-8 py-6"
                >
                  Start Your Free Trial
                </Button>
              </Link>
              <Link href="#calculator">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-blue-600"
                >
                  Calculate Your ROI
                </Button>
              </Link>
            </div>
            <p className="text-sm opacity-75">
              14-day free trial • No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
