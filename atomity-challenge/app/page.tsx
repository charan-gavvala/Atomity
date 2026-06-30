import "./globals.css";
import CloudDashboard from "../components/CloudDashboard";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[var(--color-bg-primary)]">
      <CloudDashboard />
    </main>
  );
}
