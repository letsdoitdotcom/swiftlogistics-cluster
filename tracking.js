// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const trackingInput = document.getElementById('trackingNumber');
const trackButton = document.getElementById('trackButton');
const trackingResults = document.getElementById('trackingResults');

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Sample tracking data (demo only; real entries come from DB)
const sampleTrackingData = {
  'MD123456789': {
    number: 'MD123456789',
    status: 'in-transit',
    statusText: 'In Transit',
    origin: 'New York, NY',
    destination: 'Los Angeles, CA',
    estimatedDelivery: '2024-01-15',
    packageType: 'Express Delivery',
    weight: '2.5 kg',
    dimensions: '30 x 20 x 15 cm',
    insurance: 'Yes - $500 coverage',
    timeline: [
      { date: '2024-01-10 08:30 AM', title: 'Package Picked Up', description: 'Package has been picked up from sender at New York, NY', location: 'New York, NY', active: true },
      { date: '2024-01-10 02:15 PM', title: 'In Transit', description: 'Package is in transit to destination', location: 'In Transit', active: true },
      { date: '2024-01-11 09:45 AM', title: 'Arrived at Sorting Facility', description: 'Package arrived at sorting facility in Chicago', location: 'Chicago, IL', active: true },
      { date: '2024-01-12 11:20 AM', title: 'Out for Delivery', description: 'Package is out for delivery', location: 'Los Angeles, CA', active: false },
      { date: '2024-01-15 10:00 AM', title: 'Delivered', description: 'Package has been delivered to recipient', location: 'Los Angeles, CA', active: false }
    ]
  },
  'MD987654321': {
    number: 'MD987654321',
    status: 'delivered',
    statusText: 'Delivered',
    origin: 'Miami, FL',
    destination: 'Seattle, WA',
    estimatedDelivery: '2024-01-08',
    packageType: 'Standard Delivery',
    weight: '1.8 kg',
    dimensions: '25 x 18 x 12 cm',
    insurance: 'Yes - $300 coverage',
    timeline: [
      { date: '2024-01-05 10:00 AM', title: 'Package Picked Up', description: 'Package has been picked up from sender at Miami, FL', location: 'Miami, FL', active: true },
      { date: '2024-01-06 03:30 PM', title: 'In Transit', description: 'Package is in transit to destination', location: 'In Transit', active: true },
      { date: '2024-01-07 01:15 PM', title: 'Arrived at Sorting Facility', description: 'Package arrived at sorting facility in Denver', location: 'Denver, CO', active: true },
      { date: '2024-01-08 08:45 AM', title: 'Out for Delivery', description: 'Package is out for delivery', location: 'Seattle, WA', active: true },
      { date: '2024-01-08 02:30 PM', title: 'Delivered', description: 'Package has been delivered to recipient', location: 'Seattle, WA', active: true }
    ]
  },
  'MD555666777': {
    number: 'MD555666777',
    status: 'pending',
    statusText: 'Pending',
    origin: 'Boston, MA',
    destination: 'San Francisco, CA',
    estimatedDelivery: '2024-01-20',
    packageType: 'Premium Delivery',
    weight: '5.2 kg',
    dimensions: '40 x 30 x 25 cm',
    insurance: 'Yes - $1000 coverage',
    timeline: [
      { date: '2024-01-13 09:00 AM', title: 'Package Received', description: 'Package received at our facility', location: 'Boston, MA', active: true },
      { date: '2024-01-14 10:30 AM', title: 'Processing', description: 'Package is being processed for shipment', location: 'Boston, MA', active: false },
      { date: '2024-01-15 08:00 AM', title: 'Scheduled for Pickup', description: 'Package scheduled for pickup', location: 'Boston, MA', active: false },
      { date: '2024-01-16 09:00 AM', title: 'In Transit', description: 'Package will be in transit', location: 'In Transit', active: false },
      { date: '2024-01-20 10:00 AM', title: 'Estimated Delivery', description: 'Estimated delivery date', location: 'San Francisco, CA', active: false }
    ]
  }
};

// Remote DB access
const API_BASE = window.API_BASE || 'https://movers-xvn7.onrender.com/api';
async function fetchTrackingRemote(num){
  try {
    const r = await fetch(`${API_BASE}/tracking/${encodeURIComponent(num)}`);
    if(!r.ok) return null;
    return await r.json();
  } catch(e){ return null; }
}

function loadAdminCache(){ try { return JSON.parse(localStorage.getItem('trackingCache_v2')) || {}; } catch(e){ return {}; } }

async function getTrackingData(trackingNumber){
  const remote = await fetchTrackingRemote(trackingNumber);
  if(remote) return { data: remote, source: 'db' };
  const sample = sampleTrackingData[trackingNumber];
  if(sample) return { data: sample, source: 'sample' };
  const cache = loadAdminCache();
  if(cache[trackingNumber]) return { data: cache[trackingNumber], source: 'cache' };
  return { error: null, data: null };
}

async function trackPackage(trackingNumber) {
    const { data } = await getTrackingData(trackingNumber);
    if (!data) { showTrackingError('Tracking number not found. Please check the number and try again.'); return; }
    showTrackingResults(data);
}

function showTrackingResults(data) {
    const statusClass = `status-${data.status}`;
    const infoMap = [
        {label:'Origin', val:data.origin},
        {label:'Destination', val:data.destination},
        {label:'Estimated Delivery', val:data.estimatedDelivery},
        {label:'Package Type', val:data.packageType},
        {label:'Weight', val:data.weight},
        {label:'Dimensions', val:data.dimensions},
        {label:'Insurance', val:data.insurance}
    ].filter(i=> i.val && String(i.val).trim() !== '');

    const infoHTML = infoMap.map(item=>`<div class="tracking-info-item"><h4>${item.label}</h4><p>${item.val}</p></div>`).join('');

    const timeline = (data.timeline||[]);
    const anyBlink = timeline.some(t=> t.blink);
    const lastActiveIndex = [...timeline].map((t,i)=> t.active?i:-1).filter(i=>i!==-1).pop();
    const timelineHTML = timeline.map((item, idx) => {
        const shouldBlink = item.blink || (!anyBlink && idx === lastActiveIndex);
        const classes = ['timeline-item'];
        if(item.active) classes.push('active');
        if(shouldBlink && item.active) classes.push('blink');
        return `
            <div class="${classes.join(' ')}">
                <div class="timeline-date">${item.date || ''}</div>
                <div class="timeline-title">${item.title || ''}</div>
                <div class="timeline-description">${item.description || ''}</div>
                <div class="timeline-location">${item.location || ''}</div>
            </div>`;
    }).join('');

    trackingResults.innerHTML = `
        <div class="tracking-result">
            <div class="tracking-header">
                <div class="tracking-number">Tracking Number: ${data.number}</div>
                <div class="tracking-status ${statusClass}">${data.statusText || ''}</div>
            </div>
            <div class="tracking-details">
                <div class="tracking-info-grid">${infoHTML}</div>
            </div>
            <div class="tracking-timeline">
                <h3>Package Timeline</h3>
                ${timelineHTML}
            </div>
        </div>`;
}

function showTrackingError(message) {
    trackingResults.innerHTML = `
        <div class="tracking-result">
            <div class="tracking-header">
                <div class="tracking-number">Tracking Error</div>
            </div>
            <div class="tracking-info">
                <p style="color: #dc2626; font-weight: 600;">${message}</p>
            </div>
        </div>
    `;
}

// ===== Simulated Loading & Tracking =====
let currentLoadingToken = null;
const loadingMessages = [
  'Initializing request...',
  'Contacting regional hub...',
  'Securing routing path...',
  'Fetching live status...',
  'Compiling timeline...',
  'Finalizing report...'
];

function renderLoadingUI() {
  trackingResults.innerHTML = `
    <div class="tracking-loading" aria-live="polite" aria-busy="true">
      <div class="loading-icon"><i class="fas fa-spinner fa-spin"></i></div>
      <h3 class="loading-title">Retrieving Tracking Data</h3>
      <p class="loading-message" id="loadingMessage">Please wait...</p>
      <div class="loading-progress-wrapper">
        <div class="loading-progress-bar"><span id="loadingBar"></span></div>
        <div class="loading-progress-meta"><span id="loadingPct">0%</span></div>
      </div>
    </div>`;
}

function startSimulatedTracking(trackingNumber){
  currentLoadingToken = Symbol('tracking-load');
  const token = currentLoadingToken;
  const totalMs = 2000 + Math.random()*8000;
  const start = performance.now();
  let nextMsgIndex = 0;

  const dataPromise = (async ()=>{ await new Promise(r=> setTimeout(r, 50)); return await getTrackingData(trackingNumber); })();

  renderLoadingUI();
  trackButton.disabled = true; trackButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Tracking...';
  trackingInput.disabled = true;

  function step(now){
    if(token !== currentLoadingToken) return;
    const elapsed = now - start;
    const pct = Math.min(1, elapsed / totalMs);
    const bar = document.getElementById('loadingBar');
    const pctEl = document.getElementById('loadingPct');
    if(bar) bar.style.width = (pct*100).toFixed(1)+'%';
    if(pctEl) pctEl.textContent = Math.round(pct*100)+'%';
    const msgEl = document.getElementById('loadingMessage');
    const segment = 1 / loadingMessages.length;
    const idx = Math.min(loadingMessages.length-1, Math.floor(pct / segment));
    if(idx !== nextMsgIndex && msgEl){ msgEl.textContent = loadingMessages[idx]; nextMsgIndex = idx; }

    if(pct < 1){ requestAnimationFrame(step); }
    else { finalize(); }
  }

  async function finalize(){
    const { data, error } = await dataPromise;
    if(token !== currentLoadingToken) return;
    if(error){ showTrackingError(error); }
    else if(data){ showTrackingResults(data); }
    else { showTrackingError('Tracking number not found. Please check the number and try again.'); }
    trackButton.disabled = false; trackButton.innerHTML = '<i class="fas fa-search"></i> Track Package';
    trackingInput.disabled = false;
  }

  requestAnimationFrame(step);
}

// Unified click handler
trackButton.addEventListener('click', (e)=>{
  e.preventDefault();
  const trackingNumber = trackingInput.value.trim().toUpperCase();
  if(!trackingNumber){ showTrackingError('Please enter a tracking number.'); return; }
  startSimulatedTracking(trackingNumber);
});

// Keep Enter key support
trackingInput.addEventListener('keypress', (e)=>{ if(e.key==='Enter'){ e.preventDefault(); trackButton.click(); } });

// Re-run tracking automatically if cache updates for current value
window.addEventListener('storage', (e)=>{
  if(e.key === 'trackingCache_v2'){
    const current = (trackingInput.value||'').trim().toUpperCase();
    if(current) { trackPackage(current); }
  }
});
// ===== End Simulated Loading & Tracking =====

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Preserve direct page load tracking
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const trackingNumber = urlParams.get('tracking');
    if (trackingNumber) {
        trackingInput.value = trackingNumber.toUpperCase();
        startSimulatedTracking(trackingNumber.toUpperCase());
    }
});
