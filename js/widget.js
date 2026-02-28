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
    { css: "linear-gradient(to right, #1E90FF, #0B0C2A)", name: "Fusion Sonic/Fate" },
    { css: "linear-gradient(135deg, #1E90FF 0%, #0B0C2A 50%, #C0A060 100%)", name: "Éclat Doré" },
    { css: "linear-gradient(to right, #0B0C2A, #4A0020)", name: "Fuyuki Night" },
    { css: "linear-gradient(135deg, #1E90FF 0%, #0B0C2A 50%, #1B5E20 100%)", name: "Green Hill" },
    { css: "linear-gradient(to right, #8B0000, #0B0C2A)", name: "Command Spell" }
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



// Gestion des images hover : repositionnement + tap mobile
document.addEventListener('DOMContentLoaded', function () {
  const isTouchDevice = 'ontouchstart' in window;

  document.querySelectorAll('a.imag').forEach(function (link) {
    const imgSpan = link.querySelector('span');
    if (!imgSpan) return;

    if (isTouchDevice) {
      // Sur mobile : tap pour afficher, tap ailleurs pour fermer
      link.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        // Fermer toutes les autres images ouvertes
        document.querySelectorAll('a.imag span.show-mobile').forEach(function (s) {
          if (s !== imgSpan) s.classList.remove('show-mobile');
        });

        imgSpan.classList.toggle('show-mobile');

        if (imgSpan.classList.contains('show-mobile')) {
          repositionImage(imgSpan);
        }
      });
    } else {
      // Sur desktop : repositionner au hover pour éviter le débordement
      link.addEventListener('mouseenter', function () {
        repositionImage(imgSpan);
      });
    }
  });

  // Fermer les images au tap n'importe où sur mobile
  if (isTouchDevice) {
    document.addEventListener('click', function () {
      document.querySelectorAll('a.imag span.show-mobile').forEach(function (s) {
        s.classList.remove('show-mobile');
      });
    });
  }

  function repositionImage(spanEl) {
    // Attendre le rendu pour lire les dimensions
    requestAnimationFrame(function () {
      var rect = spanEl.getBoundingClientRect();

      // Débordement à droite
      if (rect.right > window.innerWidth) {
        var overflow = rect.right - window.innerWidth + 10;
        spanEl.style.left = (parseInt(getComputedStyle(spanEl).left) || 0) - overflow + 'px';
      }

      // Débordement à gauche
      if (rect.left < 0) {
        spanEl.style.left = (parseInt(getComputedStyle(spanEl).left) || 0) - rect.left + 10 + 'px';
      }

      // Débordement en haut
      if (rect.top < 0) {
        spanEl.style.top = (parseInt(getComputedStyle(spanEl).top) || 0) - rect.top + 10 + 'px';
      }
    });
  }
});

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