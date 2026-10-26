/* ทำภารกิจที่ได้รับ: ไม่ต้องล็อกอิน กรอกชื่อ ชั้นปี นศท. และลำดับเลขที่ แล้วบันทึกผลภารกิจพร้อมภาพเข้าฐานข้อมูล */
const $=s=>document.querySelector(s);
let ME=null,MS=[],MID='',PHOTOS=[];
const show=(id,t)=>{const e=$(id);e.textContent=t;e.style.display='block'};
const hide=id=>{$(id).style.display='none'};
if(window.CADET_DEMO)$('#demoBar').hidden=false;
try{ME=JSON.parse(localStorage.getItem('cadet_me')||'null')}catch(e){}
const yearTxt=y=>'นศท. ชั้นปีที่ '+y;

function fillId(){if(!ME)return;$('#iName').value=ME.name;$('#iYear').value=ME.year;$('#iNo').value=ME.no}
function enter(){$('#vId').hidden=true;$('#vApp').hidden=false;$('#who').textContent='สวัสดี '+ME.name+' · '+yearTxt(ME.year)+' เลขที่ '+ME.no;loadMs()}

$('#fId').addEventListener('submit',e=>{e.preventDefault();hide('#eId');
  const name=$('#iName').value.trim(),year=+$('#iYear').value,no=+$('#iNo').value;
  if(name.length<3)return show('#eId','พิมพ์ชื่อ-สกุลให้ครบ');
  if(!(year>=1&&year<=5))return show('#eId','เลือกระดับชั้นปี นศท.');
  if(!(no>=1&&no<=999))return show('#eId','กรอกลำดับเลขที่ นศท. เป็นตัวเลข');
  ME={name,year,no};try{localStorage.setItem('cadet_me',JSON.stringify(ME))}catch(x){}enter()});
$('#bEdit').onclick=()=>{$('#vApp').hidden=true;$('#vId').hidden=false;fillId()};

async function loadMs(){const r=await api('publicMissions');
  if(!r.ok){$('#mList').innerHTML=`<div class="pcard">${esc(r.error||'โหลดภารกิจไม่ได้')}</div>`;return}
  MS=r.missions;
  $('#mList').innerHTML=MS.map(m=>`<div class="mcard"><h3>${esc(m.title)}</h3><div class="meta">${esc(m.level)} · ${esc(m.weeks)}</div>
   <div>${String(m.stages).split('|').map(s=>`<span class="stg">${esc(s)}</span>`).join('')}</div>
   <p style="margin:6px 0">${esc(m.goal)}</p><p class="small"><b>หลักฐานที่ควรมี:</b> ${esc(m.evidence)}</p>
   <button class="btn btn-primary" style="padding:8px 20px" type="button" data-id="${esc(m.id)}">ทำภารกิจนี้</button></div>`).join('')||'<div class="pcard">ยังไม่มีภารกิจ</div>'}
$('#mList').addEventListener('click',e=>{const b=e.target.closest('button[data-id]');if(!b)return;
  MID=b.dataset.id;const m=MS.find(x=>x.id===MID);$('#fTitle').textContent='บันทึกผลภารกิจ: '+(m?m.title:'');
  hide('#oDone');hide('#eSub');RATE=0;drawStars();renderChips();$('#vForm').hidden=false;$('#vForm').scrollIntoView({behavior:'smooth'})});

/* ===== ตัวเลือกคำตอบแบบแตะเลือก (ช่วยให้ไม่ต้องพิมพ์มาก) ===== */
const CH={
  role:['หัวหน้าหมู่','สมาชิกหมู่','ผู้บันทึกผล','ผู้ถ่ายภาพ','ผู้ตรวจงาน','ผู้ดูแลอุปกรณ์'],
  reason:['ฝนตก/อากาศไม่เอื้อ','อุปกรณ์ไม่พอ','เวลาไม่พอ','เพื่อนมาไม่ครบ','ไม่สบาย','รอผู้กำกับอนุญาต'],
  q1:['ทำครบตามที่ตกลง','ทำตรงเวลา','ทำได้บางส่วน','ยังทำไม่ได้ตามที่ตกลง','มีคนช่วยเตือน','ทำเองโดยไม่ต้องเตือน'],
  q2:['เพื่อนร่วมโรงเรียน','ครูและบุคลากร','ชุมชนและผู้ใช้พื้นที่','ผู้ใช้ห้องน้ำ','สิ่งแวดล้อม','รู้เพราะเห็นพื้นที่สะอาดขึ้น','รู้เพราะมีคนขอบคุณ','รู้เพราะผู้กำกับตรวจแล้ว','รู้เพราะมีภาพก่อน–หลัง'],
  q3:['มาตรงเวลามากขึ้น','แบ่งงานให้ชัดขึ้น','เตรียมอุปกรณ์ล่วงหน้า','ช่วยเพื่อนมากขึ้น','ตรวจงานซ้ำก่อนส่ง','ชวนเพื่อนมาช่วยเพิ่ม']
};
const CH_M={
  m1:{q2:['เพื่อนที่ใช้พื้นที่นี้','ครูประจำอาคาร'],q3:['ตรวจพื้นที่ซ้ำทุกสัปดาห์']},
  m2:{q2:['คนในชุมชนที่ได้รับความช่วยเหลือ','ผู้ปกครอง'],q3:['ถามความต้องการก่อนลงมือ']},
  m3:{q2:['ทุกคนที่ใช้ทรัพย์สินส่วนรวม','ครูผู้ดูแลสถานที่'],q3:['ติดตามการใช้งานต่อเนื่อง']}
};
const BEN=[5,10,20,50,100];
CH.comment=['สนุก','ได้เรียนรู้','อยากทำอีก','ได้ช่วยคนอื่น','ยากไปหน่อย','ใช้เวลานาน','ควรมีอุปกรณ์เพิ่ม'];
let RATE=0;const RT=['ยังไม่ได้ให้ดาว','ควรปรับปรุง','พอใช้','ดี','ดีมาก','ดีเยี่ยม'];
function drawStars(){document.querySelectorAll('#stars button').forEach(b=>b.classList.toggle('on',+b.dataset.n<=RATE));$('#sTxt').textContent=RT[RATE]}
$('#stars').addEventListener('click',e=>{const b=e.target.closest('button[data-n]');if(!b)return;RATE=RATE===+b.dataset.n?0:+b.dataset.n;drawStars()});
function chipsFor(k){return (CH[k]||[]).concat(((CH_M[MID]||{})[k])||[])}
function renderChips(){document.querySelectorAll('.qc').forEach(box=>{const k=box.dataset.for;
  box.innerHTML=k==='ben'?BEN.map(n=>`<button type="button" class="qchip" data-k="ben" data-v="${n}">${n} คน</button>`).join('')
    :chipsFor(k).map(t=>`<button type="button" class="qchip" data-k="${k}" data-v="${esc(t)}">${esc(t)}</button>`).join('')})}
function syncChips(k){const el=$('#'+k);if(!el)return;const box=document.querySelector(`.qc[data-for="${k}"]`);if(!box)return;
  box.querySelectorAll('.qchip').forEach(b=>b.classList.toggle('on',k==='ben'?el.value===b.dataset.v:el.value.includes(b.dataset.v)))}
document.addEventListener('click',e=>{const b=e.target.closest('.qchip');if(!b)return;const k=b.dataset.k,v=b.dataset.v,el=$('#'+k);
  if(k==='ben'||k==='role')el.value=el.value===v?'':v;
  else{const parts=el.value.split(/;\s*/).filter(Boolean);const i=parts.indexOf(v);i>=0?parts.splice(i,1):parts.push(v);el.value=parts.join('; ')}
  syncChips(k)});
['role','reason','q1','q2','q3','ben','comment'].forEach(k=>{const el=$('#'+k);if(el)el.addEventListener('input',()=>syncChips(k))});

$('#bCancel').onclick=()=>{$('#vForm').hidden=true};

document.querySelectorAll('input[name=st]').forEach(r=>r.onchange=()=>{$('#reasonBox').hidden=r.value==='ทำครบตามแผน'});
function draw(){$('#shots').innerHTML=PHOTOS.map((p,i)=>`<div class="shot"><img src="${p}" alt="ภาพหลักฐาน ${i+1}"><button type="button" aria-label="ลบภาพ" data-i="${i}">×</button></div>`).join('')}
$('#shots').addEventListener('click',e=>{const b=e.target.closest('button[data-i]');if(b){PHOTOS.splice(+b.dataset.i,1);draw()}});
async function add(files){hide('#eSub');for(const f of files){if(PHOTOS.length>=3){show('#eSub','แนบได้ไม่เกิน 3 ภาพ');break}
  try{PHOTOS.push(await shrinkImage(f,1280,420*1024))}catch(e){show('#eSub',e.message)}}draw()}
$('#fCam').onchange=e=>{add([...e.target.files]);e.target.value=''};
$('#fPick').onchange=e=>{add([...e.target.files]);e.target.value=''};

$('#fSub').addEventListener('submit',async e=>{e.preventDefault();hide('#eSub');
  const st=document.querySelector('input[name=st]:checked');if(!st)return show('#eSub','เลือกสถานะการทำภารกิจ');
  const stage=$('#stage').value,q=[$('#q1').value.trim(),$('#q2').value.trim(),$('#q3').value.trim()];
  if(st.value!=='ทำครบตามแผน'&&!$('#reason').value.trim())return show('#eSub','โปรดระบุเหตุผลเมื่อทำไม่ครบ');
  if((stage==='E'||stage==='T')&&q.some(x=>!x))return show('#eSub','ขั้น E และ T ต้องตอบคำถามสะท้อนคิดทั้ง 3 ข้อ');
  const b=$('#bSub');b.disabled=true;b.textContent='กำลังส่ง...';
  const r=await api('submitByName',{name:ME.name,year:ME.year,no:ME.no,website:$('#hp').value,missionId:MID,stage,role:$('#role').value,status:st.value,reason:$('#reason').value,q1:q[0],q2:q[1],q3:q[2],evidence:$('#evidence').value,photos:PHOTOS,beneficiaries:$('#ben').value,rating:RATE||'',comment:$('#comment').value});
  b.disabled=false;b.textContent='ส่งรายงานภารกิจ';
  if(!r.ok)return show('#eSub',r.error||'ส่งไม่สำเร็จ');
  show('#oDone','ส่งรายงานแล้ว (รหัส '+r.id+(r.photos?' · แนบ '+r.photos+' ภาพ':'')+') ผู้กำกับจะตรวจและให้ข้อเสนอแนะ ทำภารกิจอื่นต่อได้เลย');
  $('#fSub').reset();PHOTOS=[];RATE=0;drawStars();draw();renderChips();$('#reasonBox').hidden=true;$('#vForm').hidden=true;scrollTo({top:0,behavior:'smooth'})});

if(ME&&ME.name){fillId();enter()}
