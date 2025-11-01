i18next.init({
  lng: 'fr', // langue par défaut
  resources: {
    fr: { translation: {/* contenu de fr.json */} },
    en: { translation: {/* contenu de en.json */} }
  }
}, function() {
  updateContent();
});

function updateContent() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.innerHTML = i18next.t(el.getAttribute('data-i18n'));
  });
}

document.getElementById('btn-translate').addEventListener('click', () => {
  const newLang = i18next.language === 'fr' ? 'en' : 'fr';
  i18next.changeLanguage(newLang, updateContent);
});