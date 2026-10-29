/* ผู้ได้รับเกียรติบัตร: รายชื่อจากฐานข้อมูล (api 'honor') วาดเกียรติบัตรลง canvas ในเครื่องผู้ชม ภาพต้นแบบ assets/certificate.webp ไม่มีชื่อ */
const $=s=>document.querySelector(s),PAGE=48;
const THM=['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
const IMG=new Image();IMG.src='assets/certificate.webp';
const imgReady=new Promise(r=>IMG.complete&&IMG.naturalWidth?r():(IMG.onload=r,IMG.onerror=r));
const fontReady=()=>Promise.all([document.fonts.load('600 56px Sarabun'),document.fonts.load('500 28px Sarabun')]).catch(()=>{});
let ALL=[],SHOWN=PAGE,LIST=[];
function drawCert(cv,name,date){const c=cv.getContext('2d'),W=1491,H=1055;cv.width=W;cv.height=H;
  c.drawImage(IMG,0,0,W,H);c.textAlign='center';c.textBaseline='alphabetic';c.fillStyle='#0f2a5a';
  let fs=56;do{c.font='600 '+fs+'px Sarabun,sans-serif';fs-=2}while(c.measureText(name).width>900&&fs>30);
  c.fillText(name,745,592);
  const d=date?new Date(date+'T00:00:00'):null;
  if(d&&!isNaN(d)){c.font='500 28px Sarabun,sans-serif';c.fillText(String(d.getDate()),596,806);c.fillText(THM[d.getMonth()],758,806);c.fillText(String(d.getFullYear()+543),926,806)}}
const io=('IntersectionObserver' in window)?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){io.unobserve(e.target);const x=LIST[+e.target.dataset.i];if(x)drawCert(e.target,x.name,x.date)}}),{rootMargin:'300px'}):null;
function render(){const q=$('#hnQ').value.trim();
  LIST=ALL.filter(x=>!q||x.name.includes(q));
  $('#hnCount').textContent=q?'พบ '+LIST.length+' คน':'ทั้งหมด '+ALL.length+' คน';
  const g=$('#hnGrid');g.innerHTML='';
  if(!LIST.length){g.innerHTML='<p class="small">'+(ALL.length?'ไม่พบชื่อนี้ ลองพิมพ์เฉพาะชื่อหรือนามสกุล หรือยังไม่ได้ส่งรายงานพร้อมรูป':'ยังไม่มีผู้ได้รับเกียรติบัตร (รอข้อมูลจริง)')+'</p>';$('#hnMore').hidden=true;return}
  LIST.slice(0,SHOWN).forEach((x,i)=>{const b=document.createElement('button');b.type='button';b.className='hn-card';b.dataset.i=i;
    const cv=document.createElement('canvas');cv.dataset.i=i;cv.width=1491;cv.height=1055;const sp=document.createElement('span');sp.textContent=x.name;
    b.append(cv,sp);g.appendChild(b);io?io.observe(cv):drawCert(cv,x.name,x.date)});
  $('#hnMore').hidden=LIST.length<=SHOWN}
$('#hnQ').addEventListener('input',()=>{SHOWN=PAGE;render()});
$('#hnMore').onclick=()=>{SHOWN+=PAGE;render()};
$('#hnGrid').addEventListener('click',e=>{const b=e.target.closest('.hn-card');if(!b)return;const x=LIST[+b.dataset.i];
  drawCert($('#hnBig'),x.name,x.date);$('#hnBig').dataset.n=x.name;$('#hnModal').hidden=false});
$('#hnClose').onclick=()=>$('#hnModal').hidden=true;
$('#hnModal').addEventListener('click',e=>{if(e.target.id==='hnModal')$('#hnModal').hidden=true});
document.addEventListener('keydown',e=>{if(e.key==='Escape')$('#hnModal').hidden=true});
$('#hnPng').onclick=()=>$('#hnBig').toBlob(b=>{const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='เกียรติบัตร-'+($('#hnBig').dataset.n||'CADET')+'.png';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),4000)},'image/png');
(async()=>{await Promise.all([imgReady,fontReady()]);
  const r=await api('honor');
  if(!r||!r.ok){$('#hnGrid').innerHTML='<p class="small">เชื่อมต่อฐานข้อมูลไม่ได้ในขณะนี้ ลองรีเฟรชอีกครั้ง</p>';return}
  ALL=r.items||[];$('#hnN').textContent=ALL.length?ALL.length.toLocaleString('th-TH')+' คน':'ยังไม่มีข้อมูล';render()})();
