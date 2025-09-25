import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
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
              Replace expensive property managers or reclaim your own time and
              automate WhatsApp guest messaging for short-term rentals.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/sign-up">
              <Button size="lg" className="text-lg px-8 py-6">
                Start Free Trial
              </Button>
            </Link>
            <a href="#calculator">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Calculate Your Savings
              </Button>
            </a>
          </div>

          <div className="pt-8">
            <p className="text-sm text-muted-foreground mb-4">
              Trusted by property managers across the globe using
            </p>
            <div className="flex items-center justify-center space-x-8 opacity-60">
              <div className="text-2xl font-bold">Airbnb</div>
              <div className="text-2xl font-bold">Booking.com</div>
              <div className="text-2xl font-bold">VRBO</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
