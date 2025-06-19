document.addEventListener("DOMContentLoaded", function () {
  AOS.init({
    duration: 1800,
    once: true,
    offset: 100,
    delay: 150,
    easing: 'ease-in-out',
  });
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

// CountUP
 document.addEventListener("DOMContentLoaded", () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;

          if (['days','hours','minutes','seconds'].includes(id)) {
            const target = new Date("2025-06-23T10:00:00+08:00") - new Date();
            const vals = {
              days: Math.max(0, Math.floor(target / (1000*60*60*24))),
              hours: Math.max(0, Math.floor((target/(1000*60*60)) % 24)),
              minutes: Math.max(0, Math.floor((target/(1000*60)) % 60)),
              seconds: Math.max(0, Math.floor((target/1000) % 60))
            };
            const cu = new countUp.CountUp(id, vals[id], { duration: 1.5, startVal: 0, useEasing: true, formattingFn: n => String(n).padStart(2, '0') });
            cu.start();
          }

          if (id === 'event-day') {
            const cm = new countUp.CountUp('event-day', 21, { duration: 2, startVal: 0, useEasing: true, formattingFn: n => String(n).padStart(2, '0') });
            cm.start();
          }

          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    ['days','hours','minutes','seconds','event-day'].forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  });
