import { steps } from "@/content/site";
import SectionHead from "@/components/ui/SectionHead";
import Card from "@/components/ui/Card";
import T from "@/components/ui/T";
import ProcessPath from "./ProcessPath";

/**
 * Етапи співпраці — послідовність, тому нумерація доречна.
 * Картки в шаховому порядку (ліво/право), номери-«вузли» стоять у коридорі між ними,
 * а хвиляста лінія (ProcessPath) з'єднує їх по черзі і малюється з прокруткою.
 */
export default function Process() {
  const last = steps.length - 1;
  return (
    <section id="process" className="section-y overflow-x-clip bg-white">
      <div className="container-x">
        <SectionHead label="Співпраця" title="Як починаємо співпрацю" />
        <ol className="relative mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 md:gap-x-32 md:gap-y-4">
          <ProcessPath />
          {steps.map((s, i) => {
            const right = i % 2 === 1;
            return (
              <li
                key={s.title}
                data-step
                className={`relative w-[86%] md:w-auto ${right ? "ml-auto md:col-start-2 md:ml-0" : "md:col-start-1"} ${i > 0 ? "md:-mt-16" : ""}`}
                style={{ gridRow: `${i + 1}` }}
              >
                {/* Вузол лінії з номером — на краю картки, що дивиться в бік лінії (ліва картка → справа, права → зліва) */}
                <span
                  data-step-dot
                  className={`absolute top-7 z-10 grid size-11 place-items-center rounded-full border-2 border-black bg-white font-display text-[1rem] font-semibold tabular-nums transition-colors duration-500 [&.is-reached]:bg-black [&.is-reached]:text-white ${
                    right ? "-left-[1.375rem]" : "-right-[1.375rem]"
                  }`}
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <Card variant={i === last ? "dark" : "light"} radius="lg" className="flex flex-col p-6 sm:p-7" data-tilt>
                  <div className="flex items-center justify-between gap-3">
                    <span className={`caption ${i === last ? "text-gray-mid" : "text-gray-text"}`}>Крок {i + 1} з {steps.length}</span>
                    <span className={`rounded-full px-3 py-1 text-[0.75rem] ${i === last ? "bg-white/10 text-gray-light" : "bg-white text-gray-text"}`}><T>{s.when}</T></span>
                  </div>
                  <h3 className="mt-6 text-[1.25rem] sm:text-[1.375rem]">{s.title}</h3>
                  <p className={`mt-2 text-[0.9375rem] ${i === last ? "text-gray-mid" : "text-gray-text"}`}>{s.text}</p>
                </Card>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
