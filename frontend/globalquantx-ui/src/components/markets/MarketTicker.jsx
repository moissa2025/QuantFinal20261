import { useEffect, useState } from "react";

export default function MarketTicker({ symbol, price }) {
  const [flash, setFlash] = useState(null);

  useEffect(() => {
    if (!price) return;

    setFlash("flash-up");
    const timeout = setTimeout(() => setFlash(null), 300);

    return () => clearTimeout(timeout);
  }, [price]);

  return (
    <div className={`ticker ${flash}`}>
      <span className="ticker-symbol">{symbol}</span>
      <span className="ticker-price">{price}</span>
    </div>
  );
}

