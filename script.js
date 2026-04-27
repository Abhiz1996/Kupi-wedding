const openInvitationCta = document.querySelector("#openInvitationCta");
const countdownGrid = document.querySelector("#countdownGrid");
const revealTargets = document.querySelectorAll(".reveal");
const petalLayer = document.querySelector("#petalLayer");

const weddingDate = new Date("2026-06-17T10:00:00+05:30");

document.body.classList.add("motion-ready");

function updateCountdown() {
  if (!countdownGrid) {
    return;
  }

  const now = new Date();
  const distance = Math.max(weddingDate.getTime() - now.getTime(), 0);
  const values = [
    Math.floor(distance / (1000 * 60 * 60 * 24)),
    Math.floor((distance / (1000 * 60 * 60)) % 24),
    Math.floor((distance / (1000 * 60)) % 60),
    Math.floor((distance / 1000) % 60)
  ];

  countdownGrid.querySelectorAll("strong").forEach((slot, index) => {
    slot.textContent = String(values[index]).padStart(2, "0");
  });
}

function startEnvelopeSequence() {
  if (!openInvitationCta) {
    return;
  }

  document.body.classList.add("invitation-opening");

  window.setTimeout(() => {
    window.location.href = "invitation.html?opened=1";
  }, 2150);
}

function setupRevealObserver() {
  if (!revealTargets.length) {
    return;
  }

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

openInvitationCta?.addEventListener("click", startEnvelopeSequence);

updateCountdown();
window.setInterval(updateCountdown, 1000);
setupRevealObserver();
createPetals();
