// Fonction générique pour gérer un lecteur audio
function setupAudioPlayer(playerId, zoneId) {
  const audio = document.getElementById(playerId);
  const zone = document.getElementById(zoneId);

  if (!audio || !zone) return;

  // Ici on ne touche plus à .audioFixe (déjà géré dans widget.js)
  // On peut garder uniquement la logique de boucle si nécessaire
  audio.addEventListener("play", () => {
    audio.loop = true;
  });

  audio.addEventListener("pause", () => {
    audio.loop = false;
  });
}

// Initialisation de tous les lecteurs
for (let i = 1; i <= 11; i++) {
  const playerId = i === 1 ? "audioPlayer1" : `audioPlayer${i}`;
  const zoneId = `zone${i}`;
  setupAudioPlayer(playerId, zoneId);
}