"use client";

import { useState } from "react";
import RichTextEditor from "@/components/RichTextEditor";

type LinkRow = { label: string; url: string; provider: string };

type Category = { id: string; name: string };

type Props = {
  action: (formData: FormData) => void;
  categories: Category[];
  initial?: {
    title?: string;
    description?: string;
    overview?: string;
    note?: string;
    coverImage?: string;
    version?: string;
    sizeLabel?: string;
    categoryId?: string;
    status?: string;
    publishAt?: string;
    metaTitle?: string;
    metaDescription?: string;
    videoUrl?: string;
    systemRequirements?: { os?: string; cpu?: string; gpu?: string; ram?: string; storage?: string; extra?: { label: string; value: string }[] };
    tags?: string;
    imageUrls?: string;
    links?: LinkRow[];
  };
  submitLabel: string;
};

const PROVIDERS = ["direct", "google-drive", "mega", "mediafire", "torrent", "onedrive"];

export default function GameForm({ action, categories, initial, submitLabel }: Props) {
  const [links, setLinks] = useState<LinkRow[]>(
    initial?.links?.length ? initial.links : [{ label: "Direct Download", url: "", provider: "direct" }]
  );
  const [status, setStatus] = useState(initial?.status || "PUBLISHED");
  const [extraReqs, setExtraReqs] = useState<{ label: string; value: string }[]>(
    initial?.systemRequirements?.extra?.length ? initial.systemRequirements.extra : []
  );

  return (
    <form action={action} className="flex flex-col gap-4 max-w-3xl">
      <div>
        <label className="block text-sm text-gray-400 mb-1">Title</label>
        <input name="title" defaultValue={initial?.title} required className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent" />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Description</label>
        <RichTextEditor name="description" defaultValue={initial?.description} />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Overview <span className="text-gray-600">(optional short summary)</span></label>
        <textarea name="overview" defaultValue={initial?.overview} rows={2} placeholder="A one or two line summary shown above the full description" className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent" />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Note <span className="text-gray-600">(optional callout, e.g. install instructions or a warning)</span></label>
        <textarea name="note" defaultValue={initial?.note} rows={2} placeholder="Shown in a highlighted box on the game page" className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Cover image URL</label>
          <input name="coverImage" defaultValue={initial?.coverImage} className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent" />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Category</label>
          <select name="categoryId" defaultValue={initial?.categoryId} className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent">
            <option value="">No category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Version</label>
          <input name="version" defaultValue={initial?.version} className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent" />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Size label</label>
          <input name="sizeLabel" defaultValue={initial?.sizeLabel} placeholder="e.g. 12 GB" className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent" />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Tags (comma separated)</label>
        <input name="tags" defaultValue={initial?.tags} placeholder="Multiplayer, Open World, 2026" className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent" />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Gallery image URLs (one per line)</label>
        <textarea name="imageUrls" defaultValue={initial?.imageUrls} rows={3} className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Status</label>
          <select
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent"
          >
            <option value="DRAFT">Draft</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="PUBLISHED">Published</option>
            <option value="HIDDEN">Hidden</option>
          </select>
        </div>
        {status === "SCHEDULED" && (
          <div>
            <label className="block text-sm text-gray-400 mb-1">Publish at</label>
            <input type="datetime-local" name="publishAt" defaultValue={initial?.publishAt} className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent" />
          </div>
        )}
      </div>

      <details className="card p-3">
        <summary className="cursor-pointer text-sm text-gray-300">SEO (optional)</summary>
        <div className="mt-3 flex flex-col gap-3">
          <input name="metaTitle" defaultValue={initial?.metaTitle} placeholder="Custom meta title" className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent" />
          <textarea name="metaDescription" defaultValue={initial?.metaDescription} placeholder="Custom meta description" rows={2} className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent" />
        </div>
      </details>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Trailer video URL <span className="text-gray-600">(YouTube or Vimeo only)</span></label>
        <input name="videoUrl" defaultValue={initial?.videoUrl} placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..." className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent" />
      </div>

      <details className="card p-3" open={!!initial?.systemRequirements}>
        <summary className="cursor-pointer text-sm text-gray-300">System requirements (optional)</summary>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <input name="sysOs" defaultValue={initial?.systemRequirements?.os} placeholder="OS (e.g. Windows 10/11 64-bit)" className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent" />
          <input name="sysCpu" defaultValue={initial?.systemRequirements?.cpu} placeholder="CPU" className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent" />
          <input name="sysGpu" defaultValue={initial?.systemRequirements?.gpu} placeholder="GPU" className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent" />
          <input name="sysRam" defaultValue={initial?.systemRequirements?.ram} placeholder="RAM (e.g. 16 GB)" className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent" />
          <input name="sysStorage" defaultValue={initial?.systemRequirements?.storage} placeholder="Storage (e.g. 60 GB SSD)" className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent col-span-2" />
        </div>

        <div className="mt-3">
          <p className="text-xs text-gray-500 mb-2">Add any other requirement (e.g. "DirectX": "Version 12")</p>
          {extraReqs.map((row, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input name="sysExtraLabel" defaultValue={row.label} placeholder="Label" className="w-1/3 bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent" />
              <input name="sysExtraValue" defaultValue={row.value} placeholder="Value" className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent" />
            </div>
          ))}
          <button type="button" onClick={() => setExtraReqs([...extraReqs, { label: "", value: "" }])} className="text-sm text-accent2 hover:underline">
            + Add requirement
          </button>
        </div>
      </details>

      <div>
        <label className="block text-sm text-gray-400 mb-2">Download links</label>
        <div className="flex flex-col gap-2">
          {links.map((row, i) => (
            <div key={i} className="flex gap-2">
              <input name="linkLabel" defaultValue={row.label} placeholder="Label" className="w-1/4 bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent" />
              <select name="linkProvider" defaultValue={row.provider} className="w-1/4 bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent">
                {PROVIDERS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <input name="linkUrl" defaultValue={row.url} placeholder="https://..." className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent" />
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setLinks([...links, { label: "", url: "", provider: "direct" }])} className="mt-2 text-sm text-accent2 hover:underline">
          + Add another link
        </button>
      </div>

      <button className="bg-accent btn-on-accent rounded-lg py-2 font-semibold hover:opacity-90 mt-2">{submitLabel}</button>
    </form>
  );
}
