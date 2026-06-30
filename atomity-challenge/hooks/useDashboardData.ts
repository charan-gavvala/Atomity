import { useState, useEffect, useRef } from "react";

export interface ResourceMetric {
  label: string;
  value: number;
  unit: string;
}

export interface CloudProvider {
  id: string;
  name: string;
  shortName: string;
  color: string;
  spend: number;
  resources: number;
  efficiency: number;
  savings: number;
}

export interface DashboardData {
  providers: CloudProvider[];
  metrics: ResourceMetric[];
  totalSpend: number;
  totalSavings: number;
  lastUpdated: string;
}

export interface CacheEntry {
  data: DashboardData;
  timestamp: number;
}

const CACHE_KEY = "atomity_dashboard_data";
const CACHE_TTL_MS = 5 * 60 * 1000;
const API_URL = "https://jsonplaceholder.typicode.com/users";

interface RawUser {
  id: number;
  name: string;
  username: string;
  email: string;
}

function transformToDashboard(rawUsers: RawUser[]): DashboardData {
  // seed = sum of first 4 user IDs from raw response
  const seed = rawUsers.slice(0, 4).reduce((sum, u) => sum + (Number(u.id) || 0), 0);
  
  const jitter = (base: number, idx: number) => {
    return Math.round(base * (1 + ((seed + idx * 7) % 20 - 10) / 100));
  };
  
  const providerBases = [
    { id: "aws", name: "Amazon Web Services", shortName: "AWS", color: "#FF9900", baseSpend: 48200, baseResources: 180 },
    { id: "azure", name: "Microsoft Azure", shortName: "Azure", color: "#0078D4", baseSpend: 31500, baseResources: 150 },
    { id: "gcp", name: "Google Cloud Platform", shortName: "GCP", color: "#4285F4", baseSpend: 22800, baseResources: 120 },
    { id: "onprem", name: "On-Premise Infrastructure", shortName: "On-Prem", color: "#6B7280", baseSpend: 14100, baseResources: 90 },
  ];
  
  const providers: CloudProvider[] = providerBases.map((p, i) => {
    const spend = jitter(p.baseSpend, i);
    const resources = jitter(p.baseResources, i);
    const savings = jitter(spend * 0.18, i);
    const efficiency = Math.round(65 + ((seed + i * 13) % 30));
    
    return {
      id: p.id,
      name: p.name,
      shortName: p.shortName,
      color: p.color,
      spend,
      resources,
      efficiency,
      savings,
    };
  });
  
  const metricBases = [
    { label: "CPU", base: 342, unit: "cores" },
    { label: "GPU", base: 48, unit: "units" },
    { label: "RAM", base: 1280, unit: "GB" },
    { label: "Storage", base: 84, unit: "TB" },
    { label: "Network", base: 920, unit: "Mbps" },
    { label: "Nodes", base: 67, unit: "active" },
  ];
  
  const metrics: ResourceMetric[] = metricBases.map((m, idx) => ({
    label: m.label,
    value: jitter(m.base, idx),
    unit: m.unit,
  }));
  
  const totalSpend = providers.reduce((sum, p) => sum + p.spend, 0);
  const totalSavings = providers.reduce((sum, p) => sum + p.savings, 0);
  
  return {
    providers,
    metrics,
    totalSpend,
    totalSavings,
    lastUpdated: new Date().toISOString(),
  };
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const hasFetched = useRef(false);
  
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    
    const loadData = async () => {
      // 1. Try sessionStorage cache read
      try {
        const cachedStr = sessionStorage.getItem(CACHE_KEY);
        if (cachedStr) {
          const cached: CacheEntry = JSON.parse(cachedStr);
          const age = Date.now() - cached.timestamp;
          if (age < CACHE_TTL_MS) {
            setData(cached.data);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        // Silent fail for cache read
      }
      
      // 2. Fetch from API if cache miss
      try {
        const res = await fetch(API_URL);
        if (!res.ok) {
          throw new Error(`Failed to fetch data: HTTP ${res.status}`);
        }
        const rawUsers = await res.json();
        const transformedData = transformToDashboard(rawUsers);
        
        // Try sessionStorage cache write
        try {
          const cacheEntry: CacheEntry = {
            data: transformedData,
            timestamp: Date.now(),
          };
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(cacheEntry));
        } catch (e) {
          // Silent fail for cache write
        }
        
        setData(transformedData);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  return { data, loading, error };
}
