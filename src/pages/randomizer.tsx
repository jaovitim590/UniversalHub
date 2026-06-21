import React from "react";
import RandomizerWheel from "../components/RandomizerWheel";

export default function RandomizerPage(): JSX.Element {
  return (
    <main className="relative flex min-h-[calc(100vh-64px)] items-start justify-center bg-background px-6 py-8">
      <section className="w-full max-w-4xl rounded-2xl border border-white/10 bg-card/80 p-6 shadow-lg">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Randomizer</h1>
          <p className="text-sm text-muted-foreground">Roleta de sorteio — opções removíveis.</p>
        </header>

        <div>
          {/* Reaproveita o componente existente em src/components/RandomizerWheel.tsx */}
          <RandomizerWheel />
        </div>
      </section>
    </main>
  );
}
