import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import gsap from "gsap";

const vertexShader = /* glsl */`
uniform vec2 uVelocity;
uniform vec2 uViewport;
uniform float uCurvature;

varying vec2 vUv;

float circularArc(float d) {
  float maxAngle = 1.15;
  float theta = clamp(d, 0.0, 1.0) * maxAngle;
  return (1.0 - cos(theta)) / (1.0 - cos(maxAngle));
}

void main() {
  vUv = uv;

  vec4 worldPos = modelMatrix * vec4(position, 1.0);

  float nx = worldPos.x / uViewport.x;
  float ny = worldPos.y / uViewport.y;

  float cx = clamp(nx, -1.0, 1.0);
  float cy = clamp(ny, -1.0, 1.0);

  // distance from center (0 center → 1 edges)
  float distY = abs(cy);
  float distX = abs(cx);

  // circular-arc falloff: keeps the same edge max, but reads as a real curve
  float curveY = circularArc(distY);
  float curveX = circularArc(distX);

  // GSAP controls uCurvature, so the curve can ease smoothly back to plane.
  float edgeLift = curveY * uCurvature + curveX * (uCurvature * 0.1);

  // final Z (ONLY edges move forward, center stays stable)
  float finalZOffset = edgeLift;

  // perspective
  float focalLength = max(uViewport.y * 2.2, 900.0);
  float perspective = focalLength / (focalLength - finalZOffset);

  vec3 finalPos = worldPos.xyz;
  finalPos.xy *= perspective;
  finalPos.z += finalZOffset;

  gl_Position = projectionMatrix * viewMatrix * vec4(finalPos, 1.0);
}
`;

const fragmentShader = /* glsl */`
uniform sampler2D uTexture;
uniform vec2 uPlaneSize;
uniform vec2 uImageSize;
uniform float uAlpha;
uniform float uZoom;
varying vec2 vUv;

vec2 coverUv(vec2 uv, vec2 planeSize, vec2 imageSize) {
  float planeRatio = planeSize.x / planeSize.y;
  float imageRatio = imageSize.x / imageSize.y;
  vec2 scale = vec2(1.0);
  if (planeRatio > imageRatio) {
    scale.y = imageRatio / planeRatio;
  } else {
    scale.x = planeRatio / imageRatio;
  }
  uv = (uv - 0.5) * scale + 0.5;
  return (uv - 0.5) / uZoom + 0.5;
}

void main() {
  vec2 uv = coverUv(vUv, uPlaneSize, uImageSize);
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) discard;
  vec4 tex = texture2D(uTexture, uv);
  gl_FragColor = vec4(tex.rgb, tex.a * uAlpha);
}
`;

const clamp = (v, mn, mx) => Math.min(Math.max(v, mn), mx);
const lerp = (a, b, t) => a + (b - a) * t;

export const defaultIndustryItems = [
  {
    id: "01",
    icon: "🪙",
    title: "FinTech, Banking & BFSI",
    focus: "Decentralized Ledger, Fraud AI & WealthTech",
    year: "$4.2B+",
    doodleBadge: "⚡ Real-Time Ledger AI",
    img: "/assets/images/industry-fintech-3d.jpg",
    subsectors: ["Banking", "BFSI Solutions", "Insurance", "Crypto & Web3", "Fintech"],
    capabilities: ["Real-Time Fraud Engine", "Automated KYC/AML", "Algorithmic Underwriting", "High-Speed Ledger"]
  },
  {
    id: "02",
    icon: "🧬",
    title: "HealthTech & Life Sciences",
    focus: "Clinical AI, EHR Telemetry & HIPAA Vaults",
    year: "99.9%",
    doodleBadge: "🧬 Diagnostic Neural Pulse",
    img: "/assets/images/industry-healthcare-3d.jpg",
    subsectors: ["Healthcare", "Pharma", "Life Sciences", "Telehealth", "Clinical AI"],
    capabilities: ["AI Triage Assistant", "Clinical NLP Extraction", "HIPAA Secure Storage", "Vital Telemetry"]
  },
  {
    id: "03",
    icon: "🛍️",
    title: "E-Commerce & Digital Retail",
    focus: "Headless Storefronts, Cart AI & Dynamic Pricing",
    year: "3.4x",
    doodleBadge: "🛍️ Smart Cart Engine",
    img: "/assets/images/industry-ecommerce-3d.jpg",
    subsectors: ["Retail", "Ecommerce", "Food & Beverage", "Social Commerce"],
    capabilities: ["Omnichannel Sync", "Real-Time Stock AI", "Checkout Optimization", "Dynamic Pricing Engine"]
  },
  {
    id: "04",
    icon: "🚁",
    title: "Logistics, Fleet & Supply Chain",
    focus: "Autonomous Fleet, Route Telemetry & IoT",
    year: "48ms",
    doodleBadge: "🚁 Autonomous Drone OS",
    img: "/assets/images/industry-logistics-3d.jpg",
    subsectors: ["Logistics", "Automotive", "Energy & Utility", "Manufacturing"],
    capabilities: ["Route Optimization", "Fleet Telematics", "Predictive Restocking", "Warehouse Robotics"]
  },
  {
    id: "05",
    icon: "🧠",
    title: "SaaS Products & Enterprise AI",
    focus: "Autonomous AI Agents, Multi-tenant Core",
    year: "10M+",
    doodleBadge: "🧠 Multi-Agent Core",
    img: "/assets/images/industry-saas-3d.jpg",
    subsectors: ["SaaS Products", "HR Tech", "Legal & Professional", "Education"],
    capabilities: ["Multi-Tenant Core", "Autonomous Agent Workflows", "Usage-Based Billing", "RAG Knowledge Index"]
  },
  {
    id: "06",
    icon: "🎮",
    title: "Media, Sports & WebGL Gaming",
    focus: "Real-time 3D, WebRTC Video & Fan Engagement",
    year: "60 FPS",
    doodleBadge: "🎮 Haptic 3D Spatial Engine",
    img: "/assets/images/industry-gaming-3d.jpg",
    subsectors: ["Sports & Gaming", "Media & Entertainment", "Creative AI"],
    capabilities: ["Interactive 3D WebGL", "Sub-Second Live Streaming", "Fan Engagement Hubs", "Generative Storyboards"]
  }
];

export function InteractiveHoverSlider({
  items = defaultIndustryItems,
  compact = true,
  className = "h-[400px]",
  style
} = {}) {
  const mountRef = useRef(null);
  const glRef = useRef(null);
  const isDesktopRef = useRef(false);
  const stateRef = useRef({ activeIndex: 0, hovering: false, hasClicked: false });
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  useEffect(() => {
    if (!items.length) return;
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let W = Math.max(1, mount.clientWidth);
    let H = Math.max(1, mount.clientHeight);

    const CARD_ASPECT = 1.7;
    const GAP = 14;
    const VISIBLE = Math.min(items.length, 6);
    const HALF = Math.floor(VISIBLE / 2);

    const getCardH = () => Math.round(H * (compact ? 0.44 : W < 768 ? 0.38 : 0.52));
    const getCardW = () => {
      const cardW = getCardH() * CARD_ASPECT;
      return Math.round(W < 768 ? Math.min(cardW, W * 0.88) : cardW);
    };

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    Object.assign(renderer.domElement.style, {
      position: "absolute",
      top: "0",
      left: "0",
      right: "0",
      bottom: "0",
      width: "100%",
      height: "100%",
      zIndex: "5",
      pointerEvents: "none"
    });
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera();
    const updateCamera = () => {
      camera.left = -W / 2;
      camera.right = W / 2;
      camera.top = H / 2;
      camera.bottom = -H / 2;
      camera.near = -2000;
      camera.far = 2000;
      camera.updateProjectionMatrix();
    };
    camera.position.z = 1000;
    updateCamera();
    renderer.setSize(W, H, false);

    const loader = new THREE.TextureLoader();
    const texCache = {};
    const getTexture = (src) => {
      if (texCache[src]) return texCache[src];
      const tex = loader.load(src, (t) => {
        if (disposed) { t.dispose(); return; }
        t.colorSpace = THREE.SRGBColorSpace;
        t.minFilter = THREE.LinearFilter;
        t.magFilter = THREE.LinearFilter;
        t.userData.iw = t.image?.width || 1600;
        t.userData.ih = t.image?.height || 900;
      });
      tex.userData.iw = 1600;
      tex.userData.ih = 900;
      texCache[src] = tex;
      return tex;
    };
    items.forEach(item => getTexture(item.img));

    const syncImageSize = (mesh) => {
      const t = mesh.material.uniforms.uTexture.value;
      if (!t?.image) return;
      mesh.material.uniforms.uImageSize.value.set(
        t.image.width || t.userData.iw || 1600,
        t.image.height || t.userData.ih || 900
      );
    };

    const geo = new THREE.PlaneGeometry(1, 1, 64, 64);
    let CW = getCardW(), CH = getCardH();

    const makeMat = (tex) => new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: tex },
        uPlaneSize: { value: new THREE.Vector2(CW, CH) },
        uImageSize: { value: new THREE.Vector2(tex.userData.iw || 1600, tex.userData.ih || 900) },
        uVelocity: { value: new THREE.Vector2(0, 0) },
        uAlpha: { value: 0 },
        uZoom: { value: 1.05 },
        uViewport: { value: new THREE.Vector2(W / 2, H / 2) },
        uCurvature: { value: 0 }
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide
    });

    const firstTex = getTexture(items[0].img);
    const meshes = Array.from({ length: VISIBLE }, (_, i) => {
      const mesh = new THREE.Mesh(geo, makeMat(firstTex));
      mesh.renderOrder = i;
      scene.add(mesh);
      return mesh;
    });

    const curveAnim = { value: 0, zoom: 1.05 };
    const anim = { alpha: 0 };
    const ACTIVE_CURVE = 360;
    const SOFT_CURVE = 80;
    let floatIdx = 0;
    let prevFloat = 0;
    const vel = new THREE.Vector2(0, 0);
    let raf = 0;

    const getCurveForTravel = (targetIdx) => {
      const travel = Math.abs(targetIdx - floatIdx);
      const p = clamp((travel - 0.35) / 3.5, 0, 1);
      const eased = p * p * (3 - 2 * p);
      return lerp(SOFT_CURVE, ACTIVE_CURVE, eased);
    };

    const releaseCurve = (targetIdx = stateRef.current.activeIndex) => {
      const peakCurve = getCurveForTravel(targetIdx);
      gsap.killTweensOf(curveAnim);
      curveAnim.zoom = 1.05;
      gsap
        .timeline()
        .to(curveAnim, {
          value: peakCurve,
          zoom: 1.05,
          duration: 0.12,
          ease: "power2.out"
        })
        .to(curveAnim, {
          value: 0,
          zoom: 1.05,
          duration: 1.15,
          ease: "power2.inOut"
        });
    };

    const show = (targetIdx) => {
      gsap.killTweensOf(anim);
      gsap.to(anim, { alpha: 1, duration: 0.45, ease: "power3.out" });
      releaseCurve(targetIdx);
    };

    const onResize = () => {
      W = Math.max(1, mount.clientWidth);
      H = Math.max(1, mount.clientHeight);
      isDesktopRef.current = W >= 768;
      renderer.setSize(W, H, false);
      updateCamera();
      CW = getCardW();
      CH = getCardH();
      meshes.forEach(m => {
        m.material.uniforms.uPlaneSize.value.set(CW, CH);
        m.material.uniforms.uViewport.value.set(W / 2, H / 2);
      });
    };

    const observer = new ResizeObserver(onResize);
    observer.observe(mount);
    onResize();

    stateRef.current.hasClicked = true;
    stateRef.current.hovering = true;
    show(0);

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const targetIdx = stateRef.current.activeIndex;
      const diff = targetIdx - floatIdx;
      const dist = Math.abs(diff);
      const t = clamp(0.18 - dist * 0.06, 0.05, 0.18);

      floatIdx = floatIdx + diff * t;
      const delta = floatIdx - prevFloat;
      vel.y = lerp(vel.y, delta * 60, 0.16);
      vel.x = lerp(vel.x, 0, 0.14);
      prevFloat = floatIdx;

      const centreInt = Math.round(floatIdx);
      const drift = floatIdx - centreInt;

      for (let i = 0; i < VISIBLE; i++) {
        const offset = i - HALF;
        const itemIdx = ((centreInt + offset) % items.length + items.length) % items.length;
        const posY = (-offset + drift) * (CH + GAP);
        const d = Math.abs(offset - drift);

        const scaleH = Math.max(0.78, 1.0 - d * 0.06);
        const sw = CW;
        const sh = CH * scaleH;
        const baseOpacity = 0.95;
        const opacity = Math.max(0, baseOpacity - d * 0.22) * anim.alpha;

        const wantTex = getTexture(items[itemIdx].img);
        if (meshes[i].material.uniforms.uTexture.value !== wantTex) {
          meshes[i].material.uniforms.uTexture.value = wantTex;
        }
        syncImageSize(meshes[i]);

        // Place on right side of bento on desktop
        const posX = W >= 992 ? W * 0.22 : 0;
        meshes[i].position.set(posX, posY, i);
        meshes[i].scale.set(sw, sh, 1);
        meshes[i].material.uniforms.uVelocity.value.set(vel.x, vel.y * 0.28);
        meshes[i].material.uniforms.uAlpha.value = opacity;
        meshes[i].material.uniforms.uZoom.value = curveAnim.zoom - clamp(1.0 - d, 0, 1) * 0.04;
        meshes[i].material.uniforms.uPlaneSize.value.set(sw, sh);
        meshes[i].material.uniforms.uCurvature.value = curveAnim.value;
        meshes[i].material.uniforms.uViewport.value.set(W / 2, H / 2);
      }

      renderer.render(scene, camera);
    };

    tick();

    glRef.current = {
      setActive: (i) => {
        stateRef.current.activeIndex = i;
        releaseCurve(i);
      }
    };

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      gsap.killTweensOf(anim);
      gsap.killTweensOf(curveAnim);
      geo.dispose();
      meshes.forEach(m => m.material.dispose());
      Object.values(texCache).forEach(t => t.dispose());
      renderer.dispose();
      renderer.domElement.remove();
      glRef.current = null;
    };
  }, [items, compact]);

  const onRowEnter = useCallback((index) => {
    stateRef.current.activeIndex = index;
    setHighlightedIndex(index);
    glRef.current?.setActive(index);
  }, []);

  return (
    <div
      ref={mountRef}
      className={`interactive-hover-slider-root relative isolate w-full overflow-hidden rounded-2xl bg-[#090b0e] text-white ${className}`}
      style={style}
    >
      <div className="relative z-20 flex h-full flex-col justify-between p-5 md:p-7">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs tracking-widest text-white/50 uppercase">
          <span>05 / DEMAZe DOMAIN VERTICALS</span>
          <span className="text-[#ff5c2b] flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#ff5c2b] animate-ping" />
            ALL 19 INDUSTRIES COVERED
          </span>
        </div>

        <div className="my-auto max-w-[50%] max-md:max-w-full">
          {items.map((item, idx) => (
            <div
              key={item.id}
              onMouseEnter={() => onRowEnter(idx)}
              onClick={() => onRowEnter(idx)}
              className={`flex cursor-pointer items-center justify-between border-b border-white/5 py-2 transition-all ${
                highlightedIndex === idx ? "text-[#ff5c2b] translate-x-1" : "text-white/60 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono opacity-50">{item.id}</span>
                <span className="text-sm font-semibold flex items-center gap-1.5">
                  <span className="text-sm">{item.icon}</span>
                  {item.title}
                </span>
              </div>
              <span className="text-xs font-mono text-[#ff8c42]">{item.year}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3 text-xs text-white/60">
          <div className="flex gap-2">
            {items[highlightedIndex]?.subsectors?.map((sub) => (
              <span key={sub} className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] text-white/80">
                {sub}
              </span>
            ))}
          </div>
          <span className="font-mono text-[#ff5c2b] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff5c2b]" />
            {items[highlightedIndex]?.doodleBadge || "3D LIVE DOODLE STACK"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default InteractiveHoverSlider;
