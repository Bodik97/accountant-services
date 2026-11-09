"use client";

import { useEffect, useState } from "react";
import Scene3D from "@/components/three/Scene3D";
import { aboutProgress } from "@/lib/scroll-progress";

/** Телефон/планшет → спрощена сцена (нижчий DPR, без transmission і parallax). */
function useQuality() {
  const [q, setQ] = useState<"high" | "low">("high");
  useEffect(() => {
    const mq = matchMedia("(max-width: 63.98rem)");
    const set = () => setQ(mq.matches ? "low" : "high");
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);
  return q;
}

/** Клієнтські обгортки: передають у 3D-сцени спільний прогрес прокрутки. */
export function AboutScene({ className = "" }: { className?: string }) {
  const quality = useQuality();
  return <Scene3D variant="plates" quality={quality} progress={aboutProgress} label="Стос пластин — шари обліку, складені в порядок" className={className} />;
}

