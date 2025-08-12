// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const trackingForm = document.getElementById('trackingForm');
const contactForm = document.getElementById('contactForm');

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

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Contact form submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // Simulate form submission
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // Simulate API call delay
    setTimeout(() => {
        alert(`Thank you for your message, ${name}! We'll get back to you at ${email} soon.`);
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
});

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

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .stat, .contact-item');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Add some interactive features
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add typing effect to hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        
        // Start typing effect after a short delay
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
    let targetAfterAuth = 'tracking';

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
    const contactSaveNotice = document.getElementById('contactSaveNotice');

    // Auto-detect API base (CSP safe) – assumes backend served same origin at /api
    const API_BASE = (typeof window.TRACKING_API_BASE !== 'undefined' && window.TRACKING_API_BASE)
        ? window.TRACKING_API_BASE
        : '/api';

    // Add subtle hint cursors for hidden admin triggers
    const trackingTriggerHeading = document.querySelector('.tracking-form h3');
    const contactHeading = document.querySelector('#contact .section-title');
    if(trackingTriggerHeading){ trackingTriggerHeading.style.cursor='pointer'; trackingTriggerHeading.title='(Hidden setup: Double‑click)'; }
    if(contactHeading){ contactHeading.style.cursor='pointer'; contactHeading.title='(Hidden setup: Double‑click)'; }

    // ========== RESTORE HIDDEN ADMIN AUTH LOGIC (was removed) ==========
    function openAuth(mode, subtitle){
        targetAfterAuth = mode; // reuse existing variable declared earlier
        if(subtitle){ const st = document.getElementById('adminAuthSubtitle'); if(st) st.textContent = subtitle; }
        if(authError) authError.textContent='';
        if(authPassword){ authPassword.value=''; authPassword.type='password'; }
        if(authOverlay){ authOverlay.style.display='flex'; setTimeout(()=> authPassword && authPassword.focus(),30); }
    }
    function closeAuth(){ if(authOverlay) authOverlay.style.display='none'; }
    function showTrackingAdmin(){ if(adminModal){ adminModal.style.display='block'; document.body.style.overflow='hidden'; renderList && renderList(); } }
    function showContactAdmin(){ if(contactAdminModal){ contactAdminModal.style.display='block'; document.body.style.overflow='hidden'; populateContactForm && populateContactForm(); } }
    function closeTrackingAdmin(){ if(adminModal){ adminModal.style.display='none'; document.body.style.overflow=''; } }
    function closeContactAdmin(){ if(contactAdminModal){ contactAdminModal.style.display='none'; document.body.style.overflow=''; } }

    trackingTriggerHeading && trackingTriggerHeading.addEventListener('dblclick', ()=> openAuth('tracking','Enter password to configure tracking.'));
    contactHeading && contactHeading.addEventListener('dblclick', ()=> openAuth('contact','Enter password to configure contact info.'));

    authForm && authForm.addEventListener('submit', e=>{
        e.preventDefault();
        if(!authPassword) return;
        if(authPassword.value === PASSWORD){
            closeAuth();
            if(targetAfterAuth==='contact') showContactAdmin(); else showTrackingAdmin();
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
    // ====================================================================

    const STORAGE_KEY = 'customTrackingData_v1';
    const CONTACT_STORAGE_KEY = 'customContactInfo_v1';
    let currentEditKey = null;

    function loadDataLocal(){ try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch(e){ return {}; } }
    function saveDataLocal(data){ localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
    async function fetchAllRemote(){ if(!API_BASE) return null; try { const r=await fetch(`${API_BASE}/tracking`); if(!r.ok) throw 0; const list=await r.json(); const m={}; list.forEach(d=>m[d.number]=d); return m; } catch(e){ return null; } }
    async function saveRemote(entry){ if(!API_BASE) return; try { await fetch(`${API_BASE}/tracking`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(entry)});}catch(e){} }
    function broadcastUpdate(){ window.dispatchEvent(new CustomEvent('tracking-data-updated')); }
    function loadData(){ return loadDataLocal(); }
    function saveData(data){ saveDataLocal(data); broadcastUpdate(); }
    (async ()=>{ const remote=await fetchAllRemote(); if(remote){ saveDataLocal(remote); broadcastUpdate(); renderList(); } })();

    const trackingFieldIds = ['editNumber','editStatus','editStatusText','editOrigin','editDestination','editETA','editType','editWeight','editDimensions','editInsurance'];

    function renderList(){ if(!trackingList) return; const data=loadData(); trackingList.innerHTML=''; const keys=Object.keys(data).sort(); if(!keys.length){ const li=document.createElement('li'); li.textContent='No tracking numbers'; li.style.opacity='.6'; trackingList.appendChild(li); return; } keys.forEach(k=>{ const li=document.createElement('li'); li.dataset.key=k; const status=data[k].status||''; li.innerHTML=`<span>${k}</span><span style="font-size:.6rem; text-transform:uppercase; color:#2563eb;">${status}</span>`; if(k===currentEditKey) li.classList.add('active'); li.addEventListener('click',()=>{ currentEditKey=k; populateTrackingForm(data[k]); renderList(); }); trackingList.appendChild(li); }); }

    function clearTrackingForm(){ trackingFieldIds.forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; }); if(timelineEventsContainer) timelineEventsContainer.innerHTML=''; currentEditKey=null; }

    function populateTrackingForm(entry){ if(!entry) return; document.getElementById('editNumber').value=entry.number||''; document.getElementById('editStatus').value=entry.status||'pending'; document.getElementById('editStatusText').value=entry.statusText||''; document.getElementById('editOrigin').value=entry.origin||''; document.getElementById('editDestination').value=entry.destination||''; document.getElementById('editETA').value=(entry.estimatedDelivery&&entry.estimatedDelivery.length<=10)?entry.estimatedDelivery:''; document.getElementById('editType').value=entry.packageType||''; document.getElementById('editWeight').value=entry.weight||''; document.getElementById('editDimensions').value=entry.dimensions||''; document.getElementById('editInsurance').value=entry.insurance||''; if(timelineEventsContainer){ timelineEventsContainer.innerHTML=''; (entry.timeline||[]).forEach(addTimelineRowFromData); } }

    function dateTimeLocalNow(){ const d=new Date(); const p=n=>String(n).padStart(2,'0'); return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`; }
    function addTimelineRowFromData(item){ if(!timelineEventsContainer) return; const dt=(item.date||'').replace(' ','T').slice(0,16); const row=document.createElement('div'); row.className='timeline-event-row'; row.innerHTML=`<input type="datetime-local" value="${dt}" class="ev-date"/><input placeholder="Title" value="${item.title||''}" class="ev-title"/><input placeholder="Description" value="${item.description||''}" class="ev-desc"/><input placeholder="Location" value="${item.location||''}" class="ev-location"/><div class="event-active-flag"><input type="checkbox" class="ev-active" ${item.active?'checked':''}/> <span>Done</span><input type="checkbox" class="ev-blink" ${item.blink?'checked':''} style="margin-left:.6rem;"/> <span>Blink</span></div><button type="button" class="now-btn" title="Now">Now</button><button type="button" class="remove-event-btn" title="Remove">&times;</button>`; row.querySelector('.remove-event-btn').addEventListener('click',()=>row.remove()); row.querySelector('.now-btn').addEventListener('click',()=>{ row.querySelector('.ev-date').value=dateTimeLocalNow(); }); timelineEventsContainer.appendChild(row); }
    function addEmptyTimelineRow(){ addTimelineRowFromData({ date: dateTimeLocalNow(), title:'', description:'', location:'', active:false }); }
    function inferStatusText(status){ switch(status){ case'in-transit':return'In Transit'; case'delivered':return'Delivered'; case'pending':return'Pending'; default:return status; } }

    addTrackingBtn && addTrackingBtn.addEventListener('click', ()=>{ clearTrackingForm(); document.getElementById('editNumber').focus(); });
    addTimelineEventBtn && addTimelineEventBtn.addEventListener('click', addEmptyTimelineRow);
    trackingEditForm && trackingEditForm.addEventListener('submit', e=>{ e.preventDefault(); const num=document.getElementById('editNumber').value.trim().toUpperCase(); if(!num){ alert('Tracking number required'); return; } const data=loadData(); const timeline=Array.from(timelineEventsContainer.querySelectorAll('.timeline-event-row')).map(r=>({ date:(r.querySelector('.ev-date').value||'').replace('T',' '), title:r.querySelector('.ev-title').value.trim(), description:r.querySelector('.ev-desc').value.trim(), location:r.querySelector('.ev-location').value.trim(), active:r.querySelector('.ev-active').checked, blink:(r.querySelector('.ev-blink') ? r.querySelector('.ev-blink').checked : false) })).filter(t=> t.date||t.title||t.description||t.location); const statusVal=document.getElementById('editStatus').value; const entry={ number:num, status:statusVal, statusText: document.getElementById('editStatusText').value.trim()||inferStatusText(statusVal), origin: document.getElementById('editOrigin').value.trim(), destination: document.getElementById('editDestination').value.trim(), estimatedDelivery: document.getElementById('editETA').value, packageType: document.getElementById('editType').value.trim(), weight: document.getElementById('editWeight').value.trim(), dimensions: document.getElementById('editDimensions').value.trim(), insurance: document.getElementById('editInsurance').value.trim(), timeline }; data[num]=entry; saveData(data); currentEditKey=num; renderList(); if(adminSaveNotice){ adminSaveNotice.textContent='Saved '+ new Date().toLocaleTimeString(); adminSaveNotice.style.color='#059669'; setTimeout(()=>{adminSaveNotice.style.color='#64748b';},2000);} if(API_BASE) saveRemote(entry); });
    deleteTrackingBtn && deleteTrackingBtn.addEventListener('click', ()=>{ if(!currentEditKey){ alert('Select a tracking number first'); return;} if(!confirm('Delete '+currentEditKey+' ?')) return; const data=loadData(); delete data[currentEditKey]; saveData(data); clearTrackingForm(); renderList(); if(adminSaveNotice){ adminSaveNotice.textContent='Deleted'; adminSaveNotice.style.color='#dc2626'; setTimeout(()=>{adminSaveNotice.style.color='#64748b';},1500);} });
    resetAllTrackingBtn && resetAllTrackingBtn.addEventListener('click', ()=>{ if(!confirm('Remove ALL custom tracking entries?')) return; localStorage.removeItem(STORAGE_KEY); broadcastUpdate(); clearTrackingForm(); renderList(); });

    // Contact info logic (DB only, no localStorage fallback)
    let contactCache = { address:'', phone:'', email:'', hours:'' };

    async function fetchContact(){
        if(!API_BASE) { console.warn('API_BASE not set: contact info unavailable'); return; }
        try {
            const r = await fetch(`${API_BASE}/contact`);
            if(!r.ok) throw 0;
            contactCache = await r.json();
            applyContactToDOM();
        } catch(e){ console.error('Fetch contact failed'); }
    }

    async function saveContactRemote(data){
        if(!API_BASE) return;
        try {
            const r = await fetch(`${API_BASE}/contact`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)});
            if(r.ok){ contactCache = await r.json(); applyContactToDOM(); }
        } catch(e){ console.error('Save contact failed'); }
    }

    function getContact(){ return contactCache; }

    function applyContactToDOM(){
        const info = getContact();
        const addrP = document.querySelector('.contact-item:nth-child(1) p');
        const phoneP = document.querySelector('.contact-item:nth-child(2) p');
        const emailP = document.querySelector('.contact-item:nth-child(3) p');
        const hoursP = document.querySelector('.contact-item:nth-child(4) p');
        if(addrP) addrP.innerHTML = (info.address||'').replace(/\n/g,'<br>');
        if(phoneP) phoneP.textContent = info.phone||'';
        if(emailP) emailP.textContent = info.email||'';
        if(hoursP) hoursP.innerHTML = (info.hours||'').replace(/\n/g,'<br>');
    }
    function populateContactForm(){
        const info = getContact();
        document.getElementById('editContactAddress').value = info.address||'';
        document.getElementById('editContactPhone').value = info.phone||'';
        document.getElementById('editContactEmail').value = info.email||'';
        document.getElementById('editContactHours').value = info.hours||'';
    }

    async function initContact(){
        await fetchContact();
        populateContactForm();
    }

    contactEditForm && contactEditForm.addEventListener('submit', async e=>{
        e.preventDefault();
        const info={
            address: document.getElementById('editContactAddress').value.trim(),
            phone: document.getElementById('editContactPhone').value.trim(),
            email: document.getElementById('editContactEmail').value.trim(),
            hours: document.getElementById('editContactHours').value.trim()
        };
        await saveContactRemote(info);
        if(contactSaveNotice){
            contactSaveNotice.textContent='Saved '+new Date().toLocaleTimeString();
            contactSaveNotice.style.color='#059669';
            setTimeout(()=>{contactSaveNotice.style.color='#64748b';},2000);
        }
    });

    resetContactBtn && resetContactBtn.addEventListener('click', async ()=>{
        if(!confirm('Clear contact info from database?')) return;
        await saveContactRemote({ address:'', phone:'', email:'', hours:'' });
        populateContactForm();
        if(contactSaveNotice){
            contactSaveNotice.textContent='Cleared';
            contactSaveNotice.style.color='#dc2626';
            setTimeout(()=>{contactSaveNotice.style.color='#64748b';},2000);
        }
    });

    initContact();
    if(trackingList) renderList();
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
