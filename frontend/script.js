const API_BASE = "http://127.0.0.1:8000";
const SESSION_KEY = "lf_session_v1";

const STEPS = [
  { key: "name", type: "text", ask: () => "Hi! I'm **LearnForge**, your AI career coach. What should I call you?" },
  { key: "education", type: "text", ask: (p) => `Nice to meet you, ${p.name}. What are you currently studying?` },
  { key: "goal", type: "text", ask: () => "What's the dream path you're chasing? (e.g. Frontend Development, Cybersecurity, UI/UX Design...)" },
  { key: "skills", type: "text", ask: () => "What skills do you already have? List a few, comma-separated." },
  { key: "languages", type: "text", ask: () => "Which programming languages do you know?" },
  { key: "experience", type: "chips", options: ["Beginner", "Intermediate", "Advanced"], ask: () => "How would you rate your experience level?" },
  { key: "study_hours", type: "chips", options: ["1", "2", "3", "4", "6", "8"], ask: () => "How many hours a day can you realistically study?" },
  { key: "learning_style", type: "chips", options: ["Hands-on Projects", "Videos", "Books", "Documentation", "Mixed"], ask: () => "How do you like to learn best?" },
  { key: "timeline", type: "text", ask: () => "Last one — what's your target timeline for hitting this goal? (e.g. 6 Months)" },
];

const ICONS = {
  "skill assessment": "01",
  "learning roadmap": "02",
  "weekly study plan": "03",
  "recommended courses": "04",
  "hands-on projects": "05",
  "certifications": "06",
  "career tips": "07",
};

const state = {
  stepIndex: 0,
  profile: {},
  roadmapMarkdown: "",
  sections: [],
  completed: new Set(),
  chatHistory: [],
  mode: "onboarding", // onboarding | chatting | quiz
  quiz: null,
  xp: parseInt(localStorage.getItem("lf_xp") || "0", 10),
  awaitingFreeText: false,
};

const chatWindow = document.getElementById("chatWindow");
const composerForm = document.getElementById("composerForm");
const composerInput = document.getElementById("composerInput");
const quickActions = document.getElementById("quickActions");
const xpCountEl = document.getElementById("xpCount");
const streakCountEl = document.getElementById("streakCount");
const themeToggle = document.getElementById("themeToggle");
const devBtn = document.getElementById("devBtn");
const devOverlay = document.getElementById("devOverlay");
const devClose = document.getElementById("devClose");
const devWatermarkBtn = document.getElementById("devWatermarkBtn");
const progressStrip = document.getElementById("progressStrip");
const progressFill = document.getElementById("progressFill");
const progressPercentEl = document.getElementById("progressPercent");

init();

async function init() {
  applyTheme(localStorage.getItem("lf_theme") || "dark");
  updateStreak();
  xpCountEl.textContent = state.xp;
  await bootSequence();

  const saved = loadSession();
  if (saved && saved.roadmapMarkdown) {
    resumeSession(saved);
  } else {
    askStep();
  }
}

// ---------- boot sequence ----------

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function typeLine(el, text, speed) {
  return new Promise((resolve) => {
    let i = 0;
    const timer = setInterval(() => {
      el.textContent = text.slice(0, i + 1);
      i++;
      scrollToBottom();
      if (i >= text.length) {
        clearInterval(timer);
        resolve();
      }
    }, speed);
  });
}

async function bootSequence() {
  const wrap = document.createElement("div");
  wrap.className = "msg bot";
  wrap.innerHTML = `<div class="avatar">AI</div><div class="bubble boot-bubble"></div>`;
  chatWindow.appendChild(wrap);
  const bubble = wrap.querySelector(".boot-bubble");

  const lines = [
    "$ booting learnmate_ai.core",
    "$ authenticating with watsonx.ai (IBM Granite) ... ok",
    "$ loading agentic coach module: Forge ... ok",
    "$ session ready.",
  ];

  for (const line of lines) {
    const lineEl = document.createElement("div");
    lineEl.className = "boot-line";
    bubble.appendChild(lineEl);
    await typeLine(lineEl, line, 16);
    await sleep(120);
  }
  await sleep(250);
}

// ---------- messaging helpers ----------

function scrollToBottom() {
  chatWindow.scrollTo({ top: chatWindow.scrollHeight, behavior: "smooth" });
}

function addBotMessage(markdown) {
  const wrap = document.createElement("div");
  wrap.className = "msg bot";
  wrap.innerHTML = `<div class="avatar">AI</div><div class="bubble">${marked.parse(markdown)}</div>`;
  chatWindow.appendChild(wrap);
  scrollToBottom();
  return wrap;
}

function addUserMessage(text) {
  const wrap = document.createElement("div");
  wrap.className = "msg user";
  wrap.innerHTML = `<div class="bubble">${escapeHtml(text)}</div>`;
  chatWindow.appendChild(wrap);
  scrollToBottom();
}

function escapeHtml(str) {
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}

function escapeAttr(str) {
  return str.replace(/"/g, "&quot;");
}

let typingEl = null;
function showTyping() {
  typingEl = document.createElement("div");
  typingEl.className = "msg bot";
  typingEl.innerHTML = `<div class="avatar">AI</div><div class="bubble typing"><span></span><span></span><span></span></div>`;
  chatWindow.appendChild(typingEl);
  scrollToBottom();
}
function hideTyping() {
  if (typingEl) {
    typingEl.remove();
    typingEl = null;
  }
}

function addChipsMessage(options, onPick) {
  const wrap = document.createElement("div");
  wrap.className = "msg bot chips-msg";
  const chipHtml = options
    .map((o) => `<button type="button" class="reply-chip">${escapeHtml(o)}</button>`)
    .join("");
  wrap.innerHTML = `<div class="avatar"></div><div class="chip-row">${chipHtml}</div>`;
  wrap.querySelectorAll(".reply-chip").forEach((btn, i) => {
    btn.addEventListener("click", () => {
      wrap.querySelectorAll(".reply-chip").forEach((b) => (b.disabled = true));
      btn.classList.add("picked");
      onPick(options[i]);
    });
  });
  chatWindow.appendChild(wrap);
  scrollToBottom();
}

// ---------- onboarding flow ----------

function askStep() {
  const step = STEPS[state.stepIndex];
  if (!step) {
    finishOnboarding();
    return;
  }
  addBotMessage(step.ask(state.profile));
  if (step.type === "chips") {
    state.awaitingFreeText = false;
    composerInput.disabled = true;
    composerInput.placeholder = "Tap an option above";
    addChipsMessage(step.options, (val) => handleAnswer(val));
  } else {
    state.awaitingFreeText = true;
    composerInput.disabled = false;
    composerInput.placeholder = "Type your answer...";
    composerInput.focus();
  }
}

function handleAnswer(value) {
  const step = STEPS[state.stepIndex];
  addUserMessage(value);
  state.profile[step.key] = value;
  addXP(5);
  state.stepIndex += 1;
  setTimeout(askStep, 350);
}

function finishOnboarding() {
  composerInput.disabled = true;
  composerInput.placeholder = "Hang tight...";
  generateRoadmap();
}

// ---------- roadmap generation ----------

async function generateRoadmap() {
  showTyping();
  try {
    const res = await fetch(`${API_BASE}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state.profile),
    });
    const data = await res.json();
    hideTyping();
    if (data.success) {
      state.roadmapMarkdown = data.response;
      addBotMessage(`Here's your custom roadmap, **${state.profile.name}**.`);
      renderQuestPath(data.response);
      saveSession();
      addXP(25);
      burstConfetti();
      state.mode = "chatting";
      enableFreeChat();
      quickActions.classList.remove("hidden");
    } else {
      addBotMessage(`Something went wrong generating your roadmap:\n\n\`${data.error || "Unknown error"}\``);
    }
  } catch (err) {
    hideTyping();
    addBotMessage(`Couldn't reach the backend. Make sure the FastAPI server is running.\n\n\`${err}\``);
  }
}

function resumeSession(saved) {
  state.profile = saved.profile || {};
  state.roadmapMarkdown = saved.roadmapMarkdown || "";
  state.completed = new Set(saved.completed || []);
  state.chatHistory = saved.chatHistory || [];
  state.mode = "chatting";

  addBotMessage(`Welcome back, **${state.profile.name || "there"}** — picking up right where you left off.`);
  renderQuestPath(state.roadmapMarkdown);
  enableFreeChat();
  quickActions.classList.remove("hidden");
}

function splitSections(markdown) {
  const lines = markdown.split("\n");
  const sections = [];
  let current = null;
  for (const line of lines) {
    const m = line.match(/^#{1,3}\s*(\d+[.)]?\s*.+)$/);
    if (m) {
      if (current) sections.push(current);
      current = { title: m[1].replace(/^\d+[.)]\s*/, "").trim(), body: "" };
    } else if (current) {
      current.body += line + "\n";
    }
  }
  if (current) sections.push(current);
  return sections;
}

function iconFor(title, index) {
  const key = title.toLowerCase();
  for (const k in ICONS) {
    if (key.includes(k)) return ICONS[k];
  }
  return String(index + 1).padStart(2, "0");
}

function renderQuestPath(markdown) {
  const sections = splitSections(markdown);
  state.sections = sections;
  const path = document.createElement("div");
  path.className = "quest-path";
  if (sections.length === 0) {
    path.innerHTML = `<div class="quest-node"><div class="quest-content"><div class="quest-body">${marked.parse(markdown)}</div></div></div>`;
  } else {
    sections.forEach((s, i) => {
      const isDone = state.completed.has(s.title);
      const node = document.createElement("div");
      node.className = "quest-node" + (isDone ? " completed" : "");
      node.style.animationDelay = `${i * 0.12}s`;
      node.innerHTML = `
        <div class="quest-marker"><span class="quest-num">${i + 1}</span></div>
        <div class="quest-content">
          <button type="button" class="quest-check" data-title="${escapeAttr(s.title)}" title="Mark complete">✓</button>
          <div class="quest-title">[${iconFor(s.title, i)}] ${escapeHtml(s.title)}</div>
          <div class="quest-body">${marked.parse(s.body)}</div>
        </div>`;
      path.appendChild(node);
    });
  }
  chatWindow.appendChild(path);
  scrollToBottom();

  path.querySelectorAll(".quest-check").forEach((btn) => {
    btn.addEventListener("click", () => toggleComplete(btn.dataset.title, btn.closest(".quest-node")));
  });

  updateProgressUI();
}

function toggleComplete(title, nodeEl) {
  if (state.completed.has(title)) {
    state.completed.delete(title);
    nodeEl.classList.remove("completed");
  } else {
    state.completed.add(title);
    nodeEl.classList.add("completed");
    addXP(6);
  }
  updateProgressUI();
  saveSession();
}

function updateProgressUI() {
  const total = state.sections.length;
  if (!total) return;
  const pct = Math.round((state.completed.size / total) * 100);
  progressStrip.classList.remove("hidden");
  progressFill.style.width = pct + "%";
  progressPercentEl.textContent = pct;
}

// ---------- session persistence ----------

function saveSession() {
  const payload = {
    profile: state.profile,
    roadmapMarkdown: state.roadmapMarkdown,
    completed: [...state.completed],
    chatHistory: state.chatHistory,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(payload));
}

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

// ---------- free chat with mentor ----------

function enableFreeChat() {
  composerInput.disabled = false;
  composerInput.placeholder = "Ask Forge anything about your roadmap...";
}

composerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const value = composerInput.value.trim();
  if (!value) return;
  composerInput.value = "";

  if (state.mode === "onboarding" && state.awaitingFreeText) {
    handleAnswer(value);
    return;
  }

  if (state.mode === "quiz") return;

  addUserMessage(value);
  state.chatHistory.push({ role: "user", content: value });
  showTyping();
  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roadmap_context: state.roadmapMarkdown,
        history: state.chatHistory,
        message: value,
      }),
    });
    const data = await res.json();
    hideTyping();
    if (data.success) {
      addBotMessage(data.response);
      state.chatHistory.push({ role: "assistant", content: data.response });
      addXP(2);
      saveSession();
    } else {
      addBotMessage(`Ran into an error: \`${data.error || "unknown"}\``);
    }
  } catch (err) {
    hideTyping();
    addBotMessage(`Couldn't reach the backend. \`${err}\``);
  }
});

// ---------- quick actions ----------

quickActions.addEventListener("click", (e) => {
  const btn = e.target.closest(".chip-action");
  if (!btn) return;
  const action = btn.dataset.action;
  if (action === "skillgap") runSkillGap();
  if (action === "quiz") startQuiz();
  if (action === "export") exportRoadmap();
  if (action === "continue") runContinueLearning();
  if (action === "restart") restart();
});

async function runContinueLearning() {
  const total = state.sections.length || 1;
  const pct = Math.round((state.completed.size / total) * 100);
  addUserMessage("continue --learning");
  showTyping();
  try {
    const res = await fetch(`${API_BASE}/adapt-roadmap`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        goal: state.profile.goal,
        roadmap_context: state.roadmapMarkdown,
        completed_items: [...state.completed],
        progress_percent: pct,
        note: "",
      }),
    });
    const data = await res.json();
    hideTyping();
    if (data.success) {
      addBotMessage(data.response);
      addXP(12);
    } else {
      addBotMessage(`Couldn't generate your next step: \`${data.error}\``);
    }
  } catch (err) {
    hideTyping();
    addBotMessage(`Couldn't reach the backend. \`${err}\``);
  }
}

async function runSkillGap() {
  addUserMessage("skill --gap");
  showTyping();
  try {
    const res = await fetch(`${API_BASE}/skill-gap`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        goal: state.profile.goal,
        skills: state.profile.skills,
        languages: state.profile.languages,
      }),
    });
    const data = await res.json();
    hideTyping();
    if (data.success) {
      renderSkillGap(data.gaps);
      addXP(10);
    } else {
      addBotMessage(`Couldn't build your skill gap report: \`${data.error}\``);
    }
  } catch (err) {
    hideTyping();
    addBotMessage(`Couldn't reach the backend. \`${err}\``);
  }
}

function renderSkillGap(gaps) {
  const wrap = document.createElement("div");
  wrap.className = "msg bot";
  const rows = gaps
    .map(
      (g) => `
    <div class="gap-row">
      <div class="gap-label">
        <span>${escapeHtml(g.skill)}</span>
        <span class="gap-pct">${g.current}%</span>
      </div>
      <div class="bar-track">
        <div class="bar-fill" data-width="${g.current}"></div>
        <div class="bar-target" style="left:${g.target}%"></div>
      </div>
      <div class="gap-tip">→ ${escapeHtml(g.tip)}</div>
    </div>`
    )
    .join("");
  wrap.innerHTML = `<div class="avatar">AI</div><div class="bubble skillgap-card"><h4>skill_gap_report — ${escapeHtml(state.profile.goal)}</h4>${rows}</div>`;
  chatWindow.appendChild(wrap);
  scrollToBottom();
  requestAnimationFrame(() => {
    wrap.querySelectorAll(".bar-fill").forEach((el) => {
      el.style.width = el.dataset.width + "%";
    });
  });
}

async function startQuiz() {
  addUserMessage("quiz --start");
  showTyping();
  try {
    const res = await fetch(`${API_BASE}/quiz`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: state.profile.skills || state.profile.goal,
        goal: state.profile.goal,
        difficulty: state.profile.experience || "Beginner",
      }),
    });
    const data = await res.json();
    hideTyping();
    if (data.success) {
      state.quiz = { questions: data.questions, index: 0, score: 0 };
      state.mode = "quiz";
      addBotMessage(`Quick ${data.questions.length}-question quiz coming up.`);
      renderQuizQuestion();
    } else {
      addBotMessage(`Couldn't build your quiz: \`${data.error}\``);
    }
  } catch (err) {
    hideTyping();
    addBotMessage(`Couldn't reach the backend. \`${err}\``);
  }
}

function renderQuizQuestion() {
  const q = state.quiz.questions[state.quiz.index];
  const wrap = document.createElement("div");
  wrap.className = "msg bot";
  const optionsHtml = q.options
    .map((opt, i) => `<button type="button" class="quiz-option" data-i="${i}">${escapeHtml(opt)}</button>`)
    .join("");
  wrap.innerHTML = `
    <div class="avatar">AI</div>
    <div class="bubble quiz-card">
      <div class="quiz-progress">question ${state.quiz.index + 1} / ${state.quiz.questions.length}</div>
      <div class="quiz-question">${escapeHtml(q.question)}</div>
      <div class="quiz-options">${optionsHtml}</div>
    </div>`;
  chatWindow.appendChild(wrap);
  scrollToBottom();

  wrap.querySelectorAll(".quiz-option").forEach((btn) => {
    btn.addEventListener("click", () => {
      const i = parseInt(btn.dataset.i, 10);
      wrap.querySelectorAll(".quiz-option").forEach((b) => (b.disabled = true));
      if (i === q.correct_index) {
        btn.classList.add("correct");
        btn.insertAdjacentHTML("afterbegin", "✓ ");
        state.quiz.score += 1;
        addXP(8);
      } else {
        btn.classList.add("wrong");
        btn.insertAdjacentHTML("afterbegin", "✕ ");
        const correctBtn = wrap.querySelectorAll(".quiz-option")[q.correct_index];
        correctBtn.classList.add("correct");
        correctBtn.insertAdjacentHTML("afterbegin", "✓ ");
      }
      const explain = document.createElement("div");
      explain.className = "quiz-explain";
      explain.textContent = q.explanation || "";
      wrap.querySelector(".quiz-card").appendChild(explain);

      state.quiz.index += 1;
      setTimeout(() => {
        if (state.quiz.index < state.quiz.questions.length) {
          renderQuizQuestion();
        } else {
          finishQuiz();
        }
      }, 900);
    });
  });
}

function finishQuiz() {
  const { score, questions } = state.quiz;
  addBotMessage(`You scored **${score}/${questions.length}**. ${score === questions.length ? "Perfect run." : "Solid effort — keep grinding."}`);
  if (score === questions.length) burstConfetti();
  state.mode = "chatting";
  state.quiz = null;
}

function exportRoadmap() {
  if (!state.roadmapMarkdown) return;
  const blob = new Blob([state.roadmapMarkdown], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `LearnMate-Roadmap-${(state.profile.name || "student").replace(/\s+/g, "_")}.md`;
  a.click();
  URL.revokeObjectURL(url);
  addUserMessage("export --md");
  addBotMessage("Your roadmap just got downloaded as a Markdown file.");
}

function restart() {
  state.stepIndex = 0;
  state.profile = {};
  state.roadmapMarkdown = "";
  state.sections = [];
  state.completed = new Set();
  state.chatHistory = [];
  state.mode = "onboarding";
  state.quiz = null;
  clearSession();
  chatWindow.innerHTML = "";
  quickActions.classList.add("hidden");
  progressStrip.classList.add("hidden");
  askStep();
}

// ---------- gamification ----------

function addXP(amount) {
  state.xp += amount;
  localStorage.setItem("lf_xp", state.xp);
  xpCountEl.textContent = state.xp;
  const pill = xpCountEl.parentElement;
  pill.classList.remove("pulse");
  void pill.offsetWidth;
  pill.classList.add("pulse");
}

function updateStreak() {
  const today = new Date().toDateString();
  const last = localStorage.getItem("lf_last_visit");
  let streak = parseInt(localStorage.getItem("lf_streak") || "0", 10);
  if (last !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    streak = last === yesterday ? streak + 1 : 1;
    localStorage.setItem("lf_streak", streak);
    localStorage.setItem("lf_last_visit", today);
  }
  streakCountEl.textContent = streak;
}

function burstConfetti() {
  const layer = document.getElementById("confettiLayer");
  for (let i = 0; i < 60; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.animationDuration = 2 + Math.random() * 1.5 + "s";
    piece.style.animationDelay = Math.random() * 0.3 + "s";
    layer.appendChild(piece);
    setTimeout(() => piece.remove(), 3500);
  }
}

// ---------- theme ----------

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  applyTheme(current === "dark" ? "light" : "dark");
});

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("lf_theme", theme);
  themeToggle.classList.toggle("is-light", theme === "light");
  themeToggle.setAttribute("aria-pressed", theme === "light");
}

// ---------- developer card ----------

devBtn.addEventListener("click", () => devOverlay.classList.add("open"));
devWatermarkBtn.addEventListener("click", () => devOverlay.classList.add("open"));
devClose.addEventListener("click", () => devOverlay.classList.remove("open"));
devOverlay.addEventListener("click", (e) => {
  if (e.target === devOverlay) devOverlay.classList.remove("open");
});

document.querySelectorAll(".copy-link").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const value = btn.dataset.copy;
    try {
      await navigator.clipboard.writeText(value);
      showToast(`Copied ${value}`);
    } catch {
      showToast("Couldn't copy — copy it manually");
    }
  });
});

let toastTimer = null;
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}