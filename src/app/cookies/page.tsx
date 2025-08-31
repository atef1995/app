import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy - Vibed to Cracked",
  description:
    "Cookie Policy for Vibed to Cracked JavaScript learning platform",
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8">
            Cookie Policy
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              1. What Are Cookies
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                Cookies are small text files that are placed on your device when
                you visit our website. They help us provide you with a better
                experience by remembering your preferences and enabling certain
                functionality. Cookies contain information that is transferred
                to your device&apos;s hard drive.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              2. How We Use Cookies
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>We use cookies for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Authentication and session management</li>
                <li>Remembering your mood preferences and settings</li>
                <li>Storing your learning progress and preferences</li>
                <li>Analyzing platform usage to improve our services</li>
                <li>Providing personalized content and recommendations</li>
                <li>Ensuring security and preventing fraud</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              3. Types of Cookies We Use
            </h2>
            <div className="space-y-6 text-gray-700 dark:text-gray-300">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Essential Cookies
                </h3>
                <p>
                  These cookies are necessary for the platform to function
                  properly. They enable core functionality such as user
                  authentication, session management, and security features.
                  These cookies cannot be disabled.
                </p>
                <div className="mt-2 bg-gray-50 dark:bg-gray-800 p-3 rounded text-sm">
                  <strong>Examples:</strong> Session tokens, CSRF protection,
                  authentication state
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Functional Cookies
                </h3>
                <p>
                  These cookies enable enhanced functionality and
                  personalization, such as remembering your mood settings,
                  language preferences, and learning progress.
                </p>
                <div className="mt-2 bg-gray-50 dark:bg-gray-800 p-3 rounded text-sm">
                  <strong>Examples:</strong> Mood preferences
                  (CHILL/RUSH/GRIND), theme settings, tutorial progress
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Analytics Cookies
                </h3>
                <p>
                  These cookies help us understand how users interact with our
                  platform by collecting anonymous information about usage
                  patterns, popular content, and performance metrics.
                </p>
                <div className="mt-2 bg-gray-50 dark:bg-gray-800 p-3 rounded text-sm">
                  <strong>Examples:</strong> Page views, time spent on
                  tutorials, completion rates, error tracking
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Third-Party Cookies
                </h3>
                <p>
                  We use third-party services that may set their own cookies to
                  provide functionality such as authentication, payment
                  processing, and analytics.
                </p>
                <div className="mt-2 bg-gray-50 dark:bg-gray-800 p-3 rounded text-sm">
                  <strong>Services:</strong> Google (Authentication), GitHub
                  (Authentication), Stripe (Payments)
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              4. Cookie Duration
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Session Cookies
                </h3>
                <p>
                  These cookies are temporary and are deleted when you close
                  your browser. They are used for essential functionality like
                  maintaining your login session.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Persistent Cookies
                </h3>
                <p>
                  These cookies remain on your device for a set period or until
                  manually deleted. They remember your preferences and settings
                  across browser sessions.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              5. Managing Your Cookie Preferences
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Browser Settings
              </h3>
              <p>
                Most web browsers allow you to control cookies through their
                settings preferences. You can typically:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>View which cookies are stored on your device</li>
                <li>Delete existing cookies</li>
                <li>Block cookies from specific websites</li>
                <li>
                  Block all cookies (note: this may affect platform
                  functionality)
                </li>
                <li>Set preferences for cookie acceptance</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mt-6">
                Browser-Specific Instructions
              </h3>
              <div className="space-y-2">
                <p>
                  <strong>Chrome:</strong> Settings &gt; Privacy and Security
                  &gt; Cookies and other site data
                </p>
                <p>
                  <strong>Firefox:</strong> Settings &gt; Privacy &amp; Security
                  &gt; Cookies and Site Data
                </p>
                <p>
                  <strong>Safari:</strong> Preferences &gt; Privacy &gt; Manage
                  Website Data
                </p>
                <p>
                  <strong>Edge:</strong> Settings &gt; Cookies and site
                  permissions &gt; Cookies and site data
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              6. Impact of Disabling Cookies
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                While you have the right to disable cookies, please be aware
                that doing so may affect your experience on our platform:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You may not be able to log in or stay logged in</li>
                <li>
                  Your mood preferences and settings will not be remembered
                </li>
                <li>Learning progress may not be saved properly</li>
                <li>Some interactive features may not work correctly</li>
                <li>The platform may not function as intended</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              7. Third-Party Cookie Policies
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                We use several third-party services that may set their own
                cookies. We recommend reviewing their privacy and cookie
                policies:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Google:</strong>
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
                  >
                    Google Privacy Policy
                  </a>
                </li>
                <li>
                  <strong>GitHub:</strong>
                  <a
                    href="https://docs.github.com/en/github/site-policy/github-privacy-statement"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
                  >
                    GitHub Privacy Statement
                  </a>
                </li>
                <li>
                  <strong>Stripe:</strong>
                  <a
                    href="https://stripe.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
                  >
                    Stripe Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              8. Updates to This Policy
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                We may update this Cookie Policy from time to time to reflect
                changes in our practices or for other operational, legal, or
                regulatory reasons. We will notify you of any changes by posting
                the new Cookie Policy on this page.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              9. Contact Us
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                If you have any questions about our use of cookies or this
                Cookie Policy, please contact us at:
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
