/**
 * Текст із заглушками. Фрагменти «[ДАНІ…]» підсвічуються пунктирною рамкою,
 * щоб їх легко знайти і не сплутати зі справжніми фактами.
 */
export default function T({ children }: { children: string }) {
  const parts = children.split(/(\[ДАНІ[^\]]*\])/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("[ДАНІ") ? (
          <span key={i} className="placeholder" title="Заглушка: замініть реальними даними">
            {p}
          </span>
        ) : (
          p
        ),
      )}
    </>
  );
}
