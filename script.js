// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const trackingForm = document.getElementById('trackingForm');
const contactForm = document.getElementById('contactForm');
const trackingLoader = document.getElementById('trackingLoader');
const navBackdrop = document.querySelector('.nav-backdrop');

// Mobile Navigation Toggle (improved)
// Prevent accidental immediate close on small scrolls (address-bar collapse) and
// keep menu open until an intentional outside click or meaningful scroll occurs.
let lastScrollY = window.scrollY || window.pageYOffset || 0;
const SCROLL_CLOSE_THRESHOLD = 25; // px

function openMenu(){
    hamburger.classList.add('active');
    navMenu.classList.add('active');
    if(navBackdrop) navBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    // accessibility
    try{ hamburger.setAttribute('aria-expanded','true'); }catch(e){}
    try{ navMenu.setAttribute('aria-hidden','false'); }catch(e){}
}

function closeMenu(){
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    if(navBackdrop) navBackdrop.classList.remove('active');
    document.body.style.overflow = '';
    // accessibility
    try{ hamburger.setAttribute('aria-expanded','false'); }catch(e){}
    try{ navMenu.setAttribute('aria-hidden','true'); }catch(e){}
}

hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    const willBeActive = !hamburger.classList.contains('active');
    if(willBeActive) openMenu(); else closeMenu();
});

document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    // keep existing navigation behavior but ensure aria + backdrop are updated
    closeMenu();
}));

// Close mobile menu when clicking outside (only if menu is open)
document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        closeMenu();
    }
});

// Close mobile menu on meaningful scroll (debounce by threshold)
window.addEventListener('scroll', () => {
    const currentY = window.scrollY || window.pageYOffset || 0;
    if (navMenu.classList.contains('active') && Math.abs(currentY - lastScrollY) > SCROLL_CLOSE_THRESHOLD) {
        closeMenu();
    }
    lastScrollY = currentY;
});

// Clicking the backdrop should close the menu
if(navBackdrop){
    navBackdrop.addEventListener('click', ()=>{ if(navMenu.classList.contains('active')) closeMenu(); });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Enhanced Tracking Form with Loading Animation
trackingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const trackingNumber = document.getElementById('trackingNumber').value.trim();
    const submitBtn = trackingForm.querySelector('.tracking-button');
    
    if (!trackingNumber) {
        alert('Please enter a tracking number');
        return;
    }
    
    // Show loading animation
    showTrackingLoader();
    
    // Simulate network delay for dramatic effect
    setTimeout(() => {
        hideTrackingLoader();
        // Navigate to tracking page with the number
        window.location.href = `tracking.html?tracking=${encodeURIComponent(trackingNumber)}`;
    }, 2500); // 2.5 seconds for full effect
});

function showTrackingLoader() {
    if (trackingLoader) {
        trackingLoader.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Update loading text dynamically
        const loaderText = trackingLoader.querySelector('.loader-text');
        const loaderSubtext = trackingLoader.querySelector('.loader-subtext');
        
        const messages = [
            { text: 'Scanning Neural Networks', sub: 'Analyzing quantum delivery pathways...' },
            { text: 'Connecting to AI Matrix', sub: 'Establishing secure blockchain connection...' },
            { text: 'Processing Tracking Data', sub: 'Decrypting shipment coordinates...' },
            { text: 'Almost Ready', sub: 'Finalizing predictive analytics...' }
        ];
        
        let messageIndex = 0;
        const messageInterval = setInterval(() => {
            messageIndex = (messageIndex + 1) % messages.length;
            if (loaderText) loaderText.textContent = messages[messageIndex].text;
            if (loaderSubtext) loaderSubtext.textContent = messages[messageIndex].sub;
        }, 600);
        
        // Store interval so we can clear it
        trackingLoader.messageInterval = messageInterval;
    }
}

function hideTrackingLoader() {
    if (trackingLoader) {
        trackingLoader.classList.remove('show');
        document.body.style.overflow = '';
        
        // Clear the message interval
        if (trackingLoader.messageInterval) {
            clearInterval(trackingLoader.messageInterval);
            trackingLoader.messageInterval = null;
        }
    }
}

// Contact form submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    setTimeout(() => {
        alert(`Thank you for your message, ${name}! We'll get back to you at ${email} soon.`);
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
});

// Navbar scroll effect
function updateNavbarBackground() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        navbar.dataset.scrolled = 'true';
    } else {
        // keep navbar dark when at top
        navbar.style.background = 'rgba(30, 27, 75, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        navbar.dataset.scrolled = 'false';
    }
}

window.addEventListener('scroll', updateNavbarBackground);

// ensure correct initial state on load
document.addEventListener('DOMContentLoaded', updateNavbarBackground);

// Animate elements on scroll
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.style.opacity = '1'; entry.target.style.transform = 'translateY(0)'; } });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .stat, .contact-item');
    animateElements.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(30px)'; el.style.transition = 'opacity 0.6s ease, transform 0.6s ease'; observer.observe(el); });
});

// Add some interactive features
document.addEventListener('DOMContentLoaded', () => {
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => { card.style.transform = 'translateY(-10px) scale(1.02)'; });
        card.addEventListener('mouseleave', () => { card.style.transform = 'translateY(0) scale(1)'; });
    });
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent; heroTitle.textContent = ''; let i = 0;
        function typeWriter() { if (i < text.length) { heroTitle.textContent += text.charAt(i); i++; setTimeout(typeWriter, 50); } }
        setTimeout(typeWriter, 500);
    }
});

/******************** Admin Hidden Setup ********************/
(function(){
    const adminModal = document.getElementById('adminModal');
    const authOverlay = document.getElementById('adminAuthOverlay');
    const authForm = document.getElementById('adminAuthForm');
    const authPassword = document.getElementById('adminAuthPassword');
    const authCancel = document.getElementById('adminAuthCancel');
    const authError = document.getElementById('adminAuthError');
    const authCard = document.getElementById('adminAuthCard');
    const togglePwBtn = document.getElementById('togglePasswordVisibility');
    const PASSWORD = 'qwertykeyboard';

    // Tracking admin elements
    const trackingList = document.getElementById('trackingList');
    const addTrackingBtn = document.getElementById('addTrackingBtn');
    const trackingEditForm = document.getElementById('trackingEditForm');
    const addTimelineEventBtn = document.getElementById('addTimelineEventBtn');
    const timelineEventsContainer = document.getElementById('timelineEventsContainer');
    const deleteTrackingBtn = document.getElementById('deleteTrackingBtn');
    const resetAllTrackingBtn = document.getElementById('resetAllTrackingBtn');
    const adminSaveNotice = document.getElementById('adminSaveNotice');

    // Contact admin elements
    const contactAdminModal = document.getElementById('contactAdminModal');
    const contactAdminCloseBtn = document.getElementById('contactAdminCloseBtn');
    const contactEditForm = document.getElementById('contactEditForm');
    const resetContactBtn = document.getElementById('resetContactBtn');

    // API base
    const API_BASE = window.API_BASE || 'https://swiftlogistics-cluster.onrender.com/api';
    // Local cache mirror (robust fallback for UI and tracking page)
    const CACHE_KEY = 'swiftLogisticsCache_v1';
    const loadCache = () => { try { return JSON.parse(localStorage.getItem(CACHE_KEY)) || {}; } catch(e){ return {}; } };
    const saveCache = (map) => { localStorage.setItem(CACHE_KEY, JSON.stringify(map||{})); };

    const trackingTriggerHeading = document.querySelector('.tracking-form h3');
    const contactHeading = document.querySelector('#contact .section-title');
    if(trackingTriggerHeading){ trackingTriggerHeading.style.cursor='pointer'; trackingTriggerHeading.title='(Hidden setup: Double‑click)'; }
    if(contactHeading){ contactHeading.style.cursor='pointer'; contactHeading.title='(Hidden setup: Double‑click)'; }

    function openAuth(mode, subtitle){
        if(subtitle){ const st = document.getElementById('adminAuthSubtitle'); if(st) st.textContent = subtitle; }
        if(authError) authError.textContent='';
        if(authPassword){ authPassword.value=''; authPassword.type='password'; }
        if(authOverlay){ authOverlay.style.display='flex'; setTimeout(()=> authPassword && authPassword.focus(),30); }
        authForm.dataset.mode = mode;
    }
    function closeAuth(){ if(authOverlay) authOverlay.style.display='none'; }
    function showTrackingAdmin(){ if(adminModal){ adminModal.style.display='block'; document.body.style.overflow='hidden'; renderList(); } }
    function showContactAdmin(){ if(contactAdminModal){ contactAdminModal.style.display='block'; document.body.style.overflow='hidden'; populateContactForm(); } }
    function closeTrackingAdmin(){ if(adminModal){ adminModal.style.display='none'; document.body.style.overflow=''; } }
    function closeContactAdmin(){ if(contactAdminModal){ contactAdminModal.style.display='none'; document.body.style.overflow=''; } }

    const trackingTrigger = document.querySelector('.tracking-form h3');
    trackingTrigger && trackingTrigger.addEventListener('dblclick', ()=> openAuth('tracking','Enter password to configure tracking.'));
    contactHeading && contactHeading.addEventListener('dblclick', ()=> openAuth('contact','Enter password to configure contact info.'));

    authForm && authForm.addEventListener('submit', e=>{
        e.preventDefault();
        if(authPassword.value === PASSWORD){
            closeAuth();
            if(authForm.dataset.mode==='contact') showContactAdmin(); else showTrackingAdmin();
        } else {
            authError && (authError.textContent='Incorrect password');
            if(authCard){ authCard.classList.remove('admin-auth-shake'); void authCard.offsetWidth; authCard.classList.add('admin-auth-shake'); }
            authPassword.focus(); authPassword.select();
        }
    });
    togglePwBtn && togglePwBtn.addEventListener('click', ()=>{ if(!authPassword) return; if(authPassword.type==='password'){ authPassword.type='text'; togglePwBtn.innerHTML='<i class="fas fa-eye-slash"></i>'; } else { authPassword.type='password'; togglePwBtn.innerHTML='<i class="fas fa-eye"></i>'; } });
    authCancel && authCancel.addEventListener('click', closeAuth);
    authOverlay && authOverlay.addEventListener('click', e=>{ if(e.target===authOverlay) closeAuth(); });
    document.getElementById('adminCloseBtn') && document.getElementById('adminCloseBtn').addEventListener('click', closeTrackingAdmin);
    contactAdminCloseBtn && contactAdminCloseBtn.addEventListener('click', closeContactAdmin);
    window.addEventListener('keydown', e=>{ if(e.key==='Escape'){ if(authOverlay && authOverlay.style.display==='flex') closeAuth(); if(adminModal && adminModal.style.display==='block') closeTrackingAdmin(); if(contactAdminModal && contactAdminModal.style.display==='block') closeContactAdmin(); } });

    // Tracking admin: DB + cache
    const trackingFieldIds = ['editNumber','editStatus','editStatusText','editOrigin','editDestination','editETA','editType','editWeight','editDimensions','editInsurance'];

    async function fetchAllRemote(){ try { const r=await fetch(`${API_BASE}/tracking`); if(!r.ok) throw 0; const list=await r.json(); const m={}; list.forEach(d=>{ if(d && d.number){ m[d.number] = d; } }); return m; } catch(e){ return null; } }
    async function fetchOneRemote(num){ try { const r=await fetch(`${API_BASE}/tracking/${encodeURIComponent(num)}`); if(!r.ok) return null; return await r.json(); } catch(e){ return null; } }
    async function saveRemote(entry){ try { const r=await fetch(`${API_BASE}/tracking`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(entry)}); if(!r.ok) return null; return await r.json(); } catch(e){ return null; } }
    async function deleteRemote(num){ try { const r = await fetch(`${API_BASE}/tracking/${encodeURIComponent(num)}`, { method:'DELETE' }); return r.ok; } catch(e){ return false; } }

    let cacheMap = loadCache();

    async function refreshList(){
        const remote = await fetchAllRemote();
        if(remote){
            // Merge remote into cache, remove _unsynced if server has item
            Object.keys(remote).forEach(k=>{ cacheMap[k] = { ...(remote[k]||{}), _unsynced: false }; });
            // Remove items from cache that no longer exist remotely and are not unsynced
            Object.keys(cacheMap).forEach(k=>{ if(!remote[k] && !cacheMap[k]?._unsynced) delete cacheMap[k]; });
            saveCache(cacheMap);
        }
        renderList();
    }

    function renderList(){
        if(!trackingList) return;
        trackingList.innerHTML='';
        const keys = Object.keys(cacheMap).sort();
        if(!keys.length){ const li=document.createElement('li'); li.textContent='No tracking numbers'; li.style.opacity='.6'; trackingList.appendChild(li); return; }
        keys.forEach(k=>{
            const li=document.createElement('li');
            const status = cacheMap[k]?.status || '';
            const unsynced = cacheMap[k]?._unsynced;
            li.dataset.key=k;
            li.innerHTML=`<span>${k}</span><span style="font-size:.6rem; text-transform:uppercase; color:${unsynced?'#b91c1c':'#2563eb'};">${unsynced?'offline':status}</span>`;
            li.addEventListener('click', async ()=>{
                const upper = k.toUpperCase();
                const data = await fetchOneRemote(upper);
                populateTrackingForm(data || cacheMap[upper]);
            });
            trackingList.appendChild(li);
        });
    }

    function clearTrackingForm(){ trackingFieldIds.forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; }); if(timelineEventsContainer) timelineEventsContainer.innerHTML=''; }

    function populateTrackingForm(entry){ if(!entry) return; document.getElementById('editNumber').value=entry.number||''; document.getElementById('editStatus').value=entry.status||'pending'; document.getElementById('editStatusText').value=entry.statusText||''; document.getElementById('editOrigin').value=entry.origin||''; document.getElementById('editDestination').value=entry.destination||''; document.getElementById('editETA').value=(entry.estimatedDelivery&&entry.estimatedDelivery.length<=10)?entry.estimatedDelivery:''; document.getElementById('editType').value=entry.packageType||''; document.getElementById('editWeight').value=entry.weight||''; document.getElementById('editDimensions').value=entry.dimensions||''; document.getElementById('editInsurance').value=entry.insurance||''; if(timelineEventsContainer){ timelineEventsContainer.innerHTML=''; (entry.timeline||[]).forEach(addTimelineRowFromData); } }

    function dateTimeLocalNow(){ const d=new Date(); const p=n=>String(n).padStart(2,'0'); return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`; }
    function addTimelineRowFromData(item){ if(!timelineEventsContainer) return; const dt=(item.date||'').replace(' ','T').slice(0,16); const row=document.createElement('div'); row.className='timeline-event-row'; row.innerHTML=`<div class="event-inputs-row"><input type="datetime-local" value="${dt}" class="ev-date"/><input placeholder="Title" value="${item.title||''}" class="ev-title"/><input placeholder="Description" value="${item.description||''}" class="ev-desc"/><input placeholder="Location" value="${item.location||''}" class="ev-location"/></div><div class="event-flags-row"><div class="event-flag-item"><input type="checkbox" class="ev-active" ${item.active?'checked':''}/> <span>Completed</span><small style="display:block;color:#64748b;font-size:0.7rem;">Shows green with checkmark</small></div><div class="event-flag-item"><input type="checkbox" class="ev-blink" ${item.blink?'checked':''}/> <span>Highlight</span><small style="display:block;color:#64748b;font-size:0.7rem;">Adds pulsing glow effect</small></div></div><div class="event-actions"><button type="button" class="now-btn" title="Now">Now</button><button type="button" class="remove-event-btn" title="Remove">&times;</button></div>`; row.querySelector('.remove-event-btn').addEventListener('click',()=>row.remove()); row.querySelector('.now-btn').addEventListener('click',()=>{ row.querySelector('.ev-date').value=dateTimeLocalNow(); }); timelineEventsContainer.appendChild(row); }
    function addEmptyTimelineRow(){ addTimelineRowFromData({ date: dateTimeLocalNow(), title:'', description:'', location:'', active:false }); }
    function inferStatusText(status){ switch(status){ case'in-transit':return'In Transit'; case'delivered':return'Delivered'; case'pending':return'Pending'; default:return status; } }

    addTrackingBtn && addTrackingBtn.addEventListener('click', ()=>{ clearTrackingForm(); document.getElementById('editNumber').focus(); });
    addTimelineEventBtn && addTimelineEventBtn.addEventListener('click', addEmptyTimelineRow);

    trackingEditForm && trackingEditForm.addEventListener('submit', async e=>{
        e.preventDefault();
        const num=document.getElementById('editNumber').value.trim().toUpperCase();
        if(!num){ alert('Tracking number required'); return; }
        const timeline=Array.from(timelineEventsContainer.querySelectorAll('.timeline-event-row')).map(r=>({ date:(r.querySelector('.ev-date').value||'').replace('T',' '), title:r.querySelector('.ev-title').value.trim(), description:r.querySelector('.ev-desc').value.trim(), location:r.querySelector('.ev-location').value.trim(), active:r.querySelector('.ev-active').checked, blink:(r.querySelector('.ev-blink') ? r.querySelector('.ev-blink').checked : false) })).filter(t=> t.date||t.title||t.description||t.location);
        const statusVal=document.getElementById('editStatus').value;
        const entry={ number:num, status:statusVal, statusText: document.getElementById('editStatusText').value.trim()||inferStatusText(statusVal), origin: document.getElementById('editOrigin').value.trim(), destination: document.getElementById('editDestination').value.trim(), estimatedDelivery: document.getElementById('editETA').value, packageType: document.getElementById('editType').value.trim(), weight: document.getElementById('editWeight').value.trim(), dimensions: document.getElementById('editDimensions').value.trim(), insurance: document.getElementById('editInsurance').value.trim(), timeline };

        // Optimistic cache update
        cacheMap[num] = { ...entry, _unsynced: true };
        saveCache(cacheMap);
        renderList();

        const saved = await saveRemote(entry);
        if(saved){ cacheMap[num] = { ...saved, _unsynced: false }; saveCache(cacheMap); renderList(); alert('Saved'); }
        else { alert('Save failed (kept offline). Will show in admin but won\'t be found server-side until connection is restored.'); }
    });

    deleteTrackingBtn && deleteTrackingBtn.addEventListener('click', async ()=>{
        const num=document.getElementById('editNumber').value.trim().toUpperCase();
        if(!num){ alert('Enter the tracking number in the form to delete'); return;}
        if(!confirm(`Delete tracking number "${num}"?\n\nThis will permanently remove it from the database and cannot be undone.`)) return;
        
        // Show deleting status
        deleteTrackingBtn.disabled = true;
        deleteTrackingBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deleting...';
        
        const prev = cacheMap[num];
        delete cacheMap[num];
        saveCache(cacheMap);
        renderList();
        
        const ok = await deleteRemote(num);
        if(ok){ 
            alert(`✅ Successfully deleted "${num}" from database`); 
            clearTrackingForm();
        } else { 
            cacheMap[num] = prev; 
            saveCache(cacheMap); 
            renderList(); 
            alert(`❌ Failed to delete "${num}" from database. Please try again.`); 
        }
        
        deleteTrackingBtn.disabled = false;
        deleteTrackingBtn.innerHTML = '<i class="fas fa-trash"></i> Delete';
    });

    resetAllTrackingBtn && resetAllTrackingBtn.addEventListener('click', async ()=>{
        if(!confirm('Remove ALL tracking entries from database?')) return;
        const keys = Object.keys(cacheMap);
        let allOk = true;
        for(const k of keys){ const ok = await deleteRemote(k); if(!ok) allOk = false; }
        cacheMap = {};
        saveCache(cacheMap);
        renderList();
        alert(allOk ? 'Reset complete' : 'Reset partially failed. Some items may remain on server.');
    });

    // Contact info logic — DB only
    async function fetchContact(){ try { const r = await fetch(`${API_BASE}/contact`); if(!r.ok) return {}; return await r.json(); } catch(e){ return {}; } }
    async function saveContactRemote(data){ try { const r = await fetch(`${API_BASE}/contact`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)}); return await r.json(); } catch(e){ return null; } }

    function applyContactToDOM(info){
        const addrP = document.querySelector('.contact-item:nth-child(1) p');
        const phoneP = document.querySelector('.contact-item:nth-child(2) p');
        const emailP = document.querySelector('.contact-item:nth-child(3) p');
        const hoursP = document.querySelector('.contact-item:nth-child(4) p');
        if(addrP) addrP.innerHTML = (info.address||'').replace(/\n/g,'<br>');
        if(phoneP) phoneP.textContent = info.phone||'';
        if(emailP) emailP.textContent = info.email||'';
        if(hoursP) hoursP.innerHTML = (info.hours||'').replace(/\n/g,'<br>');
    }

    async function populateContactForm(){ const info = await fetchContact(); document.getElementById('editContactAddress').value = info.address||''; document.getElementById('editContactPhone').value = info.phone||''; document.getElementById('editContactEmail').value = info.email||''; document.getElementById('editContactHours').value = info.hours||''; }

    const trackingHeading = document.querySelector('.tracking-form h3');
    trackingHeading && trackingHeading.addEventListener('dblclick', ()=> openAuth('tracking','Enter password to configure tracking.'));

    contactEditForm && contactEditForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            address: document.getElementById('editContactAddress').value,
            phone: document.getElementById('editContactPhone').value,
            email: document.getElementById('editContactEmail').value,
            hours: document.getElementById('editContactHours').value
        };
        const saved = await saveContactRemote(data);
        if (saved) {
            applyContactToDOM(saved); // Update the main UI with the new info
            alert('Contact info saved!');
            closeContactAdmin(); // Optionally close the modal
        } else {
            alert('Failed to save contact info.');
        }
    });

    document.addEventListener('DOMContentLoaded', async ()=>{ await refreshList(); applyContactToDOM(await fetchContact()); });
    // Also, react to cross-tab cache updates
    window.addEventListener('storage', (e)=>{ if(e.key === CACHE_KEY){ cacheMap = loadCache(); renderList(); } });
})();
/******************** End Admin Hidden Setup ********************/

// CEO Bio Toggle
(function(){
  const btn = document.getElementById('toggleCeoBioBtn');
  const collapse = document.querySelector('.ceo-bio-collapse');
  if(!btn || !collapse) return;
  btn.setAttribute('aria-expanded','false');
  collapse.setAttribute('aria-hidden','true');
  btn.addEventListener('click', ()=>{
    const expanded = collapse.classList.toggle('expanded');
    btn.textContent = expanded ? 'Show Less' : 'Read More';
    btn.setAttribute('aria-expanded', expanded ? 'true':'false');
    collapse.setAttribute('aria-hidden', expanded ? 'false':'true');
  });
})();
