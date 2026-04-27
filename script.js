const openInvitationButton = document.querySelector("#openInvitationButton");
const countdownGrid = document.querySelector("#countdownGrid");
const revealTargets = document.querySelectorAll(".reveal");
const petalLayer = document.querySelector("#petalLayer");
const scratchCanvas = document.querySelector("#scratchCanvas");
const scratchCardShell = document.querySelector("#scratchCardShell");
const scratchInstruction = document.querySelector("#scratchInstruction");

const receptionDate = new Date("2026-06-17T18:00:00+05:30");

document.body.classList.add("motion-ready");

function updateCountdown() {
  if (!countdownGrid) {
    return;
  }

  const now = new Date();
  const distance = Math.max(receptionDate.getTime() - now.getTime(), 0);
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  [days, hours, minutes, seconds].forEach((value, index) => {
    const slot = countdownGrid.querySelectorAll("strong")[index];
    if (slot) {
      slot.textContent = String(value).padStart(2, "0");
    }
  });
}

function openInvitation() {
  document.body.classList.add("invitation-opened");
  openInvitationButton?.setAttribute("aria-expanded", "true");

  window.setTimeout(() => {
    document.querySelector("#invitationExperience")?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }, 650);
}

function setupRevealObserver() {
  if (!("IntersectionObserver" in window)) {
    revealTargets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  revealTargets.forEach((target) => observer.observe(target));
}

function createPetals() {
  if (!petalLayer) {
    return;
  }

  for (let index = 0; index < 18; index += 1) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.animationDelay = `${Math.random() * 8}s`;
    petal.style.animationDuration = `${10 + Math.random() * 8}s`;
    petal.style.opacity = `${0.18 + Math.random() * 0.38}`;
    petal.style.transform = `scale(${0.7 + Math.random() * 0.8}) rotate(${Math.random() * 360}deg)`;
    petalLayer.append(petal);
  }
}

function revealScratchCard() {
  scratchCardShell?.classList.add("is-revealed");
  scratchInstruction?.classList.add("is-hidden");
}

function setupScratchCard() {
  if (!scratchCanvas) {
    return;
  }

  const context = scratchCanvas.getContext("2d");
  if (!context) {
    return;
  }

  const paintSurface = () => {
    context.globalCompositeOperation = "source-over";
    const gradient = context.createLinearGradient(0, 0, scratchCanvas.width, scratchCanvas.height);
    gradient.addColorStop(0, "#a98737");
    gradient.addColorStop(0.5, "#c5a54e");
    gradient.addColorStop(1, "#9c7f34");
    context.fillStyle = gradient;
    context.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);

    context.strokeStyle = "rgba(255, 244, 212, 0.34)";
    context.lineWidth = 3;

    for (let index = 0; index < 4; index += 1) {
      const inset = 16 + index * 12;
      context.strokeRect(
        inset,
        inset,
        scratchCanvas.width - inset * 2,
        scratchCanvas.height - inset * 2
      );
    }

    context.fillStyle = "rgba(251, 239, 198, 0.18)";
    context.beginPath();
    context.arc(scratchCanvas.width / 2, scratchCanvas.height / 2, 120, 0, Math.PI * 2);
    context.fill();
  };

  const resizeCanvas = () => {
    const ratio = window.devicePixelRatio || 1;
    const bounds = scratchCanvas.getBoundingClientRect();
    scratchCanvas.width = Math.floor(bounds.width * ratio);
    scratchCanvas.height = Math.floor(bounds.height * ratio);
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.scale(ratio, ratio);
    paintSurface();
  };

  let isDrawing = false;

  const clearAtPoint = (clientX, clientY) => {
    const bounds = scratchCanvas.getBoundingClientRect();
    const x = clientX - bounds.left;
    const y = clientY - bounds.top;

    context.globalCompositeOperation = "destination-out";
    context.beginPath();
    context.arc(x, y, 26, 0, Math.PI * 2);
    context.fill();
  };

  const evaluateReveal = () => {
    const sample = context.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height).data;
    let transparentPixels = 0;

    for (let index = 3; index < sample.length; index += 4) {
      if (sample[index] < 24) {
        transparentPixels += 1;
      }
    }

    const revealedPercent = transparentPixels / (sample.length / 4);
    if (revealedPercent > 0.42) {
      context.clearRect(0, 0, scratchCanvas.width, scratchCanvas.height);
      revealScratchCard();
    }
  };

  const startScratch = (event) => {
    isDrawing = true;
    scratchInstruction?.classList.add("is-hidden");
    clearAtPoint(event.clientX, event.clientY);
  };

  const moveScratch = (event) => {
    if (!isDrawing) {
      return;
    }

    clearAtPoint(event.clientX, event.clientY);
  };

  const stopScratch = () => {
    if (!isDrawing) {
      return;
    }

    isDrawing = false;
    evaluateReveal();
  };

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  scratchCanvas.addEventListener("pointerdown", startScratch);
  scratchCanvas.addEventListener("pointermove", moveScratch);
  scratchCanvas.addEventListener("pointerup", stopScratch);
  scratchCanvas.addEventListener("pointerleave", stopScratch);
}

openInvitationButton?.addEventListener("click", openInvitation);

updateCountdown();
window.setInterval(updateCountdown, 1000);
setupRevealObserver();
createPetals();
setupScratchCard();
