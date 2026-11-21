const LINK_APLIKASI='https://upload.vjjdeyyjinerila.xyz/f/mf2asr';
const LINK_TELEGRAM='https://t.me/spesialedition';
// pengaturan iklan ada di file iklan.js
const DATA_SALURAN=[
  {foto:'https://upload.vjjdeyyjinerila.xyz/f/fbYLEg', video:'https://upload.vjjdeyyjinerila.xyz/f/cASvqa'}, 
  {foto:'https://upload.vjjdeyyjinerila.xyz/f/DbFyNV', video:'https://upload.vjjdeyyjinerila.xyz/f/Wmmp5k'},   
  {foto:'https://upload.vjjdeyyjinerila.xyz/f/iHckhH', video:'https://upload.vjjdeyyjinerila.xyz/f/2TTTWv'},   
  {foto:'https://upload.vjjdeyyjinerila.xyz/f/F3jNNe', video:'https://upload.vjjdeyyjinerila.xyz/f/8eCjyJ'},  
  {foto:'https://upload.vjjdeyyjinerila.xyz/f/cKAwfC', video:'https://upload.vjjdeyyjinerila.xyz/f/8eCjyJ'},   
  {foto:'https://upload.vjjdeyyjinerila.xyz/f/3qcZMd', video:'https://upload.vjjdeyyjinerila.xyz/f/2Fvuty'},   
  {foto:'https://upload.vjjdeyyjinerila.xyz/f/y7rgcx', video:'https://upload.vjjdeyyjinerila.xyz/f/yV9dvc'},  
  {foto:'https://upload.vjjdeyyjinerila.xyz/f/YzPd3f', video:'https://upload.vjjdeyyjinerila.xyz/f/rzLjv7'}, 
];

if(document.getElementById('channels')){
const toast=document.getElementById('toast');
let toastTimer;
function showToast(message){
  toast.textContent=message;toast.classList.add('show');
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2300);
}
const searchWrap=document.getElementById('searchWrap');
const searchInput=document.getElementById('searchInput');
document.getElementById('searchToggle').addEventListener('click',()=>{
  searchWrap.classList.toggle('open');
  if(searchWrap.classList.contains('open'))searchInput.focus();
  else{searchInput.value='';filterChannels('');}
});
function filterChannels(value){
  const cards=[...document.querySelectorAll('.channel')];let shown=0;
  cards.forEach(card=>{
    const match=card.dataset.name.toLowerCase().includes(value.trim().toLowerCase());
    card.style.display=match?'grid':'none';if(match)shown++;
  });
  document.getElementById('count').textContent=String(shown).padStart(2,'0')+' SALURAN';
  document.getElementById('empty').style.display=shown?'none':'block';
}
searchInput.addEventListener('input',e=>filterChannels(e.target.value));
const overlay=document.getElementById('overlay');
function openModal(title,message,action='Mengerti'){
  document.getElementById('modalTitle').textContent=title;
  document.getElementById('modalText').textContent=message;
  document.getElementById('modalAction').textContent=action;
  overlay.classList.add('show');
}
function closeModal(){overlay.classList.remove('show')}
document.getElementById('closeModal').addEventListener('click',closeModal);
document.getElementById('modalAction').addEventListener('click',closeModal);
overlay.addEventListener('click',e=>{if(e.target===overlay)closeModal()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
document.querySelectorAll('.channel').forEach((card,i)=>{
  const rb=document.createElement('span');
  rb.className='rb';
  card.prepend(rb);
  const d=DATA_SALURAN[i]||{};
  if(d.foto&&d.foto.trim()){
    const thumb=card.querySelector('.thumb');
    const img=new Image();
    img.alt='';
    img.width=108;img.height=108;
    img.decoding='async';
    if(i<3)img.fetchPriority='high';
    img.src=d.foto.trim();
    thumb.textContent='';
    thumb.appendChild(img);
    thumb.style.animation='none';
  }
});
/* pencet play saluran: smartlink di tab baru, lalu pindah ke halaman video */
function keHalamanVideo(kode,judul,ket){
  bukaSmartlink();
  location.href='video.html?s='+encodeURIComponent(kode)+'&j='+encodeURIComponent(judul||'')+'&k='+encodeURIComponent(ket||'');
}
document.querySelectorAll('.play').forEach((button,i)=>{
  button.addEventListener('click',()=>{
    const d=DATA_SALURAN[i]||{};
    if(!(d.video&&d.video.trim())){
      openModal(button.dataset.channel,'Link video saluran ini belum diisi.','Mengerti');
      return;
    }
    const kartu=button.closest('.channel');
    keHalamanVideo(i+1,kartu.querySelector('h3').textContent.trim(),kartu.querySelector('p').textContent.trim());
  });
});
document.getElementById('menuToggle').addEventListener('click',()=>{
  openModal('Menu Special Edition','Gunakan pencarian untuk menemukan saluran. Tombol navigasi di bawah dapat Anda kembangkan sesuai kebutuhan.','Tutup');
});
document.querySelectorAll('.nav-item').forEach(button=>{
  button.addEventListener('click',()=>{
    document.querySelectorAll('.nav-item').forEach(item=>item.classList.remove('active'));
    button.classList.add('active');
    const label=button.dataset.nav;
    if(label==='Jelajahi'){searchWrap.classList.add('open');searchInput.focus();showToast('Cari saluran yang ingin Anda jelajahi');}
    else if(label==='Beranda'){searchWrap.classList.remove('open');searchInput.value='';filterChannels('');window.scrollTo({top:0,behavior:'smooth'});}
    else openModal(label,label==='Langganan'?'Bagian langganan siap disesuaikan dengan sistem Anda.':'Bagian profil siap disesuaikan dengan informasi pengguna.','Mengerti');
  });
});
function pasangLink(id,url,nama){
  const btn=document.getElementById(id);
  if(url&&url.trim()){btn.href=url.trim();}
  else{btn.addEventListener('click',e=>{e.preventDefault();showToast('Link '+nama+' belum diisi');});}
}
/* Install Aplikasi: iklannya sama seperti saluran (smartlink + halaman video dengan popunder) */
document.getElementById('installBtn').addEventListener('click',e=>{
  e.preventDefault();
  if(!(LINK_APLIKASI&&LINK_APLIKASI.trim())){showToast('Link aplikasi belum diisi');return;}
  keHalamanVideo('app','Install Aplikasi','Video spesial');
});
pasangLink('telegramBtn',LINK_TELEGRAM,'Telegram');
if('IntersectionObserver' in window){
  const pengamat=new IntersectionObserver(entri=>{
    entri.forEach(e=>e.target.classList.toggle('diam',!e.isIntersecting));
  },{rootMargin:'100px 0px'});
  document.querySelectorAll('.intro, .channel, .app-actions').forEach(el=>pengamat.observe(el));
}
}

/* ===== HALAMAN VIDEO (video.html) ===== */
if(document.getElementById('halamanVideo')){
  const toast=document.getElementById('toast');
  let toastTimer;
  function showToast(message){
    toast.textContent=message;toast.classList.add('show');
    clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2300);
  }
  const q=new URLSearchParams(location.search);
  const kode=q.get('s')||'';
  const link=kode==='app'?LINK_APLIKASI:((DATA_SALURAN[Number(kode)-1]||{}).video||'');
  const pVideo=document.getElementById('pVideo');
  const pTutup=document.getElementById('pTutup');
  const pSuara=document.getElementById('pSuara');
  document.getElementById('pJudul').textContent=q.get('j')||'Video';
  document.getElementById('pKet').textContent=q.get('k')||'';
  if(q.get('j'))document.title=q.get('j')+' — harapan bangsa';
  if(link&&link.trim())pVideo.src=link.trim();
  else document.getElementById('pTeks').textContent='Video tidak ditemukan';

  // video tidak jalan sendiri; penonton pencet play
  pTutup.addEventListener('click',()=>{
    if(!pVideo.getAttribute('src')){showToast('Video tidak ditemukan');return;}
    pTutup.hidden=true;pVideo.setAttribute('controls','');
    pVideo.muted=false;
    pVideo.play().catch(()=>{
      pVideo.muted=true;
      pVideo.play().then(()=>{pSuara.hidden=false;}).catch(()=>{pTutup.hidden=false;pVideo.removeAttribute('controls');});
    });
  });
  pSuara.addEventListener('click',()=>{pVideo.muted=false;pSuara.hidden=true;pVideo.play().catch(()=>{});});
  pVideo.addEventListener('volumechange',()=>{if(!pVideo.muted)pSuara.hidden=true;});

  // tombol kembali: balik ke halaman sebelumnya (daftar saluran)
  document.getElementById('btnKembali').addEventListener('click',()=>{
    let dariSini=false;
    try{dariSini=document.referrer&&new URL(document.referrer).origin===location.origin;}catch(e){}
    if(dariSini&&history.length>1)history.back();else location.href='index.html';
  });
    }
