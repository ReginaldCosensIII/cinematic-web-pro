import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * HeroBackground
 * --------------
 * Canvas-driven ambient background for the hero section.
 *
 * Features:
 *  - Starfield (3 depth layers) with gentle twinkle + ambient drift
 *  - Soft gradient orbs with parallax pull
 *  - Smoothed mouse interaction (lerped cursor) — drives per-layer parallax
 *    and a subtle warp displacement near the pointer.
 *  - Text exclusion zone: stars near the hero heading fade out / drift away
 *    so the H1, subtext and CTA are always emphasized.
 *  - Radial brand-gradient spotlight behind the text region.
 *  - When the cursor leaves, the smoothed cursor eases back to center over
 *    ~2s. Ambient drift continues regardless.
 *  - Honors prefers-reduced-motion.
 */
const HeroBackground: React.FC<{
  /** Optional ref to the element that should be highlighted (the text block). */
  spotlightRef?: React.RefObject<HTMLElement>;
  /**
   * Reveal progress (0 → 1). When provided, the canvas ramps in:
   *  - star opacity from 0 → 1
   *  - orb scale from 0.7 → 1
   * Used by the scroll-driven hero choreography. Defaults to 1 (fully revealed).
   * Read via a ref so the canvas RAF loop stays the source of truth.
   */
  revealProgressRef?: React.MutableRefObject<number>;
}> = ({ spotlightRef, revealProgressRef }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ----- Sizing / DPR -----
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // ----- Stars -----
    type StarShape = 'round' | 'sparkle' | 'diamond';
    type Star = {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      r: number;
      depth: number; // 0..1, smaller = farther
      twinkleSpeed: number;
      twinklePhase: number;
      hue: 'blue' | 'purple' | 'silver' | 'warm';
      shape: StarShape;
      driftX: number;
      driftY: number;
    };

    // ~8% more stars, slightly wider size range for richer depth.
    const STAR_COUNT = Math.min(155, Math.floor((width * height) / 8200));
    const stars: Star[] = Array.from({ length: STAR_COUNT }, () => {
      const depth = Math.random();
      const x = Math.random() * width;
      const y = Math.random() * height;
      const hueRoll = Math.random();
      const shapeRoll = Math.random();
      // ~78% round, ~14% sparkle (4-point), ~8% diamond glints
      const shape: StarShape =
        shapeRoll < 0.78 ? 'round' : shapeRoll < 0.92 ? 'sparkle' : 'diamond';
      return {
        x,
        y,
        baseX: x,
        baseY: y,
        // Wider radius range (0.3 → ~2.05) to enhance depth variation.
        r: 0.3 + Math.pow(depth, 0.85) * 1.75,
        depth,
        twinkleSpeed: 0.4 + Math.random() * 1.2,
        twinklePhase: Math.random() * Math.PI * 2,
        hue:
          hueRoll < 0.16
            ? 'blue'
            : hueRoll < 0.3
              ? 'purple'
              : hueRoll < 0.36
                ? 'warm'
                : 'silver',
        shape,
        driftX: (Math.random() - 0.5) * 0.04,
        driftY: (Math.random() - 0.5) * 0.04,
      };
    });

    // ----- Shooting stars -----
    // Streak diagonally across the hero. Director schedules a new one every
    // 5–10s so even a brief 5-10s glance reliably sees one.
    type ShootingStar = {
      x: number;
      y: number;
      vx: number; // px/s
      vy: number;
      life: number; // seconds elapsed
      maxLife: number;
      length: number; // trail length
      depth: number; // 0..1 (affects opacity + thickness)
    };
    const shootingStars: ShootingStar[] = [];
    let nextShootingAt = 1.5 + Math.random() * 2.5; // first one early, then 5–10s

    const spawnShootingStar = () => {
      // Always travels left→right or right→left, slight downward bias
      const dir = Math.random() < 0.5 ? 1 : -1;
      const startY = Math.random() * height * 0.55; // upper portion of sky
      const startX = dir === 1 ? -60 : width + 60;
      const speed = 520 + Math.random() * 380; // px/s
      const angle = (Math.random() * 0.18 + 0.06) * (Math.random() < 0.5 ? 1 : -0.5);
      const depth = 0.4 + Math.random() * 0.6;
      shootingStars.push({
        x: startX,
        y: startY,
        vx: dir * speed * Math.cos(angle),
        vy: speed * Math.sin(angle) + 80,
        life: 0,
        maxLife: 1.2 + Math.random() * 0.8,
        length: 80 + Math.random() * 140,
        depth,
      });
    };

    // ----- Satellite + Nebula scene director -----
    // Rules:
    //  - Max 1 satellite + 1 nebula on screen at a time.
    //  - Each independently lifecycles: spawn → drift across → exit.
    //  - When BOTH are absent, schedule the next within 10s (favoring whichever
    //    has been absent longer) so the sky never feels lifeless.
    //  - When only one is absent, schedule its respawn after a longer cooldown
    //    so they don't both clump on screen back-to-back.
    type Satellite = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      depth: number; // 0..1 (affects size/opacity)
      rot: number; // base rotation
      rotSpeed: number;
      done: boolean;
    } | null;

    let satellite: Satellite = null;
    // Time (in seconds since loop start) at which the director should next
    // attempt to spawn each entity. 0 means "as soon as possible".
    let nextSatelliteAt = 4 + Math.random() * 6; // first satellite within 4–10s
    let satelliteAbsentSince = 0;


    const spawnSatellite = () => {
      const fromLeft = Math.random() < 0.5;
      const depth = 0.45 + Math.random() * 0.5;
      const speed = 22 + Math.random() * 18; // px/s — slow, deliberate
      const yBand = 0.08 + Math.random() * 0.7; // anywhere in vertical band
      const angle = (Math.random() - 0.5) * 0.35; // mostly horizontal
      satellite = {
        x: fromLeft ? -80 : width + 80,
        y: height * yBand,
        vx: (fromLeft ? 1 : -1) * speed * Math.cos(angle),
        vy: speed * Math.sin(angle) * 0.4,
        depth,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.15,
        done: false,
      };
    };

    const spawnNebula = () => {
      const fromLeft = Math.random() < 0.5;
      const depth = 0.3 + Math.random() * 0.6;
      const r = 180 + Math.random() * 220 + depth * 120;
      // Brand-aligned palette; mix blue/purple/violet pairs
      const palette = [
        ['rgba(80, 140, 255,', 'rgba(140, 60, 220,'],
        ['rgba(150, 90, 255,', 'rgba(70, 120, 240,'],
        ['rgba(100, 80, 220,', 'rgba(180, 110, 240,'],
      ];
      const [hueA, hueB] = palette[Math.floor(Math.random() * palette.length)];
      const speed = 6 + Math.random() * 8; // very slow drift
      const angle = (Math.random() - 0.5) * 0.6;
      nebula = {
        x: fromLeft ? -r : width + r,
        y: height * (0.1 + Math.random() * 0.7),
        vx: (fromLeft ? 1 : -1) * speed * Math.cos(angle),
        vy: speed * Math.sin(angle) * 0.5,
        r,
        depth,
        hueA,
        hueB,
        life: 0,
        // Long lifetime (20–35s) since drift is slow
        maxLife: 22 + Math.random() * 14,
        fadeIn: 3.5,
        fadeOut: 4.5,
        done: false,
      };
    };


    // ----- Orbs -----
    // Softer color, slightly larger radius for diffuse glow, plus per-orb
    // independent slow drift on top of cursor parallax — keeps them feeling
    // alive even at rest, never static.
    type Orb = {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      r: number;
      color: string;
      parallax: number;        // cursor influence multiplier
      driftAmpX: number;       // ambient drift amplitude (px)
      driftAmpY: number;
      driftSpeed: number;      // ambient drift frequency
      phase: number;           // phase offset
    };
    // Orbs track the spotlight (hero text) center so they stay clustered
    // around the heading on every breakpoint. baseX/baseY are recomputed
    // each frame from the spotlight rect (see draw loop).
    const orbs: Orb[] = [
      {
        x: width * 0.5, y: height * 0.5,
        baseX: width * 0.5, baseY: height * 0.5,
        r: Math.min(260, Math.max(140, width * 0.11)),
        color: 'rgba(66, 133, 244, 0.18)',
        parallax: 0.04,
        driftAmpX: 18, driftAmpY: 12, driftSpeed: 0.12, phase: 0,
      },
      {
        x: width * 0.5, y: height * 0.5,
        baseX: width * 0.5, baseY: height * 0.5,
        r: Math.min(260, Math.max(140, width * 0.11)),
        color: 'rgba(138, 43, 226, 0.16)',
        parallax: -0.035,
        driftAmpX: 16, driftAmpY: 14, driftSpeed: 0.09, phase: Math.PI * 0.6,
      },
      {
        x: width * 0.5, y: height * 0.5,
        baseX: width * 0.5, baseY: height * 0.5,
        r: Math.min(210, Math.max(110, width * 0.085)),
        color: 'rgba(120, 80, 220, 0.12)',
        parallax: 0.02,
        driftAmpX: 12, driftAmpY: 10, driftSpeed: 0.07, phase: Math.PI * 1.3,
      },
    ];
    // Offsets (relative to the spotlight center) used each frame so the
    // cluster hugs the headline regardless of viewport size.
    const orbOffsets = [
      { x: -0.18, y: -0.05 }, // blue — left/top of text
      { x:  0.18, y:  0.05 }, // purple — right/bottom of text
      { x:  0.00, y:  0.22 }, // violet — below text
    ];


    // ----- Cursor smoothing -----
    // target = where the mouse actually is (normalized -1..1 from center)
    // smooth = the eased cursor we actually use for rendering.
    // When cursor leaves, target eases back to (0,0) at the same lerp rate
    // (~2s perceived ease).
    const target = { x: 0, y: 0 };
    const smooth = { x: 0, y: 0 };
    const scroll = { current: 0, target: 0 };
    let inside = false;
    // Lerp factor — lower = slower ease. ~0.018 ≈ ~2s settle at 60fps.
    const LERP = reduceMotion ? 0 : 0.018;

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      // Only react when pointer is over (or near) the hero area.
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        target.x = Math.max(-1, Math.min(1, nx));
        target.y = Math.max(-1, Math.min(1, ny));
        inside = true;
      } else if (inside) {
        target.x = 0;
        target.y = 0;
        inside = false;
      }
    };
    const onLeave = () => {
      target.x = 0;
      target.y = 0;
      inside = false;
    };
    const onScroll = () => {
      const rect = container.getBoundingClientRect();
      const travel = Math.max(1, window.innerHeight + rect.height);
      scroll.target = Math.max(-1, Math.min(1, -rect.top / travel));
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseleave', onLeave);
    onScroll();

    const ro = new ResizeObserver(() => {
      const prevW = width;
      const prevH = height;
      resize();
      // Rescale star/orb base positions proportionally on resize.
      if (prevW > 0 && prevH > 0) {
        const sx = width / prevW;
        const sy = height / prevH;
        for (const s of stars) {
          s.baseX *= sx;
          s.baseY *= sy;
          s.x *= sx;
          s.y *= sy;
        }
        for (const o of orbs) {
          o.baseX *= sx;
          o.baseY *= sy;
        }
      }
    });
    ro.observe(container);

    // ----- Spotlight / exclusion zone -----
    // Computed from spotlightRef (the text block) so the glow + exclusion
    // always tracks the actual heading position.
    const getSpotlight = () => {
      const el = spotlightRef?.current;
      if (!el) {
        return {
          cx: width / 2,
          cy: height / 2,
          rx: Math.min(width * 0.45, 520),
          ry: Math.min(height * 0.32, 260),
        };
      }
      const cRect = container.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      return {
        cx: r.left - cRect.left + r.width / 2,
        cy: r.top - cRect.top + r.height / 2,
        rx: Math.max(280, r.width * 0.62),
        ry: Math.max(180, r.height * 0.65),
      };
    };

    // ----- Render loop -----
    let raf = 0;
    let t0 = performance.now();
    const loopStart = performance.now();
    const draw = (now: number) => {
      const dt = Math.min(50, now - t0) / 1000;
      t0 = now;
      const elapsed = (now - loopStart) / 1000; // seconds since loop start

      // Ease smoothed cursor toward target.
      smooth.x += (target.x - smooth.x) * LERP;
      smooth.y += (target.y - smooth.y) * LERP;
      scroll.current += (scroll.target - scroll.current) * (reduceMotion ? 1 : 0.045);

      ctx.clearRect(0, 0, width, height);

      const spot = getSpotlight();

      // Reveal progress (0 → 1) drives a coordinated entrance for the
      // background. Read fresh each frame so the scroll-driven hero can
      // imperatively update it without re-rendering this component.
      const reveal = Math.max(0, Math.min(1, revealProgressRef?.current ?? 1));
      // Smoothstep for buttery ramps
      const revealEase = reveal * reveal * (3 - 2 * reveal);

      // ===== Scene director: nebula + satellite =====
      // Track absent durations for fairness (favor whichever has been gone longer).
      if (!nebula) nebulaAbsentSince += dt;
      else nebulaAbsentSince = 0;
      if (!satellite) satelliteAbsentSince += dt;
      else satelliteAbsentSince = 0;

      // If both absent, ensure something spawns within ~10s by tightening
      // whichever schedule is later.
      if (!satellite && !nebula) {
        const earliest = Math.min(nextSatelliteAt, nextNebulaAt);
        if (earliest > elapsed + 9) {
          // Tighten the closer one to spawn within 4–9s.
          if (nextSatelliteAt < nextNebulaAt) {
            nextSatelliteAt = elapsed + 4 + Math.random() * 5;
          } else {
            nextNebulaAt = elapsed + 4 + Math.random() * 5;
          }
        }
      }

      if (!satellite && elapsed >= nextSatelliteAt && !reduceMotion) {
        spawnSatellite();
      }
      if (!nebula && elapsed >= nextNebulaAt && !reduceMotion) {
        spawnNebula();
      }

      // ===== Nebula (drawn first — sits behind orbs/stars) =====
      if (nebula) {
        nebula.life += dt;
        nebula.x += nebula.vx * dt;
        nebula.y += nebula.vy * dt;
        // Lifecycle alpha: fade in, hold, fade out
        let nAlpha = 1;
        if (nebula.life < nebula.fadeIn) {
          nAlpha = nebula.life / nebula.fadeIn;
        } else if (nebula.life > nebula.maxLife - nebula.fadeOut) {
          nAlpha = Math.max(0, (nebula.maxLife - nebula.life) / nebula.fadeOut);
        }
        const offScreen =
          nebula.x < -nebula.r * 1.4 ||
          nebula.x > width + nebula.r * 1.4 ||
          nebula.life >= nebula.maxLife;
        if (offScreen || nAlpha <= 0.01) {
          nebula = null;
          // Schedule next nebula in 8–18s (longer cooldown so it feels rare)
          nextNebulaAt = elapsed + 8 + Math.random() * 10;
        } else {
          const baseAlpha = nAlpha * (0.42 + nebula.depth * 0.32) * revealEase;
          const nebulaY = nebula.y + scroll.current * (12 + nebula.depth * 24);
          // Two overlapping radial gradients for a soft, painterly look
          const g1 = ctx.createRadialGradient(
            nebula.x, nebulaY, 0,
            nebula.x, nebulaY, nebula.r,
          );
          g1.addColorStop(0, `${nebula.hueA} ${baseAlpha.toFixed(3)})`);
          g1.addColorStop(0.55, `${nebula.hueA} ${(baseAlpha * 0.25).toFixed(3)})`);
          g1.addColorStop(1, `${nebula.hueA} 0)`);
          ctx.fillStyle = g1;
          ctx.beginPath();
          ctx.arc(nebula.x, nebulaY, nebula.r, 0, Math.PI * 2);
          ctx.fill();

          const g2 = ctx.createRadialGradient(
            nebula.x + nebula.r * 0.25, nebulaY - nebula.r * 0.2, 0,
            nebula.x + nebula.r * 0.25, nebulaY - nebula.r * 0.2, nebula.r * 0.7,
          );
          g2.addColorStop(0, `${nebula.hueB} ${(baseAlpha * 1.45).toFixed(3)})`);
          g2.addColorStop(1, `${nebula.hueB} 0)`);
          ctx.fillStyle = g2;
          ctx.beginPath();
          ctx.arc(nebula.x + nebula.r * 0.25, nebulaY - nebula.r * 0.2, nebula.r * 0.7, 0, Math.PI * 2);
          ctx.fill();
        }
      }


      // --- Orbs ---
      // Each orb combines (a) eased cursor parallax with (b) its own slow
      // sine-based ambient drift. The drift keeps them feeling alive even
      // when the cursor is at rest, without ever snapping.
      const tSec = now / 1000;
      const orbScale = 0.7 + 0.3 * revealEase; // 0.7 → 1.0
      const orbAlpha = revealEase;             // 0 → 1
      // Anchor the orb cluster to the hero text each frame so the glow
      // follows the heading at every breakpoint.
      const clusterSpread = Math.min(Math.max(spot.rx, 240), 420);
      // On mobile, the text block (heading + subtext + CTA) is tall, so the
      // spotlight center sits well below the heading. Shift the orb cluster
      // up toward the heading so the glow stays behind "Ready to …" rather
      // than behind the subtext / CTA.
      const mobileYShift = width < 640 ? -spot.ry * 0.08 : width < 1024 ? -spot.ry * 0.18 : 0;
      orbs.forEach((o, i) => {
        const off = orbOffsets[i] ?? { x: 0, y: 0 };
        const narrowCenterBias = width < 640 ? 0.45 : width < 1024 ? 0.25 : 0;
        const verticalCenterBias = width < 640 ? 0.32 : width < 1024 ? 0.18 : 0;
        const anchorX = spot.cx + (width / 2 - spot.cx) * narrowCenterBias;
        const anchorY = spot.cy + (height / 2 - spot.cy) * verticalCenterBias;
        o.baseX = anchorX + off.x * clusterSpread;
        o.baseY = anchorY + off.y * clusterSpread + mobileYShift + scroll.current * (8 + i * 5);
        const driftX = Math.sin(tSec * o.driftSpeed + o.phase) * o.driftAmpX;
        const driftY = Math.cos(tSec * o.driftSpeed * 0.85 + o.phase) * o.driftAmpY;
        const ox = o.baseX + smooth.x * width * o.parallax + driftX;
        const oy = o.baseY + smooth.y * height * o.parallax + driftY;
        o.x = ox;
        o.y = oy;
        const r = o.r * orbScale;
        const grad = ctx.createRadialGradient(ox, oy, 0, ox, oy, r);
        const colorWithReveal = o.color.replace(/[\d.]+\)$/, (m) => {
          const a = parseFloat(m);
          return `${(a * orbAlpha).toFixed(3)})`;
        });
        grad.addColorStop(0, colorWithReveal);
        grad.addColorStop(0.55, colorWithReveal.replace(/[\d.]+\)$/, `${(0.04 * orbAlpha).toFixed(3)})`));
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(ox, oy, r, 0, Math.PI * 2);
        ctx.fill();
      });

      // --- Spotlight behind text (brand gradient radial) ---
      const spotGrad = ctx.createRadialGradient(
        spot.cx,
        spot.cy,
        0,
        spot.cx,
        spot.cy,
        Math.max(spot.rx, spot.ry) * 1.3,
      );
      const spotAlpha = isDark ? 0.16 : 0.13;
      spotGrad.addColorStop(0, `rgba(66, 133, 244, ${spotAlpha})`);
      spotGrad.addColorStop(0.55, `rgba(138, 43, 226, ${spotAlpha * 0.4})`);
      spotGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = spotGrad;
      ctx.beginPath();
      ctx.ellipse(spot.cx, spot.cy, spot.rx * 1.6, spot.ry * 1.7, 0, 0, Math.PI * 2);
      ctx.fill();

      // --- Stars ---
      const time = now / 1000;
      // Refined warp:
      //  - Larger radius so the falloff is softer over a wider area.
      //  - Smoothstep curve (3t² - 2t³) instead of linear → no harsh edge.
      //  - Reduced push strength + a tiny tangential swirl component for a
      //    sophisticated "displacement field" feel rather than a hard repel.
      const cursorPx = {
        x: width / 2 + smooth.x * (width / 2),
        y: height / 2 + smooth.y * (height / 2),
      };
      // Larger warp field + stronger displacement so the cursor's "pull/push"
      // on the starfield is clearly visible.
      const warpRadius = Math.min(width, height) * 0.55;

      for (const s of stars) {
        // Ambient drift
        if (!reduceMotion) {
          s.baseX += s.driftX * dt * 30;
          s.baseY += s.driftY * dt * 30;
          // Wrap softly within bounds
          if (s.baseX < -20) s.baseX = width + 20;
          if (s.baseX > width + 20) s.baseX = -20;
          if (s.baseY < -20) s.baseY = height + 20;
          if (s.baseY > height + 20) s.baseY = -20;
        }

        // Per-depth parallax
        const par = 6 + s.depth * 28;
        let x = s.baseX + smooth.x * par;
        let y = s.baseY + smooth.y * par + scroll.current * (8 + s.depth * 34);

        // Warp: smoothstep displacement away from cursor + slight swirl
        const dx = x - cursorPx.x;
        const dy = y - cursorPx.y;
        const dist = Math.hypot(dx, dy);
        if (dist < warpRadius && dist > 0.01) {
          const t = 1 - dist / warpRadius;
          const ease = t * t * (3 - 2 * t); // smoothstep
          const push = ease * (10 + s.depth * 22);   // stronger radial push (was 4 + depth*9)
          const swirl = ease * (3 + s.depth * 6);    // more visible tangential swirl
          const nx = dx / dist;
          const ny = dy / dist;
          x += nx * push + -ny * swirl;
          y += ny * push + nx * swirl;
        }

        s.x = x;
        s.y = y;


        // Text exclusion zone — fade alpha based on elliptical distance
        // from spotlight center. Stars inside the zone fade toward 0.
        const ex = (x - spot.cx) / (spot.rx * 1.05);
        const ey = (y - spot.cy) / (spot.ry * 1.05);
        const eDist = Math.hypot(ex, ey);
        const exclusion = eDist < 1 ? eDist * eDist : 1; // smooth quadratic falloff

        // Twinkle
        const tw = reduceMotion
          ? 0.7
          : 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(time * s.twinkleSpeed + s.twinklePhase));

        const baseAlpha = (0.35 + s.depth * 0.6) * tw * exclusion * (isDark ? 1 : 0.8) * revealEase;
        if (baseAlpha < 0.02) continue;

        const color =
          s.hue === 'blue'
            ? `rgba(120, 170, 255, ${baseAlpha})`
            : s.hue === 'purple'
              ? `rgba(180, 130, 255, ${baseAlpha})`
              : s.hue === 'warm'
                ? `rgba(255, 210, 170, ${baseAlpha})`
                : isDark
                  ? `rgba(220, 220, 235, ${baseAlpha})`
                  : `rgba(80, 90, 120, ${baseAlpha})`;

        ctx.fillStyle = color;
        if (s.shape === 'round') {
          ctx.beginPath();
          ctx.arc(x, y, s.r, 0, Math.PI * 2);
          ctx.fill();
        } else if (s.shape === 'sparkle') {
          // 4-point sparkle: bright dot + two thin spikes
          ctx.beginPath();
          ctx.arc(x, y, s.r * 0.8, 0, Math.PI * 2);
          ctx.fill();
          const sLen = s.r * 4.5;
          ctx.strokeStyle = color.replace(/[\d.]+\)$/, `${baseAlpha * 0.55})`);
          ctx.lineWidth = Math.max(0.5, s.r * 0.45);
          ctx.beginPath();
          ctx.moveTo(x - sLen, y);
          ctx.lineTo(x + sLen, y);
          ctx.moveTo(x, y - sLen);
          ctx.lineTo(x, y + sLen);
          ctx.stroke();
        } else {
          // diamond glint
          const d = s.r * 1.6;
          ctx.beginPath();
          ctx.moveTo(x, y - d);
          ctx.lineTo(x + d, y);
          ctx.lineTo(x, y + d);
          ctx.lineTo(x - d, y);
          ctx.closePath();
          ctx.fill();
        }

        if (s.depth > 0.55 && baseAlpha > 0.25) {
          ctx.beginPath();
          ctx.fillStyle = color.replace(/[\d.]+\)$/, `${baseAlpha * 0.18})`);
          ctx.arc(x, y, s.r * 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ===== Shooting stars =====
      if (!reduceMotion && elapsed >= nextShootingAt) {
        spawnShootingStar();
        // Next one in 5–10s so a typical 5–10s glance reliably catches one.
        nextShootingAt = elapsed + 5 + Math.random() * 5;
      }
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.life += dt;
        ss.x += ss.vx * dt;
        ss.y += ss.vy * dt;
        const lifeT = ss.life / ss.maxLife;
        // Ease in/out alpha — quick rise, slow fade
        const sAlpha =
          (lifeT < 0.15 ? lifeT / 0.15 : Math.max(0, 1 - (lifeT - 0.15) / 0.85)) *
          (0.55 + ss.depth * 0.45) *
          revealEase;
        if (lifeT >= 1 || ss.x < -200 || ss.x > width + 200 || ss.y > height + 200) {
          shootingStars.splice(i, 1);
          continue;
        }
        // Streak: gradient line from head to tail
        const speed = Math.hypot(ss.vx, ss.vy);
        const tailX = ss.x - (ss.vx / speed) * ss.length;
        const tailY = ss.y - (ss.vy / speed) * ss.length;
        const grad = ctx.createLinearGradient(ss.x, ss.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255, 255, 255, ${sAlpha})`);
        grad.addColorStop(0.4, `rgba(180, 200, 255, ${sAlpha * 0.6})`);
        grad.addColorStop(1, `rgba(180, 200, 255, 0)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1 + ss.depth * 1.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
        // Bright head
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${sAlpha})`;
        ctx.arc(ss.x, ss.y, 1.4 + ss.depth * 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // ===== Satellite =====
      if (satellite) {
        satellite.x += satellite.vx * dt;
        satellite.y += satellite.vy * dt;
        satellite.rot += satellite.rotSpeed * dt;
        const offScreen =
          satellite.x < -100 ||
          satellite.x > width + 100 ||
          satellite.y < -100 ||
          satellite.y > height + 100;
        if (offScreen) {
          satellite = null;
          // Cooldown 12–22s before next satellite
          nextSatelliteAt = elapsed + 12 + Math.random() * 10;
        } else {
          const scale = 0.6 + satellite.depth * 0.9;
          const alpha = (0.5 + satellite.depth * 0.4) * revealEase;
          const satelliteY = satellite.y + scroll.current * (16 + satellite.depth * 32);
          ctx.save();
          ctx.translate(satellite.x, satelliteY);
          ctx.rotate(satellite.rot);
          ctx.scale(scale, scale);
          ctx.globalAlpha = alpha;
          // Tiny stylized satellite: body + two solar panels + faint signal dot
          ctx.fillStyle = isDark ? 'rgba(200, 210, 230, 0.95)' : 'rgba(70, 80, 110, 0.95)';
          ctx.strokeStyle = isDark ? 'rgba(160, 180, 220, 0.7)' : 'rgba(70, 80, 110, 0.7)';
          ctx.lineWidth = 1;
          // Solar panels (left + right)
          ctx.fillStyle = isDark ? 'rgba(80, 130, 220, 0.85)' : 'rgba(60, 100, 200, 0.85)';
          ctx.fillRect(-14, -2.5, 8, 5);
          ctx.fillRect(6, -2.5, 8, 5);
          ctx.strokeRect(-14, -2.5, 8, 5);
          ctx.strokeRect(6, -2.5, 8, 5);
          // Body
          ctx.fillStyle = isDark ? 'rgba(220, 225, 240, 0.95)' : 'rgba(80, 90, 120, 0.95)';
          ctx.fillRect(-3.5, -3.5, 7, 7);
          ctx.strokeRect(-3.5, -3.5, 7, 7);
          // Antenna
          ctx.beginPath();
          ctx.moveTo(0, -3.5);
          ctx.lineTo(0, -8);
          ctx.stroke();
          ctx.fillStyle = 'rgba(120, 200, 255, 0.9)';
          ctx.beginPath();
          ctx.arc(0, -8.5, 1.1, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
          ctx.globalAlpha = 1;
        }
      }


      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseleave', onLeave);
      ro.disconnect();
    };
  }, [isDark, spotlightRef]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      {/* Subtle grid for texture */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(${isDark ? 'rgba(192, 192, 192, 0.5)' : 'rgba(66, 133, 244, 0.3)'} 1px, transparent 1px),
            linear-gradient(90deg, ${isDark ? 'rgba(192, 192, 192, 0.5)' : 'rgba(66, 133, 244, 0.3)'} 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
};

export default HeroBackground;
