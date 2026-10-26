/* หน้าภาพกิจกรรมจากนักศึกษา: ดึงเฉพาะภาพที่ผู้กำกับอนุมัติแล้วจากฐานข้อมูล */
(function(){
const $=s=>document.querySelector(s);
if(window.CADET_DEMO)$('#demoBar').hidden=false;
const STG={C:'ใส่ใจปัญหา',A:'วางแผน/รับหน้าที่',D:'ลงมือทำ',E:'ตรวจผลและทบทวน',T:'ติดตามผล'};
let ITEMS=[],CUR='all';
function draw(){const l=CUR==='all'?ITEMS:ITEMS.filter(x=>x.missionId===CUR);
  $('#gEmpty').hidden=ITEMS.length>0;
  $('#gGrid').innerHTML=l.map((x,i)=>`<figure class="gcard" data-i="${ITEMS.indexOf(x)}"><img loading="lazy" src="${esc(x.src)}" alt="${esc(x.caption||x.mission)}">
    <figcaption class="gm"><b>${esc(x.caption||x.mission)}</b>${esc(x.mission)} · ขั้น ${esc(x.stage)} ${esc(STG[x.stage]||'')}${x.date?' · '+esc(x.date):''}${x.year?' · นศท. ปี '+esc(x.year):''}</figcaption></figure>`).join('')}
function chips(){const ms=[...new Map(ITEMS.map(x=>[x.missionId,x.mission])).entries()];
  $('#gChips').innerHTML=ms.length?[['all','ทั้งหมด',ITEMS.length]].concat(ms.map(([k,t])=>[k,t,ITEMS.filter(x=>x.missionId===k).length]))
   .map(([k,t,n])=>`<button type="button" class="chip${k===CUR?' on':''}" data-k="${esc(k)}">${esc(t)}<small>${n}</small></button>`).join(''):''}
$('#gChips').addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;CUR=b.dataset.k;chips();draw()});
$('#gGrid').addEventListener('click',e=>{const c=e.target.closest('.gcard');if(!c)return;const x=ITEMS[+c.dataset.i];
  $('#glbImg').src=x.full||x.src;$('#glbCap').textContent=(x.caption||x.mission)+' · '+x.mission;$('#glb').hidden=false});
const close=()=>{$('#glb').hidden=true;$('#glbImg').src=''};
$('#glbX').onclick=close;$('#glb').addEventListener('click',e=>{if(e.target.id==='glb')close()});addEventListener('keydown',e=>{if(e.key==='Escape')close()});
api('gallery').then(r=>{ITEMS=(r&&r.ok)?r.items:[];
  $('#gStats').innerHTML=`<div><b>${ITEMS.length}</b><span>ภาพที่อนุมัติแล้ว</span></div><div><b>${new Set(ITEMS.map(x=>x.missionId)).size}</b><span>ภารกิจที่มีภาพ</span></div>`;
  chips();draw()});
})();
