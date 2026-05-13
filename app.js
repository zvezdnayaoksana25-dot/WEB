(() => {
  'use strict';

  const STORAGE_KEYS = {
    gateComplete: 'soc.gateComplete',
    checklist: 'soc.checklist',
    phrases: 'soc.phrases',
    sessions: 'soc.sessions',
    activeSession: 'soc.activeSession',
    notificationAsked: 'soc.notificationAsked',
    gameProgress: 'soc.gameProgress',
    sessionGoal: 'soc.sessionGoal'
  };

  const CATEGORIES = ['Greeting', 'Flirty', 'Engagement', 'Retention', 'Upsell', 'Control / Direction style', 'Custom'];
  const PRELOADED_PHRASES = [
    { id: 'g1', category: 'Greeting', text: 'Good morning, I’m online and ready to make this session smooth, focused, and fun.' },
    { id: 'g2', category: 'Greeting', text: 'Hi, welcome in. I’m glad you made it today — let’s make the next hour count.' },
    { id: 'g3', category: 'Greeting', text: 'Hey there, settle in and tell me what kind of energy you want from me today.' },
    { id: 'g4', category: 'Greeting', text: 'Welcome back. I have everything ready, and I’m happy to see you again.' },
    { id: 'f1', category: 'Flirty', text: 'You have my attention now, so use it wisely.' },
    { id: 'f2', category: 'Flirty', text: 'I like confident energy. Keep talking like that and I’ll stay very interested.' },
    { id: 'f3', category: 'Flirty', text: 'Careful, that kind of charm can become addictive.' },
    { id: 'f4', category: 'Flirty', text: 'You’re making it very easy to enjoy this conversation.' },
    { id: 'e1', category: 'Engagement', text: 'Tell me one thing you want from this session, and I’ll shape the mood around it.' },
    { id: 'e2', category: 'Engagement', text: 'Choose the vibe: playful, calm, intense, or teasing.' },
    { id: 'e3', category: 'Engagement', text: 'Give me a number from 1 to 10 for your mood right now.' },
    { id: 'e4', category: 'Engagement', text: 'Stay with me for the next five minutes — no distractions, just us and the moment.' },
    { id: 'e5', category: 'Engagement', text: 'What should I remember about you for next time?' },
    { id: 'r1', category: 'Retention', text: 'If you stay a little longer, I’ll keep the energy personal and make it worth your time.' },
    { id: 'r2', category: 'Retention', text: 'Before you go, give me one last choice: soft, playful, or direct?' },
    { id: 'r3', category: 'Retention', text: 'I like when you stay consistent. Come back tomorrow and I’ll remember this mood.' },
    { id: 'u1', category: 'Upsell', text: 'I can make this more custom if you want a focused private moment.' },
    { id: 'u2', category: 'Upsell', text: 'For something more personal, tell me exactly what detail you want me to focus on.' },
    { id: 'c1', category: 'Control / Direction style', text: 'Slow down, focus, and answer exactly what I asked.' },
    { id: 'c2', category: 'Control / Direction style', text: 'I want clear words, steady attention, and no rushing.' },
    { id: 'c3', category: 'Control / Direction style', text: 'Follow my pace. I’ll guide the next step.' },
    { id: 'c4', category: 'Control / Direction style', text: 'Pause for a second, breathe, and keep your eyes on the conversation.' },
    { id: 'c5', category: 'Control / Direction style', text: 'Good. Keep that focus and don’t drift away from me.' },
    { id: 'cu1', category: 'Custom', text: 'I’m switching into work mode now: calm voice, clear energy, consistent presence.' },
    { id: 'cu2', category: 'Custom', text: 'Quick check-in: what would make this session feel successful for you?' },
    { id: 'cu3', category: 'Custom', text: 'I’m taking notes so the next session feels even more personal.' }
  ];
  const MOTIVATION = [
    'SOC is ready. Start clean, show up sharp, win the morning.',
    '07:00 protocol: reset, prepare, and enter work mode.',
    'Your console is waiting. One focused session changes the day.',
    'Good morning operator. Build momentum before the world gets loud.'
  ];

  const GAME_ROUNDS = [
    { id: 'breath', title: 'Calm reset', prompt: 'Take 3 slow breaths. Tap the mood you want to carry into the stream.', options: ['Calm', 'Playful', 'Confident'] },
    { id: 'hook', title: 'Opening hook', prompt: 'Pick today’s first line energy before you go live.', options: ['Warm welcome', 'Teasing opener', 'Direct question'] },
    { id: 'focus', title: 'Focus lock', prompt: 'Choose the one thing that will make this session successful.', options: ['Stay present', 'Reply faster', 'Keep notes'] },
    { id: 'finish', title: 'Launch streak', prompt: 'One final check: smile, posture, light, then launch.', options: ['Ready', 'Almost ready', 'Let’s go'] }
  ];

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const state = {
    currentScreen: 'start',
    selectedCategory: 'Greeting',
    langPair: 'ru|en',
    timerInterval: null,
    reminderTimeout: null,
    gameIndex: 0,
    touchStartX: 0,
    touchStartY: 0
  };

  const safeJson = (value, fallback) => {
    try { return JSON.parse(value) ?? fallback; } catch { return fallback; }
  };
  const memoryStore = new Map();
  const storageWorks = (() => {
    try {
      localStorage.setItem('soc.storageTest', '1');
      localStorage.removeItem('soc.storageTest');
      return true;
    } catch {
      return false;
    }
  })();
  const load = (key, fallback) => safeJson(storageWorks ? localStorage.getItem(key) : memoryStore.get(key), fallback);
  const save = (key, value) => {
    const serialized = JSON.stringify(value);
    if (storageWorks) localStorage.setItem(key, serialized);
    else memoryStore.set(key, serialized);
  };
  const uid = () => `${Date.now().toString(36)}-${crypto.getRandomValues(new Uint32Array(1))[0].toString(36)}`;
  const formatDuration = (ms) => {
    const total = Math.max(0, Math.floor(ms / 1000));
    const h = String(Math.floor(total / 3600)).padStart(2, '0');
    const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
    const s = String(total % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };
  const hours = (ms) => (ms / 3600000).toFixed(1);

  function toast(message) {
    const el = $('#toast');
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(el.hideTimer);
    el.hideTimer = setTimeout(() => el.classList.remove('show'), 2200);
  }

  async function copyText(text) {
    if (!text.trim()) return;
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const area = document.createElement('textarea');
      area.value = text;
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      area.remove();
    }
    toast('Copied to clipboard');
  }

  function showScreen(name) {
    state.currentScreen = name;
    $$('.screen').forEach((screen) => screen.classList.toggle('active', screen.dataset.screen === name));
    $$('.tab').forEach((tab) => tab.classList.toggle('active', tab.dataset.target === name));
    $('#tabBar').classList.toggle('hidden', name === 'start');
    document.body.dataset.screen = name;
  }

  function updateStartProgress() {
    const checks = $$('[data-start-check]');
    const values = checks.reduce((acc, input) => ({ ...acc, [input.dataset.startCheck]: input.checked }), {});
    save(STORAGE_KEYS.checklist, values);
    const gameProgress = getGameProgress();
    const done = checks.filter((input) => input.checked).length + gameProgress.completed.length;
    const total = checks.length + GAME_ROUNDS.length;
    const pct = Math.round((done / total) * 100);
    $('#startProgress').style.width = `${pct}%`;
    $('#progressText').textContent = `${pct}%`;
    $('#enterWorkMode').disabled = pct < 100;
    $('#enterWorkMode').textContent = pct < 100 ? `CHARGE ${100 - pct}% MORE` : 'ENTER WORK MODE';
  }

  function enterApp() {
    save(STORAGE_KEYS.gateComplete, true);
    showScreen('home');
    updateAllStats();
    maybeAskNotifications();
  }

  function resetMorningProtocol() {
    save(STORAGE_KEYS.gateComplete, false);
    save(STORAGE_KEYS.checklist, {});
    save(STORAGE_KEYS.gameProgress, { completed: [], choices: {} });
    state.gameIndex = 0;
    $$('[data-start-check]').forEach((input) => { input.checked = false; });
    renderGameRound();
    updateStartProgress();
    showScreen('start');
  }

  function getPhrases() {
    const stored = load(STORAGE_KEYS.phrases, null);
    if (!Array.isArray(stored)) {
      save(STORAGE_KEYS.phrases, PRELOADED_PHRASES);
      return PRELOADED_PHRASES;
    }
    const storedIds = new Set(stored.map((phrase) => phrase.id));
    const missingDefaults = PRELOADED_PHRASES.filter((phrase) => !storedIds.has(phrase.id));
    const merged = [...stored, ...missingDefaults];
    if (missingDefaults.length) save(STORAGE_KEYS.phrases, merged);
    return merged;
  }

  function getGameProgress() {
    const progress = load(STORAGE_KEYS.gameProgress, { completed: [], choices: {} });
    return {
      completed: Array.isArray(progress.completed) ? progress.completed : [],
      choices: progress.choices && typeof progress.choices === 'object' ? progress.choices : {}
    };
  }

  function setGameProgress(progress) {
    save(STORAGE_KEYS.gameProgress, progress);
    updateStartProgress();
  }

  function renderGameRound() {
    const progress = getGameProgress();
    const round = GAME_ROUNDS[state.gameIndex];
    $('#gameTitle').textContent = round.title;
    $('#gamePrompt').textContent = round.prompt;
    $('#gameCounter').textContent = `${state.gameIndex + 1}/${GAME_ROUNDS.length}`;
    $('#gameOptions').innerHTML = round.options.map((option) => `
      <button class="game-option pressable ${progress.choices[round.id] === option ? 'active' : ''}" data-game-choice="${escapeHtml(option)}">${escapeHtml(option)}</button>
    `).join('');
    const completed = progress.completed.includes(round.id);
    $('#completeGame').textContent = completed ? 'Round complete ✓' : 'Complete round';
    $('#completeGame').classList.toggle('complete', completed);
    $('#prevGame').disabled = state.gameIndex === 0;
    $('#nextGame').disabled = state.gameIndex === GAME_ROUNDS.length - 1;
  }

  function moveGame(delta) {
    state.gameIndex = Math.min(GAME_ROUNDS.length - 1, Math.max(0, state.gameIndex + delta));
    renderGameRound();
  }

  function chooseGameOption(choice) {
    const progress = getGameProgress();
    const round = GAME_ROUNDS[state.gameIndex];
    progress.choices[round.id] = choice;
    setGameProgress(progress);
    renderGameRound();
  }

  function completeGameRound() {
    const progress = getGameProgress();
    const round = GAME_ROUNDS[state.gameIndex];
    if (!progress.choices[round.id]) return toast('Pick one option first');
    if (!progress.completed.includes(round.id)) progress.completed.push(round.id);
    setGameProgress(progress);
    renderGameRound();
    if (state.gameIndex < GAME_ROUNDS.length - 1) moveGame(1);
    toast('Warm-up saved');
  }

  function renderCategories() {
    $('#categoryChips').innerHTML = CATEGORIES.map((category) =>
      `<button class="chip pressable ${category === state.selectedCategory ? 'active' : ''}" data-category="${category}" role="tab">${category}</button>`
    ).join('');
    $('#phraseCategory').innerHTML = CATEGORIES.map((category) => `<option value="${category}">${category}</option>`).join('');
  }

  function renderPhrases() {
    renderCategories();
    const phrases = getPhrases().filter((phrase) => phrase.category === state.selectedCategory);
    $('#phraseList').innerHTML = phrases.length ? phrases.map((phrase) => `
      <article class="phrase-item glass-card pressable" data-copy-phrase="${phrase.id}">
        <div><p>${escapeHtml(phrase.text)}</p><small>${phrase.category}</small></div>
        <button class="delete-button pressable" data-delete-phrase="${phrase.id}" title="Delete phrase">✕</button>
      </article>
    `).join('') : '<article class="phrase-item glass-card"><p>No phrases in this category yet.</p></article>';
  }

  function escapeHtml(text) {
    return text.replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  }

  function addPhrase() {
    const text = $('#newPhrase').value.trim();
    const category = $('#phraseCategory').value;
    if (text.length < 3) return toast('Write a phrase first');
    const phrases = getPhrases();
    phrases.unshift({ id: uid(), category, text });
    save(STORAGE_KEYS.phrases, phrases);
    $('#newPhrase').value = '';
    state.selectedCategory = category;
    renderPhrases();
    toast('Phrase added');
  }

  function deletePhrase(id) {
    save(STORAGE_KEYS.phrases, getPhrases().filter((phrase) => phrase.id !== id));
    renderPhrases();
    toast('Phrase deleted');
  }

  async function translate() {
    const text = $('#translateInput').value.trim();
    if (!text) return toast('Type text to translate');
    $('#translateButton').textContent = 'Translating...';
    $('#translateButton').disabled = true;
    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(state.langPair)}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Translation service unavailable');
      const data = await response.json();
      const translated = data?.responseData?.translatedText || data?.matches?.[0]?.translation;
      if (!translated) throw new Error('No translation returned');
      $('#translateOutput').textContent = translated;
    } catch (error) {
      $('#translateOutput').textContent = 'Translation is unavailable offline or the public API is temporarily busy. Your text remains here so you can try again.';
      toast(error.message);
    } finally {
      $('#translateButton').textContent = 'Translate';
      $('#translateButton').disabled = false;
    }
  }

  function getSessions() { return load(STORAGE_KEYS.sessions, []); }
  function getActiveSession() { return load(STORAGE_KEYS.activeSession, null); }
  function setActiveSession(session) {
    if (session) save(STORAGE_KEYS.activeSession, session);
    else localStorage.removeItem(STORAGE_KEYS.activeSession);
  }

  function toggleSession() {
    const active = getActiveSession();
    if (active) stopSession(active);
    else startSession();
  }

  function startSession() {
    const session = { id: uid(), start: new Date().toISOString(), goalMinutes: load(STORAGE_KEYS.sessionGoal, null) };
    setActiveSession(session);
    startTimerLoop();
    toast('Session started');
  }

  function stopSession(active) {
    const end = new Date();
    const start = new Date(active.start);
    const duration = Math.max(0, end - start);
    const sessions = getSessions();
    sessions.unshift({ ...active, end: end.toISOString(), duration });
    save(STORAGE_KEYS.sessions, sessions);
    setActiveSession(null);
    startTimerLoop();
    updateAllStats();
    toast('Session saved');
  }

  function startTimerLoop() {
    clearInterval(state.timerInterval);
    const tick = () => {
      const active = getActiveSession();
      $('#sessionToggle').textContent = active ? 'Stop Session' : 'Start Session';
      const goal = active?.goalMinutes ? ` · goal ${active.goalMinutes} min` : '';
      $('#sessionState').textContent = active ? `Started ${new Date(active.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}${goal}` : 'Ready to begin a focused block.';
      $('#timerDisplay').textContent = active ? formatDuration(Date.now() - new Date(active.start).getTime()) : '00:00:00';
    };
    tick();
    state.timerInterval = setInterval(tick, 1000);
  }

  function weekStart(date = new Date()) {
    const copy = new Date(date);
    const day = (copy.getDay() + 6) % 7;
    copy.setHours(0, 0, 0, 0);
    copy.setDate(copy.getDate() - day);
    return copy;
  }

  function updateAllStats() {
    const sessions = getSessions();
    const now = new Date();
    const startOfToday = new Date(now); startOfToday.setHours(0, 0, 0, 0);
    const startWeek = weekStart(now);
    const today = sessions.filter((s) => new Date(s.start) >= startOfToday);
    const weekly = sessions.filter((s) => new Date(s.start) >= startWeek);
    const totalMs = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const weeklyMs = weekly.reduce((sum, s) => sum + (s.duration || 0), 0);
    $('#todaySessions').textContent = today.length;
    $('#weekHoursMini').textContent = `${hours(weeklyMs)}h`;
    $('#totalSessions').textContent = sessions.length;
    $('#totalHours').textContent = `${hours(totalMs)}h`;
    renderWeekChart(sessions, startWeek);
    renderHistory(sessions);
  }

  function renderWeekChart(sessions, startWeek) {
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const days = labels.map((label, index) => {
      const date = new Date(startWeek); date.setDate(startWeek.getDate() + index);
      const next = new Date(date); next.setDate(date.getDate() + 1);
      const total = sessions.filter((s) => new Date(s.start) >= date && new Date(s.start) < next).reduce((sum, s) => sum + (s.duration || 0), 0);
      return { label, total };
    });
    const max = Math.max(...days.map((d) => d.total), 3600000);
    $('#weekChart').innerHTML = days.map((day) => `
      <div class="day-bar"><div class="bar" style="height:${Math.max(8, (day.total / max) * 140)}px"></div><span>${day.label}</span><small>${hours(day.total)}h</small></div>
    `).join('');
  }

  function renderHistory(sessions) {
    $('#sessionHistory').innerHTML = sessions.slice(0, 8).map((s) => `
      <div class="history-row"><span><strong>${new Date(s.start).toLocaleDateString()}</strong><br>${new Date(s.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}${s.goalMinutes ? ` · ${s.goalMinutes}m goal` : ''}</span><span>${formatDuration(s.duration)}</span></div>
    `).join('') || '<div class="history-row"><span>No sessions saved yet.</span><span>—</span></div>';
  }

  async function maybeAskNotifications() {
    updateNotificationStatus();
    if (!('Notification' in window) || load(STORAGE_KEYS.notificationAsked, false)) return;
    save(STORAGE_KEYS.notificationAsked, true);
    await requestNotifications();
  }

  async function requestNotifications() {
    if (!('Notification' in window)) return updateNotificationStatus();
    const permission = await Notification.requestPermission();
    updateNotificationStatus();
    if (permission === 'granted') {
      scheduleDailyReminder();
      toast('Daily reminder enabled');
    }
  }

  function updateNotificationStatus() {
    const supported = 'Notification' in window;
    const status = supported ? Notification.permission : 'unsupported';
    $('#notificationStatus').textContent = supported
      ? `Permission: ${status}. Browser reminders run while the app is open or installed and allowed by the OS.`
      : 'This browser does not support web notifications. The app still works normally.';
    $('#enableNotifications').disabled = !supported || status === 'granted';
  }

  function scheduleDailyReminder() {
    clearTimeout(state.reminderTimeout);
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    const now = new Date();
    const next = new Date(now);
    next.setHours(7, 0, 0, 0);
    if (next <= now) next.setDate(next.getDate() + 1);
    state.reminderTimeout = setTimeout(() => {
      const body = MOTIVATION[Math.floor(Math.random() * MOTIVATION.length)];
      if (navigator.serviceWorker?.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'SHOW_REMINDER', title: 'SOC 07:00', body });
      } else {
        new Notification('SOC 07:00', { body, tag: 'soc-daily-reminder' });
      }
      scheduleDailyReminder();
    }, next - now);
  }

  async function registerServiceWorker() {
    if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
    try {
      await navigator.serviceWorker.register('service-worker.js');
    } catch {
      toast('Offline cache unavailable in this browser context');
    }
  }

  function bindEvents() {
    $$('[data-start-check]').forEach((input) => input.addEventListener('change', updateStartProgress));
    $('#enterWorkMode').addEventListener('click', enterApp);
    $('#resetStart').addEventListener('click', resetMorningProtocol);
    $('#sessionToggle').addEventListener('click', toggleSession);
    $$('.goal-chip').forEach((button) => button.addEventListener('click', () => {
      save(STORAGE_KEYS.sessionGoal, Number(button.dataset.goal));
      $$('.goal-chip').forEach((chip) => chip.classList.toggle('active', chip === button));
      toast(`${button.dataset.goal} minute goal saved`);
    }));
    $('#enableNotifications').addEventListener('click', requestNotifications);
    $('#addPhrase').addEventListener('click', addPhrase);
    $('#prevGame').addEventListener('click', () => moveGame(-1));
    $('#nextGame').addEventListener('click', () => moveGame(1));
    $('#completeGame').addEventListener('click', completeGameRound);
    $('#gameOptions').addEventListener('click', (event) => {
      const choice = event.target.closest('[data-game-choice]');
      if (choice) chooseGameOption(choice.dataset.gameChoice);
    });
    $('#startGame').addEventListener('touchstart', (event) => {
      const touch = event.changedTouches[0];
      state.touchStartX = touch.clientX;
      state.touchStartY = touch.clientY;
    }, { passive: true });
    $('#startGame').addEventListener('touchend', (event) => {
      const touch = event.changedTouches[0];
      const dx = touch.clientX - state.touchStartX;
      const dy = touch.clientY - state.touchStartY;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.25) moveGame(dx < 0 ? 1 : -1);
    }, { passive: true });
    $('#translateButton').addEventListener('click', translate);
    $('#copyTranslation').addEventListener('click', () => copyText($('#translateOutput').textContent));
    $('#clearHistory').addEventListener('click', () => { save(STORAGE_KEYS.sessions, []); updateAllStats(); toast('History cleared'); });
    $('#categoryChips').addEventListener('click', (event) => {
      const button = event.target.closest('[data-category]');
      if (!button) return;
      state.selectedCategory = button.dataset.category;
      renderPhrases();
    });
    $('#phraseList').addEventListener('click', (event) => {
      const deleteButton = event.target.closest('[data-delete-phrase]');
      if (deleteButton) { event.stopPropagation(); return deletePhrase(deleteButton.dataset.deletePhrase); }
      const card = event.target.closest('[data-copy-phrase]');
      if (!card) return;
      const phrase = getPhrases().find((item) => item.id === card.dataset.copyPhrase);
      if (phrase) copyText(phrase.text);
    });
    $$('.tab').forEach((tab) => tab.addEventListener('click', () => showScreen(tab.dataset.target)));
    $('#app').addEventListener('touchstart', (event) => {
      if (event.target.closest('textarea, input, select, button, #startGame')) return;
      const touch = event.changedTouches[0];
      state.touchStartX = touch.clientX;
      state.touchStartY = touch.clientY;
    }, { passive: true });
    $('#app').addEventListener('touchend', (event) => {
      if (event.target.closest('textarea, input, select, button, #startGame')) return;
      const touch = event.changedTouches[0];
      const dx = touch.clientX - state.touchStartX;
      const dy = touch.clientY - state.touchStartY;
      if (Math.abs(dx) < 72 || Math.abs(dx) < Math.abs(dy) * 1.35 || state.currentScreen === 'start') return;
      const screens = ['home', 'phrases', 'translate', 'stats'];
      const nextIndex = Math.min(screens.length - 1, Math.max(0, screens.indexOf(state.currentScreen) + (dx < 0 ? 1 : -1)));
      showScreen(screens[nextIndex]);
    }, { passive: true });
    $$('.translate-controls .chip').forEach((button) => button.addEventListener('click', () => {
      state.langPair = button.dataset.pair;
      $$('.translate-controls .chip').forEach((chip) => chip.classList.toggle('active', chip === button));
    }));
  }

  function boot() {
    const checklist = load(STORAGE_KEYS.checklist, {});
    $$('[data-start-check]').forEach((input) => { input.checked = Boolean(checklist[input.dataset.startCheck]); });
    bindEvents();
    updateStartProgress();
    renderPhrases();
    renderGameRound();
    const goal = load(STORAGE_KEYS.sessionGoal, null);
    $$('.goal-chip').forEach((chip) => chip.classList.toggle('active', Number(chip.dataset.goal) === goal));
    if (!storageWorks) $('#saveStatus').textContent = 'Storage is blocked in this browser mode; install/open normally to keep stats across days.';
    startTimerLoop();
    updateAllStats();
    registerServiceWorker();
    if (load(STORAGE_KEYS.gateComplete, false)) {
      showScreen('home');
      maybeAskNotifications();
    } else {
      showScreen('start');
    }
    scheduleDailyReminder();
  }

  document.addEventListener('DOMContentLoaded', boot);
})();
