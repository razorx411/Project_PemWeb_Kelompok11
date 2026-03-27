function animateXpBar(current, max) {
  const bar = document.getElementById('xp-bar');
  const label = document.getElementById('xp-label');
  const percent = Math.min((current / max) * 100, 100);

  // Animate on load
  requestAnimationFrame(() => {
    bar.style.width = percent + '%';
  });

  label.textContent = `${current.toLocaleString()} / ${max.toLocaleString()}`;
}

// Call it — change values as needed
animateXpBar(840, 1200);