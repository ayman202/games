import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — GameHub",
  description: "How GameHub handles accounts, cookies, and data.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl prose prose-invert">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-gray-300 leading-relaxed">
        This is placeholder text — replace it with your actual policy before launching publicly.
        GameHub stores the account details you provide at registration (name, email, a hashed
        password), your favorites list, and any message you submit through the contact form.
        A session cookie keeps you signed in; it contains no personal data beyond your account ID
        and expires automatically. We don't sell or share your data with third parties.
      </p>
      <p className="text-gray-300 leading-relaxed mt-4">
        To request deletion of your account and associated data, use the contact form or edit this
        page to add a direct process.
      </p>
    </div>
  );
}
