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

document.addEventListener("DOMContentLoaded", () => {
  const zones = document.querySelectorAll(".audio-zone");
  const allAudios = Array.from(zones).map(z => z.querySelector("audio")).filter(Boolean);

  zones.forEach((zone) => {
    const audio = zone.querySelector("audio");
    const playPause = zone.querySelector("button[id^='playPause']");
    const progress = zone.querySelector("input[id^='progress']");
    const volume = zone.querySelector("input[id^='volume']");
    const titleWrapper = zone.querySelector(".audio-title-wrapper");
    const title = zone.querySelector(".audio-title");

    if (!audio || !playPause || !progress || !volume) {
      console.warn("Contrôles manquants pour une audio-zone:", { audio, playPause, progress, volume });
      return;
    }

    // Initialisation titre
    if (titleWrapper) titleWrapper.classList.add("hidden");
    if (title) title.classList.remove("scroll");

    // Initialisation volume (si slider a une valeur)
    audio.volume = Number(volume.value ?? 1);

    // Initialisation progression quand les métadonnées sont prêtes
    const initProgress = () => {
      progress.max = isFinite(audio.duration) ? audio.duration : 0;
      progress.value = audio.currentTime || 0;
    };
    if (audio.readyState >= 1) initProgress();
    audio.addEventListener("loadedmetadata", initProgress);

    // Play / Pause (et pause des autres lecteurs)
    playPause.addEventListener("click", async () => {
      try {
        if (audio.paused) {
          // Pause tous les autres
          allAudios.forEach(a => { if (a !== audio && !a.paused) a.pause(); });
          await audio.play();
          playPause.textContent = "⏸️";
        } else {
          audio.pause();
          playPause.textContent = "▶️";
        }
      } catch (err) {
        console.error("Erreur lors de play():", err);
      }
    });

    // Progression visuelle
    audio.addEventListener("timeupdate", () => {
      if (!isFinite(audio.duration)) return;
      progress.max = audio.duration;
      progress.value = audio.currentTime;
    });

    // Seek
    progress.addEventListener("input", () => {
      audio.currentTime = Number(progress.value) || 0;
    });

    // Volume
    volume.addEventListener("input", () => {
      audio.volume = Math.min(1, Math.max(0, Number(volume.value)));
    });

    // Gestion du titre et barre fixe
    audio.addEventListener("play", () => {
      zone.classList.add("audioFixe");
      if (titleWrapper) titleWrapper.classList.remove("hidden");
      if (title && titleWrapper && title.scrollWidth > titleWrapper.clientWidth) {
        title.classList.add("scroll");
      }
    });

    audio.addEventListener("pause", () => {
      zone.classList.remove("audioFixe");
      if (titleWrapper) titleWrapper.classList.add("hidden");
      if (title) title.classList.remove("scroll");
      playPause.textContent = "▶️";
    });

    audio.addEventListener("ended", () => {
      zone.classList.remove("audioFixe");
      if (titleWrapper) titleWrapper.classList.add("hidden");
      if (title) title.classList.remove("scroll");
      playPause.textContent = "▶️";
      progress.value = 0;
    });
  });
});

// Initialisation de tous les lecteurs
for (let i = 1; i <= 50; i++) {
  const playerId = i === 1 ? "audioPlayer1" : `audioPlayer${i}`;
  const zoneId = `zone${i}`;
  setupAudioPlayer(playerId, zoneId);
}