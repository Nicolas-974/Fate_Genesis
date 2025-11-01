// Attendre le DOM
document.addEventListener('DOMContentLoaded', function () {
  const panel = document.getElementById('theme-panel');
  const handle = document.getElementById('theme-handle');
  const btnCycle = document.getElementById('btn-cycle');
  const hotspot = document.getElementById('hotspot');

  if (!panel || !handle || !btnCycle) {
    console.error('Éléments du panneau introuvables');
    return;
  }

  // Toggle open/close au clic sur la poignée
  handle.addEventListener('click', () => {
    panel.classList.toggle('open');
    const isOpen = panel.classList.contains('open');
    panel.setAttribute('aria-expanded', isOpen);

    // Changer le texte de la poignée
    handle.textContent = isOpen ? '»»' : '««';
  });

  // Fermer si clic hors panneau (UX)
  document.addEventListener('click', (e) => {
    if (!panel.contains(e.target) && panel.classList.contains('open')) {
      panel.classList.remove('open');
      panel.setAttribute('aria-expanded', 'false');
      handle.textContent = '««'; // remettre à l’état fermé
    }
  });

  // Préparer les backgrounds
  const backgrounds = [
    { css: "background-color: var(--bg-light)", name: "Default"},
    { css: "linear-gradient(135deg, #1E90FF 0%, #0B0C2A 50%, #4B0082 100%)", name: "Dégradé Classique" },
    { css: "linear-gradient(to right, #1E90FF, #0B0C2A)", color: "#f5f5f5", name: "Fusion Sonic/Fate" },
    { css: "linear-gradient(to right, #1E90FF 0%, #0B0C2A 50%, #4B0082 100%)", color: "#f5f5f5", name: "Mystique Violet" },
    { css: "linear-gradient(135deg, #1E90FF 0%, #0B0C2A 50%, #C0A060 100%)", color: "#f5f5f5", name: "Éclat Doré" }
  ];
  let currentBg = 0;

  // Bouton changer le fond
btnCycle.addEventListener('click', (e) => {
  e.stopPropagation();
  currentBg = (currentBg + 1) % backgrounds.length;

  // Appliquer le fond
  document.body.style.background = backgrounds[currentBg].css;

  // Bascule du mode sombre
  if (currentBg === 0) {
    document.body.classList.remove('dark-mode');
  } else {
    document.body.classList.add('dark-mode');
  }

  showToast("Thème : " + backgrounds[currentBg].name);
});
  // Option : hotspot pour révéler le panneau au survol du coin
  // Décommente la ligne suivante pour activer la zone sensible
  // hotspot.classList.add('active');

  // Si hotspot activé, ouvrir le panneau au survol du coin
  if (hotspot.classList.contains('active')) {
    hotspot.addEventListener('mouseenter', () => {
      panel.classList.add('open');
      handle.textContent = '»»';
    });
    hotspot.addEventListener('mouseleave', () => {
      panel.classList.remove('open');
      handle.textContent = '««';
    });
  }

  console.log('Panneau thème initialisé');
});

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}




// Fonction générique pour afficher un contenu caché et masquer le bouton
function showContent(contentId, buttonId) {
  const content = document.getElementById(contentId);
  const button = document.getElementById(buttonId);

  if (content) content.style.display = "block";
  if (button) button.style.display = "none";
}

// Gestion des lecteurs audio
document.querySelectorAll(".audio-zone").forEach((zone) => {
  const audio = zone.querySelector("audio");
  const playPause = zone.querySelector("button[id^='playPause']");
  const progress = zone.querySelector("input[id^='progress']");
  const volume = zone.querySelector("input[id^='volume']");
  const titleWrapper = zone.querySelector(".audio-title-wrapper");
  const title = zone.querySelector(".audio-title");

  // Assure que le titre est caché au départ
  if (titleWrapper) titleWrapper.classList.add("hidden");
  if (title) title.classList.remove("scroll");

  // Bouton Play/Pause
  playPause.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      playPause.textContent = "⏸️";
    } else {
      audio.pause();
      playPause.textContent = "▶️";
    }
  });

  // Mise à jour de la barre de progression
  audio.addEventListener("timeupdate", () => {
    progress.max = audio.duration || 0;
    progress.value = audio.currentTime || 0;
  });

  progress.addEventListener("input", () => {
    audio.currentTime = Number(progress.value) || 0;
  });

  // Contrôle du volume
  volume.addEventListener("input", () => {
    audio.volume = Number(volume.value);
  });

  // Quand la musique démarre
  audio.addEventListener("play", () => {
    zone.classList.add("audioFixe");

    // Affiche le titre
    if (titleWrapper) titleWrapper.classList.remove("hidden");

    // Lance le défilement si le texte est trop long
    if (title && title.scrollWidth > titleWrapper.clientWidth) {
      title.classList.add("scroll");
    }
  });

  // Quand la musique est mise en pause
  audio.addEventListener("pause", () => {
    zone.classList.remove("audioFixe");
    if (titleWrapper) titleWrapper.classList.add("hidden");
    if (title) title.classList.remove("scroll");
  });

  // Quand la musique est terminée
  audio.addEventListener("ended", () => {
    zone.classList.remove("audioFixe");
    if (titleWrapper) titleWrapper.classList.add("hidden");
    if (title) title.classList.remove("scroll");
    playPause.textContent = "▶️"; // remet le bouton à l’état initial
  });
});

// Fonction pour charger un fichier JSON de traduction
async function loadLang(lang) {
  try {
    const response = await fetch(`./../lang/${lang}.json`);
    const translations = await response.json();

    for (const key in translations) {
      const el = document.getElementById(key);
      if (el) {
        el.innerHTML = translations[key];
      }
    }
  } catch (error) {
    console.error("Erreur lors du chargement de la langue :", error);
  }
}

// Gestion du bouton de bascule de langue
const toggleBtn = document.getElementById("toggle-lang");

if (toggleBtn) {
  document.body.dataset.lang = "fr";
  loadLang("fr");

  toggleBtn.addEventListener("click", () => {
    const currentLang = document.body.dataset.lang || "fr";
    const nextLang = currentLang === "fr" ? "en" : "fr";

    document.body.dataset.lang = nextLang;
    loadLang(nextLang);

    // toggleBtn.textContent = nextLang === "fr" ? "FR / EN" : "EN / FR";
  });
}