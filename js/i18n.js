// i18n.js

// Récupérer chemin et fichier
const path = window.location.pathname;
const file = path.split("/").pop();           // ex: "Chapitre_01.html"
const folder = path.split("/").slice(-2, -1)[0]; // ex: "Chapter_01"

// 1) Essayer d'extraire depuis le nom du fichier (Chapitre_01.html, Chapitre-01.html, Chapitre 01.html)
let match = file.match(/Chapitre[\s_-]?(\d+)/i);

// 2) Sinon, essayer depuis le nom du dossier (Chapter_01)
if (!match && folder) {
  match = folder.match(/Chapter[\s_-]?(\d+)/i);
}

// Numéro du chapitre, sans les zéros à gauche (e.g., "01" → "1")
const chapterNumber = match ? String(parseInt(match[1], 10)) : "1";
const currentChapter = `chapter${chapterNumber}`;

// Debug facultatif
console.log("Chapitre détecté:", currentChapter);

// Chargement des JSON
Promise.all([
  fetch(`../lang/fr/${currentChapter}.json`).then(res => res.json()),
  fetch(`../lang/en/${currentChapter}.json`).then(res => res.json())
]).then(([frData, enData]) => {
  i18next.init({
    lng: "fr",
    resources: {
      fr: { translation: frData },
      en: { translation: enData }
    }
  }, updateContent);

  function updateContent() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
      el.innerHTML = i18next.t(el.getAttribute("data-i18n"));
    });
  }

  const btn = document.getElementById("btn-translate");
  if (btn) {
    btn.addEventListener("click", () => {
      const newLang = i18next.language === "fr" ? "en" : "fr";
      i18next.changeLanguage(newLang, updateContent);
    });
  }
}).catch(err => {
  console.error("Erreur de chargement des traductions:", err);
});