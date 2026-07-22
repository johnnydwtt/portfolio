/* ==========================================================================
   JOHNNY DE WITTE — CV NUMÉRIQUE
   Toutes les interactions du site, organisées en petites fonctions.
   Rien n'est inline dans le HTML : tout est branché ici via addEventListener.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  initNavbarScroll();
  initTypewriter();
  initUptimeCounter();
  initTicketQueue();
  initScrollReveal();
  initStatCounters();
  initSkillBars();
  initFooterYear();
});


/* --------------------------------------------------------------------------
   1. Barre de navigation : change d'apparence au scroll
   -------------------------------------------------------------------------- */
function initNavbarScroll() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;

  function updateNav() {
    if (window.scrollY > 40) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }
  }

  window.addEventListener('scroll', updateNav);
  updateNav();
}


/* --------------------------------------------------------------------------
   2. Effet machine à écrire sur le sous-titre du hero
   -------------------------------------------------------------------------- */
function initTypewriter() {
  const target = document.getElementById('heroSubtitle');
  if (!target) return;

  const phrases = [
    'Technicien Informatique N1.5 — support, réseau, résolution rapide.',
    'Je transforme un ticket en utilisateur satisfait.',
    'Curieux, rigoureux, toujours partant pour un nouveau défi.'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const TYPING_SPEED = 45;
  const DELETING_SPEED = 25;
  const PAUSE_AFTER_TYPE = 1800;
  const PAUSE_AFTER_DELETE = 400;

  function tick() {
    const currentPhrase = phrases[phraseIndex];

    if (!deleting) {
      charIndex++;
      target.textContent = currentPhrase.substring(0, charIndex);

      if (charIndex === currentPhrase.length) {
        deleting = true;
        setTimeout(tick, PAUSE_AFTER_TYPE);
        return;
      }
      setTimeout(tick, TYPING_SPEED);

    } else {
      charIndex--;
      target.textContent = currentPhrase.substring(0, charIndex);

      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(tick, PAUSE_AFTER_DELETE);
        return;
      }
      setTimeout(tick, DELETING_SPEED);
    }
  }

  tick();
}


/* --------------------------------------------------------------------------
   3. Compteur de disponibilité (temps passé sur la page, format HH:MM:SS)
   -------------------------------------------------------------------------- */
function initUptimeCounter() {
  const el = document.getElementById('uptimeCounter');
  if (!el) return;

  const startTime = Date.now();

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function update() {
    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    const hours = Math.floor(elapsedSeconds / 3600);
    const minutes = Math.floor((elapsedSeconds % 3600) / 60);
    const seconds = elapsedSeconds % 60;
    el.textContent = pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
  }

  update();
  setInterval(update, 1000);
}


/* --------------------------------------------------------------------------
   4. Widget "file d'attente Easyvista" dans le hero
      Simule des tickets qui arrivent puis sont résolus, en lien direct
      avec le métier réel de Johnny (support N1.5).
   -------------------------------------------------------------------------- */
function initTicketQueue() {
  const queueEl = document.getElementById('ticketQueue');
  const resolvedCountEl = document.getElementById('resolvedCount');
  if (!queueEl) return;

  const ticketLabels = [
    'Réinitialisation mot de passe',
    'Blocage impression - Bureau 3',
    'Demande licence Office 365',
    'Lenteur VM Azure',
    'Accès dossier partagé HS',
    'Installation poste utilisateur',
    'Périphérique non reconnu',
    'Synchronisation boîte mail',
    'Demande accès à distance',
    'Mise à jour suite Office'
  ];

  const MAX_VISIBLE_TICKETS = 4;
  let ticketCounter = 0;
  let resolvedCount = 0;

  function randomLabel() {
    return ticketLabels[Math.floor(Math.random() * ticketLabels.length)];
  }

  function addTicket() {
    // Nettoyage si la file est pleine
    const rows = queueEl.querySelectorAll('.ticket-row');
    if (rows.length >= MAX_VISIBLE_TICKETS) {
      resolveOldest();
    }

    ticketCounter++;
    const id = '#TCK-' + String(1000 + ticketCounter);

    const row = document.createElement('div');
    row.className = 'ticket-row new';
    row.dataset.id = id;
    row.innerHTML =
      '<span class="ticket-code">' + id + '</span>' +
      '<span class="ticket-label">' + randomLabel() + '</span>' +
      '<span class="ticket-badge">NOUVEAU</span>';

    queueEl.appendChild(row);

    // Après un délai, le ticket passe en "résolu"
    setTimeout(function () {
      resolveTicket(row);
    }, 2600 + Math.random() * 1800);
  }

  function resolveTicket(row) {
    if (!row || !row.isConnected) return;
    row.classList.remove('new');
    row.classList.add('resolved');
    row.querySelector('.ticket-badge').textContent = 'RÉSOLU';

    resolvedCount++;
    if (resolvedCountEl) resolvedCountEl.textContent = resolvedCount;

    // Le ticket résolu disparaît de la file après un instant
    setTimeout(function () {
      row.style.animation = 'ticket-out .4s ease forwards';
      setTimeout(function () {
        row.remove();
      }, 400);
    }, 2200);
  }

  function resolveOldest() {
    const oldest = queueEl.querySelector('.ticket-row');
    if (oldest) resolveTicket(oldest);
  }

  // Amorce la file, puis un nouveau ticket arrive régulièrement
  addTicket();
  setTimeout(addTicket, 900);
  setTimeout(addTicket, 1800);
  setInterval(addTicket, 3400);
}


/* --------------------------------------------------------------------------
   5. Apparition au scroll (fiches d'expérience, formation, compétences...)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const selectors = [
    '.photo-frame',
    '.about-text',
    '.job-ticket',
    '.edu-card',
    '.skill-bar',
    '.contact-line'
  ];

  const elements = document.querySelectorAll(selectors.join(','));
  if (!elements.length) return;

  elements.forEach(function (el, index) {
    el.classList.add('reveal');
    el.style.transitionDelay = (index % 4) * 0.08 + 's';
  });

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  elements.forEach(function (el) {
    observer.observe(el);
  });
}


/* --------------------------------------------------------------------------
   6. Compteurs de statistiques (120%, 15%, 10%) qui s'incrémentent
   -------------------------------------------------------------------------- */
function initStatCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 1200;
    const startTime = performance.now();

    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const value = Math.floor(progress * target);
      el.textContent = value + (target >= 100 ? '' : '');
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(function (el) {
    observer.observe(el);
  });
}


/* --------------------------------------------------------------------------
   7. Barres de compétences : se remplissent quand elles entrent à l'écran
   -------------------------------------------------------------------------- */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar');
  if (!bars.length) return;

  function fillBar(bar) {
    const value = bar.dataset.value || 0;
    const fill = bar.querySelector('.skill-fill');
    if (fill) fill.style.width = value + '%';
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        fillBar(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(function (bar) {
    observer.observe(bar);
  });
}


/* --------------------------------------------------------------------------
   8. Année automatique dans le pied de page
   -------------------------------------------------------------------------- */
function initFooterYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}
