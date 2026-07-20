(() => {
  const starCanvas=document.getElementById('starfield'), heartCanvas=document.getElementById('hearts');
  const s=starCanvas.getContext('2d'), h=heartCanvas.getContext('2d');
  let w=0,hg=0,dpr=1,stars=[],hearts=[],shooters=[],orbitUntil=0,floorBins=[];
  const mobile=matchMedia('(max-width:700px)').matches;

  function resize(){
    w=innerWidth;hg=innerHeight;dpr=Math.min(devicePixelRatio||1,2);
    for(const c of [starCanvas,heartCanvas]){c.width=w*dpr;c.height=hg*dpr;c.style.width=w+'px';c.style.height=hg+'px'}
    s.setTransform(dpr,0,0,dpr,0,0);h.setTransform(dpr,0,0,dpr,0,0);
    stars=Array.from({length:mobile?70:140},()=>({x:Math.random()*w,y:Math.random()*hg,r:Math.random()*1.25+.2,a:Math.random()*.65+.15,p:Math.random()*6.28,z:Math.random()*.002+.0004}));
    floorBins=Array.from({length:Math.max(12,Math.floor(w/38))},()=>0)
  }

  function heartPath(ctx,x,y,size,rot){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(size/24,size/24);ctx.beginPath();ctx.moveTo(0,7);ctx.bezierCurveTo(-18,-5,-12,-18,0,-10);ctx.bezierCurveTo(12,-18,18,-5,0,7);ctx.restore()}

  function addHeart(data={}){
    hearts.push({
      x:data.x??Math.random()*w,y:data.y??-30,vx:data.vx??(Math.random()-.5)*1.2,vy:data.vy??(Math.random()*.9+.5),
      size:data.size??(Math.random()*13+10),rot:data.rot??Math.random()*6.28,vr:data.vr??((Math.random()-.5)*.025),
      a:data.a??(Math.random()*.40+.34),life:0,max:data.max??(500+Math.random()*240),settle:!!data.settle,bounces:0,
      orbit:!!data.orbit,phase:data.phase??Math.random()*Math.PI*2,radius:data.radius??(70+Math.random()*75),speed:data.speed??(.00045+Math.random()*.00035),
      floorLevel:data.floorLevel??null,resting:false
    })
  }

  function spawnHeart(x=Math.random()*w,y=-30,count=1,opts={}){for(let i=0;i<count;i++)addHeart({...opts,x:x+(Math.random()-.5)*40,y:y+(Math.random()-.5)*20})}
  function burst(x,y,count=16){for(let i=0;i<count;i++){const a=Math.random()*Math.PI*2,sp=Math.random()*4+1;addHeart({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-1,size:Math.random()*12+7,rot:a,vr:(Math.random()-.5)*.08,a:.65,max:130+Math.random()*80})}}

  function secretShower(x=w/2,y=hg*.28){
    const count=mobile?18:30;
    for(let i=0;i<count;i++){
      setTimeout(()=>{
        const a=Math.random()*Math.PI*2,sp=1.2+Math.random()*3.2;
        addHeart({x:x+(Math.random()-.5)*45,y:y+(Math.random()-.5)*20,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-2.1,size:8+Math.random()*12,rot:a,vr:(Math.random()-.5)*.06,a:.42+Math.random()*.28,max:520+Math.random()*180,settle:true})
      },i*28)
    }
  }

  function heartOrbit(){
    orbitUntil=performance.now()+9500;
    const count=mobile?10:18;
    for(let i=0;i<count;i++)addHeart({orbit:true,phase:(Math.PI*2/count)*i,radius:75+Math.random()*120,size:6+Math.random()*7,a:.18+Math.random()*.22,max:650})
  }

  window.heartBurst=burst;
  window.heartRain=()=>{for(let i=0;i<(mobile?28:55);i++)setTimeout(()=>spawnHeart(Math.random()*w,-30,1),i*55)};
  window.secretHeartShower=secretShower;
  window.heartOrbit=heartOrbit;

  addEventListener('pointermove',e=>{for(const p of hearts){if(p.orbit)continue;const dx=p.x-e.clientX,dy=p.y-e.clientY,d2=dx*dx+dy*dy;if(d2<9000&&d2>1){const d=Math.sqrt(d2),f=(1-d/95)*.28;p.vx+=dx/d*f;p.vy+=dy/d*f}}},{passive:true});
  addEventListener('resize',resize);resize();
  setInterval(()=>{
    if(!document.hidden){
      spawnHeart(Math.random()*w,-30,1,{
        settle:true,
        a:mobile?.48:.42,
        size:10+Math.random()*11,
        max:1050+Math.random()*520
      })
    }
  },mobile?1120:820);
  function scheduleShooter(){
    const delay=11000+Math.random()*9000;
    setTimeout(()=>{
      if(!document.hidden && shooters.length===0){
        shooters.push({x:w*.72+Math.random()*w*.28,y:Math.random()*hg*.22,vx:-10-Math.random()*4.5,vy:4.4+Math.random()*2.2,life:0,max:58+Math.random()*24,length:155+Math.random()*55});
      }
      scheduleShooter();
    },delay)
  }
  scheduleShooter();

  function frame(t){
    s.clearRect(0,0,w,hg);h.clearRect(0,0,w,hg);
    for(const p of stars){const a=p.a*(.5+.5*Math.sin(t*p.z+p.p));s.fillStyle=`rgba(255,255,255,${a})`;s.beginPath();s.arc(p.x,p.y,p.r,0,7);s.fill()}
    for(let i=shooters.length-1;i>=0;i--){const q=shooters[i];q.x+=q.vx;q.y+=q.vy;q.life++;const a=Math.sin(Math.min(1,q.life/q.max)*Math.PI)*.92,mag=Math.hypot(q.vx,q.vy),nx=q.vx/mag,ny=q.vy/mag,len=q.length||170,g=s.createLinearGradient(q.x,q.y,q.x-nx*len,q.y-ny*len);g.addColorStop(0,`rgba(255,255,255,${a})`);g.addColorStop(.16,`rgba(211,246,255,${a*.85})`);g.addColorStop(.48,`rgba(255,175,210,${a*.28})`);g.addColorStop(1,'rgba(255,255,255,0)');s.save();s.shadowBlur=10;s.shadowColor='rgba(220,245,255,.75)';s.lineWidth=1.8;s.strokeStyle=g;s.beginPath();s.moveTo(q.x,q.y);s.lineTo(q.x-nx*len,q.y-ny*len);s.stroke();s.restore();if(q.life>q.max)shooters.splice(i,1)}

    for(let i=hearts.length-1;i>=0;i--){
      const p=hearts[i];p.life++;
      if(p.orbit){
        const progress=Math.min(1,p.life/55),cx=w/2,cy=hg*.54;
        p.phase+=p.speed*16.67;
        p.x=cx+Math.cos(p.phase)*p.radius*progress;
        p.y=cy+Math.sin(p.phase)*p.radius*.42*progress;
        p.rot+=.006;
      }else{
        p.vy+=p.settle?.052:.014;p.vx*=p.settle?.992:.998;p.x+=p.vx;p.y+=p.vy;p.rot+=p.vr;
        if(p.settle){
          const bin=Math.max(0,Math.min(floorBins.length-1,Math.floor((p.x/w)*floorBins.length)));
          if(p.floorLevel===null){
            p.floorLevel=Math.min(floorBins[bin],mobile?4:6);
          }
          const floorY=hg-p.size*.55-(p.floorLevel*p.size*.42);
          if(p.y>floorY){
            p.y=floorY;
            if(Math.abs(p.vy)>.38&&p.bounces<4){
              p.vy*=-.34;
              p.vx*=.76;
              p.bounces++;
            }else{
              p.vy=0;
              p.vx*=.82;
              p.vr*=.68;
              if(!p.resting){
                p.resting=true;
                floorBins[bin]=Math.min((floorBins[bin]||0)+1,mobile?5:7);
              }
            }
          }
        }
      }
      if(p.settle && !p.orbit){
        for(let j=Math.max(0,i-7);j<i;j++){
          const q=hearts[j];
          if(!q?.settle||q.orbit)continue;
          const dx=p.x-q.x,dy=p.y-q.y,min=(p.size+q.size)*.42,d2=dx*dx+dy*dy;
          if(d2>0&&d2<min*min){
            const d=Math.sqrt(d2),push=(min-d)*.018;
            p.vx+=dx/d*push;q.vx-=dx/d*push;
            if(!p.resting)p.vy+=dy/d*push*.25;
          }
        }
      }
      const fadeStart=p.settle?.91:.45;
      const lifeRatio=p.life/p.max;
      const fade=lifeRatio<fadeStart?1:Math.max(0,1-(lifeRatio-fadeStart)/(1-fadeStart));
      h.fillStyle=`rgba(255,175,210,${p.a*fade})`;
      heartPath(h,p.x,p.y,p.size,p.rot);h.fill();
      if((!p.settle&&p.y>hg+60)||p.life>p.max||(p.orbit&&t>orbitUntil))hearts.splice(i,1)
    }
    requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)
})();
