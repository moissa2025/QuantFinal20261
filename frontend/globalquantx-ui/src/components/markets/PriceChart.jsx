import { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

export default function PriceChart({ candles = [] }) {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);

  //
  // 1. INITIALIZE CHART
  //
  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart instance
    chartRef.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 300,
      layout: {
        background: { color: "transparent" },
        textColor: "#ccc",
      },
      grid: {
        vertLines: { color: "rgba(255,255,255,0.05)" },
        horzLines: { color: "rgba(255,255,255,0.05)" },
      },
      crosshair: {
        mode: 1,
      },
      timeScale: {
        borderColor: "rgba(255,255,255,0.1)",
      },
    });

    // Add candlestick series
    seriesRef.current = chartRef.current.addCandlestickSeries({
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

    //
    // 2. HANDLE WINDOW RESIZE
    //
    const handleResize = () => {
      if (!chartRef.current || !chartContainerRef.current) return;

      chartRef.current.applyOptions({
        width: chartContainerRef.current.clientWidth,
      });
    };

    window.addEventListener("resize", handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      chartRef.current.remove();
    };
  }, []);

  //
  // 3. UPDATE CANDLES WHEN DATA CHANGES
  //
  useEffect(() => {
    if (seriesRef.current && candles.length > 0) {
      seriesRef.current.setData(candles);
    }
  }, [candles]);

  return (
    <div
      ref={chartContainerRef}
      style={{
        width: "100%",
        height: "300px",
        background: "var(--surface)",
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-sm)",
      }}
    />
  );
}

