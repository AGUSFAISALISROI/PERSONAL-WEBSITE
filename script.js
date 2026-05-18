// Real Time Clock
function updateClock() {
  const hoursElement = document.getElementById('hours');
  const minsElement = document.getElementById('mins');
  const secsElement = document.getElementById('secs');
  const timeCardVal = document.getElementById('current-time-val');
  const dateCardVal = document.getElementById('current-date-val');

  function tick() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const mins = now.getMinutes().toString().padStart(2, '0');
    const secs = now.getSeconds().toString().padStart(2, '0');

    if (hoursElement) hoursElement.innerText = hours;
    if (minsElement) minsElement.innerText = mins;
    if (secsElement) secsElement.innerText = secs;

    if (timeCardVal) {
      timeCardVal.innerText = `${hours}:${mins}:${secs}`;
    }

    if (dateCardVal) {
      const options = { weekday: 'long', day: 'numeric', month: 'long' };
      dateCardVal.innerText = now.toLocaleDateString('id-ID', options);
    }

    const heroDateElem = document.getElementById('hero-date');
    if (heroDateElem) {
      const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
      heroDateElem.innerText = now.toLocaleDateString('id-ID', options);
    }
  }

  tick(); // Run immediately
  setInterval(tick, 1000);
}

// Navigation Active State
function handleNavigation() {
  const links = document.querySelectorAll('.nav-links li');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      
      // SPA Navigation
      const anchor = link.querySelector('a');
      if (anchor) {
        const targetId = anchor.id.replace('nav-', 'view-');
        
        // Hide all views
        document.querySelectorAll('.main-content > section').forEach(sec => {
          sec.style.display = 'none';
        });
        
        // Show target view
        const targetView = document.getElementById(targetId);
        if (targetView) {
          targetView.style.display = 'block';
        }
      }
    });
  });
}

// Micro-animations on hover
function setupHoverEffects() {
  const cards = document.querySelectorAll('.glass-card, .stat-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-5px)';
      card.style.boxShadow = '0 10px 20px rgba(0, 243, 255, 0.1)';
      card.style.transition = 'all 0.3s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = 'none';
    });
  });
}

// Music Player Logic
function setupMusicPlayer() {
  const playToggle = document.getElementById('play-toggle');
  const audio = document.getElementById('bg-music');
  
  if (playToggle && audio) {
    // Initial check for autoplay
    if (playToggle.checked) {
      audio.play().catch(e => {
        console.log("Playback blocked or failed:", e);
        playToggle.checked = false;
      });
    }

    const currentTimeElem = document.querySelector('.current-time');
    const remainingTimeElem = document.querySelector('.remaining-time');
    const progressFill = document.querySelector('.progress-fill');
    const progressHandle = document.querySelector('.progress-handle');

    function formatTime(seconds) {
      if (isNaN(seconds)) return "0:00";
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
      return `${mins}:${secs}`;
    }

    audio.addEventListener('loadedmetadata', () => {
      if (remainingTimeElem) {
        remainingTimeElem.style.setProperty('--content', `"${formatTime(audio.duration)}"`);
        remainingTimeElem.innerText = formatTime(audio.duration);
      }
      if (currentTimeElem) {
        currentTimeElem.style.setProperty('--content', '"0:00"');
        currentTimeElem.innerText = "0:00";
      }
    });

    audio.addEventListener('timeupdate', () => {
      if (currentTimeElem) currentTimeElem.innerText = formatTime(audio.currentTime);
      if (remainingTimeElem) remainingTimeElem.innerText = formatTime(audio.duration - audio.currentTime);
      
      const progress = (audio.currentTime / audio.duration) * 100;
      if (progressFill) progressFill.style.width = `${progress}%`;
      if (progressHandle) progressHandle.style.left = `${progress}%`;
    });

    playToggle.addEventListener('change', () => {
      if (playToggle.checked) {
        audio.play().catch(e => {
          console.log("Playback blocked or failed:", e);
          playToggle.checked = false;
        });
      } else {
        audio.pause();
      }
    });
  }
}

// Hero Canvas Particle Effect
function setupHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  
  const particles = [];
  const particleCount = 100;
  
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.2,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      color: `rgba(255, 255, 255, ${Math.random() * 0.8})`,
      glow: Math.random() > 0.8
    });
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      
      if (p.glow) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 243, 255, 0.1)`;
        ctx.fill();
      }
    });
    
    requestAnimationFrame(animate);
  }
  animate();
}

// Theme Toggle Logic
function setupThemeToggle() {
  const themeBtn = document.getElementById('theme-toggle-btn');
  const themeText = document.getElementById('theme-text');
  const themeIcon = document.getElementById('theme-icon');
  
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      
      if (document.body.classList.contains('light-theme')) {
        if (themeText) themeText.innerText = "Light Mode";
        if (themeIcon) {
          themeIcon.innerHTML = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
        }
      } else {
        if (themeText) themeText.innerText = "Dark Mode";
        if (themeIcon) {
          themeIcon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
        }
      }
    });
  }
}

// Action Buttons (Donation & Contact)
function setupActionButtons() {
  const donationBtn = document.getElementById('btn-donation');
  const contactSidebarBtn = document.getElementById('btn-contact-sidebar');
  const contactHeroBtn = document.getElementById('btn-contact-hero');

  if (donationBtn) {
    donationBtn.addEventListener('click', () => {
      window.location.href = 'assets/donation.html';
    });
  }

  const handleContact = () => {
    window.location.href = 'mailto:your-email@example.com?subject=Tanya%20tentang%20AFI%20CORPORATION';
  };

  if (contactSidebarBtn) {
    contactSidebarBtn.addEventListener('click', handleContact);
  }

  if (contactHeroBtn) {
    contactHeroBtn.addEventListener('click', handleContact);
  }
}

// Battery Status
function setupBatteryStatus() {
  const levelElem = document.getElementById('battery-level');
  const statusElem = document.getElementById('battery-status');
  const circleElem = document.getElementById('battery-circle');

  if (!levelElem || !statusElem || !circleElem) return;

  function updateBattery(battery) {
    const level = Math.round(battery.level * 100);
    levelElem.innerText = `${level}%`;
    
    const circumference = 377;
    const offset = circumference * (1 - battery.level);
    circleElem.style.strokeDashoffset = offset;
    
    if (battery.charging) {
      statusElem.innerText = "Charging...";
      statusElem.style.color = "var(--accent-cyan)";
    } else {
      statusElem.innerText = "Discharging";
      statusElem.style.color = "var(--text-secondary)";
    }
  }

  if ('getBattery' in navigator) {
    navigator.getBattery().then(battery => {
      updateBattery(battery);
      battery.addEventListener('levelchange', () => updateBattery(battery));
      battery.addEventListener('chargingchange', () => updateBattery(battery));
    });
  } else {
    statusElem.innerText = "Not Supported";
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  updateClock();
  handleNavigation();
  setupHoverEffects();
  setupMusicPlayer();
  setupHeroCanvas();
  setupThemeToggle();
  setupActionButtons();
  setupBatteryStatus();
  console.log("Dashboard initialized smoothly.");
});
