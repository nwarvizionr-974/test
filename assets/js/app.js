(() => {
  'use strict';

  const config = window.INVITATION_CONFIG;
  if (!config) {
    document.body.innerHTML = '<p style="padding:2rem;font-family:sans-serif">Configuration introuvable : vérifiez config/invitation.config.js.</p>';
    return;
  }

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
  const locale = config.event.language || 'fr-FR';
  let countdownTimer;

  document.addEventListener('DOMContentLoaded', init);

  async function init() {
    applyTheme();
    applySeo();
    configureSections();
    bindText();
    renderHero();
    renderLocations();
    renderSchedule();
    renderDressCode();
    renderGallery();
    renderQuote();
    configureRsvp();
    configureMusic();
    configureCalendar();
    configureLightbox();
    configureAccessGate();
    startCountdown();
    observeReveals();
    registerServiceWorker();

    await waitForImages();
    window.setTimeout(() => $('#pageLoader')?.classList.add('is-hidden'), 350);
  }

  function applyTheme() {
    const root = document.documentElement;
    const colors = config.theme?.colors || {};
    const fonts = config.theme?.fonts || {};
    const vars = {
      '--bg': colors.background,
      '--surface': colors.surface,
      '--text': colors.text,
      '--muted': colors.muted,
      '--accent': colors.accent,
      '--accent-soft': colors.accentSoft,
      '--dark': colors.dark,
      '--light': colors.light,
      '--display': fonts.display,
      '--serif': fonts.serif,
      '--body': fonts.body
    };
    Object.entries(vars).forEach(([name, value]) => value && root.style.setProperty(name, value));
    if (fonts.googleFontsUrl) $('#fontStylesheet').href = fonts.googleFontsUrl;
    $('meta[name="theme-color"]')?.setAttribute('content', colors.background || '#f7f3ee');
  }

  function applySeo() {
    const seo = config.seo || {};
    document.title = seo.title || 'Invitation de mariage';
    setMeta('meta[name="description"]', seo.description);
    setMeta('meta[property="og:title"]', seo.title);
    setMeta('meta[property="og:description"]', seo.description);
    setMeta('meta[property="og:image"]', seo.shareImage);
    setMeta('meta[name="robots"]', seo.indexable ? 'index,follow' : 'noindex,nofollow');
  }

  function setMeta(selector, value) {
    if (value) $(selector)?.setAttribute('content', value);
  }

  function configureSections() {
    const sections = config.sections || {};
    const mapping = {
      announcement: '#annonce',
      countdown: '#compte-a-rebours',
      locations: '#lieux',
      schedule: '#programme',
      dressCode: '#dress-code',
      gallery: '#galerie',
      quote: '#citation',
      rsvp: '#rsvp'
    };
    Object.entries(mapping).forEach(([key, selector]) => {
      if (sections[key] === false) $(selector).hidden = true;
    });
  }

  function bindText() {
    $$('[data-bind]').forEach((node) => {
      const value = node.dataset.bind.split('.').reduce((acc, key) => acc?.[key], config);
      if (value !== undefined && value !== null) node.textContent = value;
    });
  }

  function renderHero() {
    const { firstName1, firstName2, monogram } = config.couple;
    $('#heroNames').innerHTML = `${escapeHtml(firstName1)}<span class="ampersand">&</span>${escapeHtml(firstName2)}`;
    $('#signatureNames').textContent = `${firstName1} & ${firstName2}`;
    $('#heroMonogram').textContent = monogram;
    $('#loaderMonogram').textContent = monogram;
    $('#footerMonogram').textContent = monogram;
    $('#heroImage').src = config.hero.image;
    $('#heroImage').alt = config.hero.imageAlt || '';
    $('#heroDate').textContent = formatEventDate(new Date(config.event.date));
    $('#footerText').textContent = config.footer.text;
    $('#footerCredit').textContent = config.footer.credit;
  }

  function renderLocations() {
    const grid = $('#locationsGrid');
    grid.innerHTML = '';
    (config.locations || []).forEach((location, index) => {
      const card = document.createElement('article');
      card.className = 'location-card reveal';
      card.style.transitionDelay = `${index * 100}ms`;
      card.innerHTML = `
        <div class="location-icon" aria-hidden="true">${iconFor(location.icon)}</div>
        <p class="location-label">${escapeHtml(location.label)}</p>
        <h3>${escapeHtml(location.title)}</h3>
        <p class="location-date">${escapeHtml(location.dateLabel)}</p>
        <p class="location-address">${escapeHtml(location.address)}</p>
        <p class="location-note">${escapeHtml(location.note || '')}</p>
        <a class="location-link" href="${safeUrl(location.mapUrl)}" target="_blank" rel="noopener noreferrer">Itinéraire <span aria-hidden="true">↗</span></a>`;
      grid.appendChild(card);
    });
  }

  function renderSchedule() {
    const timeline = $('#timeline');
    timeline.innerHTML = '';
    (config.schedule || []).forEach((item, index) => {
      const li = document.createElement('li');
      li.className = 'timeline-item reveal';
      li.style.transitionDelay = `${Math.min(index * 70, 350)}ms`;
      li.innerHTML = `
        <time class="timeline-time">${escapeHtml(item.time)}</time>
        <span class="timeline-dot" aria-hidden="true"></span>
        <div class="timeline-content"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text || '')}</p></div>`;
      timeline.appendChild(li);
    });
  }

  function renderDressCode() {
    $('#dressImage').src = config.dressCode.image;
    $('#dressImage').alt = config.dressCode.imageAlt || '';
    const palette = $('#palette');
    palette.innerHTML = '';
    (config.dressCode.palette || []).forEach((color) => {
      const swatch = document.createElement('span');
      swatch.className = 'palette-color';
      swatch.style.background = color;
      swatch.title = color;
      swatch.setAttribute('aria-label', `Couleur ${color}`);
      palette.appendChild(swatch);
    });
  }

  function renderGallery() {
    const section = $('#galerie');
    const grid = $('#galleryGrid');
    const images = config.gallery?.images || [];
    section.hidden = images.length === 0;
    grid.innerHTML = '';
    images.forEach((image, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'gallery-item reveal';
      button.style.transitionDelay = `${Math.min(index * 100, 300)}ms`;
      button.dataset.src = image.src;
      button.dataset.alt = image.alt || '';
      button.dataset.caption = image.caption || '';
      button.innerHTML = `<img src="${safeUrl(image.src)}" alt="${escapeHtml(image.alt || '')}" loading="lazy"><span>${escapeHtml(image.caption || '')}</span>`;
      grid.appendChild(button);
    });
  }

  function renderQuote() {
    $('#quoteText').textContent = config.quote.text;
    $('#quoteAuthor').textContent = config.quote.author;
  }

  function startCountdown() {
    const target = new Date(config.event.date).getTime();
    const update = () => {
      const distance = target - Date.now();
      if (distance <= 0) {
        clearInterval(countdownTimer);
        $('#countdownHeading').textContent = 'Le grand jour est arrivé';
        ['days', 'hours', 'minutes', 'seconds'].forEach((id) => $(`#${id}`).textContent = '00');
        return;
      }
      const values = {
        days: Math.floor(distance / 86400000),
        hours: Math.floor((distance % 86400000) / 3600000),
        minutes: Math.floor((distance % 3600000) / 60000),
        seconds: Math.floor((distance % 60000) / 1000)
      };
      $('#days').textContent = String(values.days).padStart(3, '0');
      $('#hours').textContent = String(values.hours).padStart(2, '0');
      $('#minutes').textContent = String(values.minutes).padStart(2, '0');
      $('#seconds').textContent = String(values.seconds).padStart(2, '0');
    };
    update();
    countdownTimer = window.setInterval(update, 1000);
  }

  function configureCalendar() {
    $('#calendarButton').addEventListener('click', () => {
      const title = `Mariage de ${config.couple.firstName1} & ${config.couple.firstName2}`;
      const location = config.locations?.map((item) => `${item.title}, ${item.address}`).join(' / ') || '';
      const description = config.seo.description || '';
      const content = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Invitation Digitale//FR',
        'CALSCALE:GREGORIAN',
        'BEGIN:VEVENT',
        `UID:${config.event.id}@invitation-digitale`,
        `DTSTAMP:${toIcsDate(new Date())}`,
        `DTSTART:${toIcsDate(new Date(config.event.date))}`,
        `DTEND:${toIcsDate(new Date(config.event.endDate || config.event.date))}`,
        `SUMMARY:${escapeIcs(title)}`,
        `DESCRIPTION:${escapeIcs(description)}`,
        `LOCATION:${escapeIcs(location)}`,
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');
      const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
      downloadBlob(blob, `mariage-${slugify(config.couple.firstName1)}-${slugify(config.couple.firstName2)}.ics`);
      showToast('Le fichier calendrier a été créé.');
    });
  }

  function configureMusic() {
    const music = config.music || {};
    const button = $('#soundToggle');
    const audio = $('#backgroundAudio');
    if (!music.enabled || !music.src) return;
    button.hidden = false;
    audio.src = music.src;
    $('#soundLabel').textContent = music.label || 'Musique';
    button.addEventListener('click', async () => {
      try {
        if (audio.paused) {
          await audio.play();
          button.classList.add('is-playing');
          button.setAttribute('aria-label', 'Mettre la musique en pause');
        } else {
          audio.pause();
          button.classList.remove('is-playing');
          button.setAttribute('aria-label', 'Activer la musique');
        }
      } catch {
        showToast('La lecture audio a été bloquée par le navigateur.');
      }
    });
  }

  function configureLightbox() {
    const dialog = $('#lightbox');
    $('#galleryGrid').addEventListener('click', (event) => {
      const item = event.target.closest('.gallery-item');
      if (!item) return;
      $('#lightboxImage').src = item.dataset.src;
      $('#lightboxImage').alt = item.dataset.alt;
      $('#lightboxCaption').textContent = item.dataset.caption;
      if (typeof dialog.showModal === 'function') dialog.showModal();
    });
    $('#lightboxClose').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  }

  function configureRsvp() {
    const rsvp = config.rsvp || {};
    const section = $('#rsvp');
    if (!rsvp.enabled) {
      section.hidden = true;
      return;
    }

    $('#eventId').value = config.event.id;
    $('#consentText').textContent = rsvp.consentText;
    const deadline = new Date(config.event.rsvpDeadline);
    $('#rsvpDeadline').textContent = `Réponse souhaitée avant le ${new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(deadline)}`;

    const guestCount = $('#guestCount');
    guestCount.innerHTML = '<option value="">Sélectionner</option>';
    for (let i = 1; i <= (rsvp.maxGuests || 1); i += 1) {
      guestCount.insertAdjacentHTML('beforeend', `<option value="${i}">${i}</option>`);
    }

    const mealField = $('#mealField');
    const mealSelect = $('#mealChoice');
    if (rsvp.collectMealChoice && rsvp.mealChoices?.length) {
      mealSelect.innerHTML = '<option value="">Sélectionner</option>' + rsvp.mealChoices.map((choice) => `<option value="${escapeHtml(choice)}">${escapeHtml(choice)}</option>`).join('');
    } else {
      mealField.hidden = true;
      mealSelect.disabled = true;
    }

    $$('input[name="attendance"]').forEach((radio) => radio.addEventListener('change', toggleAttendanceFields));
    $('#rsvpForm').addEventListener('submit', submitRsvp);
  }

  function toggleAttendanceFields() {
    const attendance = $('input[name="attendance"]:checked')?.value;
    const conditional = $('#conditionalFields');
    const isAttending = attendance === 'yes';
    conditional.classList.toggle('is-hidden', !isAttending);
    $$('#conditionalFields input, #conditionalFields select, #conditionalFields textarea').forEach((input) => input.disabled = !isAttending);
    $('#guestCount').required = isAttending;
  }

  async function submitRsvp(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const rsvp = config.rsvp;
    const message = $('#formMessage');
    clearErrors(form);

    if ($('#website').value) return;
    if (!validateRsvp(form)) {
      message.textContent = 'Merci de vérifier les champs indiqués.';
      message.className = 'form-message is-error';
      return;
    }

    const button = $('#submitButton');
    button.disabled = true;
    button.textContent = 'Envoi en cours…';
    $('#submittedAt').value = new Date().toISOString();
    const payload = Object.fromEntries(new FormData(form).entries());
    payload.userAgent = navigator.userAgent;
    payload.pageUrl = window.location.href;

    try {
      if (rsvp.endpoint) {
        await fetch(rsvp.endpoint, {
          method: 'POST',
          mode: rsvp.mode === 'google-apps-script' ? 'no-cors' : 'cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload)
        });
        message.textContent = rsvp.successMessage;
      } else {
        const localKey = `rsvp:${config.event.id}`;
        localStorage.setItem(localKey, JSON.stringify(payload));
        message.textContent = rsvp.demoMessage;
      }
      message.className = 'form-message is-success';
      form.reset();
      $('#conditionalFields').classList.remove('is-hidden');
      showToast('Réponse enregistrée. Merci !');
    } catch (error) {
      console.error(error);
      message.textContent = `L’envoi n’a pas abouti. Contactez les mariés directement${rsvp.privacyContact ? ` : ${rsvp.privacyContact}` : '.'}`;
      message.className = 'form-message is-error';
    } finally {
      button.disabled = false;
      button.textContent = 'Envoyer ma réponse';
    }
  }

  function validateRsvp(form) {
    let valid = true;
    const guestName = $('#guestName');
    const attendance = $('input[name="attendance"]:checked');
    const guestCount = $('#guestCount');
    const consent = $('#consent');

    if (guestName.value.trim().length < 2) {
      setFieldError(guestName, 'Indiquez votre nom et prénom.'); valid = false;
    }
    if (!attendance) {
      setGroupError($('.attendance-field'), 'Sélectionnez une réponse.'); valid = false;
    }
    if (attendance?.value === 'yes' && !guestCount.value) {
      setFieldError(guestCount, 'Indiquez le nombre de personnes.'); valid = false;
    }
    if (!consent.checked) {
      consent.setAttribute('aria-invalid', 'true');
      $('.consent-error').textContent = 'Votre accord est nécessaire pour envoyer le formulaire.';
      valid = false;
    }
    return valid;
  }

  function setFieldError(input, text) {
    input.setAttribute('aria-invalid', 'true');
    input.closest('.field')?.querySelector('.field-error')?.replaceChildren(document.createTextNode(text));
  }

  function setGroupError(group, text) {
    group.querySelector('.field-error').textContent = text;
  }

  function clearErrors(form) {
    $$('[aria-invalid="true"]', form).forEach((node) => node.removeAttribute('aria-invalid'));
    $$('.field-error', form).forEach((node) => node.textContent = '');
    $('#formMessage').textContent = '';
    $('#formMessage').className = 'form-message';
  }

  function configureAccessGate() {
    const privacy = config.privacy || {};
    if (!privacy.accessCodeEnabled) return;
    const gate = $('#accessGate');
    gate.hidden = false;
    document.body.classList.add('is-locked');
    const storageKey = `invitation-access:${config.event.id}`;
    if (sessionStorage.getItem(storageKey) === 'granted') unlock();

    $('#accessForm').addEventListener('submit', async (event) => {
      event.preventDefault();
      const input = $('#accessCode');
      const hash = await sha256(input.value.trim());
      if (hash === privacy.accessCodeHash) {
        sessionStorage.setItem(storageKey, 'granted');
        unlock();
      } else {
        $('#accessMessage').textContent = 'Code incorrect.';
        input.select();
      }
    });

    function unlock() {
      gate.hidden = true;
      document.body.classList.remove('is-locked');
    }
  }

  function observeReveals() {
    const nodes = $$('.reveal');
    if (!('IntersectionObserver' in window)) {
      nodes.forEach((node) => node.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12, rootMargin: '0px 0px -30px' });
    nodes.forEach((node) => observer.observe(node));
  }

  function registerServiceWorker() {
    if ('serviceWorker' in navigator && location.protocol === 'https:') {
      window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
    }
  }

  function waitForImages() {
    const images = $$('img');
    return Promise.all(images.map((image) => image.complete ? Promise.resolve() : new Promise((resolve) => {
      image.addEventListener('load', resolve, { once: true });
      image.addEventListener('error', resolve, { once: true });
    })));
  }

  function formatEventDate(date) {
    return new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  }

  function toIcsDate(date) {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  }

  function escapeIcs(value) {
    return String(value || '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
  }

  function downloadBlob(blob, fileName) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function showToast(text) {
    const toast = $('#toast');
    toast.textContent = text;
    toast.classList.add('is-visible');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove('is-visible'), 3200);
  }

  function iconFor(name) {
    const icons = { rings: '◌', glass: '♢', heart: '♡', pin: '⌖' };
    return icons[name] || icons.pin;
  }

  function safeUrl(value) {
    const url = String(value || '');
    if (/^(https?:|mailto:|tel:|assets\/|\.\/|\.\.\/)/i.test(url)) return url;
    return '#';
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  }

  function slugify(value) {
    return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  async function sha256(text) {
    const data = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
  }
})();
