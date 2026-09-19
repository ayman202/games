"use client";

import { useState } from "react";

type LinkRow = { label: string; url: string };

type Props = {
  action: (formData: FormData) => void;
  initial?: {
    title?: string;
    description?: string;
    coverImage?: string;
    version?: string;
    sizeLabel?: string;
    category?: string;
    links?: LinkRow[];
  };
  submitLabel: string;
};

export default function GameForm({ action, initial, submitLabel }: Props) {
  const [links, setLinks] = useState<LinkRow[]>(
    initial?.links?.length ? initial.links : [{ label: "Direct Download", url: "" }]
  );

  return (
    <form action={action} className="flex flex-col gap-4 max-w-2xl">
      <div>
        <label className="block text-sm text-gray-400 mb-1">Title</label>
        <input
          name="title"
          defaultValue={initial?.title}
          required
          className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Description</label>
        <textarea
          name="description"
          defaultValue={initial?.description}
          rows={5}
          className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Cover image URL</label>
          <input
            name="coverImage"
            defaultValue={initial?.coverImage}
            className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Category</label>
          <input
            name="category"
            defaultValue={initial?.category}
            className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Version</label>
          <input
            name="version"
            defaultValue={initial?.version}
            className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Size label</label>
          <input
            name="sizeLabel"
            defaultValue={initial?.sizeLabel}
            placeholder="e.g. 12 GB"
            className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">Download links</label>
        <div className="flex flex-col gap-2">
          {links.map((row, i) => (
            <div key={i} className="flex gap-2">
              <input
                name="linkLabel"
                defaultValue={row.label}
                placeholder="Label"
                className="w-1/3 bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent"
              />
              <input
                name="linkUrl"
                defaultValue={row.url}
                placeholder="https://..."
                className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent"
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setLinks([...links, { label: "", url: "" }])}
          className="mt-2 text-sm text-accent2 hover:underline"
        >
          + Add another link
        </button>
      </div>

      <button className="bg-accent text-white rounded-lg py-2 font-semibold hover:opacity-90 mt-2">
        {submitLabel}
      </button>
    </form>
  );
}
