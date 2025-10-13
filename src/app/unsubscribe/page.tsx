import { Suspense } from "react";
import UnsubscribeForm from "@/components/UnsubscribeForm";

export default function UnsubscribePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <Suspense
          fallback={
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="animate-spin text-3xl">⏳</div>
              </div>
              <p className="text-gray-600">Loading...</p>
            </div>
          }
        >
          <UnsubscribeForm />
        </Suspense>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            Having issues?{" "}
            <a href="/contact" className="text-blue-600 hover:underline">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
