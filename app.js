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

  const APP_NAME = 'Люмос';
  const DEFAULT_CATEGORY = 'Приветствие';
  const CATEGORIES = ['Приветствие', 'Флирт', 'Вовлечение', 'Удержание', 'Приват / чаевые', 'Границы и темп', 'Личные'];
  const LEGACY_DEFAULT_IDS = new Set([
    'g1', 'g2', 'g3', 'g4', 'f1', 'f2', 'f3', 'f4', 'e1', 'e2', 'e3', 'e4', 'e5',
    'r1', 'r2', 'r3', 'u1', 'u2', 'c1', 'c2', 'c3', 'c4', 'c5', 'cu1', 'cu2', 'cu3'
  ]);
  const PRELOADED_PHRASES = [
    { id: 'ru-g1', category: 'Приветствие', text: 'Hi, welcome in. I’m happy you found my room today.', translation: 'Привет, добро пожаловать. Я рада, что ты сегодня нашёл мою комнату.' },
    { id: 'ru-g2', category: 'Приветствие', text: 'Good morning, loves. I’m still waking up, so be gentle and keep me company.', translation: 'Доброе утро, милые. Я ещё просыпаюсь, так что будьте нежными и составьте мне компанию.' },
    { id: 'ru-g3', category: 'Приветствие', text: 'Welcome back. I saved a soft mood and a pretty smile for you.', translation: 'С возвращением. Я сохранила для тебя мягкое настроение и красивую улыбку.' },
    { id: 'ru-g4', category: 'Приветствие', text: 'Say hi when you enter, I love knowing who is watching me.', translation: 'Поздоровайся, когда заходишь, мне нравится знать, кто на меня смотрит.' },
    { id: 'ru-f1', category: 'Флирт', text: 'You are distracting me in the best way right now.', translation: 'Ты сейчас отвлекаешь меня самым приятным образом.' },
    { id: 'ru-f2', category: 'Флирт', text: 'I like confident viewers. Keep that energy with me.', translation: 'Мне нравятся уверенные зрители. Оставайся со мной в этой энергии.' },
    { id: 'ru-f3', category: 'Флирт', text: 'Careful, if you keep being sweet, I might get attached.', translation: 'Осторожно, если продолжишь быть таким милым, я могу привязаться.' },
    { id: 'ru-f4', category: 'Флирт', text: 'You just made me smile for real.', translation: 'Ты только что заставил меня улыбнуться по-настоящему.' },
    { id: 'ru-e1', category: 'Вовлечение', text: 'Choose my vibe for the next five minutes: cute, teasing, or mysterious.', translation: 'Выбери мой вайб на следующие пять минут: милая, дразнящая или загадочная.' },
    { id: 'ru-e2', category: 'Вовлечение', text: 'Tell me where you are watching from and I’ll send you a little smile.', translation: 'Скажи, откуда ты смотришь, и я отправлю тебе маленькую улыбку.' },
    { id: 'ru-e3', category: 'Вовлечение', text: 'Give me a number from 1 to 10 for your mood today.', translation: 'Оцени своё настроение сегодня от 1 до 10.' },
    { id: 'ru-e4', category: 'Вовлечение', text: 'Stay with me for one song and help me wake this room up.', translation: 'Останься со мной на одну песню и помоги разбудить эту комнату.' },
    { id: 'ru-r1', category: 'Удержание', text: 'Don’t disappear yet, the cozy part is just starting.', translation: 'Не исчезай пока, самая уютная часть только начинается.' },
    { id: 'ru-r2', category: 'Удержание', text: 'If you stay a little longer, I’ll keep the attention warm and personal.', translation: 'Если останешься ещё немного, я сохраню тёплое и личное внимание.' },
    { id: 'ru-r3', category: 'Удержание', text: 'Come back tomorrow and remind me of this moment.', translation: 'Возвращайся завтра и напомни мне об этом моменте.' },
    { id: 'ru-u1', category: 'Приват / чаевые', text: 'If you want my full attention, private is the sweetest place for that.', translation: 'Если хочешь всё моё внимание, приват — самое приятное место для этого.' },
    { id: 'ru-u2', category: 'Приват / чаевые', text: 'Tips help me choose the next mood, outfit, or little challenge.', translation: 'Чаевые помогают мне выбрать следующий вайб, образ или маленький челлендж.' },
    { id: 'ru-u3', category: 'Приват / чаевые', text: 'Check my menu and tell me what sounds fun for you.', translation: 'Посмотри моё меню и скажи, что тебе кажется интересным.' },
    { id: 'ru-c1', category: 'Границы и темп', text: 'Slow down, sweetheart. Clear words first, then we keep playing.', translation: 'Помедленнее, милый. Сначала понятные слова, потом продолжаем играть.' },
    { id: 'ru-c2', category: 'Границы и темп', text: 'I like respectful attention. Keep it sweet and I’ll stay close.', translation: 'Мне нравится уважительное внимание. Будь милым, и я останусь ближе.' },
    { id: 'ru-c3', category: 'Границы и темп', text: 'Let me guide the pace, it feels better when we do it my way.', translation: 'Позволь мне вести темп, так получается приятнее.' },
    { id: 'ru-l1', category: 'Личные', text: 'Work mode is on: soft voice, clean setup, steady smile.', translation: 'Рабочий режим включён: мягкий голос, чистая сцена, спокойная улыбка.' },
    { id: 'ru-l2', category: 'Личные', text: 'Quick check-in: what would make this room feel special for you?', translation: 'Быстрая проверка: что сделает эту комнату особенной для тебя?' }
  ];
  const MOTIVATION = [
    'Люмос зовёт: вода, лицо, свет — и без переговоров с ленью.',
    '07:00: не решай всю жизнь, просто сделай первый маленький шаг к эфиру.',
    'Ты не обязана хотеть. Достаточно открыть протокол и двигаться по пунктам.',
    'Один спокойный старт сегодня важнее идеального настроения завтра.'
  ];

  const GAME_ROUNDS = [
    { id: 'wake', title: 'Снять режим «ещё пять минут»', prompt: 'Выбери самый маленький первый шаг. После выбора сделай его сразу, без оценки настроения.', options: ['Выпить воды', 'Умыться', 'Открыть шторы'] },
    { id: 'body', title: 'Тело в ресурс', prompt: 'Подготовка не обязана быть идеальной. Выбери один телесный шаг, который даст ощущение чистого старта.', options: ['Душ/умывание', 'Бритьё/уход', 'Завтрак'] },
    { id: 'look', title: 'Образ без перфекционизма', prompt: 'Собери минимальный образ для камеры: достаточно версии на 70%, чтобы начать вовремя.', options: ['База макияжа', 'Красивый комплект', 'Волосы + аромат'] },
    { id: 'scene', title: 'Сцена за 10 минут', prompt: 'Выбери главный технический якорь: когда он готов, работа уже почти началась.', options: ['Свет и кадр', 'Ноутбук + интернет', 'Чат и заметки'] },
    { id: 'launch', title: 'Кнопка эфира', prompt: 'Финальная договорённость: 20 минут тестового эфира считаются победой, даже если дальше решишь продолжать.', options: ['Старт 20 минут', 'Старт 60 минут', 'Я уже иду'] }
  ];
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const state = {
    currentScreen: 'start',
    selectedCategory: DEFAULT_CATEGORY,
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
    toast('Скопировано в буфер');
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
    $('#enterWorkMode').textContent = pct < 100 ? `ЕЩЁ ${100 - pct}% ДО ЭФИРА` : 'ВЫЙТИ В ЭФИР';
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

  function normalizePhrase(phrase) {
    const category = CATEGORIES.includes(phrase.category) ? phrase.category : 'Личные';
    return {
      id: phrase.id || uid(),
      category,
      text: phrase.text || '',
      translation: phrase.translation || (hasCyrillic(phrase.text || '') ? phrase.text : 'Перевод появится после повторного добавления фразы.')
    };
  }

  function getPhrases() {
    const stored = load(STORAGE_KEYS.phrases, null);
    if (!Array.isArray(stored)) {
      save(STORAGE_KEYS.phrases, PRELOADED_PHRASES);
      return PRELOADED_PHRASES;
    }
    const personal = stored
      .filter((phrase) => phrase?.text && !LEGACY_DEFAULT_IDS.has(phrase.id) && !PRELOADED_PHRASES.some((item) => item.id === phrase.id))
      .map(normalizePhrase);
    const merged = [...personal, ...PRELOADED_PHRASES];
    save(STORAGE_KEYS.phrases, merged);
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
    $('#completeGame').textContent = completed ? 'Шаг готов ✓' : 'Завершить шаг';
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
    if (!progress.choices[round.id]) return toast('Сначала выбери вариант');
    if (!progress.completed.includes(round.id)) progress.completed.push(round.id);
    setGameProgress(progress);
    renderGameRound();
    if (state.gameIndex < GAME_ROUNDS.length - 1) moveGame(1);
    toast('Шаг сохранён');
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
        <div>
          <p>${escapeHtml(phrase.text)}</p>
          <small class="phrase-translation">${escapeHtml(phrase.translation || '')}</small>
          <small>${phrase.category}</small>
        </div>
        <button class="delete-button pressable" data-delete-phrase="${phrase.id}" title="Удалить фразу">✕</button>
      </article>
    `).join('') : '<article class="phrase-item glass-card"><p>В этой категории пока нет фраз.</p></article>';
  }

  function escapeHtml(text) {
    return text.replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  }


  function hasCyrillic(text) {
    return /[А-Яа-яЁё]/.test(text);
  }

  async function translateText(text, langPair = 'en|ru') {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(langPair)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Сервис перевода недоступен');
    const data = await response.json();
    const translated = data?.responseData?.translatedText || data?.matches?.[0]?.translation;
    if (!translated) throw new Error('Перевод не вернулся');
    return translated;
  }

  async function addPhrase() {
    const text = $('#newPhrase').value.trim();
    const category = $('#phraseCategory').value;
    if (text.length < 3) return toast('Сначала напиши фразу');
    $('#addPhrase').disabled = true;
    $('#addPhrase').textContent = 'Добавляю перевод...';
    let translation = hasCyrillic(text) ? text : 'Перевод временно недоступен — попробуй позже через вкладку «Перевод». ';
    try {
      if (!hasCyrillic(text)) translation = await translateText(text, 'en|ru');
    } catch (error) {
      toast(error.message);
    } finally {
      const phrases = getPhrases();
      phrases.unshift({ id: uid(), category, text, translation });
      save(STORAGE_KEYS.phrases, phrases);
      $('#newPhrase').value = '';
      state.selectedCategory = category;
      renderPhrases();
      $('#addPhrase').disabled = false;
      $('#addPhrase').textContent = 'Добавить фразу';
      toast('Фраза добавлена');
    }
  }

  function deletePhrase(id) {
    save(STORAGE_KEYS.phrases, getPhrases().filter((phrase) => phrase.id !== id));
    renderPhrases();
    toast('Фраза удалена');
  }

  async function translate() {
    const text = $('#translateInput').value.trim();
    if (!text) return toast('Введи текст для перевода');
    $('#translateButton').textContent = 'Перевожу...';
    $('#translateButton').disabled = true;
    try {
      $('#translateOutput').textContent = await translateText(text, state.langPair);
    } catch (error) {
      $('#translateOutput').textContent = 'Перевод недоступен офлайн или публичный сервис временно занят. Текст остался здесь — попробуй ещё раз.';
      toast(error.message);
    } finally {
      $('#translateButton').textContent = 'Перевести';
      $('#translateButton').disabled = false;
    }
  }

  function getSessions() { return load(STORAGE_KEYS.sessions, []); }
  function getActiveSession() { return load(STORAGE_KEYS.activeSession, null); }
  function setActiveSession(session) {
    if (session) save(STORAGE_KEYS.activeSession, session);
    else if (storageWorks) localStorage.removeItem(STORAGE_KEYS.activeSession);
    else memoryStore.delete(STORAGE_KEYS.activeSession);
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
    toast('Эфир начат');
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
    toast('Эфир сохранён');
  }

  function startTimerLoop() {
    clearInterval(state.timerInterval);
    const tick = () => {
      const active = getActiveSession();
      $('#sessionToggle').textContent = active ? 'Остановить эфир' : 'Начать эфир';
      const goal = active?.goalMinutes ? ` · цель ${active.goalMinutes} мин` : '';
      $('#sessionState').textContent = active ? `Начала в ${new Date(active.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}${goal}` : 'Готова начать спокойный рабочий блок.';
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
    $('#weekHoursMini').textContent = `${hours(weeklyMs)} ч`;
    $('#totalSessions').textContent = sessions.length;
    $('#totalHours').textContent = `${hours(totalMs)} ч`;
    renderWeekChart(sessions, startWeek);
    renderHistory(sessions);
  }

  function renderWeekChart(sessions, startWeek) {
    const labels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    const days = labels.map((label, index) => {
      const date = new Date(startWeek); date.setDate(startWeek.getDate() + index);
      const next = new Date(date); next.setDate(date.getDate() + 1);
      const total = sessions.filter((s) => new Date(s.start) >= date && new Date(s.start) < next).reduce((sum, s) => sum + (s.duration || 0), 0);
      return { label, total };
    });
    const max = Math.max(...days.map((d) => d.total), 3600000);
    $('#weekChart').innerHTML = days.map((day) => `
      <div class="day-bar"><div class="bar" style="height:${Math.max(8, (day.total / max) * 140)}px"></div><span>${day.label}</span><small>${hours(day.total)} ч</small></div>
    `).join('');
  }

  function renderHistory(sessions) {
    $('#sessionHistory').innerHTML = sessions.slice(0, 8).map((s) => `
      <div class="history-row"><span><strong>${new Date(s.start).toLocaleDateString()}</strong><br>${new Date(s.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}${s.goalMinutes ? ` · цель ${s.goalMinutes} мин` : ''}</span><span>${formatDuration(s.duration)}</span></div>
    `).join('') || '<div class="history-row"><span>Эфиры пока не сохранены.</span><span>—</span></div>';
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
      toast('Ежедневное напоминание включено');
    }
  }

  function updateNotificationStatus() {
    const supported = 'Notification' in window;
    const status = supported ? Notification.permission : 'unsupported';
    const labels = { granted: 'разрешено', denied: 'запрещено', default: 'ещё не выбрано', unsupported: 'не поддерживается' };
    $('#notificationStatus').textContent = supported
      ? `Разрешение: ${labels[status] || status}. Напоминания работают, пока приложение открыто или установлено и разрешено системой.`
      : 'Этот браузер не поддерживает веб-уведомления. Остальные функции работают обычно.';
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
        navigator.serviceWorker.controller.postMessage({ type: 'SHOW_REMINDER', title: `${APP_NAME} 07:00`, body });
      } else {
        new Notification(`${APP_NAME} 07:00`, { body, tag: 'lumos-daily-reminder' });
      }
      scheduleDailyReminder();
    }, next - now);
  }

  async function registerServiceWorker() {
    if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
    try {
      await navigator.serviceWorker.register('service-worker.js');
    } catch {
      toast('Офлайн-кэш недоступен в этом браузере');
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
      toast(`Цель ${button.dataset.goal} мин сохранена`);
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
    $('#clearHistory').addEventListener('click', () => { save(STORAGE_KEYS.sessions, []); updateAllStats(); toast('История очищена'); });
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
    if (!storageWorks) $('#saveStatus').textContent = 'Хранилище заблокировано в этом режиме браузера; открой приложение обычным способом, чтобы сохранять данные между днями.';
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
