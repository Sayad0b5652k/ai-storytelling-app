const STORAGE_KEY = 'story-atlas-library-v1';
const PROGRESS_KEY = 'story-atlas-progress-v1';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[char]));
const loadJson = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; } };
function loadLibrary() { return loadJson(STORAGE_KEY, []); }
function saveJson(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function showToast(message) { const toast = $('#toast'); toast.textContent = message; toast.classList.add('is-visible'); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove('is-visible'), 2800); }

const state = {
  source: 'topic',
  mode: 'hybrid',
  readerMode: 'novel',
  story: null,
  episodeIndex: 0,
  textScale: 1,
  zoom: 1,
  saved: loadLibrary(),
  progress: loadJson(PROGRESS_KEY, {})
};

function setView(viewName) {
  const views = { setup: $('#setup-view'), story: $('#story-view'), library: $('#library-view') };
  Object.entries(views).forEach(([name, view]) => { const active = name === viewName; view.hidden = !active; view.classList.toggle('is-visible', active); });
  $$('.route-item').forEach((item) => item.classList.toggle('is-active', item.dataset.step === viewName));
  $('#crumb-label').textContent = viewName === 'setup' ? 'NEW JOURNEY' : viewName === 'story' ? 'READING ROOM' : 'YOUR LIBRARY';
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (viewName === 'library') renderLibrary();
}

function updateSource(source) {
  state.source = source;
  $$('.source-tab').forEach((tab) => { const active = tab.dataset.source === source; tab.classList.toggle('is-active', active); tab.setAttribute('aria-selected', String(active)); });
  $('#topic-panel').hidden = source !== 'topic';
  $('#material-panel').hidden = source !== 'material';
  $('#topic-panel').classList.toggle('is-active', source === 'topic');
  $('#material-panel').classList.toggle('is-active', source === 'material');
}

function getInput() {
  const start = $('#range-start').value;
  const end = $('#range-end').value;
  return {
    topic: $('#topic-input').value.trim() || 'Mughal Empire',
    language: $('#language-select').value,
    level: $('#level-select').value,
    length: $('#length-select').value,
    mode: state.mode,
    materialMode: state.source,
    sourceRange: state.source === 'material' ? `pp. ${start}–${end}` : 'Topic research'
  };
}

async function generateStory() {
  const button = $('#generate-button');
  const input = getInput();
  button.disabled = true;
  button.querySelector('span').textContent = 'Building the route…';
  try {
    const response = await fetch('/api/generate-story', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(input) });
    if (!response.ok) throw new Error('Story route unavailable');
    const payload = await response.json();
    state.story = payload.story;
    state.episodeIndex = 0;
    state.readerMode = 'novel';
    $('#story-title').textContent = state.story.title;
    $('#story-subtitle').textContent = `A ${state.story.level.toLowerCase()} ${state.story.language} story with verified facts and clearly labelled dramatic framing.`;
    $('#source-ribbon-text').textContent = `Source range · ${state.story.sourceRange || 'topic research'}`;
    renderStory();
    setView('story');
    showToast(payload.provider === 'manus' ? 'Story built with the learning assistant.' : 'Story built from the offline sample route.');
  } catch (error) {
    showToast('The route could not be built. Try again in a moment.');
  } finally {
    button.disabled = false;
    button.querySelector('span').textContent = 'Build my story';
  }
}

function renderEpisodeTabs() {
  $('#episode-tabs').innerHTML = state.story.episodes.map((episode, index) => `<button class="episode-tab ${index === state.episodeIndex ? 'is-active' : ''}" data-episode="${index}"><span>EPISODE ${String(episode.number).padStart(2, '0')}</span><b>${escapeHtml(episode.title)}</b></button>`).join('');
  $$('.episode-tab').forEach((tab) => tab.addEventListener('click', () => { state.episodeIndex = Number(tab.dataset.episode); renderStory(); }));
}

function sceneNovel(scene, index) {
  const dialogue = (scene.dialogue || []).map((line) => `<p class="dialogue-line"><b>${escapeHtml(line.speaker)}</b>${escapeHtml(line.text)}</p>`).join('');
  return `<article class="scene-card"><div class="scene-side"><span class="scene-index">${String(index + 1).padStart(2, '0')}</span><small>SCENE</small></div><div><div class="scene-label">${escapeHtml(scene.type || 'NARRATION').toUpperCase()} · ${escapeHtml(scene.background || 'REUSABLE ASSET')}</div><h3>${escapeHtml(scene.title)}</h3><p class="scene-narration" style="font-size:${state.textScale}em">${escapeHtml(scene.narration)}</p>${dialogue ? `<div class="dialogue-stack">${dialogue}</div>` : ''}<span class="interpretation-note">◌ ${escapeHtml(scene.interpretation || 'Narrative framing for learning.')}</span><div class="scene-source">SOURCE NOTE · ${escapeHtml(scene.source || state.story.sourceRange || 'Selected material')}</div></div></article>`;
}

function sceneComic(scene, index) {
  const bubble = scene.dialogue?.[0]?.text || scene.narration;
  return `<article class="comic-card"><div class="comic-art"><div class="asset-ruler"></div><div class="asset-character"></div></div><div class="speech-bubble">${escapeHtml(bubble)}</div><div class="comic-caption"><div class="scene-label">SCENE ${String(index + 1).padStart(2, '0')} · ${escapeHtml(scene.background || 'ASSET')}</div><h3>${escapeHtml(scene.title)}</h3><p>${escapeHtml(scene.narration)}</p></div></article>`;
}

function renderStory() {
  if (!state.story) return;
  const episode = state.story.episodes[state.episodeIndex];
  $('#story-subtitle').textContent = state.story.fallbackNotice || `A ${state.story.level.toLowerCase()} ${state.story.language} story with verified facts and clearly labelled dramatic framing.`;
  renderEpisodeTabs();
  $$('.reader-mode').forEach((button) => button.classList.toggle('is-selected', button.dataset.readerMode === state.readerMode));
  $('#reader-content').className = state.readerMode === 'comic' ? 'reader-content comic-grid' : 'reader-content';
  $('#reader-content').innerHTML = state.readerMode === 'comic' ? episode.scenes.map(sceneComic).join('') : episode.scenes.map(sceneNovel).join('');
  $('#quiz-panel').innerHTML = quizMarkup(episode);
  $$('.quiz-answer').forEach((button) => button.addEventListener('click', answerQuiz));
  const progress = state.progress[state.story.id];
  if (progress?.episode === state.episodeIndex) showToast(`Resumed at Episode ${state.episodeIndex + 1}.`);
  saveJson(PROGRESS_KEY, { ...state.progress, [state.story.id]: { episode: state.episodeIndex, updatedAt: new Date().toISOString() } });
}

function quizMarkup(episode) {
  const facts = episode.facts?.length ? `<div class="facts-panel"><div class="quiz-kicker">FACTS TO KEEP</div><div class="facts-list">${episode.facts.map((fact) => `<span>✓ ${escapeHtml(fact)}</span>`).join('')}</div></div>` : '';
  const quiz = episode.quiz?.length ? `<div class="quiz-kicker">END-OF-EPISODE CHECK</div><h3>What stayed with you?</h3><p class="field-help">No grades here—just a quick way to make the story stick.</p>${episode.quiz.map((question, qIndex) => `<div class="quiz-question" data-question="${qIndex}"><p>${qIndex + 1}. ${escapeHtml(question.question)}</p><div class="quiz-options">${question.options.map((option, optionIndex) => `<button class="quiz-answer" data-q="${qIndex}" data-a="${optionIndex}">${escapeHtml(option)}</button>`).join('')}</div><p class="quiz-feedback" hidden></p></div>`).join('')}` : '';
  if (!facts && !quiz) return '';
  return `${facts}${quiz}`;
}

function answerQuiz(event) {
  const button = event.currentTarget;
  const question = state.story.episodes[state.episodeIndex].quiz[Number(button.dataset.q)];
  const container = button.closest('.quiz-question');
  const feedback = $('.quiz-feedback', container);
  $$('.quiz-answer', container).forEach((answer) => { answer.disabled = true; if (Number(answer.dataset.a) === question.answer) answer.classList.add('correct'); });
  if (Number(button.dataset.a) !== question.answer) button.classList.add('wrong');
  feedback.hidden = false;
  feedback.textContent = Number(button.dataset.a) === question.answer ? `Correct. ${question.explanation}` : `Not quite. ${question.explanation}`;
}

function saveStory() {
  if (!state.story) return;
  const existing = state.saved.filter((story) => story.id !== state.story.id);
  state.story.savedAt = new Date().toISOString();
  state.saved = [state.story, ...existing];
  saveJson(STORAGE_KEY, state.saved);
  $('#save-icon').textContent = '✓';
  $('#save-label').textContent = 'Saved locally';
  showToast('Saved to your private reading room.');
}

function renderLibrary() {
  const grid = $('#library-grid');
  if (!state.saved.length) { grid.innerHTML = '<div class="library-empty"><strong>No saved journeys yet.</strong><br />Build a story and save it here for offline reading.</div>'; return; }
  grid.innerHTML = state.saved.map((story, index) => `<button class="library-card" data-story-id="${escapeHtml(story.id)}"><div class="card-top"><span class="card-num">${String(index + 1).padStart(2, '0')} · SAVED</span><span>↗</span></div><div><h3>${escapeHtml(story.title)}</h3><p>${escapeHtml(story.topic)} · ${escapeHtml(story.sourceRange || 'topic route')}</p></div><span class="card-foot">${story.episodes.length} episodes · ${escapeHtml(story.language || 'English')}</span></button>`).join('');
  $$('.library-card').forEach((card) => card.addEventListener('click', () => { state.story = state.saved.find((story) => story.id === card.dataset.storyId); state.episodeIndex = state.progress[state.story.id]?.episode || 0; $('#story-title').textContent = state.story.title; $('#story-subtitle').textContent = `A ${state.story.level.toLowerCase()} ${state.story.language} story with verified facts and clearly labelled dramatic framing.`; $('#source-ribbon-text').textContent = `Source range · ${state.story.sourceRange || 'topic research'}`; renderStory(); setView('story'); }));
}

function bindEvents() {
  $$('.source-tab').forEach((tab) => tab.addEventListener('click', () => updateSource(tab.dataset.source)));
  $$('[data-topic]').forEach((button) => button.addEventListener('click', () => { $('#topic-input').value = button.dataset.topic; updateSource('topic'); $('#topic-input').focus(); }));
  $$('.mode-option').forEach((button) => button.addEventListener('click', () => { state.mode = button.dataset.mode; $$('.mode-option').forEach((option) => option.classList.toggle('is-selected', option === button)); }));
  $$('.route-item').forEach((button) => button.addEventListener('click', () => setView(button.dataset.step)));
  $$('[data-action="setup"]').forEach((button) => button.addEventListener('click', () => setView('setup')));
  $$('[data-action="home"]').forEach((button) => button.addEventListener('click', (event) => { event.preventDefault(); setView('setup'); }));
  $$('[data-action="library"]').forEach((button) => button.addEventListener('click', () => setView('library')));
  $$('[data-action="save"]').forEach((button) => button.addEventListener('click', saveStory));
  $('#generate-button').addEventListener('click', generateStory);
  $('#topic-input').addEventListener('keydown', (event) => { if (event.key === 'Enter') generateStory(); });
  $('#material-file').addEventListener('change', (event) => { const file = event.target.files[0]; if (file) { $('#pdf-name').textContent = file.name; showToast(`${file.name} is ready for local range selection.`); } });
  $('#range-start').addEventListener('change', updateRangeLabel); $('#range-end').addEventListener('change', updateRangeLabel);
  $$('.pdf-page').forEach((page) => page.addEventListener('click', () => { $$('.pdf-page').forEach((item) => item.classList.remove('is-selected')); page.classList.add('is-selected'); $('#range-start').value = page.textContent.trim(); updateRangeLabel(); showToast(`Preview focused on page ${page.textContent.trim()}.`); }));
  $$('[data-pdf-zoom]').forEach((button) => button.addEventListener('click', () => { state.zoom = Math.min(1.3, Math.max(.8, state.zoom + (button.dataset.pdfZoom === 'in' ? .1 : -.1))); $('#zoom-label').textContent = `${Math.round(state.zoom * 100)}%`; $('#pdf-sheet').style.transform = `scale(${state.zoom})`; }));
  $$('.reader-mode').forEach((button) => button.addEventListener('click', () => { state.readerMode = button.dataset.readerMode; renderStory(); }));
  $('[data-action="text-larger"]').addEventListener('click', () => { state.textScale = Math.min(1.22, state.textScale + .06); renderStory(); });
  $('[data-action="text-smaller"]').addEventListener('click', () => { state.textScale = Math.max(.9, state.textScale - .06); renderStory(); });
  $('#source-details').addEventListener('click', () => showToast(`${state.story?.sourceLabel || 'Topic research'} · ${state.story?.sourceRange || 'no range selected'}. Facts and dramatic interpretation are kept distinct.`));
}
function updateRangeLabel() { $('#material-selection-label').textContent = `Pages ${$('#range-start').value}–${$('#range-end').value} ready`; }

bindEvents();
