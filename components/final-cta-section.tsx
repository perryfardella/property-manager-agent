import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FinalCTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl lg:text-4xl font-bold">
            Ready to Transform Your Property Management?
          </h2>
          <p className="text-xl opacity-90">
            Join hundreds of property managers who save hours daily and
            thousands monthly with Host Agent&apos;s AI-powered WhatsApp
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
            <a href="#calculator">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 text-blue-600"
              >
                Calculate Your ROI
              </Button>
            </a>
          </div>
          <p className="text-sm opacity-75">
            14-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}
