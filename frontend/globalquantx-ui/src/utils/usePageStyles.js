import { useEffect } from "react";

export default function usePageStyles(stylePath) {
  useEffect(() => {
    if (!stylePath) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = stylePath;

    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, [stylePath]);
}

