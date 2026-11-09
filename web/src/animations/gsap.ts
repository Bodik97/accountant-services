import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, useGSAP);

export { gsap, ScrollTrigger, SplitText, useGSAP };

/** Мова руху: лише плавні виходи, без пружин і підскоків. */
export const OUT = "power3.out";
export const EXPO = "expo.out";

/** Медіа-умови для gsap.matchMedia(). */
export const MQ = {
  desktop: "(min-width: 1024px)",
  mobile: "(max-width: 1023.98px)",
  // pin «Фінансів» — лише великий екран з мишею і достатньою висотою
  pin: "(min-width: 1024px) and (hover: hover) and (min-height: 640px)",
  fine: "(hover: hover) and (pointer: fine)",
  reduce: "(prefers-reduced-motion: reduce)",
} as const;

export type Cleanup = () => void;
