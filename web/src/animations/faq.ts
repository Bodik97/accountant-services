import { gsap, OUT, MQ, type Cleanup } from "./gsap";

/**
 * FAQ: плавне розкриття відповіді <details>. З reduced motion — нативне миттєве.
 * data-state ставиться одразу при кліку, щоб іконка +/− реагувала без очікування кінця анімації висоти.
 */
export function setupFaq(): Cleanup {
  const offs: Cleanup[] = [];
  document.querySelectorAll<HTMLDetailsElement>("[data-faq]").forEach((d) => {
    const summary = d.querySelector("summary");
    const body = d.querySelector<HTMLElement>("[data-faq-body]");
    if (!summary || !body) return;
    const text = body.firstElementChild;
    // Нативне перемикання (reduced motion, пошук по сторінці) — синхронізуємо стан іконки
    const onToggle = () => { if (!gsap.isTweening(body)) d.dataset.state = d.open ? "open" : "closed"; };
    const onClick = (e: Event) => {
      if (matchMedia(MQ.reduce).matches) return;
      e.preventDefault();
      const opening = d.dataset.state ? d.dataset.state === "closed" : !d.open;
      d.dataset.state = opening ? "open" : "closed";
      if (opening) {
        // Якщо закриття ще триває — продовжуємо з поточної висоти, без стрибка
        const from = d.open ? body.offsetHeight : 0;
        d.open = true;
        gsap.fromTo(body, { height: from }, { height: "auto", duration: 0.45, ease: OUT, overwrite: true, clearProps: "height" });
        if (text) gsap.fromTo(text, { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: 0.4, delay: 0.05, ease: OUT, overwrite: true, clearProps: "opacity,transform" });
      } else {
        gsap.to(body, {
          height: 0, duration: 0.35, ease: "power2.inOut", overwrite: true,
          onComplete: () => {
            d.open = false;
            gsap.set(body, { clearProps: "height" });
            if (text) gsap.set(text, { clearProps: "opacity" });
          },
        });
        if (text) gsap.to(text, { opacity: 0, duration: 0.2, ease: "power1.out", overwrite: true });
      }
    };
    summary.addEventListener("click", onClick);
    d.addEventListener("toggle", onToggle);
    offs.push(() => {
      summary.removeEventListener("click", onClick);
      d.removeEventListener("toggle", onToggle);
    });
  });
  return () => offs.forEach((f) => f());
}
