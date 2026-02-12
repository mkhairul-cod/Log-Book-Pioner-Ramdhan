const STORAGE_KEY = 'ramadhan_app_data_v1';

const defaultState = {
  family: null,
  users: [],
  logs: [],
  currentUserId: null
};

let state = loadState();

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : structuredClone(defaultState);
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function uid() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
}

function hashPwd(pwd) {
  return btoa(unescape(encodeURIComponent(pwd)));
}

function getCurrentUser() {
  return state.users.find(u => u.id === state.currentUserId) || null;
}

function requireAdmin() {
  const user = getCurrentUser();
  return user && (user.role === 'ayah' || user.role === 'ibu');
}

function calcDailyPoint(log) {
  const shalat = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'].filter(k => log[k]).length;
  return shalat + (log.tarawih ? 1 : 0) + (log.puasa ? 5 : 0) + (Number(log.tadarus || 0) * 0.1);
}

function formatNum(n) {
  return Number(n).toFixed(1);
}

function weekKey(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  const first = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - first) / (24 * 60 * 60 * 1000));
  const week = Math.ceil((days + first.getDay() + 1) / 7);
  return { week, year: date.getFullYear() };
}

function qs(id) { return document.getElementById(id); }
function notify(msg) { alert(msg); }

function renderAuthVsApp() {
  const logged = !!getCurrentUser();
  qs('authView').classList.toggle('hidden', logged);
  qs('appView').classList.toggle('hidden', !logged);

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.disabled = !logged;
  });

  qs('familyNameHeader').textContent = state.family?.name || 'Belum ada keluarga aktif';

  const user = getCurrentUser();
  qs('profileInfo').textContent = user ? `${user.name} (${user.role})` : 'Guest';

  if (logged) {
    renderAll();
  }
}

function renderMembers() {
  const tbody = qs('membersTable');
  tbody.innerHTML = '';
  state.users.forEach(user => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${user.name}</td><td>${user.role}</td><td>${user.email}</td>`;
    tbody.appendChild(tr);
  });
}

function renderSummary() {
  const cards = qs('summaryCards');
  const currentUser = getCurrentUser();
  const users = state.users;
  const logsToday = state.logs.filter(l => l.date === new Date().toISOString().slice(0, 10));

  const totalToday = logsToday.reduce((s, l) => s + calcDailyPoint(l), 0);
  const myLogs = state.logs.filter(l => l.userId === currentUser.id);
  const myTotal = myLogs.reduce((s, l) => s + calcDailyPoint(l), 0);

  const stats = [
    ['Jumlah Anggota', users.length],
    ['Log Hari Ini', logsToday.length],
    ['Skor Hari Ini', formatNum(totalToday)],
    ['Skor Saya', formatNum(myTotal)]
  ];

  cards.innerHTML = stats.map(([k, v]) => `<div class="stat"><strong>${k}</strong><div>${v}</div></div>`).join('');
}

function renderTargetUser() {
  const select = qs('targetUser');
  const me = getCurrentUser();
  const allowedUsers = requireAdmin() ? state.users : [me];
  select.innerHTML = allowedUsers.map(u => `<option value="${u.id}">${u.name} (${u.role})</option>`).join('');
}

function renderDaily() {
  const tbody = qs('dailyTable');
  const me = getCurrentUser();
  const allowed = requireAdmin() ? state.logs : state.logs.filter(l => l.userId === me.id);
  tbody.innerHTML = '';

  allowed.sort((a, b) => b.date.localeCompare(a.date)).forEach(log => {
    const user = state.users.find(u => u.id === log.userId);
    const shalat = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'].filter(k => log[k]).length;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${log.date}</td>
      <td>${user?.name || '-'}</td>
      <td>${shalat}</td>
      <td>${log.tarawih ? 'Ya' : 'Tidak'}</td>
      <td>${Number(log.tadarus || 0)}</td>
      <td>${log.puasa ? 'Ya' : 'Tidak'}</td>
      <td>${formatNum(calcDailyPoint(log))}</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderWeekly() {
  const tbody = qs('weeklyTable');
  const me = getCurrentUser();
  const allowed = requireAdmin() ? state.logs : state.logs.filter(l => l.userId === me.id);
  const map = new Map();

  allowed.forEach(log => {
    const keyObj = weekKey(log.date);
    const key = `${keyObj.week}-${keyObj.year}`;
    map.set(key, (map.get(key) || 0) + calcDailyPoint(log));
  });

  tbody.innerHTML = '';
  [...map.entries()].sort((a, b) => b[0].localeCompare(a[0])).forEach(([key, total]) => {
    const [week, year] = key.split('-');
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${week}</td><td>${year}</td><td>${formatNum(total)}</td>`;
    tbody.appendChild(tr);
  });
}

function renderAdminVisibility() {
  qs('adminMemberCard').classList.toggle('hidden', !requireAdmin());
}

function renderAll() {
  renderSummary();
  renderMembers();
  renderTargetUser();
  renderDaily();
  renderWeekly();
  renderAdminVisibility();
}

function bindNavigation() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-btn').forEach(x => x.classList.remove('active'));
      btn.classList.add('active');

      const target = btn.dataset.view;
      ['dashboard', 'log', 'daily', 'weekly'].forEach(view => {
        qs(`${view}View`).classList.toggle('hidden', view !== target);
      });
    });
  });
}

function setupForms() {
  qs('createFamilyForm').addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(e.target);

    if (state.family) return notify('Keluarga sudah ada. Silakan login.');

    const family = { id: uid(), name: fd.get('familyName').trim() };
    const user = {
      id: uid(),
      familyId: family.id,
      name: fd.get('name').trim(),
      email: fd.get('email').trim().toLowerCase(),
      passwordHash: hashPwd(fd.get('password')),
      role: 'ayah'
    };

    state.family = family;
    state.users.push(user);
    state.currentUserId = user.id;
    saveState();
    e.target.reset();
    renderAuthVsApp();
  });

  qs('loginForm').addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const email = fd.get('email').trim().toLowerCase();
    const pwd = hashPwd(fd.get('password'));

    const user = state.users.find(u => u.email === email && u.passwordHash === pwd);
    if (!user) return notify('Login gagal. Cek email/password.');

    state.currentUserId = user.id;
    saveState();
    e.target.reset();
    renderAuthVsApp();
  });

  qs('addMemberForm').addEventListener('submit', e => {
    e.preventDefault();
    if (!requireAdmin()) return notify('Hanya admin yang boleh menambah anggota.');

    const fd = new FormData(e.target);
    const email = fd.get('email').trim().toLowerCase();
    if (state.users.some(u => u.email === email)) return notify('Email sudah digunakan.');

    state.users.push({
      id: uid(),
      familyId: state.family.id,
      name: fd.get('name').trim(),
      email,
      passwordHash: hashPwd(fd.get('password')),
      role: fd.get('role')
    });

    saveState();
    e.target.reset();
    renderAll();
  });

  qs('worshipForm').addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const me = getCurrentUser();
    const targetUserId = fd.get('userId');

    if (!requireAdmin() && targetUserId !== me.id) {
      return notify('Anak hanya boleh input datanya sendiri.');
    }

    const date = fd.get('date');
    if (!date) return notify('Tanggal wajib diisi.');

    const existing = state.logs.find(l => l.userId === targetUserId && l.date === date);
    if (existing) return notify('Data tanggal ini sudah ada untuk user tersebut (anti duplikat).');

    const tadarus = Number(fd.get('tadarus') || 0);
    if (tadarus < 0) return notify('Tadarus tidak boleh negatif.');

    state.logs.push({
      id: uid(),
      userId: targetUserId,
      date,
      subuh: fd.get('subuh') === 'on',
      dzuhur: fd.get('dzuhur') === 'on',
      ashar: fd.get('ashar') === 'on',
      maghrib: fd.get('maghrib') === 'on',
      isya: fd.get('isya') === 'on',
      tarawih: fd.get('tarawih') === 'on',
      puasa: fd.get('puasa') === 'on',
      tadarus,
      notes: (fd.get('notes') || '').toString().slice(0, 200)
    });

    saveState();
    renderAll();
    notify('Log berhasil disimpan.');
  });

  qs('logoutBtn').addEventListener('click', () => {
    state.currentUserId = null;
    saveState();
    renderAuthVsApp();
  });

  qs('resetBtn').addEventListener('click', () => {
    if (!confirm('Yakin reset semua data aplikasi ini?')) return;
    state = structuredClone(defaultState);
    saveState();
    renderAuthVsApp();
  });
}

function init() {
  qs('year').textContent = new Date().getFullYear();
  const dateInput = document.querySelector('#worshipForm input[name="date"]');
  dateInput.value = new Date().toISOString().slice(0, 10);

  bindNavigation();
  setupForms();
  renderAuthVsApp();
}

init();
