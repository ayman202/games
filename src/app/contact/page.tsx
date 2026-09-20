"use client";

import { useFormState } from "react-dom";
import { submitContactMessage } from "@/app/actions/contact";

export default function ContactPage() {
  const [state, formAction] = useFormState(submitContactMessage, undefined);

  return (
    <div className="max-w-md">
      <h1 className="text-3xl font-bold mb-4">Contact us</h1>
      {state?.ok ? (
        <p className="text-accent2">Thanks — your message was received.</p>
      ) : (
        <form action={formAction} className="flex flex-col gap-3">
          <input name="name" placeholder="Your name" required className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent" />
          <input name="email" type="email" placeholder="Your email" required className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent" />
          <textarea name="message" placeholder="Message" rows={5} required className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent" />
          {state?.error && <p className="text-red-400 text-sm">{state.error}</p>}
          <button className="bg-accent text-white rounded-lg py-2 font-semibold hover:opacity-90">Send</button>
        </form>
      )}
      <p className="text-xs text-gray-500 mt-4">
        Messages are saved to the database (ContactMessage table) — check the admin panel or your DB directly.
      </p>
    </div>
  );
}
