import * as THREE from 'three';

/**
 * Kontra AI - Interactive Logic & Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initHeroParticleSphere();
  initScrollTextReveal();
  initTestimonialsSlider();
  initFaqAccordion();
  initBackToTop();
  highlightActiveNavLink();
});

/* ==========================================================================
   1. Header Sticky & Mobile Menu
   ========================================================================== */
function initHeader() {
  const header = document.querySelector('.site-header');
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
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggle.classList.toggle('open');
      overlay.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
      if (overlay.classList.contains('show') && !overlay.contains(e.target) && !toggle.contains(e.target)) {
        toggle.classList.remove('open');
        overlay.classList.remove('show');
      }
    });

    overlay.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        overlay.classList.remove('show');
      });
    });
  }
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
  const items = document.querySelectorAll('.faq-item');

  items.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      items.forEach(otherItem => {
        otherItem.classList.remove('active');
      });

      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });
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
   7. Authentic Ionyx Hero 3D Particle Sphere
   Replicates the exact Framer Particle Sphere (Fibonacci distribution,
   Additive blending, instanced spheres, interactive inertia drag,
   cursor magnetic repulsion, and click shockwave explosion).
   ========================================================================== */
function initHeroParticleSphere() {
  const container = document.getElementById('hero-sphere-container');
  if (!container) return;

  // Exact configuration parameters extracted from Ionyx hero section
  const particlesCount = 4000;
  const speed = 0.5;
  const smoothing = 1.0;
  const scale = 1.0;
  const rotationDirection = 'clockwise';
  const dragSpeed = 0.5;
  const drag = true;
  const stopOnHover = false;
  const particleScale = 0.3;
  const cursorConfig = {
    enabled: true,
    radius: 85,
    strength: 1.0,
    clickForce: 5.0
  };

  // Linear range mapping helper
  const mapRange = (val, inMin, inMax, outMin, outMax) => {
    return inMax === inMin ? outMin : outMin + ((val - inMin) / (inMax - inMin)) * (outMax - outMin);
  };

  const autoSpeed = mapRange(speed, 0.1, 1, 0.01, 0.05) * (rotationDirection === 'anticlockwise' ? -1 : 1);
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

  // Particle color: rgb(227, 227, 230)
  const particleColor = new THREE.Color(227 / 255, 227 / 255, 230 / 255);
  const colorsArray = new Float32Array(particlesCount * 3);
  for (let i = 0; i < particlesCount; i++) {
    const idx = i * 3;
    colorsArray[idx] = particleColor.r;
    colorsArray[idx + 1] = particleColor.g;
    colorsArray[idx + 2] = particleColor.b;
  }
  instancedMesh.instanceColor = new THREE.InstancedBufferAttribute(colorsArray, 3);
  instancedMesh.instanceColor.needsUpdate = true;
  group.add(instancedMesh);

  // Renderer & Camera setup with extended canvas multiplier to avoid particle clipping
  const canvasMultiplier = 2.5;
  let clientW = container.clientWidth || 500;
  let clientH = container.clientHeight || 500;
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

    // Particle repulsion physics
    const currentContainerW = container.clientWidth || 500;
    const currentContainerH = container.clientHeight || 500;
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

        // Damping
        disp.multiplyScalar(Math.pow(frictionCoeff, n));
        disp.multiplyScalar(1 - returnForceCoeff * speed * n);
      }
    }

    // Click wave impulse integration
    if (impulseVelocities.length > 0) {
      for (let i = 0; i < impulseVelocities.length; i++) {
        const vel = impulseVelocities[i];
        displacements[i].addScaledVector(vel, n * 0.1);
        vel.multiplyScalar(Math.pow(0.95, n));
        vel.multiplyScalar(1 - returnForceCoeff * speed * n);
      }
    }

    // Update InstancedMesh positions
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

  // Hover & Magnetic Field Events
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

    const currentCanvasW = (container.clientWidth || 500) * canvasMultiplier;
    const currentCanvasH = (container.clientHeight || 500) * canvasMultiplier;
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
    const pProj = new THREE.Vector3();
    const pushDir = new THREE.Vector3();
    const invMat = new THREE.Matrix4().copy(group.matrixWorld).invert();

    for (let idx = 0; idx < originalPositions.length; idx++) {
      pVec.copy(originalPositions[idx]).add(displacements[idx]);
      wVec.copy(pVec).applyMatrix4(group.matrixWorld);

      pProj.copy(wVec).project(camera);
      const px = (pProj.x * 0.5 + 0.5) * currentCanvasW;
      const py = (-pProj.y * 0.5 + 0.5) * currentCanvasH;

      const dx = clickX - px;
      const dy = clickY - py;
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
    const cw = container.clientWidth || 500;
    const ch = container.clientHeight || 500;
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
}

