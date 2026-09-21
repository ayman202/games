"use client";

import { useFormState } from "react-dom";
import { login } from "@/app/actions/auth";

export default function LoginPage() {
  const [state, formAction] = useFormState(login, undefined);

  return (
    <div className="max-w-sm mx-auto card p-6 mt-12">
      <h1 className="text-xl font-bold mb-4">Admin login</h1>
      <form action={formAction} className="flex flex-col gap-3">
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent"
        />
        {state?.error && <p className="text-red-400 text-sm">{state.error}</p>}
        <button className="bg-accent text-white rounded-lg py-2 font-semibold hover:opacity-90">
          Sign in
        </button>
      </form>
    </div>
  );
}
