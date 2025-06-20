gsap.registerPlugin(ScrollTrigger);

  const animationMap = {
    "fade":       { from: { opacity: 0 }, to: { opacity: 1 } },
    "fade-up":    { from: { opacity: 0, y: 40 }, to: { opacity: 1, y: 0 } },
    "fade-left":  { from: { opacity: 0, x: -40 }, to: { opacity: 1, x: 0 } },
    "fade-right": { from: { opacity: 0, x: 40 }, to: { opacity: 1, x: 0 } },
    "zoom-in":    { from: { opacity: 0, scale: 0.8 }, to: { opacity: 1, scale: 1 } },
    "zoom-out":   { from: { opacity: 0, scale: 1.3 }, to: { opacity: 1, scale: 1 } }
  };

  document.querySelectorAll("[gsap]").forEach(elem => {
    const type = elem.getAttribute("gsap");
    const delay = parseFloat(elem.dataset.delay) || 0;
    const duration = parseFloat(elem.dataset.duration) || 1;

    if (!animationMap[type]) return;

    const fromVars = animationMap[type].from;
    const toVars = {
      ...animationMap[type].to,
      delay,
      duration,
      ease: "power2.out",
      overwrite: "auto",
      scrollTrigger: {
        trigger: elem,
        toggleActions: "play none none none",
        once: true,
      }
    };

    gsap.fromTo(elem, fromVars, toVars);
  });


let showFirst = true;
const bg1 = document.querySelector('.bg1');
const bg2 = document.querySelector('.bg2');

setInterval(() => {
  if (showFirst) {
    bg1.classList.add('opacity-0');
    bg2.classList.remove('opacity-0');
  } else {
    bg1.classList.remove('opacity-0');
    bg2.classList.add('opacity-0');
  }
  showFirst = !showFirst;
}, 6000); // Ganti gambar setiap 6 detik

document.addEventListener("DOMContentLoaded", () => {
  const counters = [
    { id: "counter-acara-1", value: 22 },
    { id: "counter-acara-2", value: 22 },
    { id: "counter-acara-3", value: 23 }
  ];

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const targetId = target.id;
        const counterData = counters.find(c => c.id === targetId);

        if (counterData) {
          // Trigger odometer by replacing innerHTML
          target.innerHTML = counterData.value;
          obs.unobserve(target);
        }
      }
    });
  }, { threshold: 0.6 });

  counters.forEach(counter => {
    const el = document.getElementById(counter.id);
    if (el) observer.observe(el);
  });
});

// Set tanggal target: 23 Juni 2025, 10:00 WITA (GMT+8)
const targetDate = new Date("2025-06-23T10:00:00+08:00").getTime();

// Fungsi update countdown setiap detik
const updateCountdown = () => {
  const now = new Date().getTime();
  const distance = targetDate - now;

  if (distance < 0) {
    document.getElementById("days").innerText = "00";
    document.getElementById("hours").innerText = "00";
    document.getElementById("minutes").innerText = "00";
    document.getElementById("seconds").innerText = "00";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("days").innerText = String(days).padStart(2, '0');
  document.getElementById("hours").innerText = String(hours).padStart(2, '0');
  document.getElementById("minutes").innerText = String(minutes).padStart(2, '0');
  document.getElementById("seconds").innerText = String(seconds).padStart(2, '0');
};
// Jalankan langsung dan ulangi tiap detik
updateCountdown();
setInterval(updateCountdown, 1000);


// Refs
const form = document.getElementById("comment-form");
const container = document.getElementById("comments-list");
const commentsRef = db.collection("comments").orderBy("waktu", "desc");

// Format waktu
function formatWaktu(timestamp) {
  const waktu = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const selisihMs = now - waktu;
  const selisihDetik = Math.floor(selisihMs / 1000);
  const selisihMenit = Math.floor(selisihDetik / 60);
  const selisihJam = Math.floor(selisihMenit / 60);
  const selisihHari = Math.floor(selisihJam / 24);

  if (selisihHari >= 7) {
    return waktu.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } else if (selisihHari >= 1) {
    return `${selisihHari} hari yang lalu`;
  } else if (selisihJam >= 1) {
    return `${selisihJam} jam yang lalu`;
  } else if (selisihMenit >= 1) {
    return `${selisihMenit} menit yang lalu`;
  } else {
    return `Baru saja`;
  }
}

// Realtime listener saat DOM siap
document.addEventListener("DOMContentLoaded", () => {
  commentsRef.onSnapshot((snapshot) => {
    container.innerHTML = "";
    snapshot.forEach(doc => {
      const comment = doc.data();
      const waktuRelatif = formatWaktu(comment.waktu);
      const isHadir = comment.kehadiran === "Hadir";

      const el = document.createElement("div");
      el.classList.add("mb-4", "text-left");

      el.innerHTML = `
        <div class="flex items-center gap-2">
          <p class="font-bold text-md">${comment.nama}</p>
          ${isHadir ? `<img src="assets/centang.png" alt="Hadir" class="w-4 h-4" />` : ""}
        </div>
        <p class="text-sm mb-1">${comment.ucapan}</p>
        <p class="text-xs text-gray-500">${waktuRelatif}</p>
      `;
      container.appendChild(el);
    });
  });

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const nama = document.getElementById("nama").value.trim();
    const ucapan = document.getElementById("ucapan").value.trim();
    const kehadiran = document.getElementById("kehadiran").value;

    if (!nama || !ucapan || !kehadiran) return;

    await addDoc(commentsRef, {
      nama,
      ucapan,
      kehadiran,
      waktu: serverTimestamp()
    });

    form.reset();
  });
});