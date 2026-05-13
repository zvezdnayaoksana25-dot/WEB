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
    questProgress: 'soc.questProgress',
    sessionGoal: 'soc.sessionGoal',
    prepRuns: 'soc.prepRuns',
    earnings: 'soc.earnings',
    earningGoal: 'soc.earningGoal'
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

  const QUEST_STEPS = [
    { id: 'water', icon: '💧', title: 'Выпить воды', prompt: 'Сделай 6–8 спокойных глотков. Это первый физический якорь: тело уже начало смену.', verify: 'Поставь стакан рядом или наполни бутылку, чтобы вода осталась под рукой.', reward: '💧 Бейдж «Запуск тела»' },
    { id: 'wash', icon: '🌊', title: 'Умыться', prompt: 'Умойся и протри лицо. Не думай про весь эфир — только вода и зеркало.', verify: 'Коснись сухим полотенцем лица: шаг засчитывается только после умывания.', reward: '🌊 +5 к свежести' },
    { id: 'skincare', icon: '✨', title: 'Нанести кремики', prompt: 'Нанеси уход: крем, SPF или то, что делает лицо комфортным под камерой.', verify: 'Закрой баночку/тюбик и убери его на место — это маленькая точка завершения.', reward: '✨ Бейдж «Glow ready»' },
    { id: 'breakfast', icon: '🍳', title: 'Позавтракать', prompt: 'Съешь что-то простое. Цель — энергия на первые минуты, не идеальный завтрак.', verify: 'После еды поставь посуду в раковину или убери упаковку.', reward: '🍳 +10 к выносливости' },
    { id: 'makeup', icon: '💄', title: 'Накраситься', prompt: 'Собери базовый макияж для камеры. Достаточно версии на 70%, не музейного идеала.', verify: 'Сделай короткий взгляд в зеркало: лицо читается в кадре — значит готово.', reward: '💄 Бейдж «Образ включён»' },
    { id: 'lights', icon: '💡', title: 'Выставить свет', prompt: 'Включи и поставь свет так, чтобы лицо было мягко видно, без резких теней.', verify: 'Открой камеру на секунду и проверь лицо в кадре.', reward: '💡 +10 к сцене' },
    { id: 'camera', icon: '🎥', title: 'Поставить камеру', prompt: 'Выставь ракурс, фон и высоту камеры. Один кадр — одна понятная сцена.', verify: 'Сделай тестовый скрин/взгляд: голова, плечи и образ попадают в кадр.', reward: '🎥 Бейдж «Кадр собран»' },
    { id: 'laptop', icon: '💻', title: 'Подключить ноутбук', prompt: 'Подключи зарядку, интернет, площадку и нужные вкладки. Техника должна быть скучной и готовой.', verify: 'Проверь, что ноутбук заряжается, а страница эфира открывается.', reward: '💻 +10 к стабильности' },
    { id: 'bathroom2', icon: '🛁', title: 'Ещё раз в ванную', prompt: 'Финальная ванная: туалет, руки, волосы, ощущение чистоты и спокойствия.', verify: 'Вернись к рабочему месту уже без незакрытых бытовых дел.', reward: '🛁 Бейдж «Ничего не отвлекает»' },
    { id: 'intimate', icon: '🧸', title: 'Интимная подготовка с игрушкой', prompt: 'Подготовь игрушку и тело так, как тебе безопасно и комфортно для формата эфира.', verify: 'Используй лубрикант/гигиену по своему правилу и проверь, что всё ощущается нормально.', reward: '🧸 +10 к уверенности' },
    { id: 'outfit', icon: '👗', title: 'Одеться красиво', prompt: 'Надень образ, в котором тебе легко включить роль. Красиво — значит удобно держать энергию.', verify: 'Сядь/встань в кадре и проверь, что образ выглядит хорошо в движении.', reward: '👗 Бейдж «Сцена живая»' },
    { id: 'sound', icon: '🎧', title: 'Проверить звук и чат', prompt: 'Проверь микрофон, звук, чат, меню и быстрые фразы. Это снижает стресс после старта.', verify: 'Скажи тестовую фразу и убедись, что всё слышно/видно.', reward: '🎧 +10 к контролю' },
    { id: 'warmup', icon: '🗣️', title: 'Первая фраза', prompt: 'Произнеси вслух первую фразу для входа: приветствие, настроение, вопрос зрителям.', verify: 'Не читай молча — скажи её голосом, чтобы рот и роль уже включились.', reward: '🗣️ Бейдж «Голос включён»' },
    { id: 'launch', icon: '🚀', title: 'Выходить в эфир', prompt: 'Открывай смену. Первые 20 минут — тестовый вход, дальше можно разгоняться.', verify: 'Нажми кнопку старта на площадке, потом открой пульт эфира здесь.', reward: '🚀 Финальный бейдж «Эфир открыт»' }
  ];
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const state = {
    currentScreen: 'start',
    selectedCategory: DEFAULT_CATEGORY,
    langPair: 'ru|en',
    timerInterval: null,
    reminderTimeout: null,
    questStep: 0,
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
  const money = (value) => `$${Number(value || 0).toLocaleString('ru-RU', { maximumFractionDigits: 2 })}`;
  const dateKey = (date = new Date()) => {
    const copy = new Date(date);
    copy.setMinutes(copy.getMinutes() - copy.getTimezoneOffset());
    return copy.toISOString().slice(0, 10);
  };

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
    const tabTarget = ['addPhrase', 'earnings'].includes(name) ? 'more' : name;
    $$('.tab').forEach((tab) => tab.classList.toggle('active', tab.dataset.target === tabTarget));
    $('#tabBar').classList.toggle('hidden', name === 'start');
    document.body.dataset.screen = name;
  }

  function getQuestProgress() {
    const legacy = getGameProgress();
    const progress = load(STORAGE_KEYS.questProgress, null);
    const completed = Array.isArray(progress?.completed) ? progress.completed : [];
    const safeCompleted = completed.filter((id) => QUEST_STEPS.some((step) => step.id === id));
    if (!progress && legacy.completed?.length) {
      save(STORAGE_KEYS.questProgress, { completed: [] });
    }
    return { completed: safeCompleted };
  }

  function setQuestProgress(progress) {
    save(STORAGE_KEYS.questProgress, {
      completed: Array.isArray(progress.completed) ? progress.completed : []
    });
    updateStartProgress();
  }

  function updateStartProgress() {
    const progress = getQuestProgress();
    const done = progress.completed.length;
    const total = QUEST_STEPS.length;
    const pct = Math.round((done / total) * 100);
    const complete = done >= total;
    $('#startProgress').style.width = `${pct}%`;
    $('#progressText').textContent = `${done}/${total}`;
    $('#enterWorkMode').disabled = !complete;
    $('#enterWorkMode').textContent = complete ? 'ОТКРЫТЬ ЭФИР' : `ЕЩЁ ${total - done} ШАГ${total - done === 1 ? '' : 'А'} ДО ЭФИРА`;
    renderQuestStep();
    renderLaunchPlanPreview();
  }

  function enterApp() {
    savePrepRun();
    save(STORAGE_KEYS.gateComplete, true);
    showScreen('home');
    updateAllStats();
    maybeAskNotifications();
  }

  function resetMorningProtocol() {
    save(STORAGE_KEYS.gateComplete, false);
    save(STORAGE_KEYS.checklist, {});
    save(STORAGE_KEYS.gameProgress, { completed: [], choices: {} });
    save(STORAGE_KEYS.questProgress, { completed: [] });
    state.questStep = 0;
    updateStartProgress();
    renderLaunchPlanPreview();
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

  function getPrepRuns() { return load(STORAGE_KEYS.prepRuns, []); }

  function savePrepRun() {
    const progress = getQuestProgress();
    const runs = getPrepRuns();
    runs.unshift({
      id: uid(),
      date: new Date().toISOString(),
      completed: progress.completed.length,
      total: QUEST_STEPS.length,
      checklist: Object.fromEntries(progress.completed.map((id) => [id, true])),
      choices: Object.fromEntries(progress.completed.map((id, index) => [String(index + 1).padStart(2, '0'), QUEST_STEPS.find((step) => step.id === id)?.title || id]))
    });
    save(STORAGE_KEYS.prepRuns, runs.slice(0, 60));
  }

  function renderLaunchPlanPreview() {
    const el = $('#launchPlanPreview');
    if (!el) return;
    const progress = getQuestProgress();
    const done = progress.completed.length;
    const next = QUEST_STEPS[done];
    el.innerHTML = done >= QUEST_STEPS.length
      ? '<strong>План входа:</strong> подготовка закрыта, первые 20 минут — мягкий тестовый эфир.'
      : `<strong>Следующий якорь:</strong> ${escapeHtml(next?.title || 'выход в эфир')}. Не держи весь список в голове — делай только один шаг.`;
  }

  function renderQuestStep() {
    const progress = getQuestProgress();
    const done = progress.completed.length;
    const currentIndex = Math.min(done, QUEST_STEPS.length - 1);
    const step = QUEST_STEPS[currentIndex];
    const complete = done >= QUEST_STEPS.length;
    state.questStep = currentIndex;
    $('#questTitle').textContent = complete ? 'Квест подготовки завершён' : step.title;
    $('#questCounter').textContent = complete ? `${QUEST_STEPS.length}/${QUEST_STEPS.length}` : `${currentIndex + 1}/${QUEST_STEPS.length}`;
    $('#questIcon').textContent = complete ? '🏁' : step.icon;
    $('#questPrompt').textContent = complete ? 'Все шаги закрыты. Теперь можно открывать эфир без ощущения, что что-то забыто.' : step.prompt;
    $('#questMicrocopy').textContent = complete ? 'Финальная награда получена — переходи в рабочий режим.' : step.verify;
    $('#questReward').textContent = complete ? '🏁 Полная подготовка сохранится в достижениях после входа в эфир.' : step.reward;
    $('#completeQuestStep').disabled = complete;
    $('#completeQuestStep').textContent = complete ? 'Все шаги выполнены' : 'Готово, я сделала';
    $('#undoQuestStep').disabled = done === 0;
    renderQuestBadges(done);
  }

  function renderQuestBadges(done) {
    $('#badgeWater').classList.toggle('earned', done >= 1);
    $('#badgeGlow').classList.toggle('earned', done >= 5);
    $('#badgeStudio').classList.toggle('earned', done >= 8);
    $('#badgeLaunch').classList.toggle('earned', done >= QUEST_STEPS.length);
  }

  function completeQuestStep() {
    const progress = getQuestProgress();
    if (progress.completed.length >= QUEST_STEPS.length) return;
    const step = QUEST_STEPS[progress.completed.length];
    progress.completed.push(step.id);
    setQuestProgress(progress);
    toast(step.reward);
  }

  function undoQuestStep() {
    const progress = getQuestProgress();
    if (!progress.completed.length) return;
    progress.completed.pop();
    setQuestProgress(progress);
    toast('Вернулась на предыдущий шаг');
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

  function startOfMonth(date = new Date()) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  function getEarnings() { return load(STORAGE_KEYS.earnings, []); }
  function getEarningGoal() { return load(STORAGE_KEYS.earningGoal, { name: '', amount: 0 }); }

  function saveEarningEntry() {
    const date = $('#earningDate').value || dateKey();
    const amount = Number($('#earningAmount').value || 0);
    const note = $('#earningNote').value.trim();
    if (!amount || amount < 0) return toast('Введи сумму за день');
    const entries = getEarnings().filter((entry) => entry.date !== date);
    entries.unshift({ id: uid(), date, amount, note, savedAt: new Date().toISOString() });
    entries.sort((a, b) => new Date(b.date) - new Date(a.date));
    save(STORAGE_KEYS.earnings, entries);
    $('#earningAmount').value = '';
    $('#earningNote').value = '';
    renderEarnings();
    updateAllStats();
    toast('Заработок сохранён');
  }

  function saveEarningGoal() {
    const name = $('#earningGoalName').value.trim();
    const amount = Number($('#earningGoalAmount').value || 0);
    if (!name || !amount) return toast('Укажи название и сумму цели');
    save(STORAGE_KEYS.earningGoal, { name, amount });
    renderEarnings();
    toast('Цель сохранена');
  }

  function earningsSummary(entries = getEarnings()) {
    const now = new Date();
    const todayKey = dateKey(now);
    const startWeek = weekStart(now);
    const monthStart = startOfMonth(now);
    const today = entries.filter((entry) => entry.date === todayKey).reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
    const week = entries.filter((entry) => new Date(entry.date) >= startWeek).reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
    const month = entries.filter((entry) => new Date(entry.date) >= monthStart).reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
    const total = entries.reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
    return { today, week, month, total };
  }

  function renderEarnings() {
    const entries = getEarnings();
    const summary = earningsSummary(entries);
    const goal = getEarningGoal();
    const goalAmount = Number(goal.amount || 0);
    const pct = goalAmount ? Math.min(100, Math.round((summary.total / goalAmount) * 100)) : 0;
    $('#todayEarnings').textContent = money(summary.today);
    $('#weekEarnings').textContent = money(summary.week);
    $('#earningGoalName').value = goal.name || '';
    $('#earningGoalAmount').value = goal.amount || '';
    $('#earningGoalLabel').textContent = goalAmount ? `${goal.name}: ${money(summary.total)} из ${money(goalAmount)}` : 'Цель не задана';
    $('#earningGoalPercent').textContent = `${pct}%`;
    $('#earningGoalFill').style.width = `${pct}%`;
    renderEarningsChart(entries);
    renderEarningHistory(entries);
  }

  function renderEarningsChart(entries) {
    const labels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    const startWeek = weekStart(new Date());
    const days = labels.map((label, index) => {
      const date = new Date(startWeek); date.setDate(startWeek.getDate() + index);
      const key = dateKey(date);
      const total = entries.filter((entry) => entry.date === key).reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
      return { label, total };
    });
    const max = Math.max(...days.map((day) => day.total), 1);
    const streak = days.filter((day) => day.total > 0).length;
    $('#earningStreak').textContent = `${streak}/7 дней`;
    $('#earningsChart').innerHTML = days.map((day) => `
      <div class="day-bar"><div class="bar money-bar" style="height:${Math.max(8, (day.total / max) * 140)}px"></div><span>${day.label}</span><small>${money(day.total)}</small></div>
    `).join('');
  }

  function renderEarningHistory(entries) {
    $('#earningHistory').innerHTML = entries.slice(0, 10).map((entry) => `
      <div class="history-row"><span><strong>${new Date(entry.date).toLocaleDateString()}</strong><br>${escapeHtml(entry.note || 'Без заметки')}</span><span>${money(entry.amount)}</span></div>
    `).join('') || '<div class="history-row"><span>Записей заработка пока нет.</span><span>—</span></div>';
  }

  function buildAchievements(sessions, prepRuns, entries) {
    const totalMs = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const maxSession = Math.max(0, ...sessions.map((s) => s.duration || 0));
    const prepared = prepRuns.filter((run) => run.completed >= run.total).length;
    const earningDays = new Set(entries.map((entry) => entry.date)).size;
    return [
      sessions.length >= 1 ? '🌱 Первый эфир сохранён' : '🌱 Первый эфир ждёт старта',
      totalMs >= 6 * 3600000 ? '🔥 6+ часов в копилке' : '🔥 Бейдж 6 часов ещё впереди',
      maxSession >= 5 * 3600000 ? '👑 Длинный эфир 5+ часов' : '👑 Длинный эфир 5+ часов — следующая цель',
      prepared >= 3 ? '🧩 3 полные подготовки' : `🧩 Полных подготовок: ${prepared}/3`,
      earningDays >= 5 ? '💎 5 дней заработка записано' : `💎 Дней с заработком: ${earningDays}/5`
    ];
  }

  function renderGameInsight(sessions, prepRuns, entries, weeklyMs) {
    const goal = load(STORAGE_KEYS.sessionGoal, 360) || 360;
    const weeklyGoalMs = goal * 60000;
    const weeklyPct = Math.min(100, Math.round((weeklyMs / weeklyGoalMs) * 100));
    $('#weeklyBadge').textContent = `${weeklyPct}% цели`;
    const achievements = buildAchievements(sessions, prepRuns, entries).slice(0, 3).join(' · ');
    $('#gameInsight').textContent = `${achievements}. Подготовок сохранено: ${prepRuns.length}. Полный отчёт можно выгрузить ниже.`;
  }

  function buildExportText() {
    const sessions = getSessions();
    const prepRuns = getPrepRuns();
    const entries = getEarnings();
    const goal = getEarningGoal();
    const now = new Date();
    const startWeek = weekStart(now);
    const weeklySessions = sessions.filter((s) => new Date(s.start) >= startWeek);
    const totalMs = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const weeklyMs = weeklySessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const earnings = earningsSummary(entries);
    const achievements = buildAchievements(sessions, prepRuns, entries);
    const lastPrep = prepRuns[0];
    const prepLines = lastPrep?.choices ? Object.entries(lastPrep.choices).map(([key, value]) => `- ${key}: ${value}`) : ['- Подготовка ещё не сохранена'];
    const goalLine = goal?.amount ? `${goal.name}: ${money(earnings.total)} из ${money(goal.amount)} (${Math.min(100, Math.round((earnings.total / goal.amount) * 100))}%)` : 'Цель накопления не задана';
    return [
      `Люмос — полный отчёт`,
      `Дата выгрузки: ${now.toLocaleString()}`,
      '',
      'Работа:',
      `- Всего эфиров: ${sessions.length}`,
      `- Всего часов: ${hours(totalMs)} ч`,
      `- На этой неделе: ${hours(weeklyMs)} ч`,
      `- Последняя цель эфира: ${load(STORAGE_KEYS.sessionGoal, 'не выбрана')} мин`,
      '',
      'Заработок:',
      `- Сегодня: ${money(earnings.today)}`,
      `- Неделя: ${money(earnings.week)}`,
      `- Месяц: ${money(earnings.month)}`,
      `- Всего записано: ${money(earnings.total)}`,
      `- Цель: ${goalLine}`,
      '',
      'Подготовка:',
      `- Сохранённых подготовок: ${prepRuns.length}`,
      `- Последняя подготовка: ${lastPrep ? `${lastPrep.completed}/${lastPrep.total} шагов · ${new Date(lastPrep.date).toLocaleString()}` : 'нет'}`,
      ...prepLines,
      '',
      'Достижения:',
      ...achievements.map((item) => `- ${item}`),
      '',
      'Последние эфиры:',
      ...(sessions.length ? sessions.slice(0, 10).map((s) => `- ${new Date(s.start).toLocaleString()} · ${formatDuration(s.duration)}${s.goalMinutes ? ` · цель ${s.goalMinutes} мин` : ''}`) : ['- Нет эфиров']),
      '',
      'Последние записи заработка:',
      ...(entries.length ? entries.slice(0, 10).map((entry) => `- ${new Date(entry.date).toLocaleDateString()} · ${money(entry.amount)} · ${entry.note || 'без заметки'}`) : ['- Нет записей'])
    ].join('\n');
  }

  async function exportStats() {
    const text = buildExportText();
    await copyText(text);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `lumos-report-${dateKey()}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
    toast('Отчёт скопирован и скачан');
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
    renderEarnings();
    renderGameInsight(sessions, getPrepRuns(), getEarnings(), weeklyMs);
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
    $('#completeQuestStep').addEventListener('click', completeQuestStep);
    $('#undoQuestStep').addEventListener('click', undoQuestStep);
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
    $('#translateButton').addEventListener('click', translate);
    $('#copyTranslation').addEventListener('click', () => copyText($('#translateOutput').textContent));
    $('#clearHistory').addEventListener('click', () => { save(STORAGE_KEYS.sessions, []); updateAllStats(); toast('История очищена'); });
    $('#exportStats').addEventListener('click', exportStats);
    $('#saveEarning').addEventListener('click', saveEarningEntry);
    $('#saveEarningGoal').addEventListener('click', saveEarningGoal);
    $('#clearEarnings').addEventListener('click', () => { save(STORAGE_KEYS.earnings, []); renderEarnings(); updateAllStats(); toast('Заработок очищен'); });
    $('#earningDate').value = dateKey();
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
    $$('.more-card').forEach((card) => card.addEventListener('click', () => showScreen(card.dataset.openScreen)));
    $$('.back-button').forEach((button) => button.addEventListener('click', () => showScreen(button.dataset.backTo || 'more')));
    $('#app').addEventListener('touchstart', (event) => {
      if (event.target.closest('textarea, input, select, button, #startQuest')) return;
      const touch = event.changedTouches[0];
      state.touchStartX = touch.clientX;
      state.touchStartY = touch.clientY;
    }, { passive: true });
    $('#app').addEventListener('touchend', (event) => {
      if (event.target.closest('textarea, input, select, button, #startQuest')) return;
      const touch = event.changedTouches[0];
      const dx = touch.clientX - state.touchStartX;
      const dy = touch.clientY - state.touchStartY;
      if (Math.abs(dx) < 72 || Math.abs(dx) < Math.abs(dy) * 1.35 || state.currentScreen === 'start') return;
      const screens = ['home', 'phrases', 'translate', 'stats', 'more'];
      const current = screens.includes(state.currentScreen) ? state.currentScreen : 'more';
      const nextIndex = Math.min(screens.length - 1, Math.max(0, screens.indexOf(current) + (dx < 0 ? 1 : -1)));
      showScreen(screens[nextIndex]);
    }, { passive: true });
    $$('.translate-controls .chip').forEach((button) => button.addEventListener('click', () => {
      state.langPair = button.dataset.pair;
      $$('.translate-controls .chip').forEach((chip) => chip.classList.toggle('active', chip === button));
    }));
  }

  function boot() {
    bindEvents();
    updateStartProgress();
    renderPhrases();
    renderQuestStep();
    renderLaunchPlanPreview();
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
