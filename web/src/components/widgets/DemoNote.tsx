/** Підпис, що цифри у віджеті — приклад інтерфейсу, а не статистика компанії. */
export default function DemoNote({ on = "light" }: { on?: "light" | "dark" }) {
  return <span className={`text-[0.6875rem] leading-none ${on === "dark" ? "text-gray-mid" : "text-gray-text"}`}>Приклад інтерфейсу</span>;
}
