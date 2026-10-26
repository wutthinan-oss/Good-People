/* ตัวเลขผลลัพธ์บนหน้าแรก: ดึงจากฐานข้อมูลจริงผ่าน API (ไม่ฝังตัวเลขไว้ในหน้าเว็บ) */
(function(){
  if(!document.getElementById('rBeh')||!window.api)return;
  const fmt=n=>Number(n).toLocaleString('th-TH');
  function set(id,big,sub){const c=document.getElementById(id),b=c.querySelector('.big'),s=c.querySelector('.sub');
    if(big===null){b.hidden=true;c.classList.remove('live')}else{b.hidden=false;b.textContent=big;c.classList.add('live')}s.textContent=sub}
  api('public').then(r=>{
    if(!r||!r.ok)return;
    if(r.before!==null&&r.after!==null){const d=Math.round((r.after-r.before)*100)/100;
      set('rBeh',r.before.toFixed(2)+' → '+r.after.toFixed(2),(d>=0?'เพิ่มขึ้น ':'ลดลง ')+Math.abs(d).toFixed(2)+' คะแนน · ผู้มีคะแนนครบก่อน–หลัง '+fmt(r.scorePairs)+' คน (จากกลุ่มเป้าหมาย '+fmt(r.students)+' คน)')}
    else set('rBeh',null,'รอข้อมูลจริง: จะแสดงเมื่อมีผู้ที่ถูกประเมินครบก่อน–หลังตั้งแต่ 5 คนขึ้นไป (ตอนนี้ '+fmt(r.scorePairs||0)+' คน)');
    if(r.reports>0){const b=r.byStatus||{};
      set('rMs',fmt(r.reports)+' รายงาน','ทำครบตามแผน '+fmt(b['ทำครบตามแผน']||0)+' · ทำได้บางส่วน '+fmt(b['ทำได้บางส่วน']||0)+' · ยังไม่ได้ทำ '+fmt(b['ยังไม่ได้ทำ']||0)+' · จากนักศึกษา '+fmt(r.submitters)+' คน')}
    else set('rMs',null,'รอข้อมูลจริง: ยังไม่มีรายงานเข้าระบบ');
    if(r.beneficiaries!==null&&r.beneficiaries!==undefined)set('rBen',fmt(r.beneficiaries)+' คน','ผลรวมจาก '+fmt(r.beneficiaryReports)+' รายงานที่นักศึกษาระบุจำนวนไว้ (ตัวเลขที่นักศึกษารายงาน ผู้กำกับสุ่มตรวจ)');
    else set('rBen',null,'รอข้อมูลจริง: ยังไม่มีรายงานที่ระบุจำนวนผู้ได้รับประโยชน์')
  }).catch(()=>{});
})();
