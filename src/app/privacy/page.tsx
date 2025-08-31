import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Vibed to Cracked",
  description:
    "Privacy Policy for Vibed to Cracked JavaScript learning platform",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8">
            Privacy Policy
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              1. Information We Collect
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Personal Information
              </h3>
              <p>
                When you create an account, we collect information such as your
                email address, username, and authentication provider details
                (Google, GitHub). We also collect your learning preferences,
                including your selected mood (CHILL, RUSH, GRIND) and
                subscription status.
              </p>

              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Usage Data
              </h3>
              <p>
                We automatically collect information about your interaction with
                our platform, including tutorial progress, quiz scores,
                challenge completions, time spent learning, and code execution
                data for providing feedback and improving your learning
                experience.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              2. How We Use Your Information
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide and maintain our learning platform</li>
                <li>
                  Personalize your learning experience based on your mood and
                  progress
                </li>
                <li>Process payments and manage subscriptions</li>
                <li>
                  Send important updates about your account and our services
                </li>
                <li>
                  Improve our platform through analytics and user feedback
                </li>
                <li>Ensure platform security and prevent fraud</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              3. Information Sharing
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                We do not sell, trade, or otherwise transfer your personal
                information to third parties except in the following
                circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>With your explicit consent</li>
                <li>
                  To trusted service providers who assist in operating our
                  platform (e.g., payment processing, authentication)
                </li>
                <li>
                  When required by law or to protect our rights and safety
                </li>
                <li>In connection with a business transfer or acquisition</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              4. Data Security
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                We implement appropriate technical and organizational security
                measures to protect your personal information against
                unauthorized access, alteration, disclosure, or destruction.
                This includes encryption, secure authentication, and regular
                security audits.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              5. Your Rights
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access and review your personal information</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your account and associated data</li>
                <li>Export your learning progress and data</li>
                <li>Withdraw consent for data processing where applicable</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              6. Cookies and Tracking
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                We use cookies and similar tracking technologies to enhance your
                experience, remember your preferences, and analyze platform
                usage. You can control cookie settings through your browser
                preferences. For more details, see our
                <a
                  href="/cookies"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {" "}
                  Cookie Policy
                </a>
                .
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              7. Children&apos;s Privacy
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                Our platform is not intended for children under 13 years of age.
                We do not knowingly collect personal information from children
                under 13. If we become aware that we have collected such
                information, we will take steps to delete it promptly.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              8. Changes to This Policy
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the &apos;Last updated&apos; date. We
                encourage you to review this Privacy Policy periodically.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              9. Contact Us
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                If you have any questions about this Privacy Policy or our data
                practices, please contact us at:
              </p>
              <p>
                Email:{" "}
                <a
                  href="mailto:privacy@vibedtocracked.com"
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
