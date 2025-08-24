"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Certificate, CertificateType } from "@prisma/client";
import { Award, Trophy, Filter } from "lucide-react";
import CertificateCard from "@/components/ui/CertificateCard";
import { useMood } from "@/components/providers/MoodProvider";

export default function CertificatesPage() {
  const { data: session } = useSession();
  const { currentMood } = useMood();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<CertificateType | "ALL">("ALL");

  const fetchCertificates = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filter !== "ALL") {
        params.append("type", filter);
      }
      
      const response = await fetch(`/api/certificates?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setCertificates(data.data);
      }
    } catch (error) {
      console.error("Error fetching certificates:", error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  const getMoodColors = () => {
    switch (currentMood.id) {
      case "rush":
        return {
          bg: "from-red-50 via-orange-50 to-yellow-50 dark:from-red-900/20 dark:via-orange-900/20 dark:to-yellow-900/20",
          accent: "bg-red-600 dark:bg-red-500",
          text: "text-red-700 dark:text-red-300",
        };
      case "grind":
        return {
          bg: "from-gray-50 via-slate-50 to-blue-50 dark:from-gray-900/20 dark:via-slate-900/20 dark:to-blue-900/20",
          accent: "bg-blue-600 dark:bg-blue-500",
          text: "text-blue-700 dark:text-blue-300",
        };
      default: // chill
        return {
          bg: "from-purple-50 via-pink-50 to-indigo-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-indigo-900/20",
          accent: "bg-purple-600 dark:bg-purple-500",
          text: "text-purple-700 dark:text-purple-300",
        };
    }
  };

  const moodColors = getMoodColors();

  const tutorialCertificates = certificates.filter(cert => cert.type === CertificateType.TUTORIAL);
  const categoryCertificates = certificates.filter(cert => cert.type === CertificateType.CATEGORY);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Sign in to view your certificates
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${moodColors.bg} p-4`}>
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className={`${moodColors.accent} p-4 rounded-full`}>
              <Award className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            My Certificates
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Your learning achievements and completed milestones
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <span className="text-gray-600 dark:text-gray-400 font-medium">Filter:</span>
          </div>
          <div className="flex gap-2">
            {[
              { value: "ALL", label: "All", icon: Award },
              { value: CertificateType.TUTORIAL, label: "Tutorials", icon: Award },
              { value: CertificateType.CATEGORY, label: "Categories", icon: Trophy },
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setFilter(value as CertificateType | "ALL")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === value
                    ? `${moodColors.accent} text-white shadow-lg`
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading certificates...</p>
          </div>
        )}

        {/* No certificates */}
        {!loading && certificates.length === 0 && (
          <div className="text-center py-12">
            <div className="mb-4">
              <Award className="h-16 w-16 text-gray-400 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No certificates yet
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Complete tutorials and quizzes to earn your first certificate!
            </p>
          </div>
        )}

        {/* Category Certificates */}
        {!loading && categoryCertificates.length > 0 && (filter === "ALL" || filter === CertificateType.CATEGORY) && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
              <Trophy className="h-6 w-6" />
              Category Certificates
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                ({categoryCertificates.length})
              </span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryCertificates.map((certificate) => (
                <CertificateCard key={certificate.id} certificate={certificate} />
              ))}
            </div>
          </div>
        )}

        {/* Tutorial Certificates */}
        {!loading && tutorialCertificates.length > 0 && (filter === "ALL" || filter === CertificateType.TUTORIAL) && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
              <Award className="h-6 w-6" />
              Tutorial Certificates
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                ({tutorialCertificates.length})
              </span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutorialCertificates.map((certificate) => (
                <CertificateCard key={certificate.id} certificate={certificate} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}