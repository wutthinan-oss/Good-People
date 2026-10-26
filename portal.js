const $=s=>document.querySelector(s);
let TOKEN=null,MS=[],PHOTOS=[];
try{TOKEN=sessionStorage.getItem('cadet_tok')}catch(e){}
if(window.CADET_DEMO)$('#demoBar').hidden=false;
const show=(id,ok)=>{const e=$(id);e.textContent=ok;e.style.display='block'};
const hide=id=>{$(id).style.display='none'};

async function call(a,d){const r=await api(a,Object.assign({token:TOKEN},d||{}));if(r&&r.auth){logout(true);}return r}
function enter(name){call('myReports').then(r=>{if(r&&r.ok){$('#stars').hidden=false;$('#starN').textContent=r.stars||0}});$('#vLogin').hidden=true;$('#vApp').hidden=false;$('#who').textContent='สวัสดี '+name;loadMissions()}
function logout(expired){TOKEN=null;try{sessionStorage.removeItem('cadet_tok');sessionStorage.removeItem('cadet_name')}catch(e){}
  $('#vApp').hidden=true;$('#vLogin').hidden=false;if(expired===true)show('#eLogin','หมดเวลาการใช้งาน กรุณาเข้าสู่ระบบใหม่')}

$('#fLogin').addEventListener('submit',async e=>{e.preventDefault();hide('#eLogin');const b=$('#bLogin');b.disabled=true;b.textContent='กำลังตรวจสอบ...';
  const r=await api('login',{sid:$('#sid').value.trim(),pin:$('#pin').value.trim()});b.disabled=false;b.textContent='เข้าสู่ระบบ';
  if(!r.ok)return show('#eLogin',r.error||'เข้าสู่ระบบไม่สำเร็จ');
  TOKEN=r.token;try{sessionStorage.setItem('cadet_tok',TOKEN);sessionStorage.setItem('cadet_name',r.name)}catch(x){}$('#pin').value='';enter(r.name)});

document.querySelectorAll('#tabs .tab').forEach(t=>t.onclick=()=>{document.querySelectorAll('#tabs .tab').forEach(x=>x.classList.toggle('on',x===t));
  ['missions','submit','history'].forEach(k=>$('#t'+k[0].toUpperCase()+k.slice(1)).hidden=k!==t.dataset.t);if(t.dataset.t==='history')loadHistory()});

async function loadMissions(){const r=await call('missions');if(!r.ok){$('#mList').innerHTML=`<div class="pcard">${esc(r.error)}</div>`;return}
  MS=r.missions;$('#mission').innerHTML=MS.map(m=>`<option value="${esc(m.id)}">${esc(m.title)}</option>`).join('');
  $('#mList').innerHTML=MS.map(m=>`<div class="mcard"><h3>${esc(m.title)}</h3><div class="meta">${esc(m.level)} · ${esc(m.weeks)}</div>
   <div>${String(m.stages).split('|').map(s=>`<span class="stg">${esc(s)}</span>`).join('')}</div>
   <p style="margin:6px 0">${esc(m.goal)}</p><p class="small"><b>หลักฐานที่ควรมี:</b> ${esc(m.evidence)}</p>
   <button class="btn btn-ghost" style="padding:7px 16px" onclick="goSubmit('${esc(m.id)}')">ส่งรายงานภารกิจนี้</button></div>`).join('')||'<div class="pcard">ยังไม่มีภารกิจ</div>'}
function goSubmit(id){$('#mission').value=id;document.querySelector('#tabs [data-t=submit]').click();scrollTo(0,0)}

function drawShots(){$('#shots').innerHTML=PHOTOS.map((p,i)=>`<div class="shot"><img src="${p}" alt="ภาพหลักฐาน ${i+1}"><button type="button" aria-label="ลบภาพ" onclick="PHOTOS.splice(${i},1);drawShots()">×</button></div>`).join('')}
async function addFiles(files){hide('#eSub');for(const f of files){if(PHOTOS.length>=3){show('#eSub','แนบได้ไม่เกิน 3 ภาพ');break}
  try{PHOTOS.push(await shrinkImage(f,1280,420*1024))}catch(e){show('#eSub',e.message)}}drawShots()}
$('#fCam').onchange=e=>{addFiles([...e.target.files]);e.target.value=''};
$('#fPick').onchange=e=>{addFiles([...e.target.files]);e.target.value=''};

document.querySelectorAll('input[name=st]').forEach(r=>r.onchange=()=>{$('#reasonBox').hidden=r.value==='ทำครบตามแผน'});
$('#fSub').addEventListener('submit',async e=>{e.preventDefault();hide('#eSub');hide('#oSub');
  const st=document.querySelector('input[name=st]:checked');if(!st)return show('#eSub','เลือกสถานะการทำภารกิจ');
  const stage=$('#stage').value,q=[$('#q1').value.trim(),$('#q2').value.trim(),$('#q3').value.trim()];
  if(st.value!=='ทำครบตามแผน'&&!$('#reason').value.trim())return show('#eSub','โปรดระบุเหตุผลเมื่อทำไม่ครบ');
  if((stage==='E'||stage==='T')&&q.some(x=>!x))return show('#eSub','ขั้น E และ T ต้องตอบคำถามสะท้อนคิดทั้ง 3 ข้อ');
  const b=$('#bSub');b.disabled=true;b.textContent='กำลังส่ง...';
  const r=await call('submit',{missionId:$('#mission').value,stage,role:$('#role').value,status:st.value,reason:$('#reason').value,q1:q[0],q2:q[1],q3:q[2],evidence:$('#evidence').value,photos:PHOTOS});
  b.disabled=false;b.textContent='ส่งรายงาน';
  if(!r.ok)return show('#eSub',r.error||'ส่งไม่สำเร็จ');
  show('#oSub','ส่งรายงานแล้ว (รหัส '+r.id+') ผู้กำกับจะตรวจและให้ข้อเสนอแนะ');$('#fSub').reset();PHOTOS=[];drawShots();$('#reasonBox').hidden=true});

async function loadHistory(){$('#hList').innerHTML='<div class="pcard">กำลังโหลด...</div>';const r=await call('myReports');if(r.ok){$('#stars').hidden=false;$('#starN').textContent=r.stars||0}
  if(!r.ok){$('#hList').innerHTML=`<div class="pcard">${esc(r.error)}</div>`;return}
  const nm=id=>(MS.find(m=>m.id===id)||{}).title||id;
  $('#hList').innerHTML=r.reports.map(x=>`<div class="rep"><div class="h"><b>${esc(nm(x.missionId))}</b><span class="stg">ขั้น ${esc(x.stage)}</span>
    <span class="badge2 ${x.status==='ทำครบตามแผน'?'g':x.status==='ยังไม่ได้ทำ'?'r':''}">${esc(x.status)}</span>
    <span class="badge2 ${x.reviewStatus==='ผ่าน'?'g':x.reviewStatus==='ขอแก้ไข'?'r':''}">${esc(x.reviewStatus)}</span><span class="small">${esc(fmtD(x.ts))}</span></div>
    ${x.role?`<p><b>บทบาท:</b> ${esc(x.role)}</p>`:''}${x.reason?`<p><b>เหตุผล:</b> ${esc(x.reason)}</p>`:''}
    ${x.q1?`<p><b>1)</b> ${esc(x.q1)}</p><p><b>2)</b> ${esc(x.q2)}</p><p><b>3)</b> ${esc(x.q3)}</p>`:''}
    ${x.star?`<div class="starnote">⭐ ได้รับดาวจากผู้กำกับ${x.starNote?': '+esc(x.starNote):''}</div>`:''}
    ${x.photos?`<div class="thumbs" data-ph="${esc(x.photos)}">${String(x.photos).split(',').map(id=>`<button type="button" class="thumb" data-id="${esc(id)}">📷 ดูภาพ</button>`).join('')}</div>`:''}
    ${x.feedback?`<div class="fb"><b>ข้อเสนอแนะจากผู้กำกับ:</b> ${esc(x.feedback)}${x.b1?` · ความรับผิดชอบ ${esc(x.b1)} · ซื่อสัตย์ในการรายงาน ${esc(x.b2)} · จิตสาธารณะ ${esc(x.b3)} (ระดับ 1–4)`:''}</div>`:''}</div>`).join('')||'<div class="pcard">ยังไม่มีรายงาน</div>'}

document.addEventListener('click',async e=>{const b=e.target.closest('.thumb');if(!b||b.dataset.done)return;b.textContent='กำลังโหลด...';
  const r=await call('photo',{fileId:b.dataset.id});if(!r.ok){b.textContent=r.error||'โหลดไม่ได้';return}
  b.dataset.done=1;b.outerHTML=`<img class="pimg" src="${r.data}" alt="ภาพหลักฐาน">`});
try{const n=sessionStorage.getItem('cadet_name');if(TOKEN&&n)enter(n)}catch(e){}
