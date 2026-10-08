"use client";

import { useFormState } from "react-dom";
import { updateOwnAccount } from "@/app/actions/account";

export default function AccountForm({ name, email }: { name: string; email: string }) {
  const [state, formAction] = useFormState(updateOwnAccount, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4 max-w-md">
      <div>
        <label className="block text-sm text-gray-400 mb-1">Name</label>
        <input name="name" defaultValue={name} required className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent" />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Email</label>
        <input name="email" type="email" defaultValue={email} required className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent" />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">New password (leave blank to keep current)</label>
        <input name="newPassword" type="password" className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent" />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Current password (required to change email or password)</label>
        <input name="currentPassword" type="password" className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent" />
      </div>
      {state?.error && <p className="text-red-400 text-sm">{state.error}</p>}
      {state?.ok && <p className="text-accent2 text-sm">Saved.</p>}
      <button className="bg-accent btn-on-accent rounded-lg py-2 font-semibold self-start px-6">Save</button>
    </form>
  );
}
