/* หน้าสรุปผลสำหรับกรรมการ: ทุกตัวเลขและภาพดึงจากฐานข้อมูลจริงผ่าน API (ไม่ฝังตัวเลขไว้ในหน้าเว็บ) */
(function(){
  const fmt=n=>Number(n).toLocaleString('th-TH'),$=id=>document.getElementById(id),TARGET=195;
  function tile(id,big,sub,bar){const c=$(id);if(!c)return;
    const b=c.querySelector('.jt-big,.jt-mid'),s=c.querySelector('.jt-sub');
    if(big!==null){b.textContent=big;c.classList.add('live')}
    if(sub)s.textContent=sub;
    if(bar!==undefined){const i=c.querySelector('.jt-bar i');if(i)i.style.width=Math.min(100,bar)+'%'}}
  const band=v=>v>=2.5?'ดีเยี่ยม':v>=1.5?'ดี':v>=1?'ผ่าน':'ไม่ผ่าน';
  if(!window.api)return;
  api('public').then(r=>{
    if(!r||!r.ok){$('jStamp').textContent='เชื่อมต่อฐานข้อมูลไม่ได้ในขณะนี้ ลองรีเฟรชอีกครั้ง';return}
    const d=new Date();
    $('jStamp').textContent='ข้อมูลสดจากฐานข้อมูล ณ '+d.toLocaleDateString('th-TH',{day:'numeric',month:'long',year:'numeric'})+' เวลา '+d.toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit'})+' น.';
    if(r.reports>0)tile('tRep',fmt(r.reports),'ทำครบตามแผน '+fmt((r.byStatus||{})['ทำครบตามแผน']||0)+' · ทำได้บางส่วน '+fmt((r.byStatus||{})['ทำได้บางส่วน']||0)+' · ยังไม่ได้ทำ '+fmt((r.byStatus||{})['ยังไม่ได้ทำ']||0));
    else tile('tRep',null,'รอข้อมูลจริง: ยังไม่มีรายงานเข้าระบบ');
    if(r.submitters>0)tile('tPart',fmt(r.submitters)+' คน','คิดเป็น '+Math.round(r.submitters*100/TARGET)+'% ของนักศึกษาทั้งหมด '+TARGET+' คน',r.submitters*100/TARGET);
    else tile('tPart',null,'รอข้อมูลจริง');
    if(r.ratingCount>0){const f=Math.round(r.ratingAvg);tile('tStar',r.ratingAvg.toFixed(1)+' / 5','★'.repeat(f)+'☆'.repeat(5-f)+' จากนักศึกษา '+fmt(r.ratingCount)+' คนที่ให้ดาว')}
    else tile('tStar',null,'รอข้อมูลจริง: จะแสดงเมื่อนักศึกษาให้ดาว');
    if(r.beneficiaries!==null&&r.beneficiaries!==undefined)tile('tBen',fmt(r.beneficiaries)+' คน','รวมจาก '+fmt(r.beneficiaryReports)+' รายงานที่ระบุจำนวน (นักศึกษารายงานเอง)');
    else tile('tBen',null,'รอข้อมูลจริง');
    if(r.scorePairs>=5&&r.before!=null&&r.after!=null){const dd=r.after-r.before;
      tile('tBeh','ก่อน '+Number(r.before).toFixed(2)+' → หลัง '+Number(r.after).toFixed(2)+' (จาก '+(r.scale===4?4:3)+')','จับคู่ก่อน–หลัง '+fmt(r.scorePairs)+' คน'+(r.scale===4?'':' · ระดับคุณภาพหลัง: '+band(r.after))+' · เปลี่ยนแปลง '+(dd>=0?'+':'')+dd.toFixed(2)+' (ประเมินโดยผู้กำกับ)')}
    else tile('tBeh',null,'รอผู้กำกับตรวจรายงานและบันทึกระดับพฤติกรรม'+(r.scorePairs?' (ตอนนี้มี '+r.scorePairs+' คู่ ยังน้อยเกินกว่าจะสรุป)':'')+' จึงยังไม่อ้างว่าพฤติกรรมเพิ่มขึ้น');
  }).catch(()=>{$('jStamp').textContent='เชื่อมต่อฐานข้อมูลไม่ได้ในขณะนี้ ลองรีเฟรชอีกครั้ง'});

  api('gallery').then(g=>{
    const items=(g&&g.items)||[],box=$('jStrip');
    if(!items.length){tile('tPhoto',null,'ยังไม่มีภาพที่อนุมัติ');box.innerHTML='<p class="j-empty">ยังไม่มีภาพที่ผู้กำกับอนุมัติ</p>';return}
    tile('tPhoto',fmt(g.count||items.length)+' ภาพ','ผู้กำกับตรวจและกดอนุมัติทีละภาพก่อนเผยแพร่ ไม่แสดงชื่อนักศึกษา');
    box.innerHTML='';
    // สุ่มกระจายภาพเพื่อให้เห็นหลายภารกิจ
    const pool=[],step=Math.max(1,Math.floor(items.length/18));
    for(let i=0;i<items.length&&pool.length<18;i+=step)pool.push(items[i]);
    let shown=0,next=0;
    // ภาพที่โหลดไม่ขึ้น (เช่น Drive ตอบช้า) ถูกข้าม แล้วใช้ภาพถัดไปแทน จนครบ 6 ภาพ
    function add(){if(shown>=6||next>=pool.length)return;const it=pool[next++],a=document.createElement('a');
      a.href='gallery.html';a.setAttribute('aria-label','ดูภาพกิจกรรมทั้งหมด');
      const im=new Image();im.alt=it.mission?'ภาพภารกิจ '+it.mission:'ภาพภารกิจจิตอาสา';
      im.onload=()=>{if(shown<6){shown++;box.appendChild(a)}};im.onerror=add;a.appendChild(im);im.src=it.src}
    for(let k=0;k<6;k++)add();
  }).catch(()=>{});
})();
