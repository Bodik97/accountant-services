"use client";

import type { ReactNode } from "react";
import Button from "@/components/ui/Button";

/** Подія, на яку шапка відкриває вікно заявки на консультацію (LeadModal живе в Header). */
export const OPEN_CONSULT = "consult:open";

/** Кнопка, що відкриває вікно заявки (а не прокручує до форми внизу). */
type Props = { surface?: "light" | "dark"; arrow?: boolean; size?: "md" | "sm"; className?: string; children: ReactNode };

export default function ConsultButton(props: Props) {
  return <Button {...props} aria-haspopup="dialog" onClick={() => window.dispatchEvent(new Event(OPEN_CONSULT))} />;
}
