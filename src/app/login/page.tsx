"use client";

import { useFormState } from "react-dom";
import { loginUser } from "@/app/actions/users";
import Link from "next/link";

export default function LoginPage() {
  const [state, formAction] = useFormState(loginUser, undefined);

  return (
    <div className="max-w-sm mx-auto card p-6 mt-12">
      <h1 className="text-xl font-bold mb-4">Log in</h1>
      <form action={formAction} className="flex flex-col gap-3">
        <input name="email" type="email" placeholder="Email" required className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent" />
        <input name="password" type="password" placeholder="Password" required className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent" />
        {state?.error && <p className="text-red-400 text-sm">{state.error}</p>}
        <button className="bg-accent btn-on-accent rounded-lg py-2 font-semibold hover:opacity-90">Log in</button>
      </form>
      <p className="text-sm text-gray-400 mt-4">
        No account yet? <Link href="/register" className="text-accent2 hover:underline">Sign up</Link>
      </p>
    </div>
  );
}
