"use client";

import React from "react";
import { motion } from "framer-motion";
import { CloudProvider } from "@/hooks/useDashboardData";
import { CountUp } from "./CountUp";

interface ProviderNodeProps {
  provider: CloudProvider;
  delay: number;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

const positionGridClasses = {
  "top-left": "col-start-1 row-start-1 md:col-start-1 md:row-start-1 lg:col-start-1 lg:row-start-1",
  "top-right": "col-start-1 row-start-2 md:col-start-2 md:row-start-1 lg:col-start-3 lg:row-start-1",
  "bottom-left": "col-start-1 row-start-4 md:col-start-1 md:row-start-2 lg:col-start-1 lg:row-start-3",
  "bottom-right": "col-start-1 row-start-5 md:col-start-2 md:row-start-2 lg:col-start-3 lg:row-start-3",
};

function AwsIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 28a4 4 0 1 1-4-4h4v4Z" />
      <path d="M18 20l2 8 2-6 2 6 2-8" />
      <path d="M34 22c0-1.5-1-2-2.5-2s-2.5.5-2.5 2 1 2 2.5 2 2.5.5 2.5 2-1 2-2.5 2-2.5-.5-2.5-2" />
      <path d="M8 34c8 5 24 5 32 0" />
      <path d="M36 32l4 2-2 4" />
    </svg>
  );
}

function AzureIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 38l12-28 8 10 16-14-22 32H6Z" />
    </svg>
  );
}

function GcpIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" strokeWidth="3" aria-hidden="true">
      <path
        d="M34 38c4.4 0 8-3.6 8-8 0-4-3-7.3-7-7.9.3-1.3.5-2.7.5-4.1 0-7.2-5.8-13-13-13-5.5 0-10.2 3.4-12.1 8.3C9.4 13 8.3 13 7 13c-4.4 0-8 3.6-8 8 0 3.8 2.7 7 6.3 7.8"
        fill={color}
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="26" r="3" fill="white" />
      <circle cx="24" cy="22" r="3" fill="white" />
      <circle cx="32" cy="26" r="3" fill="white" />
    </svg>
  );
}

function OnPremIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="6" y="10" width="36" height="11" rx="2" />
      <circle cx="12" cy="15.5" r="1.5" fill={color} />
      <circle cx="18" cy="15.5" r="1.5" fill={color} />
      <line x1="30" y1="15.5" x2="38" y2="15.5" />
      <rect x="6" y="27" width="36" height="11" rx="2" />
      <circle cx="12" cy="32.5" r="1.5" fill={color} />
      <circle cx="18" cy="32.5" r="1.5" fill={color} />
      <line x1="30" y1="32.5" x2="38" y2="32.5" />
    </svg>
  );
}

function ProviderIcon({ id, color }: { id: string; color: string }) {
  switch (id) {
    case "aws":
      return <AwsIcon color={color} />;
    case "azure":
      return <AzureIcon color={color} />;
    case "gcp":
      return <GcpIcon color={color} />;
    case "onprem":
      return <OnPremIcon color={color} />;
    default:
      return null;
  }
}

export function ProviderNode({ provider, delay, position }: ProviderNodeProps) {
  const customStyles = {
    "--provider-color": provider.color,
  } as React.CSSProperties;

  const pulseRingBorderColor = `color-mix(in srgb, ${provider.color} 60%, transparent)`;

  return (
    <motion.div
      className={`${positionGridClasses[position]} flex flex-col items-center gap-3`}
      initial={{ opacity: 0, scale: 0.7 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="provider-node"
        style={customStyles}
        whileHover={{ scale: 1.06 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="node-hex">
          <div className="node-inner">
            <ProviderIcon id={provider.id} color={provider.color} />
            <div className="node-stats">
              <span className="node-resources">
                <CountUp to={provider.resources} suffix=" res" />
              </span>
              <span className="node-eff" style={{ color: "var(--color-accent-success)" }}>
                <CountUp to={provider.efficiency} suffix="% eff" />
              </span>
            </div>
          </div>
        </div>
        <motion.div
          className="pulse-ring"
          style={{ borderColor: pulseRingBorderColor }}
          animate={{ scale: [1, 1.35], opacity: [0.5, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", delay: delay * 0.5 }}
        />
      </motion.div>
      <div className="provider-label">
        <span className="provider-name">{provider.shortName}</span>
        <span className="provider-spend">
          $<CountUp to={provider.spend / 1000} decimals={1} suffix="k/mo" />
        </span>
      </div>
    </motion.div>
  );
}
