import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Property Manager Agent",
  description:
    "Privacy Policy for Property Manager Agent - AI-powered WhatsApp Business autoresponder for short-term rental properties",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Privacy Policy
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Introduction
              </h2>
              <p className="text-gray-700 mb-4">
                Property Manager Agent (&quot;we,&quot; &quot;our,&quot; or
                &quot;us&quot;) is committed to protecting your privacy. This
                Privacy Policy explains how we collect, use, disclose, and
                safeguard your information when you use our AI-powered WhatsApp
                Business autoresponder service for short-term rental properties.
              </p>
              <p className="text-gray-700 mb-4">
                By using our service, you consent to the data practices
                described in this policy. If you do not agree with the terms of
                this Privacy Policy, please do not access or use our service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Information We Collect
              </h2>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                2.1 Personal Information
              </h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>
                  WhatsApp Business account information (phone number, business
                  name)
                </li>
                <li>Email address and authentication credentials</li>
                <li>
                  Property management details (property names, addresses,
                  amenities)
                </li>
                <li>Payment information (processed securely through Stripe)</li>
                <li>
                  Contact information for emergency contacts and property
                  details
                </li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                2.2 WhatsApp Messages and Conversations
              </h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>
                  Incoming and outgoing WhatsApp messages from your business
                  conversations
                </li>
                <li>
                  Message metadata (timestamps, sender information, message
                  types)
                </li>
                <li>Conversation history linked to specific properties</li>
                <li>
                  Images and attachments (stored for processing but not analyzed
                  by AI)
                </li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                2.3 Usage Data
              </h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Service usage patterns and frequency</li>
                <li>AI response confidence scores and processing metrics</li>
                <li>Webhook processing logs and error reports</li>
                <li>Device and browser information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. How We Use Your Information
              </h2>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                3.1 Service Provision
              </h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>
                  Process and respond to WhatsApp messages using AI technology
                </li>
                <li>
                  Link conversations to specific properties for context-aware
                  responses
                </li>
                <li>
                  Generate automated replies based on property information and
                  conversation history
                </li>
                <li>
                  Send notifications for messages requiring human intervention
                </li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                3.2 AI Processing
              </h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>
                  Analyze message content and conversation context using AI
                  models
                </li>
                <li>Generate appropriate responses with confidence scoring</li>
                <li>
                  Improve response accuracy through conversation history
                  analysis
                </li>
                <li>
                  Ensure responses align with property-specific information and
                  house rules
                </li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                3.3 Business Operations
              </h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Process subscription payments and manage billing</li>
                <li>Provide customer support and technical assistance</li>
                <li>Monitor service performance and reliability</li>
                <li>
                  Comply with legal obligations and enforce our terms of service
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. WhatsApp Business Integration
              </h2>
              <p className="text-gray-700 mb-4">
                Our service integrates with WhatsApp Business API to provide
                automated messaging capabilities. This integration involves:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Receiving webhook notifications for incoming messages</li>
                <li>Sending automated replies through WhatsApp Business API</li>
                <li>
                  Storing message content and metadata for processing and
                  context
                </li>
                <li>Maintaining conversation history for AI analysis</li>
              </ul>
              <p className="text-gray-700 mb-4">
                We comply with WhatsApp&apos;s Business Policy and Terms of
                Service. Your use of our service is also subject to
                WhatsApp&apos;s privacy policy and terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Data Sharing and Disclosure
              </h2>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                5.1 Third-Party Services
              </h3>
              <p className="text-gray-700 mb-4">
                We share data with the following third-party services:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>
                  <strong>Meta/WhatsApp:</strong> For WhatsApp Business API
                  integration and message processing
                </li>
                <li>
                  <strong>Vercel AI SDK:</strong> For AI model processing and
                  response generation
                </li>
                <li>
                  <strong>Stripe:</strong> For secure payment processing (we do
                  not store payment card details)
                </li>
                <li>
                  <strong>Supabase:</strong> For database storage,
                  authentication, and real-time features
                </li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                5.2 Legal Requirements
              </h3>
              <p className="text-gray-700 mb-4">
                We may disclose your information if required by law, court
                order, or government regulation, or if necessary to protect our
                rights, property, or safety, or that of our users or the public.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Data Security
              </h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate technical and organizational measures
                to protect your information:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>HTTPS encryption for all data transmission</li>
                <li>Encryption at rest for stored data</li>
                <li>Secure authentication and session management</li>
                <li>Regular security audits and monitoring</li>
                <li>
                  Access controls and employee training on data protection
                </li>
                <li>Rate limiting and abuse prevention measures</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Data Retention
              </h2>
              <p className="text-gray-700 mb-4">
                We retain your information for as long as necessary to provide
                our services and comply with legal obligations:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>
                  Account information: Until account deletion or 3 years of
                  inactivity
                </li>
                <li>Message data: 2 years from last message in conversation</li>
                <li>
                  Property information: Until property deletion or account
                  closure
                </li>
                <li>Payment records: 7 years for tax and legal compliance</li>
                <li>
                  Usage logs: 1 year for service improvement and debugging
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Your Rights and Choices
              </h2>
              <p className="text-gray-700 mb-4">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>
                  <strong>Access:</strong> Request a copy of your personal
                  information
                </li>
                <li>
                  <strong>Correction:</strong> Update or correct inaccurate
                  information
                </li>
                <li>
                  <strong>Deletion:</strong> Request deletion of your personal
                  information
                </li>
                <li>
                  <strong>Portability:</strong> Receive your data in a
                  structured, machine-readable format
                </li>
                <li>
                  <strong>Restriction:</strong> Limit how we process your
                  information
                </li>
                <li>
                  <strong>Objection:</strong> Object to certain types of
                  processing
                </li>
              </ul>
              <p className="text-gray-700 mb-4">
                To exercise these rights, please contact us at the information
                provided below.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. International Data Transfers
              </h2>
              <p className="text-gray-700 mb-4">
                Your information may be transferred to and processed in
                countries other than your own. We ensure appropriate safeguards
                are in place for such transfers, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>
                  Standard Contractual Clauses approved by the European
                  Commission
                </li>
                <li>
                  Adequacy decisions by relevant data protection authorities
                </li>
                <li>
                  Other appropriate safeguards as required by applicable law
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. Children&apos;s Privacy
              </h2>
              <p className="text-gray-700 mb-4">
                Our service is not intended for children under 13 years of age.
                We do not knowingly collect personal information from children
                under 13. If you are a parent or guardian and believe your child
                has provided us with personal information, please contact us to
                have such information removed.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                11. Changes to This Privacy Policy
              </h2>
              <p className="text-gray-700 mb-4">
                We may update this Privacy Policy from time to time. We will
                notify you of any material changes by posting the new Privacy
                Policy on this page and updating the &quot;Last Updated&quot;
                date. Your continued use of our service after such changes
                constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                12. Contact Information
              </h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy or our data
                practices, please contact our head developer and privacy
                officer:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <strong>Email:</strong> me@perryfardella.com
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                13. Compliance
              </h2>
              <p className="text-gray-700 mb-4">
                This Privacy Policy is designed to comply with applicable data
                protection laws, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>
                  General Data Protection Regulation (GDPR) - European Union
                </li>
                <li>
                  California Consumer Privacy Act (CCPA) - California, USA
                </li>
                <li>
                  Personal Information Protection and Electronic Documents Act
                  (PIPEDA) - Canada
                </li>
                <li>Other applicable local and national privacy laws</li>
              </ul>
            </section>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                This Privacy Policy is effective as of the date listed above and
                will remain in effect except with respect to any changes in its
                provisions in the future, which will be in effect immediately
                after being posted on this page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
