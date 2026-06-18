import React, { useEffect, useRef } from 'react';

export default function ShatterLetter({ char, progressObj, fontSize = 36, fontStyle = '900 36px Montserrat', textColor = '#000000' }) {
  const canvasRef = useRef(null);
  const lastProgress = useRef(-1);

  useEffect(() => {
    if (!canvasRef.current || char === ' ') return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // 1. Measure text to size canvas
    ctx.font = fontStyle;
    const metrics = ctx.measureText(char);
    const charWidth = Math.ceil(metrics.width) || fontSize * 0.6;
    
    // Add padding around the letter so shards can explode outward without clipping
    const padding = fontSize * 1.5; 
    const W = charWidth + padding * 2;
    const H = fontSize + padding * 2;

    canvas.width = W;
    canvas.height = H;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;

    // 2. Render letter on an offscreen canvas
    const offscreen = document.createElement('canvas');
    offscreen.width = W;
    offscreen.height = H;
    const oCtx = offscreen.getContext('2d');
    oCtx.font = fontStyle;
    oCtx.fillStyle = textColor;
    oCtx.textBaseline = 'middle';
    oCtx.textAlign = 'center';
    oCtx.fillText(char, W / 2, H / 2);

    // 3. Generate stable triangulation mesh (shards)
    const shards = [];
    const rows = 3;
    const cols = 3;
    const points = [];
    
    // Generate grid points with jitter
    for (let r = 0; r <= rows; r++) {
      const y = padding + (r / rows) * fontSize;
      for (let c = 0; c <= cols; c++) {
        const x = padding + (c / cols) * charWidth;
        let px = x;
        let py = y;
        
        // Add random jitter to inner points to make shapes jagged/irregular
        if (r > 0 && r < rows && c > 0 && c < cols) {
          px += (Math.random() - 0.5) * (charWidth / cols) * 0.75;
          py += (Math.random() - 0.5) * (fontSize / rows) * 0.75;
        }
        points.push({ x: px, y: py });
      }
    }

    // Connect grid points into triangles (shards)
    const stride = cols + 1; // 4
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i0 = r * stride + c;
        const i1 = r * stride + c + 1;
        const i2 = (r + 1) * stride + c;
        const i3 = (r + 1) * stride + c + 1;

        // Tri 1: Top-Left, Top-Right, Bottom-Right
        // Tri 2: Top-Left, Bottom-Right, Bottom-Left
        const triangles = [
          [points[i0], points[i1], points[i3]],
          [points[i0], points[i3], points[i2]]
        ];

        triangles.forEach(([p0, p1, p2]) => {
          const cx = (p0.x + p1.x + p2.x) / 3;
          const cy = (p0.y + p1.y + p2.y) / 3;

          // Scatter direction relative to the center of the character bounding box
          let dx = cx - W / 2;
          let dy = cy - H / 2;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          
          // Random scatter angle and distance
          const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.6;
          // Shards fly outward at least 1.5x - 3x the character size
          const scatterDist = (Math.random() * 1.5 + 1.5) * Math.max(charWidth, fontSize);

          shards.push({
            p0, p1, p2,
            cx, cy,
            targetX: Math.cos(angle) * scatterDist,
            targetY: Math.sin(angle) * scatterDist,
            targetRotation: (Math.random() - 0.5) * Math.PI * 4, // Up to 2 rotations
            targetScale: Math.random() * 0.2 + 0.1 // Shrink down when shattered
          });
        });
      }
    }

    // 4. Animation Frame Render Loop
    let animId;
    const draw = () => {
      const progress = progressObj.progress;
      // Only redraw if the progress value has changed to save CPU cycles
      if (progress === lastProgress.current) {
        animId = requestAnimationFrame(draw);
        return;
      }
      lastProgress.current = progress;

      ctx.clearRect(0, 0, W, H);

      shards.forEach(shard => {
        // Linear interpolation of shard transformation values based on progress
        const currentX = shard.targetX * (1 - progress);
        const currentY = shard.targetY * (1 - progress);
        const currentRot = shard.targetRotation * (1 - progress);
        const currentScale = shard.targetScale + (1 - shard.targetScale) * progress;
        const currentAlpha = progress; // Fade out as it shatters

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, currentAlpha));

        // Move coordinate system to centroid of the shard, apply transform, and move back
        ctx.translate(shard.cx + currentX, shard.cy + currentY);
        ctx.rotate(currentRot);
        ctx.scale(currentScale, currentScale);
        ctx.translate(-shard.cx, -shard.cy);

        // Path for triangulation shard
        ctx.beginPath();
        ctx.moveTo(shard.p0.x, shard.p0.y);
        ctx.lineTo(shard.p1.x, shard.p1.y);
        ctx.lineTo(shard.p2.x, shard.p2.y);
        ctx.closePath();
        ctx.clip();

        // Draw offscreen text onto this canvas shard
        ctx.drawImage(offscreen, 0, 0);

        ctx.restore();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [char, fontSize, fontStyle, textColor, progressObj]);

  if (char === ' ') {
    // Spacer for word formatting
    return <span className="shatter-space" style={{ display: 'inline-block', width: '0.25em' }}>&nbsp;</span>;
  }

  // Negative margins are equal to the padding to allow canvas to draw shards outside
  // its boundaries while keeping standard layout placement and responsive wrapping.
  const paddingOffset = fontSize * -1.5;

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        margin: `${paddingOffset}px`,
        pointerEvents: 'none'
      }}
    />
  );
}
