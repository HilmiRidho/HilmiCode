// Simulasi data server (dummy)
function updateStats() {
  // Nanti bisa fetch dari server /stats
  const cpu = Math.floor(Math.random() * 50) + 10;
  const ram = Math.floor(Math.random() * 80) + 10;
  const storage = Math.floor(Math.random() * 90) + 5;

  document.getElementById("cpu").textContent = cpu + "%";
  document.getElementById("ram").textContent = ram + "%";
  document.getElementById("storage").textContent = storage + "%";
}

setInterval(updateStats, 3000); // update setiap 3 detik
updateStats();
