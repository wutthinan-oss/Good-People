const $=s=>document.querySelector(s);
let TOKEN=null,MS=[],REPS=[];
try{TOKEN=sessionStorage.getItem('cadet_ttok')}catch(e){}
if(window.CADET_DEMO)$('#demoBar').hidden=false;
const show=(id,t)=>{const e=$(id);e.textContent=t;e.style.display='block'};
const hide=id=>{$(id).style.display='none'};
async function call(a,d){const r=await api(a,Object.assign({token:TOKEN},d||{}));if(r&&r.auth)logout(true);return r}
function logout(expired){TOKEN=null;try{sessionStorage.removeItem('cadet_ttok')}catch(e){}$('#vApp').hidden=true;$('#vLogin').hidden=false;if(expired===true)show('#eLogin','หมดเวลา กรุณาเข้าสู่ระบบใหม่')}
function enter(){$('#vLogin').hidden=true;$('#vApp').hidden=false;init()}
$('#fLogin').addEventListener('submit',async e=>{e.preventDefault();hide('#eLogin');const b=$('#bLogin');b.disabled=true;b.textContent='กำลังตรวจสอบ...';
  const r=await api('tlogin',{key:$('#key').value});b.disabled=false;b.textContent='เข้าสู่ระบบ';
  if(!r.ok)return show('#eLogin',r.error||'เข้าสู่ระบบไม่สำเร็จ');TOKEN=r.token;try{sessionStorage.setItem('cadet_ttok',TOKEN)}catch(x){}$('#key').value='';enter()});
document.querySelectorAll('#tabs .tab').forEach(t=>t.onclick=()=>{document.querySelectorAll('#tabs .tab').forEach(x=>x.classList.toggle('on',x===t));
  ['stats','photos','reports','scores'].forEach(k=>$('#t'+k[0].toUpperCase()+k.slice(1)).hidden=k!==t.dataset.t);
  if(t.dataset.t==='stats')loadStats();if(t.dataset.t==='reports')loadReports();if(t.dataset.t==='photos')loadPhotos()});
async function init(){const r=await call('missions');if(r.ok){MS=r.missions;$('#fM').innerHTML='<option value="">ทั้งหมด</option>'+MS.map(m=>`<option value="${esc(m.id)}">${esc(m.title)}</option>`).join('')}loadStats();badge()}
const nm=id=>(MS.find(m=>m.id===id)||{}).title||id;

async function loadStats(){const r=await call('stats');if(!r.ok){$('#sBox').textContent=r.error;return}const s=r.stats;
  const ph=s.scoresByPhase||{};
  $('#sBox').innerHTML=`<div class="sgrid"><div><b>${s.students}</b><span>นักศึกษาในระบบ</span></div><div><b>${s.reports}</b><span>รายงานที่ส่ง</span></div><div><b>${s.submitters}</b><span>ผู้ส่งรายงาน</span></div><div><b>${(s.review||{})['รอตรวจ']||0}</b><span>รอตรวจ</span></div><div><b>⭐ ${s.stars||0}</b><span>ดาวที่มอบแล้ว</span></div><div><b>${s.ratingAvg===null||s.ratingAvg===undefined?'-':s.ratingAvg}</b><span>ดาวพึงพอใจเฉลี่ย (เต็ม 5)</span></div></div>
   ${(s.topStars||[]).length?`<h3>ดาวเด่น (สูงสุด 10 คน)</h3><table class="tt"><tr><th>ชื่อ</th><th>เลขประจำตัว</th><th>ดาว</th></tr>${s.topStars.map(x=>`<tr><td>${esc(x.name)}</td><td>${esc(x.sid)}</td><td>⭐ ${x.stars}</td></tr>`).join('')}</table>`:''}
   <h3>สถานะที่รายงาน</h3><p>${Object.entries(s.byStatus||{}).map(([k,v])=>`<span class="badge2">${esc(k)} ${v}</span>`).join(' ')||'ยังไม่มีข้อมูล'}</p>
   <h3>คะแนนพฤติกรรมเฉลี่ยตามช่วง (ระดับ 1–4)</h3>
   <table class="tt"><tr><th>ช่วง</th><th>จำนวนคน</th><th>ความรับผิดชอบ</th><th>ซื่อสัตย์ในการรายงาน</th><th>จิตสาธารณะ</th></tr>
   ${['ก่อน','ระหว่าง','หลัง'].map(k=>ph[k]?`<tr><td>${k}</td><td>${ph[k].n}</td><td>${ph[k].b1}</td><td>${ph[k].b2}</td><td>${ph[k].b3}</td></tr>`:`<tr><td>${k}</td><td colspan="4" class="small">ยังไม่มีข้อมูล</td></tr>`).join('')}</table>
   <p class="small">ตัวเลขคำนวณจากข้อมูลที่บันทึกจริงในระบบเท่านั้น</p>`}

async function loadReports(){$('#rList').innerHTML='<div class="pcard">กำลังโหลด...</div>';const r=await call('reports',{missionId:$('#fM').value,reviewStatus:$('#fR').value,photoStatus:$('#fP').value});
  if(!r.ok){$('#rList').innerHTML=`<div class="pcard">${esc(r.error)}</div>`;return}REPS=r.reports;
  $('#rList').innerHTML=REPS.map((x,i)=>`<div class="rep"><div class="h"><b>${esc(x.name)}</b><span class="small">${x.year?'นศท. ปี '+esc(x.year)+' เลขที่ '+esc(x.no):esc(x.sid)}</span>${x.mode==='เดี่ยว'?'<span class="badge2" title="นักศึกษาทำภารกิจนี้คนเดียว">🧍 ทำคนเดียว</span>':x.mode==='หมู่'?'<span class="badge2" title="ทำเป็นหมู่">👥 ทำเป็นหมู่</span>':''}${x.source==='name'?'<span class="badge2" title="ชื่อตรงกับรายชื่อ แต่ยังไม่ยืนยันตัวตนด้วย PIN">ส่งด้วยชื่อ (ตรงรายชื่อ)</span>':x.source==='open'?'<span class="badge2" title="ชื่อนี้ไม่อยู่ในรายชื่อในชีต Students">ส่งด้วยชื่อ (ไม่อยู่ในรายชื่อ)</span>':''}<span class="stg">${esc(nm(x.missionId))} · ขั้น ${esc(x.stage)}</span>
   <span class="badge2 ${x.status==='ทำครบตามแผน'?'g':x.status==='ยังไม่ได้ทำ'?'r':''}">${esc(x.status)}</span><span class="badge2 ${x.reviewStatus==='ผ่าน'?'g':x.reviewStatus==='ขอแก้ไข'?'r':''}">${esc(x.reviewStatus)}</span><span class="small">${esc(fmtD(x.ts))}</span></div>
   ${x.role?`<p><b>บทบาท:</b> ${esc(x.role)}</p>`:''}${x.reason?`<p><b>เหตุผล:</b> ${esc(x.reason)}</p>`:''}${x.q1?`<p><b>1)</b> ${esc(x.q1)}</p><p><b>2)</b> ${esc(x.q2)}</p><p><b>3)</b> ${esc(x.q3)}</p>`:''}${x.evidence?`<p><b>หลักฐาน:</b> ${esc(x.evidence)}</p>`:''}
   ${x.rating?`<p><b>ความพึงพอใจต่อภารกิจ:</b> <span style="color:#e0a800">${'★'.repeat(x.rating)}</span>${'☆'.repeat(5-x.rating)}${x.comment?' · '+esc(x.comment):''}</p>`:''}
   ${x.photos?`<div class="thumbs">${String(x.photos).split(',').map(id=>`<button type="button" class="thumb" data-id="${esc(id)}">📷 ดูภาพ</button>`).join('')}</div>`:''}
   ${x.photos?`<div class="apv ${x.publicOk?'on':''}"><b>${x.publicOk?'✅ ภาพนี้แสดงบนหน้าเว็บแล้ว':'⏳ ภาพรออนุมัติ (ยังไม่แสดงบนหน้าเว็บ)'}</b>
     <input class="in" id="cap${i}" maxlength="160" placeholder="คำบรรยายภาพ เช่น เก็บขยะบริเวณสนาม (ไม่ต้องใส่ชื่อนักเรียน)" value="${esc(x.caption||'')}">
     <button type="button" class="btn ${x.publicOk?'btn-ghost':'btn-primary'}" style="padding:7px 18px" onclick="approve(${i},${x.publicOk?0:1})">${x.publicOk?'ถอดภาพออกจากหน้าเว็บ':'อนุมัติให้แสดงภาพ'}</button> <span class="small" id="apm${i}"></span>
     <p class="small" style="margin:6px 0 0">ตรวจก่อนอนุมัติ: ไม่มีข้อมูลส่วนตัว และผู้ปรากฏในภาพได้รับความยินยอมแล้ว</p></div>`:''}
   ${x.star?`<div class="starnote">⭐ มอบดาวแล้ว${x.starNote?': '+esc(x.starNote):''}</div>`:''}
   <details style="margin-top:8px"><summary style="cursor:pointer;font-weight:600">ตรวจ / ให้ข้อเสนอแนะ</summary>
    <div class="row2"><div><label class="f">ผลการตรวจ</label><select class="in" id="rs${i}"><option ${x.reviewStatus==='ผ่าน'?'selected':''}>ผ่าน</option><option ${x.reviewStatus==='ขอแก้ไข'?'selected':''}>ขอแก้ไข</option></select></div>
    <div><label class="f">ความรับผิดชอบ (1–4)</label><select class="in" id="rb1${i}">${[4,3,2,1].map(n=>`<option ${x.b1==n?'selected':''}>${n}</option>`).join('')}</select></div>
    <div><label class="f">ซื่อสัตย์ในการรายงาน (1–4)</label><select class="in" id="rb2${i}">${[4,3,2,1].map(n=>`<option ${x.b2==n?'selected':''}>${n}</option>`).join('')}</select></div></div>
    <div class="row2"><div><label class="f">จิตสาธารณะ (1–4)</label><select class="in" id="rb3${i}">${[4,3,2,1].map(n=>`<option ${x.b3==n?'selected':''}>${n}</option>`).join('')}</select></div></div>
    <label class="starchk"><input type="checkbox" id="rst${i}" ${x.star?'checked':''}> ⭐ มอบดาว (ทำได้ดี โดดเด่น)</label>
    <input class="in" id="rsn${i}" maxlength="200" placeholder="เหตุผลที่มอบดาว เช่น ช่วยเพื่อนจนงานเสร็จ" value="${esc(x.starNote||'')}">
    <label class="f">ข้อเสนอแนะ</label><textarea class="in" id="rf${i}" maxlength="800">${esc(x.feedback)}</textarea>
    <p style="margin:10px 0 0"><button class="btn btn-primary" style="padding:8px 20px" onclick="saveReview(${i})">บันทึกผลตรวจ</button> <span class="small" id="rm${i}"></span></p></details></div>`).join('')||'<div class="pcard">ยังไม่มีรายงาน</div>'}
async function approve(i,on){const x=REPS[i];const r=await call('approvePhotos',{id:x.id,approve:!!on,caption:$('#cap'+i).value});
  if(!r.ok){$('#apm'+i).textContent=r.error||'ไม่สำเร็จ';return}await loadReports()}
async function saveReview(i){const x=REPS[i],g=id=>$('#'+id+i).value;const r=await call('review',{id:x.id,reviewStatus:g('rs'),feedback:g('rf'),b1:g('rb1'),b2:g('rb2'),b3:g('rb3'),star:$('#rst'+i).checked?1:0,starNote:$('#rsn'+i).value});
  $('#rm'+i).textContent=r.ok?'บันทึกแล้ว':(r.error||'บันทึกไม่สำเร็จ')}
function exportCsv(){const h=['id','ts','sid','name','missionId','stage','role','status','reason','q1','q2','q3','evidence','reviewStatus','feedback','b1','b2','b3','star','starNote','rating','comment','mode','beneficiaries','photos','publicOk','caption','source','year','no'];
  const q=v=>'"'+String(v??'').replace(/"/g,'""')+'"';const csv='﻿'+[h.join(',')].concat(REPS.map(r=>h.map(k=>q(r[k])).join(','))).join('\n');
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.download='cadet-reports.csv';a.click()}
$('#fScore').addEventListener('submit',async e=>{e.preventDefault();hide('#eSc');hide('#oSc');
  const r=await call('saveScore',{sid:$('#scSid').value.trim(),phase:$('#scPh').value,assessor:$('#scAs').value,b1:$('#b1').value,b2:$('#b2').value,b3:$('#b3').value});
  if(!r.ok)return show('#eSc',r.error||'บันทึกไม่สำเร็จ');show('#oSc','บันทึกคะแนนแล้ว');$('#scSid').value='';$('#scSid').focus()});
if(TOKEN)enter();

document.addEventListener('click',async e=>{const b=e.target.closest('.thumb');if(!b||b.dataset.done)return;b.textContent='กำลังโหลด...';
  const r=await call('photo',{fileId:b.dataset.id});if(!r.ok){b.textContent=r.error||'โหลดไม่ได้';return}
  b.dataset.done=1;b.outerHTML=`<img class="pimg" src="${r.data}" alt="ภาพหลักฐาน">`});

/* ===== อนุมัติภาพ ===== */
let PHS='pending',PL=[];
async function badge(){const r=await call('stats');if(r.ok){const n=r.stats.photoPending||0;const b=$('#pBadge');b.hidden=!n;b.textContent=n}}
document.querySelectorAll('#phTabs .tab').forEach(b=>b.onclick=()=>{PHS=b.dataset.s;document.querySelectorAll('#phTabs .tab').forEach(x=>x.classList.toggle('on',x===b));loadPhotos()});
async function loadPhotos(){const g=$('#phGrid');g.innerHTML='<div class="pcard">กำลังโหลด...</div>';$('#phMsg').textContent='';
  const r=await call('reports',{photoStatus:PHS});if(!r.ok){g.innerHTML=`<div class="pcard">${esc(r.error)}</div>`;return}
  PL=r.reports.filter(x=>x.photos);$('#phBar').style.display=PHS==='pending'&&PL.length?'flex':'none';$('#phAll').checked=false;
  if(!PL.length){g.innerHTML=`<div class="pcard small">${PHS==='pending'?'ไม่มีภาพรออนุมัติ':PHS==='approved'?'ยังไม่มีภาพที่อนุมัติ':'ไม่มีภาพที่ไม่อนุมัติ'}</div>`;badge();return}
  g.innerHTML=PL.map((x,i)=>`<div class="phcard"><div class="phimgs" id="phi${i}">${String(x.photos).split(',').filter(Boolean).map(id=>`<span class="phload" data-id="${esc(id)}">กำลังโหลดภาพ...</span>`).join('')}</div>
    <div class="phmeta"><b>${esc(nm(x.missionId))}</b> · ขั้น ${esc(x.stage)} · ${esc(fmtD(x.ts))}<br><span class="small">${esc(x.name)} · ${x.year?'นศท. ปี '+esc(x.year)+' เลขที่ '+esc(x.no):esc(x.sid)}${x.source==='open'?' · ไม่อยู่ในรายชื่อ':''}</span></div>
    ${PHS==='pending'?`<label class="phsel"><input type="checkbox" class="phck" data-i="${i}"> เลือกอนุมัติ</label>`:''}
    <input class="in" id="pc${i}" maxlength="160" placeholder="คำบรรยายภาพ (ไม่ต้องใส่ชื่อนักเรียน)" value="${esc(x.caption||nm(x.missionId))}">
    <div class="phbtn">${PHS==='approved'?`<button class="btn btn-ghost" onclick="phAct(${i},'off')" type="button">ถอดภาพออก</button>`
      :`<button class="btn btn-primary" onclick="phAct(${i},'ok')" type="button">✅ อนุมัติ</button>${PHS==='pending'?`<button class="btn btn-ghost" onclick="phAct(${i},'no')" type="button">ไม่อนุมัติ</button>`:''}`}<span class="small" id="pm${i}"></span></div></div>`).join('');
  document.querySelectorAll('.phload').forEach(async el=>{const p=await call('photo',{fileId:el.dataset.id});
    el.outerHTML=p.ok?`<img class="phimg" src="${p.data}" alt="ภาพหลักฐาน">`:`<span class="small">โหลดภาพไม่ได้</span>`})}
async function phAct(i,act){const x=PL[i];const o={id:x.id,caption:$('#pc'+i).value};
  if(act==='ok')o.approve=true;else if(act==='no')o.reject=true;
  const r=await call('approvePhotos',o);if(!r.ok){$('#pm'+i).textContent=r.error||'ไม่สำเร็จ';return}await loadPhotos();badge()}
$('#phAll').onchange=e=>document.querySelectorAll('.phck').forEach(c=>c.checked=e.target.checked);
$('#phBulk').onclick=async()=>{const sel=[...document.querySelectorAll('.phck:checked')].map(c=>+c.dataset.i);
  if(!sel.length){$('#phMsg').textContent='ยังไม่ได้เลือกภาพ';return}
  if(!confirm('อนุมัติ '+sel.length+' รายการให้แสดงบนหน้าเว็บ? ตรวจแล้วว่าไม่มีข้อมูลส่วนตัวและได้รับความยินยอม'))return;
  let ok=0;for(const i of sel){const r=await call('approvePhotos',{id:PL[i].id,approve:true,caption:$('#pc'+i).value});if(r.ok)ok++}
  $('#phMsg').textContent='อนุมัติแล้ว '+ok+' รายการ';await loadPhotos();badge()};
