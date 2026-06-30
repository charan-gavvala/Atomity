"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useDashboardData } from "@/hooks/useDashboardData";
import { ProviderNode } from "./ProviderNode";
import { MetricsPanel } from "./MetricsPanel";
import { ConnectionLines } from "./ConnectionLines";
import { LoadingSkeleton, ErrorState } from "./States";
import { CountUp } from "./CountUp";
import ThemeToggle from "./ThemeToggle";

const POSITIONS = ["top-left", "top-right", "bottom-left", "bottom-right"] as const;
const DELAYS = [0.1, 0.15, 0.2, 0.25];

export default function CloudDashboard() {
  const { data, loading, error } = useDashboardData();
  const prefersReduced = useReducedMotion();

  // Animation values based on reduced motion setting
  const headerAnimProps = prefersReduced
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
      };

  const statAnimProps = prefersReduced
    ? {}
    : {
        initial: { opacity: 0, y: 15 },
        whileInView: { opacity: 1, y: 0 },
      };

  // Compute stat strip metrics if data is available
  const avgEfficiency = data
    ? Math.round(data.providers.reduce((sum, p) => sum + p.efficiency, 0) / data.providers.length)
    : 0;

  const totalResources = data
    ? data.providers.reduce((sum, p) => sum + p.resources, 0)
    : 0;

  return (
    <section className="dashboard-section" aria-labelledby="dashboard-heading">
      {/* Top nav bar with theme toggle */}
      <div className="dash-topbar">
        <span className="dash-logo">Atomity</span>
        <ThemeToggle />
      </div>
      {/* Section Header */}
      <motion.div
        className="section-header"
        {...headerAnimProps}
        viewport={{ once: true, margin: "-5%" }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="eyebrow-badge">Multi-Cloud Intelligence</div>
        <h2 id="dashboard-heading" className="section-title">
          One pane of glass for every cloud
        </h2>
        <p className="section-subtitle">
          Atomity unifies AWS, Azure, GCP, and on-premise infrastructure into a single intelligent cost
          layer — with real-time anomaly detection and automated savings recommendations.
        </p>
      </motion.div>

      {/* Dashboard Canvas */}
      <div className="dashboard-canvas">
        {loading && <LoadingSkeleton />}
        {error && <ErrorState message={error} />}
        {data && (
          <div
            className="provider-grid"
            role="region"
            aria-label="Cloud provider overview"
            style={{ position: "relative" }}
          >
            <ConnectionLines providers={data.providers} />
            {data.providers.map((provider, i) => (
              <ProviderNode
                key={provider.id}
                provider={provider}
                delay={DELAYS[i]}
                position={POSITIONS[i]}
              />
            ))}
            <MetricsPanel
              metrics={data.metrics}
              totalSpend={data.totalSpend}
              totalSavings={data.totalSavings}
            />
          </div>
        )}
      </div>

      {/* Statistics Strip */}
      {data && (
        <motion.div
          className="stat-strip"
          {...statAnimProps}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: prefersReduced ? 0 : 0.4, ease: "easeOut" }}
        >
          <div className="stat-item">
            <span className="stat-value">
              <CountUp to={data.providers.length} suffix=" connected" />
            </span>
            <span className="stat-label">Cloud Providers</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">
              <CountUp to={avgEfficiency} suffix="%" />
            </span>
            <span className="stat-label">Avg Efficiency</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">
              <CountUp to={totalResources} suffix="+" />
            </span>
            <span className="stat-label">Resources Monitored</span>
          </div>
        </motion.div>
      )}
    </section>
  );
}
