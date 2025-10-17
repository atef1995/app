import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Vibed to Cracked",
  description:
    "Terms of Service for Vibed to Cracked web development learning platform",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8">
            Terms of Service
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              1. Acceptance of Terms
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                By accessing and using Vibed to Cracked (&apos;the
                Platform&apos;, &apos;our Service&apos;), you accept and agree
                to be bound by the terms and provision of this agreement. If you
                do not agree to abide by the above, please do not use this
                service.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              2. Description of Service
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                Vibed to Cracked is a mood-driven web development learning
                platform that provides interactive tutorials, coding challenges,
                quizzes, and educational content. Our service includes both free
                and premium content, with different subscription tiers offering
                varying levels of access.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              3. User Accounts
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Account Creation
              </h3>
              <p>
                You must create an account to access certain features of our
                platform. You are responsible for maintaining the
                confidentiality of your account information and for all
                activities that occur under your account.
              </p>

              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Account Responsibilities
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized use</li>
                <li>
                  Use a unique username that doesn&apos;t violate others&apos;
                  rights
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              4. Subscription and Payment Terms
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Subscription Tiers
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>FREE</strong>: Access to basic tutorials and limited
                  features
                </li>
                <li>
                  <strong>PRO</strong>: Additional premium content and features
                </li>
                <li>
                  <strong>PREMIUM</strong>: Full access to all content and
                  advanced features
                </li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Payment Terms
              </h3>
              <p>
                Subscription fees are processed through Stripe and are billed
                according to your chosen plan. Payments are non-refundable
                except as required by law. You may cancel your subscription at
                any time, with access continuing until the end of your current
                billing period.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              5. Acceptable Use Policy
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Use the platform for any illegal or unauthorized purpose
                </li>
                <li>Violate any laws in your jurisdiction</li>
                <li>Share your account credentials with others</li>
                <li>Attempt to reverse engineer or hack the platform</li>
                <li>Upload malicious code or attempt to disrupt the service</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Violate the intellectual property rights of others</li>
                <li>
                  Use automated systems to access the platform without
                  permission
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              6. Intellectual Property Rights
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Our Content
              </h3>
              <p>
                All content on the platform, including tutorials, challenges,
                text, graphics, logos, and software, is owned by Vibed to
                Cracked or our licensors and is protected by copyright,
                trademark, and other intellectual property laws.
              </p>

              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                User Content
              </h3>
              <p>
                You retain ownership of any code you write or content you create
                using our platform. However, you grant us a non-exclusive,
                worldwide license to use, store, and process this content to
                provide our services.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              7. Code Execution and WebContainer
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                Our platform uses WebContainer technology to execute JavaScript
                code in your browser. While we implement security measures, you
                acknowledge that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Code execution is limited to the sandboxed environment</li>
                <li>
                  We are not responsible for any issues arising from code
                  execution
                </li>
                <li>
                  You should not attempt to execute malicious or harmful code
                </li>
                <li>Resource usage is monitored and limited</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              8. Privacy and Data Protection
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                Your privacy is important to us. Please review our
                <a
                  href="/privacy"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {" "}
                  Privacy Policy
                </a>
                , which also governs your use of the platform, to understand our
                practices.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              9. Disclaimers and Limitations of Liability
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                The platform is provided &apos;as is&apos; without any
                representations or warranties, express or implied. We do not
                warrant that the service will be uninterrupted, timely, secure,
                or error-free.
              </p>
              <p>
                In no event shall Vibed to Cracked be liable for any indirect,
                incidental, special, consequential, or punitive damages,
                including without limitation, loss of profits, data, use,
                goodwill, or other intangible losses.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              10. Termination
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                We may terminate or suspend your access immediately, without
                prior notice, for any reason whatsoever, including without
                limitation if you breach the Terms. Upon termination, your right
                to use the platform will cease immediately.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              11. Changes to Terms
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                We reserve the right, at our sole discretion, to modify or
                replace these Terms at any time. If a revision is material, we
                will try to provide at least 30 days notice prior to any new
                terms taking effect.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              12. Governing Law
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                These Terms shall be interpreted and governed by the laws of the
                jurisdiction in which Vibed to Cracked operates, without regard
                to its conflict of law provisions.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              13. Contact Information
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                If you have any questions about these Terms of Service, please
                contact us at:
              </p>
              <p>
                Email:{" "}
                <a
                  href="mailto:legal@vibedtocracked.com"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  atef@vibed-to-cracked.com
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
