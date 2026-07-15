(() => {
  'use strict';

  const config = window.INVITATION_CONFIG;
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
  let countdownTimer;
  let toastTimer;

  if (!config || typeof config !== 'object') {
    showFatalError('Configuration introuvable : vérifiez config/invitation.config.js.');
    return;
  }

  init().catch((error) => {
    console.error(error);
    showFatalError('Une erreur empêche l’affichage de l’invitation. Vérifiez la configuration.');
  });

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
    await configureAccessGate();
    startCountdown();
    observeReveals();
    await waitForImages();
    window.setTimeout(() => $('#pageLoader')?.classList.add('is-hidden'), 250);
  }

  function applyTheme() {
    const root = document.documentElement;
    const colors = config.theme?.colors || {};
    const fonts = config.theme?.fonts || {};
    const variables = {
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
    Object.entries(variables).forEach(([name, value]) => value && root.style.setProperty(name, value));
    if (fonts.googleFontsUrl && $('#fontStylesheet')) $('#fontStylesheet').href = fonts.googleFontsUrl;
    $('meta[name="theme-color"]')?.setAttribute('content', colors.background || '#f7f3ee');
  }

  function applySeo() {
    const seo = config.seo || {};
    document.title = seo.title || 'Invitation de mariage';
    setMeta('meta[name="description"]', seo.description);
    setMeta('meta[property="og:title"]', seo.title);
    setMeta('meta[property="og:description"]', seo.description);
    setMeta('meta[property="og:image"]', seo.shareImage);
    setMeta('meta[name="robots"]', seo.indexable === true ? 'index,follow' : 'noindex,nofollow');
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
      const node = $(selector);
      if (node && sections[key] === false) node.hidden = true;
    });
  }

  function bindText() {
    $$('[data-bind]').forEach((node) => {
      const value = node.dataset.bind.split('.').reduce((accumulator, key) => accumulator?.[key], config);
      if (value !== undefined && value !== null) node.textContent = String(value);
    });
  }

  function renderHero() {
    const couple = config.couple || {};
    const firstName1 = couple.firstName1 || '';
    const firstName2 = couple.firstName2 || '';
    const monogram = couple.monogram || `${firstName1.charAt(0)}&${firstName2.charAt(0)}`;
    $('#heroNames').textContent = `${firstName1} & ${firstName2}`;
    $('#signatureNames').textContent = `${firstName1} & ${firstName2}`;
    $('#heroMonogram').textContent = monogram;
    $('#loaderMonogram').textContent = monogram;
    $('#footerMonogram').textContent = monogram;
    $('#heroImage').src = config.hero?.image || 'assets/images/cover-placeholder.svg';
    $('#heroImage').alt = config.hero?.imageAlt || '';
    $('#heroDate').textContent = formatEventDate(new Date(config.event?.date));
    $('#footerText').textContent = config.footer?.text || '';
    $('#footerCredit').textContent = config.footer?.credit || '';
  }

  function renderLocations() {
    const grid = $('#locationsGrid');
    if (!grid) return;
    grid.innerHTML = '';
    (config.locations || []).forEach((location, index) => {
      const card = document.createElement('article');
      card.className = 'location-card reveal';
      card.style.transitionDelay = `${index * 100}ms`;
      const link = safeUrl(location.mapUrl);
      card.innerHTML = `
        <div class="location-card__icon" aria-hidden="true">${iconFor(location.icon)}</div>
        <span class="location-card__label">${escapeHtml(location.label || '')}</span>
        <h3>${escapeHtml(location.title || '')}</h3>
        <p class="location-card__date">${escapeHtml(location.dateLabel || '')}</p>
        <p class="location-card__address">${escapeHtml(location.address || '')}</p>
        <p class="location-card__note">${escapeHtml(location.note || '')}</p>
        ${link ? `<a class="location-card__link" href="${escapeAttribute(link)}" target="_blank" rel="noopener noreferrer">Itinéraire ↗</a>` : ''}
      `;
      grid.appendChild(card);
    });
  }

  function renderSchedule() {
    const timeline = $('#timeline');
    if (!timeline) return;
    timeline.innerHTML = '';
    (config.schedule || []).forEach((item, index) => {
      const element = document.createElement('li');
      element.className = 'timeline-item reveal';
      element.style.transitionDelay = `${Math.min(index * 70, 350)}ms`;
      element.innerHTML = `
        <div class="timeline-time">${escapeHtml(item.time || '')}</div>
        <div class="timeline-content"><h3>${escapeHtml(item.title || '')}</h3><p>${escapeHtml(item.text || '')}</p></div>
      `;
      timeline.appendChild(element);
    });
  }

  function renderDressCode() {
    const dressCode = config.dressCode || {};
    $('#dressImage').src = dressCode.image || 'assets/images/dress-placeholder.svg';
    $('#dressImage').alt = dressCode.imageAlt || '';
    const palette = $('#palette');
    if (!palette) return;
    palette.innerHTML = '';
    (dressCode.palette || []).forEach((color) => {
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
    if (!section || !grid) return;
    section.hidden = images.length === 0;
    grid.innerHTML = '';
    images.forEach((image, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'gallery-item reveal';
      button.style.transitionDelay = `${Math.min(index * 100, 300)}ms`;
      button.dataset.src = image.src || '';
      button.dataset.alt = image.alt || '';
      button.dataset.caption = image.caption || '';
      button.innerHTML = `<img src="${escapeAttribute(image.src || '')}" alt="${escapeAttribute(image.alt || '')}" loading="lazy"><span class="gallery-caption">${escapeHtml(image.caption || '')}</span>`;
      grid.appendChild(button);
    });
  }

  function renderQuote() {
    $('#quoteText').textContent = config.quote?.text || '';
    $('#quoteAuthor').textContent = config.quote?.author || '';
  }

  function startCountdown() {
    const target = new Date(config.event?.date).getTime();
    if (!Number.isFinite(target)) return;
    const update = () => {
      const distance = target - Date.now();
      if (distance <= 0) {
        clearInterval(countdownTimer);
        $('#countdownHeading').textContent = 'Le grand jour est arrivé';
        ['days', 'hours', 'minutes', 'seconds'].forEach((id) => {
          const node = $(`#${id}`);
          if (node) node.textContent = '00';
        });
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
    $('#calendarButton')?.addEventListener('click', () => {
      const title = `Mariage de ${config.couple?.firstName1 || ''} & ${config.couple?.firstName2 || ''}`;
      const location = (config.locations || []).map((item) => `${item.title}, ${item.address}`).join(' / ');
      const content = [
        'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Invitation Digitale//FR', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT',
        `UID:${config.event?.id || 'mariage'}@invitation-digitale`, `DTSTAMP:${toIcsDate(new Date())}`,
        `DTSTART:${toIcsDate(new Date(config.event?.date))}`, `DTEND:${toIcsDate(new Date(config.event?.endDate || config.event?.date))}`,
        `SUMMARY:${escapeIcs(title)}`, `DESCRIPTION:${escapeIcs(config.seo?.description || '')}`, `LOCATION:${escapeIcs(location)}`,
        'END:VEVENT', 'END:VCALENDAR'
      ].join('\r\n');
      downloadBlob(new Blob([content], { type: 'text/calendar;charset=utf-8' }), `mariage-${slugify(config.couple?.firstName1 || '')}-${slugify(config.couple?.firstName2 || '')}.ics`);
      showToast('Le fichier calendrier a été créé.');
    });
  }

  function configureMusic() {
    const music = config.music || {};
    const button = $('#soundToggle');
    const audio = $('#backgroundAudio');
    if (!button || !audio || music.enabled !== true || !music.src) return;
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
    $('#galleryGrid')?.addEventListener('click', (event) => {
      const item = event.target.closest('.gallery-item');
      if (!item || !dialog) return;
      $('#lightboxImage').src = item.dataset.src || '';
      $('#lightboxImage').alt = item.dataset.alt || '';
      $('#lightboxCaption').textContent = item.dataset.caption || '';
      if (typeof dialog.showModal === 'function') dialog.showModal();
    });
    $('#lightboxClose')?.addEventListener('click', () => dialog?.close());
    dialog?.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
  }

  function configureRsvp() {
    const rsvp = config.rsvp || {};
    const section = $('#rsvp');
    if (!section) return;
    if (rsvp.enabled !== true) {
      section.hidden = true;
      return;
    }
    $('#eventId').value = config.event?.id || '';
    $('#consentText').textContent = rsvp.consentText || '';
    const deadline = new Date(config.event?.rsvpDeadline);
    if (Number.isFinite(deadline.getTime())) {
      $('#rsvpDeadline').textContent = `Réponse souhaitée avant le ${new Intl.DateTimeFormat(config.event?.language || 'fr-FR', { dateStyle: 'long' }).format(deadline)}`;
    }
    const guestCount = $('#guestCount');
    guestCount.innerHTML = '<option value="">Sélectionner</option>';
    for (let index = 1; index <= Math.max(1, Number(rsvp.maxGuests) || 1); index += 1) {
      guestCount.insertAdjacentHTML('beforeend', `<option value="${index}">${index}</option>`);
    }
    const mealField = $('#mealField');
    const mealSelect = $('#mealChoice');
    if (rsvp.collectMealChoice === true && Array.isArray(rsvp.mealChoices) && rsvp.mealChoices.length) {
      mealSelect.innerHTML = '<option value="">Sélectionner</option>' + rsvp.mealChoices.map((choice) => `<option value="${escapeAttribute(choice)}">${escapeHtml(choice)}</option>`).join('');
    } else {
      mealField.hidden = true;
      mealSelect.disabled = true;
    }
    $$('input[name="attendance"]').forEach((radio) => radio.addEventListener('change', toggleAttendanceFields));
    $('#rsvpForm')?.addEventListener('submit', submitRsvp);
  }

  function toggleAttendanceFields() {
    const attendance = $('input[name="attendance"]:checked')?.value;
    const isAttending = attendance === 'yes';
    const conditional = $('#conditionalFields');
    conditional?.classList.toggle('is-hidden', !isAttending);
    $$('#conditionalFields input, #conditionalFields select, #conditionalFields textarea').forEach((input) => {
      input.disabled = !isAttending;
    });
    $('#guestCount').required = isAttending;
  }

  async function submitRsvp(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const message = $('#formMessage');
    clearErrors(form);
    if ($('#website').value) return;
    if (!validateRsvp(form)) {
      message.textContent = 'Merci de vérifier les champs indiqués.';
      message.className = 'form-message field--full is-error';
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
      if (config.rsvp.endpoint) {
        await fetch(config.rsvp.endpoint, {
          method: 'POST',
          mode: config.rsvp.mode === 'google-apps-script' ? 'no-cors' : 'cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload)
        });
        message.textContent = config.rsvp.successMessage;
      } else {
        localStorage.setItem(`rsvp:${config.event?.id || 'invitation'}`, JSON.stringify(payload));
        message.textContent = config.rsvp.demoMessage;
      }
      message.className = 'form-message field--full is-success';
      form.reset();
      $('#conditionalFields').classList.remove('is-hidden');
      showToast('Réponse enregistrée. Merci !');
    } catch (error) {
      console.error(error);
      message.textContent = 'L’envoi n’a pas abouti. Merci de réessayer.';
      message.className = 'form-message field--full is-error';
    } finally {
      button.disabled = false;
      button.textContent = 'Envoyer ma réponse';
    }
  }

  function validateRsvp(form) {
    let valid = true;
    $$('[required]', form).forEach((field) => {
      if (field.disabled) return;
      const isRadio = field.type === 'radio';
      const valueMissing = isRadio
        ? !$(`input[name="${CSS.escape(field.name)}"]:checked`, form)
        : !field.checked && field.type === 'checkbox'
          ? true
          : !String(field.value || '').trim();
      if (valueMissing) {
        valid = false;
        const container = field.closest('.field, fieldset, .consent');
        const error = $('.field-error', container || form);
        if (error) error.textContent = 'Ce champ est requis.';
      }
    });
    return valid;
  }

  function clearErrors(form) {
    $$('.field-error', form).forEach((node) => { node.textContent = ''; });
    const message = $('#formMessage');
    if (message) {
      message.textContent = '';
      message.className = 'form-message field--full';
    }
  }

  /**
   * Protection volontairement stricte et "fail-open" :
   * - false, "false", 0, absence de valeur => aucun écran ;
   * - hash vide, code en clair comme "1234" ou hash invalide => aucun écran ;
   * - seul true + SHA-256 valide active le verrou.
   */
  async function configureAccessGate() {
    const privacy = config.privacy || {};
    const enabled = privacy.accessCodeEnabled === true;
    const hash = String(privacy.accessCodeHash || '').trim().toLowerCase();
    const validHash = /^[a-f0-9]{64}$/.test(hash);

    document.body.classList.remove('is-locked');
    $('#accessGate')?.remove();

    if (!enabled) return;
    if (!validHash) {
      console.warn('Code d’accès ignoré : accessCodeHash doit être une empreinte SHA-256 de 64 caractères.');
      return;
    }

    const sessionKey = `invitation-access:${config.event?.id || 'default'}:${hash.slice(0, 12)}`;
    if (sessionStorage.getItem(sessionKey) === 'granted') return;

    const template = $('#accessGateTemplate');
    if (!template) return;
    document.body.appendChild(template.content.cloneNode(true));
    const gate = $('#accessGate');
    const form = $('#accessForm');
    const input = $('#accessCode');
    const message = $('#accessMessage');
    document.body.classList.add('is-locked');
    window.setTimeout(() => input?.focus(), 120);

    form?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const submittedHash = await sha256(String(input?.value || ''));
      if (submittedHash === hash) {
        sessionStorage.setItem(sessionKey, 'granted');
        document.body.classList.remove('is-locked');
        gate?.remove();
      } else {
        message.textContent = 'Ce code n’est pas valide.';
        message.className = 'form-message is-error';
        if (input) {
          input.value = '';
          input.focus();
        }
      }
    });
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
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
    nodes.forEach((node) => observer.observe(node));
  }

  function waitForImages() {
    const images = $$('img').filter((image) => !image.complete);
    if (!images.length) return Promise.resolve();
    return Promise.race([
      Promise.all(images.map((image) => new Promise((resolve) => {
        image.addEventListener('load', resolve, { once: true });
        image.addEventListener('error', resolve, { once: true });
      }))),
      new Promise((resolve) => window.setTimeout(resolve, 2500))
    ]);
  }

  function formatEventDate(date) {
    if (!Number.isFinite(date.getTime())) return '';
    return new Intl.DateTimeFormat(config.event?.language || 'fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  }

  function iconFor(type) {
    return type === 'glass' ? '◇' : '○';
  }

  function safeUrl(value) {
    if (!value) return '';
    try {
      const url = new URL(value, window.location.href);
      return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
    } catch {
      return '';
    }
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
  }

  function escapeAttribute(value) {
    return escapeHtml(value);
  }

  function slugify(value) {
    return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function toIcsDate(date) {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  }

  function escapeIcs(value) {
    return String(value).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  async function sha256(value) {
    const bytes = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  function showToast(text) {
    const toast = $('#toast');
    if (!toast) return;
    window.clearTimeout(toastTimer);
    toast.textContent = text;
    toast.classList.add('is-visible');
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 3200);
  }

  function showFatalError(text) {
    const loader = $('#pageLoader');
    if (!loader) return;
    loader.classList.remove('is-hidden');
    loader.innerHTML = `<div class="boot-loader__inner"><strong>${escapeHtml(text)}</strong><p>Actualisez la page après correction.</p></div>`;
  }
})();
