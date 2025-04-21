const NUM_PAIRS = 8;
let lastCard = null;
let score = 0;

// Update the score display
function updateScore() {
  document.getElementById("score").textContent = `Score: ${score}`;
}

// Show match/mismatch feedback
function showFeedback(text, isMatch) {
  const fb = document.getElementById("feedback");
  fb.textContent = text;
  fb.style.borderColor = isMatch ? "var(--green)" : "var(--red)";
  fb.classList.remove("hidden");
  fb.classList.add("show");
  setTimeout(() => {
    fb.classList.remove("show");
    fb.classList.add("hidden");
  }, 1000);
}

// Register the memory-card component
AFRAME.registerComponent("memory-card", {
  schema: { pairId: { type: "int" } },
  init: function () {
    this.el.addEventListener("targetFound", () => {
      const pairId = this.data.pairId;
      if (!lastCard) {
        lastCard = { id: pairId, el: this.el };
      } else {
        if (lastCard.id === pairId) {
          score++;
          updateScore();
          showFeedback("✅ Match!", true);
        } else {
          showFeedback("❌ Try again", false);
        }
        setTimeout(() => {
          lastCard = null;
        }, 1000);
      }
    });
  },
});

// On DOM ready, set up cards
document.addEventListener("DOMContentLoaded", () => {
  const assets = document.getElementById("assets");
  const scene = document.getElementById("scene");

  let targetIndex = 0;
  // Here files are named 1.png through 8.png; two copies per pair
  for (let i = 1; i <= NUM_PAIRS; i++) {
    ["a", "b"].forEach((suffix) => {
      const imgId = `card${i}${suffix}`;
      const imgSrc = `assets/${i}.png`;

      // Preload image asset
      const img = document.createElement("img");
      img.id = imgId;
      img.src = imgSrc;
      assets.appendChild(img);

      // Create AR entity with fixed mapping
      const entity = document.createElement("a-entity");
      entity.setAttribute("mindar-image-target", `targetIndex: ${targetIndex}`);
      entity.setAttribute("memory-card", `pairId: ${i}`);

      const image = document.createElement("a-image");
      image.setAttribute("src", `#${imgId}`);
      image.setAttribute("width", "1");
      image.setAttribute("height", "1");
      image.setAttribute("position", "0 0 0");

      entity.appendChild(image);
      scene.appendChild(entity);

      console.log(`Mapped marker ${targetIndex} to image ${imgSrc}, pair ${i}`);
      targetIndex++;
    });
  }
});
