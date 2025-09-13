 /*******************************
     * Sample Data (in-memory)
     *******************************/
    const sampleAlumni = [
  {
    id: 1,
    name: "Asha Verma",
    batch: 2014,
    dept: "Computer Science",
    company: "TCS",
    location: "Bengaluru",
    skills: ["Java", "ML"],
    active: true,
    photo: "https://randomuser.me/api/portraits/women/1.jpg"
  },
  {
    id: 2,
    name: "Hardik Gautam",
    batch: 2018,
    dept: "Electronics",
    company: "Wipro",
    location: "Delhi",
    skills: ["Embedded", "C++"],
    active: true,
    photo: "https://randomuser.me/api/portraits/men/2.jpg"
  },
  {
    id: 3,
    name: "Sarah Kapoor",
    batch: 2012,
    dept: "Computer Science",
    company: "Google",
    location: "Hyderabad",
    skills: ["Data Science", "Python"],
    active: false,
    photo: "https://randomuser.me/api/portraits/women/3.jpg"
  },
  {
    id: 4,
    name: "Ankit Mehra",
    batch: 2020,
    dept: "Mechanical",
    company: "L&T",
    location: "Mumbai",
    skills: ["CAD"],
    active: true,
    photo: "https://randomuser.me/api/portraits/men/4.jpg"
  },

     ];

    const sampleEvents = [
      {id:1,date:"2025-09-25",title:"Alumni Meet 2025",venue:"Main Auditorium",rsvps:120},
      {id:2,date:"2025-10-15",title:"Industry Webinar: Cloud",venue:"Online",rsvps:210},
      {id:3,date:"2025-11-12",title:"Hackathon Finals",venue:"Tech Park",rsvps:85},
      {id:4,date:"2025-12-05",title:"Fundraising Gala",venue:"Banquet Hall",rsvps:60}
    ];

    const sampleJobs = [
      {id:1,title:"Software Engineer",company:"Infosys",type:"Full-time",location:"Pune"},
      {id:2,title:"Data Analyst Intern",company:"StartUpX",type:"Internship",location:"Remote"},
      {id:3,title:"Embedded Engineer",company:"Wipro",type:"Full-time",location:"Delhi"},
      {id:4,title:"Project Manager",company:"L&T",type:"Contract",location:"Mumbai"}
    ];

    const sampleMentors = [
      {id:1,name:"Asha Verma",expertise:["ML","AI"],batch:2014,company:"TCS"},
      {id:2,name:"Sarah Kapoor",expertise:["Data Science","Python"],batch:2012,company:"Google"},
      {id:3,name:"Vikram Singh",expertise:["DevOps","Cloud"],batch:2015,company:"Amazon"},
      {id:4,name:"Nidhi Rao",expertise:["Frontend","React"],batch:2019,company:"Infosys"}
    ];

    let donors = [
      {id:1,name:"R.Kumar",amount:1000,date:"2025-06-05"}
    ];

    /*******************************
     * Utility Functions
     *******************************/
    function $(s){return document.querySelector(s)}
    function $all(s){return Array.from(document.querySelectorAll(s))}

    // Navigation
    $all('.nav-link').forEach(a=>{
      a.addEventListener('click', (e)=>{
        $all('.nav-link').forEach(n=>n.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const target = e.currentTarget.dataset.target;
        switchSection(target);
      })
    });

    // Toggle sidebar visibility on small screens
    $('#toggleSidebar').addEventListener('click', ()=>{
      const sb = document.querySelector('.sidebar');
      sb.style.display = sb.style.display === 'none' ? 'flex' : 'none';
    });

    function switchSection(id){
      $all('#panel section').forEach(s=>{
        s.style.display = s.id === id ? '' : 'none';
      });
      // clear global search
      $('#globalSearch').value='';
      // trigger section-specific renders
      if(id==='dashboard'){renderDashboard()}
      if(id==='alumni'){renderAlumni()}
      if(id==='events'){renderEvents()}
      if(id==='jobs'){renderJobs()}
      if(id==='mentorship'){renderMentors()}
      if(id==='donations'){renderDonations()}
      if(id==='analytics'){renderAnalytics()}
    }

    // Global search (search across some items)
    $('#globalSearch').addEventListener('input', (e)=>{
      const q = e.target.value.trim().toLowerCase();
      if(!q){ return; }
      // naive: search alumni names, events title, jobs title
      const aMatches = sampleAlumni.filter(x=>x.name.toLowerCase().includes(q) || (x.company||'').toLowerCase().includes(q));
      if(aMatches.length>0){ switchSection('alumni'); $('#alumniSearch').value=q; renderAlumni(); return; }
      const eMatches = sampleEvents.filter(x=>x.title.toLowerCase().includes(q));
      if(eMatches.length>0){ switchSection('events'); $('#eventSearch').value=q; renderEvents(); return; }
      const jMatches = sampleJobs.filter(x=>x.title.toLowerCase().includes(q) || x.company.toLowerCase().includes(q));
      if(jMatches.length>0){ switchSection('jobs'); $('#jobSearch').value=q; renderJobs(); return; }
    });

    /*******************************
     * DASHBOARD
     *******************************/
    function renderDashboard(){
      $('#kpi-total').textContent = sampleAlumni.length;
      $('#kpi-active').textContent = sampleAlumni.filter(a=>a.active).length;
      const totalDon = donors.reduce((s,d)=>s+d.amount,0);
      $('#kpi-donations').textContent = '$' + totalDon.toLocaleString();
      $('#raisedAmount').textContent = '$' + totalDon.toLocaleString();
      const pct = Math.min(100, Math.round((totalDon/100000)*100));
      $('#donationProgress').style.width = pct + '%';
      $('#recentActivity').innerHTML = [
        "New job posted: Software Engineer at Infosys",
        "Donation received: Anjali ($2,500)",
        "Event added: Alumni Meet 2025"
      ].map(t=>`<li style="padding:8px 0;border-bottom:1px solid #f1f5f9">${t}</li>`).join('');
      // upcoming events small list
      $('#upcomingEvents').innerHTML = sampleEvents.slice(0,4).map(ev=>`<div style="padding:8px 0;border-bottom:1px dashed #eef3f8"><strong>${ev.title}</strong><div class="small">${ev.date} • ${ev.venue}</div></div>`).join('');
      // chart
      const ctx = $('#dashEventChart').getContext('2d');
      if(window._dashChart) window._dashChart.destroy();
      const labels = sampleEvents.slice(-6).map(e=>e.title);
      const data = sampleEvents.slice(-6).map(e=>e.rsvps);
      window._dashChart = new Chart(ctx, {
        type:'line',
        data:{labels, datasets:[{label:'RSVP', data, tension:0.3, fill:true}]},
        options:{responsive:true, maintainAspectRatio:false}
      });
    }

    /*******************************
     * ALUMNI
     *******************************/
    function populateAlumniFilters(){
      const batches = Array.from(new Set(sampleAlumni.map(a=>a.batch))).sort((a,b)=>b-a);
      const depts = Array.from(new Set(sampleAlumni.map(a=>a.dept)));
      const locs = Array.from(new Set(sampleAlumni.map(a=>a.location)));
      const batchSel = $('#filterBatch'); batchSel.innerHTML = '<option value="">All Batches</option>'+batches.map(b=>`<option value="${b}">${b}</option>`).join('');
      const deptSel = $('#filterDept'); deptSel.innerHTML = '<option value="">All Departments</option>'+depts.map(d=>`<option>${d}</option>`).join('');
      const locSel = $('#filterLocation'); locSel.innerHTML = '<option value="">All Locations</option>'+locs.map(l=>`<option>${l}</option>`).join('');
    }

    function renderAlumni() {
  populateAlumniFilters();
  const tbody = $('#alumniTable tbody');
  const q = $('#alumniSearch').value.trim().toLowerCase();
  const fb = $('#filterBatch').value;
  const fd = $('#filterDept').value;
  const fl = $('#filterLocation').value;

  let list = sampleAlumni.slice();

  if (q) list = list.filter(a =>
    [a.name, a.company, a.dept, (a.skills || []).join(' ')].join(' ').toLowerCase().includes(q)
  );
  if (fb) list = list.filter(a => String(a.batch) === String(fb));
  if (fd) list = list.filter(a => a.dept === fd);
  if (fl) list = list.filter(a => a.location === fl);

  $('#alumniCount').textContent = list.length;

  tbody.innerHTML = list.map(a => `
    <tr>
      <td>
        <img src="${a.photo || 'default-avatar.jpg'}" alt="${a.name}" 
             style="width:36px;height:36px;border-radius:50%;object-fit:cover;" />
      </td>
      <td>${a.name}</td>
      <td>${a.batch}</td>
      <td>${a.dept}</td>
      <td>${a.company || '-'}</td>
      <td>${a.location}</td>
      <td class="table-actions">
        <button class="secondary" onclick="viewAlumni(${a.id})">
          <i class="fa-solid fa-eye"></i>
        </button>
        <button onclick="messageAlumni(${a.id})">
          <i class="fa-solid fa-envelope"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

    $('#alumniSearch').addEventListener('input', renderAlumni);
    $('#filterBatch').addEventListener('change', renderAlumni);
    $('#filterDept').addEventListener('change', renderAlumni);
    $('#filterLocation').addEventListener('change', renderAlumni);
    $('#clearAlumniFilters').addEventListener('click', ()=>{
      $('#alumniSearch').value=''; $('#filterBatch').value=''; $('#filterDept').value=''; $('#filterLocation').value='';
      renderAlumni();
    });

    function viewAlumni(id){
      const a = sampleAlumni.find(x=>x.id===id);
      openModal(`<h3>${a.name}</h3>
        <td>
        <img src="${a.photo || 'default-avatar.jpg'}" alt="${a.name}" 
        style="width:50px;height:50px;border-radius:50%;object-fit:cover;" />
     </td>
        <p class="small">Batch: ${a.batch} • Dept: ${a.dept} • ${a.location}</p>
        <p>Company: ${a.company || '—'}</p>
        <p>Skills: ${(a.skills||[]).join(', ')}</p>
        <div style="margin-top:12px;text-align:right"><button onclick="closeModal()" class="secondary">Close</button></div>`);
    }
    function messageAlumni(id){
      const a = sampleAlumni.find(x=>x.id===id);
      openModal(`<h3>Message ${a.name}</h3>
        <textarea id="msgText" class="input" style="width:100%;height:100px"></textarea>
        <div style="margin-top:10px;text-align:right"><button onclick="sendMessage(${id})">Send</button></div>`);
    }
    function sendMessage(id){
      const txt = $('#msgText').value;
      closeModal();
      alert('Message sent (simulated).');
    }
    // Export CSV
    $('#exportCsvBtn').addEventListener('click', ()=>{
      const rows = [['Name','Batch','Dept','Company','Location','Skills']];
      sampleAlumni.forEach(a=>rows.push([a.name,a.batch,a.dept,a.company,a.location,(a.skills||[]).join('|')]));
      const csv = rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
      const blob = new Blob([csv],{type:'text/csv'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href=url; a.download='alumni_export.csv'; a.click(); URL.revokeObjectURL(url);
    });

    /*******************************
     * EVENTS
     *******************************/
    function populateEventMonths(){
      const months = Array.from(new Set(sampleEvents.map(e=> (new Date(e.date)).toLocaleString('default',{month:'long',year:'numeric'}) )));
      $('#eventFilterMonth').innerHTML = '<option value="">All months</option>' + months.map(m=>`<option>${m}</option>`).join('');
    }

    function renderEvents(){
      populateEventMonths();
      const tbody = $('#eventTable tbody');
      const q = $('#eventSearch').value.trim().toLowerCase();
      const filt = $('#eventFilterMonth').value;
      let list = sampleEvents.slice().sort((a,b)=> new Date(a.date)-new Date(b.date));
      if(q) list = list.filter(e=>e.title.toLowerCase().includes(q));
      if(filt) list = list.filter(e=> (new Date(e.date)).toLocaleString('default',{month:'long',year:'numeric'}) === filt);
      $('#eventCount').textContent = list.length;
      tbody.innerHTML = list.map(ev=>`<tr>
        <td>${ev.date}</td>
        <td>${ev.title}</td>
        <td>${ev.venue}</td>
        <td>${ev.rsvps}</td>
        <td>
          <button class="secondary" onclick="viewEvent(${ev.id})">View</button>
          <button onclick="rsvpEvent(${ev.id})">RSVP</button>
        </td>
      </tr>`).join('');
    }
    $('#eventSearch').addEventListener('input', renderEvents);
    $('#eventFilterMonth').addEventListener('change', renderEvents);

    $('#addEventBtn').addEventListener('click', ()=>{
      openModal(`<h3>Add Event</h3>
        <input id="evtTitle" class="input mb8" placeholder="Title" />
        <input id="evtDate" class="input mb8" type="date" />
        <input id="evtVenue" class="input mb8" placeholder="Venue" />
        <div style="text-align:right"><button onclick="saveEvent()">Save</button> <button onclick="closeModal()" class="secondary">Cancel</button></div>`);
    });

    function saveEvent(){
      const t = $('#evtTitle').value.trim(), d = $('#evtDate').value, v = $('#evtVenue').value.trim();
      if(!t||!d){ alert('Please enter title and date'); return; }
      sampleEvents.push({id:Date.now(), title:t, date:d, venue:v, rsvps:0});
      closeModal(); renderEvents(); renderDashboard();
    }
    function viewEvent(id){
      const e = sampleEvents.find(x=>x.id===id);
      openModal(`<h3>${e.title}</h3><p class="small">${e.date} • ${e.venue}</p><p>RSVPs: ${e.rsvps}</p><div style="text-align:right"><button onclick="closeModal()" class="secondary">Close</button></div>`);
    }
    function rsvpEvent(id){
      const e = sampleEvents.find(x=>x.id===id);
      e.rsvps = (e.rsvps || 0) + 1;
      renderEvents(); renderDashboard();
      alert('You have RSVPed (simulated).');
    }

    /*******************************
     * JOBS
     *******************************/
    function populateJobLocation(){
      const locs = Array.from(new Set(sampleJobs.map(j=>j.location)));
      $('#jobFilterLocation').innerHTML = '<option value="">All Locations</option>'+locs.map(l=>`<option>${l}</option>`).join('');
    }

    function renderJobs(){
      populateJobLocation();
      const q = $('#jobSearch').value.trim().toLowerCase();
      const type = $('#jobFilterType').value;
      const loc = $('#jobFilterLocation').value;
      let list = sampleJobs.slice();
      if(q) list = list.filter(j=> (j.title+' '+j.company).toLowerCase().includes(q));
      if(type) list = list.filter(j=>j.type===type);
      if(loc) list = list.filter(j=>j.location===loc);
      $('#jobCount').textContent = list.length;
      $('#jobsTable tbody').innerHTML = list.map(j=>`<tr>
        <td>${j.title}</td><td>${j.company}</td><td>${j.type}</td><td>${j.location}</td>
        <td><button onclick='viewJob(${j.id})' class="secondary">View</button><button onclick='applyJob(${j.id})'>Apply</button></td>
      </tr>`).join('');
    }
    $('#jobSearch').addEventListener('input', renderJobs);
    $('#jobFilterType').addEventListener('change', renderJobs);
    $('#jobFilterLocation').addEventListener('change', renderJobs);

    $('#postJobBtn').addEventListener('click', ()=>{
      openModal(`<h3>Post Job</h3>
        <input id="jobTitle" class="input mb8" placeholder="Job Title" /><input id="jobCompany" class="input mb8" placeholder="Company" />
        <select id="jobType" class="input mb8"><option>Full-time</option><option>Internship</option><option>Contract</option></select>
        <input id="jobLocation" class="input mb8" placeholder="Location" />
        <div style="text-align:right"><button onclick="saveJob()">Post</button> <button onclick="closeModal()" class="secondary">Cancel</button></div>`);
    });

    function saveJob(){
      const t=$('#jobTitle').value.trim(), c=$('#jobCompany').value.trim(), ty=$('#jobType').value, loc=$('#jobLocation').value.trim();
      if(!t||!c){ alert('Enter title and company'); return; }
      sampleJobs.push({id:Date.now(), title:t, company:c, type:ty, location:loc});
      closeModal(); renderJobs();
    }

    function viewJob(id){
      const j = sampleJobs.find(x=>x.id===id);
      openModal(`<h3>${j.title}</h3><p class="small">${j.company} • ${j.location} • ${j.type}</p><div style="margin-top:10px;text-align:right"><button onclick="closeModal()" class="secondary">Close</button></div>`);
    }
    function applyJob(id){
      const j = sampleJobs.find(x=>x.id===id);
      openModal(`<h3>Apply: ${j.title}</h3><input id="appName" class="input mb8" placeholder="Your name" /><input id="appEmail" class="input mb8" placeholder="Email" /><textarea id="appNote" class="input" style="height:100px" placeholder="Cover note (optional)"></textarea><div style="text-align:right"><button onclick="submitApplication(${id})">Submit</button></div>`);
    }
    function submitApplication(id){
      const name = $('#appName').value.trim(), email = $('#appEmail').value.trim();
      if(!name||!email){ alert('Please provide name & email'); return; }
      closeModal();
      alert('Application submitted (simulated).');
    }

    /*******************************
     * MENTORSHIP
     *******************************/
    function populateMentorFilters(){
      const depts = Array.from(new Set(sampleAlumni.map(a=>a.dept)));
      $('#mentorFilterDept').innerHTML = '<option value="">All Departments</option>' + depts.map(d=>`<option>${d}</option>`).join('');
    }
    function renderMentors(){
      populateMentorFilters();
      const q = $('#mentorSearch').value.trim().toLowerCase();
      const fd = $('#mentorFilterDept').value;
      let list = sampleMentors.slice();
      if(q) list = list.filter(m=> (m.name+' '+(m.expertise||[]).join(' ')).toLowerCase().includes(q));
      if(fd) list = list.filter(m=> sampleAlumni.find(a=>a.name===m.name && a.dept===fd));
      $('#mentorTable tbody').innerHTML = list.map(m=>`<tr>
        <td>${m.name}</td><td>${m.expertise.join(', ')}</td><td>${m.batch}</td><td>${m.company}</td>
        <td><button onclick='requestMentor(${m.id})'>Request</button></td>
      </tr>`).join('');
    }
    $('#mentorSearch').addEventListener('input', renderMentors);
    $('#mentorFilterDept').addEventListener('change', renderMentors);
    $('#openMatchBtn').addEventListener('click', ()=>{
      openModal('<h3>Auto-match sample</h3><p class="small">Matched student "Rahul" with mentor Vikram Singh (DevOps).</p><div style="text-align:right"><button onclick="closeModal()" class="secondary">Close</button></div>');
    });

    function requestMentor(id){
      const m = sampleMentors.find(x=>x.id===id);
      openModal(`<h3>Request Mentor: ${m.name}</h3>
        <p class="small">Expertise: ${m.expertise.join(', ')}</p>
        <input id="menteeName" class="input mb8" placeholder="Your name" />
        <textarea id="menteeMsg" class="input" style="height:100px" placeholder="Message to mentor"></textarea>
        <div style="text-align:right"><button onclick="sendMentorRequest(${id})">Send Request</button></div>`);
    }
    function sendMentorRequest(id){
      const nm = $('#menteeName').value.trim();
      if(!nm){ alert('Enter your name'); return; }
      closeModal();
      alert('Request sent to mentor (simulated).');
    }

    /*******************************
     * DONATIONS
     *******************************/
    function renderDonations(){
      const total = donors.reduce((s,d)=>s+d.amount,0);
      $('#campaignRaised').textContent = '$' + total.toLocaleString();
      const pct = Math.min(100, Math.round((total/100000)*100));
      $('#campaignProgress').style.width = pct + '%';
      $('#donorList').innerHTML = donors.slice().reverse().map(d=>`<li style="padding:8px 0;border-bottom:1px solid #f1f5f9">${d.name} — $${d.amount.toLocaleString()} <div class="small">${d.date}</div></li>`).join('');
      // reflect in dashboard
      $('#kpi-donations').textContent = '$' + total.toLocaleString();
      $('#raisedAmount').textContent = '$' + total.toLocaleString();
      $('#donationProgress').style.width = pct + '%';
    }
    $('#donateBtn').addEventListener('click', ()=>{
      const name = $('#donorName').value.trim() || 'Anonymous';
      const amt = parseFloat($('#donorAmount').value) || 0;
      if(amt <= 0){ alert('Enter amount'); return; }
      donors.push({id:Date.now(), name, amount:amt, date:new Date().toISOString().slice(0,10)});
      $('#donorName').value=''; $('#donorAmount').value='';
      renderDonations(); renderDashboard(); renderAnalytics();
      alert('Thank you for donating! (simulated)');
    });

    /*******************************
     * ANALYTICS
     *******************************/
    function renderAnalytics(){
      // dept distribution
      const deptCounts = sampleAlumni.reduce((m,a)=>{ m[a.dept]=(m[a.dept]||0)+1; return m; }, {});
      const deptLabels = Object.keys(deptCounts);
      const deptData = Object.values(deptCounts);

      const ctxDept = $('#deptChart').getContext('2d');
      if(window._deptChart) window._deptChart.destroy();
      window._deptChart = new Chart(ctxDept, { type:'doughnut', data:{labels:deptLabels, datasets:[{data:deptData}]}, options:{responsive:true} });

      // donations by month (fake aggregated from donors)
      const monthly = {};
      donors.forEach(d=>{
        const key = new Date(d.date).toLocaleString('default',{month:'short','year':'numeric'});
        monthly[key] = (monthly[key]||0)+d.amount;
      });
      const monthLabels = Object.keys(monthly).slice(-6);
      const monthData = monthLabels.map(k=>monthly[k]);

      const ctxDon = $('#donationChart').getContext('2d');
      if(window._donChart) window._donChart.destroy();
      window._donChart = new Chart(ctxDon, { type:'bar', data:{labels:monthLabels, datasets:[{label:'Donations', data:monthData}]}, options:{responsive:true} });

      // event participation
      const evLabels = sampleEvents.map(e=>e.title);
      const evData = sampleEvents.map(e=>e.rsvps);
      const ctxPart = $('#participationChart').getContext('2d');
      if(window._partChart) window._partChart.destroy();
      window._partChart = new Chart(ctxPart, { type:'bar', data:{labels:evLabels, datasets:[{label:'RSVPs', data:evData}]}, options:{responsive:true, indexAxis:'y'} });
    }

    /*******************************
     * Modal helpers
     *******************************/
    function openModal(html){
      $('#modalContent').innerHTML = html;
      const modal = $('#modal'); modal.classList.add('open'); modal.setAttribute('aria-hidden','false');
    }
    function closeModal(){
      const modal = $('#modal'); modal.classList.remove('open'); modal.setAttribute('aria-hidden','true');
    }
    $('#modal').addEventListener('click', (e)=>{ if(e.target===$('#modal')) closeModal(); });

    /*******************************
     * Initial render
     *******************************/
    function init(){
      renderDashboard();
      renderAlumni();
      renderEvents();
      renderJobs();
      renderMentors();
      renderDonations();
      renderAnalytics();

      // wire simple event count for UI
      $all('.nav-link').forEach(n=>n.addEventListener('click',()=> window.scrollTo({top:0,behavior:'smooth'})));

      // prefill global search sample
      $('#globalSearch').addEventListener('keypress', (e)=>{ if(e.key==='Enter'){ $('#globalSearch').dispatchEvent(new Event('input')); }});
    }
    init();

    // expose some functions to window for inline onclick usage
    window.viewAlumni = viewAlumni;
    window.messageAlumni = messageAlumni;
    window.viewEvent = viewEvent;
    window.rsvpEvent = rsvpEvent;
    window.viewJob = viewJob;
    window.applyJob = applyJob;
    window.requestMentor = requestMentor;
    window.saveEvent = saveEvent;
    window.saveJob = saveJob;

    window.closeModal = closeModal;

