/* CADET รด.หัวใจอาสา — เว็บแนะนำโครงการ (ไม่เก็บข้อมูลนักเรียน) */
const STEPS=[
 {l:'C',n:'ใส่ใจปัญหา',en:'Care',c:'var(--c1)',m:'เข้าใจความต้องการของผู้อื่นและส่วนรวม',d:'สำรวจปัญหา อ่านสถานการณ์ หรือฟังผู้รับประโยชน์',w:'ปัญหาที่พบ ใครได้รับผลกระทบ และเหตุผลที่ควรช่วย',q:'ปัญหานี้กระทบใคร และเราควรช่วยเพราะอะไร'},
 {l:'A',n:'รับภารกิจ',en:'Accept',c:'var(--c2)',m:'วางแผนและยอมรับบทบาทของตน',d:'รับหรือเลือกภารกิจ แบ่งหน้าที่ และกำหนดแผน',w:'บทบาทรายบุคคล แผนงาน และข้อตกลง',q:'ฉันรับหน้าที่อะไร และจะทำเสร็จเมื่อไร'},
 {l:'D',n:'ลงมือทำ',en:'Do',c:'var(--c3)',m:'ปฏิบัติงานตามข้อตกลง',d:'ทำภารกิจร่วมกับเพื่อนและแก้ปัญหาระหว่างดำเนินงาน',w:'ผลงาน หลักฐาน และปัญหาที่เกิดขึ้น',q:'ระหว่างทำพบอุปสรรคอะไร และแก้อย่างไร'},
 {l:'E',n:'ทบทวน',en:'Examine · AAR',c:'var(--c4)',m:'ทบทวนการกระทำและผลต่อผู้อื่น (After Action Review)',d:'ตรวจความครบถ้วน รายงานตามจริง และรับข้อเสนอแนะ',w:'สิ่งที่ทำได้ สิ่งที่ยังไม่สำเร็จ และสิ่งที่จะปรับ',q:'วันนี้ฉันรับผิดชอบอะไร ทำได้ตามข้อตกลงหรือไม่ ใครได้ประโยชน์'},
 {l:'T',n:'สานต่อ',en:'Transfer',c:'var(--c5)',m:'ทำต่อเนื่องและใช้บทเรียนในบริบทใหม่',d:'กลับไปติดตามงาน หรือริเริ่มภารกิจถัดไป',w:'ผลติดตามและเป้าหมายพัฒนาตนเอง',q:'ครั้งหน้าฉันจะปรับการกระทำอะไรหนึ่งอย่าง'}];
const st=document.getElementById('stepper'),pn=document.getElementById('panel');
STEPS.forEach((s,i)=>{const b=document.createElement('button');b.className='st';b.style.setProperty('--c',s.c);b.type='button';b.setAttribute('role','tab');
  b.innerHTML=`<div class="l">${s.l}</div><div class="n">${s.n}</div>`;b.onclick=()=>showStep(i);st.appendChild(b)});
function showStep(i){const s=STEPS[i];[...st.children].forEach((b,k)=>{b.classList.toggle('on',k===i);b.setAttribute('aria-selected',k===i)});
  pn.style.setProperty('--c',s.c);
  pn.innerHTML=`<h3><small>ขั้น ${s.l} · ${s.en.toUpperCase()}</small>${s.n}</h3><p class="meaning">${s.m}</p>
   <div class="box"><b>นักศึกษาทำอะไร</b>${s.d}</div><div class="box"><b>บันทึกบนเว็บ</b>${s.w}</div>
   <div class="box" style="grid-column:1/-1"><b>คำถามนำ</b>${s.q}</div>`}
showStep(0);let cur=0;
document.addEventListener('keydown',e=>{if(!st.contains(document.activeElement))return;if(e.key==='ArrowRight'){cur=(cur+1)%5;showStep(cur);st.children[cur].focus()}if(e.key==='ArrowLeft'){cur=(cur+4)%5;showStep(cur);st.children[cur].focus()}});
[...st.children].forEach((b,i)=>b.addEventListener('click',()=>cur=i));

/* timeline (วันที่ตามแผน เริ่ม 2 พ.ย. 2569 = 2026-11-02) */
const PH=[
 {wk:'สัปดาห์ 1–2',d:'2–15 พ.ย. 2569',a:'2026-11-02',b:'2026-11-15',t:'ระยะที่ 1: ค้นหาปัญหาและสร้างฐานข้อมูลก่อนทดลอง',
  l:['เลือกกลุ่มนักศึกษาที่จะเข้าร่วมจริง','สำรวจความต้องการของโรงเรียนหรือชุมชน','ประเมินพฤติกรรมก่อนดำเนินโครงการ','กำหนดตัวชี้วัด เกณฑ์คะแนน และวิธีเก็บหลักฐาน','ขออนุมัติกิจกรรมและกำหนดแนวทางคุ้มครองข้อมูลนักเรียน'],o:'รายงานปัญหา เครื่องมือประเมิน และแผนทดลอง'},
 {wk:'สัปดาห์ 3–4',d:'16–29 พ.ย. 2569',a:'2026-11-16',b:'2026-11-29',t:'ระยะที่ 2: สร้างนวัตกรรมต้นแบบ',
  l:['พัฒนาเว็บ CADET ภารกิจทำดี','สร้างแบบฟอร์มรับงาน ส่งหลักฐาน และสะท้อนคิด','สร้างเกณฑ์ประเมินความรับผิดชอบและจิตอาสา','ทดลองระบบกับครูและนักศึกษากลุ่มเล็กก่อนใช้จริง'],o:'เว็บต้นแบบ คู่มือใช้งาน และชุดภารกิจรุ่นแรก'},
 {wk:'สัปดาห์ 5–12',d:'30 พ.ย. 2569 – 24 ม.ค. 2570',a:'2026-11-30',b:'2027-01-24',t:'ระยะที่ 3: ทดลองใช้จริงและปรับปรุง',
  l:['ดำเนินภารกิจ 3 ระดับตามความพร้อม','เก็บข้อมูลระหว่างโครงการทุกครั้ง','ประชุมสะท้อนผลและปรับภารกิจ','ให้ผู้ประเมินมากกว่าหนึ่งแหล่งร่วมตรวจพฤติกรรม','ติดตามว่าประโยชน์ที่เกิดขึ้นคงอยู่หรือไม่'],o:'หลักฐานกิจกรรม คะแนนพฤติกรรม ข้อมูลผลลัพธ์ และบันทึกการปรับปรุง'},
 {wk:'สัปดาห์ 13–14',d:'25 ม.ค. – 7 ก.พ. 2570',a:'2027-01-25',b:'2027-02-07',t:'ระยะที่ 4: วิเคราะห์ผลและยืนยันคุณภาพ',
  l:['เปรียบเทียบข้อมูลก่อนและหลัง','ตรวจความครบถ้วนของหลักฐาน','สรุปผลที่สำเร็จและข้อจำกัดตามจริง','ขอความคิดเห็นจากนักศึกษา ครู และผู้รับประโยชน์'],o:'ตารางผลวิเคราะห์และรายงานตรวจสอบหลักฐาน'},
 {wk:'สัปดาห์ 15–16',d:'8–21 ก.พ. 2570',a:'2027-02-08',b:'2027-02-21',t:'ระยะที่ 5: สร้างผลงานสำหรับกรรมการ',
  l:['จัดทำรายงานไม่เกิน 30 หน้า รวมภาคผนวก','ทำแผนภาพโมเดลและอินโฟกราฟิกผลลัพธ์','จัดชุดหลักฐานที่ตรวจสอบย้อนกลับได้','จัดทำสไลด์นำเสนอและซ้อมตอบคำถามกรรมการ'],o:'รายงานฉบับสมบูรณ์ แฟ้มหลักฐาน และชุดนำเสนอ'}];
const tl=document.getElementById('timeline'),today=new Date();
PH.forEach(p=>{const a=new Date(p.a+'T00:00:00'),b=new Date(p.b+'T23:59:59');
  const s=today>b?'done':today>=a?'now':'';const lab=s==='done'?'เสร็จสิ้นตามแผน':s==='now'?'กำลังดำเนินการ':'ยังไม่เริ่ม';
  const el=document.createElement('div');el.className='ph-item reveal '+s;
  el.innerHTML=`<div class="ph-head"><span class="wk">${p.wk} · ${p.d}</span><h3>${p.t}</h3><span class="pill st-b ${s==='now'?'r':s==='done'?'':'y'}">${lab}</span></div><ul>${p.l.map(x=>`<li>${x}</li>`).join('')}</ul><div class="out">ผลส่งมอบ: ${p.o}</div>`;
  tl.appendChild(el)});

/* evidence checklist (บันทึกในเบราว์เซอร์เท่านั้น) */
const EV=['ข้อมูลปัญหาก่อนเริ่มโครงการ','เครื่องมือประเมินและเกณฑ์คะแนนที่กำหนดไว้ล่วงหน้า','ภาพหรือเอกสารการทดลองใช้จริงที่มีวันเวลาตรวจสอบได้','หลักฐานบทบาทของนักศึกษาแต่ละคน','ผลการตรวจงานและการสะท้อนคิด','ตารางคะแนนก่อนและหลัง พร้อมวิธีวิเคราะห์','หลักฐานประโยชน์ต่อผู้รับบริการหรือส่วนรวม','ประวัติการปรับปรุงเว็บและกระบวนการจากการทดลอง','คู่มือสำหรับครูหรือหน่วยงานอื่น','หลักฐานการเผยแพร่ที่เกิดขึ้นจริง'];
const KEY='cadet_evidence_v1';let saved={};try{saved=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){}
const evi=document.getElementById('evi');
EV.forEach((t,i)=>{const l=document.createElement('label');l.innerHTML=`<input type="checkbox" ${saved[i]?'checked':''}><span>${t}</span>`;
  l.firstChild.onchange=e=>{saved[i]=e.target.checked;try{localStorage.setItem(KEY,JSON.stringify(saved))}catch(x){}prog()};evi.appendChild(l)});
function prog(){const n=EV.filter((_,i)=>saved[i]).length;document.getElementById('progBar').style.width=n/EV.length*100+'%';document.getElementById('progTxt').textContent=`${n} / ${EV.length} รายการ`}
prog();

/* demo form (ไม่บันทึกข้อมูล) */
function demoSend(){const v=document.querySelector('input[name=st]:checked'),o=document.getElementById('demoOut');
  o.style.display='block';o.textContent=v?`ตัวอย่าง: ระบบรับสถานะ “${v.value}” แล้ว ในเว็บจริงผู้กำกับจะเห็นรายงานนี้พร้อมหลักฐานและให้ข้อเสนอแนะ (หน้านี้เป็นตัวอย่าง ไม่ได้บันทึกข้อมูลใดๆ)`:'กรุณาเลือกสถานะภารกิจก่อน'}

/* photos: ถ้ามีไฟล์ใน assets/photos/ จะแสดงเอง */
document.querySelectorAll('[data-photo]').forEach(el=>{const f='assets/photos/'+el.dataset.photo,i=new Image();
  i.onload=()=>{el.style.backgroundImage=`url("${f}")`;el.classList.add('has');el.setAttribute('role','img');el.setAttribute('aria-label','ภาพกิจกรรม CADET รด.หัวใจอาสา')};i.src=f});

/* nav + scroll */
function toggleNav(b){const n=document.getElementById('nav');const o=n.classList.toggle('open');b.setAttribute('aria-expanded',o)}
document.querySelectorAll('nav.main a').forEach(a=>a.addEventListener('click',()=>{document.getElementById('nav').classList.remove('open')}));
const secs=[...document.querySelectorAll('main section[id]')],links=[...document.querySelectorAll('nav.main a')],tt=document.getElementById('toTop');
addEventListener('scroll',()=>{tt.style.display=scrollY>600?'block':'none';let cur='';secs.forEach(s=>{if(s.getBoundingClientRect().top<120)cur=s.id});links.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+cur))},{passive:true});
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
