(() => {
  const $ = id => document.getElementById(id);
  const screens = [...document.querySelectorAll('.screen')];
  let current = 'welcome', transitioning = false, letterOpened = false;
  const audio = $('birthday-music'), musicButton = $('music-toggle'), musicLabel = $('music-label');
  // Show the music control only if the optional file can actually be loaded.
  audio.addEventListener('canplay', () => { musicButton.hidden = false; });
  audio.addEventListener('error', () => { musicButton.hidden = true; });
  audio.addEventListener('play', () => { musicButton.classList.add('playing'); musicLabel.textContent='Sonando'; musicButton.setAttribute('aria-label','Pausar música'); });
  audio.addEventListener('pause', () => { musicButton.classList.remove('playing'); musicLabel.textContent='Música'; musicButton.setAttribute('aria-label','Reproducir música'); });
  musicButton.addEventListener('click', async () => {
    if(audio.paused){try{await audio.play();}catch(e){musicLabel.textContent='No disponible';}}
    else audio.pause();
  });

  function show(id) {
    if(transitioning || current===id)return;
    transitioning=true;
    const old=$(current); old.classList.add('leaving'); old.setAttribute('aria-hidden','true');
    window.setTimeout(()=>{
      old.classList.remove('active','leaving');
      const next=$(id); next.classList.add('active'); next.setAttribute('aria-hidden','false');
      current=id; transitioning=false;
      if(id==='heart-scene') document.body.classList.add('heart-mode');
      else document.body.classList.remove('heart-mode');
    },650);
  }
  $('start-btn').addEventListener('click', e => {
    const button=e.currentTarget;if(button.disabled)return;button.disabled=true;button.classList.add('launching');
    window.HeartFX.form();
    show('heart-scene');
    // Re-enable only after the journey is reset.
  });
  window.addEventListener('heart:formed',()=>{
    const btn=$('more-btn');btn.classList.add('arrive');
    $('birthday-title').classList.add('revealed');
  });
  $('more-btn').addEventListener('click',()=>{window.HeartFX.burst();show('letter-scene');});
  window.addEventListener('heart:burstDone',()=>{});
  $('open-letter').addEventListener('click',()=>{
    if(letterOpened)return;letterOpened=true;
    $('envelope').classList.add('open');$('open-letter').setAttribute('aria-expanded','true');
    window.setTimeout(()=>{$('memories-btn').classList.remove('hidden');$('memories-btn').focus({preventScroll:true});},850);
  });
  $('memories-btn').addEventListener('click',()=>show('memories-scene'));
  $('wish-btn').addEventListener('click',()=>show('wish-scene'));
  $('final-btn').addEventListener('click',()=>{
    show('final-scene');
    window.HeartFX.form();
    window.setTimeout(()=>{if(current==='final-scene')window.HeartFX.burst();},6500);
  });
  $('restart-btn').addEventListener('click',()=>{
    window.HeartFX.reset();letterOpened=false;
    $('envelope').classList.remove('open');$('open-letter').setAttribute('aria-expanded','false');
    $('memories-btn').classList.add('hidden');$('start-btn').disabled=false;$('start-btn').classList.remove('launching');
    $('more-btn').classList.remove('arrive');$('birthday-title').classList.remove('revealed');
    show('welcome');
  });

  const modal=$('photo-modal');
  document.querySelectorAll('.polaroid').forEach(card=>card.addEventListener('click',()=>{
    $('modal-caption').textContent=card.dataset.caption||'Un recuerdo para guardar.';
    modal.hidden=false;$('modal-close').focus();
  }));
  function closeModal(){modal.hidden=true;}
  $('modal-close').addEventListener('click',closeModal);
  modal.addEventListener('click',e=>{if(e.target===modal)closeModal();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)closeModal();});
})();