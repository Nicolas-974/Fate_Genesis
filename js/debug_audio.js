window.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("audioPlayer1");
  const playPause = document.getElementById("playPause");
  const progress = document.getElementById("progress");
  const volume = document.getElementById("volume");

  // Vérification des éléments
  console.log("Audio trouvé :", !!audio);
  console.log("Bouton PlayPause trouvé :", !!playPause);
  console.log("Progress trouvé :", !!progress);
  console.log("Volume trouvé :", !!volume);

  if (!audio) {
    console.error("⚠️ Aucun élément <audio> trouvé !");
    return;
  }

  // Vérifie si le fichier est bien chargé
  audio.addEventListener("loadeddata", () => {
    console.log("✅ Fichier audio chargé :", audio.src);
  });

  audio.addEventListener("error", (e) => {
    console.error("❌ Erreur de chargement audio :", e);
  });

  // Bouton Play/Pause
  if (playPause) {
    playPause.addEventListener("click", async () => {
      try {
        if (audio.paused) {
          await audio.play();
          playPause.textContent = "⏸️";
          console.log("▶️ Lecture démarrée");
        } else {
          audio.pause();
          playPause.textContent = "▶️";
          console.log("⏸️ Lecture mise en pause");
        }
      } catch (err) {
        console.error("❌ Erreur lors de play() :", err);
      }
    });
  }

  // Suivi de la progression
  if (progress) {
    audio.addEventListener("timeupdate", () => {
      progress.max = audio.duration || 0;
      progress.value = audio.currentTime || 0;
      console.log("⏱️ Progression :", audio.currentTime.toFixed(2), "/", audio.duration.toFixed(2));
    });

    progress.addEventListener("input", () => {
      audio.currentTime = Number(progress.value) || 0;
      console.log("⏩ Avance rapide à :", audio.currentTime);
    });
  }

  // Contrôle du volume
  if (volume) {
    volume.addEventListener("input", () => {
      audio.volume = Number(volume.value);
      console.log("🔊 Volume :", audio.volume);
    });
  }
});