import React, { useEffect, useRef, useState } from "react";
import useLocalStorage from "../hook/useLocalStorage";

type RandomizerWheelProps = {
  initialItems?: string[]; // itens iniciais (podem vir das variáveis do seu projeto)
  removeOnSelect?: boolean; // remoção automática ao selecionar
  storageKey?: string; // chave para persistir lista
  className?: string; // para manter seu estilo
};

type WheelItem = {
  id: string;
  label: string;
  used?: boolean;
};

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export default function RandomizerWheel({
  initialItems = ["Opcao 1", "Opcao 2", "Opcao 3"],
  removeOnSelect = true,
  storageKey = "universalhub.randomizer.items",
  className = "",
}: RandomizerWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [items, setItems] = useLocalStorage<WheelItem[]>(
    storageKey,
    initialItems.map((t) => ({ id: uid(), label: t, used: false }))
  );
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0); // degrees
  const [selected, setSelected] = useState<WheelItem | null>(null);
  const [input, setInput] = useState("");

  // Draw wheel on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const size = Math.min(420, Math.max(320, window.innerWidth * 0.6));
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(dpr, dpr);
    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2 - 8;
    const n = items.length || 1;
    const slice = 360 / n;

    // background circle
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 6, 0, Math.PI * 2);
    ctx.fillStyle = "var(--wheel-bg, #0f172a)";
    ctx.fill();

    for (let i = 0; i < n; i++) {
      const start = ((i * slice - slice / 2) * Math.PI) / 180;
      const end = (((i + 1) * slice - slice / 2) * Math.PI) / 180;
      // color generation (you can replace with your theme variables)
      const hue = Math.round((360 / n) * i);
      const color = `hsl(${hue}deg 70% 50% / ${items[i]?.used ? "45%" : "100%"})`;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, start, end);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();

      // slice border
      ctx.strokeStyle = "rgba(0,0,0,0.25)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // label
      ctx.save();
      // angle to write the text along middle of slice
      const mid = ((i * slice + slice / 2 - slice / 2) * Math.PI) / 180; // simplifies to i*slice*pi/180
      const textAngle = ((i * slice) * Math.PI) / 180;
      ctx.translate(cx, cy);
      ctx.rotate(textAngle);
      ctx.textAlign = "right";
      ctx.fillStyle = getContrastColor(hue);
      ctx.font = "bold 14px Inter, system-ui, -apple-system, 'Segoe UI', Roboto";
      const text = items[i] ? items[i].label : "";
      // draw text along radius
      ctx.fillText(text, radius - 10, 6);
      ctx.restore();
    }

    // center circle
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.28, 0, Math.PI * 2);
    ctx.fillStyle = "var(--wheel-center, #0b1220)";
    ctx.fill();

    ctx.restore();
  }, [items, rotation]);

  // helper to choose a random available item index
  function pickRandomIndex(): number {
    const available = items.map((it, idx) => ({ it, idx })).filter((x) => !x.it.used);
    if (available.length === 0) {
      // if none available, allow used ones (or you can prevent spinning)
      return Math.floor(Math.random() * items.length);
    }
    return available[Math.floor(Math.random() * available.length)].idx;
  }

  function spin() {
    if (spinning) return;
    if (!items || items.length === 0) return;
    const n = items.length;
    const targetIndex = pickRandomIndex();
    const slice = 360 / n;
    // centerAngle of chosen slice (relative to 3 o'clock baseline)
    const centerAngle = targetIndex * slice + slice / 2;
    // compute minimal rotation so that chosen slice center ends at the top (-90deg)
    // we want R ≡ -90 - centerAngle (mod 360)
    const minimalTarget = normalizeAngle(-90 - centerAngle);
    const extraSpins = 3 + Math.floor(Math.random() * 3); // 3..5 full rotations
    const finalRotation = extraSpins * 360 + minimalTarget;
    setSpinning(true);
    setSelected(null);
    // animate by setting inline style rotation on container
    if (containerRef.current) {
      const el = containerRef.current;
      // set transition duration proportional to spins (tune as needed)
      const duration = 3 + extraSpins * 0.6;
      el.style.transition = `transform ${duration}s cubic-bezier(.08,.8,.22,1)`;
      // trigger
      requestAnimationFrame(() => {
        el.style.transform = `rotate(${finalRotation}deg)`;
      });

      const onEnd = () => {
        el.style.transition = "";
        // normalized rotation value
        const finalRmod = normalizeAngle(finalRotation % 360);
        const selectedIndex = Math.floor(normalizeAngle(-90 - finalRmod) / slice) % n;
        const chosen = items[selectedIndex];
        setSelected(chosen || null);
        setRotation((r) => (r + finalRotation) % 360);
        setSpinning(false);
        // apply remove or mark used
        setItems((prev) => {
          const copy = prev.slice();
          if (!copy[selectedIndex]) return copy;
          if (removeOnSelect) {
            copy.splice(selectedIndex, 1);
          } else {
            copy[selectedIndex] = { ...copy[selectedIndex], used: true };
          }
          return copy;
        });
        el.removeEventListener("transitionend", onEnd);
      };

      el.addEventListener("transitionend", onEnd);
    }
  }

  // reset wheel position (no animation)
  function resetWheelPosition() {
    if (containerRef.current) {
      const el = containerRef.current;
      el.style.transition = "";
      el.style.transform = `rotate(0deg)`;
    }
    setRotation(0);
  }

  // add item
  function addItem() {
    if (!input.trim()) return;
    setItems((prev) => [...prev, { id: uid(), label: input.trim(), used: false }]);
    setInput("");
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((p) => p.id !== id));
    setSelected(null);
  }

  function clearUsed() {
    setItems((prev) => prev.map((p) => ({ ...p, used: false })));
  }

  function importJson(json: string) {
    try {
      const arr = JSON.parse(json);
      if (!Array.isArray(arr)) return;
      const normalized = arr.map((a) =>
        typeof a === "string" ? { id: uid(), label: a, used: false } : { id: uid(), label: String(a.label || a), used: !!a.used }
      );
      setItems(normalized);
    } catch (e) {
      console.error("Import erro", e);
    }
  }

  function exportJson() {
    const data = items.map((i) => i.label);
    const asJson = JSON.stringify(data, null, 2);
    navigator.clipboard?.writeText(asJson).catch(() => {});
    return asJson;
  }

  return (
    <div className={`w-full max-w-3xl mx-auto p-4 ${className}`}>
      <div className="flex gap-4 items-start">
        <div className="relative">
          <div
            ref={containerRef}
            className={`wheel-container w-[320px] h-320 rounded-full overflow-visible will-change-transform`}
            style={{ margin: 0 }}
          >
            <canvas ref={canvasRef} className="block rounded-full shadow-lg" />
          </div>
          {/* pointer indicator */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-4">
            <div className="w-0 h-0 border-l-10 border-l-transparent border-r-10 border-r-transparent border-b-18 border-b-red-600"></div>
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <button
              onClick={spin}
              disabled={spinning || items.length === 0}
              className="px-4 py-2 rounded bg-linear-to-r from-emerald-500 to-teal-400 text-white font-semibold disabled:opacity-40"
            >
              {spinning ? "Girando..." : "Girar"}
            </button>
            <button
              onClick={() => {
                setItems([]);
                setSelected(null);
                resetWheelPosition();
              }}
              className="px-3 py-2 rounded border"
            >
              Limpar tudo
            </button>
            <button onClick={clearUsed} className="px-3 py-2 rounded border">
              Reset usados
            </button>
            <button
              onClick={() => {
                const out = exportJson();
                // also show a toast in your app if you have one
                alert("JSON copiado para área de transferência:\n" + out.slice(0, 300));
              }}
              className="px-3 py-2 rounded border"
            >
              Exportar
            </button>
          </div>

          <div className="bg-surface-2 rounded p-3">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addItem()}
                className="flex-1 px-3 py-2 rounded border"
                placeholder="Adicionar opção (Enter)"
              />
              <button onClick={addItem} className="px-3 py-2 rounded bg-slate-800 text-white">
                Adicionar
              </button>
            </div>

            <div className="mt-3 max-h-48 overflow-auto">
              {items.length === 0 && <div className="text-sm text-muted-foreground">Nenhuma opção — adicione algumas.</div>}
              <ul className="space-y-2">
                {items.map((it) => (
                  <li key={it.id} className="flex items-center justify-between gap-2 px-2 py-1 rounded bg-white/5">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${it.used ? "bg-gray-400" : "bg-green-400"}`} />
                      <span className={`text-sm ${it.used ? "line-through text-zinc-400" : ""}`}>{it.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => removeItem(it.id)} className="text-xs px-2 py-1 rounded border">
                        Remover
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {selected && (
            <div className="mt-2 p-3 rounded bg-amber-600 text-white font-bold">
              Selecionado: {selected.label}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// normalize angle to [0,360)
function normalizeAngle(a: number) {
  let r = a % 360;
  if (r < 0) r += 360;
  return r;
}

// pick a readable text color based on slice hue
function getContrastColor(hue: number) {
  // simple: light text for dark-ish hues, dark text for light-ish hues
  // choose luminance by converting H to perceived brightness approx
  const l = 50; // we keep constant in our HSL generation so return white
  return l < 60 ? "white" : "black";
}