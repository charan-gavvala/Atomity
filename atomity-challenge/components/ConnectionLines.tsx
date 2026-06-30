"use client";

import { motion } from "framer-motion";
import { CloudProvider } from "@/hooks/useDashboardData";

interface ConnectionLinesProps {
  providers: CloudProvider[];
}

const LINE_DEFS = [
  { id: "tl", x1: "18%", y1: "18%", x2: "50%", y2: "50%", delay: 0.2 },
  { id: "tr", x1: "82%", y1: "18%", x2: "50%", y2: "50%", delay: 0.3 },
  { id: "bl", x1: "18%", y1: "82%", x2: "50%", y2: "50%", delay: 0.4 },
  { id: "br", x1: "82%", y1: "82%", x2: "50%", y2: "50%", delay: 0.5 },
];

export function ConnectionLines({ providers }: ConnectionLinesProps) {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: 0.15 }}
    >
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        aria-hidden="true"
      >
        <defs>
          {providers.map((p) => (
            <linearGradient
              key={p.id}
              id={`grad-${p.id}`}
              gradientUnits="userSpaceOnUse"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor={p.color} stopOpacity={0.7} />
              <stop offset="100%" stopColor="var(--color-accent-success)" stopOpacity={0.4} />
            </linearGradient>
          ))}
        </defs>

        {LINE_DEFS.map((line, i) => {
          const p = providers[i];
          if (!p) return null;

          return (
            <g key={line.id}>
              {/* Connection Line */}
              <motion.line
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke={`url(#grad-${p.id})`}
                strokeWidth={1.5}
                strokeDasharray="6 4"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: line.delay, ease: "easeOut" }}
              />

              {/* Animated Data Packet */}
              <circle r={3} fill={p.color} opacity={0.9}>
                <animateMotion
                  dur={`${2.5 + i * 0.4}s`}
                  repeatCount="indefinite"
                  begin={`${line.delay + 1}s`}
                  path={`M ${line.x1} ${line.y1} L ${line.x2} ${line.y2}`}
                />
              </circle>
            </g>
          );
        })}
      </svg>
    </motion.div>
  );
}
