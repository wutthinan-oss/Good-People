/* ภารกิจด่วนวันนี้: ตัวจับเวลาคาบ 30 นาทีตาม CADET 5 ขั้น + จำนวนที่ส่งแล้ววันนี้ (api 'daily') */
const $=s=>document.querySelector(s),TARGET=195,esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt=n=>Number(n).toLocaleString('th-TH');
const PH=[['C','Care','สำรวจพื้นที่ รับหมู่ เลือกภารกิจ',3],['A','Accept','ตกลงบทบาทในหมู่',3],['D','Do','ลงมือทำจริง ถ่ายภาพก่อนและหลัง',12],['E','Examine','ส่งรายงาน ตอบสะท้อนคิด 3 ข้อ แนบรูป',8],['T','Transfer','สรุป 1 ประโยค ทำต่อเองโดยไม่ต้องสั่ง',4]];
const TOTAL=PH.reduce((a,p)=>a+p[3]*60,0);
$('#tdSteps').innerHTML=PH.map(p=>`<i data-k="${p[0]}"><b>${p[0]}</b>${p[3]} นาที</i>`).join('');
$('#tdDate').textContent=new Date().toLocaleDateString('th-TH',{day:'numeric',month:'long',year:'numeric'});

/* ตัวจับเวลา: คิดจากเวลาจริง (ไม่เดินช้าเมื่อหน้าจอหลับ) */
let T={run:false,start:0,used:0,last:-1};
const elapsed=()=>T.used+(T.run?(Date.now()-T.start)/1000:0);
function beep(n){try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;const a=new C();for(let i=0;i<n;i++){const o=a.createOscillator(),g=a.createGain();o.connect(g);g.connect(a.destination);o.frequency.value=880;g.gain.value=.15;o.start(a.currentTime+i*.3);o.stop(a.currentTime+i*.3+.18)}setTimeout(()=>a.close&&a.close(),n*400+300)}catch(e){}}
function phaseAt(sec){let acc=0;for(let i=0;i<PH.length;i++){acc+=PH[i][3]*60;if(sec<acc)return i}return PH.length}
function draw(){const e=Math.min(elapsed(),TOTAL),i=phaseAt(e),left=Math.max(0,TOTAL-e);
  $('#tdClock').textContent=String(Math.floor(left/60)).padStart(2,'0')+':'+String(Math.floor(left%60)).padStart(2,'0');
  if(!T.run&&e===0){$('#tdPh').textContent='พร้อมเริ่ม';$('#tdHint').textContent='กด “เริ่ม” เมื่อพร้อม ระบบแจ้งเตือนทุกครั้งที่เปลี่ยนขั้น'}
  else if(i>=PH.length){$('#tdPh').textContent='หมดเวลาแล้ว';$('#tdHint').textContent='เก็บอุปกรณ์ ตรวจว่าทุกคนส่งรายงานแล้ว';}
  else{const p=PH[i];$('#tdPh').innerHTML=p[0]+' · '+p[1]+' <span>(เหลือขั้นนี้ '+Math.ceil(PH.slice(0,i+1).reduce((a,x)=>a+x[3]*60,0)/60-e/60)+' นาที)</span>';$('#tdHint').textContent=p[2]}
  document.querySelectorAll('#tdSteps i').forEach((el,k)=>{el.classList.toggle('on',k===i&&(T.run||e>0));el.classList.toggle('done',k<i)});
  if(T.run&&i!==T.last){if(T.last>=0)beep(i>=PH.length?3:1);T.last=i}
  $('#tdGo').textContent=T.run?'⏸ หยุดชั่วคราว':(e>0&&i<PH.length?'▶ เล่นต่อ':'▶ เริ่ม');
  if(T.run&&i>=PH.length){T.run=false;T.used=TOTAL}}
$('#tdGo').onclick=()=>{if(T.run){T.used=elapsed();T.run=false}else{if(elapsed()>=TOTAL){T.used=0}T.start=Date.now();T.run=true;T.last=phaseAt(elapsed());beep(1)}draw()};
$('#tdNext').onclick=()=>{const i=phaseAt(elapsed());if(i>=PH.length)return;let acc=0;for(let k=0;k<=i;k++)acc+=PH[k][3]*60;T.used=acc;T.start=Date.now();draw()};
$('#tdReset').onclick=()=>{T={run:false,start:0,used:0,last:-1};draw()};
setInterval(draw,500);draw();

/* ข้อมูลสดจากฐานข้อมูล */
let LASTMS='';
async function load(){let r;try{r=await api('daily')}catch(e){r=null}
  if(!r||!r.ok){$('#tdStamp').textContent='เชื่อมต่อฐานข้อมูลไม่ได้ในขณะนี้ จะลองใหม่เอง';return}
  $('#tdN').textContent=fmt(r.studentsToday);$('#tdBar').style.width=Math.min(100,r.studentsToday*100/TARGET)+'%';
  $('#tdRep').textContent=fmt(r.reportsToday);$('#tdPho').textContent=fmt(r.photoStudentsToday);
  $('#tdStamp').textContent='อัปเดต '+new Date().toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit',second:'2-digit'})+' น.';
  const html=r.missions.length?'<div class="td-ms">'+r.missions.map(m=>`<div class="td-m"><h3>${esc(m.title)}<span class="n">ส่งแล้ว ${fmt((r.byMission||{})[m.id]||0)}</span></h3><p>${esc(m.level||'')}${m.goal?' · '+esc(m.goal):''}</p><a class="btn btn-primary" style="padding:8px 20px" href="mission.html?m=${encodeURIComponent(m.id)}">ทำภารกิจนี้</a></div>`).join('')+'</div>'
    :'<div class="td-empty">ผู้กำกับยังไม่ได้ตั้งภารกิจด่วนของวันนี้ · ระหว่างรอ เข้าไปเลือกภารกิจเองได้ที่หน้า <a href="mission.html"><b>ทำภารกิจ</b></a></div>';
  if(html!==LASTMS){$('#tdMs').innerHTML=html;LASTMS=html}}
load();setInterval(()=>{if(!document.hidden)load()},15000);
