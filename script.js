firebase.initializeApp({
  apiKey: "AIzaSyDf64ttRcxVtyv_xhb06bHopD1kUiFJI9Y",
  authDomain: "hilmicode-comment.firebaseapp.com",
  projectId: "hilmicode-comment",
  storageBucket: "hilmicode-comment.firebasestorage.app",
  messagingSenderId: "1071939766625",
  appId: "1:1071939766625:web:4e726f7be1bac71844dd20",
  measurementId: "G-Y6GL3EBMKY"
});
const db = firebase.firestore();
const auth = firebase.auth();
let currentUser = null;
const ADMIN_UID = "MASUKKAN_UID_ADMIN";

auth.signInAnonymously().catch(console.error);
auth.onAuthStateChanged((user) => {
  if (user) {
    currentUser = user;

    alert("UID kamu: " + user.uid);

    if (!localStorage.getItem("username")) {
      if (user.uid === ADMIN_UID) {
        localStorage.setItem("username", "Admin");
      } else {
        const inputName = prompt("Masukkan username kamu:") || "Anonim";
        localStorage.setItem("username", inputName);
      }
    }
  }
});

const btn = document.getElementById("play-music");
const audio = document.getElementById("musik");
const icon = document.getElementById("music-icon");
const label = document.getElementById("music-label");

btn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    icon.src = "pause_bt.svg";
    label.textContent = "Pause Music";
  } else {
    audio.pause();
    icon.src = "play_bt.svg";
    label.textContent = "Play Music";
  }
});

function updateClock() {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, "0");
  const m = now.getMinutes().toString().padStart(2, "0");
  document.getElementById("clock").textContent = `${h}:${m}`;
}
setInterval(updateClock, 1000);
updateClock();

function updateStats() {
  const cpu = Math.floor(Math.random() * 50) + 10;
  const ram = Math.floor(Math.random() * 80) + 10;
  const storage = Math.floor(Math.random() * 90) + 5;
  document.getElementById("cpu").textContent = cpu + "%";
  document.getElementById("ram").textContent = ram + "%";
  document.getElementById("storage").textContent = storage + "%";
}
setInterval(updateStats, 3000);
updateStats();

function updateWeather() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
      const data = await res.json();
      const suhu = data.current_weather.temperature;
      document.getElementById("weather").innerHTML = `<span style="display: flex; align-items: center; gap: 6px;"><img src="temp.svg" alt="Suhu" style="width: 20px; height: 20px;"> ${suhu}°C</span>`;
    }, () => {
      document.getElementById("weather").textContent = "Gagal Ambil Cuaca";
    });
  } else {
    document.getElementById("weather").textContent = "Lokasi Tidak Didukung";
  }
}
updateWeather();

// Komentar
const commentInput = document.getElementById("commentInput");
const commentList = document.getElementById("commentList");

commentInput.addEventListener("focus", () => {
  if (!localStorage.getItem("username")) {
    const inputName = prompt("Masukkan username kamu:") || "Anonim";
    localStorage.setItem("username", inputName);
  }
});

document.getElementById("submitComment").addEventListener("click", submitComment);
commentInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter" && commentInput.value.trim()) {
    submitComment();
  }
});

function submitComment() {
  const username = localStorage.getItem("username") || "Anonim";
  const commentText = commentInput.value.trim();

  if (commentText === "") return;

  db.collection("comments").add({
    username,
    comment: commentText,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });

  commentInput.value = "";
}

// Realtime komentar dengan tombol
db.collection("comments")
  .orderBy("timestamp", "desc")
  .onSnapshot((snapshot) => {
    commentList.innerHTML = "";
    snapshot.forEach((doc) => {
      const data = doc.data();

      const comment = document.createElement("div");
      comment.className = "comment-item";

      const text = document.createElement("span");
      text.textContent = `${data.username}: ${data.comment}`;

      const actions = document.createElement("span");
      actions.className = "comment-actions";

      const likeBtn = document.createElement("button");
      const likeImg = document.createElement("img");
      likeImg.src = "like_bt.svg";
      likeImg.alt = "Like";
      likeImg.style.width = "20px";
      likeImg.style.height = "20px";
      likeBtn.appendChild(likeImg);

      let liked = false;
      likeBtn.addEventListener("click", () => {
        liked = !liked;
        likeImg.src = liked ? "love_bt.svg" : "like_bt.svg";
      });

      const deleteBtn = document.createElement("button");
      const deleteImg = document.createElement("img");
      deleteImg.src = "delete_bt.svg";
      deleteImg.alt = "Delete";
      deleteImg.style.width = "20px";
      deleteImg.style.height = "20px";
      deleteBtn.appendChild(deleteImg);

      deleteBtn.addEventListener("click", () => {
        db.collection("comments").doc(doc.id).delete();
      });

      actions.appendChild(likeBtn);
      actions.appendChild(deleteBtn);

      comment.appendChild(text);
      comment.appendChild(actions);
      commentList.appendChild(comment);
    });
  });

const likeStaticBtn = document.getElementById("likeStatic");
const likeStaticImg = likeStaticBtn.querySelector("img");
let likedStatic = false;
likeStaticBtn.addEventListener("click", () => {
  likedStatic = !likedStatic;
  likeStaticImg.src = likedStatic ? "love_bt.svg" : "like_bt.svg";
});

const popupAbout = document.getElementById("popupAbout");
const popupVoila = document.getElementById("popupVoila");
const popupPaypal = document.getElementById("popupPaypal");

document.querySelectorAll(".taskbar-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const label = btn.textContent.trim();

    popupAbout.style.display = (label === "About") ? togglePopup(popupAbout) : "none";
    popupVoila.style.display = label.includes("Voila") ? togglePopup(popupVoila) : "none";
    popupPaypal.style.display = (label === "PayPal") ? togglePopup(popupPaypal) : "none";
  });
});

function togglePopup(popup) {
  return popup.style.display === "none" || popup.style.display === "" ? "block" : "none";
}

document.addEventListener("click", function (e) {
  if (!e.target.closest(".popup") && !e.target.closest(".taskbar-btn")) {
    popupAbout.style.display = "none";
    popupVoila.style.display = "none";
    popupPaypal.style.display = "none";
  }
});

const kotakRasio = document.querySelector('.kotak-rasio');
let startX = 0;
let isSwiping = false;

kotakRasio.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
  isSwiping = true;
});

kotakRasio.addEventListener('touchmove', (e) => {
  if (!isSwiping) return;
  const diffX = e.touches[0].clientX - startX;

  if (diffX > 80 && !kotakRasio.classList.contains('rotate-right')) {
    kotakRasio.classList.remove('rotate-left');
    kotakRasio.classList.add('rotate-right');
    isSwiping = false;
  } else if (diffX < -80 && !kotakRasio.classList.contains('rotate-left')) {
    kotakRasio.classList.remove('rotate-right');
    kotakRasio.classList.add('rotate-left');
    isSwiping = false;
  }
});

kotakRasio.addEventListener('touchend', () => {
  isSwiping = false;
});

document.addEventListener("DOMContentLoaded", function () {
  const gameBtn = document.getElementById("game-btn");
  const kotakRasio = document.querySelector('.kotak-rasio');
  let gameActive = false;

  gameBtn.addEventListener("click", () => {
    if (!gameActive) {
      kotakRasio.innerHTML = '<iframe src="game/index.html" style="width:100%;height:100%;border:none;border-radius:16px;"></iframe>';
      gameActive = true;
    } else {
      kotakRasio.innerHTML = '';
      gameActive = false;
    }
  });
});
