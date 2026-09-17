import * as THREE from 'three';
import { initIndustryHoverSlider } from './interactive-hover-slider.js';

/**
 * Demaze Technologies - Interactive Logic & Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initHeroParticleSphere();
  initNeuralNervousSystem();
  initHeroInteractiveGlow();
  initScrollTextReveal();
  initTestimonialsSlider();
  initFaqAccordion();
  initCogniraUseCasesTabs();
  initBackToTop();
  highlightActiveNavLink();
  initFilterTabs();
  initTechFilterTabs();
  initIndustriesTabs();
  initIndustryHoverSlider();
  initDroneCurtainTransition();
  initScrollRevealStorytelling();
  initStickyBackdrop();
  initAnimatedCounters();
  initInteractiveContactForm();
  initCardTiltMicroInteractions();
  initBentoTerminalSimulation();
});

/* ==========================================================================
   1. Header Sticky & Mobile Menu
   ========================================================================== */
/**
 * Builds the mobile menu by cloning the desktop nav.
 *
 * The two used to be duplicated in the markup of all seven pages — 11 links
 * for 5 destinations in every header. Nothing rendered twice (the inactive set
 * is display:none), but every nav change had to be made in both places and
 * they had already drifted apart. One source now.
 */
function buildMobileMenu(header) {
  if (!header || header.querySelector('.mobile-menu-overlay')) return;

  const links = header.querySelector('.nav-links');
  const cta = header.querySelector('.header-actions .btn');
  if (!links) return;

  const overlay = document.createElement('div');
  overlay.className = 'mobile-menu-overlay';
  overlay.id = 'mobile-menu';

  links.querySelectorAll('.nav-link').forEach(link => overlay.appendChild(link.cloneNode(true)));
  if (cta) overlay.appendChild(cta.cloneNode(true));

  header.appendChild(overlay);
}

function initHeader() {
  const header = document.querySelector('.site-header');
  buildMobileMenu(header);
  const toggle = document.querySelector('.mobile-toggle');
  const overlay = document.querySelector('.mobile-menu-overlay');

  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  if (toggle && overlay) {
    // Keep aria-expanded in step with the visual state, otherwise a screen
    // reader gets no indication the menu opened.
    const setOpen = (open) => {
      toggle.classList.toggle('open', open);
      overlay.classList.toggle('show', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    };

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      setOpen(!overlay.classList.contains('show'));
    });

    document.addEventListener('click', (e) => {
      if (overlay.classList.contains('show') && !overlay.contains(e.target) && !toggle.contains(e.target)) {
        setOpen(false);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('show')) {
        setOpen(false);
        toggle.focus();
      }
    });

    overlay.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => setOpen(false));
    });
  }

  // Interactive floating nav indicator pill
  const navLinksContainer = header ? header.querySelector('.nav-links') : null;
  const hoverPill = navLinksContainer ? navLinksContainer.querySelector('.nav-hover-pill') : null;
  const navLinks = navLinksContainer ? Array.from(navLinksContainer.querySelectorAll('.nav-link')) : [];

  if (navLinksContainer && hoverPill && navLinks.length > 0) {
    function movePillTo(target) {
      if (!target) {
        const active = navLinks.find(l => l.classList.contains('active'));
        if (active) {
          movePillTo(active);
        } else {
          hoverPill.style.opacity = '0';
        }
        return;
      }
      const containerRect = navLinksContainer.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const left = targetRect.left - containerRect.left;
      const width = targetRect.width;

      hoverPill.style.transform = `translateX(${left}px)`;
      hoverPill.style.width = `${width}px`;
      hoverPill.style.opacity = '1';
    }

    navLinks.forEach(link => {
      link.addEventListener('mouseenter', () => movePillTo(link));
      link.addEventListener('focus', () => movePillTo(link));
    });

    navLinksContainer.addEventListener('mouseleave', () => {
      const active = navLinks.find(l => l.classList.contains('active'));
      if (active) {
        movePillTo(active);
      } else {
        hoverPill.style.opacity = '0';
      }
    });

    // Position on active link on load
    requestAnimationFrame(() => {
      const active = navLinks.find(l => l.classList.contains('active'));
      if (active) movePillTo(active);
    });
  }
}

function initHeroParticleSphere() {
  const container = document.getElementById('hero-sphere-container');
  if (!container) return;

  // Configuration parameters
  const particlesCount = 3200;
  const speed = 0.45;
  const smoothing = 1.0;
  const scale = 0.95;
  const rotationDirection = 'clockwise';
  const dragSpeed = 0.5;
  const drag = true;
  const stopOnHover = false;
  const particleScale = 0.28;
  const cursorConfig = {
    enabled: true,
    radius: 90,
    strength: 1.0,
    clickForce: 5.0
  };

  const mapRange = (val, inMin, inMax, outMin, outMax) => {
    return inMax === inMin ? outMin : outMin + ((val - inMin) / (inMax - inMin)) * (outMax - outMin);
  };

  const autoSpeed = mapRange(speed, 0.1, 1, 0.01, 0.045) * (rotationDirection === 'anticlockwise' ? -1 : 1);
  const scaleFactor = mapRange(Math.max(0, Math.min(1, scale)), 0, 1, 0.25, 1.25);
  const particleSize = mapRange(Math.max(0.1, Math.min(1, particleScale)), 0.1, 1, 0.01, 0.1);
  const cursorRadius = Math.max(0, Math.min(600, cursorConfig.radius));
  const cursorStrength = mapRange(Math.max(0, Math.min(1, cursorConfig.strength)), 0, 1, 0, 15);

  const frictionCoeff = 0.94;
  const returnForceCoeff = 0.015;

  const positions = [];
  const originalPositions = [];
  const displacements = [];
  const impulseVelocities = [];

  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const sphereRadius = 1 * scaleFactor;

  // Generate Fibonacci spherical coordinate distribution
  for (let i = 0; i < particlesCount; i++) {
    const yNorm = 1 - (i / (particlesCount - 1)) * 2;
    const radiusAtY = Math.sqrt(1 - yNorm * yNorm);
    const theta = goldenAngle * i;
    const x = Math.cos(theta) * radiusAtY * sphereRadius;
    const y = yNorm * sphereRadius;
    const z = Math.sin(theta) * radiusAtY * sphereRadius;

    positions.push(x, y, z);
    originalPositions.push(new THREE.Vector3(x, y, z));
    displacements.push(new THREE.Vector3(0, 0, 0));
    impulseVelocities.push(new THREE.Vector3(0, 0, 0));
  }

  // Setup Three.js scene & instanced particles
  const scene = new THREE.Scene();
  const group = new THREE.Group();
  scene.add(group);

  const sphereGeo = new THREE.SphereGeometry(particleSize * 0.15, 8, 8);
  const sphereMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    blending: THREE.AdditiveBlending,
    transparent: false,
    opacity: 1
  });

  const instancedMesh = new THREE.InstancedMesh(sphereGeo, sphereMat, particlesCount);
  const dummy = new THREE.Matrix4();
  for (let i = 0; i < particlesCount; i++) {
    const idx = i * 3;
    dummy.setPosition(positions[idx], positions[idx + 1], positions[idx + 2]);
    instancedMesh.setMatrixAt(i, dummy);
  }
  instancedMesh.instanceMatrix.needsUpdate = true;

  // Particle color: warm luminous golden pearl
  const particleColor = new THREE.Color(0.96, 0.94, 0.90);
  const colorsArray = new Float32Array(particlesCount * 3);
  for (let i = 0; i < particlesCount; i++) {
    const idx = i * 3;
    const brightness = 0.90 + Math.random() * 0.18;
    colorsArray[idx] = Math.min(1, particleColor.r * brightness);
    colorsArray[idx + 1] = Math.min(1, particleColor.g * brightness);
    colorsArray[idx + 2] = Math.min(1, particleColor.b * brightness * 0.95);
  }
  instancedMesh.instanceColor = new THREE.InstancedBufferAttribute(colorsArray, 3);
  instancedMesh.instanceColor.needsUpdate = true;
  group.add(instancedMesh);

  // =========================================================================
  // Internal Synaptic Brain Plexus (Glowing neural network filaments inside)
  // =========================================================================
  const synapseCount = 46;
  const synapsePositions = [];
  for (let s = 0; s < synapseCount; s++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = Math.cbrt(Math.random()) * (sphereRadius * 0.76);
    const sinPhi = Math.sin(phi);
    synapsePositions.push(new THREE.Vector3(
      r * sinPhi * Math.cos(theta),
      r * sinPhi * Math.sin(theta),
      r * Math.cos(phi)
    ));
  }

  const synapseLinePositions = [];
  for (let i = 0; i < synapseCount; i++) {
    for (let j = i + 1; j < synapseCount; j++) {
      const d = synapsePositions[i].distanceTo(synapsePositions[j]);
      if (d < sphereRadius * 0.50) {
        synapseLinePositions.push(
          synapsePositions[i].x, synapsePositions[i].y, synapsePositions[i].z,
          synapsePositions[j].x, synapsePositions[j].y, synapsePositions[j].z
        );
      }
    }
  }

  const synapseGeo = new THREE.BufferGeometry();
  synapseGeo.setAttribute('position', new THREE.Float32BufferAttribute(synapseLinePositions, 3));
  const synapseMat = new THREE.LineBasicMaterial({
    color: 0xffaa44,
    transparent: true,
    opacity: 0.58,
    blending: THREE.AdditiveBlending
  });
  const synapseMesh = new THREE.LineSegments(synapseGeo, synapseMat);
  group.add(synapseMesh);

  // Core Luminous Brain Glow & Glass Shell Boundary
  const coreGlowGeo = new THREE.SphereGeometry(sphereRadius * 0.35, 16, 16);
  const coreGlowMat = new THREE.MeshBasicMaterial({
    color: 0xff7722,
    transparent: true,
    opacity: 0.28,
    blending: THREE.AdditiveBlending
  });
  const coreGlow = new THREE.Mesh(coreGlowGeo, coreGlowMat);
  group.add(coreGlow);

  // Ethereal Glass Shell Rim
  const glassRimGeo = new THREE.SphereGeometry(sphereRadius * 1.025, 32, 32);
  const glassRimMat = new THREE.MeshBasicMaterial({
    color: 0xffeedd,
    transparent: true,
    opacity: 0.12,
    blending: THREE.AdditiveBlending
  });
  const glassRim = new THREE.Mesh(glassRimGeo, glassRimMat);
  group.add(glassRim);

  // Glowing Golden Orbital Rings
  const orbitGroup = new THREE.Group();
  scene.add(orbitGroup);

  const ringGeo1 = new THREE.TorusGeometry(sphereRadius * 1.08, 0.0028, 16, 120);
  const ringMat1 = new THREE.MeshBasicMaterial({
    color: 0xffaa44,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.8
  });
  const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
  ring1.rotation.x = Math.PI * 0.38;
  ring1.rotation.y = Math.PI * 0.12;
  orbitGroup.add(ring1);

  const ringGeo2 = new THREE.TorusGeometry(sphereRadius * 1.14, 0.0024, 16, 120);
  const ringMat2 = new THREE.MeshBasicMaterial({
    color: 0xff7722,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.65
  });
  const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
  ring2.rotation.x = -Math.PI * 0.32;
  ring2.rotation.z = Math.PI * 0.36;
  orbitGroup.add(ring2);

  // Orbiting Metallic & Golden Satellite Orbs
  const satelliteOrbs = [
    {
      mesh: new THREE.Mesh(
        new THREE.SphereGeometry(0.026, 24, 24),
        new THREE.MeshBasicMaterial({ color: 0xffdd88 })
      ),
      radius: sphereRadius * 1.08,
      inclination: Math.PI * 0.38,
      yaw: Math.PI * 0.12,
      speed: 0.0016,
      offset: 0
    },
    {
      mesh: new THREE.Mesh(
        new THREE.SphereGeometry(0.020, 24, 24),
        new THREE.MeshBasicMaterial({ color: 0xe0e6ed })
      ),
      radius: sphereRadius * 1.08,
      inclination: Math.PI * 0.38,
      yaw: Math.PI * 0.12,
      speed: 0.0016,
      offset: Math.PI * 0.85
    },
    {
      mesh: new THREE.Mesh(
        new THREE.SphereGeometry(0.022, 24, 24),
        new THREE.MeshBasicMaterial({ color: 0xffaa44 })
      ),
      radius: sphereRadius * 1.14,
      inclination: -Math.PI * 0.32,
      yaw: Math.PI * 0.36,
      speed: -0.0012,
      offset: 1.5
    },
    {
      mesh: new THREE.Mesh(
        new THREE.SphereGeometry(0.016, 24, 24),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      ),
      radius: sphereRadius * 1.14,
      inclination: -Math.PI * 0.32,
      yaw: Math.PI * 0.36,
      speed: -0.0012,
      offset: 4.2
    }
  ];

  satelliteOrbs.forEach(orb => orbitGroup.add(orb.mesh));

  // Renderer & Camera setup
  const canvasMultiplier = 2.5;
  let clientW = container.clientWidth || 380;
  let clientH = container.clientHeight || 380;
  let renderW = clientW * canvasMultiplier;
  let renderH = clientH * canvasMultiplier;

  const camera = new THREE.PerspectiveCamera(
    2 * Math.atan(Math.tan((50 * Math.PI / 180) / 2) * canvasMultiplier) * (180 / Math.PI),
    renderW / renderH,
    0.1,
    1000
  );
  camera.position.z = Math.max(3, sphereRadius + 1);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(renderW, renderH);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const canvas = renderer.domElement;
  canvas.style.position = 'absolute';
  let offsetX = (renderW - clientW) / 2;
  let offsetY = (renderH - clientH) / 2;
  canvas.style.left = `-${offsetX}px`;
  canvas.style.top = `-${offsetY}px`;
  canvas.style.width = `${renderW}px`;
  canvas.style.height = `${renderH}px`;
  canvas.style.display = 'block';
  container.appendChild(canvas);

  // Interaction State
  const currentRot = { x: 0, y: 0 };
  const targetRot = { x: 0, y: 0 };
  const velocityRot = { x: 0, y: 0 };
  let isDragging = false;
  let isHovered = false;
  let lastX = 0, lastY = 0, lastDragTime = 0;
  let mousePos = null;

  let lastTime = performance.now();
  const targetDelta = 1000 / 60;
  const smoothingFactor = smoothing === 0 ? 1 : mapRange(smoothing, 0, 1, 0.4, 0.03);
  const momentumDecay = mapRange(smoothing, 0, 1, 0.7, 0.96);

  // Animation & Physics Loop
  function animate(now) {
    const elapsed = now - lastTime;
    lastTime = now;
    const n = Math.min(Math.max(elapsed / targetDelta, 0.1), 3);
    const threshold = 0.01;

    // Organic Brain Breathing & Neural Undulation
    const breathe = 1.0 + Math.sin(now * 0.0018) * 0.02;
    group.scale.set(breathe, breathe, breathe);
    synapseMat.opacity = 0.38 + Math.sin(now * 0.003) * 0.22;
    coreGlowMat.opacity = 0.22 + Math.sin(now * 0.0025) * 0.12;

    // Auto-rotation
    if (!isDragging && autoSpeed !== 0 && (!stopOnHover || !isHovered)) {
      targetRot.x += autoSpeed * 0.1 * n;
    }

    // Drag momentum decay
    if (!isDragging && smoothing > 0) {
      if (Math.abs(velocityRot.x) > threshold || Math.abs(velocityRot.y) > threshold) {
        targetRot.x += velocityRot.x * n;
        targetRot.y += velocityRot.y * n;
        targetRot.y = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetRot.y));
        const decay = Math.pow(momentumDecay, n);
        velocityRot.x *= decay;
        velocityRot.y *= decay;
      } else {
        velocityRot.x = 0;
        velocityRot.y = 0;
      }
    }

    // Interpolate towards target rotation
    const diffX = targetRot.x - currentRot.x;
    const diffY = targetRot.y - currentRot.y;
    if (Math.abs(diffX) > threshold || Math.abs(diffY) > threshold || autoSpeed !== 0 || isDragging) {
      const step = 1 - Math.pow(1 - smoothingFactor, n);
      currentRot.x += diffX * step;
      currentRot.y += diffY * step;
      currentRot.y = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, currentRot.y));
    }

    group.rotation.y = currentRot.x;
    group.rotation.x = currentRot.y;
    group.updateMatrixWorld(true);

    orbitGroup.rotation.y = currentRot.x * 0.4;
    orbitGroup.rotation.x = currentRot.y * 0.4;
    orbitGroup.updateMatrixWorld(true);

    const orbitV = new THREE.Vector3();
    const axisX = new THREE.Vector3(1, 0, 0);
    const axisY = new THREE.Vector3(0, 1, 0);
    for (let k = 0; k < satelliteOrbs.length; k++) {
      const orb = satelliteOrbs[k];
      const theta = now * orb.speed + orb.offset;
      orbitV.set(Math.cos(theta) * orb.radius, Math.sin(theta) * orb.radius, 0);
      orbitV.applyAxisAngle(axisX, orb.inclination);
      orbitV.applyAxisAngle(axisY, orb.yaw);
      orb.mesh.position.copy(orbitV);
    }

    // Cursor repulsion
    const currentContainerW = container.clientWidth || 380;
    const currentContainerH = container.clientHeight || 380;
    const currentCanvasW = currentContainerW * canvasMultiplier;
    const currentCanvasH = currentContainerH * canvasMultiplier;
    const radSq = cursorRadius * cursorRadius;

    const tempV = new THREE.Vector3();
    const worldV = new THREE.Vector3();
    const projV = new THREE.Vector3();
    const camCol0 = new THREE.Vector3();
    const camCol1 = new THREE.Vector3();
    const pushVec = new THREE.Vector3();
    const invWorld = new THREE.Matrix4();
    const matrixItem = new THREE.Matrix4();

    if (cursorConfig.enabled && originalPositions.length > 0) {
      camera.matrixWorld.extractBasis(camCol0, camCol1, new THREE.Vector3());

      for (let i = 0; i < originalPositions.length; i++) {
        const orig = originalPositions[i];
        const disp = displacements[i];

        if (mousePos) {
          tempV.copy(orig).add(disp);
          worldV.copy(tempV).applyMatrix4(group.matrixWorld);

          projV.copy(worldV).project(camera);
          const screenX = (projV.x * 0.5 + 0.5) * currentCanvasW;
          const screenY = (-projV.y * 0.5 + 0.5) * currentCanvasH;

          const dx = mousePos.x - screenX;
          const dy = mousePos.y - screenY;
          const distSq = dx * dx + dy * dy;

          if (distSq < radSq && distSq > 0) {
            const dist = Math.sqrt(distSq);
            const ratio = (cursorRadius - dist) / cursorRadius;
            const angle = Math.atan2(dy, dx);
            const force = ratio * cursorStrength * speed * n;
            const forceX = -Math.cos(angle) * force * 0.01;
            const forceY = Math.sin(angle) * force * 0.01;

            pushVec.set(0, 0, 0);
            pushVec.addScaledVector(camCol0, forceX);
            pushVec.addScaledVector(camCol1, forceY);

            invWorld.copy(group.matrixWorld).invert();
            pushVec.applyMatrix4(invWorld);
            disp.add(pushVec);
          }
        }

        disp.multiplyScalar(Math.pow(frictionCoeff, n));
        disp.multiplyScalar(1 - returnForceCoeff * speed * n);
      }
    }

    if (impulseVelocities.length > 0) {
      for (let i = 0; i < impulseVelocities.length; i++) {
        const vel = impulseVelocities[i];
        displacements[i].addScaledVector(vel, n * 0.1);
        vel.multiplyScalar(Math.pow(0.95, n));
        vel.multiplyScalar(1 - returnForceCoeff * speed * n);
      }
    }

    for (let i = 0; i < originalPositions.length; i++) {
      tempV.copy(originalPositions[i]).add(displacements[i]);
      matrixItem.setPosition(tempV.x, tempV.y, tempV.z);
      instancedMesh.setMatrixAt(i, matrixItem);
    }
    instancedMesh.instanceMatrix.needsUpdate = true;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);

  // Mouse Drag Events
  if (drag) {
    canvas.addEventListener('mousedown', (e) => {
      isDragging = true;
      velocityRot.x = 0;
      velocityRot.y = 0;
      lastX = e.clientX;
      lastY = e.clientY;
      lastDragTime = performance.now();

      const onMouseMove = (moveEvt) => {
        const now = performance.now();
        const dt = now - lastDragTime;
        const dragFactor = mapRange(dragSpeed, 0, 1, 0.001, 0.02);
        const dx = moveEvt.clientX - lastX;
        const dy = moveEvt.clientY - lastY;

        targetRot.x += dx * dragFactor;
        targetRot.y += dy * dragFactor;
        targetRot.y = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetRot.y));

        if (dt > 0) {
          const fpsRatio = (1000 / 60) / dt;
          velocityRot.x = dx * dragFactor * 0.3 * fpsRatio;
          velocityRot.y = dy * dragFactor * 0.3 * fpsRatio;
        }

        lastX = moveEvt.clientX;
        lastY = moveEvt.clientY;
        lastDragTime = now;
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        isDragging = false;
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  }

  canvas.addEventListener('mouseenter', () => {
    isHovered = true;
  });

  canvas.addEventListener('mouseleave', () => {
    isHovered = false;
    mousePos = null;
  });

  canvas.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;
    if (relX >= 0 && relX <= rect.width && relY >= 0 && relY <= rect.height) {
      mousePos = { x: relX + offsetX, y: relY + offsetY };
    } else {
      mousePos = null;
    }
  });

  // Click Shockwave
  canvas.addEventListener('click', (e) => {
    if (!cursorConfig.enabled || !cursorConfig.clickForce) return;
    group.updateMatrixWorld(true);

    const rect = container.getBoundingClientRect();
    const clickX = e.clientX - rect.left + offsetX;
    const clickY = e.clientY - rect.top + offsetY;

    const currentCanvasW = (container.clientWidth || 380) * canvasMultiplier;
    const currentCanvasH = (container.clientHeight || 380) * canvasMultiplier;
    const ndcX = (clickX / currentCanvasW) * 2 - 1;
    const ndcY = 1 - (clickY / currentCanvasH) * 2;

    const rayOrigin = new THREE.Vector3(ndcX, ndcY, 0.5).unproject(camera);
    const camPos = new THREE.Vector3().setFromMatrixPosition(camera.matrixWorld);
    const rayDir = new THREE.Vector3().subVectors(rayOrigin, camPos).normalize();

    const sphereCenter = new THREE.Vector3(0, 0, 0);
    const toCenter = new THREE.Vector3().subVectors(sphereCenter, camPos);
    const centerDist = toCenter.length();
    const focalPoint = new THREE.Vector3().copy(camPos).addScaledVector(rayDir, centerDist);

    const clickRadSq = cursorRadius * cursorRadius;
    const clickStrength = cursorConfig.clickForce || 5;

    const pVec = new THREE.Vector3();
    const wVec = new THREE.Vector3();
    const pushDir = new THREE.Vector3();
    const invMat = new THREE.Matrix4().copy(group.matrixWorld).invert();

    for (let idx = 0; idx < originalPositions.length; idx++) {
      pVec.copy(originalPositions[idx]).add(displacements[idx]);
      wVec.copy(pVec).applyMatrix4(group.matrixWorld);

      const dx = clickX - (wVec.x * 0.5 + 0.5) * currentCanvasW;
      const dy = clickY - (-wVec.y * 0.5 + 0.5) * currentCanvasH;
      const distSq = dx * dx + dy * dy;

      if (distSq < clickRadSq && distSq > 0) {
        const dist = Math.sqrt(distSq);
        const intensity = ((cursorRadius - dist) / cursorRadius) * clickStrength;
        pushDir.subVectors(wVec, focalPoint);
        if (pushDir.length() > 0.001) {
          pushDir.normalize().multiplyScalar(intensity * 0.5);
          pushDir.applyMatrix4(invMat);
          impulseVelocities[idx].add(pushDir);
        }
      }
    }
  });

  // Resize Handling
  const resizeObserver = new ResizeObserver(() => {
    if (!container || !camera || !renderer) return;
    const cw = container.clientWidth || 380;
    const ch = container.clientHeight || 380;
    const nw = cw * canvasMultiplier;
    const nh = ch * canvasMultiplier;
    offsetX = (nw - cw) / 2;
    offsetY = (nh - ch) / 2;

    camera.aspect = nw / nh;
    camera.updateProjectionMatrix();

    renderer.setSize(nw, nh);
    canvas.style.left = `-${offsetX}px`;
    canvas.style.top = `-${offsetY}px`;
    canvas.style.width = `${nw}px`;
    canvas.style.height = `${nh}px`;
  });
  resizeObserver.observe(container);

  // Initialize the Nervous System Neural Threads & Traveling Signals
  initNeuralNervousSystem();
}

/* ==========================================================================
   8. Neural Nervous System: Curved Threads & Traveling Signals
   - Draws organic curved neural splines from the central brain sphere
     to each of the 5 service cards.
   - Dispatches glowing electrical sparks that travel along the threads.
   - Triggers synchronized haptic glow/pulse reactions when a signal arrives
     at each service card endpoint.
   ========================================================================== */


/* ==========================================================================
   Hero Neural Nervous System: Living Sphere Connections & Organic Downward Roots
   - Aligns floating sphere, rock pedestal, and floor ring with the dark architectural scene
   - 7 organic golden roots sprouting from rock center into the sphere
   - Traveling spark pulses along splines and roots with synchronized glow reactions
   ========================================================================== */
function initNeuralNervousSystem() {
  const svg = document.getElementById('hero-neural-svg');
  const pathsGroup = document.getElementById('neural-paths-group');
  const signalsGroup = document.getElementById('neural-signals-group');
  const rootsGroup = document.getElementById('neural-roots-group');
  const rootSignalsGroup = document.getElementById('root-signals-group');
  const wrapper = document.querySelector('.hero-3d-experience-wrapper');
  const sphereContainer = document.getElementById('hero-sphere-container');
  const rockPedestal = document.getElementById('hero-rock-pedestal');
  const heroCard = document.querySelector('.hero-canvas-card');

  if (!svg || !pathsGroup || !signalsGroup || !wrapper || !sphereContainer) return;

  const badges = Array.from(wrapper.querySelectorAll('.sphere-badge[data-service]'));
  if (badges.length === 0) return;

  // Architectural chamber alignment: centers sphere, rock pedestal, and floor ring directly on background image features
  function alignHeroArchitecture() {
    if (!heroCard || !wrapper || !sphereContainer) return;
    const cardRect = heroCard.getBoundingClientRect();
    const split = document.querySelector('.hero-content-split');
    const splitRect = split ? split.getBoundingClientRect() : cardRect;

    const imgAspect = 16 / 9;
    const cardAspect = cardRect.width / cardRect.height;
    let renderedW, renderedH, offsetX, offsetY;
    if (cardAspect >= imgAspect) {
      renderedW = cardRect.width;
      renderedH = cardRect.width / imgAspect;
      offsetX = 0;
      offsetY = cardRect.height - renderedH;
    } else {
      renderedH = cardRect.height;
      renderedW = cardRect.height * imgAspect;
      offsetX = (cardRect.width - renderedW) / 2;
      offsetY = 0;
    }

    // In the architectural background render:
    // The ceiling oculus, stone pedestal, and glowing ring center is at X = 68.8%
    const rockCenterX = offsetX + renderedW * 0.688;
    // The top surface center of the stone pedestal is at Y = 74.5%
    const rockTopY = offsetY + renderedH * 0.745;

    if (window.innerWidth > 991) {
      const wrapperW = wrapper.offsetWidth;
      const rightMargin = (cardRect.right - rockCenterX) - (wrapperW / 2) - (cardRect.right - splitRect.right);
      wrapper.style.marginRight = `${Math.max(0, rightMargin).toFixed(1)}px`;

      if (rockPedestal) {
        rockPedestal.style.left = `${rockCenterX.toFixed(1)}px`;
        rockPedestal.style.top = `${rockTopY.toFixed(1)}px`;
        rockPedestal.style.bottom = 'auto';
        rockPedestal.style.transform = 'translate(-50%, -50%)';
        rockPedestal.style.display = 'flex';
      }
    } else {
      wrapper.style.marginRight = 'auto';
      if (rockPedestal) {
        rockPedestal.style.left = '50%';
        rockPedestal.style.top = 'auto';
        rockPedestal.style.bottom = 'clamp(40px, 6vh, 60px)';
        rockPedestal.style.transform = 'translate(-50%, 0)';
        rockPedestal.style.display = 'flex';
      }
    }

    // Position outer floor ring directly over the outer ring in the architectural background
    const outerRing = document.getElementById('hero-floor-outer-ring');
    if (outerRing) {
      if (window.innerWidth > 991) {
        const floorRingY = offsetY + renderedH * 0.835;
        const ringW = renderedW * 0.43;
        const ringH = renderedH * 0.13;
        outerRing.style.left = `${rockCenterX.toFixed(1)}px`;
        outerRing.style.top = `${floorRingY.toFixed(1)}px`;
        outerRing.style.width = `${ringW.toFixed(1)}px`;
        outerRing.style.height = `${ringH.toFixed(1)}px`;
        outerRing.style.transform = 'translate(-50%, -50%)';
        outerRing.style.display = 'block';
      } else {
        outerRing.style.left = '50%';
        outerRing.style.bottom = 'clamp(20px, 4vh, 40px)';
        outerRing.style.top = 'auto';
        outerRing.style.width = 'clamp(240px, 75vw, 320px)';
        outerRing.style.height = 'clamp(50px, 15vw, 75px)';
        outerRing.style.transform = 'translate(-50%, 0)';
        outerRing.style.display = 'block';
      }
    }
  }

  // Active neural pathway data for service endpoints
  const pathways = [];
  // Active root pathways connecting sphere to rock
  const rootPathways = [];

  // Calibrated asynchronous staggered timing configs for service cards
  const serviceConfigs = [
    { startProgress: 0.08, speed: 0.0031 }, // AI & ML
    { startProgress: 0.44, speed: 0.0027 }, // Product Engineering
    { startProgress: 0.76, speed: 0.0029 }, // Cloud
    { startProgress: 0.22, speed: 0.0025 }, // Automation
    { startProgress: 0.62, speed: 0.0033 }  // E-commerce
  ];

  // 7 Organic root tendril definitions connecting floating sphere to the exact center of the rock
  const rootConfigs = [
    { startProgress: 0.10, speed: 0.0042, dxStart: 0,   dyStart: 0,   dxEnd: 0,   cpX1: -4,  cpX2: 2,   tailLen: 14, strokeW: 2.8 }, // Central taproot
    { startProgress: 0.38, speed: 0.0036, dxStart: -18, dyStart: -3,  dxEnd: -3,  cpX1: -22, cpX2: -5,  tailLen: 12, strokeW: 2.2 }, // Left inner root
    { startProgress: 0.72, speed: 0.0038, dxStart: 18,  dyStart: -3,  dxEnd: 3,   cpX1: 22,  cpX2: 5,   tailLen: 12, strokeW: 2.2 }, // Right inner root
    { startProgress: 0.22, speed: 0.0032, dxStart: -38, dyStart: -10, dxEnd: -6,  cpX1: -42, cpX2: -9,  tailLen: 11, strokeW: 2.0 }, // Left mid tendril
    { startProgress: 0.58, speed: 0.0034, dxStart: 38,  dyStart: -10, dxEnd: 6,   cpX1: 42,  cpX2: 9,   tailLen: 11, strokeW: 2.0 }, // Right mid tendril
    { startProgress: 0.88, speed: 0.0030, dxStart: -60, dyStart: -24, dxEnd: -10, cpX1: -66, cpX2: -14, tailLen: 10, strokeW: 1.7 }, // Left outer tendril
    { startProgress: 0.48, speed: 0.0031, dxStart: 60,  dyStart: -24, dxEnd: 10,  cpX1: 66,  cpX2: 14,  tailLen: 10, strokeW: 1.7 }  // Right outer tendril
  ];

  let sphereCenter = { x: 330, y: 290 };
  let sphereRadius = 171;

  function buildAllNeuralPathways() {
    alignHeroArchitecture();

    pathsGroup.innerHTML = '';
    signalsGroup.innerHTML = '';
    if (rootsGroup) rootsGroup.innerHTML = '';
    if (rootSignalsGroup) rootSignalsGroup.innerHTML = '';

    pathways.length = 0;
    rootPathways.length = 0;

    const wrapRect = wrapper.getBoundingClientRect();
    const sphereRect = sphereContainer.getBoundingClientRect();

    sphereCenter = {
      x: (sphereRect.left + sphereRect.width / 2) - wrapRect.left,
      y: (sphereRect.top + sphereRect.height / 2) - wrapRect.top
    };

    sphereRadius = (sphereRect.width / 2) * 0.90;

    // 1. Build Service Neural Pathways (Sphere -> Service Cards)
    badges.forEach((badge, index) => {
      const dot = badge.querySelector('.connector-dot') || badge;
      const dotRect = dot.getBoundingClientRect();

      const targetPoint = {
        x: (dotRect.left + dotRect.width / 2) - wrapRect.left,
        y: (dotRect.top + dotRect.height / 2) - wrapRect.top
      };

      const angle = Math.atan2(targetPoint.y - sphereCenter.y, targetPoint.x - sphereCenter.x);
      const startPoint = {
        x: sphereCenter.x + Math.cos(angle) * sphereRadius,
        y: sphereCenter.y + Math.sin(angle) * sphereRadius
      };

      const dx = targetPoint.x - startPoint.x;
      const dy = targetPoint.y - startPoint.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const isTop = targetPoint.y < sphereCenter.y;
      const isRight = targetPoint.x > sphereCenter.x;

      let cp1, cp2;
      if (Math.abs(dx) < 70 && isTop) {
        // Vertical connection for top card (AI & ML)
        cp1 = {
          x: startPoint.x + 22,
          y: startPoint.y - dist * 0.48
        };
        cp2 = {
          x: targetPoint.x + 12,
          y: targetPoint.y + dist * 0.42
        };
      } else {
        const curveBias = (isTop ? -1 : 1) * Math.min(36, dist * 0.18);
        cp1 = {
          x: startPoint.x + Math.cos(angle) * (dist * 0.42) - (isRight ? 12 : -12),
          y: startPoint.y + Math.sin(angle) * (dist * 0.42) + curveBias
        };
        cp2 = {
          x: targetPoint.x - (isRight ? dist * 0.35 : -dist * 0.35),
          y: targetPoint.y - curveBias * 0.4
        };
      }

      const d = `M ${startPoint.x.toFixed(1)} ${startPoint.y.toFixed(1)} C ${cp1.x.toFixed(1)} ${cp1.y.toFixed(1)}, ${cp2.x.toFixed(1)} ${cp2.y.toFixed(1)}, ${targetPoint.x.toFixed(1)} ${targetPoint.y.toFixed(1)}`;

      const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      pathEl.setAttribute('d', d);
      pathEl.setAttribute('class', 'neural-thread-path');
      pathsGroup.appendChild(pathEl);

      const totalLen = pathEl.getTotalLength();
      const cfg = serviceConfigs[index % serviceConfigs.length];

      pathways.push({
        badge,
        pathEl,
        totalLen,
        signals: [
          {
            progress: cfg.startProgress,
            speed: cfg.speed,
            tailLength: 14,
            orbEl: null,
            tailEl: null
          },
          {
            progress: (cfg.startProgress + 0.5) % 1.0,
            speed: cfg.speed * 1.05,
            tailLength: 12,
            orbEl: null,
            tailEl: null
          }
        ]
      });
    });

    // 2. Build Neural Roots (Sphere Bottom -> Exactly Centered Rock Foundation)
    if (rockPedestal && rootsGroup) {
      const rockRect = rockPedestal.getBoundingClientRect();
      const rockCenterX = (rockRect.left + rockRect.width / 2) - wrapRect.left;
      const rockCenterY = (rockRect.top + rockRect.height / 2) - wrapRect.top;

      const sphereBottomX = sphereCenter.x;
      const sphereBottomY = sphereCenter.y + sphereRadius;
      const dy = rockCenterY - sphereBottomY;

      rootConfigs.forEach((cfg) => {
        const sX = sphereBottomX + cfg.dxStart;
        const sY = sphereBottomY + cfg.dyStart;
        const tX = rockCenterX + cfg.dxEnd;
        const tY = rockCenterY;

        const cp1X = sX + cfg.cpX1;
        const cp1Y = sY + dy * 0.42;
        const cp2X = tX + cfg.cpX2;
        const cp2Y = tY - dy * 0.28;

        const d = `M ${sX.toFixed(1)} ${sY.toFixed(1)} C ${cp1X.toFixed(1)} ${cp1Y.toFixed(1)}, ${cp2X.toFixed(1)} ${cp2Y.toFixed(1)}, ${tX.toFixed(1)} ${tY.toFixed(1)}`;
        const rootPathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        rootPathEl.setAttribute('d', d);
        rootPathEl.setAttribute('class', 'neural-root-path');
        if (cfg.strokeW) rootPathEl.style.strokeWidth = `${cfg.strokeW}px`;
        rootsGroup.appendChild(rootPathEl);

        const totalLen = rootPathEl.getTotalLength();

        rootPathways.push({
          pathEl: rootPathEl,
          totalLen,
          cfg,
          signals: [
            {
              progress: cfg.startProgress,
              speed: cfg.speed,
              tailLength: cfg.tailLen,
              orbEl: null,
              tailEl: null
            }
          ]
        });
      });
    }

    createAllSignalElements();
  }

  function createAllSignalElements() {
    // 1. Service Signals
    signalsGroup.innerHTML = '';
    pathways.forEach((pathway) => {
      pathway.signals.forEach((sig) => {
        const orb = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        orb.setAttribute('r', '3.8');
        orb.setAttribute('class', 'signal-pulse-orb');
        orb.setAttribute('filter', 'url(#sparkGlow)');
        signalsGroup.appendChild(orb);
        sig.orbEl = orb;

        const tail = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        tail.setAttribute('r', '2.2');
        tail.setAttribute('fill', '#ff9944');
        tail.setAttribute('opacity', '0.6');
        signalsGroup.appendChild(tail);
        sig.tailEl = tail;
      });
    });

    // 2. Root Signals
    if (rootSignalsGroup) {
      rootSignalsGroup.innerHTML = '';
      rootPathways.forEach((rPath) => {
        rPath.signals.forEach((sig) => {
          const orb = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          orb.setAttribute('r', '3.4');
          orb.setAttribute('class', 'root-signal-orb');
          orb.setAttribute('filter', 'url(#sparkGlow)');
          rootSignalsGroup.appendChild(orb);
          sig.orbEl = orb;

          const tail = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          tail.setAttribute('r', '2.0');
          tail.setAttribute('fill', '#ffaa44');
          tail.setAttribute('opacity', '0.6');
          rootSignalsGroup.appendChild(tail);
          sig.tailEl = tail;
        });
      });
    }
  }

  buildAllNeuralPathways();

  // Resize and window load listeners to re-anchor threads and rock accurately
  window.addEventListener('resize', buildAllNeuralPathways, { passive: true });
  window.addEventListener('load', buildAllNeuralPathways, { passive: true });

  // Nervous System Signal Animation Loop
  let lastSignalTime = performance.now();

  function animateSignals(now) {
    const dt = Math.min((now - lastSignalTime) / (1000 / 60), 2.5);
    lastSignalTime = now;

    // Dynamic flexing of root paths to follow floating sphere while rock is stationary on floor
    if (rockPedestal && rootPathways.length > 0) {
      const wrapRect = wrapper.getBoundingClientRect();
      const rockRect = rockPedestal.getBoundingClientRect();
      const currentRockCenterX = (rockRect.left + rockRect.width / 2) - wrapRect.left;
      const currentRockCenterY = (rockRect.top + rockRect.height / 2) - wrapRect.top;
      const sphereBottomX = sphereCenter.x;
      const sphereBottomY = sphereCenter.y + sphereRadius;
      const dy = currentRockCenterY - sphereBottomY;

      rootPathways.forEach((rPath) => {
        const cfg = rPath.cfg;
        const sX = sphereBottomX + cfg.dxStart;
        const sY = sphereBottomY + cfg.dyStart;
        const tX = currentRockCenterX + cfg.dxEnd;
        const tY = currentRockCenterY;

        const cp1X = sX + cfg.cpX1;
        const cp1Y = sY + dy * 0.42;
        const cp2X = tX + cfg.cpX2;
        const cp2Y = tY - dy * 0.28;

        const d = `M ${sX.toFixed(1)} ${sY.toFixed(1)} C ${cp1X.toFixed(1)} ${cp1Y.toFixed(1)}, ${cp2X.toFixed(1)} ${cp2Y.toFixed(1)}, ${tX.toFixed(1)} ${tY.toFixed(1)}`;
        rPath.pathEl.setAttribute('d', d);
        rPath.totalLen = rPath.pathEl.getTotalLength();
      });
    }

    // Animate Service Pathways
    pathways.forEach((pathway) => {
      pathway.signals.forEach((sig) => {
        sig.progress += sig.speed * dt;

        // Signal reaches card endpoint: trigger pulse reaction!
        if (sig.progress >= 1.0) {
          sig.progress = 0.0;

          const badge = pathway.badge;
          badge.classList.remove('synapse-pulse');
          void badge.offsetWidth;
          badge.classList.add('synapse-pulse');

          pathway.pathEl.classList.add('active-pulse');
          setTimeout(() => {
            pathway.pathEl.classList.remove('active-pulse');
          }, 350);
        }

        // Interpolate along curved spline
        if (pathway.totalLen > 0 && sig.orbEl) {
          const curDist = sig.progress * pathway.totalLen;
          const pt = pathway.pathEl.getPointAtLength(curDist);
          sig.orbEl.setAttribute('cx', pt.x.toFixed(1));
          sig.orbEl.setAttribute('cy', pt.y.toFixed(1));

          const tailDist = Math.max(0, curDist - sig.tailLength);
          const tailPt = pathway.pathEl.getPointAtLength(tailDist);
          if (sig.tailEl) {
            sig.tailEl.setAttribute('cx', tailPt.x.toFixed(1));
            sig.tailEl.setAttribute('cy', tailPt.y.toFixed(1));
            const edgeFade = Math.sin(sig.progress * Math.PI);
            sig.tailEl.setAttribute('opacity', (0.65 * edgeFade).toFixed(2));
            sig.orbEl.setAttribute('opacity', (0.2 + 0.8 * edgeFade).toFixed(2));
          }
        }
      });
    });

    // Animate Neural Roots into Rock Base
    rootPathways.forEach((rPath) => {
      rPath.signals.forEach((sig) => {
        sig.progress += sig.speed * dt;

        // Signal enters rock foundation: trigger subtle rock pulse!
        if (sig.progress >= 1.0) {
          sig.progress = 0.0;

          if (rockPedestal) {
            rockPedestal.classList.remove('root-energy-pulse');
            void rockPedestal.offsetWidth;
            rockPedestal.classList.add('root-energy-pulse');
            setTimeout(() => {
              rockPedestal.classList.remove('root-energy-pulse');
            }, 600);
          }

          const outerRing = document.getElementById('hero-floor-outer-ring');
          if (outerRing) {
            outerRing.classList.remove('energy-surge');
            void outerRing.offsetWidth;
            outerRing.classList.add('energy-surge');
            setTimeout(() => {
              outerRing.classList.remove('energy-surge');
            }, 600);
          }

          rPath.pathEl.classList.add('active-pulse');
          setTimeout(() => {
            rPath.pathEl.classList.remove('active-pulse');
          }, 350);
        }

        if (rPath.totalLen > 0 && sig.orbEl) {
          const curDist = sig.progress * rPath.totalLen;
          const pt = rPath.pathEl.getPointAtLength(curDist);
          sig.orbEl.setAttribute('cx', pt.x.toFixed(1));
          sig.orbEl.setAttribute('cy', pt.y.toFixed(1));

          const tailDist = Math.max(0, curDist - sig.tailLength);
          const tailPt = rPath.pathEl.getPointAtLength(tailDist);
          if (sig.tailEl) {
            sig.tailEl.setAttribute('cx', tailPt.x.toFixed(1));
            sig.tailEl.setAttribute('cy', tailPt.y.toFixed(1));
            const edgeFade = Math.sin(sig.progress * Math.PI);
            sig.tailEl.setAttribute('opacity', (0.65 * edgeFade).toFixed(2));
            sig.orbEl.setAttribute('opacity', (0.25 + 0.75 * edgeFade).toFixed(2));
          }
        }
      });
    });

    requestAnimationFrame(animateSignals);
  }

  requestAnimationFrame(animateSignals);
}

/* ==========================================================================
   2. Scroll-Linked Text Fill Reveal Animation
   ========================================================================== */
function initScrollTextReveal() {
  const container = document.querySelector('.scroll-reveal-text');
  if (!container) return;

  // Split text into individual span words if not already split
  const originalText = container.textContent.trim();
  const words = originalText.split(/\s+/);
  container.innerHTML = words.map(w => `<span class="word">${w}</span>`).join(' ');

  const wordSpans = container.querySelectorAll('.word');

  function updateReveal() {
    const rect = container.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Calculate progress through viewport
    // Starts revealing when top of container hits 75% of viewport, finishes when it reaches 25%
    const startY = windowHeight * 0.75;
    const endY = windowHeight * 0.25;

    const progress = Math.min(Math.max((startY - rect.top) / (startY - endY), 0), 1);
    const wordsToFill = Math.floor(progress * wordSpans.length);

    wordSpans.forEach((span, index) => {
      if (index <= wordsToFill) {
        span.classList.add('filled');
      } else {
        span.classList.remove('filled');
      }
    });
  }

  window.addEventListener('scroll', updateReveal, { passive: true });
  window.addEventListener('resize', updateReveal, { passive: true });
  updateReveal();
}

/* ==========================================================================
   3. Testimonials Carousel Slider
   ========================================================================== */
function initTestimonialsSlider() {
  const track = document.querySelector('.testimonials-track');
  const prevBtn = document.querySelector('.slider-btn.prev');
  const nextBtn = document.querySelector('.slider-btn.next');
  const cards = document.querySelectorAll('.testimonial-card');

  if (!track || cards.length === 0 || !prevBtn || !nextBtn) return;

  let currentIndex = 0;

  function getVisibleCardsCount() {
    return window.innerWidth < 810 ? 1 : 2;
  }

  function getMaxIndex() {
    const visible = getVisibleCardsCount();
    return Math.max(0, cards.length - visible);
  }

  function updateSlider() {
    const maxIndex = getMaxIndex();
    if (currentIndex > maxIndex) currentIndex = maxIndex;
    if (currentIndex < 0) currentIndex = 0;

    const cardWidth = cards[0].offsetWidth;
    const gap = 24;
    const offset = currentIndex * (cardWidth + gap);

    track.style.transform = `translateX(-${offset}px)`;

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= maxIndex;
  }

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentIndex < getMaxIndex()) {
      currentIndex++;
      updateSlider();
    }
  });

  window.addEventListener('resize', updateSlider, { passive: true });
  updateSlider();
}

/* ==========================================================================
   4. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item, .cognira-faq-item');

  items.forEach(item => {
    const trigger = item.querySelector('.faq-trigger, .cognira-faq-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      items.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherTrigger = otherItem.querySelector('.faq-trigger, .cognira-faq-trigger');
        if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

function initCogniraUseCasesTabs() {
  const tabs = [...document.querySelectorAll('.cognira-usecase-tab')];
  const cards = [...document.querySelectorAll('.cognira-project-card')];
  if (!tabs.length || !cards.length) return;

  // Scroll-through feed: all five projects are stacked and you scroll past
  // them while the sticky rail highlights whichever one you are looking at.
  // Clicking a pill scrolls to that project.
  //
  // These are navigation controls, not tabs — nothing is shown or hidden — so
  // they use aria-current rather than tab/tabpanel semantics, which would tell
  // a screen reader the other projects were hidden when they are not.
  const rail = tabs[0].parentElement;

  const setActive = (idx) => {
    tabs.forEach((tab, i) => {
      const on = i === idx;
      tab.classList.toggle('active', on);
      if (on) tab.setAttribute('aria-current', 'true');
      else tab.removeAttribute('aria-current');
    });
  };

  const scrollToCard = (idx) => {
    const target = document.getElementById(tabs[idx].getAttribute('data-target')) || cards[idx];
    if (!target) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    setActive(idx);
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => scrollToCard(i));
  });

  if (rail) {
    rail.addEventListener('keydown', (e) => {
      const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      const cur = tabs.findIndex(t => t.classList.contains('active'));
      let next = null;
      if (step) next = (cur + step + tabs.length) % tabs.length;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = tabs.length - 1;
      if (next === null) return;
      e.preventDefault();
      tabs[next].focus();
      scrollToCard(next);
    });
  }

  // Active pill follows scroll: whichever card sits nearest the viewport
  // centre wins. Measured from rects rather than IntersectionObserver so it
  // still resolves when a card is taller than the viewport (no threshold can
  // fire in that case) and when the page has been backgrounded.
  let ticking = false;
  const sync = () => {
    const mid = window.innerHeight / 2;
    let best = 0, bestDist = Infinity;
    cards.forEach((card, i) => {
      const r = card.getBoundingClientRect();
      const dist = Math.abs(r.top + r.height / 2 - mid);
      if (dist < bestDist) { bestDist = dist; best = i; }
    });
    setActive(best);
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(sync); }
  }, { passive: true });
  window.addEventListener('resize', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(sync); }
  }, { passive: true });

  sync();
}

/* ==========================================================================
   5. Active Nav Link
   ========================================================================== */
function highlightActiveNavLink() {
  const path = window.location.pathname.toLowerCase();
  const links = document.querySelectorAll('.nav-link');

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkPath = href.split('#')[0].toLowerCase();
    
    if ((path === '/' || path === '/index.html' || path === '') && (linkPath === '/' || linkPath === './' || linkPath === 'index.html')) {
      link.classList.add('active');
    } else if (linkPath && path.includes(linkPath.replace('.html', '')) && linkPath !== '/' && linkPath !== './') {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ==========================================================================
   6. Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   Filter Tabs Logic (Blog & Projects)
   ========================================================================== */
function initFilterTabs() {
  const filterContainers = document.querySelectorAll('.blog-filters, .project-filters');
  if (!filterContainers.length) return;

  filterContainers.forEach(container => {
    const buttons = container.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        // If it's an anchor link hash on services page, allow anchor behavior
        const href = btn.getAttribute('href');
        if (href && href.startsWith('#')) return;

        e.preventDefault();
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const category = btn.getAttribute('data-category');
        const cards = document.querySelectorAll('.blog-card, .pricing-card, .project-card, .project-showcase-card');
        cards.forEach(card => {
          const cardCat = card.getAttribute('data-category') || '';
          if (!category || category === 'all' || cardCat.includes(category)) {
            card.classList.remove('is-hidden');
            card.style.display = '';
            // Trigger quick re-reveal
            setTimeout(() => card.classList.add('is-revealed'), 50);
          } else {
            card.classList.add('is-hidden');
            card.style.display = 'none';
          }
        });
      });
    });
  });
}

/* ==========================================================================
   Technologies Category Filter Tabs
   ========================================================================== */
function initTechFilterTabs() {
  const tabsBar = document.querySelector('.tech-filter-tabs-bar');
  const cards = document.querySelectorAll('.tech-logo-card');
  if (!tabsBar || !cards.length) return;

  const tabs = tabsBar.querySelectorAll('.tech-filter-tab');

  // Roving tabindex + arrow keys: the tabs already carried role/aria-selected
  // but were mouse-only.
  tabs.forEach((t, i) => { t.tabIndex = i === 0 ? 0 : -1; });
  tabsBar.addEventListener('keydown', (e) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    const list = [...tabs];
    const cur = list.findIndex(t => t.getAttribute('aria-selected') === 'true');
    let next = null;
    if (step) next = (cur + step + list.length) % list.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = list.length - 1;
    if (next === null) return;
    e.preventDefault();
    list[next].click();
    list[next].focus();
  });

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
        t.tabIndex = -1;
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      tab.tabIndex = 0;

      const selectedCategory = tab.getAttribute('data-category');

      cards.forEach(card => {
        const cardCats = (card.getAttribute('data-category') || '').split(/\s+/);
        if (selectedCategory === 'all' || cardCats.includes(selectedCategory)) {
          card.classList.remove('is-hidden');
          // Add brief entry animation
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          });
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });
}

/* ==========================================================================
   Demaze 19 Industries Interactive Progressive Disclosure
   ========================================================================== */
function initIndustriesTabs() {
  const navItems = document.querySelectorAll('.industry-nav-item');
  const displayCard = document.querySelector('.industry-display-card');
  if (!navItems.length || !displayCard) return;

  const industriesData = {
    'healthcare': {
      title: 'Healthcare & Life Sciences',
      desc: 'Architecting HIPAA-compliant clinical platforms, AI patient triage assistants, diagnostic intelligence models, and medical practice workflow automation.',
      capabilities: ['AI Triage Assistant', 'Clinical NLP Extraction', 'Symptom Verification', 'HIPAA Secure Storage', 'Telehealth Systems']
    },
    'fintech': {
      title: 'Fintech & Digital Banking',
      desc: 'Engineering high-throughput transaction processing, AI fraud prevention engines, regulatory compliance automation, and algorithmic underwriting.',
      capabilities: ['Real-Time Fraud Detection', 'Cross-Border Rails', 'Automated KYC/AML', 'Algorithmic Underwriting', 'High-Speed Ledgers']
    },
    'logistics': {
      title: 'Logistics & Supply Chain',
      desc: 'Deploying autonomous dispatch algorithms, route optimization engines, cold-chain telemetry monitoring, and multi-hub inventory reconciliation.',
      capabilities: ['Route Optimization', 'Fleet Telematics', 'Predictive Restocking', 'Warehouse OS Integration', 'Dynamic Dispatch']
    },
    'retail': {
      title: 'Modern Retail & Omnichannel',
      desc: 'Unifying physical and online point-of-sale systems, dynamic inventory allocation, automated vendor sync, and customer lifetime value prediction.',
      capabilities: ['Omnichannel Sync', 'Smart POS Integration', 'Inventory Allocation', 'Predictive Restocking', 'Vendor Dashboards']
    },
    'ecommerce': {
      title: 'E-commerce & Marketplaces',
      desc: 'Powering high-conversion multi-vendor marketplaces with AI visual search, live commerce streaming, personalized recommendations, and instant checkout.',
      capabilities: ['AI Personalization', 'Multi-Vendor Gateways', 'Live Video Shopping', 'Dynamic Pricing Engine', 'Automated Cataloging']
    },
    'education': {
      title: 'Education & EdTech',
      desc: 'Building adaptive learning platforms, automated grading assistants, interactive virtual classrooms, and predictive student progress analytics.',
      capabilities: ['Adaptive Learning AI', 'Automated Grading', 'Virtual Classroom Hubs', 'Student Retention Analytics', 'Curriculum Mapping']
    },
    'bfsi': {
      title: 'BFSI & Wealth Management',
      desc: 'Enterprise financial software with institutional security, automated wealth advisory engines, audit trails, and automated regulatory reporting.',
      capabilities: ['Wealth Advisory Portals', 'Automated Compliance', 'Risk Estimation Models', 'Institutional Security', 'Auditing Pipelines']
    },
    'gaming': {
      title: 'Sports, Gaming & Esports',
      desc: 'Ultra-low latency streaming architectures, real-time player telemetry, fantasy sports tournament backends, and community engagement engines.',
      capabilities: ['Player Telemetry', 'Fantasy League Engines', 'Sub-Second Live Streaming', 'Fan Engagement Hubs', 'Leaderboard Scaling']
    },
    'energy': {
      title: 'Energy & Utilities',
      desc: 'Smart grid IoT data ingestion, equipment failure prediction, utility consumption forecasting, and enterprise billing synchronization.',
      capabilities: ['Predictive Maintenance', 'IoT Sensor Ingestion', 'Consumption Forecasting', 'Automated Utility Billing', 'Grid Telemetry']
    },
    'realestate': {
      title: 'Real Estate & PropTech',
      desc: 'AI property valuation algorithms, virtual staging pipelines, tenant management portals, and automated digital lease execution workflows.',
      capabilities: ['AI Valuation Models', 'Virtual Staging Pipelines', 'Tenant Portals', 'Automated Lease Signing', 'Property Search API']
    },
    'media': {
      title: 'Media & Entertainment',
      desc: 'Generative AI script-to-storyboard pipelines, automated multi-language transcription, digital asset management, and high-concurrency video delivery.',
      capabilities: ['Script-to-Storyboard GenAI', 'Speech-to-Text Transcription', 'Digital Rights Management', 'Adaptive Video Delivery', 'Asset Cataloging']
    },
    'saas': {
      title: 'SaaS & Enterprise Products',
      desc: 'Cloud-native multi-tenant SaaS platforms featuring automated self-serve onboarding, usage-based billing, role-based security, and extensible APIs.',
      capabilities: ['Multi-Tenant Core', 'Usage-Based Billing', 'Role-Based Access Control', 'Developer API Gateways', 'Analytics Dashboards']
    },
    'automotive': {
      title: 'Automotive & Dealership OS',
      desc: 'Enterprise operating systems for luxury dealerships, automating used car valuation, instant EMI financing calculation, and workshop refurbishment.',
      capabilities: ['Used Car Valuation AI', 'Instant Financing/EMI', 'Refurbishment Tracker', 'Lead Management Backend', 'DMS System Sync']
    },
    'food': {
      title: 'Food, Beverage & Hospitality',
      desc: 'Kitchen display systems, cold-chain temperature telemetry, customer loyalty mobile applications, and automated restaurant reservations.',
      capabilities: ['Kitchen Display Systems', 'Cold-Chain Monitoring', 'Loyalty Mobile Apps', 'Dynamic Table Reservation', 'Supply Tracking']
    },
    'legal': {
      title: 'LegalTech & Professional Services',
      desc: 'Secure case management platforms for legal teams and investigators, featuring AI speech transcription, document indexing, and automated deposits.',
      capabilities: ['Case Media Vault', 'AI Audio Transcription', 'Document Automation', 'Retainer Auto-Deposit', 'Evidence Chain Tracking']
    },
    'hr': {
      title: 'Human Resources & Talent',
      desc: 'Intelligent candidate matching, resume parsing pipelines, onboarding automation, and organizational sentiment and retention analytics.',
      capabilities: ['AI Resume Screening', 'Candidate Matching', 'Onboarding Workflows', 'Sentiment Analytics', 'Performance Reviews']
    },
    'insurance': {
      title: 'Insurance & InsurTech',
      desc: 'Automated claim adjudication pipelines, digital policy administration, risk scoring engines, and instant automated payouts.',
      capabilities: ['Claims Adjudication', 'Policy Administration', 'Risk Scoring Models', 'Parametric Payouts', 'Fraud Screening']
    },
    'social': {
      title: 'Social Commerce & Influencer Tech',
      desc: 'Merging social discovery with instant commerce, enabling live streaming shopping, creator affiliate tracking, and friction-free social checkout.',
      capabilities: ['Live Stream Selling', 'Creator Attribution', 'Social Feed Tagging', 'In-App 1-Click Buy', 'Micro-Storefronts']
    },
    'manufacturing': {
      title: 'Manufacturing & B2B Industry',
      desc: 'Industrial IoT predictive maintenance, supply chain procurement automation, factory floor visualization, and legacy ERP modernization.',
      capabilities: ['Industrial IoT Telemetry', 'Predictive Failure AI', 'Procurement Automation', 'Legacy ERP Modernization', 'Quality Inspection']
    }
  };

  const titleEl = displayCard.querySelector('.industry-display-title');
  const descEl = displayCard.querySelector('.industry-display-desc');
  const capsGrid = displayCard.querySelector('.industry-caps-grid');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const key = item.getAttribute('data-industry');
      const data = industriesData[key];
      if (!data) return;

      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      if (titleEl) titleEl.textContent = data.title;
      if (descEl) descEl.textContent = data.desc;
      if (capsGrid) {
        capsGrid.innerHTML = data.capabilities.map(cap => `<span class="industry-cap-chip">${cap}</span>`).join('');
      }
    });
  });
}

/* ==========================================================================
   Drone Curtain Scroll Transition (Ascend Architecture Adapted)
   ========================================================================== */
function initDroneCurtainTransition() {
  const stage = document.getElementById('hero-drone-stage');
  const heroInner = document.getElementById('hero-section-inner');
  const curtainFold = document.getElementById('curtain-fold-layer');
  const curtainInner = document.getElementById('curtain-fold-inner');
  const edgePath = document.getElementById('curtain-edge-path');
  const cablePath = document.getElementById('drone-cable-path');
  const droneFlyer = document.getElementById('drone-flyer');

  if (!stage || !curtainFold || !droneFlyer || !cablePath) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  let rAF = 0;
  let lastTime = 0;
  let curProgress = 0;
  let velocity = 0;

  let winWidth = window.innerWidth;
  let winHeight = window.innerHeight;
  let stageTop = 0;
  let maxScroll = 1;

  const clamp = (v) => Math.max(0, Math.min(1, v));
  const smoothstep = (v) => v * v * (3 - 2 * v);

  const updateDims = () => {
    winWidth = stage.clientWidth || window.innerWidth;
    winHeight = window.innerHeight;
    const rect = stage.getBoundingClientRect();
    stageTop = rect.top + window.scrollY;
    maxScroll = Math.max(1, stage.offsetHeight - winHeight);
    requestTick();
  };

  const requestTick = () => {
    if (!rAF) {
      rAF = requestAnimationFrame(onFrame);
    }
  };

  const onFrame = (now) => {
    rAF = 0;
    const dt = Math.min((now - (lastTime || now)) / 1000, 0.032);
    lastTime = now;

    const targetProgress = clamp((window.scrollY - stageTop) / maxScroll);

    if (prefersReduced.matches) {
      curProgress = targetProgress;
      velocity = 0;
    } else {
      velocity += ((targetProgress - curProgress) * 65 - 15 * velocity) * dt;
      curProgress += velocity * dt;
    }

    const N = clamp(curProgress);
    const k = smoothstep(clamp(N / 0.95));
    const B = Math.sin(k * Math.PI); // bell curve (0 -> 1 -> 0)

    // Aerodynamic idle sway & bob
    const bob = prefersReduced.matches ? 0 : 5 * Math.sin(0.0024 * now) * (1 - k);
    const sway = prefersReduced.matches ? 0 : 3 * Math.sin(0.0016 * now) * (1 - k);

    // Drone flight path (starts hovering mid-right, climbs up and off-screen)
    const droneX = winWidth * (0.64 - 0.12 * k) + Math.sin(6 * k) * winWidth * 0.018 + sway;
    const initialY = winHeight * 0.52;
    const droneY = initialY - winHeight * k * 1.15 + bob;
    const droneWidth = Math.min(winWidth * (winWidth < 640 ? 0.44 : 0.22), 290);

    // Curtain baseline position (moving upward from bottom of screen to top)
    const baselineY = winHeight * (1.06 - 1.38 * k);
    const pullDisplacement = 0.16 * winHeight * B;

    // Cloth edge curve W(x) with Gaussian pull and wave flutter
    const W = (x) => {
      const s = (x - droneX) / winWidth;
      return (
        baselineY -
        Math.exp(-s * s * 15) * pullDisplacement +
        Math.sin(13 * s - 7 * k) * winHeight * 0.032 * B +
        Math.sin(18 * s) * velocity * winHeight * 0.05 * B
      );
    };

    // Build 64-segment path for cloth top edge
    const points = [];
    let finite = true;
    for (let i = 0; i <= 64; i++) {
      const px = (winWidth * i) / 64;
      const py = W(px);
      if (!Number.isFinite(px) || !Number.isFinite(py)) { finite = false; break; }
      points.push(`${i === 0 ? 'M' : 'L'} ${px.toFixed(2)} ${py.toFixed(2)}`);
    }
    // Dimensions can be unresolved on the first frame; skip rather than emit NaN.
    if (!finite) { requestTick(); return; }

    const edgeD = points.join(' ');
    const clipPathD = `${edgeD} L ${winWidth} ${winHeight + 10} L 0 ${winHeight + 10} Z`;

    curtainFold.style.clipPath = `path('${clipPathD}')`;
    if (edgePath) {
      edgePath.setAttribute('d', edgeD);
    }

    // Dynamic cable connecting drone bottom hook to cloth apex
    const droneHookY = droneY + 0.205 * droneWidth;
    const clothApexY = W(droneX);
    const cableSag = 16 * Math.sin(8 * k) * B + 35 * velocity + 2 * sway;

    if (cablePath) {
      cablePath.setAttribute(
        'd',
        `M ${droneX.toFixed(2)} ${droneHookY.toFixed(2)} C ${(droneX + cableSag).toFixed(2)} ${(droneHookY + (clothApexY - droneHookY) * 0.38).toFixed(2)}, ${(droneX - cableSag).toFixed(2)} ${(clothApexY - 45).toFixed(2)}, ${droneX.toFixed(2)} ${clothApexY.toFixed(2)}`
      );
    }

    // Drone flight rotation & position
    const tiltDeg = -(9 * velocity) + Math.sin(7 * k) * B * 3;
    droneFlyer.style.width = `${droneWidth.toFixed(1)}px`;
    droneFlyer.style.transform = `translate3d(${(droneX - droneWidth / 2).toFixed(2)}px, ${(droneY - 0.28 * droneWidth).toFixed(2)}px, 0) rotate(${tiltDeg.toFixed(2)}deg)`;

    // Drone visibility activation: smoothly fades in when scrolling begins
    if (N > 0.005) {
      droneFlyer.classList.add('active');
      droneFlyer.style.opacity = `${clamp(N * 8)}`;
      if (edgePath) edgePath.style.opacity = `${clamp(N * 4) * 0.8}`;
      if (cablePath) cablePath.style.opacity = `${clamp(N * 4) * 0.9}`;
    } else {
      droneFlyer.classList.remove('active');
      droneFlyer.style.opacity = '0';
      if (edgePath) edgePath.style.opacity = '0';
      if (cablePath) cablePath.style.opacity = '0';
    }

    // Curtain content parallax translation
    if (curtainInner) {
      const innerShift = Math.max(0, baselineY * 0.25);
      curtainInner.style.transform = `translate3d(0, ${innerShift.toFixed(2)}px, 0)`;
    }

    // Hero subtle fade and parallax response
    if (heroInner) {
      heroInner.style.opacity = `${1 - smoothstep(clamp((N - 0.1) / 0.35))}`;
      heroInner.style.transform = `translateY(${(-80 * N).toFixed(2)}px)`;
      heroInner.style.pointerEvents = N > 0.35 ? 'none' : 'auto';
    }

    // Keep loop active while animating or scrolling
    if (
      (!prefersReduced.matches && N > 0.0001 && N < 0.9999) ||
      Math.abs(targetProgress - curProgress) > 0.0001
    ) {
      requestTick();
    }
  };

  updateDims();
  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', updateDims);
  document.addEventListener('visibilitychange', requestTick);
}

/* ==========================================================================
   Storytelling Scroll Reveal Engine
   ========================================================================== */
function initScrollRevealStorytelling() {
  // Note: the homepage uses the cognira-* card classes. They were missing from
  // this list, so most of the page never revealed at all. Small repeated items
  // (tech logos, industry rows) reveal via their container rather than
  // individually, which would read as noise.
  const elements = document.querySelectorAll(`
    .scroll-reveal,
    .scroll-reveal-left,
    .scroll-reveal-right,
    .stagger-group,
    .section-header,
    .cognira-header-split,
    .industry-section-header,
    .featured-project-card,
    .project-showcase-card,
    .why-card,
    .why-bento-card,
    .value-card,
    .cognira-value-card,
    .cognira-feature-card,
    .how-card,
    .doodle-telemetry-card,
    .cognira-faq-item,
    .stat-ribbon-card,
    .journey-item,
    .bento-value-card,
    .contact-info-card,
    .contact-form-card,
    .industry-hover-slider-stage,
    .tech-logos-grid,
    .founder-statement-card,
    .cognira-cta-card
  `);

  if (!elements.length) return;

  // Tag every participant first — both code paths below target .scroll-reveal.
  const isTagged = (el) =>
    el.classList.contains('scroll-reveal') ||
    el.classList.contains('scroll-reveal-left') ||
    el.classList.contains('scroll-reveal-right') ||
    el.classList.contains('stagger-group');

  elements.forEach(el => {
    if (!isTagged(el)) el.classList.add('scroll-reveal');
  });

  // Only hide the start state once JS is definitely running, so a script
  // failure leaves the page readable rather than blank.
  document.documentElement.classList.add('js-reveals');

  const items = [...elements];

  // Reveal state is computed from each element's position relative to the
  // viewport, so it is genuinely scroll-linked and reverses on the way back
  // up. Read-only with respect to scrolling: a passive listener, no
  // preventDefault and no scrollTo, so the user's scroll is never hijacked.
  //
  // Two earlier approaches were rejected:
  //   - CSS `animation-timeline: view()` froze in Chrome once an element
  //     passed its range (playState stuck "finished"), so reveals never
  //     reversed.
  //   - IntersectionObserver does not deliver callbacks while the page is
  //     hidden or occluded, which risks leaving content stuck invisible.
  // A rect check has neither failure mode and cannot strand content.
  const MARGIN = 0.08; // reveal once 8% into the viewport
  let ticking = false;

  const apply = () => {
    const vh = window.innerHeight;
    const enter = vh * (1 - MARGIN);
    for (const el of items) {
      const r = el.getBoundingClientRect();
      el.classList.toggle('is-revealed', r.top < enter && r.bottom > 0);
    }
    ticking = false;
  };

  const schedule = () => {
    if (!ticking) { ticking = true; requestAnimationFrame(apply); }
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('load', schedule);
  document.addEventListener('visibilitychange', schedule);
  apply();
}

/* ==========================================================================
   Sticky Backdrop
   Publishes scroll progress (0..1) as a CSS variable so the fixed background
   layer can drift behind the content. Read-only with respect to scrolling:
   it never calls preventDefault or scrollTo, so the user keeps full control.
   ========================================================================== */
function initStickyBackdrop() {
  const backdrop = document.querySelector('.site-backdrop');
  if (!backdrop) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    document.documentElement.style.setProperty('--scroll-progress', progress.toFixed(4));
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });

  window.addEventListener('resize', update, { passive: true });
  update();
}

/* ==========================================================================
   Animated Numeric Counters
   ========================================================================== */
function initAnimatedCounters() {
  const counterEls = document.querySelectorAll('[data-counter]');
  if (!counterEls.length) return;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        counterObserver.unobserve(el);

        const target = parseFloat(el.getAttribute('data-counter'));
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1500;
        const startTime = performance.now();

        function updateCount(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(1, elapsed / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          const currentVal = Math.floor(eased * target);

          el.textContent = `${prefix}${currentVal}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            el.textContent = `${prefix}${target}${suffix}`;
          }
        }

        requestAnimationFrame(updateCount);
      }
    });
  }, { threshold: 0.2 });

  counterEls.forEach(el => counterObserver.observe(el));
}

/* ==========================================================================
   Interactive Contact Form Studio
   ========================================================================== */
function initInteractiveContactForm() {
  const form = document.getElementById('contact-form');
  const subjectInput = document.getElementById('contact-subject');
  const subjectBtns = document.querySelectorAll('[data-subject-pill]');
  const budgetBtns = document.querySelectorAll('[data-budget-pill]');
  const banner = document.querySelector('.form-success-banner');

  if (subjectBtns.length && subjectInput) {
    subjectBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        subjectBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        subjectInput.value = btn.getAttribute('data-subject-pill') || btn.textContent.trim();
      });
    });
  }

  if (budgetBtns.length) {
    const budgetInput = document.getElementById('contact-budget');
    budgetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        budgetBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (budgetInput) budgetInput.value = btn.getAttribute('data-budget-pill') || btn.textContent.trim();
      });
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Transmitting Inquiry...';
      }

      setTimeout(() => {
        if (banner) {
          banner.classList.add('is-visible');
        }
        form.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `Submit Inquiry <svg class="btn-arrow" viewBox="0 0 16 16" fill="none"><path d="M3.33337 8H12.6667M8 3.33334L12.6667 8.00001L8 12.6667" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        }
        setTimeout(() => {
          if (banner) banner.classList.remove('is-visible');
        }, 6000);
      }, 600);
    });
  }
}

/* ==========================================================================
   Micro-Interaction: Subtle 3D Card Tilt on Hover
   ========================================================================== */
function initCardTiltMicroInteractions() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth < 992) return;

  const tiltCards = document.querySelectorAll('.tilt-card, [data-tilt], .featured-project-card, .project-showcase-card, .stat-ribbon-card, .bento-value-card');
  tiltCards.forEach(card => {
    let bounds;

    function onMouseEnter() {
      bounds = card.getBoundingClientRect();
      card.style.transition = 'transform 0.1s ease, box-shadow 0.25s ease';
    }

    function onMouseMove(e) {
      if (!bounds) bounds = card.getBoundingClientRect();
      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;
      const xPct = (mouseX / bounds.width - 0.5) * 2;
      const yPct = (mouseY / bounds.height - 0.5) * 2;

      const rotateX = (-yPct * 4).toFixed(2);
      const rotateY = (xPct * 4).toFixed(2);
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    }

    function onMouseLeave() {
      card.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease';
      card.style.transform = '';
      bounds = null;
    }

    card.addEventListener('mouseenter', onMouseEnter);
    card.addEventListener('mousemove', onMouseMove);
    card.addEventListener('mouseleave', onMouseLeave);
  });
}

/* ==========================================================================
   Bento Terminal Live Simulation Typewriter
   ========================================================================== */
function initBentoTerminalSimulation() {
  const target = document.getElementById('terminal-live-typing');
  if (!target) return;

  const messages = [
    'Deploying autonomous optimization agent to production...',
    'Fine-tuning LoRA adapter for enterprise schema [Loss: 0.012]...',
    'Indexing 1.2M vector embeddings into Pinecone index...',
    'Routing multi-tenant workflow via distributed edge workers...',
    'Synthesizing predictive forecasting model for Q4 pipeline...'
  ];

  let msgIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 38;

  function typeStep() {
    const currentMsg = messages[msgIndex];

    if (!isDeleting) {
      target.textContent = currentMsg.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentMsg.length) {
        isDeleting = true;
        setTimeout(typeStep, 2600); // pause at end of sentence
        return;
      }
      setTimeout(typeStep, typingSpeed + Math.random() * 20);
    } else {
      target.textContent = currentMsg.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        msgIndex = (msgIndex + 1) % messages.length;
        setTimeout(typeStep, 500); // pause before next message
        return;
      }
      setTimeout(typeStep, 20);
    }
  }

  // Start after small initial delay
  setTimeout(typeStep, 1200);
}

/* ==========================================================================
   Interactive Hero Cursor Ambient Glow
   ========================================================================== */
function initHeroInteractiveGlow() {
  const heroCard = document.querySelector('.hero-canvas-card');
  const glow = document.getElementById('hero-interactive-glow');
  if (!heroCard || !glow) return;

  let currentX = 0, currentY = 0;
  let targetX = 0, targetY = 0;
  let isHovered = false;
  let rafId = null;

  function update() {
    if (!isHovered && glow.style.opacity === '0') return;
    currentX += (targetX - currentX) * 0.12;
    currentY += (targetY - currentY) * 0.12;
    glow.style.transform = `translate3d(${currentX.toFixed(1)}px, ${currentY.toFixed(1)}px, 0)`;
    rafId = requestAnimationFrame(update);
  }

  heroCard.addEventListener('mousemove', (e) => {
    const rect = heroCard.getBoundingClientRect();
    targetX = e.clientX - rect.left;
    targetY = e.clientY - rect.top;
    if (!isHovered) {
      isHovered = true;
      currentX = targetX;
      currentY = targetY;
      glow.style.opacity = '1';
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    }
  });

  heroCard.addEventListener('mouseleave', () => {
    isHovered = false;
    glow.style.opacity = '0';
  });
}
