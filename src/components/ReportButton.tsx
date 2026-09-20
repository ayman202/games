"use client";

import { useState } from "react";
import { submitReport } from "@/app/actions/reports";

export default function ReportButton({ gameId, linkId }: { gameId?: string; linkId?: string }) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);

  if (sent) return <p className="text-xs text-accent2">Thanks — reported to the team.</p>;

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="text-xs text-gray-500 hover:text-red-400 underline">
        Report a problem
      </button>
    );
  }

  return (
    <form
      action={async (formData) => {
        await submitReport(formData);
        setSent(true);
      }}
      className="card p-3 text-xs flex flex-col gap-2 mt-2"
    >
      {gameId && <input type="hidden" name="gameId" value={gameId} />}
      {linkId && <input type="hidden" name="linkId" value={linkId} />}
      <select name="reason" required className="bg-black/30 border border-white/10 rounded px-2 py-1">
        <option value="">Choose a reason...</option>
        <option value="dead_link">Dead / broken link</option>
        <option value="wrong_content">Wrong file / mismatched content</option>
        <option value="malware">Suspected malware</option>
        <option value="other">Other</option>
      </select>
      <textarea name="message" placeholder="Details (optional)" rows={2} className="bg-black/30 border border-white/10 rounded px-2 py-1" />
      <div className="flex gap-2">
        <button className="bg-red-500/80 text-white rounded px-3 py-1">Send report</button>
        <button type="button" onClick={() => setOpen(false)} className="text-gray-400">Cancel</button>
      </div>
    </form>
  );
}
