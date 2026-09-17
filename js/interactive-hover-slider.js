/**
 * Industry verticals directory.
 *
 * Renders all 19 sectors from a single dataset and reveals the selected
 * sector's capabilities on hover, focus or click.
 *
 * Icons are 24x24 stroke glyphs using currentColor, matching the icon system
 * already used across the rest of the site. The previous emoji labels and the
 * six full-colour 3D illustrations were removed: emoji render differently per
 * OS, and the illustrations were ~4.4MB and tonally unrelated to the brand.
 */

// Lucide-style 24x24 stroke paths, drawn with currentColor.
const ICONS = {
  card: '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>',
  pulse: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  bag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  truck: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
  layers: '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
  gamepad: '<line x1="6" x2="10" y1="11" y2="11"/><line x1="8" x2="8" y1="9" y2="13"/><line x1="15" x2="15.01" y1="12" y2="12"/><line x1="18" x2="18.01" y1="10" y2="10"/><rect width="20" height="12" x="2" y="6" rx="5"/>',
  trend: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
  car: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
  zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  building: '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/>',
  film: '<rect width="20" height="20" x="2" y="2" rx="2.18"/><line x1="7" x2="7" y1="2" y2="22"/><line x1="17" x2="17" y1="2" y2="22"/><line x1="2" x2="22" y1="12" y2="12"/>',
  cap: '<path d="M22 10v6"/><path d="m2 10 10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
  utensils: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
  scale: '<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  phone: '<rect width="14" height="20" x="5" y="2" rx="2"/><path d="M12 18h.01"/>',
  factory: '<path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M17 18h1"/><path d="M12 18h1"/><path d="M7 18h1"/>',
  trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
};

const svg = (key) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[key] || ICONS.layers}</svg>`;

// Single source of truth for the section, the detail panel and the modal.
export const industries = [
  { id: '01', icon: 'card', name: 'FinTech, Banking & BFSI', metric: 'Ledger & Fraud AI', desc: 'High-throughput transaction processing, AI fraud prevention, regulatory compliance automation and algorithmic underwriting.', caps: ['Real-Time Fraud Engine', 'Automated KYC/AML', 'Algorithmic Underwriting', 'High-Speed Ledger'], subsectors: ['Banking', 'BFSI Solutions', 'Insurance', 'Crypto & Web3'] },
  { id: '02', icon: 'pulse', name: 'HealthTech & Life Sciences', metric: 'Clinical Telemetry', desc: 'HIPAA-compliant clinical platforms, AI patient triage, diagnostic intelligence models and practice workflow automation.', caps: ['AI Triage Assistant', 'Clinical NLP Extraction', 'HIPAA Secure Cloud', 'Vital Telemetry'], subsectors: ['Healthcare', 'Pharma', 'Telehealth', 'Clinical AI'] },
  { id: '03', icon: 'bag', name: 'E-Commerce & Retail', metric: 'Headless Commerce', desc: 'Headless commerce, AI cart optimisation, live streaming shopping, multi-vendor marketplaces and dynamic pricing engines.', caps: ['Omnichannel Sync', 'Real-Time Stock AI', 'Checkout Optimisation', 'Dynamic Pricing'], subsectors: ['Retail', 'Ecommerce', 'Social Commerce'] },
  { id: '04', icon: 'truck', name: 'Logistics & Fleet', metric: 'Fleet & Route IoT', desc: 'Autonomous dispatch algorithms, route optimisation engines, cold-chain telemetry and multi-hub inventory reconciliation.', caps: ['Route Optimisation', 'Fleet Telematics', 'Predictive Restocking', 'Warehouse Robotics'], subsectors: ['Logistics', 'Supply Chain', 'Last-Mile'] },
  { id: '05', icon: 'layers', name: 'SaaS & Enterprise AI', metric: 'Autonomous Agents', desc: 'Cloud-native multi-tenant SaaS platforms with autonomous AI agents, usage-based billing and extensible APIs.', caps: ['Multi-Tenant Core', 'Agent Workflows', 'Usage-Based Billing', 'RAG Knowledge Index'], subsectors: ['SaaS Products', 'Enterprise AI', 'APIs'] },
  { id: '06', icon: 'gamepad', name: 'Gaming & WebGL 3D', metric: 'Real-Time 3D Engine', desc: 'Ultra-low latency streaming architectures, real-time player telemetry, interactive 3D WebGL engines and community hubs.', caps: ['Interactive 3D WebGL', 'Sub-Second Streaming', 'Fan Engagement Hubs', 'Player Telemetry'], subsectors: ['Gaming', 'Esports', 'Interactive Media'] },
  { id: '07', icon: 'trend', name: 'BFSI & WealthTech', metric: 'Institutional Core', desc: 'Enterprise financial software with institutional security, automated wealth advisory engines, audit trails and regulatory reporting.', caps: ['Wealth Portals', 'Audit Trails', 'Risk Models', 'Regulatory Reporting'], subsectors: ['Wealth', 'Investments', 'Compliance'] },
  { id: '08', icon: 'car', name: 'Automotive & Dealership OS', metric: 'Dealership OS', desc: 'Operating systems for dealerships, automating vehicle appraisal, instant EMI financing and workshop refurbishment.', caps: ['Valuation AI', 'EMI Calculator', 'DMS Sync', 'Service Scheduling'], subsectors: ['Automotive', 'Dealerships', 'Aftermarket'] },
  { id: '09', icon: 'zap', name: 'Energy & Utilities', metric: 'Smart Grid IoT', desc: 'Smart grid IoT sensor ingestion, equipment failure prediction, consumption forecasting and enterprise billing synchronisation.', caps: ['Grid Telemetry', 'Predictive Maintenance', 'IoT Ingestion', 'Utility Billing'], subsectors: ['Energy', 'Utilities', 'Renewables'] },
  { id: '10', icon: 'building', name: 'Real Estate & PropTech', metric: 'PropTech & Staging', desc: 'AI property valuation, virtual staging pipelines, tenant management portals and automated digital lease execution.', caps: ['Valuation AI', 'Virtual Staging', 'Lease Workflows', 'Tenant Portals'], subsectors: ['Real Estate', 'PropTech', 'Facilities'] },
  { id: '11', icon: 'film', name: 'Media & Entertainment', metric: 'GenAI & Asset DRM', desc: 'Generative AI script-to-storyboard pipelines, automated transcription, digital asset management and adaptive video delivery.', caps: ['GenAI Storyboard', 'Speech-to-Text', 'DRM Cloud', 'Adaptive Delivery'], subsectors: ['Media', 'Streaming', 'Publishing'] },
  { id: '12', icon: 'cap', name: 'Education & EdTech', metric: 'Adaptive Learning', desc: 'Adaptive learning platforms, automated grading assistants, interactive virtual classrooms and predictive progress analytics.', caps: ['Adaptive Learning', 'Virtual Classroom', 'Grading AI', 'Certification'], subsectors: ['Education', 'EdTech', 'Corporate L&D'] },
  { id: '13', icon: 'utensils', name: 'Food, Beverage & Hospitality', metric: 'Kitchen & Cold-Chain', desc: 'Kitchen display systems, cold-chain temperature telemetry, loyalty applications and automated restaurant reservations.', caps: ['Kitchen OS', 'Cold-Chain IoT', 'Table Booking', 'Loyalty Programs'], subsectors: ['Food & Beverage', 'Hospitality', 'Delivery'] },
  { id: '14', icon: 'scale', name: 'LegalTech & Professional', metric: 'Zero-Trust Vaults', desc: 'Secure case management for legal teams with AI transcription, document indexing and automated deposit handling.', caps: ['Case Vault', 'Audio NLP', 'Evidence Chain', 'Contract Management'], subsectors: ['Legal', 'Professional Services', 'Compliance'] },
  { id: '15', icon: 'users', name: 'Human Resources & Talent', metric: 'Talent & Matching', desc: 'Intelligent candidate matching, resume parsing pipelines, onboarding automation and organisational retention analytics.', caps: ['Resume Parser', 'Matching AI', 'Onboarding Flows', 'Retention Analytics'], subsectors: ['HR Tech', 'Recruitment', 'Payroll'] },
  { id: '16', icon: 'shield', name: 'Insurance & InsurTech', metric: 'Claims Automation', desc: 'Automated claim adjudication pipelines, digital policy administration, risk scoring engines and instant payouts.', caps: ['Claims AI', 'Policy Admin', 'Fraud Scoring', 'Underwriting'], subsectors: ['Insurance', 'InsurTech', 'Risk'] },
  { id: '17', icon: 'phone', name: 'Social Commerce & Creators', metric: 'Live Commerce', desc: 'Social discovery merged with instant commerce: live streaming shopping, creator affiliate tracking and social checkout.', caps: ['Live Shopping', 'Creator Sync', 'One-Click Buy', 'UGC Systems'], subsectors: ['Social Commerce', 'Creator Economy', 'Marketplaces'] },
  { id: '18', icon: 'factory', name: 'Manufacturing & B2B', metric: 'Industrial IoT', desc: 'Industrial IoT predictive maintenance, procurement automation, factory floor visualisation and legacy ERP modernisation.', caps: ['Factory IoT', 'Predictive Maintenance', 'ERP Modernisation', 'Procurement'], subsectors: ['Manufacturing', 'B2B', 'Industrial'] },
  { id: '19', icon: 'trophy', name: 'Sports & Esports', metric: 'Low-Latency Stream', desc: 'Live match telemetry overlays, interactive fantasy backends, low-latency WebRTC streams and global leaderboard scalability.', caps: ['Live Overlays', 'Fantasy Core', 'WebRTC Streams', 'Leaderboards'], subsectors: ['Sports', 'Esports', 'Fan Platforms'] },
];

export function initIndustryHoverSlider() {
  const container = document.getElementById('industry-hover-slider');
  if (!container) return;

  const list = container.querySelector('.industry-rows-list');
  const detail = container.querySelector('.industry-detail-panel');
  if (!list || !detail) return;

  // --- Render all 19 rows -----------------------------------------------
  list.innerHTML = industries.map((item, i) => `
    <button type="button" class="industry-row${i === 0 ? ' active' : ''}" role="tab"
            id="industry-tab-${item.id}" data-index="${i}"
            aria-selected="${i === 0}" tabindex="${i === 0 ? '0' : '-1'}">
      <span class="row-id">${item.id}</span>
      <span class="row-icon">${svg(item.icon)}</span>
      <span class="row-name">${item.name}</span>
    </button>`).join('');

  const rows = [...list.querySelectorAll('.industry-row')];

  // --- Detail panel ------------------------------------------------------
  const render = (i) => {
    const item = industries[i];
    detail.innerHTML = `
      <div class="detail-head">
        <span class="detail-icon">${svg(item.icon)}</span>
        <div>
          <span class="detail-eyebrow">Vertical ${item.id} · ${item.metric}</span>
          <h3 class="detail-title">${item.name}</h3>
        </div>
      </div>
      <p class="detail-desc">${item.desc}</p>
      <div class="detail-block">
        <span class="detail-label">Capabilities</span>
        <div class="detail-chips">${item.caps.map(c => `<span class="detail-chip">${c}</span>`).join('')}</div>
      </div>
      <div class="detail-block">
        <span class="detail-label">Sub-sectors</span>
        <div class="detail-chips subtle">${item.subsectors.map(s => `<span class="detail-chip">${s}</span>`).join('')}</div>
      </div>
      <a href="/contact-us.html" class="detail-cta">
        Discuss this sector
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3.33 8h9.34M8 3.33 12.67 8 8 12.67" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </a>`;
  };

  let active = 0;
  const select = (i, focus = false) => {
    if (i === active && !focus) return;
    active = i;
    rows.forEach((r, n) => {
      const on = n === i;
      r.classList.toggle('active', on);
      r.setAttribute('aria-selected', String(on));
      r.tabIndex = on ? 0 : -1;
    });
    render(i);
    if (focus) rows[i].focus();
  };

  rows.forEach((row, i) => {
    row.addEventListener('mouseenter', () => select(i));
    row.addEventListener('click', () => select(i));
    row.addEventListener('focus', () => select(i));
  });

  // Roving-tabindex keyboard support for the tablist
  list.addEventListener('keydown', (e) => {
    const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    if (keys[e.key]) {
      e.preventDefault();
      select((active + keys[e.key] + rows.length) % rows.length, true);
    } else if (e.key === 'Home') {
      e.preventDefault(); select(0, true);
    } else if (e.key === 'End') {
      e.preventDefault(); select(rows.length - 1, true);
    }
  });

  render(0);
  initAllIndustriesModal();
  initTelemetryCards();
}

function initAllIndustriesModal() {
  const openBtn = document.getElementById('open-all-industries-btn');
  const modal = document.getElementById('industry-all-modal');
  if (!openBtn || !modal) return;

  const grid = modal.querySelector('.modal-grid-body');
  if (grid) {
    grid.innerHTML = industries.map(item => `
      <div class="modal-industry-card">
        <div class="card-head"><span class="modal-icon">${svg(item.icon)}</span><span class="card-id">${item.id}</span></div>
        <h4>${item.name}</h4>
        <p>${item.desc}</p>
        <div class="modal-tags">${item.caps.slice(0, 3).map(c => `<span>${c}</span>`).join('')}</div>
      </div>`).join('');
  }

  const closeBtn = modal.querySelector('.modal-close-btn');
  const backdrop = modal.querySelector('.modal-backdrop-blur');
  let lastFocused = null;

  const open = () => {
    lastFocused = document.activeElement;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    (closeBtn || modal).focus();
  };
  const close = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    lastFocused?.focus();
  };

  openBtn.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  backdrop?.addEventListener('click', close);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) close();
  });
}

function initTelemetryCards() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('.doodle-telemetry-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-2px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}
