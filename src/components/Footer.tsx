"use client";

import Link from "next/link";
import { Mail, Heart, Code, BookOpen, Users, Bug } from "lucide-react";
import { useMood } from "@/components/providers/MoodProvider";
import getMoodColors from "@/lib/getMoodColors";
import { getMoodIcon } from "@/lib/getMoodIcon";
import { TikTokIcon } from "@/components/icons/TikTokIcon";
import { InstagramIcon } from "./icons/InstagramIcon";

export function Footer() {
  const { currentMood } = useMood();
  const moodColors = getMoodColors(currentMood.id);
  const Icon = getMoodIcon(currentMood.icon);

  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Learn",
      links: [
        { name: "Tutorials", href: "/tutorials", icon: BookOpen },
        { name: "Practice", href: "/practice", icon: Code },
        { name: "Quizzes", href: "/quizzes", icon: BookOpen },
        { name: "Projects", href: "/projects", icon: Code },
      ],
    },
    {
      title: "Platform",
      links: [
        { name: "Dashboard", href: "/dashboard", icon: BookOpen },
        { name: "Study Plan", href: "/study-plan", icon: BookOpen },
        { name: "Achievements", href: "/achievements", icon: BookOpen },
        { name: "Social", href: "/social", icon: Users },
      ],
    },
    {
      title: "Account",
      links: [
        { name: "Settings", href: "/settings", icon: BookOpen },
        { name: "Pricing", href: "/pricing", icon: BookOpen },
        { name: "Certificates", href: "/certificates", icon: BookOpen },
        { name: "Subscription", href: "/subscription/upgrade", icon: BookOpen },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Contact Us", href: "/contact", icon: Mail },
        { name: "Bug Report", href: "/bug-report", icon: Bug },
        { name: "Help Center", href: "#", icon: BookOpen },
        { name: "Status", href: "#", icon: BookOpen },
      ],
    },
  ];

  const socialLinks = [
    // { name: "GitHub", href: "https://github.com", icon: Github },
    // { name: "Twitter", href: "https://twitter.com", icon: Twitter },
    { name: "Email", href: "mailto:atef@vibed-to-cracked.com", icon: Mail },
    {
      name: "TikTok",
      href: "https://www.tiktok.com/@atefcoding?_t=ZN-90dG9Lkegbu&_r=1",
      icon: TikTokIcon,
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/atefcodes/",
      icon: InstagramIcon,
    },
  ];

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Section */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Vibed to Cracked
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Master JavaScript at your own pace with mood-driven learning.
                Choose your vibe, code your way.
              </p>

              {/* Current Mood Indicator */}
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${moodColors.accent} text-white`}
              >
                <Icon className="w-5 h-5" />
                <span>Currently {currentMood.id.toUpperCase()}</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-400 dark:hover:text-gray-300 transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors text-sm flex items-center gap-2 group"
                    >
                      <link.icon className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>© {currentYear} Vibed to Cracked.</span>
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>for developers</span>
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-6 text-sm">
              <Link
                href="/privacy"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>

          {/* Mood-based Quote */}
          <div className="mt-6 text-center">
            <p className={`text-sm italic ${moodColors.text}`}>
              {currentMood.id === "chill" &&
                '"Take it easy, code flows better when you\'re relaxed. 🌊"'}
              {currentMood.id === "rush" &&
                '"Fast-paced learning, maximum momentum! ⚡"'}
              {currentMood.id === "grind" &&
                '"Focus deep, code harder, level up faster. 💪"'}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
