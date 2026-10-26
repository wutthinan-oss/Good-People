/* ตัวเลขผลลัพธ์บนหน้าแรก: ดึงจากฐานข้อมูลจริงผ่าน API (ไม่ฝังตัวเลขไว้ในหน้าเว็บ) */
(function(){
  if(!document.getElementById('rBeh')||!window.api)return;
  const fmt=n=>Number(n).toLocaleString('th-TH');
  function set(id,big,sub){const c=document.getElementById(id),b=c.querySelector('.big'),s=c.querySelector('.sub');
    if(big===null){b.hidden=true;c.classList.remove('live')}else{b.hidden=false;b.textContent=big;c.classList.add('live')}s.textContent=sub}
  api('public').then(r=>{
    if(!r||!r.ok)return;
    if(r.ratingCount>0){const full=Math.round(r.ratingAvg),stars='★'.repeat(full)+'☆'.repeat(5-full);
      set('rBeh',r.ratingAvg.toFixed(1)+' / 5',stars+' · จากนักศึกษา '+fmt(r.ratingCount)+' คนที่ให้ดาวหลังทำภารกิจ')}
    else set('rBeh',null,'รอข้อมูลจริง: จะแสดงเมื่อนักศึกษาให้ดาวภารกิจ');
    if(r.reports>0){const b=r.byStatus||{};
      set('rMs',fmt(r.reports)+' รายงาน','ทำครบตามแผน '+fmt(b['ทำครบตามแผน']||0)+' · ทำได้บางส่วน '+fmt(b['ทำได้บางส่วน']||0)+' · ยังไม่ได้ทำ '+fmt(b['ยังไม่ได้ทำ']||0)+' · จากนักศึกษา '+fmt(r.submitters)+' คน')}
    else set('rMs',null,'รอข้อมูลจริง: ยังไม่มีรายงานเข้าระบบ');
    if(r.beneficiaries!==null&&r.beneficiaries!==undefined)set('rBen',fmt(r.beneficiaries)+' คน','ผลรวมจาก '+fmt(r.beneficiaryReports)+' รายงานที่นักศึกษาระบุจำนวนไว้ (ตัวเลขที่นักศึกษารายงาน ผู้กำกับสุ่มตรวจ)');
    else set('rBen',null,'รอข้อมูลจริง: ยังไม่มีรายงานที่ระบุจำนวนผู้ได้รับประโยชน์')
  }).catch(()=>{});
})();
