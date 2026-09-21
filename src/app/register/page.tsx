"use client";

import { useFormState } from "react-dom";
import { registerUser } from "@/app/actions/users";
import Link from "next/link";

export default function RegisterPage() {
  const [state, formAction] = useFormState(registerUser, undefined);

  return (
    <div className="max-w-sm mx-auto card p-6 mt-12">
      <h1 className="text-xl font-bold mb-4">Create an account</h1>
      <form action={formAction} className="flex flex-col gap-3">
        <input name="name" placeholder="Name" required className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent" />
        <input name="email" type="email" placeholder="Email" required className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent" />
        <input name="password" type="password" placeholder="Password (min 6 chars)" required className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent" />
        {state?.error && <p className="text-red-400 text-sm">{state.error}</p>}
        <button className="bg-accent text-white rounded-lg py-2 font-semibold hover:opacity-90">Sign up</button>
      </form>
      <p className="text-sm text-gray-400 mt-4">
        Already have an account? <Link href="/login" className="text-accent2 hover:underline">Log in</Link>
      </p>
    </div>
  );
}
