/* ตัวเชื่อม API (Google Apps Script) + โหมดสาธิต ?demo=1 (ข้อมูลสมมติในหน้าเว็บ ไม่ส่งไปที่ใด) */
(function(){
  const DEMO=/[?&]demo=1/.test(location.search);
  window.CADET_DEMO=DEMO;
  const URL_=window.CADET_API||'';
  const MS=[
    {id:'m1',level:'ระดับ 1–2',title:'หนึ่งหมู่ หนึ่งพื้นที่รับผิดชอบ',stages:'C+A|D|E+T',weeks:'สัปดาห์ 5–7',goal:'สำรวจปัญหาในพื้นที่ที่ได้รับอนุญาต จัดทำแผนดูแล ลงมือทำ และกลับมาตรวจผล',evidence:'แบบสำรวจ แผนงาน ภาพตามช่วงเวลา ผลตรวจพื้นที่ สะท้อนคิดรายบุคคล',active:true},
    {id:'m2',level:'ระดับ 2',title:'รด.ช่วยชุมชน',stages:'C+A|D|E+T',weeks:'สัปดาห์ 8–10',goal:'รับฟังความต้องการของชุมชนก่อนจัดกิจกรรมช่วยเหลือ',evidence:'ความต้องการที่สำรวจได้ รายการงาน ผลตรวจรับ ความเห็นผู้รับประโยชน์',active:true},
    {id:'m3',level:'ระดับ 3',title:'รด.รักษาทรัพย์สินส่วนรวม',stages:'C+A+D|E+T',weeks:'สัปดาห์ 11–12',goal:'ระบุปัญหาการใช้ทรัพยากรส่วนรวม วางแนวทางดูแล และติดตามผลการใช้งาน',evidence:'ข้อมูลก่อนดำเนินงาน ข้อตกลงการดูแล ผลติดตาม การแก้ไขปัญหา',active:true}];
  const db={reports:[],scores:[],seq:1,photos:{}};
  function mock(a,d){
    if(a==='ping')return{ok:true};
    if(a==='gallery'){const items=[];db.reports.filter(r=>r.publicOk==1&&r.photos).forEach(r=>String(r.photos).split(',').filter(Boolean).forEach((k,i)=>{const m=MS.find(x=>x.id===r.missionId);items.push({id:r.id+'_'+(i+1),mission:m?m.title:'',missionId:r.missionId,stage:r.stage,date:String(r.ts).slice(0,10),year:r.year||'',caption:r.caption||'',src:db.photos[k],full:db.photos[k]})}));return{ok:true,count:items.length,items}}
    if(a==='approvePhotos'){const r=db.reports.find(x=>x.id===d.id);if(!r||!r.photos)return{ok:false,error:'รายงานนี้ไม่มีภาพ'};r.publicOk=d.approve?1:(d.reject?'no':'');r.caption=d.approve?(d.caption||''):'';return{ok:true}}
    if(a==='suggest'){const L=[['นายสมชาย ตัวอย่างหนึ่ง',1,1],['นางสาวสมหญิง ตัวอย่างสอง',1,70],['นายสมศักดิ์ ตัวอย่างสาม',1,2]];const q=String(d.q||'').replace(/^(นางสาว|นาย)/,'').trim();return{ok:true,names:q.length<1?[]:L.filter(x=>x[0].includes(q)&&(!d.year||x[1]==d.year)).map(x=>({name:x[0],year:x[1],no:x[2]}))}}
    if(a==='publicMissions')return{ok:true,missions:MS};
    if(a==='submitByName'){if(String(d.name||'').trim().length<3)return{ok:false,error:'พิมพ์ชื่อ-สกุลให้ครบ'};if(!(d.year>=1&&d.year<=3))return{ok:false,error:'เลือกชั้นปี นศท. (1–3)'};if(!(d.no>=1))return{ok:false,error:'กรอกลำดับเลขที่ นศท. เป็นตัวเลข'};if(d.status!=='ทำครบตามแผน'&&!d.reason)return{ok:false,error:'โปรดระบุเหตุผลเมื่อทำไม่ครบ'};
      const id='R'+(db.seq++);db.reports.push({id,ts:new Date().toISOString(),sid:'Y'+d.year+'-'+d.no,name:d.name,year:d.year,no:d.no,source:'name',missionId:d.missionId,stage:d.stage,role:d.role||'',status:d.status,reason:d.reason||'',q1:d.q1||'',q2:d.q2||'',q3:d.q3||'',evidence:d.evidence||'',reviewStatus:'รอตรวจ',feedback:'',b1:'',b2:'',b3:'',reviewTs:'',rating:d.rating>=1&&d.rating<=5?+d.rating:'',comment:d.comment||'',mode:d.mode||'',beneficiaries:d.beneficiaries===''||d.beneficiaries==null?'':+d.beneficiaries,photos:(d.photos||[]).map((p,i)=>{const k='ph'+db.seq+'_'+i;db.photos[k]=p;return k}).join(','),star:'',starNote:''});return{ok:true,id,photos:(d.photos||[]).length}}
    if(a==='public'){const by={};let bn=0,nb=0;db.reports.forEach(r=>{by[r.status]=(by[r.status]||0)+1;if(r.beneficiaries!==''){bn+=r.beneficiaries;nb++}});const rv=db.reports.filter(r=>r.rating),dist=[0,0,0,0,0];rv.forEach(r=>dist[r.rating-1]++);return{ok:true,ratingAvg:rv.length?Math.round(rv.reduce((n,r)=>n+r.rating,0)/rv.length*100)/100:null,ratingCount:rv.length,ratingDist:dist,students:195,reports:db.reports.length,submitters:db.reports.length?1:0,byStatus:by,scorePairs:0,before:null,after:null,beneficiaries:nb?bn:null,beneficiaryReports:nb}}
    if(a==='login')return d.sid==='demo'&&d.pin==='1234'?{ok:true,token:'demo-s',name:'นักศึกษาตัวอย่าง (โหมดสาธิต)',room:'-'}:{ok:false,error:'โหมดสาธิต: ใช้เลขประจำตัว demo และ PIN 1234'};
    if(a==='tlogin')return d.key==='demo'?{ok:true,token:'demo-t'}:{ok:false,error:'โหมดสาธิต: ใช้รหัส demo'};
    if(a==='missions')return{ok:true,missions:MS};
    if(a==='submit'){const id='R'+(db.seq++);db.reports.push({id,ts:new Date().toISOString(),sid:'demo',name:'นักศึกษาตัวอย่าง',missionId:d.missionId,stage:d.stage,role:d.role||'',status:d.status,reason:d.reason||'',q1:d.q1||'',q2:d.q2||'',q3:d.q3||'',evidence:d.evidence||'',reviewStatus:'รอตรวจ',feedback:'',b1:'',b2:'',b3:'',reviewTs:'',beneficiaries:d.beneficiaries===''||d.beneficiaries==null?'':+d.beneficiaries,photos:(d.photos||[]).map((p,i)=>{const k='ph'+db.seq+'_'+i;db.photos[k]=p;return k}).join(','),star:'',starNote:''});
      if(d.status!=='ทำครบตามแผน'&&!d.reason)return{ok:false,error:'โปรดระบุเหตุผลเมื่อทำไม่ครบ'};return{ok:true,id}}
    if(a==='myReports')return{ok:true,reports:db.reports.slice().reverse(),stars:db.reports.filter(r=>r.star==1).length};
    if(a==='photo')return db.photos[d.fileId]?{ok:true,data:db.photos[d.fileId]}:{ok:false,error:'ไม่พบภาพ'};
    if(a==='reports'){let l=db.reports.slice().reverse();if(d.photoStatus==='pending')l=l.filter(r=>r.photos&&r.publicOk!=1&&r.publicOk!=='no');if(d.photoStatus==='rejected')l=l.filter(r=>r.publicOk==='no');if(d.photoStatus==='approved')l=l.filter(r=>r.publicOk==1);return{ok:true,reports:l}}
    if(a==='review'){const r=db.reports.find(x=>x.id===d.id);if(!r)return{ok:false,error:'ไม่พบรายงาน'};Object.assign(r,{reviewStatus:d.reviewStatus,feedback:d.feedback,b1:d.b1,b2:d.b2,b3:d.b3,reviewTs:new Date().toISOString(),star:d.star?1:'',starNote:d.star?(d.starNote||''):''});return{ok:true}}
    if(a==='saveScore'){db.scores.push({ts:new Date().toISOString(),sid:d.sid,phase:d.phase,b1:+d.b1,b2:+d.b2,b3:+d.b3});return{ok:true}}
    if(a==='stats'){const by={},rv={'รอตรวจ':0,'ผ่าน':0,'ขอแก้ไข':0},ph={};db.reports.forEach(r=>{by[r.status]=(by[r.status]||0)+1;rv[r.reviewStatus]++});
      db.scores.forEach(s=>{const p=ph[s.phase]=ph[s.phase]||{n:0,b1:0,b2:0,b3:0};p.n++;p.b1+=s.b1;p.b2+=s.b2;p.b3+=s.b3});Object.values(ph).forEach(p=>['b1','b2','b3'].forEach(b=>p[b]=Math.round(p[b]/p.n*100)/100));
      return{ok:true,stats:{students:1,reports:db.reports.length,submitters:db.reports.length?1:0,byStatus:by,byMission:{},review:rv,reviewAvg:{},scoresByPhase:ph,photoPending:db.reports.filter(r=>r.photos&&r.publicOk!=1&&r.publicOk!=='no').length,photoApproved:db.reports.filter(r=>r.publicOk==1).length,photoRejected:db.reports.filter(r=>r.publicOk==='no').length,stars:db.reports.filter(r=>r.star==1).length,topStars:db.reports.filter(r=>r.star==1).length?[{sid:'demo',name:'นักศึกษาตัวอย่าง',stars:db.reports.filter(r=>r.star==1).length}]:[]}}}
    return{ok:false,error:'ไม่รองรับ'};
  }
  const WRITE_ACTIONS=['submit','submitByName','review','saveScore','approvePhotos'];
  async function once(body){
    const res=await fetch(URL_,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(body),redirect:'follow'});
    const txt=await res.text();
    try{return JSON.parse(txt)}catch(e){return{ok:false,error:'เซิร์ฟเวอร์ตอบกลับผิดรูปแบบ (ตรวจว่า deploy เป็น Web app และมีฟังก์ชัน doPost)'}}
  }
  window.api=async function(action,data){
    const body=Object.assign({action},data||{});
    if(DEMO){await new Promise(r=>setTimeout(r,250));return mock(action,body)}
    if(!URL_)return{ok:false,error:'ยังไม่ได้ตั้งค่า API ในไฟล์ config.js'};
    const isWrite=WRITE_ACTIONS.indexOf(action)>=0;
    const tries=isWrite?2:3;
    let last={ok:false,error:'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาลองใหม่'};
    for(let i=0;i<tries;i++){
      try{
        const r=await once(body);
        last=r;
        // เซิร์ฟเวอร์ยุ่ง (คิวล็อกเต็ม): ยังไม่ได้ทำรายการ จึงลองซ้ำได้อย่างปลอดภัย แม้เป็นคำสั่งเขียน
        if(r&&r.ok===false&&/หมดเวลาการล็อก|ผู้ใช้งานพร้อมกันมาก/.test(r.error||'')&&i<tries-1){await new Promise(x=>setTimeout(x,1500*(i+1)));continue}
        return r;
      }catch(e){
        last={ok:false,error:'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาลองใหม่'};
        // ข้อผิดพลาดเครือข่าย: ลองซ้ำเฉพาะคำสั่งอ่าน (คำสั่งเขียนอาจสำเร็จไปแล้ว จึงไม่ลองซ้ำเอง เพื่อไม่ให้ส่งซ้ำ)
        if(!isWrite&&i<tries-1){await new Promise(x=>setTimeout(x,1200*(i+1)));continue}
        return last;
      }
    }
    return last;
  };
  /* บีบอัดภาพจากมือถือ: ย่อด้านยาวไม่เกิน 1280px แล้วแปลงเป็น JPEG (การวาดใหม่ลงแคนวาสจะตัดข้อมูลตำแหน่ง GPS/EXIF ออกด้วย) */
  window.shrinkImage=function(file,max,limit){return new Promise((res,rej)=>{
    if(!/^image\//.test(file.type))return rej(new Error('เลือกไฟล์ภาพเท่านั้น'));
    const url=URL.createObjectURL(file),im=new Image();
    im.onerror=()=>{URL.revokeObjectURL(url);rej(new Error('เปิดภาพไม่ได้ ลองถ่ายใหม่'))};
    im.onload=()=>{URL.revokeObjectURL(url);const k=Math.min(1,(max||1280)/Math.max(im.width,im.height));
      const c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);
      c.getContext('2d').drawImage(im,0,0,c.width,c.height);
      let q=.78,d=c.toDataURL('image/jpeg',q);
      while(d.length*.75>(limit||450*1024)&&q>.35){q-=.1;d=c.toDataURL('image/jpeg',q)}
      d.length*.75>(limit||450*1024)*2?rej(new Error('ภาพใหญ่เกินไป')):res(d)};
    im.src=url})};
  window.esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  window.fmtD=s=>{if(!s)return'';const d=new Date(s);return isNaN(d)?'':d.toLocaleString('th-TH',{day:'numeric',month:'short',year:'2-digit',hour:'2-digit',minute:'2-digit'})};
})();
