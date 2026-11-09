/** Локальні іконки віджетів (SVG, stroke 1.75, aria-hidden). */
type P = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

export function TrendUp({ className = "size-3.5" }: P) {
  return (
    <svg className={className} {...base}>
      <path d="M4 16l5-5 4 4 7-7M15 8h5v5" />
    </svg>
  );
}

export function Calendar({ className = "size-4" }: P) {
  return (
    <svg className={className} {...base}>
      <rect x="4" y="5.5" width="16" height="14" rx="3" />
      <path d="M8 3.5v4M16 3.5v4M4 10h16" />
    </svg>
  );
}

export function Receipt({ className = "size-4" }: P) {
  return (
    <svg className={className} {...base}>
      <path d="M6 3.5h12v17l-3-2-3 2-3-2-3 2z" />
      <path d="M9 8.5h6M9 12h6M9 15.5h3" />
    </svg>
  );
}

export function Document({ className = "size-4" }: P) {
  return (
    <svg className={className} {...base}>
      <path d="M7 3.5h7l4 4v13H7z" />
      <path d="M14 3.5v4h4M10 12.5h5M10 16h5" />
    </svg>
  );
}

export function Contactless({ className = "size-5" }: P) {
  return (
    <svg className={className} {...base}>
      <path d="M8.5 9a5 5 0 010 6M12 6.5a9 9 0 010 11M15.5 4a13 13 0 010 16" />
    </svg>
  );
}
