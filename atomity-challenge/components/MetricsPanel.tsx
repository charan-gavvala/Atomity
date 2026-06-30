"use client";

import { motion } from "framer-motion";
import { ResourceMetric } from "@/hooks/useDashboardData";
import { CountUp } from "./CountUp";

interface MetricsPanelProps {
  metrics: ResourceMetric[];
  totalSpend: number;
  totalSavings: number;
}

export function MetricsPanel({ metrics, totalSpend, totalSavings }: MetricsPanelProps) {
  const maxVal = Math.max(...metrics.map((m) => m.value), 1);

  return (
    <motion.div
      className="metrics-panel col-start-1 row-start-3 md:col-span-2 md:col-start-1 md:row-start-3 lg:col-span-1 lg:col-start-2 lg:row-start-2"
      initial={{ opacity: 0, scale: 0.88, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Panel Header */}
      <div className="panel-header">
        <span className="panel-title">Resource Intelligence</span>
        <div className="panel-badge">
          <span className="badge-dot" />
          Live
        </div>
      </div>

      {/* KPI Row */}
      <div className="kpi-row">
        <div className="kpi">
          <span className="kpi-label">Total Spend</span>
          <span className="kpi-value">
            $<CountUp to={totalSpend / 1000} decimals={1} suffix="k" />
          </span>
        </div>
        <div className="kpi-divider" />
        <div className="kpi">
          <span className="kpi-label">Savings Found</span>
          <span className="kpi-value kpi-savings">
            $<CountUp to={totalSavings / 1000} decimals={1} suffix="k" />
          </span>
        </div>
      </div>

      {/* Resource Bars */}
      <div className="resource-bars" role="list" aria-label="Resource utilization">
        {metrics.map((metric, i) => (
          <div key={metric.label} className="bar-item" role="listitem">
            <motion.div
              className="bar-track"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
              style={{ originY: 1 }}
            >
              <motion.div
                className="bar-fill"
                style={{ height: `${(metric.value / maxVal) * 100}%` }}
                whileHover={{ filter: "brightness(1.2)" }}
              />
            </motion.div>
            <span className="bar-label">{metric.label}</span>
            <span className="bar-value">
              <CountUp to={metric.value} suffix={` ${metric.unit}`} duration={1.2} />
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
