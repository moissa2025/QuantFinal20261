import React from "react";

const stats = [
  { label: "Markets", value: "120+" },
  { label: "Latency", value: "< 2ms" },
  { label: "Strategies", value: "300+" },
  { label: "Uptime", value: "99.99%" },
];

const tickers = [
  { symbol: "ESZ4", name: "S&P 500 Futures", value: "5,243.25", change: "+0.42%" },
  { symbol: "NQZ4", name: "Nasdaq Futures", value: "18,342.75", change: "+0.61%" },
  { symbol: "CLZ4", name: "WTI Crude", value: "78.12", change: "-0.38%" },
  { symbol: "EURUSD", name: "EUR / USD", value: "1.0842", change: "+0.11%" },
  { symbol: "BTCUSD", name: "Bitcoin", value: "68,420", change: "+1.92%" },
];

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-50">
      {/* Top nav */}
      <header className="w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-emerald-400/10 border border-emerald-400/40 flex items-center justify-center text-xs font-semibold tracking-widest text-emerald-300">
              GQX

            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-[0.18em] uppercase text-slate-300">
                GlobalQuantX
              </span>
              <span className="text-xs text-slate-500">
                Institutional Trading OS
              </span>



          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
            <button className="hover:text-emerald-300 transition-colors">
              Platform
            </button>
            <button className="hover:text-emerald-300 transition-colors">
              Risk & Compliance
            </button>
            <button className="hover:text-emerald-300 transition-colors">
              Connectivity
            </button>
            <button className="hover:text-emerald-300 transition-colors">
              Documentation
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button className="text-xs font-medium text-slate-300 hover:text-emerald-300 transition-colors">
              Login
            </button>
            <button className="text-xs font-semibold px-3 py-2 rounded-md bg-emerald-400 text-slate-950 hover:bg-emerald-300 transition-colors">
              Request Access
            </button>


      </header>

      {/* Hero + chart */}
      <main className="flex-1">
        <section className="border-b border-slate-800 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
          <div className="mx-auto max-w-6xl px-4 py-12 md:py-20 grid md:grid-cols-2 gap-10 items-center">
            {/* Hero copy */}
            <div className="space-y-6">
              <p className="text-xs font-semibold tracking-[0.25em] uppercase text-emerald-300">
                Institutional Execution • Risk • Observability
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-50">
                A single operating system for{" "}
                <span className="text-emerald-300">
                  institutional trading infrastructure.
                </span>
              </h1>
              <p className="text-sm md:text-base text-slate-400 max-w-xl">
                GlobalQuantX unifies execution, risk, liquidity, and observability into a
                single, audit‑ready trading OS—designed for desks that cannot afford
                blind spots.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <button className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-emerald-400 text-slate-950 text-xs font-semibold hover:bg-emerald-300 transition-colors">
                  Launch Trading OS
                </button>
                <button className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-slate-700 text-xs font-semibold text-slate-200 hover:border-emerald-300 hover:text-emerald-300 transition-colors">
                  View Architecture Brief
                </button>


              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="border border-slate-800 rounded-md px-3 py-3 bg-slate-900/40"
                  >
                    <div className="text-xs text-slate-400">{s.label}</div>
                    <div className="text-sm font-semibold text-slate-50">
                      {s.value}


                ))}



            {/* “Animated” chart + tickers */}
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-[0_0_40px_rgba(16,185,129,0.15)]">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-medium text-slate-300">
                    Global Execution Telemetry

                  <div className="text-[10px] text-slate-500">
                    Live • Synthetic demo


                {/* Fake animated chart using gradients + bars */}
                <div className="h-40 relative overflow-hidden rounded-md bg-slate-950/80 border border-slate-800">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_55%)]" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end gap-1 px-3 pb-2">
                    {Array.from({ length: 32 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-sm bg-emerald-400/70 animate-pulse"
                        style={{
                          height: `${20 + ((i * 37) % 60)}%`,
                          animationDelay: `${i * 80}ms`,
                          opacity: 0.4 + ((i * 13) % 40) / 100,
                        }}
                      />
                    ))}


                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Order flow, slippage, venue quality</span>
                  <span className="text-emerald-300">Latency‑aware routing</span>



              {/* Ticker strip */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/70 overflow-hidden">
                <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-300">
                    Market snapshot
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Synthetic data for preview
                  </span>

                <div className="relative overflow-hidden">
                  <div className="flex animate-[ticker_30s_linear_infinite]">
                    {[...tickers, ...tickers].map((t, idx) => {
                      const positive = t.change.startsWith("+");
                      return (
                        <div
                          key={idx}
                          className="min-w-[180px] px-4 py-2 border-r border-slate-800 flex flex-col gap-0.5 bg-slate-900/60"
                        >
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-medium text-slate-200">
                              {t.symbol}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {t.name}
                            </span>

                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-semibold text-slate-50">

