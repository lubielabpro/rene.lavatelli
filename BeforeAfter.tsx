import { useCallback, useRef, useState } from "react";

/* ============================================================
   Curseur Avant / Après — accessible (clavier + ARIA slider)
   ============================================================ */

export function BeforeAfter({ before, after, altBefore, altAfter }: {
  before: string;
  after: string;
  altBefore: string;
  altAfter: string;
}) {
  const [pos, setPos] = useState(56);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const pct = ((clientX - r.left) / r.width) * 100;
    setPos(Math.min(96, Math.max(4, pct)));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragging.current) setFromClientX(e.clientX);
  };
  const stop = () => (dragging.current = false);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 3;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      setPos((p) => Math.max(4, p - step));
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      setPos((p) => Math.min(96, p + step));
    } else if (e.key === "Home") {
      e.preventDefault();
      setPos(4);
    } else if (e.key === "End") {
      e.preventDefault();
      setPos(96);
    }
  };

  return (
    <div
      ref={trackRef}
      className="relative w-full aspect-[16/10] overflow-hidden select-none cursor-ew-resize bg-parchment"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
    >
      {/* Avant (fond) */}
      <img
        src={before}
        alt={altBefore}
        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
        draggable={false}
        loading="lazy"
        decoding="async"
      />
      {/* Après (rognée à droite du curseur) */}
      <img
        src={after}
        alt={altAfter}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
        style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
        draggable={false}
        loading="lazy"
        decoding="async"
      />

      {/* Étiquettes */}
      <span className="absolute left-4 top-4 z-10 bg-ink/70 text-cream text-[11px] font-semibold uppercase tracking-[0.2em] px-3 py-1.5 pointer-events-none">
        Avant
      </span>
      <span className="absolute right-4 top-4 z-10 bg-pine/85 text-cream text-[11px] font-semibold uppercase tracking-[0.2em] px-3 py-1.5 pointer-events-none">
        Après
      </span>

      {/* Poignée */}
      <div
        role="slider"
        tabIndex={0}
        aria-label="Comparer avant et après"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        aria-valuetext={`Curseur à ${Math.round(pos)} pourcent`}
        onKeyDown={onKeyDown}
        className="ba-handle absolute top-0 bottom-0 z-10 w-10 -translate-x-1/2 outline-offset-[-4px]"
        style={{ left: `${pos}%` }}
      >
        <span aria-hidden="true" className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-cream/90 shadow-[0_0_12px_rgba(0,0,0,0.35)]" />
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-cream text-pine-deep shadow-lg"
        >
          <svg viewBox="0 0 20 20" fill="none" className="w-4.5 h-4.5">
            <path d="M7 5 2.5 10 7 15M13 5l4.5 5L13 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </div>
  );
}
