const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const palette = ['#e6aab1', '#bad7ed', '#f2d18a', '#c8d9b6', '#d8c1e8', '#f2b7a6', '#b9e2dc', '#e3d29d'];
const taskOptions = ['Coaching', 'Meeting', 'On Class', 'Admin', 'Webinar', 'SMM'];
const todayDate = new Date();
const FALLBACK_PHP_USD = 0.0171;
const ADMIN_HASH = '1d15690cc56c1cd84a6bcbe25ffae7fae7b44136b61b6a5a69782ae25448ee21';
const adminAccount = { email: 'hr@sync2va.com', name: 'HR Admin', initials: 'HR', role: 'admin', hash: ADMIN_HASH };

const rosterRows = [
  ['Claudine Angelica Pia D. San Juan', 'Head Coach', 'Intensive Course Dept', 'Team coaching plan', 5, 1140, 1260, 'M1nute-A7Qp'],
  ['Kenizzite R. Novicio', 'Senior Coach', 'Intensive Course Dept', 'REVA coaching', 4.2, 1140, 1260, 'M1nute-R4Vz'],
  ['Janseen Jorolan', 'Junior Coach', 'Intensive Course Dept', 'REVA coaching', 3, 1140, 1260, 'M1nute-K9Ld'],
  ['Ma. Jesusa Resureccion C. Alicante', 'Senior Coach', 'Intensive Course Dept', 'MEDVA coaching', 4, 1140, 1260, 'M1nute-P6Wx'],
  ['Jody Macuto', 'Senior Coach', 'Intensive Course Dept', 'MEDVA coaching', 4, 1140, 1260, 'M1nute-D2Ns'],
  ['Honey Mae Casas', 'Coach', 'Intensive Course Dept', 'USBK coaching', 4.5, 1200, 1320, 'M1nute-H8Tb'],
  ['Emily A. Lima', 'Coach', 'Intensive Course Dept', 'USBK coaching', 4, 1200, 1320, 'M1nute-E5Cu'],
  ['Michael John Gil Matutina', 'Coach', 'Intensive Course Dept', 'AUBK coaching', 4, 1200, 1320, 'M1nute-M3Ja'],
  ['Minorka Samarista', 'Coach', 'Intensive Course Dept', 'AUBK coaching', 3, 1200, 1320, 'M1nute-S7Fo'],
  ['Karina A. Ang', 'Head Coach', 'Client Acquisition Department', 'Client acquisition plan', 5, 1140, 1260, 'M1nute-C4Ya'],
  ['Therese Dawn Bangayan', 'CA Coach', 'Client Acquisition Department', 'REVA outreach', 4, 1140, 1260, 'M1nute-T6Qi'],
  ['Krista Angela Ralloma', 'CA Coach', 'Client Acquisition Department', 'USBK outreach', 4, 1140, 1260, 'M1nute-B9Xp'],
  ['Maria Angelica Mendiola', 'CA Coach', 'Client Acquisition Department', 'MEDVA outreach', 4, 1140, 1260, 'M1nute-G2Re'],
  ['Nate Sumalde', 'CA Coach', 'Client Acquisition Department', 'AUBK outreach', 3, 1140, 1260, 'M1nute-N5Vk'],
  ['Clarissa Mae Concon', 'Admin Head', 'Admin Department', 'Operations review', 16000, 900, 1440, 'M1nute-Q8Lm'],
  ['Kristine Joy G. Patalita', 'Admin', 'Admin Department', 'Team administration', 14500, 900, 1440, 'M1nute-J3Zc'],
  ['Angie General', 'Admin', 'Admin Department', 'Team administration', 14000, 480, 1020, 'M1nute-A6Ud'],
  ['Justin Guda', 'Admin', 'Admin Department', 'Team administration', 12000, 480, 1020, 'M1nute-U4Bn'],
  ['Meabel Borreta', 'Admin', 'Admin Department', 'Team administration', 12000, 900, 1440, 'M1nute-L7Py'],
  ['Charles Kith Cañete', 'Webinar Admin', 'Admin Department', 'Webinar preparation', 'Commission Based', null, null, 'M1nute-W2Fs'],
  ['Noor Ainne Garcia', 'SMM Head', 'SMM Department', 'Content strategy', 20000, null, null, 'M1nute-X9Qr'],
  ['Joana Faye Carlos', 'SMM Assistant', 'SMM Department', 'Social media scheduling', 12000, null, null, 'M1nute-Z5Hd']
];

const employeeDirectory = rosterRows.map(([name, role, department, task, rate, scheduledStart, scheduledEnd, tempPassword], index) => ({
  id: `roster-${index + 1}`,
  name,
  email: emailFor(name),
  role,
  department,
  task,
  rate,
  scheduledStart,
  scheduledEnd,
  schedule: shiftLabel(scheduledStart, scheduledEnd),
  tempPassword,
  initials: initials(name),
  color: palette[index % palette.length],
  date: 'Today',
  status: 'complete'
}));

employeeDirectory.forEach((person, index) => {
  const isLive = index < 4;
  person.clockIn = person.scheduledStart === null ? '—' : toClock(person.scheduledStart + [-3, 3, 11, -11][index % 4]);
  person.clockOut = isLive ? '—' : person.scheduledEnd === null ? '—' : toClock(person.scheduledEnd + [22, 7, -4, 18][index % 4]);
  person.worked = isLive ? ['04h 32m', '04h 26m', '04h 18m', '04h 11m'][index % 4] : ['08h 33m', '08h 07m', '08h 14m', '08h 11m'][index % 4];
});

employeeDirectory.forEach(person => {
  person.clockIn = '—';
  person.clockOut = '—';
  person.worked = '0h 00m';
});

const philippineHolidays2026 = [
  { date: '2026-01-01', name: "New Year's Day", type: 'regular' },
  { date: '2026-04-02', name: 'Maundy Thursday', type: 'regular' },
  { date: '2026-04-03', name: 'Good Friday', type: 'regular' },
  { date: '2026-04-04', name: 'Black Saturday', type: 'special' },
  { date: '2026-04-09', name: 'Day of Valor', type: 'regular' },
  { date: '2026-05-01', name: 'Labor Day', type: 'regular' },
  { date: '2026-06-12', name: 'Independence Day', type: 'regular' },
  { date: '2026-08-21', name: 'Ninoy Aquino Day', type: 'special' },
  { date: '2026-08-31', name: "National Heroes' Day", type: 'regular' },
  { date: '2026-11-01', name: "All Saints' Day", type: 'special' },
  { date: '2026-11-30', name: 'Bonifacio Day', type: 'regular' },
  { date: '2026-12-08', name: 'Immaculate Conception', type: 'special' },
  { date: '2026-12-25', name: 'Christmas Day', type: 'regular' },
  { date: '2026-12-30', name: 'Rizal Day', type: 'regular' },
  { date: '2026-12-31', name: "New Year's Eve", type: 'special' }
];

let managedEmployees = JSON.parse(localStorage.getItem('minute-employees') || '[]');
let leaveRequests = JSON.parse(localStorage.getItem('minute-leave-requests') || '[]');
let timeEditRequests = JSON.parse(localStorage.getItem('minute-time-edit-requests') || '[]');
let coachingDocuments = JSON.parse(localStorage.getItem('minute-coaching-documents') || '[]');
let state = emptyTimeState();
let currentAccount = null;
let editingEmployeeId = null;
let interval;
let scheduleFilter = 'checked-in';
let selectedProject = 'All';
let calendarCursor = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);
let leaveCalendarCursor = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);
let phpUsdRate = Number(localStorage.getItem('minute-php-usd-rate')) || FALLBACK_PHP_USD;
let fxRateDate = localStorage.getItem('minute-php-usd-date') || 'offline reference';
const liveCalculatorOpenedAt = Date.now();
const LIVE_PRESENCE_KEY = 'sync2time-live-presence';

$('#todayLabel').textContent = todayDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase();

function emptyTimeState() {
  return { entries: [], clockIn: null, clockOut: null, running: null, lunch: null, lunchLog: [] };
}

function emailFor(name) {
  const cleaned = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\b(ma|d|r|c)\b\.?/gi, '').replace(/[^a-zA-Z\s]/g, ' ').trim().toLowerCase().split(/\s+/);
  return `${cleaned[0]}.${cleaned[cleaned.length - 1]}@sync2va.com`;
}

function initials(name) {
  return name.split(/\s+/).slice(0, 2).map(part => part[0] || '').join('').toUpperCase();
}

function slug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function toClock(minutes) {
  if (minutes === null) return '—';
  minutes = ((minutes % 1440) + 1440) % 1440;
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  return `${(hour % 12) || 12}:${String(minute).padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`;
}

function shiftLabel(start, end) {
  return start === null ? 'Flexible schedule' : `${toClock(start)}-${toClock(end)}`;
}

function pad(number) {
  return String(number).padStart(2, '0');
}

function formatDuration(seconds) {
  return `${Math.floor(seconds / 3600)}h ${pad(Math.floor(seconds % 3600 / 60))}m`;
}

function formatClock(date) {
  return new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function secondsBetween(a, b) {
  return Math.max(0, Math.round((new Date(b) - new Date(a)) / 1000));
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text ?? '';
  return div.innerHTML;
}

function showToast(text) {
  const toast = $('#toast');
  toast.textContent = text;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2600);
}

function persistEmployees() {
  localStorage.setItem('minute-employees', JSON.stringify(managedEmployees));
}

function persistLeaveRequests() {
  localStorage.setItem('minute-leave-requests', JSON.stringify(leaveRequests));
}

function persistTimeEditRequests() {
  localStorage.setItem('minute-time-edit-requests', JSON.stringify(timeEditRequests));
}

function persistDocuments() {
  localStorage.setItem('minute-coaching-documents', JSON.stringify(coachingDocuments));
}

function stateKey(account = currentAccount) {
  return `minute-state-${account?.email || 'guest'}`;
}

function loadStateForAccount(account) {
  state = JSON.parse(localStorage.getItem(stateKey(account)) || 'null') || emptyTimeState();
}

function save() {
  if (currentAccount?.role === 'employee') localStorage.setItem(stateKey(), JSON.stringify(state));
}

function readLivePresence() {
  const records = JSON.parse(localStorage.getItem(LIVE_PRESENCE_KEY) || '[]');
  const cutoff = Date.now() - 120000;
  const fresh = records.filter(record => record.status === 'working' && record.lastSeen >= cutoff);
  if (fresh.length !== records.length) localStorage.setItem(LIVE_PRESENCE_KEY, JSON.stringify(fresh));
  return fresh;
}

function writeLivePresence(record) {
  const records = readLivePresence().filter(item => item.email !== record.email);
  records.push(record);
  localStorage.setItem(LIVE_PRESENCE_KEY, JSON.stringify(records));
}

function removeLivePresence(email = currentAccount?.email) {
  if (!email) return;
  localStorage.setItem(LIVE_PRESENCE_KEY, JSON.stringify(readLivePresence().filter(record => record.email !== email)));
}

function syncOwnLivePresence() {
  if (currentAccount?.role !== 'employee') return;
  if (!state.running) return removeLivePresence(currentAccount.email);
  const person = rosterPersonFor(currentAccount) || {};
  writeLivePresence({
    email: currentAccount.email,
    name: currentAccount.name,
    role: person.role || currentAccount.jobRole || 'Employee',
    department: person.department || currentAccount.department || 'Employee',
    task: state.running.task,
    clockInAt: state.running.start,
    lastSeen: Date.now(),
    status: 'working'
  });
}

function liveEmployees() {
  return readLivePresence().map((record, index) => {
    const roster = employeeDirectory.find(person => person.email === record.email || person.name === record.name);
    const seconds = secondsBetween(record.clockInAt, Date.now());
    return {
      ...(roster || {}),
      name: record.name,
      email: record.email,
      role: record.role || roster?.role || 'Employee',
      department: record.department || roster?.department || 'Employee',
      task: record.task || 'Working',
      initials: roster?.initials || initials(record.name),
      color: roster?.color || palette[index % palette.length],
      rate: roster?.rate ?? null,
      scheduledStart: roster?.scheduledStart ?? null,
      scheduledEnd: roster?.scheduledEnd ?? null,
      schedule: roster?.schedule || 'Not assigned',
      clockIn: formatClock(record.clockInAt),
      clockOut: '—',
      worked: formatDuration(seconds),
      status: 'clocked',
      liveSeconds: seconds
    };
  });
}

function totalSeconds() {
  return state.entries.reduce((sum, entry) => sum + entry.seconds, 0) + (state.running ? secondsBetween(state.running.start, Date.now()) : 0);
}

function randomPassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
  const bytes = new Uint32Array(12);
  crypto.getRandomValues(bytes);
  return [...bytes].map(value => chars[value % chars.length]).join('');
}

async function hashPassword(password) {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
}

async function buildEmployeeAccess(person) {
  return {
    id: `emp-${slug(person.email)}`,
    rosterId: person.id,
    name: person.name,
    email: person.email,
    jobRole: person.role,
    department: person.department,
    initials: person.initials,
    tempPassword: person.tempPassword,
    hash: await hashPassword(person.tempPassword)
  };
}

async function seedRosterAccess(force = false) {
  let added = 0;
  for (const person of employeeDirectory) {
    const existing = managedEmployees.find(employee => employee.email === person.email || employee.name === person.name);
    if (existing && !force && existing.email === person.email && existing.tempPassword && existing.hash) continue;
    const access = await buildEmployeeAccess(person);
    if (existing) managedEmployees = managedEmployees.map(employee => employee.id === existing.id ? { ...existing, ...access, id: existing.id } : employee);
    else {
      managedEmployees.push(access);
      added++;
    }
  }
  persistEmployees();
  renderManagedEmployees();
  renderTeamDirectory();
  return added;
}

function rosterPersonFor(account) {
  return employeeDirectory.find(person => person.email === account?.email || person.name === account?.name);
}

function allRosterWithExtras() {
  const extras = managedEmployees.filter(employee => !employeeDirectory.some(person => person.email === employee.email)).map((employee, index) => ({
    name: employee.name,
    email: employee.email,
    role: employee.jobRole,
    department: employee.department || 'Added by admin',
    task: 'Not assigned',
    rate: null,
    scheduledStart: null,
    scheduledEnd: null,
    schedule: 'Not assigned',
    initials: employee.initials,
    color: palette[index % palette.length],
    clockIn: '—',
    clockOut: '—',
    worked: '0h 00m',
    status: 'complete'
  }));
  return [...employeeDirectory, ...extras];
}

function render() {
  const running = state.running;
  const runningSeconds = running ? secondsBetween(running.start, Date.now()) : 0;
  $('#timerValue').textContent = new Date(runningSeconds * 1000).toISOString().slice(11, 19);
  $('#statusLabel').textContent = running ? 'Clocked in' : 'Ready to work';
  $('#statusDot').classList.toggle('running', !!running);
  $('#timerHint').textContent = running ? `Clocked in at ${formatClock(running.start)} · keep going.` : 'Choose a task, then clock in.';
  $('#timerButtonText').textContent = running ? 'Clock out' : 'Clock in';
  $('#playIcon').textContent = running ? '■' : '▶';
  $('#toggleTimer').classList.toggle('running', !!running);
  $('#lunchButton').textContent = state.lunch ? 'End lunch' : 'Start lunch';
  $('#lunchButton').classList.toggle('running', !!state.lunch);

  const total = totalSeconds();
  $('#hoursTotal').textContent = formatDuration(total);
  $('#tableTotal').textContent = formatDuration(total);
  $('#clockInDisplay').textContent = state.clockIn ? formatClock(state.clockIn) : 'Not clocked in yet';
  $('#clockOutDisplay').textContent = state.clockOut ? formatClock(state.clockOut) : '—';
  $('#workdayTotal').textContent = state.clockIn ? new Date(total * 1000).toISOString().slice(11, 16) : '00:00';

  const entries = $('#entries');
  const all = [
    ...(running ? [{ task: running.task, seconds: runningSeconds, live: true }] : []),
    ...(state.lunch ? [{ task: 'Lunch break', seconds: secondsBetween(state.lunch.start, Date.now()), live: true, lunch: true }] : []),
    ...state.entries
  ];
  entries.innerHTML = all.map((entry, index) => `<div class="entry dashboard-clickable" tabindex="0" role="button" data-entry-index="${index}"><div class="entry-title"><span class="project-dot ${entry.lunch ? 'blue' : entry.live ? 'coral' : 'blue'}"></span><div>${escapeHtml(entry.task)}<small>${entry.live ? 'Currently active' : 'Tracked time'}</small></div></div><span class="entry-time">${formatDuration(entry.seconds)}</span><button class="delete-entry" title="Employee cannot edit time" hidden>×</button></div>`).join('');
  $('#emptyState').hidden = all.length > 0;

  const daily = [2.8, 4.1, Math.min(7.5, total / 3600), 3.4, 2.2, .3, 0];
  $('#bars').innerHTML = daily.map((value, index) => `<div class="bar ${index === 2 ? 'today' : ''}" data-day="${['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][index]}" style="height:${Math.max(4, value / 8 * 112)}px"></div>`).join('');
  renderAttendance();
  renderLiveTeam();
  renderScheduleWatch();
  renderEmployeeRequests();
}

function renderAttendance() {
  const term = $('#employeeSearch').value.toLowerCase();
  const filter = $('#statusFilter').value;
  const live = liveEmployees();
  const liveEmails = new Set(live.map(person => person.email));
  const source = filter === 'clocked' ? live : [...live, ...employeeDirectory.filter(person => !liveEmails.has(person.email))];
  const rows = source.filter(person => (!term || person.name.toLowerCase().includes(term) || person.role.toLowerCase().includes(term)) && (filter === 'all' || person.status === filter));
  $('#attendanceRows').innerHTML = rows.map(person => `<div class="attendance-row" data-employee="${encodeURIComponent(person.name)}"><div class="person"><span class="person-avatar" style="background:${person.color}">${person.initials}</span><span>${person.name}<small>${person.role}</small></span></div><span class="attendance-date">${person.date}</span><span class="attendance-time">${person.clockIn}</span><span class="attendance-time">${person.clockOut}</span><span class="attendance-time">${person.worked}</span><span class="status ${person.status === 'clocked' ? 'live' : 'complete'}">${person.status === 'clocked' ? '● Clocked in' : 'Complete'}</span></div>`).join('') || '<div class="empty-state">No employees match these filters.</div>';
  $('#reportCount').textContent = `${rows.length} employee record${rows.length === 1 ? '' : 's'}`;
  $('#clockedInCount').textContent = live.length;
}

function renderLiveTeam() {
  const online = liveEmployees();
  $('#liveEmployeeCount').textContent = online.length;
  $('#liveTeamRows').innerHTML = online.map((person, index) => `<div class="live-team-row" role="button" tabindex="0" data-employee="${encodeURIComponent(person.name)}"><div class="person"><span class="person-avatar" style="background:${person.color}">${person.initials}</span><span>${person.name}<small>${person.role}</small></span></div><span class="task-cell"><i class="project-dot ${index % 2 ? 'blue' : 'coral'}"></i>${person.task}</span><span class="live-clock">${person.clockIn}</span><span class="live-clock">${person.worked}</span><span class="status active">● Working</span></div>`).join('') || '<div class="empty-state">No employees are clocked in right now.</div>';
}

function toMinutes(time) {
  if (!time || time === '—') return null;
  const [raw, period] = time.split(' ');
  let [hour, minute] = raw.split(':').map(Number);
  if (period === 'PM' && hour !== 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;
  return hour * 60 + minute;
}

function scheduleStatus(person) {
  const inTime = toMinutes(person.clockIn);
  const outTime = toMinutes(person.clockOut);
  if (person.scheduledStart === null) return person.status === 'clocked' ? { type: 'checked-in', label: 'Working · flexible shift', className: 'checked' } : { type: 'complete', label: 'Flexible shift', className: 'checked' };
  if (person.status === 'clocked') return inTime < person.scheduledStart ? { type: 'early-in', label: 'Checked in early', className: 'early' } : { type: 'checked-in', label: 'Checked in', className: 'checked' };
  if (person.scheduledEnd === 1440) {
    if (outTime >= 720) return { type: 'early-out', label: 'Left before schedule', className: 'early' };
    if (outTime > 0) return { type: 'overtime', label: 'Overtime', className: 'overtime' };
    return { type: 'complete', label: 'On schedule', className: 'checked' };
  }
  if (outTime < person.scheduledEnd) return { type: 'early-out', label: 'Left before schedule', className: 'early' };
  if (outTime > person.scheduledEnd) return { type: 'overtime', label: 'Overtime', className: 'overtime' };
  return { type: 'complete', label: 'On schedule', className: 'checked' };
}

function loggedHours(person) {
  const match = person.worked.match(/(\d+)h\s*(\d+)m/);
  return match ? Number(match[1]) + Number(match[2]) / 60 : 0;
}

function hourlyRate(person) {
  if (typeof person.rate !== 'number') return null;
  return person.rate >= 1000 ? person.rate * phpUsdRate / 160 : person.rate;
}

function trackedHours(person) {
  if (typeof person.liveSeconds === 'number') return person.liveSeconds / 3600;
  return loggedHours(person) + (person.status === 'clocked' ? (Date.now() - liveCalculatorOpenedAt) / 3600000 : 0);
}

function employeeEarnings(person) {
  const rate = hourlyRate(person);
  const multiplier = holidayForDate(todayDate)?.type === 'regular' ? 2 : 1;
  return rate === null ? null : rate * trackedHours(person) * multiplier;
}

function rateLabel(person) {
  if (person.rate === 'Commission Based') return 'Commission';
  if (typeof person.rate !== 'number') return 'Pending';
  return person.rate >= 1000 ? `₱${person.rate.toLocaleString()}/mo → ${money(hourlyRate(person))}/hr` : `$${person.rate.toFixed(2)}/hr`;
}

function money(value) {
  return value === null || Number.isNaN(value) ? '—' : `$${value.toFixed(2)}`;
}

function isoDate(date) {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 10);
}

function holidayForDate(date) {
  return philippineHolidays2026.find(holiday => holiday.date === isoDate(date));
}

function renderScheduleWatch() {
  const live = liveEmployees();
  const statuses = live.map(person => ({ person, status: scheduleStatus(person) }));
  $('#checkedInMetric').textContent = live.length;
  $('#earlyInMetric').textContent = statuses.filter(item => item.status.type === 'early-in').length;
  $('#earlyOutMetric').textContent = statuses.filter(item => item.status.type === 'early-out').length;
  $('#overtimeMetric').textContent = statuses.filter(item => item.status.type === 'overtime').length;
  $('#livePayroll').textContent = money(live.reduce((sum, person) => sum + (employeeEarnings(person) || 0), 0));
  $('#earningRows').innerHTML = live.map(person => `<button class="earning-chip" data-earning-employee="${encodeURIComponent(person.name)}">${person.initials}<b>${money(employeeEarnings(person))}</b></button>`).join('') || '<span class="empty-state">No live earnings yet.</span>';
  const rows = statuses.filter(item => scheduleFilter === 'checked-in' ? item.person.status === 'clocked' : item.status.type === scheduleFilter);
  $('#scheduleRows').innerHTML = rows.map(({ person, status }) => `<div class="schedule-row" role="button" tabindex="0" data-employee="${encodeURIComponent(person.name)}"><div class="person"><span class="person-avatar" style="background:${person.color}">${person.initials}</span><span>${person.name}<small>${person.role}</small></span></div><span class="schedule-shift">${person.schedule}</span><span class="live-clock">${person.clockIn}</span><span class="live-clock">${person.clockOut}</span><span class="live-clock">${rateLabel(person)}</span><span class="live-clock">${money(employeeEarnings(person))}</span><span class="note ${status.className}"><i></i>${status.label}</span></div>`).join('') || '<div class="empty-state">No employees in this attendance group.</div>';
  $('#scheduleCount').textContent = `${rows.length} employee${rows.length === 1 ? '' : 's'} shown`;
}

function projectFor(person, index) {
  if (person.role.includes('Webinar')) return 'Webinar';
  if (person.role.includes('SMM')) return 'SMM';
  if (person.role.includes('Admin')) return 'Admin';
  return ['Coaching', 'Meeting', 'On Class'][index % 3];
}

function renderProjects() {
  const rows = employeeDirectory.map((person, index) => ({ person, project: projectFor(person, index) })).filter(item => selectedProject === 'All' || item.project === selectedProject);
  $('#projectRows').innerHTML = rows.map(({ person, project }) => `<div class="project-row" role="button" tabindex="0" data-employee="${encodeURIComponent(person.name)}"><div class="person"><span class="person-avatar" style="background:${person.color}">${person.initials}</span><span>${person.name}<small>${person.role}</small></span></div><span class="project-tag">${project}</span><span>${person.task}</span><span class="schedule-shift">${person.schedule}</span><span class="status ${person.status === 'clocked' ? 'active' : 'complete'}">${person.status === 'clocked' ? '● Working' : 'Complete'}</span></div>`).join('') || '<div class="empty-state">No employees in this project category.</div>';
  $('#projectCount').textContent = `${rows.length} assignment${rows.length === 1 ? '' : 's'}`;
}

function renderManagedEmployees() {
  const select = $('#manageEmployeeSelect');
  const selected = select.value;
  select.innerHTML = '<option value="">Select employee</option>' + managedEmployees.map(employee => `<option value="${employee.id}">${escapeHtml(employee.name)} — ${escapeHtml(employee.email)}</option>`).join('');
  select.value = managedEmployees.some(employee => employee.id === selected) ? selected : '';
  $('#teamCount').textContent = employeeDirectory.length;
}

function renderTeamDirectory() {
  const roster = allRosterWithExtras();
  $('#teamRows').innerHTML = roster.map(person => {
    const access = managedEmployees.find(employee => employee.email === person.email || employee.name === person.name);
    const passwordLine = access?.tempPassword ? `<small>${access.email} · Pass: ${access.tempPassword}</small>` : `<small>${person.department || 'Employee'}</small>`;
    return `<div class="team-row" role="button" tabindex="0" data-employee="${encodeURIComponent(person.name)}"><div class="person"><span class="person-avatar" style="background:${person.color}">${person.initials}</span><span>${person.name}${passwordLine}</span></div><span>${person.role}<small>${person.department || ''}</small></span><span class="schedule-shift">${person.schedule || 'Not assigned'}</span><span class="schedule-shift">${typeof person.rate === 'number' ? rateLabel(person) : person.rate || 'Pending'}</span><span class="access-state ${access ? '' : 'pending'}">${access ? 'Access active' : 'No access'}</span></div>`;
  }).join('');
  $('#teamDirectoryCount').textContent = `${roster.length} employee${roster.length === 1 ? '' : 's'}`;
}

function renderHolidayPay() {
  const holiday = holidayForDate(todayDate);
  const regular = holiday?.type === 'regular';
  $('#holidayMultiplier').textContent = regular ? '2× regular-holiday pay' : '1× standard pay';
  $('#holidayPayMessage').textContent = holiday ? `${holiday.name}${regular ? ' applies double pay today.' : ' is a special non-working day; standard payroll rules remain in effect.'}` : 'No regular holiday today.';
}

function nextPayday(date) {
  const candidate = new Date(date.getFullYear(), date.getMonth(), date.getDate() <= 5 ? 5 : date.getDate() <= 20 ? 20 : 5);
  if (date.getDate() > 20) candidate.setMonth(candidate.getMonth() + 1);
  return candidate;
}

function renderPayday() {
  const payday = nextPayday(todayDate);
  const days = Math.ceil((new Date(payday.getFullYear(), payday.getMonth(), payday.getDate()) - new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate())) / 86400000);
  $('#nextPayday').textContent = payday.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  $('#paydayMessage').textContent = days === 0 ? 'Payroll is due today.' : `${days} day${days === 1 ? '' : 's'} until payday · ${payday.getDate() === 20 ? 'Work from the 1st-15th' : 'Work from the 16th-end of month'}.`;
  $('#paydayAlert').hidden = days > 3;
}

function renderHolidayCalendar() {
  renderCalendar(calendarCursor, '#calendarMonth', '#holidayCalendar', date => {
    const holiday = holidayForDate(date);
    return { className: holiday?.type || '', note: holiday?.name || '' };
  });
}

function renderLeaveCalendar() {
  renderCalendar(leaveCalendarCursor, '#leaveCalendarMonth', '#leaveCalendar', date => {
    const key = isoDate(date);
    const request = leaveRequests.find(item => item.date === key && item.status !== 'rejected');
    return { className: request ? 'leave-booked' : '', note: request ? `${request.employeeName} · ${request.status}` : '' };
  });
}

function renderCalendar(cursor, titleSelector, bodySelector, decorator) {
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const previousDays = new Date(year, month, 0).getDate();
  $(titleSelector).textContent = cursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  let cells = '';
  for (let index = 0; index < 42; index++) {
    const day = index - firstDay.getDay() + 1;
    const cellDate = new Date(year, month, day);
    const muted = day < 1 || day > daysInMonth;
    const isToday = isoDate(cellDate) === isoDate(todayDate);
    const decorated = decorator(cellDate) || {};
    cells += `<button class="calendar-day ${muted ? 'muted' : ''} ${isToday ? 'today' : ''} ${decorated.className || ''}" data-calendar-date="${isoDate(cellDate)}"><span>${muted ? (day < 1 ? previousDays + day : day - daysInMonth) : day}</span>${decorated.note ? `<small class="holiday-name">${escapeHtml(decorated.note)}</small>` : ''}</button>`;
  }
  $(bodySelector).innerHTML = cells;
}

async function refreshFxRate() {
  try {
    const response = await fetch('https://api.frankfurter.app/latest?from=PHP&to=USD');
    if (!response.ok) throw new Error('rate unavailable');
    const result = await response.json();
    phpUsdRate = result.rates.USD;
    fxRateDate = result.date;
    localStorage.setItem('minute-php-usd-rate', String(phpUsdRate));
    localStorage.setItem('minute-php-usd-date', fxRateDate);
    $('#fxRateLabel').textContent = 'Live PHP→USD reference rate';
    $('#fxRateValue').textContent = `₱1.00 = $${phpUsdRate.toFixed(4)}`;
    $('#fxRateMeta').textContent = `Rate date: ${fxRateDate} · used for PHP monthly salaries.`;
  } catch {
    $('#fxRateLabel').textContent = 'Offline PHP→USD reference rate';
    $('#fxRateValue').textContent = `₱1.00 = $${phpUsdRate.toFixed(4)}`;
    $('#fxRateMeta').textContent = `${fxRateDate === 'offline reference' ? 'Fallback estimate while offline' : 'Last saved rate: ' + fxRateDate} · reconnect to refresh.`;
  }
  renderScheduleWatch();
}

function renderApprovals() {
  $('#leaveApprovalRows').innerHTML = leaveRequests.map(request => approvalRow(request, 'leave')).join('') || '<div class="empty-state">No leave requests yet.</div>';
  $('#timeEditApprovalRows').innerHTML = timeEditRequests.map(request => approvalRow(request, 'time')).join('') || '<div class="empty-state">No time edit requests yet.</div>';
}

function approvalRow(request, type) {
  const details = type === 'leave' ? `${request.date} · ${request.reason}` : `${request.date} · ${request.clockIn}-${request.clockOut} · ${request.reason}`;
  const actions = request.status === 'pending' ? `<div class="approval-actions"><button class="approve-btn" data-approve="${type}" data-id="${request.id}">Approve</button><button class="reject-btn" data-reject="${type}" data-id="${request.id}">Reject</button></div>` : '';
  return `<div class="approval-row"><div><b>${escapeHtml(request.employeeName)}</b><small>${escapeHtml(details)}</small></div><span class="access-state ${request.status === 'pending' ? 'pending' : ''}">${request.status}</span>${actions}</div>`;
}

function renderEmployeeRequests() {
  if (!currentAccount) return;
  const myLeaves = leaveRequests.filter(request => request.employeeEmail === currentAccount.email);
  const myEdits = timeEditRequests.filter(request => request.employeeEmail === currentAccount.email);
  $('#myLeaveRows').innerHTML = myLeaves.map(request => `<div class="approval-row"><div><b>${request.date}</b><small>${escapeHtml(request.reason)}</small></div><span class="access-state ${request.status === 'pending' ? 'pending' : ''}">${request.status}</span></div>`).join('') || '<div class="empty-state">No leave requests yet.</div>';
  $('#myTimeEditRows').innerHTML = myEdits.map(request => `<div class="approval-row"><div><b>${request.date}</b><small>${request.clockIn}-${request.clockOut} · ${escapeHtml(request.reason)}</small></div><span class="access-state ${request.status === 'pending' ? 'pending' : ''}">${request.status}</span></div>`).join('') || '<div class="empty-state">No time edit requests yet.</div>';
  renderLeaveCalendar();
}

function renderDocuments() {
  const mine = coachingDocuments.filter(document => document.employeeEmail === currentAccount?.email);
  $('#documentRows').innerHTML = mine.map(document => `<div class="document-row"><div><b>${escapeHtml(document.name)}</b><small>${document.size} · uploaded ${document.uploadedAt}</small></div><span class="access-state">Saved</span></div>`).join('') || '<div class="empty-state">No coaching documents uploaded yet.</div>';
}

function openEmployeeDetail(name) {
  const added = managedEmployees.find(item => item.name === name);
  const person = liveEmployees().find(item => item.name === name) || allRosterWithExtras().find(item => item.name === name) || (added && { name: added.name, role: added.jobRole, department: added.department || 'Added by admin', task: 'Not assigned', rate: null, scheduledStart: null, scheduledEnd: null, schedule: 'Not assigned', initials: added.initials, color: '#bad7ed', clockIn: '—', clockOut: '—', worked: '0h 00m', status: 'complete' });
  if (!person) return;
  const status = scheduleStatus(person);
  $('#detailAvatar').textContent = person.initials;
  $('#detailAvatar').style.background = person.color;
  $('#employeeDetailName').textContent = person.name;
  $('#employeeDetailRole').textContent = `${person.role} · ${person.department}`;
  $('#detailTask').textContent = person.task;
  $('#detailStatus').textContent = status.label;
  $('#detailClockIn').textContent = person.clockIn;
  $('#detailWorked').textContent = person.worked;
  $('#detailRate').textContent = rateLabel(person);
  $('#detailEarnings').textContent = money(employeeEarnings(person));
  $('#employeeDetailBackdrop').hidden = false;
}

function closeEmployeeDetail() {
  $('#employeeDetailBackdrop').hidden = true;
}

function openEmployeeForm(employee) {
  editingEmployeeId = employee?.id || null;
  $('#employeeForm').reset();
  $('#employeeFormError').hidden = true;
  $('#employeeFormTitle').textContent = employee ? 'Edit employee access' : 'Give employee access';
  $('#employeeFormEyebrow').textContent = employee ? 'UPDATE ACCESS' : 'ADMIN ACCESS';
  $('#employeePassword').required = !employee;
  if (employee) {
    $('#employeeName').value = employee.name;
    $('#employeeEmail').value = employee.email;
    $('#employeeRole').value = employee.jobRole;
    $('#employeePassword').value = employee.tempPassword || '';
    $('#employeePassword').placeholder = 'Leave blank to keep current password';
  } else {
    $('#employeePassword').value = randomPassword();
    $('#employeePassword').placeholder = 'Create a temporary password';
  }
  $('#employeeModalBackdrop').hidden = false;
  $('#employeeName').focus();
}

function closeEmployeeForm() {
  $('#employeeModalBackdrop').hidden = true;
  editingEmployeeId = null;
}

function openLeaveForm(date = '') {
  $('#leaveForm').reset();
  $('#leaveFormError').hidden = true;
  $('#leaveDate').value = date || isoDate(todayDate);
  $('#leaveModalBackdrop').hidden = false;
}

function closeLeaveForm() {
  $('#leaveModalBackdrop').hidden = true;
}

function openTimeEditForm(date = '') {
  $('#timeEditForm').reset();
  $('#timeEditFormError').hidden = true;
  $('#timeEditDate').value = date || isoDate(todayDate);
  $('#timeEditModalBackdrop').hidden = false;
}

function closeTimeEditForm() {
  $('#timeEditModalBackdrop').hidden = true;
}

function showCheckedInSchedule() {
  if (currentAccount?.role !== 'admin') return showToast('Today activity selected.');
  scheduleFilter = 'checked-in';
  $$('[data-schedule-filter]').forEach(item => item.classList.toggle('active', item.dataset.scheduleFilter === 'checked-in'));
  renderScheduleWatch();
  $('.schedule-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function cardKeyAction(event, callback) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    callback();
  }
}

function showPage() {
  const page = (location.hash || '#today').slice(1);
  const adminAllowed = ['today', 'attendance', 'projects', 'team', 'approvals'];
  const employeeAllowed = ['today', 'calendar', 'documents', 'requests'];
  const allowed = currentAccount?.role === 'employee' ? employeeAllowed : adminAllowed;
  const active = allowed.includes(page) ? page : 'today';
  if (page !== active) location.hash = active;
  document.body.dataset.page = active;
  $$('.nav-item').forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${active}`));
  if (active === 'projects') renderProjects();
  if (active === 'team') renderTeamDirectory();
  if (active === 'approvals') renderApprovals();
  if (active === 'calendar') renderLeaveCalendar();
  if (active === 'documents') renderDocuments();
  if (active === 'requests') renderEmployeeRequests();
}

function applyAccess(account) {
  currentAccount = account;
  loadStateForAccount(account);
  document.body.classList.toggle('employee-mode', account.role === 'employee');
  document.body.classList.toggle('admin-mode', account.role === 'admin');
  $('#loginShell').hidden = true;
  $('#accessChip').innerHTML = `<i></i> ${account.role === 'admin' ? 'Admin' : 'Employee'} access`;
  $('#profileInitials').textContent = account.initials;
  $('#profileName').textContent = account.name;
  $('#profileRole').textContent = account.role === 'admin' ? 'Administrator' : 'Employee workspace';
  $('#greeting').textContent = `Good morning, ${account.name.split(' ')[0]}.`;
  const person = rosterPersonFor(account);
  if (person) $('#taskInput').value = projectFor(person, employeeDirectory.indexOf(person));
  syncOwnLivePresence();
  if (interval) clearInterval(interval);
  if (state.running || state.lunch) interval = setInterval(render, 1000);
  render();
  showPage();
}

$('#toggleTimer').onclick = () => {
  if (currentAccount?.role !== 'employee') return;
  if (state.running) {
    const end = Date.now();
    state.entries.unshift({ task: state.running.task, seconds: secondsBetween(state.running.start, end), start: state.running.start, end });
    state.clockOut = end;
    state.running = null;
    removeLivePresence(currentAccount.email);
    showToast('Clocked out. Nice work.');
  } else {
    const task = $('#taskInput').value.trim() || 'Untitled task';
    const start = Date.now();
    state.running = { task, start };
    state.clockIn = state.clockIn || start;
    state.clockOut = null;
    syncOwnLivePresence();
    showToast('Clocked in.');
  }
  if (interval) clearInterval(interval);
  if (state.running || state.lunch) interval = setInterval(render, 1000);
  save();
  syncOwnLivePresence();
  render();
};

$('#lunchButton').onclick = () => {
  if (currentAccount?.role !== 'employee') return;
  if (!state.clockIn) return showToast('Clock in before starting lunch.');
  if (state.lunch) {
    const end = Date.now();
    state.lunchLog.unshift({ start: state.lunch.start, end, seconds: secondsBetween(state.lunch.start, end) });
    state.entries.unshift({ task: 'Lunch break', seconds: secondsBetween(state.lunch.start, end), lunch: true });
    state.lunch = null;
    showToast('Lunch ended.');
  } else {
    state.lunch = { start: Date.now() };
    showToast('Lunch started.');
  }
  if (interval) clearInterval(interval);
  if (state.running || state.lunch) interval = setInterval(render, 1000);
  save();
  render();
};

$('#addTime').onclick = () => {
  if (currentAccount?.role === 'employee') return showToast('Employees cannot manually edit time. Use My Requests instead.');
  $('#modalBackdrop').hidden = false;
};

$('#projectButton').onclick = () => {
  const input = $('#taskInput');
  input.value = taskOptions[(taskOptions.indexOf(input.value) + 1) % taskOptions.length];
  if (state.running) {
    state.running.task = input.value;
    save();
    syncOwnLivePresence();
    render();
  }
};

$('#taskInput').oninput = () => {
  if (!state.running) return;
  state.running.task = $('#taskInput').value.trim() || 'Untitled task';
  save();
  syncOwnLivePresence();
};

$('#timeForm').onsubmit = event => {
  event.preventDefault();
  const task = $('#manualTask').value.trim();
  const [startHour, startMinute] = $('#manualStart').value.split(':').map(Number);
  const [endHour, endMinute] = $('#manualEnd').value.split(':').map(Number);
  const seconds = (endHour * 60 + endMinute - startHour * 60 - startMinute) * 60;
  if (seconds <= 0) return showToast('End time needs to be after start time.');
  state.entries.unshift({ task, seconds });
  save();
  render();
  $('#modalBackdrop').hidden = true;
  event.target.reset();
  showToast('Time entry added.');
};

$('#employeeForm').onsubmit = async event => {
  event.preventDefault();
  const name = $('#employeeName').value.trim();
  const email = $('#employeeEmail').value.trim().toLowerCase();
  const jobRole = $('#employeeRole').value.trim();
  const password = $('#employeePassword').value.trim();
  const duplicate = managedEmployees.find(item => item.email === email && item.id !== editingEmployeeId);
  if (duplicate) {
    $('#employeeFormError').textContent = 'That email already has employee access.';
    $('#employeeFormError').hidden = false;
    return;
  }
  const old = managedEmployees.find(item => item.id === editingEmployeeId);
  const record = {
    id: editingEmployeeId || crypto.randomUUID(),
    name,
    email,
    jobRole,
    department: old?.department || 'Added by admin',
    initials: initials(name),
    tempPassword: password || old?.tempPassword || randomPassword(),
    hash: password ? await hashPassword(password) : old.hash
  };
  if (old) managedEmployees = managedEmployees.map(item => item.id === record.id ? record : item);
  else managedEmployees.push(record);
  persistEmployees();
  renderManagedEmployees();
  renderTeamDirectory();
  closeEmployeeForm();
  showToast(old ? 'Employee access updated.' : 'Employee access created.');
};

$('#leaveForm').onsubmit = event => {
  event.preventDefault();
  const date = $('#leaveDate').value;
  const conflict = leaveRequests.find(request => request.date === date && request.employeeEmail !== currentAccount.email && request.status !== 'rejected');
  if (conflict) {
    $('#leaveFormError').textContent = `${conflict.employeeName} already has leave filed for this date.`;
    $('#leaveFormError').hidden = false;
    return;
  }
  leaveRequests.push({ id: crypto.randomUUID(), employeeName: currentAccount.name, employeeEmail: currentAccount.email, date, reason: $('#leaveReason').value.trim(), status: 'pending', createdAt: new Date().toLocaleString() });
  persistLeaveRequests();
  closeLeaveForm();
  renderEmployeeRequests();
  showToast('Leave request submitted for admin approval.');
};

$('#timeEditForm').onsubmit = event => {
  event.preventDefault();
  timeEditRequests.push({ id: crypto.randomUUID(), employeeName: currentAccount.name, employeeEmail: currentAccount.email, date: $('#timeEditDate').value, clockIn: $('#timeEditIn').value, clockOut: $('#timeEditOut').value, reason: $('#timeEditReason').value.trim(), status: 'pending', createdAt: new Date().toLocaleString() });
  persistTimeEditRequests();
  closeTimeEditForm();
  renderEmployeeRequests();
  showToast('Time edit request submitted for admin approval.');
};

$('#coachingUpload').onchange = event => {
  const files = [...event.target.files];
  const uploadedAt = new Date().toLocaleDateString();
  files.forEach(file => coachingDocuments.push({ id: crypto.randomUUID(), employeeName: currentAccount.name, employeeEmail: currentAccount.email, name: file.name, size: `${Math.ceil(file.size / 1024)} KB`, uploadedAt }));
  persistDocuments();
  renderDocuments();
  event.target.value = '';
  showToast(`${files.length} coaching document${files.length === 1 ? '' : 's'} added.`);
};

$('#loginForm').onsubmit = async event => {
  event.preventDefault();
  const email = $('#loginEmail').value.trim().toLowerCase();
  const passwordHash = await hashPassword($('#loginPassword').value);
  const employee = managedEmployees.find(item => item.email === email && item.hash === passwordHash);
  const account = adminAccount.email === email && adminAccount.hash === passwordHash ? adminAccount : employee && { ...employee, role: 'employee' };
  if (!account) {
    $('#loginError').textContent = 'That email and password combination was not recognized.';
    $('#loginError').hidden = false;
    return;
  }
  $('#loginError').hidden = true;
  sessionStorage.setItem('minute-session', JSON.stringify(account));
  applyAccess(account);
  showToast(`Welcome back, ${account.name}.`);
};

$('#profileButton').onclick = () => {
  sessionStorage.removeItem('minute-session');
  currentAccount = null;
  $('#loginPassword').value = '';
  $('#loginShell').hidden = false;
  $('#loginEmail').focus();
};

$('#seedEmployees').onclick = async () => {
  const added = await seedRosterAccess();
  showToast(added ? `${added} roster employee account${added === 1 ? '' : 's'} created.` : 'All roster employees already have access.');
};

$('#generatePassword').onclick = () => {
  $('#employeePassword').value = randomPassword();
};

$('#employeeImport').onchange = event => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async () => {
    const lines = String(reader.result).trim().split(/\r?\n/);
    const rows = lines.slice(1).map(line => line.split(',').map(value => value.trim()));
    let added = 0;
    for (const [name, email, jobRole, password] of rows) {
      if (!name || !email || !password || managedEmployees.some(item => item.email === email.toLowerCase())) continue;
      managedEmployees.push({ id: crypto.randomUUID(), name, email: email.toLowerCase(), jobRole: jobRole || 'Employee', department: 'Imported', initials: initials(name), tempPassword: password, hash: await hashPassword(password) });
      added++;
    }
    persistEmployees();
    renderManagedEmployees();
    renderTeamDirectory();
    showToast(`${added} employee access record${added === 1 ? '' : 's'} imported.`);
  };
  reader.readAsText(file);
  event.target.value = '';
};

$('#addEmployee').onclick = () => openEmployeeForm();
$('#teamAddEmployee').onclick = () => openEmployeeForm();
$('#editEmployee').onclick = () => {
  const employee = managedEmployees.find(item => item.id === $('#manageEmployeeSelect').value);
  if (!employee) return showToast('Choose an employee first.');
  openEmployeeForm(employee);
};
$('#deleteEmployee').onclick = () => {
  const id = $('#manageEmployeeSelect').value;
  if (!id) return showToast('Choose an employee first.');
  const employee = managedEmployees.find(item => item.id === id);
  if (!confirm(`Remove ${employee.name}'s access? They will no longer be able to sign in.`)) return;
  managedEmployees = managedEmployees.filter(item => item.id !== id);
  persistEmployees();
  renderManagedEmployees();
  renderTeamDirectory();
  showToast('Employee access removed.');
};

$('#employeeModalClose').onclick = closeEmployeeForm;
$('#employeeModalCancel').onclick = closeEmployeeForm;
$('#employeeModalBackdrop').onclick = event => { if (event.target === event.currentTarget) closeEmployeeForm(); };
$('#modalClose').onclick = () => $('#modalBackdrop').hidden = true;
$('#modalCancel').onclick = () => $('#modalBackdrop').hidden = true;
$('#modalBackdrop').onclick = event => { if (event.target === event.currentTarget) $('#modalBackdrop').hidden = true; };
$('#leaveModalClose').onclick = closeLeaveForm;
$('#leaveModalCancel').onclick = closeLeaveForm;
$('#leaveModalBackdrop').onclick = event => { if (event.target === event.currentTarget) closeLeaveForm(); };
$('#timeEditModalClose').onclick = closeTimeEditForm;
$('#timeEditModalCancel').onclick = closeTimeEditForm;
$('#timeEditModalBackdrop').onclick = event => { if (event.target === event.currentTarget) closeTimeEditForm(); };
$('#employeeDetailClose').onclick = closeEmployeeDetail;
$('#detailDone').onclick = closeEmployeeDetail;
$('#employeeDetailBackdrop').onclick = event => { if (event.target === event.currentTarget) closeEmployeeDetail(); };

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  if (!$('#modalBackdrop').hidden) $('#modalBackdrop').hidden = true;
  if (!$('#employeeModalBackdrop').hidden) closeEmployeeForm();
  if (!$('#employeeDetailBackdrop').hidden) closeEmployeeDetail();
  if (!$('#leaveModalBackdrop').hidden) closeLeaveForm();
  if (!$('#timeEditModalBackdrop').hidden) closeTimeEditForm();
});

$('#employeeSearch').oninput = renderAttendance;
$('#statusFilter').onchange = renderAttendance;
$('#dateFilter').onchange = renderAttendance;
$('#exportButton').onclick = () => showToast('Employees can view time here; exports are for admin reports.');
$('#attendanceExport').onclick = () => exportCsv('sync2time-attendance-report.csv', ['Employee,Role,Date,Clock in,Clock out,Worked,Status', ...employeeDirectory.map(person => `"${person.name}","${person.role}","${person.date}","${person.clockIn}","${person.clockOut}","${person.worked}","${person.status === 'clocked' ? 'Clocked in' : 'Complete'}"`)].join('\n'), 'Attendance report exported as CSV.');
$('#scheduleExport').onclick = () => exportCsv('sync2time-schedule-watch.csv', ['Employee,Role,Schedule,Clock in,Clock out,Rate,Earnings,Attendance note', ...employeeDirectory.map(person => `"${person.name}","${person.role}","${person.schedule}","${person.clockIn}","${person.clockOut}","${rateLabel(person)}","${money(employeeEarnings(person))}","${scheduleStatus(person).label}"`)].join('\n'), 'Schedule watch exported as CSV.');

function exportCsv(filename, text, message) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([text], { type: 'text/csv' }));
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
  showToast(message);
}

$$('[data-schedule-filter]').forEach(button => button.onclick = () => {
  scheduleFilter = button.dataset.scheduleFilter;
  $$('[data-schedule-filter]').forEach(item => item.classList.toggle('active', item === button));
  renderScheduleWatch();
});

$$('[data-project]').forEach(button => button.onclick = () => {
  selectedProject = button.dataset.project;
  $$('[data-project]').forEach(item => item.classList.toggle('active', item === button));
  renderProjects();
});

$('#projectClear').onclick = () => {
  selectedProject = 'All';
  $$('[data-project]').forEach(item => item.classList.toggle('active', item.dataset.project === 'All'));
  renderProjects();
};

['liveTeamRows', 'scheduleRows', 'projectRows', 'teamRows', 'attendanceRows'].forEach(id => {
  $(`#${id}`).onclick = event => {
    const row = event.target.closest('[data-employee]');
    if (row) openEmployeeDetail(decodeURIComponent(row.dataset.employee));
  };
  $(`#${id}`).onkeydown = event => {
    if (event.key === 'Enter' || event.key === ' ') {
      const row = event.target.closest('[data-employee]');
      if (row) {
        event.preventDefault();
        openEmployeeDetail(decodeURIComponent(row.dataset.employee));
      }
    }
  };
});

$('#earningRows').onclick = event => {
  const chip = event.target.closest('[data-earning-employee]');
  if (chip) openEmployeeDetail(decodeURIComponent(chip.dataset.earningEmployee));
};

$('#activitySummary').onclick = showCheckedInSchedule;
$('#activitySummary').onkeydown = event => cardKeyAction(event, showCheckedInSchedule);
$('#clockSummary').onclick = () => $('#personalActivity').scrollIntoView({ behavior: 'smooth', block: 'start' });
$('#clockSummary').onkeydown = event => cardKeyAction(event, () => $('#personalActivity').scrollIntoView({ behavior: 'smooth', block: 'start' }));
$('#bars').onclick = event => {
  const bar = event.target.closest('[data-day]');
  if (bar) showToast(`${bar.dataset.day} activity selected.`);
};
$('.earnings-card').onclick = event => {
  if (!event.target.closest('[data-earning-employee]')) showCheckedInSchedule();
};

$('#calendarPrev').onclick = () => { calendarCursor.setMonth(calendarCursor.getMonth() - 1); renderHolidayCalendar(); };
$('#calendarNext').onclick = () => { calendarCursor.setMonth(calendarCursor.getMonth() + 1); renderHolidayCalendar(); };
$('#holidayCalendar').onclick = event => {
  const day = event.target.closest('[data-calendar-date]');
  if (!day) return;
  const holiday = philippineHolidays2026.find(item => item.date === day.dataset.calendarDate);
  showToast(holiday ? `${holiday.name}: ${holiday.type === 'regular' ? '2× regular-holiday pay applies.' : 'special non-working day.'}` : `${new Date(day.dataset.calendarDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}: no listed holiday.`);
};
$('#paydayCard').onclick = () => showToast($('#paydayMessage').textContent);
$('#paydayCard').onkeydown = event => cardKeyAction(event, () => showToast($('#paydayMessage').textContent));

$('#leaveCalendarPrev').onclick = () => { leaveCalendarCursor.setMonth(leaveCalendarCursor.getMonth() - 1); renderLeaveCalendar(); };
$('#leaveCalendarNext').onclick = () => { leaveCalendarCursor.setMonth(leaveCalendarCursor.getMonth() + 1); renderLeaveCalendar(); };
$('#leaveCalendar').onclick = event => {
  const day = event.target.closest('[data-calendar-date]');
  if (!day) return;
  if (day.classList.contains('muted')) return;
  const conflict = leaveRequests.find(request => request.date === day.dataset.calendarDate && request.status !== 'rejected');
  if (conflict && conflict.employeeEmail !== currentAccount?.email) return showToast(`${conflict.employeeName} already has leave on that date.`);
  openLeaveForm(day.dataset.calendarDate);
};
$('#openLeaveRequest').onclick = () => openLeaveForm();
$('#openTimeEditRequest').onclick = () => openTimeEditForm();

$('.icon-btn').onclick = () => showToast('No new notifications.');
$('.help').onclick = () => showToast('Tip: employee time edits go to the Approvals page.');
$$('.nav-item').forEach(link => link.onclick = () => setTimeout(showPage, 0));
window.addEventListener('hashchange', showPage);
window.addEventListener('storage', event => {
  if (event.key !== LIVE_PRESENCE_KEY) return;
  renderLiveTeam();
  renderAttendance();
  renderScheduleWatch();
});

document.body.addEventListener('click', event => {
  const approve = event.target.closest('[data-approve]');
  const reject = event.target.closest('[data-reject]');
  if (!approve && !reject) return;
  const button = approve || reject;
  const type = button.dataset.approve || button.dataset.reject;
  const id = button.dataset.id;
  const status = approve ? 'approved' : 'rejected';
  if (type === 'leave') {
    leaveRequests = leaveRequests.map(request => request.id === id ? { ...request, status } : request);
    persistLeaveRequests();
  } else {
    timeEditRequests = timeEditRequests.map(request => request.id === id ? { ...request, status } : request);
    persistTimeEditRequests();
  }
  renderApprovals();
  renderEmployeeRequests();
  showToast(`Request ${status}.`);
});

(async function init() {
  await seedRosterAccess(false);
  renderManagedEmployees();
  renderProjects();
  renderTeamDirectory();
  renderPayday();
  renderHolidayPay();
  renderHolidayCalendar();
  renderLeaveCalendar();
  renderApprovals();
  renderDocuments();
  refreshFxRate();
  const savedSession = JSON.parse(sessionStorage.getItem('minute-session') || 'null');
  if (savedSession) applyAccess(savedSession);
  else {
    render();
    showPage();
  }
  setInterval(() => {
    syncOwnLivePresence();
    renderLiveTeam();
    renderAttendance();
    renderScheduleWatch();
  }, 1000);
})();
