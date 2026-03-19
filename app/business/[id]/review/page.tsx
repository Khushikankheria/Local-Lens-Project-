"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { StarRatingInput } from "../../../../components/StarRatingInput";
import { businesses } from "../../../../lib/mockData";
import { useAuth } from "../../../../components/AuthProvider";
import { createOverall, getPendingUserReviews, upsertPendingReview } from "../../../../lib/userStorage";

export default function AddEditReviewPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { state } = useAuth();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const business = useMemo(() => businesses.find((b) => b.id === params.id), [params.id]);

  const existing = useMemo(() => {
    if (state.status !== "authenticated") return null;
    return (
      getPendingUserReviews().find(
        (r) => r.businessId === params.id && r.userEmail === state.user.email
      ) ?? null
    );
  }, [params.id, state]);

  const [title, setTitle] = useState(existing?.title ?? "");
  const [body, setBody] = useState(existing?.body ?? "");
  const [quality, setQuality] = useState(existing?.ratings.quality ?? 0);
  const [service, setService] = useState(existing?.ratings.service ?? 0);
  const [value, setValue] = useState(existing?.ratings.value ?? 0);
  const [images, setImages] = useState<string[]>(existing?.images ?? []);
  const [isPending, setIsPending] = useState(false);

  if (!business) {
    return (
      <main className="bg-zinc-50">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center">
            <div className="text-sm font-semibold text-zinc-950">Business not found</div>
            <Link href="/" className="mt-3 inline-block text-sm font-medium text-blue-700 hover:text-blue-800">Go home</Link>
          </div>
        </div>
      </main>
    );
  }

  const businessId = business.id;

  const canSubmit =
    title.trim().length > 0 &&
    body.trim().length > 0 &&
    quality > 0 &&
    service > 0 &&
    value > 0 &&
    !isPending;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || state.status !== "authenticated") return;

    setIsPending(true);

    upsertPendingReview({
      id: existing?.id ?? `pending-${businessId}-${Date.now()}`,
      businessId,
      authorName: state.user.email,
      userEmail: state.user.email,
      createdAtISO: new Date().toISOString(),
      ratings: { quality, service, value },
      overall: createOverall({ quality, service, value }),
      title,
      body,
      images,
      status: "pending",
    });

    await new Promise<void>((r) => window.setTimeout(r, 500));
    router.push(`/business/${businessId}`);
  }

  return (
    <main className="bg-zinc-50">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-4">
          <Link href={`/business/${businessId}`} className="text-sm font-medium text-blue-700 hover:text-blue-800">
            ← Back to business
          </Link>
        </div>

        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h1 className="text-xl font-semibold text-zinc-950">{existing ? "Edit" : "Add"} Review</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Your review for <span className="font-medium">{business.name}</span> will be submitted as pending.
          </p>

          <form onSubmit={onSubmit} className="mt-5 space-y-4">
            <label className="block">
              <div className="text-xs font-semibold text-zinc-700">Title</div>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-950"
                placeholder="Summarize your experience"
              />
            </label>

            <label className="block">
              <div className="text-xs font-semibold text-zinc-700">Review text</div>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={6}
                className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-950"
                placeholder="Write your detailed review"
              />
            </label>

            <div className="grid gap-2 sm:grid-cols-3">
              <StarRatingInput label="Quality" value={quality} onChange={setQuality} />
              <StarRatingInput label="Service" value={service} onChange={setService} />
              <StarRatingInput label="Value" value={value} onChange={setValue} />
            </div>

            <div className="rounded-xl border border-zinc-200 p-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-zinc-700">Upload images</div>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="inline-flex h-8 items-center rounded-lg border border-zinc-200 px-3 text-xs font-medium text-zinc-800 hover:bg-zinc-50"
                >
                  Choose files
                </button>
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []);
                  files.forEach((file) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                      if (typeof reader.result === "string") {
                        const nextImage = reader.result;
                        setImages((prev) => [...prev, nextImage]);
                      }
                    };
                    reader.readAsDataURL(file);
                  });
                }}
              />

              {images.length > 0 ? (
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {images.map((src, idx) => (
                    <div key={`${idx}-${src.slice(0, 20)}`} className="relative overflow-hidden rounded-lg border border-zinc-200">
                      <img src={src} alt={`Selected ${idx + 1}`} className="h-20 w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                        className="absolute right-1 top-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            {state.status !== "authenticated" ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                Please log in first to submit a review.
              </div>
            ) : null}

            <button
              type="submit"
              disabled={!canSubmit || state.status !== "authenticated"}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Submitting..." : existing ? "Update review (pending)" : "Submit review (pending)"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
