(() => {
  "use strict";

  const scenes = [...document.querySelectorAll(".scene")];
  const progress = document.getElementById("progressFill");
  const counter = document.getElementById("sceneCounter");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modalContent");
  const secretButton = document.getElementById("secretButton");
  let index = 0;
  let locked = false;
  let secretStep = 0;
  let secretDone = false;

  const secrets = [
    "Basma demiştim. 🤍",
    "Yine bastın…",
    "Seni tanıyorum çünkü. 😌",
    "Bir daha basacağını biliyordum.",
    "Tamam tamam… Çok meraklısın. 😂",
    "Sana küçük bir sır göstereceğim…",
    "Hazır mısın? 👀"
  ];

  function updateUI() {
    progress.style.width = `${((index + 1) / scenes.length) * 100}%`;
    counter.textContent = `${String(index + 1).padStart(2, "0")} / ${String(scenes.length).padStart(2, "0")}`;
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === scenes.length - 1;
  }

  function go(to) {
    if (locked || to < 0 || to >= scenes.length || to === index) return;
    locked = true;
    const old = scenes[index];
    const forward = to > index;
    old.classList.add(forward ? "leaving-forward" : "leaving-back");

    window.setTimeout(() => {
      old.classList.remove("active", "leaving-forward", "leaving-back");
      index = to;
      scenes[index].classList.add("active");
      updateUI();

      if (scenes[index].dataset.scene === "final") {
        heartRain(36);
        constellationActive = true;
        constellationProgress = 0;
      } else {
        constellationActive = false;
        constellationProgress = 0;
      }
      window.setTimeout(() => { locked = false; }, 350);
    }, 500);
  }

  document.querySelectorAll(".next").forEach(btn => btn.addEventListener("click", () => go(index + 1)));
  prevBtn.addEventListener("click", () => go(index - 1));
  nextBtn.addEventListener("click", () => go(index + 1));

  document.addEventListener("keydown", event => {
    if (modal.classList.contains("open")) {
      if (event.key === "Escape") closeModal();
      return;
    }
    if (event.key === "ArrowRight" || event.key === " ") go(index + 1);
    if (event.key === "ArrowLeft") go(index - 1);
  });

  let touchStart = 0;
  document.addEventListener("touchstart", event => {
    touchStart = event.changedTouches[0].clientX;
  }, { passive: true });
  document.addEventListener("touchend", event => {
    if (modal.classList.contains("open")) return;
    const delta = event.changedTouches[0].clientX - touchStart;
    if (Math.abs(delta) > 70) go(index + (delta < 0 ? 1 : -1));
  }, { passive: true });

  const requestCard = document.getElementById("requestCard");
  const acceptBtn = document.getElementById("acceptBtn");
  const declineBtn = document.getElementById("declineBtn");
  const acceptedMessage = document.getElementById("acceptedMessage");
  const leagueNext = document.querySelector(".league-next");

  acceptBtn.addEventListener("click", () => {
    requestCard.style.opacity = "0";
    requestCard.style.transform = "translate(-50%,-50%) scale(.9)";
    window.setTimeout(() => {
      requestCard.style.visibility = "hidden";
      acceptedMessage.classList.add("show");
      leagueNext.classList.add("show");
      heartBurst(innerWidth / 2, innerHeight / 2, 26);
    }, 430);
  });

  function dodgeDecline(event) {
    event.preventDefault();
    const x = (Math.random() > .5 ? 1 : -1) * (65 + Math.random() * 80);
    const y = (Math.random() - .5) * 80;
    declineBtn.style.transform = `translate(${x}px,${y}px) rotate(${(Math.random() - .5) * 8}deg)`;
  }
  ["pointerenter", "pointerdown", "click", "touchstart"].forEach(type => {
    declineBtn.addEventListener(type, dodgeDecline, { passive: false });
  });
  declineBtn.tabIndex = -1;

  function openModal(html) {
    modalContent.innerHTML = html;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  }
  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }
  document.getElementById("modalClose").addEventListener("click", closeModal);
  modal.addEventListener("click", event => {
    if (event.target === modal) closeModal();
  });

  document.getElementById("snail").addEventListener("click", () => {
    openModal('<div class="modal-snail">🐌</div><h3>Gizli not</h3><p>Onu bile düşünen kalbin, benim en sevdiğim yerlerinden biri.</p>');
  });

  function moveSecret() {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || secretDone) return;
    const x = (Math.random() - .5) * Math.min(innerWidth * .44, 380);
    const y = Math.random() * Math.min(innerHeight * .18, 110);
    secretButton.style.setProperty("--sx", `${x}px`);
    secretButton.style.setProperty("--sy", `${y}px`);
    secretButton.style.setProperty("--sr", `${(Math.random() - .5) * 9}deg`);
  }

  secretButton.addEventListener("pointerenter", () => {
    if (matchMedia("(pointer:fine)").matches && Math.random() > .35) moveSecret();
  });
  window.setInterval(() => {
    if (!modal.classList.contains("open")) moveSecret();
  }, 6200);

  secretButton.addEventListener("click", () => {
    if (secretDone) {
      openModal('<h3>Hepsini gördün artık. 😌🤍</h3>');
      heartBurst(innerWidth / 2, innerHeight * .42, 20);
      return;
    }

    moveSecret();
    if (secretStep < secrets.length) {
      openModal(`<small>${String(secretStep + 1).padStart(2, "0")}</small><h3>Buna basma demiştim</h3><p>${secrets[secretStep]}</p>`);
      const rect = secretButton.getBoundingClientRect();
      heartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 12);
      secretStep += 1;
    } else {
      secretDone = true;
      secretButton.textContent = "Artık her şeyi gördün 🤍";
      openModal('<div class="loader-heart">♡</div><p>İyi ki butona bastın… 🤍</p><p>Yoksa bunu göremezdin.</p><h3 class="secret-love">Seni çoooooook seviyorum Gabilim. 🤍<br><small>Hem de tam 7 “o” ile… ❤️</small></h3>');
      heartRain(30);
    }
  });

  const candle = document.querySelector(".candle");
  document.getElementById("blowCandle").addEventListener("click", () => {
    candle.classList.add("out");
    heartBurst(innerWidth / 2, innerHeight * .4, 22);
    window.setTimeout(() => go(index + 1), 1050);
  });

  document.getElementById("replayBtn").addEventListener("click", () => {
    acceptedMessage.classList.remove("show");
    leagueNext.classList.remove("show");
    requestCard.removeAttribute("style");
    candle.classList.remove("out");
    go(0);
  });

  document.getElementById("soundToggle").addEventListener("click", event => {
    const on = event.currentTarget.textContent === "♪";
    event.currentTarget.textContent = on ? "♫" : "♪";
    event.currentTarget.setAttribute("aria-label", on ? "Ses açık" : "Ses kapalı");
  });

  document.addEventListener("pointermove", event => {
    document.documentElement.style.setProperty("--px", `${event.clientX}px`);
    document.documentElement.style.setProperty("--py", `${event.clientY}px`);
  }, { passive: true });

  // Background stars and occasional shooting star.
  const starCanvas = document.getElementById("stars");
  const starCtx = starCanvas.getContext("2d");
  let stars = [];
  let shooter = null;
  let nextShooter = performance.now() + 3500;

  // Physical hearts with gravity, bounce and a soft bottom pile.
  const heartCanvas = document.getElementById("hearts");
  const heartCtx = heartCanvas.getContext("2d");
  let hearts = [];
  let floorBins = [];

  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    [starCanvas, heartCanvas].forEach(canvas => {
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;
      canvas.getContext("2d").setTransform(dpr, 0, 0, dpr, 0, 0);
    });

    stars = Array.from({ length: innerWidth < 700 ? 75 : 145 }, () => ({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      r: .25 + Math.random() * 1.15,
      a: .15 + Math.random() * .65,
      p: Math.random() * Math.PI * 2
    }));
    floorBins = Array.from({ length: Math.max(14, Math.floor(innerWidth / 34)) }, () => 0);
  }

  function drawHeart(ctx, size) {
    ctx.beginPath();
    ctx.moveTo(0, size * .3);
    ctx.bezierCurveTo(-size * .8, -size * .25, -size * .72, size * .7, 0, size);
    ctx.bezierCurveTo(size * .72, size * .7, size * .8, -size * .25, 0, size * .3);
    ctx.closePath();
  }

  function spawnHeart(x = Math.random() * innerWidth, y = -30, extra = {}) {
    hearts.push({
      x, y,
      vx: extra.vx ?? ((Math.random() - .5) * 1.2),
      vy: extra.vy ?? (Math.random() * .7),
      size: extra.size ?? (9 + Math.random() * 12),
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - .5) * .05,
      life: 0,
      max: extra.max ?? (850 + Math.random() * 450),
      alpha: extra.alpha ?? (.42 + Math.random() * .3),
      bounce: 0,
      resting: false,
      level: null
    });
  }

  function heartBurst(x, y, amount = 18) {
    for (let i = 0; i < amount; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4.5;
      spawnHeart(x, y, {
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.4,
        size: 8 + Math.random() * 13,
        alpha: .65 + Math.random() * .25,
        max: 720 + Math.random() * 400
      });
    }
  }

  function heartRain(amount = 24) {
    for (let i = 0; i < amount; i += 1) {
      window.setTimeout(() => spawnHeart(Math.random() * innerWidth, -35, {
        size: 10 + Math.random() * 14,
        alpha: .55 + Math.random() * .28,
        max: 1050 + Math.random() * 500
      }), i * 75);
    }
  }

  function render(time) {
    starCtx.clearRect(0, 0, innerWidth, innerHeight);
    stars.forEach(star => {
      const alpha = star.a * (.62 + .38 * Math.sin(time * .0012 + star.p));
      starCtx.fillStyle = `rgba(255,255,255,${alpha})`;
      starCtx.beginPath();
      starCtx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      starCtx.fill();
    });

    if (!shooter && time > nextShooter) {
      shooter = {
        x: innerWidth * (.55 + Math.random() * .38),
        y: innerHeight * (.04 + Math.random() * .25),
        vx: -(10 + Math.random() * 4),
        vy: 4.5 + Math.random() * 2.5,
        life: 0,
        max: 55
      };
      nextShooter = time + 11000 + Math.random() * 14000;
    }

    if (shooter) {
      shooter.x += shooter.vx;
      shooter.y += shooter.vy;
      shooter.life += 1;
      const fade = Math.sin((shooter.life / shooter.max) * Math.PI);
      const length = 155;
      const magnitude = Math.hypot(shooter.vx, shooter.vy);
      const nx = shooter.vx / magnitude;
      const ny = shooter.vy / magnitude;
      const gradient = starCtx.createLinearGradient(shooter.x, shooter.y, shooter.x - nx * length, shooter.y - ny * length);
      gradient.addColorStop(0, `rgba(255,255,255,${fade})`);
      gradient.addColorStop(.22, `rgba(169,240,223,${fade * .72})`);
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      starCtx.strokeStyle = gradient;
      starCtx.lineWidth = 2;
      starCtx.beginPath();
      starCtx.moveTo(shooter.x, shooter.y);
      starCtx.lineTo(shooter.x - nx * length, shooter.y - ny * length);
      starCtx.stroke();
      if (shooter.life > shooter.max) shooter = null;
    }

    heartCtx.clearRect(0, 0, innerWidth, innerHeight);
    hearts.forEach(heart => {
      heart.life += 1;
      heart.vy += .045;
      heart.vx *= .995;
      heart.x += heart.vx;
      heart.y += heart.vy;
      heart.rot += heart.vr;

      const bin = Math.max(0, Math.min(floorBins.length - 1, Math.floor((heart.x / innerWidth) * floorBins.length)));
      if (heart.level === null) heart.level = Math.min(floorBins[bin], innerWidth < 700 ? 5 : 7);
      const floorY = innerHeight - heart.size * .55 - heart.level * heart.size * .38;

      if (heart.y > floorY) {
        heart.y = floorY;
        if (Math.abs(heart.vy) > .45 && heart.bounce < 4) {
          heart.vy *= -.38;
          heart.vx *= .8;
          heart.bounce += 1;
        } else {
          heart.vy = 0;
          heart.vx *= .78;
          heart.vr *= .7;
          if (!heart.resting) {
            heart.resting = true;
            floorBins[bin] = Math.min(floorBins[bin] + 1, innerWidth < 700 ? 6 : 8);
          }
        }
      }

      const age = heart.life / heart.max;
      const fade = age < .86 ? 1 : Math.max(0, 1 - (age - .86) / .14);
      heartCtx.save();
      heartCtx.translate(heart.x, heart.y);
      heartCtx.rotate(heart.rot);
      heartCtx.globalAlpha = heart.alpha * fade;
      const gradient = heartCtx.createLinearGradient(-heart.size, -heart.size, heart.size, heart.size);
      gradient.addColorStop(0, "#ffffff");
      gradient.addColorStop(.42, "#ffafd2");
      gradient.addColorStop(1, "#bba8ff");
      heartCtx.fillStyle = gradient;
      heartCtx.shadowColor = "rgba(255,175,210,.65)";
      heartCtx.shadowBlur = 13;
      drawHeart(heartCtx, heart.size);
      heartCtx.fill();
      heartCtx.restore();
    });

    hearts = hearts.filter(heart => heart.life < heart.max);
    requestAnimationFrame(render);
  }

  window.addEventListener("resize", resize);
  resize();
  for (let i = 0; i < 10; i += 1) spawnHeart(Math.random() * innerWidth, Math.random() * innerHeight * .4 - 300, { alpha: .28, max: 1100 + Math.random() * 500 });
  window.setInterval(() => {
    if (!document.hidden && hearts.length < 80) spawnHeart(undefined, -30, { alpha: .34, max: 1150 });
  }, innerWidth < 700 ? 1250 : 900);
  requestAnimationFrame(render);



  // Final scene heart constellation.
  const constellationCanvas = document.getElementById("finalConstellation");
  const constellationCtx = constellationCanvas.getContext("2d");
  let constellationPoints = [];
  let constellationProgress = 0;
  let constellationActive = false;

  function buildHeartConstellation() {
    const points = [];
    const count = innerWidth < 700 ? 70 : 110;
    const cx = innerWidth / 2;
    const cy = innerHeight * .52;
    const scale = Math.min(innerWidth, innerHeight) * (innerWidth < 700 ? .014 : .018);

    for (let i = 0; i < count; i += 1) {
      const t = (i / count) * Math.PI * 2;
      const x = 16 * Math.sin(t) ** 3;
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      points.push({
        x: cx + x * scale,
        y: cy - y * scale,
        a: .35 + Math.random() * .55,
        r: .6 + Math.random() * 1.4,
        phase: Math.random() * Math.PI * 2
      });
    }
    constellationPoints = points;
  }

  function resizeConstellation() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    constellationCanvas.width = innerWidth * dpr;
    constellationCanvas.height = innerHeight * dpr;
    constellationCanvas.style.width = `${innerWidth}px`;
    constellationCanvas.style.height = `${innerHeight}px`;
    constellationCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildHeartConstellation();
  }

  function drawConstellation(time) {
    constellationCtx.clearRect(0, 0, innerWidth, innerHeight);
    if (constellationActive) {
      constellationProgress += (1 - constellationProgress) * .018;
      const visibleCount = Math.floor(constellationPoints.length * constellationProgress);

      for (let i = 0; i < visibleCount; i += 1) {
        const p = constellationPoints[i];
        const twinkle = .55 + .45 * Math.sin(time * .0018 + p.phase);
        constellationCtx.fillStyle = `rgba(255,255,255,${p.a * twinkle * .72})`;
        constellationCtx.shadowColor = "rgba(255,175,210,.72)";
        constellationCtx.shadowBlur = 12;
        constellationCtx.beginPath();
        constellationCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        constellationCtx.fill();

        if (i > 0 && i % 5 === 0) {
          const prev = constellationPoints[i - 1];
          constellationCtx.strokeStyle = "rgba(255,175,210,.08)";
          constellationCtx.lineWidth = .7;
          constellationCtx.beginPath();
          constellationCtx.moveTo(prev.x, prev.y);
          constellationCtx.lineTo(p.x, p.y);
          constellationCtx.stroke();
        }
      }
      constellationCtx.shadowBlur = 0;
    }
    requestAnimationFrame(drawConstellation);
  }

  window.addEventListener("resize", resizeConstellation);
  resizeConstellation();
  requestAnimationFrame(drawConstellation);

  window.addEventListener("load", () => {
    window.setTimeout(() => document.getElementById("loader").classList.add("hide"), 650);
  });
  window.setTimeout(() => document.getElementById("loader").classList.add("hide"), 1800);
  updateUI();
})();
