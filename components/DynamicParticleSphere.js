import { useEffect, useRef } from "react";

export default function DynamicParticleSphere() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const DPR = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);

    let nodes = [];
    const count = 38;

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * DPR;
      canvas.height = h * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      nodes = Array.from({ length: count }, () => {
        const angle = Math.random() * Math.PI * 2;
        const radiusX = 60 + Math.random() * 90;
        const radiusY = 60 + Math.random() * 90;
        return {
          angle,
          speed: 0.003 + Math.random() * 0.005,
          radiusX,
          radiusY,
          size: 1.2 + Math.random() * 2,
          zDepth: Math.random()
        };
      });
    };
    resize();
    window.addEventListener("resize", resize);

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      const centerX = w / 2;
      const centerY = h / 2;

      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        n1.angle += n1.speed;
        
        const x1 = centerX + Math.cos(n1.angle) * n1.radiusX;
        const y1 = centerY + Math.sin(n1.angle) * n1.radiusY;

        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const x2 = centerX + Math.cos(n2.angle) * n2.radiusX;
          const y2 = centerY + Math.sin(n2.angle) * n2.radiusY;

          const distance = Math.hypot(x2 - x1, y2 - y1);
          if (distance < 110) {
            const alpha = (1 - distance / 110) * 0.22;
            ctx.strokeStyle = `rgba(255, 122, 61, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        const x = centerX + Math.cos(n.angle) * n.radiusX;
        const y = centerY + Math.sin(n.angle) * n.radiusY;
        const scale = 0.5 + n.zDepth * 0.8;
        
        ctx.fillStyle = `rgba(255, 75, 43, ${0.4 + n.zDepth * 0.5})`;
        ctx.beginPath();
        ctx.arc(x, y, n.size * scale, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute right-0 top-1/2 h-[400px] w-full max-w-[500px] -translate-y-1/2 opacity-70 pointer-events-none"
    />
  );
}
