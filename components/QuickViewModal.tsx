"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export function QuickViewModal({
  open,
  productHandle,
  onClose,
}: {
  open: boolean;
  productHandle: string | null;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const lastActiveElRef = useRef<HTMLElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<any>(null);

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    {}
  );

  const [ctaState, setCtaState] = useState<"idle" | "loading" | "success">(
    "idle"
  );
  const timeoutRef = useRef<number | null>(null);

  // ESC to close
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // scroll lock + focus in/out
  useEffect(() => {
    if (!open) return;

    lastActiveElRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    setTimeout(() => dialogRef.current?.focus(), 0);

    return () => {
      document.body.style.overflow = "";
      lastActiveElRef.current?.focus?.();
    };
  }, [open]);

  // ✅ Focus trap (TAB stays inside modal)
  useEffect(() => {
    if (!open) return;

    const modal = dialogRef.current;
    if (!modal) return;

    const focusableSelectors =
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

    const focusableEls = Array.from(
      modal.querySelectorAll<HTMLElement>(focusableSelectors)
    );

    if (focusableEls.length === 0) return;

    const firstEl = focusableEls[0];
    const lastEl = focusableEls[focusableEls.length - 1];

    function handleTab(e: KeyboardEvent) {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    }

    modal.addEventListener("keydown", handleTab);
    return () => modal.removeEventListener("keydown", handleTab);
  }, [open]);

  // reset UI when switching products / opening
  useEffect(() => {
    if (!open) return;

    setSelectedOptions({});
    setCtaState("idle");

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [open, productHandle]);

  // cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  // fetch product
  useEffect(() => {
    if (!open || !productHandle) return;

    let active = true;
    setLoading(true);
    setProduct(null);

    fetch(`/api/product/${productHandle}`)
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        setProduct(data);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setProduct({ error: "Failed to load product" });
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [open, productHandle]);

  const variants = product?.variants?.nodes ?? [];
  const options = product?.options ?? [];

  function resolveVariant(vars: any[], selections: Record<string, string>) {
    const optionNames = options.map((o: any) => o.name);
    const allSelected = optionNames.every((n: string) => selections[n]);
    if (!allSelected) return null;

    return vars.find((v: any) =>
      v.selectedOptions.every(
        (o: any) => selections[o.name] && selections[o.name] === o.value
      )
    );
  }

  const resolvedVariant = product ? resolveVariant(variants, selectedOptions) : null;

  function isValueAvailable(optionName: string, value: string) {
    const next = { ...selectedOptions, [optionName]: value };

    return variants.some((v: any) => {
      if (!v.availableForSale) return false;

      return v.selectedOptions.every((o: any) => {
        const sel = next[o.name];
        return !sel || sel === o.value;
      });
    });
  }

  function onPick(optionName: string, value: string) {
    setSelectedOptions((prev) => ({ ...prev, [optionName]: value }));
  }

  const imageUrl =
    resolvedVariant?.image?.url ??
    product?.featuredImage?.url ??
    product?.images?.nodes?.[0]?.url;

  function handleAddToBag() {
    if (!resolvedVariant || !resolvedVariant.availableForSale) return;
    if (ctaState !== "idle") return;

    setCtaState("loading");

    timeoutRef.current = window.setTimeout(() => {
      setCtaState("success");

      timeoutRef.current = window.setTimeout(() => {
        onClose();
      }, 1200);
    }, 1000);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <button
            aria-label="Close modal"
            className="absolute inset-0 bg-black/60"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            ref={dialogRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            className="relative z-10 w-full max-w-3xl rounded-2xl border border-white/10 bg-neutral-950 p-4 shadow-2xl outline-none"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          >
            <div className="flex items-center justify-between">
              <div className="text-sm opacity-70">
                Quick View {productHandle ? `• ${productHandle}` : ""}
              </div>

              <button
                onClick={onClose}
                className="rounded-lg px-3 py-2 text-sm opacity-80 hover:opacity-100"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {loading && (
                <>
                  <div className="aspect-square rounded-xl bg-white/5 animate-pulse" />
                  <div className="space-y-3">
                    <div className="h-6 w-2/3 rounded bg-white/5 animate-pulse" />
                    <div className="h-4 w-full rounded bg-white/5 animate-pulse" />
                    <div className="h-4 w-1/2 rounded bg-white/5 animate-pulse" />
                  </div>
                </>
              )}

              {!loading && product && !product.error && (
                <>
                  {/* Image crossfade */}
                  <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-white/5">
                    <AnimatePresence mode="wait" initial={false}>
                      {imageUrl ? (
                        <motion.img
                          key={imageUrl}
                          src={imageUrl}
                          alt={product.title}
                          className="absolute inset-0 h-full w-full object-cover"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        />
                      ) : (
                        <motion.div
                          key="placeholder"
                          className="absolute inset-0"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </AnimatePresence>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold">{product.title}</h2>

                    <div className="mt-2 text-sm opacity-80">
                      {resolvedVariant?.price ? (
                        <span>
                          {resolvedVariant.price.amount}{" "}
                          {resolvedVariant.price.currencyCode}
                        </span>
                      ) : (
                        <span className="opacity-60">
                          Select options to see price
                        </span>
                      )}
                    </div>

                    <p className="mt-3 text-sm opacity-70 line-clamp-5">
                      {product.description}
                    </p>

                    {/* Options */}
                    <div className="mt-5 space-y-4">
                      {options.map((opt: any) => (
                        <div key={opt.name}>
                          <div className="text-xs uppercase tracking-wide opacity-60">
                            {opt.name}
                          </div>

                          <div className="mt-2 flex flex-wrap gap-2">
                            {opt.values.map((val: string) => {
                              const selected = selectedOptions[opt.name] === val;
                              const enabled = isValueAvailable(opt.name, val);

                              return (
                                <button
                                  key={val}
                                  onClick={() => enabled && onPick(opt.name, val)}
                                  disabled={!enabled}
                                  className={[
                                    "rounded-full border px-3 py-1.5 text-sm transition",
                                    selected
                                      ? "border-white/40 bg-white/10"
                                      : "border-white/10 hover:border-white/25",
                                    !enabled ? "opacity-40 cursor-not-allowed" : "",
                                  ].join(" ")}
                                >
                                  {val}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddToBag}
                      disabled={
                        !resolvedVariant ||
                        !resolvedVariant.availableForSale ||
                        ctaState === "loading" ||
                        ctaState === "success"
                      }
                      className="mt-6 w-full rounded-xl bg-white/10 px-4 py-3 text-sm font-medium disabled:opacity-40"
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {ctaState === "idle" && (
                          <motion.span
                            key="idle"
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.15 }}
                            className="inline-flex items-center justify-center gap-2"
                          >
                            Add to bag
                          </motion.span>
                        )}

                        {ctaState === "loading" && (
                          <motion.span
                            key="loading"
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.15 }}
                            className="inline-flex items-center justify-center gap-2"
                          >
                            <span className="h-4 w-4 animate-spin rounded-full border border-white/30 border-t-white/80" />
                            Adding…
                          </motion.span>
                        )}

                        {ctaState === "success" && (
                          <motion.span
                            key="success"
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.15 }}
                            className="inline-flex items-center justify-center gap-2"
                          >
                            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/15">
                              ✓
                            </span>
                            Added
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </div>
                </>
              )}

              {!loading && product?.error && (
                <div className="rounded-xl border border-white/10 p-4 text-sm opacity-80 md:col-span-2">
                  Error: {product.error}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
