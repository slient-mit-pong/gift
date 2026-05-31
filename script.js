// Core interactions for the gift page
const qs = (s) => document.querySelector(s);
const qsa = (s) => Array.from(document.querySelectorAll(s));

/* Stars canvas */
const canvas = qs("#stars");
const ctx = canvas.getContext("2d");
let W,
  H,
  stars = [],
  t = 0;
function resize() {
  W = canvas.width = innerWidth;
  H = canvas.height = innerHeight;
  initStars();
}
window.addEventListener("resize", resize);
function initStars() {
  stars = [];
  let count = Math.floor((W * H) / 4500);
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2.2 + 0.6,
      baseA: 0.5 + Math.random() * 0.6,
      v: Math.random() * 0.04 + 0.006,
      tw: 0.002 + Math.random() * 0.02,
      phase: Math.random() * Math.PI * 2,
    });
  }
}
function drawStars() {
  ctx.clearRect(0, 0, W, H);
  t += 1;
  for (const s of stars) {
    s.y -= s.v * 18;
    if (s.y < 0) s.y = H + Math.random() * 20;
    const alpha =
      s.baseA * (0.6 + 0.4 * Math.abs(Math.sin(t * s.tw + s.phase)));
    ctx.beginPath();
    ctx.globalAlpha = Math.min(1, alpha);
    ctx.fillStyle = "#fff8f9";
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }
  requestAnimationFrame(drawStars);
}
resize();
drawStars();

/* Navigation between panels */
function showPanel(id) {
  qsa(".panel").forEach((p) => p.classList.remove("active", "opening"));
  const panel = qs("#" + id);
  panel.classList.add("active", "opening");
  // Remove opening class after animation completes to allow re-trigger
  setTimeout(() => {
    panel.classList.remove("opening");
  }, 600);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* Intro start */
qs("#startBtn").addEventListener("click", () => {
  // small burst of lights
  spawnParticles(26);
  setTimeout(() => {
    showPanel("wishes");
    startTyping();
  }, 520);
});

function spawnParticles(n) {
  for (let i = 0; i < n; i++) {
    const p = document.createElement("div");
    p.className = "floating-particle";
    document.body.appendChild(p);
    const left = 50 + (Math.random() * 140 - 70);
    const top = 72 + (Math.random() * 40 - 20);
    p.style.left = left + "%";
    p.style.top = top + "%";
    p.style.opacity = 1;
    const dx = Math.random() * 300 - 150;
    const dy = -(120 + Math.random() * 380);
    p.animate(
      [
        { transform: "translate(0,0) scale(.6)", opacity: 1 },
        { transform: `translate(${dx}px,${dy}px) scale(1.2)`, opacity: 0 },
      ],
      {
        duration: 1000 + Math.random() * 700,
        easing: "cubic-bezier(.2,.9,.2,1)",
      },
    );
    setTimeout(() => p.remove(), 1800);
  }
}

/* Typewriter for wishes */
const wishes = [
  "Chúc cậu có một ngày 1/6 thật vui vẻ.",
  "Tuổi thơ có thể sắp khép lại, nhưng mong cậu vẫn luôn giữ được nụ cười vô tư ấy.",
  "Cảm ơn vì đã xuất hiện trong những ngày rất bình thường của tớ.",
  "Dù chúng ta quen nhau chưa lâu, nhưng lại mang đến cảm giác như đã biết nhau từ rất lâu rồi.",
  "Không phải ai cũng có thể khiến một người mong chờ tin nhắn mỗi ngày.",
  "Và bằng cách nào đó, cậu đã làm được điều đó.",
];
let typingIndex = 0;
function typeLine(line, el, cb) {
  el.innerHTML = "";
  let i = 0;
  function step() {
    if (i < line.length) {
      el.innerHTML += line[i++];
      setTimeout(step, 15 + Math.random() * 15);
    } else {
      setTimeout(cb, 400);
    }
  }
  step();
}
function startTyping() {
  const el = qs("#typed");
  el.innerHTML = "";
  typingIndex = 0;
  function next() {
    if (typingIndex < wishes.length) {
      const p = document.createElement("p");
      p.className = "highlight";
      el.appendChild(p);
      typeLine(wishes[typingIndex], p, () => {
        typingIndex++;
        next();
      });
    } else {
      qs("#wishes .next-row .btn").focus();
    }
  }
  next();
}

/* Data-next buttons */
qsa(".btn[data-next]").forEach((b) =>
  b.addEventListener("click", (e) => {
    const target = e.currentTarget.dataset.next;
    if (target === "special") {
      openEnvelope();
    }
    showPanel(target);
  }),
);

/* Envelope open */
function openEnvelope() {
  const env = qs("#envelope");
  env.classList.add("open");
  setTimeout(() => {
    qs("#letterContent").classList.remove("hidden");
  }, 650);
}

/* Ending sequence: reveal lines one by one */
function revealFinal() {
  const ps = qsa("#finalLines p");
  let k = 0;
  function show() {
    if (k < ps.length) {
      ps[k].classList.add("show");
      k++;
      setTimeout(show, 500);
    } else {
      /* done */
    }
  }
  show();
}
qs("#ending .btn")?.addEventListener("click", () => {
  revealFinal();
});

/* Hug button */
qs("#hugBtn").addEventListener("click", () => {
  burstHearts();
});
function burstHearts() {
  const container = qs("#heartBurst");
  for (let i = 0; i < 18; i++) {
    const el = document.createElement("div");
    el.className = "heart";
    container.appendChild(el);
    const x = innerWidth / 2 + (Math.random() * 300 - 150);
    const y = innerHeight / 2 + (Math.random() * 80 - 40);
    el.style.left = x + "px";
    el.style.top = y + "px";
    const dx = Math.random() * 600 - 300,
      dy = -(200 + Math.random() * 600);
    el.animate(
      [
        { transform: "translate(-50%,-50%) scale(0.3)", opacity: 1 },
        { transform: `translate(${dx}px,${dy}px) scale(1)`, opacity: 0 },
      ],
      {
        duration: 1200 + Math.random() * 800,
        easing: "cubic-bezier(.2,.9,.2,1)",
      },
    );
    setTimeout(() => el.remove(), 2200);
  }
}

/* Floating clovers for luck on exam panel */
function floatClovers() {
  const container = qs("#exam");
  for (let i = 0; i < 10; i++) {
    const el = document.createElement("div");
    el.className = "pill";
    el.style.position = "absolute";
    el.style.left = 10 + Math.random() * 80 + "%";
    el.style.top = 40 + Math.random() * 40 + "%";
    el.style.opacity = 0.12;
    el.style.transform = "rotate(" + (Math.random() * 40 - 20) + "deg)";
    container.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  }
}
qs("#exam")?.addEventListener("mouseover", () => floatClovers());

/* HTML5 Audio for background music */
let musicOn = false;
const musicBtn = qs("#musicToggle");
const bgAudio = qs("#bgMusic");

function startMusic() {
  if (!bgAudio) return;
  bgAudio.volume = 0.4;
  bgAudio.play().catch(() => {
    // Autoplay blocked
    musicOn = false;
  });
}

function stopMusic() {
  if (!bgAudio) return;
  bgAudio.pause();
}

musicBtn.addEventListener("click", () => {
  if (!musicOn) {
    startMusic();
    musicOn = true;
    musicBtn.textContent = "Nhạc nền: Bật";
    musicBtn.classList.remove("ghost");
  } else {
    stopMusic();
    musicOn = false;
    musicBtn.textContent = "Nhạc nền: Tắt";
    musicBtn.classList.add("ghost");
  }
});

// Try to start music automatically on load
window.addEventListener("load", async () => {
  try {
    startMusic();
    musicOn = true;
    musicBtn.textContent = "Nhạc nền: Bật";
    musicBtn.classList.remove("ghost");
  } catch (e) {
    // Autoplay blocked — leave it for user interaction
    musicOn = false;
  }
});

/* small helper: focus next buttons */
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const active = document.querySelector(".panel.active");
    const b = active.querySelector(".btn");
    if (b) b.click();
  }
});

// Initialize: show intro
showPanel("intro");
