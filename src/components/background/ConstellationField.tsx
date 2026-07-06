import { useEffect, useRef } from "react";
import "./constellation.css";

type Node = { x: number; y: number; vx: number; vy: number; r: number };

const LINK_DIST = 132;
const DENSITY = 13000; // one node per N px²
const SPEED = 0.12;

export default function ConstellationField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let nodes: Node[] = [];
    let raf = 0;
    let running = true;
    const pointer = { x: -9999, y: -9999, active: false };

    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(150, Math.round((w * h) / DENSITY));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
        r: Math.random() * 1.4 + 0.6,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0) n.x += w;
        else if (n.x > w) n.x -= w;
        if (n.y < 0) n.y += h;
        else if (n.y > h) n.y -= h;
      }

      // links between nearby nodes
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK_DIST) {
            const o = (1 - dist / LINK_DIST) * 0.32;
            ctx.strokeStyle = `rgba(233, 90, 60, ${o})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        // links to pointer
        if (pointer.active) {
          const dx = a.x - pointer.x;
          const dy = a.y - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK_DIST * 1.6) {
            const o = (1 - dist / (LINK_DIST * 1.6)) * 0.5;
            ctx.strokeStyle = `rgba(245, 120, 90, ${o})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.stroke();
          }
        }
      }

      // nodes
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 236, 228, 0.85)";
        ctx.fill();
      }

      if (running) raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
    };
    const onResize = () => build();
    const onVisibility = () => {
      running = document.visibilityState === "visible";
      if (running) raf = requestAnimationFrame(draw);
      else cancelAnimationFrame(raf);
    };

    build();
    if (reduced) {
      draw();
      running = false;
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(draw);
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onMove, { passive: true });
      window.addEventListener("pointerleave", onLeave);
      document.addEventListener("visibilitychange", onVisibility);
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="constellation-field" aria-hidden="true" />;
}
