"use client";

import { useEffect } from "react";

export default function CopyProtection() {
  useEffect(() => {
    const block = (e: Event) => e.preventDefault();
    document.addEventListener("contextmenu", block);
    document.addEventListener("copy", block);
    document.addEventListener("cut", block);
    document.body.style.userSelect = "none";
    return () => {
      document.removeEventListener("contextmenu", block);
      document.removeEventListener("copy", block);
      document.removeEventListener("cut", block);
      document.body.style.userSelect = "";
    };
  }, []);

  return null;
}
