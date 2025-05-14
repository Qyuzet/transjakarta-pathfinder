// @ts-nocheck
import { RouteFinder } from "@/components/algorithm/route-finder";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-screen-2xl mx-auto py-4">
        <RouteFinder />
      </div>
    </main>
  );
}
