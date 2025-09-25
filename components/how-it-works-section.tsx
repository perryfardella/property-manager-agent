import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HowItWorksSection() {
  return (
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
                Human property managers typically charge 15-25% of gross rental
                income. Our AI delivers the same service at a fraction of the
                cost.
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
              Our AI understands your property details, house rules, and common
              guest questions.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-purple-600">3</span>
            </div>
            <h3 className="text-xl font-semibold">Automatic Responses</h3>
            <p className="text-muted-foreground">
              Messages are answered instantly with high accuracy. Complex issues
              are escalated to you.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
