"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Certificate } from "@prisma/client";
import { Award, ExternalLink, Share } from "lucide-react";
import CertificateCard from "@/components/ui/CertificateCard";
import { useMood } from "@/components/providers/MoodProvider";

interface CertificateWithUser extends Certificate {
  user: {
    id: string;
    name: string | null;
    email: string;
    username: string | null;
  };
}

export default function ShareableCertificatePage() {
  const params = useParams();
  const { currentMood } = useMood();
  const [certificate, setCertificate] = useState<CertificateWithUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const shareableId = params.shareableId as string;

  useEffect(() => {
    if (shareableId) {
      fetchCertificate();
    }
  }, [shareableId]);

  const fetchCertificate = async () => {
    try {
      const response = await fetch(`/api/certificates/share/${shareableId}`);
      const data = await response.json();
      
      if (data.success) {
        setCertificate(data.data);
      } else {
        setError(data.error || "Certificate not found");
      }
    } catch (error) {
      console.error("Error fetching certificate:", error);
      setError("Failed to load certificate");
    } finally {
      setLoading(false);
    }
  };

  const getMoodColors = () => {
    switch (currentMood.id) {
      case "rush":
        return {
          bg: "from-red-50 via-orange-50 to-yellow-50 dark:from-red-900/20 dark:via-orange-900/20 dark:to-yellow-900/20",
          accent: "bg-red-600 dark:bg-red-500",
        };
      case "grind":
        return {
          bg: "from-gray-50 via-slate-50 to-blue-50 dark:from-gray-900/20 dark:via-slate-900/20 dark:to-blue-900/20",
          accent: "bg-blue-600 dark:bg-blue-500",
        };
      default: // chill
        return {
          bg: "from-purple-50 via-pink-50 to-indigo-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-indigo-900/20",
          accent: "bg-purple-600 dark:bg-purple-500",
        };
    }
  };

  const moodColors = getMoodColors();

  const shareOnSocial = (platform: string) => {
    if (!certificate) return;
    
    const text = `I just earned a certificate for completing "${certificate.entityTitle}" on Vibed to Cracked!`;
    const url = window.location.href;
    
    let shareUrl = "";
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${moodColors.bg} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading certificate...</p>
        </div>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${moodColors.bg} flex items-center justify-center`}>
        <div className="text-center max-w-md mx-auto p-6">
          <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Certificate Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {error || "This certificate may be private or no longer available."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${moodColors.bg} p-4`}>
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className={`${moodColors.accent} p-4 rounded-full`}>
              <Award className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Certificate of Completion
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Earned by {certificate.user.name || certificate.user.username || "Anonymous"}
          </p>
        </div>

        {/* Certificate */}
        <div className="mb-8">
          <CertificateCard certificate={certificate} showActions={false} />
        </div>

        {/* Social Sharing */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Share className="h-5 w-5" />
            Share this achievement
          </h3>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => shareOnSocial("twitter")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Share on Twitter
            </button>
            <button
              onClick={() => shareOnSocial("linkedin")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Share on LinkedIn
            </button>
            <button
              onClick={() => shareOnSocial("facebook")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Share on Facebook
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 dark:text-gray-400">
          <p>
            Want to earn your own certificates?{" "}
            <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
              Start learning on Vibed to Cracked
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}