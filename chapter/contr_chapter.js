// Fonction pour générer les options
function generateChapterOptions(totalChapters) {
  let options = '<option value="">Select...</option>';
  for (let i = 1; i <= totalChapters; i++) {
    const num = String(i).padStart(2, '0'); // ajoute un zéro devant (01, 02…)
    options += `<option value="../Chapter_${num}/Chapitre_${num}.html">${num}. Chapitre ${num}</option>`;
  }
  return options;
}

// Fonction pour remplir un select par son id
function fillChapterSelect(selectId, totalChapters) {
  const select = document.getElementById(selectId);
  if (select) {
    select.innerHTML = generateChapterOptions(totalChapters);
  }
}

// Exemple d’utilisation : remplir les deux listes
fillChapterSelect('chap_select_debut', 2);      //30
fillChapterSelect('chap_select_fin', 2);        //30