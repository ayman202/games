"use client";

import { useEffect, useRef } from "react";

export default function RichTextEditor({ name, defaultValue }: { name: string; defaultValue?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const hiddenRef = useRef<HTMLInputElement>(null);
  const initialized = useRef(false);

  // Set the starting HTML exactly once, imperatively — never through a React prop.
  // This guarantees the live-typed content can never be wiped by a re-render of this
  // (or a parent) component, which is what caused the "content disappears" bug.
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    if (ref.current) ref.current.innerHTML = defaultValue || "";
    if (hiddenRef.current) hiddenRef.current.value = defaultValue || "";
  }, [defaultValue]);

  function exec(cmd: string, value?: string) {
    document.execCommand(cmd, false, value);
    sync();
  }

  function sync() {
    if (hiddenRef.current && ref.current) hiddenRef.current.value = ref.current.innerHTML;
  }

  function addImage() {
    const url = window.prompt("Image URL:");
    if (!url) return;
    exec("insertImage", url);

    // Give inserted images explicit dimensions + lazy loading (better CLS/perf scores),
    // once the browser knows the image's natural size.
    requestAnimationFrame(() => {
      const img = ref.current?.querySelector<HTMLImageElement>(`img[src="${CSS.escape(url)}"]:not([width])`);
      if (!img) return;
      img.loading = "lazy";
      const probe = new window.Image();
      probe.onload = () => {
        img.setAttribute("width", String(probe.naturalWidth));
        img.setAttribute("height", String(probe.naturalHeight));
        sync();
      };
      probe.src = url;
    });
  }

  function addLink() {
    const url = window.prompt("Link URL:");
    if (url) exec("createLink", url);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-1 mb-2">
        {[
          { label: "B", cmd: "bold", cls: "font-bold" },
          { label: "I", cmd: "italic", cls: "italic" },
          { label: "U", cmd: "underline", cls: "underline" },
          { label: "H2", cmd: "formatBlock", arg: "h2" },
          { label: "• List", cmd: "insertUnorderedList" },
          { label: "1. List", cmd: "insertOrderedList" },
        ].map((b) => (
          <button
            key={b.label}
            type="button"
            onClick={() => exec(b.cmd, (b as any).arg)}
            className={`px-2 py-1 text-xs rounded bg-black/40 border border-white/10 hover:border-accent ${b.cls || ""}`}
          >
            {b.label}
          </button>
        ))}
        <button type="button" onClick={addLink} className="px-2 py-1 text-xs rounded bg-black/40 border border-white/10 hover:border-accent">
          Link
        </button>
        <button type="button" onClick={addImage} className="px-2 py-1 text-xs rounded bg-black/40 border border-white/10 hover:border-accent">
          Image
        </button>
      </div>
      <div
        ref={ref}
        dir="auto"
        contentEditable
        suppressContentEditableWarning
        onInput={sync}
        onBlur={sync}
        className="min-h-[160px] bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent prose prose-invert max-w-none"
      />
      <input ref={hiddenRef} type="hidden" name={name} />
    </div>
  );
}
