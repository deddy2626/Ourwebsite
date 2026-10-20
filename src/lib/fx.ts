// Tiny pub/sub so any component can trigger the full-screen particle layer
// (<FxCanvas />) without prop drilling: fx.burst(x, y), fx.confetti(), fx.fireworks().
export type FxEvent =
  | { type: "burst"; x: number; y: number; count?: number }
  | { type: "confetti" }
  | { type: "fireworks" };

type Listener = (event: FxEvent) => void;

const listeners = new Set<Listener>();

function emit(event: FxEvent) {
  listeners.forEach((listener) => listener(event));
}

export const fx = {
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  burst(x: number, y: number, count = 12) {
    emit({ type: "burst", x, y, count });
  },
  /** Burst from the middle of an element (handy for buttons and stickers). */
  burstFrom(el: Element | null, count = 14) {
    if (!el) return;
    const r = el.getBoundingClientRect();
    emit({ type: "burst", x: r.left + r.width / 2, y: r.top + r.height / 2, count });
  },
  confetti() {
    emit({ type: "confetti" });
  },
  fireworks() {
    emit({ type: "fireworks" });
  },
};
