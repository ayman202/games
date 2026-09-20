"use client";

import { useTransition } from "react";
import { checkLinkStatus } from "@/app/actions/games";

export default function CheckLinkButton({ linkId }: { linkId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => checkLinkStatus(linkId))}
      disabled={pending}
      className="text-accent2 hover:underline text-sm disabled:opacity-50"
    >
      {pending ? "Checking..." : "Check now"}
    </button>
  );
}
