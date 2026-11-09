import { BOX, CAPTIONS, CHAOS, DOC_H, DOC_W, FOLDER, FOLDER_BACK, GRID, POCKET, STORY_DOCS, titleLines, type Pose } from "./story";

const U = 100; // 1 одиниця історії = 100 одиниць SVG
const LAYOUTS: Pose[][] = [CHAOS, GRID, FOLDER, FOLDER];

// Палітра креслення: лише кольори сайту, тонкі лінії, без тіней і плашок
const C = {
  paper: "#10221D",
  stroke: "rgba(236,238,230,0.55)",
  hair: "rgba(236,238,230,0.18)",
  text: "#ECEEE6",
  dim: "rgba(236,238,230,0.62)",
  brass: "#C9A45C",
  alert: "#E8977B",
  ink: "#0A1714",
};

/**
 * Один етап історії «хаос → порядок → папка → захищено» як лінійне креслення (SVG).
 * Анімацію (прокреслення контурів, рух документів за прокруткою) робить PageMotion через GSAP.
 */
export default function SceneSlot({ stage, className = "" }: { stage: 0 | 1 | 2 | 3; className?: string }) {
  const box = BOX[stage];
  const vb = `${(-box.w / 2) * U} ${(-box.h / 2 - box.cy) * U} ${box.w * U} ${box.h * U}`;
  const layout = LAYOUTS[stage];
  const prev = stage > 0 ? LAYOUTS[stage - 1] : null;
  const withFolder = stage >= 2;
  const hw = (DOC_W / 2) * U;
  const hh = (DOC_H / 2) * U;
  // У хаосі декларація з терміном лежить зверху
  const order = stage === 0 ? [1, 2, 3, 4, 5, 0] : [0, 1, 2, 3, 4, 5];

  return (
    <figure className={`scene-slot relative ${className}`} data-scene-slot={stage} aria-hidden="true">
      <svg className="scene-svg absolute inset-0 h-full w-full overflow-visible" viewBox={vb} preserveAspectRatio="xMidYMid meet" data-svg-stage={stage}>
        {withFolder && (
          <rect data-folder data-draw x={(-FOLDER_BACK.w / 2) * U} y={(-FOLDER_BACK.y - FOLDER_BACK.h / 2) * U} width={FOLDER_BACK.w * U} height={FOLDER_BACK.h * U} fill={C.ink} stroke={C.brass} strokeWidth="0.8" />
        )}
        {order.map((i) => {
          const d = STORY_DOCS[i];
          const p = layout[i];
          const from = prev?.[i];
          const lines = titleLines(d.title);
          const top = -hh + 16;
          const after = top + lines.length * 15.5;
          return (
            <g key={d.title} transform={`translate(${p.x * U} ${-p.y * U}) rotate(${(-p.r * 180) / Math.PI})`}>
              <g
                data-doc
                data-dx={from ? (from.x - p.x) * U : 0}
                data-dy={from ? -(from.y - p.y) * U : 0}
                data-dr={from ? (-(from.r - p.r) * 180) / Math.PI : 0}
              >
                <rect data-draw x={-hw} y={-hh} width={DOC_W * U} height={DOC_H * U} fill={C.paper} stroke={C.stroke} strokeWidth="0.8" />
                <g data-doc-text>
                  <text x={-hw + 7} y={top} fill={C.text} fontSize="13.5" fontWeight="500" style={{ fontFamily: "var(--font-onest)" }}>
                    {lines.map((l, j) => (
                      <tspan key={j} x={-hw + 7} dy={j === 0 ? 0 : 15.5} fontSize={l.length > 10 ? 12 : undefined}>{l}</tspan>
                    ))}
                  </text>
                  <text x={-hw + 7} y={after + 2} fill={C.dim} fontSize="5.6" letterSpacing="0.3" style={{ fontFamily: "var(--font-onest)" }}>
                    {d.sub.toUpperCase()}
                  </text>
                  {[1, 0.82, 0.6].map((k, j) => (
                    <line key={j} x1={-hw + 7} x2={-hw + 7 + (DOC_W * U - 14) * k} y1={after + 14 + j * 10} y2={after + 14 + j * 10} stroke={C.hair} strokeWidth="0.8" />
                  ))}
                  {d.deadline && stage <= 1 && (
                    <text data-tag x={-hw + 7} y={hh - 8} fill={C.alert} fontSize="5.6" letterSpacing="0.4" opacity={stage === 0 ? 1 : 0} style={{ fontFamily: "var(--font-onest)" }}>
                      ● {d.deadline}
                    </text>
                  )}
                </g>
              </g>
            </g>
          );
        })}
        {withFolder && (
          <g data-pocket>
            <rect x={(-POCKET.w / 2) * U} y={(-POCKET.y - POCKET.h / 2) * U} width={POCKET.w * U} height={POCKET.h * U} fill={C.ink} />
            <line data-draw x1={(-POCKET.w / 2) * U} x2={(POCKET.w / 2) * U} y1={(-POCKET.y - POCKET.h / 2) * U} y2={(-POCKET.y - POCKET.h / 2) * U} stroke={C.brass} strokeWidth="0.8" />
            <text x="0" y={(-POCKET.y - 0.06) * U} textAnchor="middle" fill={C.text} fontSize="15" style={{ fontFamily: "var(--font-literata)" }}>Сальдо.</text>
            <text x="0" y={(-POCKET.y + 0.07) * U} textAnchor="middle" fill={C.dim} fontSize="5" letterSpacing="0.8" style={{ fontFamily: "var(--font-onest)" }}>БУХГАЛТЕРІЯ · 2026</text>
            {stage === 3 && (
              <g data-seal>
                <line data-draw x1={(-POCKET.w / 2 + 0.12) * U} x2={(POCKET.w / 2 - 0.12) * U} y1={(-POCKET.y + 0.25) * U} y2={(-POCKET.y + 0.25) * U} stroke={C.brass} strokeWidth="0.8" />
                <text data-seal-text x="0" y={(-POCKET.y + 0.37) * U} textAnchor="middle" fill={C.brass} fontSize="6" fontWeight="600" letterSpacing="1" style={{ fontFamily: "var(--font-onest)" }}>
                  ЗАХИЩЕНО ДОГОВОРОМ
                </text>
              </g>
            )}
          </g>
        )}
      </svg>
      <figcaption className="caption absolute inset-x-0 -bottom-8 text-center uppercase tracking-[0.12em] text-bone-dim">
        {CAPTIONS[stage]}
      </figcaption>
    </figure>
  );
}
