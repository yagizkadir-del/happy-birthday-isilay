(() => {
  const scenes=[...document.querySelectorAll('.scene')], progress=document.getElementById('progressFill'), counter=document.getElementById('sceneCounter');
  const prev=document.getElementById('prevBtn'), next=document.getElementById('nextBtn'), loader=document.getElementById('loader');
  let index=0,busy=false,soundOn=false,secretIndex=0,secretFinished=false;

  const secrets=[
    'Basma demiştim. 🤍',
    'Yine bastın…',
    'Seni tanıyorum çünkü. 😌',
    'Bir daha basacağını biliyordum.',
    'Tamam tamam… Çok meraklısın. 😂',
    'Sana küçük bir sır göstereceğim…',
    'Hazır mısın? 👀'
  ];

  const modal=document.getElementById('modal'),modalContent=document.getElementById('modalContent');
  const secretButton=document.getElementById('secretButton');
  const update=()=>{progress.style.width=`${(index+1)/scenes.length*100}%`;counter.textContent=`${String(index+1).padStart(2,'0')} / ${String(scenes.length).padStart(2,'0')}`;prev.disabled=index===0;next.disabled=index===scenes.length-1};

  function go(to){
    if(busy||to<0||to>=scenes.length||to===index)return;
    busy=true;
    const old=scenes[index], direction=to>index?1:-1;
    document.documentElement.style.setProperty('--scene-direction',direction);
    old.classList.toggle('to-next',direction>0);
    old.classList.toggle('to-prev',direction<0);
    old.classList.add('is-leaving');
    setTimeout(()=>{
      old.classList.remove('is-active','is-leaving','to-next','to-prev');
      index=to;
      const incoming=scenes[index];
      incoming.classList.toggle('from-next',direction>0);
      incoming.classList.toggle('from-prev',direction<0);
      requestAnimationFrame(()=>incoming.classList.add('is-active'));
      setTimeout(()=>incoming.classList.remove('from-next','from-prev'),850);
      update();
      setTimeout(()=>{busy=false},180);
      if(incoming.dataset.scene==='final'){
        window.heartRain?.();
        setTimeout(()=>window.heartOrbit?.(),900);
      }
    },610)
  }

  document.querySelectorAll('.next').forEach(b=>b.addEventListener('click',()=>go(index+1)));
  prev.addEventListener('click',()=>go(index-1));
  next.addEventListener('click',()=>go(index+1));
  addEventListener('keydown',e=>{
    if(modal.classList.contains('is-open')){if(e.key==='Escape')closeModal();return}
    if(e.key==='ArrowRight'||e.key===' ')go(index+1);
    if(e.key==='ArrowLeft')go(index-1)
  });

  let touchX=0;
  addEventListener('touchstart',e=>touchX=e.changedTouches[0].clientX,{passive:true});
  addEventListener('touchend',e=>{if(modal.classList.contains('is-open'))return;const d=e.changedTouches[0].clientX-touchX;if(Math.abs(d)>70)go(index+(d<0?1:-1))},{passive:true});

  const accept=document.getElementById('acceptBtn'),decline=document.getElementById('declineBtn'),request=document.getElementById('friendRequest'),accepted=document.getElementById('acceptedMessage'),leagueNext=document.querySelector('.league-next');
  accept.addEventListener('click',()=>{
    request.style.transition='.5s ease';request.style.opacity='0';request.style.transform='translate(-50%,-50%) scale(.9)';
    setTimeout(()=>{request.style.visibility='hidden';accepted.classList.add('is-visible');leagueNext.classList.add('is-visible');window.heartBurst?.(innerWidth/2,innerHeight/2,28)},450)
  });
  function dodgeDecline(e){
    e?.preventDefault?.();
    const card=request.getBoundingClientRect(),btn=decline.getBoundingClientRect();
    const maxX=Math.max(50,Math.min(180,(card.width-btn.width)/2-12));
    const maxY=Math.max(32,Math.min(86,(card.height-btn.height)/2+22));
    const x=(Math.random()>.5?1:-1)*(55+Math.random()*maxX*.65);
    const y=(Math.random()-.5)*maxY*1.25;
    decline.style.transform=`translate(${x}px,${y}px) rotate(${(Math.random()-.5)*5}deg)`;
  }
  ['pointerenter','pointerdown','touchstart','click'].forEach(type=>decline.addEventListener(type,dodgeDecline,{passive:false}));
  decline.setAttribute('aria-disabled','true');
  decline.setAttribute('tabindex','-1');

  document.getElementById('snail').addEventListener('click',()=>openModal('<div class="modal-snail">🐌</div><h3>Gizli not</h3><p>Onu bile düşünen kalbin, benim en sevdiğim yerlerinden biri.</p>'));

  function moveSecretButton(){
    if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const maxX=Math.min(innerWidth*.28,220),maxY=Math.min(innerHeight*.14,92);
    const x=(Math.random()-.5)*maxX*2,y=8+Math.random()*maxY;
    const rot=(Math.random()-.5)*8;
    secretButton.style.setProperty('--secret-x',`${x}px`);
    secretButton.style.setProperty('--secret-y',`${y}px`);
    secretButton.style.setProperty('--secret-r',`${rot}deg`);
  }

  function showSecretFinal(){
    secretFinished=true;
    secretButton.textContent='Artık her şeyi gördün 🤍';
    secretButton.classList.add('is-found');
    openModal(`
      <div class="secret-final" aria-live="polite">
        <span class="secret-heart">♡</span>
        <p class="secret-line secret-line-1">İyi ki butona bastın… 🤍</p>
        <p class="secret-line secret-line-2">Yoksa bunu göremezdin.</p>
        <h3 class="secret-love secret-line-3">Seni çoooooook seviyorum Gabilim, 7 “o”yla hem de. 🤍</h3>
      </div>
    `,'secret-modal');
    const r=secretButton.getBoundingClientRect();
    window.secretHeartShower?.(r.left+r.width/2,r.top+r.height/2);
    setTimeout(()=>window.secretHeartShower?.(innerWidth/2,innerHeight*.36),900);
  }

  secretButton.addEventListener('pointerenter',()=>{
    if(!secretFinished && matchMedia('(pointer:fine)').matches && Math.random()>.35) moveSecretButton();
  });
  let secretWander=setInterval(()=>{if(!secretFinished&&!modal.classList.contains('is-open'))moveSecretButton()},6500);

  secretButton.addEventListener('click',()=>{
    if(secretFinished){
      openModal('<div class="secret-final compact"><span class="secret-heart">♡</span><h3>Hepsini gördün artık. 😌🤍</h3></div>','secret-modal');
      window.secretHeartShower?.(innerWidth/2,innerHeight*.45);
      return;
    }
    moveSecretButton();
    if(secretIndex<secrets.length){
      openModal(`<div class="secret-step"><span>${String(secretIndex+1).padStart(2,'0')}</span><h3>Buna basma demiştim</h3><p>${secrets[secretIndex]}</p></div>`,'secret-modal');
      const r=secretButton.getBoundingClientRect();
      window.secretHeartShower?.(r.left+r.width/2,r.top+r.height/2);
      secretIndex++;
    }else{
      showSecretFinal();
    }
  });

  document.getElementById('modalClose').addEventListener('click',closeModal);
  modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});
  function openModal(html,variant=''){
    modalContent.innerHTML=html;
    modal.className=`modal is-open ${variant}`.trim();
    modal.setAttribute('aria-hidden','false')
  }
  function closeModal(){modal.className='modal';modal.setAttribute('aria-hidden','true')}

  const candle=document.querySelector('.candle');
  document.getElementById('blowCandle').addEventListener('click',()=>{candle.classList.add('is-out');window.heartBurst?.(innerWidth/2,innerHeight*.4,24);setTimeout(()=>go(index+1),1100)});
  document.getElementById('replayBtn').addEventListener('click',()=>{accepted.classList.remove('is-visible');leagueNext.classList.remove('is-visible');request.removeAttribute('style');candle.classList.remove('is-out');go(0)});
  document.getElementById('soundToggle').addEventListener('click',e=>{soundOn=!soundOn;e.currentTarget.textContent=soundOn?'♫':'♪';e.currentTarget.setAttribute('aria-label',soundOn?'Ses açık':'Ses kapalı')});

  document.querySelectorAll('.tilt-card,.memory').forEach(card=>{
    card.addEventListener('pointermove',e=>{if(matchMedia('(pointer:coarse)').matches)return;const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(900px) rotateX(${-y*5}deg) rotateY(${x*7}deg) translateY(-4px)`});
    card.addEventListener('pointerleave',()=>card.style.transform='')
  });
  addEventListener('pointermove',e=>{document.documentElement.style.setProperty('--px',e.clientX+'px');document.documentElement.style.setProperty('--py',e.clientY+'px')},{passive:true});
  addEventListener('load',()=>setTimeout(()=>loader.classList.add('is-hidden'),700));
  setTimeout(()=>loader.classList.add('is-hidden'),1800);
  update();
})();
