import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Complexity Visualizer - Master Big O Notation | Vibed to Cracked",
  description:
    "Interactive tools to visualize and analyze algorithm complexity. Compare algorithms, calculate Big O, and run real performance benchmarks. CRACKED exclusive feature.",
  openGraph: {
    title: "Complexity Visualizer - Master Big O Notation",
    description:
      "Interactive tools to master time and space complexity with visual charts, algorithm comparisons, and real benchmarks.",
    type: "website",
  },
};

export default function ComplexityVisualizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
