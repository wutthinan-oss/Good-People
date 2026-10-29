/* แดชบอร์ดเกียรติบัตร: นักศึกษาที่ลงมือทำภารกิจอย่างน้อย MIN รายการ (ส่งรูปหลักฐานมาด้วย) รับเกียรติบัตรได้
   ภาพต้นแบบอยู่ใน assets/certificate.webp ไม่มีชื่อใคร ชื่อถูกวาดลงในเครื่องผู้ใช้เท่านั้น */
const MIN=1,$=s=>document.querySelector(s);
let TOKEN=null,NAME='',OK=false;
try{TOKEN=sessionStorage.getItem('cadet_tok');NAME=sessionStorage.getItem('cadet_name')||''}catch(e){}
if(window.CADET_DEMO)$('#demoBar').hidden=false;
const IMG=new Image();IMG.src='assets/certificate.webp';
const THM=['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
async function call(a,d){const r=await api(a,Object.assign({token:TOKEN},d||{}));if(r&&r.auth)out(true);return r}
function out(exp){TOKEN=null;try{sessionStorage.removeItem('cadet_tok');sessionStorage.removeItem('cadet_name')}catch(e){}
  $('#vApp').hidden=true;$('#vLogin').hidden=false;if(exp===true){const e=$('#eLogin');e.textContent='หมดเวลาการใช้งาน กรุณาเข้าสู่ระบบใหม่';e.style.display='block'}}
$('#bOut').onclick=()=>out();
$('#fLogin').addEventListener('submit',async e=>{e.preventDefault();const er=$('#eLogin');er.style.display='none';const b=$('#bLogin');b.disabled=true;b.textContent='กำลังตรวจสอบ...';
  const r=await api('login',{sid:$('#sid').value.trim(),pin:$('#pin').value.trim()});b.disabled=false;b.textContent='เข้าสู่ระบบ';
  if(!r.ok){er.textContent=r.error||'เข้าสู่ระบบไม่สำเร็จ';er.style.display='block';return}
  TOKEN=r.token;NAME=r.name;try{sessionStorage.setItem('cadet_tok',TOKEN);sessionStorage.setItem('cadet_name',NAME)}catch(x){}$('#pin').value='';enter()});

async function enter(){$('#vLogin').hidden=true;$('#vApp').hidden=false;$('#who').textContent='สวัสดี '+NAME;
  const r=await call('myReports');if(!r||!r.ok){$('#cdTitle').textContent='โหลดข้อมูลไม่ได้';$('#cdSub').textContent=(r&&r.error)||'ลองรีเฟรชอีกครั้ง';return}
  const done=r.reports.filter(x=>String(x.photos||'').trim()),st=new Set(done.map(x=>String(x.stage||'').toUpperCase()));
  const left=['C','A','D','E','T'].filter(s=>!st.has(s));
  $('#nRep').textContent=done.length;$('#nStar').textContent=r.stars||0;$('#nStg').textContent=(5-left.length)+'/5';
  document.querySelectorAll('#cdSteps i').forEach(i=>i.classList.toggle('on',st.has(i.dataset.s)));
  OK=done.length>=MIN;
  $('#cdTitle').textContent=OK?'ขอบคุณที่ลงมือทำความดี':'เริ่มต้นความดีวันนี้';
  $('#cdSub').textContent=OK?'คุณส่งรูปภารกิจจิตอาสาแล้ว '+done.length+' ภารกิจ รับเกียรติบัตรได้เลย':'ส่งรายงานพร้อมรูปภาพภารกิจที่ทำจริงอย่างน้อย '+MIN+' ภารกิจ ก็รับเกียรติบัตรได้';
  $('#cdMsg').textContent=!OK?'ทุกความดีเริ่มจากก้าวแรก ไปทำภารกิจ ถ่ายรูปส่ง แล้วกลับมารับเกียรติบัตรนะ':!left.length?'ยอดเยี่ยมมาก ผ่านครบทั้ง 5 ขั้น CADET แล้ว ความดีของคุณเป็นแบบอย่างให้เพื่อน ๆ':'เก่งมาก! ถ้าอยากไปต่อ ลองทำขั้น '+left.join(', ')+' อีกนิด ความดีที่ทำต่อเนื่องคือพลังของนักศึกษาวิชาทหาร';
  const l=$('#cdLock');l.hidden=OK;l.textContent=OK?'':'🔒 ส่งรูปภารกิจแรกของคุณ แล้วเกียรติบัตรจะปลดล็อก';$('#cdWrap').classList.toggle('cd-lock',!OK);
  $('#bPng').disabled=$('#bPrint').disabled=!OK;await draw()}

async function draw(){const cv=$('#cv'),c=cv.getContext('2d');
  await new Promise(r=>IMG.complete&&IMG.naturalWidth?r():(IMG.onload=r,IMG.onerror=r));
  try{await Promise.all([document.fonts.load('600 56px Sarabun'),document.fonts.load('500 34px Sarabun')])}catch(e){}
  c.drawImage(IMG,0,0,cv.width,cv.height);if(!OK)return;
  c.textAlign='center';c.textBaseline='alphabetic';c.fillStyle='#0f2a5a';
  const nm=String(NAME).replace(/^\s*(นศท\.?|นักศึกษาวิชาทหาร)\s*/,'').trim();let fs=44;
  do{c.font='600 '+fs+'px Sarabun,sans-serif';fs-=2}while(c.measureText(nm).width>900&&fs>30);
  c.fillText(nm,745,592);
  const d=new Date();c.font='500 28px Sarabun,sans-serif';
  c.fillText(String(d.getDate()),596,806);c.fillText(THM[d.getMonth()],758,806);c.fillText(String(d.getFullYear()+543),926,806)}

$('#bPng').onclick=()=>{$('#cv').toBlob(b=>{const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='เกียรติบัตร-CADET-รดหัวใจอาสา.png';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),4000)},'image/png')};
$('#bPrint').onclick=()=>window.print();
if(TOKEN&&NAME)enter();
