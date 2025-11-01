// Fonction générique pour jouer un son
function playSound(id) {
    const sound = document.getElementById(id);
    if (sound) {
        sound.play();
    } else {
        console.warn("Aucun élément audio trouvé avec l'id :", id);
    }
}