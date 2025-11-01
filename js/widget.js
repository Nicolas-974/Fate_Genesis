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
    { css: "linear-gradient(135deg, #1E90FF 0%, #0B0C2A 50%, #4B0082 100%)", name: "Dégradé Classique" },
    { css: "linear-gradient(to right, #1E90FF, #0B0C2A)", name: "Fusion Sonic/Fate" },
    { css: "linear-gradient(to right, #1E90FF 0%, #0B0C2A 50%, #4B0082 100%)", name: "Mystique Violet" },
    { css: "linear-gradient(135deg, #1E90FF 0%, #0B0C2A 50%, #C0A060 100%)", name: "Éclat Doré" }
  ];
  let currentBg = 0;

  // Bouton changer le fond
  btnCycle.addEventListener('click', (e) => {
    e.stopPropagation();
    currentBg = (currentBg + 1) % backgrounds.length;
    document.body.style.background = backgrounds[currentBg];

    // Appliquer le fond et afficher le toast
    document.body.style.background = backgrounds[currentBg].css;
    showToast("Thème : " + backgrounds[currentBg].name);

    console.log('Background changé vers index', currentBg);

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



// Afficher contenu caché (inchangé)
function showContent(contentId, buttonId) {
  const content = document.getElementById(contentId);
  const button = document.getElementById(buttonId);
  if (content) content.style.display = "block";
  if (button) button.style.display = "none";
}



// Langues (inchangé)
async function loadLang(lang) {
  try {
    const response = await fetch(`./../lang/${lang}.json`);
    const translations = await response.json();
    for (const key in translations) {
      const el = document.getElementById(key);
      if (el) el.innerHTML = translations[key];
    }
  } catch (error) {
    console.error("Erreur lors du chargement de la langue :", error);
  }
}

const toggleBtn = document.getElementById("toggle-lang");
if (toggleBtn) {
  document.body.dataset.lang = "fr";
  loadLang("fr");
  toggleBtn.addEventListener("click", () => {
    const currentLang = document.body.dataset.lang || "fr";
    const nextLang = currentLang === "fr" ? "en" : "fr";
    document.body.dataset.lang = nextLang;
    loadLang(nextLang);
    toggleBtn.textContent = nextLang === "fr" ? "FR / EN" : "EN / FR";
  });
}