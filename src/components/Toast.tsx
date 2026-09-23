"use client";

import { useToast } from "@/lib/toast-context";

export function Toast() {
  const { message, visible } = useToast();

  return (
    <div id="toast" className={visible ? "show" : ""} role="status">
      {message}
    </div>
  );
}
