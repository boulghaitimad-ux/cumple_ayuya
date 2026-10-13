(() => {
  const canvas = document.getElementById('heart-canvas');
  const ctx = canvas.getContext('2d', { alpha: true });
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const colors = ['#a5eaff','#73d3f5','#dff8ff','#ffffff','#6ebbe8','#ffc7e2'];
  let width = 0, height = 0, dpr = 1, raf = 0, particles = [], mode = 'ambient';
  let startAt = 0, duration = reducedMotion ? 250 : 5600, burstAt = 0;
  const PARTICLE_COUNT = () => Math.min(460, Math.max(170, Math.floor((width * height) / 2600)));
  const rand = (a,b) => a + Math.random() * (b-a);

  function resize() {
    width = window.innerWidth; height = window.innerHeight; dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width*dpr); canvas.height = Math.floor(height*dpr);
    canvas.style.width = width+'px'; canvas.style.height = height+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    if (mode === 'forming' || mode === 'formed') buildHeart();
  }
  function heartPoint(t, scale=1) {
    const x = 16 * Math.pow(Math.sin(t),3);
    const y = 13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t);
    return {x:x*scale, y:-y*scale};
  }
  function buildHeart() {
    const count = PARTICLE_COUNT();
    const scale = Math.min(width*0.021, height*0.018, 12.8);
    particles = [];
    for(let i=0;i<count;i++){
      const t = Math.random()*Math.PI*2;
      const fill = i < count*.73;
      let p;
      if(fill){
        const edge = heartPoint(t,1);
        const k = Math.sqrt(Math.random());
        p = {x:edge.x*k*scale, y:edge.y*k*scale};
      } else {
        p = heartPoint(t,scale*rand(.96,1.06));
      }
      particles.push({
        x:rand(0,width), y:rand(0,height), sx:rand(0,width), sy:rand(0,height),
        tx:width/2+p.x, ty:height/2+p.y, size:rand(1.5,4.2), color:colors[Math.floor(Math.random()*colors.length)],
        rot:rand(0,Math.PI*2), spin:rand(-.035,.035), alpha:rand(.55,1), phase:rand(0,6.28),
        drift:rand(2,13), trail:Math.random()>.68
      });
    }
  }
  function drawHeart(p, x, y, size) {
    ctx.save(); ctx.translate(x,y); ctx.rotate(p.rot); ctx.globalAlpha=p.alpha;
    ctx.fillStyle=p.color; ctx.shadowColor=p.color; ctx.shadowBlur=p.size*3;
    ctx.beginPath(); ctx.moveTo(0,size*.35);
    ctx.bezierCurveTo(-size*1.25,-size*.45,-size*.72,-size*1.15,0,-size*.48);
    ctx.bezierCurveTo(size*.72,-size*1.15,size*1.25,-size*.45,0,size*.35);
    ctx.fill(); ctx.restore();
  }
  function frame(now) {
    ctx.clearRect(0,0,width,height);
    if(mode==='forming' || mode==='formed' || mode==='burst'){
      const elapsed = now-startAt, progress = mode==='formed' ? 1 : Math.min(1,elapsed/duration);
      const ease = 1-Math.pow(1-progress,3);
      for(const p of particles){
        if(mode==='burst'){
          p.x += p.vx; p.y += p.vy; p.alpha *= .988; p.rot += p.spin;
        } else if(mode==='forming'){
          const wobble = (1-ease)*p.drift;
          p.x += (p.tx-p.x)*(.025+ease*.12);
          p.y += (p.ty-p.y)*(.025+ease*.12);
          p.x += Math.sin(now*.001+p.phase)*wobble*.025;
          p.y += Math.cos(now*.0012+p.phase)*wobble*.025;
          p.rot += p.spin*(1-ease*.75);
          p.alpha = Math.min(1,p.alpha+.012);
        } else {
          p.x=p.tx+Math.sin(now*.0007+p.phase)*1.8;
          p.y=p.ty+Math.cos(now*.0008+p.phase)*1.8;
          p.rot+=p.spin*.1;
        }
        if(p.trail && mode==='forming' && progress<.9){
          ctx.globalAlpha=.16;ctx.strokeStyle=p.color;ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-p.spin*90,p.y+10);ctx.stroke();ctx.globalAlpha=1;
        }
        drawHeart(p,p.x,p.y,p.size);
      }
      if(mode==='forming' && progress>=1){mode='formed';window.dispatchEvent(new CustomEvent('heart:formed'));}
      if(mode==='burst' && particles.every(p=>p.alpha<.035)){mode='ambient';particles=[];window.dispatchEvent(new CustomEvent('heart:burstDone'));}
    } else {
      if(particles.length<90 && !reducedMotion){
        for(let i=0;i<2;i++) particles.push({x:rand(0,width),y:height+10,tx:0,ty:0,size:rand(1.2,3),color:colors[Math.floor(Math.random()*colors.length)],rot:rand(0,6),spin:rand(-.01,.01),alpha:rand(.2,.7),phase:rand(0,6),drift:rand(8,24),ambient:true});
      }
      particles=particles.filter(p=>p.y>-20 && p.alpha>.04);
      for(const p of particles){p.y-=.25+p.drift*.035;p.x+=Math.sin(now*.0005+p.phase)*.25;p.alpha*=.999;drawHeart(p,p.x,p.y,p.size);}
    }
    raf=requestAnimationFrame(frame);
  }
  function form() {
    cancelAnimationFrame(raf); mode='forming'; startAt=performance.now(); duration=reducedMotion?300:5600; buildHeart();
    for(const p of particles){p.x=rand(-40,width+40);p.y=rand(-40,height+40);p.alpha=rand(.5,1);}
    raf=requestAnimationFrame(frame);
  }
  function burst() {
    if(mode==='burst')return;
    mode='burst'; burstAt=performance.now();
    for(const p of particles){const a=Math.atan2(p.y-height/2,p.x-width/2)+rand(-.5,.5),v=rand(2,7);p.vx=Math.cos(a)*v;p.vy=Math.sin(a)*v;p.spin=rand(-.1,.1);}
  }
  function reset(){mode='ambient';particles=[];cancelAnimationFrame(raf);raf=requestAnimationFrame(frame);}
  window.addEventListener('resize',resize,{passive:true});
  window.HeartFX={form,burst,reset};
  resize(); raf=requestAnimationFrame(frame);
})();