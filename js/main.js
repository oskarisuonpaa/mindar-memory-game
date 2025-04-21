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
  setTimeout(() => fb.classList.remove("show"), 1000);
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
        if (lastCard.id === pairId && lastCard.el !== this.el) {
          score++;
          updateScore();
          showFeedback("✅ Match!", true);
        } else {
          showFeedback("❌ Try again", false);
        }
        // reset after a short delay
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

  // Create an array [0..NUM_PAIRS*2-1] and shuffle it
  const indices = [...Array(NUM_PAIRS * 2).keys()].sort(
    () => 0.5 - Math.random()
  );

  indices.forEach((targetIndex, idx) => {
    const pair = Math.floor(idx / 2);
    const suffix = idx % 2 === 0 ? "a" : "b";
    const imgId = `card${pair}${suffix}`;

    // Preload image asset
    const img = document.createElement("img");
    img.id = imgId;
    img.src = `assets/${imgId}.png`;
    assets.appendChild(img);

    // Create AR entity
    const entity = document.createElement("a-entity");
    entity.setAttribute("mindar-image-target", `targetIndex: ${targetIndex}`);
    entity.setAttribute("memory-card", `pairId: ${pair}`);

    const image = document.createElement("a-image");
    image.setAttribute("src", `#${imgId}`);
    image.setAttribute("width", "1");
    image.setAttribute("height", "1");
    image.setAttribute("position", "0 0 0");

    entity.appendChild(image);
    scene.appendChild(entity);
  });
});
