import * as THREE from 'three';
import gsap from 'gsap';

export const industrySectors = [
  {
    id: "01",
    key: "fintech",
    icon: "🪙",
    title: "FinTech, Banking & BFSI",
    focus: "Decentralized Ledger, Fraud AI & WealthTech",
    metric: "Ledger & Fraud AI",
    doodleBadge: "Ledger Architecture & Fraud AI",
    img: "/assets/images/industry-fintech-3d.jpg",
    subsectors: ["Banking", "BFSI Solutions", "Insurance", "Crypto & Web3", "Fintech"],
    capabilities: ["Real-Time Fraud Engine", "Automated KYC/AML", "Algorithmic Underwriting", "High-Speed Ledger"]
  },
  {
    id: "02",
    key: "healthcare",
    icon: "🧬",
    title: "HealthTech & Life Sciences",
    focus: "Clinical AI, EHR Telemetry & HIPAA Vaults",
    metric: "Clinical NLP & Telemetry",
    doodleBadge: "HIPAA Cloud & Clinical Telemetry",
    img: "/assets/images/industry-healthcare-3d.jpg",
    subsectors: ["Healthcare", "Pharma", "Life Sciences", "Telehealth", "Clinical AI"],
    capabilities: ["AI Triage Assistant", "Clinical NLP Extraction", "HIPAA Secure Cloud", "Vital Telemetry"]
  },
  {
    id: "03",
    key: "ecommerce",
    icon: "🛍️",
    title: "E-Commerce & Digital Retail",
    focus: "Headless Storefronts, Cart AI & Dynamic Pricing",
    metric: "Headless & Dynamic Cart",
    doodleBadge: "Headless Commerce & Cart AI",
    img: "/assets/images/industry-ecommerce-3d.jpg",
    subsectors: ["Retail", "Ecommerce", "Food & Beverage", "Social Commerce"],
    capabilities: ["Omnichannel Sync", "Real-Time Stock AI", "Checkout Optimization", "Dynamic Pricing Engine"]
  },
  {
    id: "04",
    key: "logistics",
    icon: "🚁",
    title: "Logistics, Fleet & Supply Chain",
    focus: "Autonomous Fleet, Route Telemetry & IoT",
    metric: "Fleet Routing & IoT",
    doodleBadge: "Fleet Telematics & Route Engine",
    img: "/assets/images/industry-logistics-3d.jpg",
    subsectors: ["Logistics", "Automotive", "Energy & Utility", "Manufacturing"],
    capabilities: ["Route Optimization", "Fleet Telematics", "Predictive Restocking", "Warehouse Robotics"]
  },
  {
    id: "05",
    key: "saas",
    icon: "🧠",
    title: "SaaS Products & Enterprise AI",
    focus: "Autonomous AI Agents, Multi-tenant Core",
    metric: "Autonomous Agents & RAG",
    doodleBadge: "Multi-Tenant Agentic Systems",
    img: "/assets/images/industry-saas-3d.jpg",
    subsectors: ["SaaS Products", "HR Tech", "Legal & Professional", "Education"],
    capabilities: ["Multi-Tenant Core", "Autonomous Agent Workflows", "Usage-Based Billing", "RAG Knowledge Index"]
  },
  {
    id: "06",
    key: "gaming",
    icon: "🎮",
    title: "Media, Sports & WebGL Gaming",
    focus: "Real-time 3D, WebRTC Video & Fan Engagement",
    metric: "Real-time 3D & WebRTC",
    doodleBadge: "Interactive 3D WebGL Engine",
    img: "/assets/images/industry-gaming-3d.jpg",
    subsectors: ["Sports & Gaming", "Media & Entertainment", "Creative AI"],
    capabilities: ["Interactive 3D WebGL", "Sub-Second Live Streaming", "Fan Engagement Hubs", "Generative Storyboards"]
  }
];

export const all19Industries = [
  { id: "01", name: "FinTech & Banking", category: "Finance", icon: "🪙", metric: "Ledger & Fraud AI", desc: "High-throughput transaction processing, AI fraud prevention, regulatory compliance automation, and algorithmic underwriting.", tags: ["Fraud Engine", "KYC/AML", "Ledgers"] },
  { id: "02", name: "Healthcare & Life Sciences", category: "Health", icon: "🧬", metric: "Clinical Telemetry", desc: "HIPAA-compliant clinical platforms, AI patient triage assistants, diagnostic intelligence models, and medical practice workflow automation.", tags: ["Clinical AI", "EHR Sync", "HIPAA Vault"] },
  { id: "03", name: "E-Commerce & Retail", category: "Commerce", icon: "🛍️", metric: "Headless Commerce", desc: "Headless commerce, AI cart optimization, live streaming shopping, multi-vendor marketplaces, and dynamic pricing engines.", tags: ["Smart Cart", "Headless", "Pricing AI"] },
  { id: "04", name: "Logistics & Fleet", category: "Operations", icon: "🚁", metric: "Fleet & Route IoT", desc: "Autonomous dispatch algorithms, route optimization engines, cold-chain telemetry monitoring, and multi-hub inventory reconciliation.", tags: ["Route AI", "Fleet IoT", "Warehouse OS"] },
  { id: "05", name: "SaaS & Enterprise AI", category: "Cloud", icon: "🧠", metric: "Autonomous Agents", desc: "Cloud-native multi-tenant SaaS platforms featuring autonomous AI agents, usage-based billing, role-based security, and extensible APIs.", tags: ["Multi-Tenant", "Agent Core", "RAG Index"] },
  { id: "06", name: "Gaming & WebGL 3D", category: "Media", icon: "🎮", metric: "Real-Time 3D Engine", desc: "Ultra-low latency streaming architectures, real-time player telemetry, interactive 3D WebGL engines, and community engagement hubs.", tags: ["3D WebGL", "Sub-Sec Stream", "Telemetry"] },
  { id: "07", name: "BFSI & WealthTech", category: "Finance", icon: "📈", metric: "Institutional Core", desc: "Enterprise financial software with institutional security, automated wealth advisory engines, audit trails, and automated regulatory reporting.", tags: ["Wealth Portals", "Audit Trails", "Risk Models"] },
  { id: "08", name: "Automotive & Dealership OS", category: "Operations", icon: "🏎️", metric: "Dealership OS", desc: "Enterprise operating systems for luxury dealerships, automating vehicle appraisal, instant EMI financing, and workshop refurbishment.", tags: ["Valuation AI", "EMI Calculator", "DMS Sync"] },
  { id: "09", name: "Energy & Utilities", category: "Operations", icon: "⚡", metric: "Smart Grid IoT", desc: "Smart grid IoT sensor ingestion, equipment failure prediction, utility consumption forecasting, and enterprise billing synchronization.", tags: ["Grid Telemetry", "Predictive Maint.", "IoT Ingestion"] },
  { id: "10", name: "Real Estate & PropTech", category: "Commerce", icon: "🏢", metric: "PropTech & Staging", desc: "AI property valuation algorithms, virtual staging pipelines, tenant management portals, and automated digital lease execution workflows.", tags: ["Valuation AI", "Virtual Staging", "Lease Workflows"] },
  { id: "11", name: "Media & Entertainment", category: "Media", icon: "🎬", metric: "GenAI & Asset DRM", desc: "Generative AI script-to-storyboard pipelines, automated multi-language transcription, digital asset management, and adaptive video delivery.", tags: ["GenAI Storyboard", "Speech-to-Text", "DRM Cloud"] },
  { id: "12", name: "Education & EdTech", category: "Cloud", icon: "🎓", metric: "Adaptive Learning", desc: "Adaptive learning platforms, automated grading assistants, interactive virtual classrooms, and predictive student progress analytics.", tags: ["Adaptive AI", "Virtual Classroom", "Grading AI"] },
  { id: "13", name: "Food, Beverage & Hospitality", category: "Commerce", icon: "🍔", metric: "Kitchen & Cold-Chain", desc: "Kitchen display systems, cold-chain temperature telemetry, customer loyalty mobile applications, and automated restaurant reservations.", tags: ["Kitchen OS", "Cold-Chain IoT", "Table Booking"] },
  { id: "14", name: "LegalTech & Professional", category: "Cloud", icon: "⚖️", metric: "Zero-Trust Vaults", desc: "Secure case management platforms for legal teams, featuring AI speech transcription, document indexing, and automated deposits.", tags: ["Case Vault", "Audio NLP", "Evidence Chain"] },
  { id: "15", name: "Human Resources & Talent", category: "Cloud", icon: "👥", metric: "Talent & Matching", desc: "Intelligent candidate matching, resume parsing pipelines, onboarding automation, and organizational retention analytics.", tags: ["Resume Parser", "Matching AI", "Sentiment"] },
  { id: "16", name: "Insurance & InsurTech", category: "Finance", icon: "🛡️", metric: "Claims Automation", desc: "Automated claim adjudication pipelines, digital policy administration, risk scoring engines, and instant automated payouts.", tags: ["Claims AI", "Policy Admin", "Fraud Scoring"] },
  { id: "17", name: "Social Commerce & Creators", category: "Commerce", icon: "📱", metric: "Live Commerce", desc: "Merging social discovery with instant commerce, enabling live streaming shopping, creator affiliate tracking, and friction-free social checkout.", tags: ["Live Shopping", "Creator Sync", "1-Click Buy"] },
  { id: "18", name: "Manufacturing & B2B Industry", category: "Operations", icon: "🏭", metric: "Industrial IoT", desc: "Industrial IoT predictive maintenance, supply chain procurement automation, factory floor visualization, and legacy ERP modernization.", tags: ["Factory IoT", "Predictive AI", "ERP Modern"] },
  { id: "19", name: "Sports & Esports Streaming", category: "Media", icon: "🏆", metric: "Low-Latency Stream", desc: "Live match telemetry overlays, interactive fantasy backends, low-latency WebRTC streams, and global leaderboard scalability.", tags: ["Live Overlays", "Fantasy Core", "WebRTC"] }
];

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

  float distY = abs(cy);
  float distX = abs(cx);

  float curveY = circularArc(distY);
  float curveX = circularArc(distX);

  float edgeLift = curveY * uCurvature + curveX * (uCurvature * 0.1);
  float finalZOffset = edgeLift;

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

export function initIndustryHoverSlider() {
  const container = document.getElementById('industry-hover-slider');
  if (!container) return;

  const canvasMount = container.querySelector('.slider-webgl-mount');
  const rowButtons = container.querySelectorAll('.industry-slider-row');
  const badgeTitle = container.querySelector('.industry-active-doodle-badge .badge-text');
  const subsectorsWrap = container.querySelector('.industry-active-subsectors');
  const capabilitiesWrap = container.querySelector('.industry-active-caps');
  if (!canvasMount || !rowButtons.length) return;

  // Cleanup any old canvas child if present to avoid duplicate renderers
  const oldCanvases = canvasMount.querySelectorAll('canvas');
  oldCanvases.forEach(c => c.remove());

  let W = Math.max(1, canvasMount.clientWidth);
  let H = Math.max(1, canvasMount.clientHeight);

  const CARD_ASPECT = 1.7;
  const GAP = 12;
  const VISIBLE = Math.min(industrySectors.length, 6);
  const HALF = Math.floor(VISIBLE / 2);

  // Compact 400px calibrated card heights
  const getCardH = () => Math.round(H * (W < 768 ? 0.42 : 0.48));
  const getCardW = () => {
    const cardW = getCardH() * CARD_ASPECT;
    return Math.round(W < 768 ? Math.min(cardW, W * 0.90) : Math.min(cardW, W * 0.88));
  };

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  Object.assign(renderer.domElement.style, {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    zIndex: "2",
    pointerEvents: "none"
  });
  canvasMount.appendChild(renderer.domElement);

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
  industrySectors.forEach(item => getTexture(item.img));

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

  const firstTex = getTexture(industrySectors[0].img);
  const meshes = Array.from({ length: VISIBLE }, (_, i) => {
    const mesh = new THREE.Mesh(geo, makeMat(firstTex));
    mesh.renderOrder = i;
    scene.add(mesh);
    return mesh;
  });

  const curveAnim = { value: 0, zoom: 1.05 };
  const anim = { alpha: 1 };
  const ACTIVE_CURVE = 300;
  const SOFT_CURVE = 60;
  let activeIndex = 0;
  let floatIdx = 0;
  let prevFloat = 0;
  const vel = new THREE.Vector2(0, 0);

  // Mouse Parallax & 3D Tilt for tactile doodle feel
  const mouseNorm = { x: 0, y: 0 };
  const targetMouse = { x: 0, y: 0 };
  container.addEventListener('mousemove', (e) => {
    const rect = canvasMount.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    targetMouse.x = clamp(nx, -1, 1);
    targetMouse.y = clamp(ny, -1, 1);
  });
  container.addEventListener('mouseleave', () => {
    targetMouse.x = 0;
    targetMouse.y = 0;
  });

  const getCurveForTravel = (targetIdx) => {
    const travel = Math.abs(targetIdx - floatIdx);
    const p = clamp((travel - 0.35) / 3.5, 0, 1);
    const eased = p * p * (3 - 2 * p);
    return lerp(SOFT_CURVE, ACTIVE_CURVE, eased);
  };

  const releaseCurve = (targetIdx = activeIndex) => {
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

  const updateActiveUI = (idx) => {
    activeIndex = idx;
    rowButtons.forEach((btn, i) => {
      if (i === idx) {
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      }
    });

    const item = industrySectors[idx];
    if (!item) return;

    if (badgeTitle) {
      badgeTitle.textContent = item.doodleBadge;
    }

    if (subsectorsWrap) {
      subsectorsWrap.innerHTML = item.subsectors.map(s => `<span class="subsector-pill">${s}</span>`).join('');
    }

    if (capabilitiesWrap) {
      capabilitiesWrap.innerHTML = item.capabilities.slice(0, 3).map(c => `<span class="industry-cap-chip">${c}</span>`).join('');
    }

    releaseCurve(idx);
  };

  rowButtons.forEach((btn, i) => {
    btn.addEventListener('mouseenter', () => updateActiveUI(i));
    btn.addEventListener('click', () => updateActiveUI(i));
    btn.addEventListener('focus', () => updateActiveUI(i));
  });

  const onResize = () => {
    W = Math.max(1, canvasMount.clientWidth);
    H = Math.max(1, canvasMount.clientHeight);
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
  observer.observe(canvasMount);
  onResize();
  updateActiveUI(0);

  let raf = 0;
  const tick = () => {
    raf = requestAnimationFrame(tick);
    const targetIdx = activeIndex;
    const diff = targetIdx - floatIdx;
    const dist = Math.abs(diff);
    const t = clamp(0.18 - dist * 0.06, 0.05, 0.18);

    floatIdx = floatIdx + diff * t;
    const delta = floatIdx - prevFloat;
    vel.y = lerp(vel.y, delta * 60, 0.16);
    vel.x = lerp(vel.x, 0, 0.14);
    prevFloat = floatIdx;

    mouseNorm.x = lerp(mouseNorm.x, targetMouse.x, 0.08);
    mouseNorm.y = lerp(mouseNorm.y, targetMouse.y, 0.08);

    const centreInt = Math.round(floatIdx);
    const drift = floatIdx - centreInt;

    for (let i = 0; i < VISIBLE; i++) {
      const offset = i - HALF;
      const itemIdx = ((centreInt + offset) % industrySectors.length + industrySectors.length) % industrySectors.length;
      const posY = (-offset + drift) * (CH + GAP);
      const d = Math.abs(offset - drift);

      const scaleH = Math.max(0.80, 1.0 - d * 0.06);
      const sw = CW;
      const sh = CH * scaleH;
      const baseOpacity = 0.98;
      const opacity = Math.max(0, baseOpacity - d * 0.24) * anim.alpha;

      const wantTex = getTexture(industrySectors[itemIdx].img);
      if (meshes[i].material.uniforms.uTexture.value !== wantTex) {
        meshes[i].material.uniforms.uTexture.value = wantTex;
      }
      syncImageSize(meshes[i]);

      // Subtle 3D mouse parallax response
      const posX = mouseNorm.x * 10;
      meshes[i].position.set(posX, posY, i);
      meshes[i].rotation.y = mouseNorm.x * 0.12;
      meshes[i].rotation.x = -mouseNorm.y * 0.10;
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

  // Initialize Related Component: All 19 Verticals Directory Drawer
  initAllIndustriesModal();
  initDoodleTelemetryCards();
}

function initAllIndustriesModal() {
  const openBtn = document.getElementById('open-all-industries-btn');
  const modal = document.getElementById('industry-all-modal');
  if (!openBtn || !modal) return;

  const closeBtn = modal.querySelector('.modal-close-btn');
  const backdrop = modal.querySelector('.modal-backdrop-blur');

  const openModal = () => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

function initDoodleTelemetryCards() {
  const cards = document.querySelectorAll('.doodle-telemetry-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-2px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) translateY(0)';
    });
  });
}
