"use client";

import { motion } from "framer-motion";

export function LoadingSkeleton() {
  const cornerPositions = [
    { gridColumn: "1", gridRow: "1" }, // Top-Left
    { gridColumn: "3", gridRow: "1" }, // Top-Right
    { gridColumn: "1", gridRow: "3" }, // Bottom-Left
    { gridColumn: "3", gridRow: "3" }, // Bottom-Right
  ];

  return (
    <div className="skeleton-grid" aria-busy="true" aria-label="Loading dashboard data">
      {cornerPositions.map((pos, i) => (
        <motion.div
          key={i}
          className="skeleton-node"
          style={pos}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
      <motion.div
        className="skeleton-panel"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 1.4, repeat: Infinity, delay: 0.8 }}
      />
    </div>
  );
}

interface ErrorStateProps {
  message: string;
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div role="alert" className="error-state">
      <svg
        className="w-12 h-12 text-[var(--color-accent-error)]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
        style={{ width: "48px", height: "48px" }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <h2 className="text-xl font-bold mt-2">Failed to load dashboard</h2>
      <p className="text-sm text-[var(--color-text-muted)] text-center max-w-sm mt-1">
        {message}
      </p>
    </div>
  );
}
