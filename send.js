/* ส่งภารกิจรายบุคคลจากหน้าแรก: ล็อกอินด้วยเลขประจำตัว + PIN แล้วส่งรายงานพร้อมภาพเข้าฐานข้อมูล */
(function(){
  const $=s=>document.querySelector(s);
  if(!$('#send'))return;
  let PH=[];
  if(window.CADET_DEMO)$('#sdDemoTag').hidden=false;
  const show=(id,t)=>{const e=$(id);e.textContent=t;e.style.display='block'};
  const hide=id=>{$(id).style.display='none'};
  try{const n=localStorage.getItem('cadet_name');if(n)$('#sdName').value=n}catch(e){}
  api('publicMissions').then(r=>{if(r&&r.ok)$('#sdMs').innerHTML=r.missions.map(m=>`<option value="${esc(m.id)}">${esc(m.title)} (${esc(m.level)})</option>`).join('')});

  document.querySelectorAll('input[name=sdSt]').forEach(r=>r.onchange=()=>{$('#sdReasonBox').hidden=r.value==='ทำครบตามแผน'});

  function draw(){$('#sdShots').innerHTML=PH.map((p,i)=>`<div class="sd-shot"><img src="${p}" alt="ภาพหลักฐาน ${i+1}"><button type="button" aria-label="ลบภาพ" data-i="${i}">×</button></div>`).join('')}
  $('#sdShots').addEventListener('click',e=>{const b=e.target.closest('button[data-i]');if(b){PH.splice(+b.dataset.i,1);draw()}});
  async function add(files){hide('#sdESub');for(const f of files){if(PH.length>=3){show('#sdESub','แนบได้ไม่เกิน 3 ภาพ');break}
    try{PH.push(await shrinkImage(f,1280,420*1024))}catch(e){show('#sdESub',e.message)}}draw()}
  $('#sdCam').onchange=e=>{add([...e.target.files]);e.target.value=''};
  $('#sdFile').onchange=e=>{add([...e.target.files]);e.target.value=''};

  $('#sdForm').addEventListener('submit',async e=>{e.preventDefault();hide('#sdESub');hide('#sdOk');
    const st=document.querySelector('input[name=sdSt]:checked');if(!st)return show('#sdESub','เลือกสถานะการทำภารกิจ');
    const stage=$('#sdStage').value,q=[$('#sdQ1').value.trim(),$('#sdQ2').value.trim(),$('#sdQ3').value.trim()];
    if(st.value!=='ทำครบตามแผน'&&!$('#sdReason').value.trim())return show('#sdESub','โปรดระบุเหตุผลเมื่อทำไม่ครบ');
    if((stage==='E'||stage==='T')&&q.some(x=>!x))return show('#sdESub','ขั้น E และ T ต้องตอบคำถามสะท้อนคิดทั้ง 3 ข้อ');
    const b=$('#sdBSub');b.disabled=true;b.textContent='กำลังส่ง...';
    const r=await api('submitByName',{name:$('#sdName').value,website:$('#sdWeb').value,missionId:$('#sdMs').value,stage,role:$('#sdRole').value,status:st.value,reason:$('#sdReason').value,q1:q[0],q2:q[1],q3:q[2],evidence:$('#sdEvi').value,photos:PH,beneficiaries:$('#sdBen').value});
    b.disabled=false;b.textContent='ส่งรายงาน';
    if(!r.ok)return show('#sdESub',r.error||'ส่งไม่สำเร็จ');
    show('#sdOk','ส่งรายงานแล้ว (รหัส '+r.id+(r.photos?' · แนบ '+r.photos+' ภาพ':'')+') ผู้กำกับจะตรวจและให้ข้อเสนอแนะ');
    try{localStorage.setItem('cadet_name',$('#sdName').value)}catch(x){}
    const nm=$('#sdName').value;$('#sdForm').reset();$('#sdName').value=nm;PH=[];draw();$('#sdReasonBox').hidden=true});

})();
