const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const palette = ['#e6aab1', '#bad7ed', '#f2d18a', '#c8d9b6', '#d8c1e8', '#f2b7a6', '#b9e2dc', '#e3d29d'];
const DEFAULT_TASK_OPTIONS = ['Coaching', 'Meeting', 'On Class', 'Admin', 'Webinar', 'SMM'];
let taskOptions = [...DEFAULT_TASK_OPTIONS];
const BUSINESS_TIMEZONE = 'Asia/Manila';
const BUSINESS_UTC_OFFSET = '+08:00';
let todayDate = new Date();
const FALLBACK_PHP_USD = 0.0171;
const ADMIN_HASH = '1d15690cc56c1cd84a6bcbe25ffae7fae7b44136b61b6a5a69782ae25448ee21';
const adminAccount = { email: 'hr@sync2va.com', name: 'HR Admin', initials: 'HR', role: 'admin', hash: ADMIN_HASH };
const SUPABASE_URL = 'https://zbhlsroeztezfnfxeaus.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_6AjjuOnbBU69TPQo8GWgrg_5YcpOaL6';
const supabaseClient = window.supabase?.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY) || null;

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
  email: name === 'Claudine Angelica Pia D. San Juan' ? 'claudine.sanjuan@sync2va.com' : emailFor(name),
  role,
  department,
  task,
  rate,
  rateType: typeof rate === 'number' && rate < 1000 ? 'Hourly USD' : typeof rate === 'number' ? 'Monthly PHP' : 'Commission Based',
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
let overtimeRequests = JSON.parse(localStorage.getItem('sync2time-overtime-requests') || '[]');
let coachingDocuments = JSON.parse(localStorage.getItem('minute-coaching-documents') || '[]');
let state = emptyTimeState();
let currentAccount = null;
let currentProfile = null;
let supabaseSession = null;
let supabaseProfiles = [];
let supabaseLivePresence = [];
let supabaseTimeEntries = [];
let supabaseDeletedTimeEntries = [];
let sharedSettings = {};
let deletedTimeAlerts = JSON.parse(localStorage.getItem('sync2time-deleted-time-alerts') || '[]');
let payrollAdjustments = JSON.parse(localStorage.getItem('sync2time-payroll-adjustments') || '[]');
let paystubRecipients = JSON.parse(localStorage.getItem('sync2time-paystub-recipients') || '[]');
let currentReportRows = [];
let currentPayrollRows = [];
let currentEmployeeReportRows = [];
let selectedPayrollRole = 'coaches';
let editingPayrollRow = null;
let editingPayrollAdjustment = null;
let deletedNoticeRepairAttempted = false;
let approvedTimeEditRepairAttempted = false;
let editingEmployeeId = null;
let selectedApprovalRequest = null;
let interval;
let longSessionDeadline = null;
let longSessionClockOutPending = false;
const LONG_SESSION_SECONDS = 3 * 60 * 60;
const LONG_SESSION_RESPONSE_SECONDS = 60;
let scheduleFilter = 'checked-in';
let selectedProject = 'All';
let calendarCursor = businessMonthCursor(todayDate);
let leaveCalendarCursor = businessMonthCursor(todayDate);
let phpUsdRate = Number(localStorage.getItem('minute-php-usd-rate')) || FALLBACK_PHP_USD;
let fxRateDate = localStorage.getItem('minute-php-usd-date') || 'offline reference';
let liveUsdPhpRate = Number(localStorage.getItem('sync2time-live-usd-php')) || null;
let liveUsdPhpDate = localStorage.getItem('sync2time-live-usd-php-date') || '';
let manualPayrollFxOverride = Number(localStorage.getItem('sync2time-payroll-usd-php')) || null;
const liveCalculatorOpenedAt = Date.now();
const LIVE_PRESENCE_KEY = 'sync2time-live-presence';
const LIVE_ACTIVITY_PREFIX = '__sync2time__';

$('#todayLabel').textContent = businessDateLabel(todayDate, { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase();

function setLoginMessage(message, isError = true) {
  const target = $('#loginError');
  if (!target) return;
  target.textContent = message;
  target.hidden = false;
  target.classList.toggle('is-muted', !isError);
}

function clearLoginMessage() {
  const target = $('#loginError');
  if (!target) return;
  target.textContent = '';
  target.hidden = true;
  target.classList.remove('is-muted');
}

function withTimeout(promise, timeoutMs, message) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(message)), timeoutMs))
  ]);
}

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

function businessParts(date = new Date()) {
  const parts = {};
  new Intl.DateTimeFormat('en-US', {
    timeZone: BUSINESS_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).formatToParts(new Date(date)).forEach(({ type, value }) => {
    if (type !== 'literal') parts[type] = value;
  });
  return parts;
}

function businessDateKey(date = new Date()) {
  const parts = businessParts(date);
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function businessDateFromKey(key) {
  const [year, month, day] = String(key || '').split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
}

function businessMonthCursor(date = new Date()) {
  const parts = businessParts(date);
  return businessDateFromKey(`${parts.year}-${parts.month}-01`);
}

function businessStartFromKey(key) {
  return new Date(`${key}T00:00:00${BUSINESS_UTC_OFFSET}`);
}

function businessEndFromKey(key) {
  return new Date(`${key}T23:59:59.999${BUSINESS_UTC_OFFSET}`);
}

function businessDateTime(key, time = '00:00') {
  const normalized = String(time || '00:00').length === 5 ? `${time}:00` : String(time || '00:00:00');
  return new Date(`${key}T${normalized}${BUSINESS_UTC_OFFSET}`);
}

function businessDateLabel(date, options = {}) {
  return new Date(date).toLocaleDateString('en-US', { timeZone: BUSINESS_TIMEZONE, ...options });
}

function businessDateTimeLabel(date, options = {}) {
  return new Date(date).toLocaleString('en-US', { timeZone: BUSINESS_TIMEZONE, ...options });
}

function addBusinessDays(date, days) {
  const next = new Date(date.getTime());
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function addBusinessMonths(date, months) {
  const next = new Date(date.getTime());
  next.setUTCMonth(next.getUTCMonth() + months);
  return next;
}

function businessMonthLastDay(year, month) {
  return new Date(Date.UTC(year, month, 0, 12, 0, 0)).getUTCDate();
}

function businessDayMinutes(date) {
  const parts = businessParts(date);
  return Number(parts.hour) * 60 + Number(parts.minute);
}

function serializeLiveActivity(task, note = '') {
  const payload = {
    task: task || 'Working',
    note: note || ''
  };
  return `${LIVE_ACTIVITY_PREFIX}${encodeURIComponent(JSON.stringify(payload))}`;
}

function parseLiveActivity(value, note = '') {
  const text = String(value || '');
  if (!text) return { task: 'Working', note: note || '' };
  if (!text.startsWith(LIVE_ACTIVITY_PREFIX)) return { task: text, note: note || '' };
  try {
    const payload = JSON.parse(decodeURIComponent(text.slice(LIVE_ACTIVITY_PREFIX.length)));
    return {
      task: payload.task || 'Working',
      note: payload.note || note || ''
    };
  } catch {
    return { task: text, note: note || '' };
  }
}

function formatDuration(seconds) {
  return `${Math.floor(seconds / 3600)}h ${pad(Math.floor(seconds % 3600 / 60))}m`;
}

function formatClock(date) {
  return new Date(date).toLocaleTimeString('en-US', { timeZone: BUSINESS_TIMEZONE, hour: 'numeric', minute: '2-digit' });
}

function secondsBetween(a, b) {
  return Math.max(0, Math.round((new Date(b) - new Date(a)) / 1000));
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text ?? '';
  return div.innerHTML;
}

function usesSupabase() {
  return !!supabaseClient && !!supabaseSession;
}

function profileToPerson(profile, index = 0) {
  if (!profile) return null;
  const start = profile.schedule_start ? profile.schedule_start.slice(0, 5) : null;
  const end = profile.schedule_end ? profile.schedule_end.slice(0, 5) : null;
  const scheduledStart = start ? Number(start.slice(0, 2)) * 60 + Number(start.slice(3, 5)) : null;
  const scheduledEnd = end ? Number(end.slice(0, 2)) * 60 + Number(end.slice(3, 5)) : null;
  return {
    id: profile.id,
    accessRole: profile.role,
    name: profile.full_name,
    email: profile.email,
    role: profile.job_role || (profile.role === 'admin' ? 'Administrator' : 'Employee'),
    department: profile.department || '',
    task: profile.project || profile.task || 'Not assigned',
    rate: profile.rate === null || profile.rate === undefined ? null : Number(profile.rate),
    rateType: profile.rate_type,
    scheduledStart,
    scheduledEnd,
    schedule: shiftLabel(scheduledStart, scheduledEnd),
    initials: initials(profile.full_name || profile.email),
    color: palette[index % palette.length],
    date: 'Today',
    clockIn: '—',
    clockOut: '—',
    worked: '0h 00m',
    status: 'complete'
  };
}

function accountFromProfile(profile) {
  return {
    id: profile.id,
    email: profile.email,
    name: profile.full_name,
    initials: initials(profile.full_name || profile.email),
    role: profile.role,
    jobRole: profile.job_role,
    department: profile.department
  };
}

function isAllowedAccessRole(role) {
  return role === 'admin' || role === 'employee';
}

function updateAccountChrome(account = currentAccount, profile = currentProfile) {
  if (!account) return;
  $('#accessChip').innerHTML = `<i></i> ${account.role === 'admin' ? 'Admin' : 'Employee'} access`;
  $('#profileInitials').textContent = account.initials;
  $('#profileName').textContent = account.name;
  $('#profileRole').textContent = account.role === 'admin'
    ? 'Administrator'
    : (profile?.job_role || account.jobRole || 'Employee workspace');
  $('#greeting').textContent = `Good morning, ${account.name.split(' ')[0]}.`;
}

function syncCurrentProfileFromLoadedProfiles() {
  if (!usesSupabase() || !currentAccount || !supabaseProfiles.length) return;
  const refreshed = supabaseProfiles.find(profile =>
    profile.id === (currentProfile?.id || supabaseSession?.user?.id) ||
    profile.email?.toLowerCase() === currentAccount.email?.toLowerCase()
  );
  if (!refreshed) return;
  if (!isAllowedAccessRole(refreshed.role)) {
    setTimeout(() => signOutForInactiveAccess(), 0);
    return;
  }
  currentProfile = refreshed;
  currentAccount = accountFromProfile(refreshed);
  document.body.classList.toggle('employee-mode', currentAccount.role === 'employee');
  document.body.classList.toggle('admin-mode', currentAccount.role === 'admin');
  updateAccountChrome(currentAccount, currentProfile);
}

function rosterSource() {
  if (!usesSupabase() || !supabaseProfiles.length) return employeeDirectory;
  const profilePeople = supabaseProfiles.map(profileToPerson).filter(Boolean);
  const merged = employeeDirectory.map(rosterEmployee => {
    const profileEmployee = profilePeople.find(person =>
      person.email?.toLowerCase() === rosterEmployee.email.toLowerCase() ||
      person.name?.toLowerCase() === rosterEmployee.name.toLowerCase()
    );
    if (!profileEmployee) return rosterEmployee;
    return {
      ...rosterEmployee,
      ...profileEmployee,
      email: profileEmployee.email || rosterEmployee.email,
      role: profileEmployee.role || rosterEmployee.role,
      department: profileEmployee.department || rosterEmployee.department,
      rate: profileEmployee.rate ?? rosterEmployee.rate,
      rateType: profileEmployee.rateType || rosterEmployee.rateType,
      scheduledStart: profileEmployee.scheduledStart ?? rosterEmployee.scheduledStart,
      scheduledEnd: profileEmployee.scheduledEnd ?? rosterEmployee.scheduledEnd,
      schedule: profileEmployee.scheduledStart === null ? rosterEmployee.schedule : profileEmployee.schedule
    };
  });
  const extras = profilePeople.filter(person => !merged.some(employee =>
    employee.email?.toLowerCase() === person.email?.toLowerCase() ||
    employee.name?.toLowerCase() === person.name?.toLowerCase()
  ));
  return [...merged, ...extras];
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

function persistOvertimeRequests() {
  localStorage.setItem('sync2time-overtime-requests', JSON.stringify(overtimeRequests));
}

function persistDocuments() {
  localStorage.setItem('minute-coaching-documents', JSON.stringify(coachingDocuments));
}

function persistProjects() {
  localStorage.setItem('sync2time-project-options', JSON.stringify(taskOptions));
}

function persistDeletedTimeAlerts() {
  localStorage.setItem('sync2time-deleted-time-alerts', JSON.stringify(deletedTimeAlerts));
}

function persistPayrollAdjustments() {
  localStorage.setItem('sync2time-payroll-adjustments', JSON.stringify(payrollAdjustments));
}

function persistPaystubRecipients() {
  localStorage.setItem('sync2time-paystub-recipients', JSON.stringify(paystubRecipients));
}

async function saveSupabaseProject(projectName) {
  if (!usesSupabase() || currentProfile?.role !== 'admin') throw new Error('Admin Supabase session required.');
  const position = taskOptions.length;
  const { error } = await supabaseClient.from('projects').upsert({
    name: projectName,
    is_active: true,
    sort_order: position,
    created_by: currentProfile.id,
    updated_at: new Date().toISOString()
  }, { onConflict: 'name' });
  if (error) throw error;
}

async function saveSupabaseSetting(settingKey, valueJson) {
  if (!usesSupabase() || currentProfile?.role !== 'admin') throw new Error('Admin Supabase session required.');
  const { error } = await supabaseClient.from('app_settings').upsert({
    setting_key: settingKey,
    value_json: valueJson,
    updated_by: currentProfile.id,
    updated_at: new Date().toISOString()
  }, { onConflict: 'setting_key' });
  if (error) throw error;
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

async function createSupabaseTimeEntry(task, start) {
  if (!usesSupabase() || !currentProfile?.id) return null;
  const { data, error } = await supabaseClient
    .from('time_entries')
    .insert({
      employee_id: currentProfile.id,
      task,
      clock_in: new Date(start).toISOString(),
      status: 'working'
    })
    .select('id')
    .single();
  if (error) {
    showToast(`Clock-in error: ${error.message}`);
    return null;
  }
  return data.id;
}

async function completeSupabaseTimeEntry(end) {
  if (!usesSupabase() || !currentProfile?.id || !state.running?.timeEntryId) return;
  const { error } = await supabaseClient
    .from('time_entries')
    .update({
      clock_out: new Date(end).toISOString(),
      status: 'completed'
    })
    .eq('id', state.running.timeEntryId)
    .eq('employee_id', currentProfile.id);
  if (error) showToast(`Clock-out error: ${error.message}`);
}

async function updateSupabaseRunningTask(task) {
  if (!usesSupabase() || !currentProfile?.id || !state.running?.timeEntryId) return;
  const { error } = await supabaseClient
    .from('time_entries')
    .update({ task })
    .eq('id', state.running.timeEntryId)
    .eq('employee_id', currentProfile.id)
    .eq('status', 'working');
  if (error) console.error('Task update error:', error.message);
}

function readLivePresence() {
  if (usesSupabase()) return supabaseLivePresence;
  const records = JSON.parse(localStorage.getItem(LIVE_PRESENCE_KEY) || '[]');
  const cutoff = Date.now() - 120000;
  const fresh = records.filter(record => record.status === 'working' && record.lastSeen >= cutoff);
  if (fresh.length !== records.length) localStorage.setItem(LIVE_PRESENCE_KEY, JSON.stringify(fresh));
  return fresh;
}

function writeLivePresence(record) {
  if (usesSupabase()) {
    supabaseClient.from('live_presence').upsert({
      employee_id: currentProfile.id,
      task: serializeLiveActivity(record.task, record.note),
      clock_in: new Date(record.clockInAt).toISOString(),
      last_seen: new Date(record.lastSeen).toISOString()
    }).then(({ error }) => {
      if (error) showToast(`Live sync error: ${error.message}`);
      else loadSupabaseLivePresence().then(() => {
        renderLiveTeam();
        renderScheduleWatch();
      });
    });
    return;
  }
  const records = readLivePresence().filter(item => item.email !== record.email);
  records.push(record);
  localStorage.setItem(LIVE_PRESENCE_KEY, JSON.stringify(records));
}

function removeLivePresence(email = currentAccount?.email) {
  if (!email) return;
  if (usesSupabase() && currentProfile?.id) {
    supabaseClient.from('live_presence').delete().eq('employee_id', currentProfile.id).then(({ error }) => {
      if (error) showToast(`Live sync error: ${error.message}`);
      else loadSupabaseLivePresence().then(() => {
        renderLiveTeam();
        renderScheduleWatch();
      });
    });
    return;
  }
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
      note: state.running.note || '',
      clockInAt: state.running.start,
      lastSeen: Date.now(),
      status: 'working'
    });
}

function liveEmployees() {
  return readLivePresence().map((record, index) => {
    const roster = rosterSource().find(person => person.email === record.email || person.name === record.name);
    const seconds = secondsBetween(record.clockInAt, Date.now());
    const activity = parseLiveActivity(record.task, record.note);
    return {
      ...(roster || {}),
      name: record.name,
      email: record.email,
      role: record.role || roster?.role || 'Employee',
      department: record.department || roster?.department || 'Employee',
      task: activity.task || 'Working',
      note: activity.note || '',
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

function supabaseProfileFromLive(record) {
  return record.profiles || record.profile || supabaseProfiles.find(profile => profile.id === record.employee_id) || {};
}

function liveRecordFromSupabase(record) {
  const profile = supabaseProfileFromLive(record);
  const activity = parseLiveActivity(record.task);
  return {
    email: profile.email || record.employee_id,
    employeeId: record.employee_id,
    name: profile.full_name || 'Employee',
    role: profile.job_role || 'Employee',
    department: profile.department || '',
    task: activity.task || 'Working',
    note: activity.note || '',
    clockInAt: record.clock_in,
    lastSeen: new Date(record.last_seen || Date.now()).getTime(),
    status: 'working'
  };
}

function attendanceRecordFromSupabase(entry, index) {
  const profile = entry.profiles || supabaseProfiles.find(item => item.id === entry.employee_id) || {};
  const roster = rosterSource().find(person => person.email === profile.email || person.name === profile.full_name);
  const clockIn = entry.clock_in ? new Date(entry.clock_in) : null;
  const clockOut = entry.clock_out ? new Date(entry.clock_out) : null;
  const seconds = clockIn ? secondsBetween(clockIn, clockOut || Date.now()) : 0;
  const name = profile.full_name || roster?.name || 'Employee';
  return {
    ...(roster || {}),
    id: entry.id,
    employeeId: entry.employee_id,
    name,
    email: profile.email || roster?.email || entry.employee_id,
    role: profile.job_role || roster?.role || 'Employee',
    department: profile.department || roster?.department || '',
    task: entry.task || roster?.task || 'Tracked time',
    initials: roster?.initials || initials(name),
    color: roster?.color || palette[index % palette.length],
    date: clockIn ? businessDateLabel(clockIn, { month: 'short', day: 'numeric' }) : 'Today',
    dateKey: clockIn ? isoDate(clockIn) : '',
    clockIn: clockIn ? formatClock(clockIn) : '—',
    clockOut: clockOut ? formatClock(clockOut) : '—',
    worked: formatDuration(seconds),
    status: entry.status === 'working' || !entry.clock_out ? 'clocked' : 'complete',
    liveSeconds: entry.status === 'working' || !entry.clock_out ? seconds : undefined
  };
}

async function loadSupabaseProfiles() {
  if (!usesSupabase()) return;
  const { data, error } = await supabaseClient.from('profiles').select('*').order('full_name');
  if (error) {
    showToast(`Supabase profiles error: ${error.message}`);
    return;
  }
  supabaseProfiles = data || [];
  syncCurrentProfileFromLoadedProfiles();
}

async function loadSupabaseLivePresence() {
  if (!usesSupabase()) return;
  const { data, error } = await supabaseClient
    .from('live_presence')
    .select('employee_id, task, clock_in, last_seen, profiles:employee_id(email, full_name, job_role, department, rate, rate_type, schedule_start, schedule_end)')
    .order('last_seen', { ascending: false });
  if (error) {
    showToast(`Supabase live error: ${error.message}`);
    return;
  }
  const cutoff = Date.now() - 120000;
  supabaseLivePresence = (data || []).map(liveRecordFromSupabase).filter(record => record.lastSeen >= cutoff);
}

async function loadSupabaseTimeEntries() {
  if (!usesSupabase()) return;
  const since = new Date();
  since.setMonth(since.getMonth() - 13);
  since.setHours(0, 0, 0, 0);
  const { data, error } = await supabaseClient
    .from('time_entries')
    .select('id, employee_id, task, clock_in, clock_out, status, profiles:employee_id(email, full_name, job_role, department, rate, rate_type, schedule_start, schedule_end)')
    .gte('clock_in', since.toISOString())
    .order('clock_in', { ascending: false });
  if (error) {
    showToast(`Attendance sync error: ${error.message}`);
    return;
  }
  supabaseDeletedTimeEntries = (data || []).filter(entry => entry.status === 'deleted');
  supabaseTimeEntries = (data || []).filter(entry => entry.status !== 'deleted');
}

async function loadPayrollAdjustments() {
  if (!usesSupabase()) return;
  const { data, error } = await supabaseClient
    .from('payroll_adjustments')
    .select('*')
    .order('updated_at', { ascending: false });
  if (!error) payrollAdjustments = data || [];
}

async function loadSupabaseProjects() {
  if (!usesSupabase()) return;
  const { data, error } = await supabaseClient
    .from('projects')
    .select('name, is_active, sort_order')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });
  if (error) {
    showToast(`Project sync error: ${error.message}`);
    return;
  }
  taskOptions = (data || []).map(item => item.name).filter(Boolean);
  if (!taskOptions.length) taskOptions = [...DEFAULT_TASK_OPTIONS];
  if (selectedProject !== 'All' && !taskOptions.includes(selectedProject)) selectedProject = 'All';
}

async function loadSupabaseSettings() {
  if (!usesSupabase()) return;
  const { data, error } = await supabaseClient
    .from('app_settings')
    .select('setting_key, value_json');
  if (error) {
    showToast(`Settings sync error: ${error.message}`);
    return;
  }
  sharedSettings = {};
  (data || []).forEach(item => {
    sharedSettings[item.setting_key] = item.value_json || {};
  });
  const manualRate = Number(sharedSettings.payroll_usd_php_override?.rate);
  manualPayrollFxOverride = manualRate > 0 ? manualRate : null;
  if (manualPayrollFxOverride) localStorage.setItem('sync2time-payroll-usd-php', String(manualPayrollFxOverride));
  else localStorage.removeItem('sync2time-payroll-usd-php');
}

async function loadPaystubRecipients() {
  if (!usesSupabase()) return;
  const { data, error } = await supabaseClient
    .from('paystub_recipients')
    .select('employee_id, recipient_email');
  if (!error) {
    paystubRecipients = data || [];
    persistPaystubRecipients();
  }
}

async function loadSupabaseRequests() {
  if (!usesSupabase()) return;
  const leave = await supabaseClient
    .from('leave_requests')
    .select('id, employee_id, leave_date, reason, status, created_at, profiles:employee_id(email, full_name)')
    .order('created_at', { ascending: false });
  if (!leave.error) {
    leaveRequests = (leave.data || []).map(row => ({
      id: row.id,
      employeeId: row.employee_id,
      employeeName: row.profiles?.full_name || 'Employee',
      employeeEmail: row.profiles?.email || row.employee_id,
      date: row.leave_date,
      reason: row.reason || '',
      status: row.status,
      createdAt: row.created_at
    }));
  }

  const edits = await supabaseClient
    .from('time_edit_requests')
    .select('id, employee_id, requested_date, requested_clock_in, requested_clock_out, reason, status, created_at, profiles:employee_id(email, full_name)')
    .order('created_at', { ascending: false });
  if (!edits.error) {
    timeEditRequests = (edits.data || []).map(row => ({
      id: row.id,
      employeeId: row.employee_id,
      employeeName: row.profiles?.full_name || 'Employee',
      employeeEmail: row.profiles?.email || row.employee_id,
      date: row.requested_date,
      clockIn: row.requested_clock_in?.slice(0, 5) || '',
      clockOut: row.requested_clock_out?.slice(0, 5) || '',
      reason: row.reason || '',
      status: row.status,
      createdAt: row.created_at
    }));
  }

  const overtime = await supabaseClient
    .from('overtime_requests')
    .select('id, employee_id, overtime_date, hours, reason, status, created_at, profiles:employee_id(email, full_name)')
    .order('created_at', { ascending: false });
  if (!overtime.error) {
    overtimeRequests = (overtime.data || []).map(row => ({
      id: row.id,
      employeeId: row.employee_id,
      employeeName: row.profiles?.full_name || 'Employee',
      employeeEmail: row.profiles?.email || row.employee_id,
      date: row.overtime_date,
      hours: Number(row.hours) || 0,
      reason: row.reason || '',
      status: row.status,
      createdAt: row.created_at
    }));
  }
}

async function applyApprovedTimeEdit(request, silent = false) {
  if (!usesSupabase() || !request?.employeeId) return { ok: false, message: 'The request is missing its employee ID.' };
  const start = businessDateTime(request.date, request.clockIn);
  const end = businessDateTime(request.date, request.clockOut);
  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end <= start) {
    return { ok: false, message: 'The requested clock-out must be after clock-in.' };
  }
  const existing = supabaseTimeEntries.find(entry =>
    entry.employee_id === request.employeeId &&
    entry.clock_in &&
    isoDate(new Date(entry.clock_in)) === request.date
  );
  let result;
  if (existing) {
    result = await supabaseClient.from('time_entries').update({
      clock_in: start.toISOString(),
      clock_out: end.toISOString(),
      status: 'completed'
    }).eq('id', existing.id);
  } else {
    result = await supabaseClient.from('time_entries').insert({
      employee_id: request.employeeId,
      task: 'Approved time correction',
      clock_in: start.toISOString(),
      clock_out: end.toISOString(),
      status: 'completed'
    });
  }
  if (result.error) return { ok: false, message: result.error.message };
  await loadSupabaseTimeEntries();
  if (!silent) showToast('Approved time was applied to the employee log.');
  return { ok: true };
}

async function repairApprovedTimeEdits() {
  if (!usesSupabase() || currentProfile?.role !== 'admin' || approvedTimeEditRepairAttempted) return;
  approvedTimeEditRepairAttempted = true;
  const approved = timeEditRequests.filter(request => request.status === 'approved' && request.employeeId);
  for (const request of approved) {
    const existing = supabaseTimeEntries.find(entry =>
      entry.employee_id === request.employeeId &&
      entry.clock_in &&
      isoDate(new Date(entry.clock_in)) === request.date
    );
    const requestedStart = businessDateTime(request.date, request.clockIn).getTime();
    const requestedEnd = businessDateTime(request.date, request.clockOut).getTime();
    const alreadyApplied = existing &&
      Math.abs(new Date(existing.clock_in).getTime() - requestedStart) < 60000 &&
      Math.abs(new Date(existing.clock_out).getTime() - requestedEnd) < 60000;
    if (!alreadyApplied) await applyApprovedTimeEdit(request, true);
  }
}

async function loadSupabaseDocuments() {
  if (!usesSupabase()) return;
  const { data, error } = await supabaseClient
    .from('coaching_documents')
    .select('id, employee_id, file_name, file_path, uploaded_at, profiles:employee_id(email, full_name)')
    .order('uploaded_at', { ascending: false });
  if (error) return;
  coachingDocuments = (data || []).map(row => ({
    id: row.id,
    employeeName: row.profiles?.full_name || 'Employee',
    employeeEmail: row.profiles?.email || row.employee_id,
    name: row.file_name,
    path: row.file_path,
    size: 'Stored in Supabase',
    uploadedAt: businessDateLabel(row.uploaded_at)
  }));
}

async function loadSupabaseNotifications() {
  if (!usesSupabase() || !currentProfile?.id) return;
  const { data, error } = await supabaseClient
    .from('app_notifications')
    .select('id, employee_id, type, title, message, meta, created_at, read_at')
    .eq('employee_id', currentProfile.id)
    .eq('type', 'deleted_time')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Deleted-time notification load failed:', error.message);
    return false;
  }
  deletedTimeAlerts = (data || []).map(row => ({
    id: row.id,
    employeeId: row.employee_id,
    title: row.title,
    message: row.message,
    meta: row.meta || {},
    createdAt: row.created_at,
    readAt: row.read_at
  }));
  return true;
}

async function repairMissingDeletedTimeNotifications() {
  if (!usesSupabase() || currentProfile?.role !== 'admin' || deletedNoticeRepairAttempted || !supabaseDeletedTimeEntries.length) return;
  deletedNoticeRepairAttempted = true;
  const existing = await supabaseClient.from('app_notifications').select('employee_id, meta').eq('type', 'deleted_time');
  if (existing.error) {
    console.error('Deleted-time notification repair check failed:', existing.error.message);
    return;
  }
  const notifiedEmployees = new Set((existing.data || []).map(item => item.employee_id));
  const missing = supabaseDeletedTimeEntries.filter(entry => !notifiedEmployees.has(entry.employee_id));
  if (!missing.length) return;
  const notices = missing.map(entry => {
    const clockIn = entry.clock_in ? new Date(entry.clock_in) : null;
    const clockOut = entry.clock_out ? new Date(entry.clock_out) : null;
    const employeeName = entry.profiles?.full_name || 'Employee';
    const timeLabel = `${clockIn ? formatClock(clockIn) : 'Unknown'}–${clockOut ? formatClock(clockOut) : 'Unknown'}`;
    return {
      employee_id: entry.employee_id,
      type: 'deleted_time',
      title: 'A time entry was deleted',
      message: `${employeeName}'s time entry (${timeLabel}) was deleted by admin. Reason: Recovered missing deletion notice.`,
      meta: { timeEntryId: entry.id, timeLabel, reason: 'Recovered missing deletion notice' }
    };
  });
  const result = await supabaseClient.from('app_notifications').insert(notices);
  if (result.error) console.error('Deleted-time notification repair failed:', result.error.message);
}

async function refreshSupabaseData() {
  if (!usesSupabase()) return;
  await loadSupabaseProjects();
  await loadSupabaseSettings();
  await loadSupabaseProfiles();
  await loadSupabaseLivePresence();
  await loadSupabaseTimeEntries();
  await loadPayrollAdjustments();
  await loadPaystubRecipients();
  await loadSupabaseRequests();
  await repairApprovedTimeEdits();
  await loadSupabaseDocuments();
  await loadSupabaseNotifications();
  await repairMissingDeletedTimeNotifications();
  renderManagedEmployees();
  renderTeamDirectory();
  renderLiveTeam();
  renderAttendance();
  renderScheduleWatch();
  renderApprovals();
  renderEmployeeRequests();
  renderDocuments();
  renderDeletedTimeAlerts();
  renderReports();
  renderPayroll();
  renderEmployeeHoursReport();
}

function subscribeSupabaseRealtime() {
  if (!supabaseClient) return;
  supabaseClient
    .channel('sync2time-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, async () => {
      await loadSupabaseProjects();
      renderProjectOptions();
      renderProjects();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'app_settings' }, async () => {
      await loadSupabaseSettings();
      renderPayroll();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, async () => {
      await loadSupabaseProfiles();
      renderManagedEmployees();
      renderTeamDirectory();
      renderLiveTeam();
      renderAttendance();
      renderScheduleWatch();
      renderProjects();
      renderReports();
      renderPayroll();
      renderEmployeeRequests();
      render();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'paystub_recipients' }, async () => {
      await loadPaystubRecipients();
      renderPayroll();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'live_presence' }, async () => {
      await loadSupabaseLivePresence();
      renderLiveTeam();
      renderAttendance();
      renderScheduleWatch();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'time_entries' }, async () => {
      await loadSupabaseTimeEntries();
      await loadSupabaseLivePresence();
      reconcileAdminClockOut();
      hydrateEmployeeStateFromSupabase();
      renderLiveTeam();
      renderAttendance();
      renderScheduleWatch();
      renderTeamDirectory();
      renderReports();
      render();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'payroll_adjustments' }, async () => {
      await loadPayrollAdjustments();
      renderReports();
      renderEmployeePayrollAdjustments();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'leave_requests' }, async () => {
      await loadSupabaseRequests();
      renderApprovals();
      renderEmployeeRequests();
      renderLeaveCalendar();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'time_edit_requests' }, async () => {
      await loadSupabaseRequests();
      renderApprovals();
      renderEmployeeRequests();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'overtime_requests' }, async () => {
      await loadSupabaseRequests();
      renderApprovals();
      renderEmployeeRequests();
      renderPayroll();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'coaching_documents' }, async () => {
      await loadSupabaseDocuments();
      renderDocuments();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'app_notifications' }, async () => {
      await loadSupabaseNotifications();
      renderDeletedTimeAlerts();
    })
    .subscribe();
}

function totalSeconds() {
  return state.entries.reduce((sum, entry) => sum + entry.seconds, 0) + (state.running ? secondsBetween(state.running.start, Date.now()) : 0);
}

function hydrateEmployeeStateFromSupabase(account = currentAccount) {
  if (!usesSupabase() || account?.role !== 'employee' || !currentProfile?.id) return;
  const todayKey = isoDate(new Date());
  const ownEntries = supabaseTimeEntries.filter(entry =>
    entry.employee_id === currentProfile.id &&
    entry.clock_in &&
    isoDate(new Date(entry.clock_in)) === todayKey
  );
  const completed = ownEntries.filter(entry => entry.clock_out && entry.status !== 'working');
  const active = ownEntries.find(entry => !entry.clock_out || entry.status === 'working');
  const liveRecord = supabaseLivePresence.find(record => record.employeeId === currentProfile.id || record.email === account?.email);
  state.entries = completed.map(entry => ({
    task: entry.task || 'Tracked time',
    seconds: secondsBetween(entry.clock_in, entry.clock_out),
    start: new Date(entry.clock_in).getTime(),
    end: new Date(entry.clock_out).getTime(),
    remote: true
  }));
  if (active) {
    state.running = {
      task: active.task || 'Tracked time',
      note: liveRecord?.note || '',
      start: new Date(active.clock_in).getTime(),
      timeEntryId: active.id,
      nextLongSessionCheckAt: new Date(active.clock_in).getTime() + LONG_SESSION_SECONDS * 1000
    };
  } else {
    state.running = null;
  }
  const starts = ownEntries.map(entry => new Date(entry.clock_in).getTime()).filter(Number.isFinite);
  const ends = completed.map(entry => new Date(entry.clock_out).getTime()).filter(Number.isFinite);
  state.clockIn = starts.length ? Math.min(...starts) : null;
  state.clockOut = active ? null : (ends.length ? Math.max(...ends) : null);
  save();
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

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ''));
}

function minutesToTimeInput(minutes) {
  if (!Number.isFinite(minutes)) return '';
  const normalized = ((minutes % 1440) + 1440) % 1440;
  const hour = Math.floor(normalized / 60).toString().padStart(2, '0');
  const minute = Math.floor(normalized % 60).toString().padStart(2, '0');
  return `${hour}:${minute}`;
}

function timeInputToMinutes(value) {
  if (!value) return null;
  const [hour, minute] = String(value).split(':').map(Number);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;
  return hour * 60 + minute;
}

function minutesToSupabaseTime(minutes) {
  const value = minutesToTimeInput(minutes);
  return value ? `${value}:00` : null;
}

function parseEmployeeRate(value) {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(String(value).replace(/,/g, '').trim());
  return Number.isFinite(parsed) ? parsed : null;
}

function editableEmployeeRecords() {
  const byEmail = new Map();
  rosterSource().forEach(person => {
    const key = String(person.email || person.name).toLowerCase();
    const recipient = paystubRecipients.find(item => item.employee_id === person.id);
    byEmail.set(key, {
      id: person.id,
      name: person.name,
      email: person.email,
      jobRole: person.role,
      department: person.department || '',
      task: person.task || taskOptions[0],
      initials: person.initials,
      tempPassword: '',
      rate: typeof person.rate === 'number' ? person.rate : null,
      rateType: person.rateType || '',
      scheduledStart: Number.isFinite(person.scheduledStart) ? person.scheduledStart : null,
      scheduledEnd: Number.isFinite(person.scheduledEnd) ? person.scheduledEnd : null,
      paystubEmail: recipient?.recipient_email || person.email
    });
  });
  managedEmployees.forEach(employee => {
    if (usesSupabase() && ![...byEmail.values()].some(item =>
      item.email?.toLowerCase() === employee.email?.toLowerCase() ||
      item.name?.toLowerCase() === employee.name?.toLowerCase()
    )) return;
    const key = String(employee.email || employee.name).toLowerCase();
    const existing = byEmail.get(key) || {};
    byEmail.set(key, {
      ...existing,
      ...employee,
      id: isUuid(employee.id) ? employee.id : (existing.id || employee.id),
      rate: employee.rate ?? existing.rate ?? null,
      rateType: employee.rateType || existing.rateType || '',
      scheduledStart: employee.scheduledStart ?? existing.scheduledStart ?? null,
      scheduledEnd: employee.scheduledEnd ?? existing.scheduledEnd ?? null,
      paystubEmail: employee.paystubEmail || existing.paystubEmail || employee.email
    });
  });
  return [...byEmail.values()].sort((left, right) => left.name.localeCompare(right.name));
}

async function upsertSupabaseEmployee(record) {
  if (!supabaseClient || currentProfile?.role !== 'admin') return { ok: false, error: 'Admin Supabase session required.' };
  const payload = {
    employeeId: isUuid(record.id) ? record.id : null,
    fullName: record.name,
    email: record.email,
    jobRole: record.jobRole,
    department: record.department || '',
    project: record.task || '',
    rate: record.rate,
    rateType: record.rateType || '',
    scheduleStart: minutesToSupabaseTime(record.scheduledStart),
    scheduleEnd: minutesToSupabaseTime(record.scheduledEnd),
    password: record.newPassword || '',
    paystubEmail: record.paystubEmail || record.email
  };
  const { data, error } = await supabaseClient.functions.invoke('admin-save-employee', { body: payload });
  if (error || !data?.ok) return { ok: false, error: error?.message || data?.error || 'Unable to save employee to Supabase.' };
  return { ok: true, ...data };
}

async function buildEmployeeAccess(person) {
  return {
    id: `emp-${slug(person.email)}`,
    rosterId: person.id,
    name: person.name,
    email: person.email,
    jobRole: person.role,
    department: person.department,
    task: person.task,
    initials: person.initials,
    tempPassword: person.tempPassword,
    hash: await hashPassword(person.tempPassword),
    rate: typeof person.rate === 'number' ? person.rate : null,
    rateType: person.rateType || '',
    scheduledStart: Number.isFinite(person.scheduledStart) ? person.scheduledStart : null,
    scheduledEnd: Number.isFinite(person.scheduledEnd) ? person.scheduledEnd : null,
    paystubEmail: person.email
  };
}

async function seedRosterAccess(force = false) {
  if (usesSupabase() && currentProfile?.role === 'admin') {
    let created = 0;
    for (const person of employeeDirectory) {
      const existingProfile = supabaseProfiles.find(profile =>
        profile.email?.toLowerCase() === person.email.toLowerCase() ||
        profile.full_name?.toLowerCase() === person.name.toLowerCase()
      );
      const existingAccess = managedEmployees.find(employee => employee.email === person.email || employee.name === person.name);
      const access = await buildEmployeeAccess(person);
      const result = await upsertSupabaseEmployee({
        ...access,
        id: existingProfile?.id || existingAccess?.id || access.id,
        newPassword: existingProfile && !force ? '' : access.tempPassword,
        paystubEmail: existingAccess?.paystubEmail || person.email
      });
      if (!result.ok) continue;
      if (!existingProfile) created++;
      const stored = { ...(existingAccess || {}), ...access, id: result.employeeId || existingAccess?.id || access.id };
      if (existingAccess) managedEmployees = managedEmployees.map(employee => employee.id === existingAccess.id ? stored : employee);
      else managedEmployees.push(stored);
    }
    persistEmployees();
    await refreshSupabaseData();
    renderManagedEmployees();
    renderTeamDirectory();
    return created;
  }
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
  return rosterSource().find(person => person.email === account?.email || person.name === account?.name);
}

function allRosterWithExtras() {
  const base = rosterSource();
  if (usesSupabase()) return base;
  const extras = managedEmployees.filter(employee => !base.some(person => person.email === employee.email)).map((employee, index) => ({
    name: employee.name,
    email: employee.email,
    role: employee.jobRole,
    department: employee.department || 'Added by admin',
    task: employee.task || 'Not assigned',
    rate: employee.rate ?? null,
    rateType: employee.rateType || '',
    scheduledStart: employee.scheduledStart ?? null,
    scheduledEnd: employee.scheduledEnd ?? null,
    schedule: shiftLabel(employee.scheduledStart ?? null, employee.scheduledEnd ?? null),
    initials: employee.initials,
    color: palette[index % palette.length],
    clockIn: '—',
    clockOut: '—',
    worked: '0h 00m',
    status: 'complete'
  }));
  return [...base, ...extras];
}

function render() {
  todayDate = new Date();
  $('#todayLabel').textContent = businessDateLabel(todayDate, { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase();
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
  const taskNoteInput = $('#taskNoteInput');
  if (taskNoteInput && document.activeElement !== taskNoteInput) taskNoteInput.value = running?.note || taskNoteInput.value || '';

  const entries = $('#entries');
  const all = [
    ...(running ? [{ task: running.task, seconds: runningSeconds, live: true, note: running.note || '' }] : []),
    ...(state.lunch ? [{ task: 'Lunch break', seconds: secondsBetween(state.lunch.start, Date.now()), live: true, lunch: true }] : []),
    ...state.entries
  ];
  entries.innerHTML = all.map((entry, index) => `<div class="entry dashboard-clickable" tabindex="0" role="button" data-entry-index="${index}"><div class="entry-title"><span class="project-dot ${entry.lunch ? 'blue' : entry.live ? 'coral' : 'blue'}"></span><div>${escapeHtml(entry.task)}<small>${entry.note ? escapeHtml(entry.note) : entry.live ? 'Currently active' : 'Tracked time'}</small></div></div><span class="entry-time">${formatDuration(entry.seconds)}</span><button class="delete-entry" title="Employee cannot edit time" hidden>×</button></div>`).join('');
  $('#emptyState').hidden = all.length > 0;

  const daily = [2.8, 4.1, Math.min(7.5, total / 3600), 3.4, 2.2, .3, 0];
  $('#bars').innerHTML = daily.map((value, index) => `<div class="bar ${index === 2 ? 'today' : ''}" data-day="${['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][index]}" style="height:${Math.max(4, value / 8 * 112)}px"></div>`).join('');
  renderAttendance();
  renderLiveTeam();
  renderScheduleWatch();
  renderReports();
  renderPayroll();
  renderEmployeeRequests();
  renderDeletedTimeAlerts();
  renderEmployeePayrollAdjustments();
  checkLongSession();
}

function renderAttendance() {
  const term = $('#employeeSearch').value.toLowerCase();
  const filter = $('#statusFilter').value;
  const dateFilter = $('#dateFilter').value;
  const live = liveEmployees();
  const liveEmails = new Set(live.map(person => person.email));
  const todayKey = isoDate(new Date());
  const entries = usesSupabase() ? supabaseTimeEntries.map(attendanceRecordFromSupabase) : [];
  const entryEmails = new Set(entries.map(person => person.email));
  const source = usesSupabase()
    ? [...live.filter(person => !entryEmails.has(person.email)), ...entries]
    : filter === 'clocked' ? live : [...live, ...rosterSource().filter(person => !liveEmails.has(person.email))];
  const rows = source.filter(person => {
    const searchable = `${person.name} ${person.role} ${person.task || ''}`.toLowerCase();
    const inDateRange = !usesSupabase() || dateFilter === 'week' || !person.dateKey || person.dateKey === todayKey;
    return (!term || searchable.includes(term)) && inDateRange && (filter === 'all' || person.status === filter);
  });
  $('#attendanceRows').innerHTML = rows.map(person => {
    const deleteButton = person.id && person.status !== 'clocked' ? `<button class="delete-time-btn" data-delete-time="${person.id}" data-employee-id="${person.employeeId || ''}" data-employee-name="${encodeURIComponent(person.name)}" data-time-label="${encodeURIComponent(`${person.date} ${person.clockIn}-${person.clockOut}`)}">Delete</button>` : '<span>—</span>';
    return `<div class="attendance-row" data-employee="${encodeURIComponent(person.name)}"><div class="person"><span class="person-avatar" style="background:${person.color}">${person.initials}</span><span>${person.name}<small>${person.role}</small></span></div><span class="attendance-date">${person.date}</span><span class="attendance-time">${person.clockIn}</span><span class="attendance-time">${person.clockOut}</span><span class="attendance-time">${person.worked}</span><span class="status ${person.status === 'clocked' ? 'live' : 'complete'}">${person.status === 'clocked' ? 'Clocked in' : 'Complete'}</span>${deleteButton}</div>`;
  }).join('') || '<div class="empty-state">No employees match these filters.</div>';
  $('#reportCount').textContent = `${rows.length} employee record${rows.length === 1 ? '' : 's'}`;
  $('#clockedInCount').textContent = live.length;
}
function renderLiveTeam() {
  const online = liveEmployees();
  $('#liveEmployeeCount').textContent = online.length;
  $('#liveTeamRows').innerHTML = online.map((person, index) => `<div class="live-team-row" role="button" tabindex="0" data-employee="${encodeURIComponent(person.name)}"><div class="person"><span class="person-avatar" style="background:${person.color}">${person.initials}</span><span>${person.name}<small>${person.role}</small></span></div><span class="task-cell"><i class="project-dot ${index % 2 ? 'blue' : 'coral'}"></i><span>${escapeHtml(person.task)}${person.note ? `<small>${escapeHtml(person.note)}</small>` : ''}</span></span><span class="live-clock">${person.clockIn}</span><span class="live-clock">${person.worked}</span><span class="status active">Working</span></div>`).join('') || '<div class="empty-state">No employees are clocked in right now.</div>';
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
  return businessDateKey(date);
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
  if (person.task && taskOptions.includes(person.task)) return person.task;
  if (person.role.includes('Webinar')) return 'Webinar';
  if (person.role.includes('SMM')) return 'SMM';
  if (person.role.includes('Admin')) return 'Admin';
  return ['Coaching', 'Meeting', 'On Class'][index % 3];
}

function renderProjectOptions() {
  $('#projectOptions').innerHTML = [`<button class="project-option ${selectedProject === 'All' ? 'active' : ''}" data-project="All"><i></i>All work</button>`, ...taskOptions.map(project => `<button class="project-option ${selectedProject === project ? 'active' : ''}" data-project="${escapeHtml(project)}"><i></i>${escapeHtml(project)}</button>`)].join('');
  const select = $('#employeeProject');
  if (select) select.innerHTML = taskOptions.map(project => `<option value="${escapeHtml(project)}">${escapeHtml(project)}</option>`).join('');
  const taskSelect = $('#taskInput');
  if (taskSelect) {
    const selected = taskSelect.value || state.running?.task || '';
    taskSelect.innerHTML = taskOptions.map(project => `<option value="${escapeHtml(project)}">${escapeHtml(project)}</option>`).join('');
    taskSelect.value = taskOptions.includes(selected) ? selected : (state.running?.task && !taskOptions.includes(state.running.task) ? taskOptions[0] : (selected || taskOptions[0]));
  }
}

function renderProjects() {
  renderProjectOptions();
  const rows = rosterSource().map((person, index) => ({ person, project: projectFor(person, index) })).filter(item => selectedProject === 'All' || item.project === selectedProject);
  $('#projectRows').innerHTML = rows.map(({ person, project }) => `<div class="project-row" role="button" tabindex="0" data-employee="${encodeURIComponent(person.name)}"><div class="person"><span class="person-avatar" style="background:${person.color}">${person.initials}</span><span>${person.name}<small>${person.role}</small></span></div><span class="project-tag">${project}</span><span>${person.task}</span><span class="schedule-shift">${person.schedule}</span><span class="status ${person.status === 'clocked' ? 'active' : 'complete'}">${person.status === 'clocked' ? '● Working' : 'Complete'}</span></div>`).join('') || '<div class="empty-state">No employees in this project category.</div>';
  $('#projectCount').textContent = `${rows.length} assignment${rows.length === 1 ? '' : 's'}`;
}

function renderManagedEmployees() {
  const select = $('#manageEmployeeSelect');
  const selected = select.value;
  const options = editableEmployeeRecords();
  select.innerHTML = '<option value="">Select employee</option>' + options.map(employee => `<option value="${employee.id}">${escapeHtml(employee.name)} — ${escapeHtml(employee.email)}</option>`).join('');
  select.value = options.some(employee => employee.id === selected) ? selected : '';
  $('#teamCount').textContent = rosterSource().length;
}

function renderTeamDirectory() {
  const roster = allRosterWithExtras();
  $('#teamRows').innerHTML = roster.map(person => {
    const access = managedEmployees.find(employee => employee.email === person.email || employee.name === person.name);
    const profile = usesSupabase() && person.id ? supabaseProfiles.find(item => item.id === person.id) : null;
    const isOffboarded = profile?.role && !isAllowedAccessRole(profile.role);
    const hasSupabaseAccess = !!(profile && !isOffboarded);
    const live = readLivePresence().some(record => record.employeeId === person.id || record.email === person.email);
    const editAction = `<button class="edit-employee-btn" data-edit-employee="${person.id || ''}" data-edit-email="${encodeURIComponent(person.email || '')}" data-edit-name="${encodeURIComponent(person.name)}">Edit</button>`;
    const offboardAction = `<button class="offboard-employee-btn" data-offboard-employee="${person.id || ''}" data-offboard-email="${encodeURIComponent(person.email || '')}" data-offboard-name="${encodeURIComponent(person.name)}">${isOffboarded ? 'Offboarded' : 'Offboard'}</button>`;
    const passwordLine = access?.tempPassword ? `<small>${access.email} · Pass: ${access.tempPassword}</small>` : `<small>${person.department || 'Employee'}</small>`;
    const clockOutAction = live ? `<button class="admin-clockout-btn" data-admin-clockout="${person.id || ''}" data-clockout-email="${encodeURIComponent(person.email || '')}" data-clockout-name="${encodeURIComponent(person.name)}">Clock out</button>` : '<button class="admin-clockout-btn" disabled>Not working</button>';
    const clearAction = `<button class="clear-time-btn" data-clear-employee-time="${person.id || ''}" data-clear-time-email="${encodeURIComponent(person.email || '')}" data-clear-time-name="${encodeURIComponent(person.name)}">Clear dry-run time</button>`;
    const action = `<span class="team-actions">${editAction}${offboardAction}${clockOutAction}${clearAction}</span>`;
    const accessActive = !!(access || hasSupabaseAccess);
    const accessLabel = isOffboarded ? 'Offboarded' : accessActive ? 'Access active' : 'No access';
    const accessClass = isOffboarded ? 'pending' : accessActive ? '' : 'pending';
    return `<div class="team-row" role="button" tabindex="0" data-employee="${encodeURIComponent(person.name)}"><div class="person"><span class="person-avatar" style="background:${person.color}">${person.initials}</span><span>${person.name}${passwordLine}</span></div><span>${person.role}<small>${person.department || ''}</small></span><span class="schedule-shift">${person.schedule || 'Not assigned'}</span><span class="schedule-shift">${typeof person.rate === 'number' ? rateLabel(person) : person.rate || 'Pending'}</span><span class="access-state ${accessClass}">${accessLabel}</span><span>${action}</span></div>`;
  }).join('');
  $('#teamDirectoryCount').textContent = `${roster.length} employee${roster.length === 1 ? '' : 's'}`;
}

function renderHolidayPay() {
  const holiday = holidayForDate(todayDate);
  const regular = holiday?.type === 'regular';
  $('#holidayMultiplier').textContent = regular ? '2x regular-holiday pay' : '1x standard pay';
  $('#holidayPayMessage').textContent = holiday ? `${holiday.name}${regular ? ' applies double pay today.' : ' is a special non-working day; standard payroll rules remain in effect.'}` : 'No regular holiday today.';
}

function nextPayday(date) {
  const { year, month, day } = Object.fromEntries(Object.entries(businessParts(date)).map(([key, value]) => [key, Number(value)]));
  if (day <= 5) return businessDateFromKey(`${year}-${pad(month)}-05`);
  if (day <= 20) return businessDateFromKey(`${year}-${pad(month)}-20`);
  const nextMonth = addBusinessMonths(businessDateFromKey(`${year}-${pad(month)}-01`), 1);
  const next = businessParts(nextMonth);
  return businessDateFromKey(`${next.year}-${next.month}-05`);
}

function renderPayday() {
  const payday = nextPayday(todayDate);
  const todayKey = isoDate(todayDate);
  const days = Math.ceil((businessDateFromKey(isoDate(payday)) - businessDateFromKey(todayKey)) / 86400000);
  $('#nextPayday').textContent = businessDateLabel(payday, { month: 'long', day: 'numeric' });
  $('#paydayMessage').textContent = days === 0 ? 'Payroll is due today.' : `${days} day${days === 1 ? '' : 's'} until payday · ${businessParts(payday).day === '20' ? 'Work from the 1st-15th' : 'Work from the 16th-end of month'}.`;
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
  const year = cursor.getUTCFullYear();
  const month = cursor.getUTCMonth();
  const firstDay = new Date(Date.UTC(year, month, 1, 12, 0, 0));
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0, 12, 0, 0)).getUTCDate();
  const previousDays = new Date(Date.UTC(year, month, 0, 12, 0, 0)).getUTCDate();
  $(titleSelector).textContent = businessDateLabel(firstDay, { month: 'long', year: 'numeric' });
  let cells = '';
  for (let index = 0; index < 42; index++) {
    const day = index - firstDay.getUTCDay() + 1;
    const cellDate = new Date(Date.UTC(year, month, day, 12, 0, 0));
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
  renderPayroll();
}

function renderApprovals() {
  $('#leaveApprovalRows').innerHTML = leaveRequests.map(request => approvalRow(request, 'leave')).join('') || '<div class="empty-state">No leave requests yet.</div>';
  $('#timeEditApprovalRows').innerHTML = timeEditRequests.map(request => approvalRow(request, 'time')).join('') || '<div class="empty-state">No time edit requests yet.</div>';
  $('#overtimeApprovalRows').innerHTML = overtimeRequests.map(request => approvalRow(request, 'overtime')).join('') || '<div class="empty-state">No overtime requests yet.</div>';
}

function approvalRequestDetails(request, type) {
  if (type === 'leave') return {
    typeLabel: 'Leave request',
    timeLabel: 'Whole day',
    reason: request.reason || 'No notes provided.'
  };
  if (type === 'overtime') return {
    typeLabel: 'Overtime request',
    timeLabel: `${Number(request.hours).toFixed(2)} OT hours`,
    reason: request.reason || 'No notes provided.'
  };
  return {
    typeLabel: 'Time edit request',
    timeLabel: `${request.clockIn}-${request.clockOut}`,
    reason: request.reason || 'No notes provided.'
  };
}

function approvalRow(request, type) {
  const detail = approvalRequestDetails(request, type);
  const details = `<small>${escapeHtml(request.date)}</small><small>${escapeHtml(detail.timeLabel)}</small><small>${escapeHtml(detail.reason)}</small>`;
  const actions = request.status === 'pending' ? `<div class="approval-actions"><button class="approve-btn" data-approve="${type}" data-id="${request.id}">Approve</button><button class="reject-btn" data-reject="${type}" data-id="${request.id}">Reject</button></div>` : '';
  return `<div class="approval-row" role="button" tabindex="0" data-approval-type="${type}" data-approval-id="${request.id}"><div><b>${escapeHtml(request.employeeName)}</b>${details}</div><span class="access-state ${request.status === 'pending' ? 'pending' : ''}">${request.status}</span>${actions}</div>`;
}

function findApprovalRequest(type, id) {
  const source = type === 'leave' ? leaveRequests : type === 'overtime' ? overtimeRequests : timeEditRequests;
  return source.find(request => request.id === id) || null;
}

function openApprovalDetail(type, id) {
  const request = findApprovalRequest(type, id);
  if (!request) return showToast('Request not found.');
  selectedApprovalRequest = { type, id };
  const detail = approvalRequestDetails(request, type);
  $('#approvalDetailEyebrow').textContent = detail.typeLabel.toUpperCase();
  $('#approvalDetailTitle').textContent = request.employeeName;
  $('#approvalDetailEmployee').textContent = request.employeeName;
  $('#approvalDetailType').textContent = detail.typeLabel;
  $('#approvalDetailDate').textContent = request.date;
  $('#approvalDetailStatus').textContent = request.status;
  $('#approvalDetailTime').textContent = detail.timeLabel;
  $('#approvalDetailReason').textContent = detail.reason;
  $('#approvalDetailCreated').textContent = businessDateTimeLabel(request.createdAt || new Date());
  const pending = request.status === 'pending';
  $('#approvalDetailApprove').hidden = !pending;
  $('#approvalDetailReject').hidden = !pending;
  $('#approvalDetailBackdrop').hidden = false;
}

function closeApprovalDetail() {
  $('#approvalDetailBackdrop').hidden = true;
  selectedApprovalRequest = null;
}

async function setRequestStatus(type, id, status) {
  if (usesSupabase()) {
    const table = type === 'leave' ? 'leave_requests' : type === 'overtime' ? 'overtime_requests' : 'time_edit_requests';
    if (type === 'time' && status === 'approved') {
      const request = timeEditRequests.find(item => item.id === id);
      const applied = await applyApprovedTimeEdit(request);
      if (!applied.ok) {
        showToast(`Time edit could not be applied: ${applied.message}`);
        return false;
      }
    }
    const { error } = await supabaseClient.from(table).update({ status }).eq('id', id);
    if (error) {
      showToast(`Approval error: ${error.message}`);
      return false;
    }
    await loadSupabaseRequests();
  } else if (type === 'leave') {
    leaveRequests = leaveRequests.map(request => request.id === id ? { ...request, status } : request);
    persistLeaveRequests();
  } else if (type === 'overtime') {
    overtimeRequests = overtimeRequests.map(request => request.id === id ? { ...request, status } : request);
    persistOvertimeRequests();
  } else {
    timeEditRequests = timeEditRequests.map(request => request.id === id ? { ...request, status } : request);
    persistTimeEditRequests();
  }
  renderApprovals();
  renderEmployeeRequests();
  renderPayroll();
  showToast(`Request ${status}.`);
  return true;
}

function renderEmployeeRequests() {
  if (!currentAccount) return;
  const myLeaves = leaveRequests.filter(request => request.employeeEmail === currentAccount.email);
  const myEdits = timeEditRequests.filter(request => request.employeeEmail === currentAccount.email);
  const myOvertime = overtimeRequests.filter(request => request.employeeEmail === currentAccount.email);
  $('#myLeaveRows').innerHTML = myLeaves.map(request => `<div class="approval-row"><div><b>${request.date}</b><small>${escapeHtml(request.reason)}</small></div><span class="access-state ${request.status === 'pending' ? 'pending' : ''}">${request.status}</span></div>`).join('') || '<div class="empty-state">No leave requests yet.</div>';
  $('#myTimeEditRows').innerHTML = myEdits.map(request => `<div class="approval-row"><div><b>${escapeHtml(request.date)}</b><small>${escapeHtml(request.clockIn)}-${escapeHtml(request.clockOut)}</small></div><span class="access-state ${request.status === 'pending' ? 'pending' : ''}">${request.status}</span></div>`).join('') || '<div class="empty-state">No time edit requests yet.</div>';
  $('#myOvertimeRows').innerHTML = myOvertime.map(request => `<div class="approval-row"><div><b>${escapeHtml(request.date)}</b><small>${Number(request.hours).toFixed(2)} OT hours</small><small>${escapeHtml(request.reason)}</small></div><span class="access-state ${request.status === 'pending' ? 'pending' : ''}">${request.status}</span></div>`).join('') || '<div class="empty-state">No overtime requests yet.</div>';
  renderLeaveCalendar();
}

function renderDocuments() {
  const mine = coachingDocuments.filter(document => document.employeeEmail === currentAccount?.email);
  $('#documentRows').innerHTML = mine.map(document => `<div class="document-row"><div><b>${escapeHtml(document.name)}</b><small>${document.size} · uploaded ${document.uploadedAt}</small></div><span class="access-state">Saved</span></div>`).join('') || '<div class="empty-state">No coaching documents uploaded yet.</div>';
}

function renderDeletedTimeAlerts() {
  if (!$('#deletedTimeRows')) return;
  const ownAlerts = deletedTimeAlerts.filter(alert => !currentProfile?.id || alert.employeeId === currentProfile.id || alert.employeeEmail === currentAccount?.email);
  $('#deletedTimeRows').innerHTML = ownAlerts.map(alert => `<div class="deleted-notice"><b>${escapeHtml(alert.title || 'Time entry deleted')}</b><small>${escapeHtml(alert.message || '')}</small><small>${businessDateTimeLabel(alert.createdAt || Date.now())}</small></div>`).join('') || '<div class="empty-state">No deleted time notices.</div>';
}

function renderEmployeePayrollAdjustments() {
  if (!$('#employeeAdjustmentRows')) return;
  const employeeId = currentProfile?.id || currentAccount?.id;
  const own = payrollAdjustments.filter(item => (item.employee_id || item.employeeId) === employeeId);
  $('#employeeAdjustmentRows').innerHTML = own.map(item => {
    const from = item.period_start || item.periodStart;
    const to = item.period_end || item.periodEnd;
    const hours = Number(item.deducted_hours ?? item.deductedHours ?? 0);
    const amount = Number(item.deducted_amount ?? item.deductedAmount ?? 0);
    const adjustmentPhp = Number(item.adjustment_php ?? item.adjustmentPhp ?? 0);
    const deductionsPhp = Number(item.deductions_php ?? item.deductionsPhp ?? 0);
    const commissionPhp = Number(item.commission_php ?? item.commissionPhp ?? 0);
    const details = `Hours deducted: ${hours.toFixed(2)} | USD amount: ${money(amount)} | PHP adjustment: ${phpMoney(adjustmentPhp)} | Deductions: ${phpMoney(deductionsPhp)} | Commission: ${phpMoney(commissionPhp)}`;
    return `<div class="payroll-adjustment-notice"><div><b>${escapeHtml(from)} to ${escapeHtml(to)}</b><small>${escapeHtml(details)}</small><small>${escapeHtml(item.note || 'No note provided')}</small></div><span class="access-state">Recorded</span></div>`;
  }).join('') || '<div class="empty-state">No payroll adjustments.</div>';
}

function durationSecondsFromLabel(label) {
  const match = String(label || '').match(/(\d+)h\s*(\d+)m/);
  return match ? Number(match[1]) * 3600 + Number(match[2]) * 60 : 0;
}

function currentCutoffKeys(reference = new Date(), previous = false) {
  let { year, month, day } = Object.fromEntries(Object.entries(businessParts(reference)).map(([key, value]) => [key, Number(value)]));
  if (previous) {
    if (day <= 15) {
      const previousMonth = addBusinessMonths(businessDateFromKey(`${year}-${pad(month)}-01`), -1);
      const parts = businessParts(previousMonth);
      year = Number(parts.year);
      month = Number(parts.month);
      day = 16;
    } else {
      day = 1;
    }
  }
  if (day <= 15) {
    return {
      startKey: `${year}-${pad(month)}-01`,
      endKey: `${year}-${pad(month)}-15`,
      payDateKey: `${year}-${pad(month)}-20`
    };
  }
  const lastDay = businessMonthLastDay(year, month);
  const nextMonth = addBusinessMonths(businessDateFromKey(`${year}-${pad(month)}-01`), 1);
  const nextParts = businessParts(nextMonth);
  return {
    startKey: `${year}-${pad(month)}-16`,
    endKey: `${year}-${pad(month)}-${pad(lastDay)}`,
    payDateKey: `${nextParts.year}-${nextParts.month}-05`
  };
}

function businessWeekKeys(reference = new Date()) {
  const current = businessDateFromKey(isoDate(reference));
  const offset = (current.getUTCDay() + 6) % 7;
  const start = addBusinessDays(current, -offset);
  const end = addBusinessDays(start, 6);
  return { startKey: isoDate(start), endKey: isoDate(end) };
}

function businessMonthKeys(reference = new Date()) {
  const { year, month } = Object.fromEntries(Object.entries(businessParts(reference)).map(([key, value]) => [key, Number(value)]));
  return {
    startKey: `${year}-${pad(month)}-01`,
    endKey: `${year}-${pad(month)}-${pad(businessMonthLastDay(year, month))}`
  };
}

function reportRange() {
  const now = new Date();
  const period = $('#reportPeriod')?.value || 'cutoff';
  let startKey = isoDate(now);
  let endKey = isoDate(now);
  let payDateKey = null;
  if (period === 'cutoff' || period === 'previous-cutoff') {
    ({ startKey, endKey, payDateKey } = currentCutoffKeys(now, period === 'previous-cutoff'));
  }
  if (period === 'week') {
    ({ startKey, endKey } = businessWeekKeys(now));
  }
  if (period === 'month') {
    ({ startKey, endKey } = businessMonthKeys(now));
  }
  if (period === 'custom') {
    startKey = $('#reportStart').value || isoDate(now);
    endKey = $('#reportEnd').value || isoDate(now);
  }
  const start = businessStartFromKey(startKey);
  const end = businessEndFromKey(endKey);
  return { start, end, startKey, endKey, period, payDate: payDateKey ? businessDateFromKey(payDateKey) : null, payDateKey };
}

function syncReportDatesFromPeriod() {
  if ($('#reportPeriod').value === 'custom') return;
  const { start, end } = reportRange();
  $('#reportStart').value = isoDate(start);
  $('#reportEnd').value = isoDate(end);
}

function adjustmentFor(employeeId, start, end) {
  const startKey = isoDate(start);
  const endKey = isoDate(end);
  return payrollAdjustments.find(item =>
    (item.employee_id || item.employeeId) === employeeId &&
    (item.period_start || item.periodStart) === startKey &&
    (item.period_end || item.periodEnd) === endKey
  ) || null;
}

function renderReports() {
  if (!$('#reportRows')) return;
  const { start, end, period, payDate, payDateKey } = reportRange();
  const term = ($('#reportEmployee')?.value || '').toLowerCase();
  const records = (usesSupabase() ? supabaseTimeEntries.map(attendanceRecordFromSupabase) : []).filter(record => {
    const entryDate = record.dateKey ? businessDateFromKey(record.dateKey) : null;
    return entryDate && entryDate >= start && entryDate <= end && (!term || `${record.name} ${record.role}`.toLowerCase().includes(term));
  });
  const groups = new Map();
  records.forEach(record => {
    const key = `${record.email}-${period === 'day' ? record.dateKey : 'range'}`;
    const existing = groups.get(key) || { ...record, entries: 0, seconds: 0, pay: 0 };
    existing.entries += 1;
    existing.seconds += durationSecondsFromLabel(record.worked);
    const rate = hourlyRate(record);
    const entryDate = record.dateKey ? businessDateFromKey(record.dateKey) : businessDateFromKey(isoDate(todayDate));
    const multiplier = holidayForDate(entryDate)?.type === 'regular' ? 2 : 1;
    existing.pay += rate === null ? 0 : rate * durationSecondsFromLabel(record.worked) / 3600 * multiplier;
    groups.set(key, existing);
  });
  const rows = [...groups.values()].map(row => {
    const adjustment = adjustmentFor(row.employeeId, start, end);
    const deductedHours = Math.max(0, Number(adjustment?.deducted_hours ?? adjustment?.deductedHours ?? 0));
    const deductedAmount = Math.max(0, Number(adjustment?.deducted_amount ?? adjustment?.deductedAmount ?? 0));
    const commission = Math.max(0, Number(adjustment?.commission ?? 0));
    const rate = hourlyRate(row) || 0;
    const payableSeconds = Math.max(0, row.seconds - deductedHours * 3600);
    const netPay = Math.max(0, row.pay - Math.min(deductedHours, row.seconds / 3600) * rate - deductedAmount + commission);
    return { ...row, adjustment, deductedHours, deductedAmount, commission, payableSeconds, netPay };
  });
  currentReportRows = rows;
  $('#reportTotalHours').textContent = formatDuration(rows.reduce((sum, row) => sum + row.seconds, 0));
  $('#reportEmployeeCount').textContent = new Set(rows.map(row => row.email)).size;
  $('#reportEntryCount').textContent = records.length;
  $('#reportPayEstimate').textContent = money(rows.reduce((sum, row) => sum + row.netPay, 0));
  $('#reportPayDate').textContent = payDate ? businessDateLabel(payDate, { month: 'short', day: 'numeric' }) : 'N/A';
  $('#reportPayDateNote').textContent = payDate ? (businessDateFromKey(payDateKey) < businessDateFromKey(isoDate(todayDate)) ? 'Completed payroll date' : 'Scheduled payroll date') : 'Only applies to payroll cutoffs';
  $('#reportRows').innerHTML = rows.map(row => {
    const adjustmentText = row.adjustment ? `-${row.deductedHours.toFixed(2)}h · -${money(row.deductedAmount)} · +${money(row.commission)}` : 'No adjustment';
    return `<div class="report-row payroll-report-row" role="button" tabindex="0" data-report-employee="${row.employeeId}" data-report-name="${encodeURIComponent(row.name)}"><div class="person"><span class="person-avatar" style="background:${row.color}">${row.initials}</span><span>${escapeHtml(row.name)}<small>${escapeHtml(row.role)}</small></span></div><span>${period === 'day' ? escapeHtml(row.date) : `${businessDateLabel(start)} - ${businessDateLabel(end)}`}</span><span>${row.entries}</span><span class="attendance-time">${formatDuration(row.seconds)}</span><span class="adjustment-summary">${adjustmentText}<small>Payable: ${formatDuration(row.payableSeconds)}</small></span><span class="attendance-time">${money(row.netPay)}</span><button class="edit-adjustment-btn" data-edit-adjustment="${row.employeeId}">Edit</button></div>`;
  }).join('') || '<div class="empty-state">No worked hours found for this report.</div>';
  $('#reportRangeLabel').textContent = `Showing ${businessDateLabel(start)} to ${businessDateLabel(end)}`;
}

function openReportDetail(employeeId, name = '') {
  const { start, end } = reportRange();
  const rows = buildDailyHoursSummary(employeeId, start, end);
  const reportRow = currentReportRows.find(row => row.employeeId === employeeId);
  $('#reportDetailTitle').textContent = name || reportRow?.name || 'Employee hours';
  $('#reportDetailPeriod').textContent = `${businessDateLabel(start)} to ${businessDateLabel(end)}`;
  $('#reportDetailTotalHours').textContent = formatDuration(rows.reduce((sum, row) => sum + row.seconds, 0));
  $('#reportDetailEntryCount').textContent = rows.reduce((sum, row) => sum + row.entries, 0);
  $('#reportDetailDayCount').textContent = rows.length;
  $('#reportDetailRows').innerHTML = rows.map(row => `<div class="report-row employee-hours-row"><span>${escapeHtml(row.dateLabel)}</span><span>${row.entries}</span><span class="attendance-time">${formatDuration(row.seconds)}</span><span>${escapeHtml([...new Set(row.tasks)].join(', '))}</span></div>`).join('') || '<div class="empty-state">No hours found for this employee in the selected period.</div>';
  $('#reportDetailBackdrop').hidden = false;
}

function closeReportDetail() {
  $('#reportDetailBackdrop').hidden = true;
}

function initializeReportDates() {
  if (!$('#reportStart')) return;
  syncReportDatesFromPeriod();
  syncEmployeeReportDatesFromPeriod();
}

function employeeReportRange() {
  const now = new Date();
  const period = $('#employeeReportPeriod')?.value || 'day';
  let startKey = isoDate(now);
  let endKey = isoDate(now);
  if (period === 'week') ({ startKey, endKey } = businessWeekKeys(now));
  if (period === 'month') ({ startKey, endKey } = businessMonthKeys(now));
  if (period === 'custom') {
    startKey = $('#employeeReportStart')?.value || isoDate(now);
    endKey = $('#employeeReportEnd')?.value || isoDate(now);
  }
  return { start: businessStartFromKey(startKey), end: businessEndFromKey(endKey), startKey, endKey, period };
}

function syncEmployeeReportDatesFromPeriod() {
  if (!$('#employeeReportPeriod') || $('#employeeReportPeriod').value === 'custom') return;
  const { start, end } = employeeReportRange();
  $('#employeeReportStart').value = isoDate(start);
  $('#employeeReportEnd').value = isoDate(end);
}

function buildDailyHoursSummary(employeeId, start, end) {
  const records = (usesSupabase() ? supabaseTimeEntries.map(attendanceRecordFromSupabase) : []).filter(record => {
    const entryDate = record.dateKey ? businessDateFromKey(record.dateKey) : null;
    return record.employeeId === employeeId && entryDate && entryDate >= start && entryDate <= end;
  });
  const groups = new Map();
  records.forEach(record => {
    const existing = groups.get(record.dateKey) || {
      dateKey: record.dateKey,
      dateLabel: record.date,
      entries: 0,
      seconds: 0,
      tasks: []
    };
    existing.entries += 1;
    existing.seconds += durationSecondsFromLabel(record.worked);
    existing.tasks.push(record.task || 'Tracked time');
    groups.set(record.dateKey, existing);
  });
  return [...groups.values()].sort((left, right) => left.dateKey.localeCompare(right.dateKey));
}

function renderEmployeeHoursReport() {
  if (!$('#employeeReportRows') || currentAccount?.role !== 'employee' || !currentProfile?.id) return;
  const { start, end } = employeeReportRange();
  const rows = buildDailyHoursSummary(currentProfile.id, start, end);
  currentEmployeeReportRows = rows;
  $('#employeeReportTotalHours').textContent = formatDuration(rows.reduce((sum, row) => sum + row.seconds, 0));
  $('#employeeReportDayCount').textContent = rows.length;
  $('#employeeReportEntryCount').textContent = rows.reduce((sum, row) => sum + row.entries, 0);
  $('#employeeReportRows').innerHTML = rows.map(row => `<div class="report-row employee-hours-row"><span>${escapeHtml(row.dateLabel)}</span><span>${row.entries}</span><span class="attendance-time">${formatDuration(row.seconds)}</span><span>${escapeHtml([...new Set(row.tasks)].join(', '))}</span></div>`).join('') || '<div class="empty-state">No hours found for this period.</div>';
  $('#employeeReportRangeLabel').textContent = `Showing ${businessDateLabel(start)} to ${businessDateLabel(end)}`;
}

function payrollRange() {
  const { startKey, endKey, payDateKey } = currentCutoffKeys(new Date(), $('#payrollCutoff')?.value === 'previous');
  return { start: businessStartFromKey(startKey), end: businessEndFromKey(endKey), startKey, endKey, payDateKey };
}

function payrollRole(person) {
  const role = String(person.role || '').toLowerCase();
  if (role.includes('webinar')) return 'webinar';
  if (role.includes('smm')) return 'smm';
  if (role.includes('coach')) return 'coaches';
  if (role.includes('admin')) return 'admin';
  return 'other';
}

function scheduledHoursInRange(person, start, end) {
  if (person.scheduledStart === null || person.scheduledEnd === null) return 0;
  let daily = person.scheduledEnd - person.scheduledStart;
  if (daily <= 0) daily += 1440;
  daily /= 60;
  let workdays = 0;
  let cursor = businessDateFromKey(isoDate(start));
  const last = businessDateFromKey(isoDate(end));
  while (cursor <= last) {
    if (cursor.getUTCDay() !== 0 && cursor.getUTCDay() !== 6) workdays++;
    cursor = addBusinessDays(cursor, 1);
  }
  return daily * workdays;
}

function weekdayCount(start, end) {
  let count = 0;
  let cursor = businessDateFromKey(isoDate(start));
  const last = businessDateFromKey(isoDate(end));
  while (cursor <= last) {
    if (cursor.getUTCDay() !== 0 && cursor.getUTCDay() !== 6) count++;
    cursor = addBusinessDays(cursor, 1);
  }
  return count;
}

function payrollUsdPhpRate() {
  return manualPayrollFxOverride > 0 ? manualPayrollFxOverride : (liveUsdPhpRate || 1 / phpUsdRate);
}

async function refreshPayrollUsdPhpRate() {
  try {
    const response = await fetch('https://open.er-api.com/v6/latest/USD');
    if (!response.ok) throw new Error('rate unavailable');
    const data = await response.json();
    const rate = Number(data.rates?.PHP);
    if (!(rate > 0)) throw new Error('PHP rate missing');
    liveUsdPhpRate = rate;
    liveUsdPhpDate = data.time_last_update_utc || new Date().toISOString();
    localStorage.setItem('sync2time-live-usd-php', String(rate));
    localStorage.setItem('sync2time-live-usd-php-date', liveUsdPhpDate);
  } catch {
    // Keep the last saved daily rate, then fall back to the existing reference rate.
  }
  renderPayroll();
}

function phpMoney(value) {
  return `₱${Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function payrollAdjustmentValues(person, start, end) {
  const adjustment = adjustmentFor(person.id, start, end);
  return {
    record: adjustment,
    adjustment: Number(adjustment?.adjustment_php ?? adjustment?.adjustmentPhp ?? 0),
    deductions: Number(adjustment?.deductions_php ?? adjustment?.deductionsPhp ?? 0),
    commission: Number(adjustment?.commission_php ?? adjustment?.commissionPhp ?? adjustment?.commission ?? 0),
    cutoffPayOverride: adjustment?.cutoff_pay_override ?? adjustment?.cutoffPayOverride ?? null,
    grossPayOverride: adjustment?.gross_pay_override ?? adjustment?.grossPayOverride ?? null,
    paystubApproved: Boolean(adjustment?.paystub_approved ?? adjustment?.paystubApproved),
    paystubEmailedAt: adjustment?.paystub_emailed_at ?? adjustment?.paystubEmailedAt ?? null,
    note: adjustment?.note || ''
  };
}

function buildPayrollRows() {
  const { start, end, startKey } = payrollRange();
  const fx = payrollUsdPhpRate();
  return rosterSource().filter(person => person.email?.toLowerCase() !== adminAccount.email && payrollRole(person) === selectedPayrollRole).map(person => {
    const entries = supabaseTimeEntries.filter(entry => {
      if (entry.employee_id !== person.id || !entry.clock_in) return false;
      const date = new Date(entry.clock_in);
      return date >= start && date <= end;
    });
    const actualHours = entries.reduce((sum, entry) => sum + secondsBetween(entry.clock_in, entry.clock_out || Date.now()) / 3600, 0);
    const otHours = overtimeRequests.filter(request => {
      const date = businessDateFromKey(request.date);
      return request.employeeId === person.id && request.status === 'approved' && date >= start && date <= end;
    }).reduce((sum, request) => sum + Number(request.hours || 0), 0);
    const expectedHours = scheduledHoursInRange(person, start, end);
    const values = payrollAdjustmentValues(person, start, end);
    const hourlyUsd = typeof person.rate === 'number' && person.rate < 1000 ? person.rate : 0;
    const monthlyPhp = typeof person.rate === 'number' && person.rate >= 1000 ? person.rate : 0;
    const calculatedCutoffPay = monthlyPhp / 2;
    const cutoffPay = values.cutoffPayOverride === null ? calculatedCutoffPay : Number(values.cutoffPayOverride);
    const monthStart = businessDateFromKey(`${startKey.slice(0, 7)}-01`);
    const monthEnd = businessDateFromKey(`${startKey.slice(0, 7)}-${pad(businessMonthLastDay(Number(startKey.slice(0, 4)), Number(startKey.slice(5, 7))))}`);
    const dailyRate = monthlyPhp / Math.max(1, weekdayCount(monthStart, monthEnd));
    const otPay = otHours * (dailyRate / 8) * 1.25;
    let grossUsd = 0;
    let grossPhp = 0;
    if (selectedPayrollRole === 'coaches') {
      grossUsd = (actualHours + otHours) * hourlyUsd;
      grossPhp = grossUsd * fx;
    } else if (selectedPayrollRole === 'admin') {
      grossPhp = cutoffPay + otPay;
    } else if (selectedPayrollRole === 'smm') {
      grossPhp = values.grossPayOverride === null ? cutoffPay : Number(values.grossPayOverride);
    } else if (selectedPayrollRole === 'other') {
      grossPhp = monthlyPhp ? cutoffPay : (actualHours + otHours) * hourlyUsd * fx;
    }
    const netPay = selectedPayrollRole === 'coaches'
      ? grossPhp + values.adjustment
      : grossPhp + values.deductions + values.commission;
    return { person, expectedHours, actualHours, otHours, hourlyUsd, monthlyPhp, cutoffPay, otPay, grossUsd, grossPhp, netPay, ...values };
  });
}

function renderPayroll() {
  if (!$('#payrollRows')) return;
  const { start, end } = payrollRange();
  const fx = payrollUsdPhpRate();
  $('#payrollStart').value = isoDate(start);
  $('#payrollEnd').value = isoDate(end);
  $('#payrollFxRate').value = fx.toFixed(4);
  const manual = manualPayrollFxOverride > 0;
  $('#payrollFxSource').innerHTML = manual
    ? 'Manual payroll rate · <a href="https://www.google.com/finance/quote/USD-PHP" target="_blank" rel="noopener">compare with Google</a>'
    : `Daily market rate ${escapeHtml(liveUsdPhpDate || fxRateDate)} · <a href="https://www.exchangerate-api.com" target="_blank" rel="noopener">Rates by Exchange Rate API</a>`;
  $$('#payrollTabs [data-payroll-role]').forEach(button => button.classList.toggle('active', button.dataset.payrollRole === selectedPayrollRole));
  const headers = {
    coaches: ['EMPLOYEE', 'EXPECTED HRS', 'ACTUAL HRS', 'OT HRS', 'USD RATE', 'PHP RATE', 'GROSS USD', 'GROSS PHP', 'ADJUSTMENT', 'NET PAY', 'ACTION'],
    admin: ['EMPLOYEE', 'EXPECTED HRS', 'ACTUAL HRS', 'OT HRS', 'CUTOFF PAY', 'OT PAY', 'DEDUCTIONS', 'COMMISSION', 'NET PAY', 'ACTION'],
    webinar: ['EMPLOYEE', 'GROSS PAY', 'DEDUCTIONS', 'COMMISSION', 'NET PAY', 'ACTION'],
    smm: ['EMPLOYEE', 'GROSS PAY', 'DEDUCTIONS', 'COMMISSION', 'NET PAY', 'ACTION'],
    other: ['EMPLOYEE', 'GROSS PAY', 'DEDUCTIONS', 'COMMISSION', 'NET PAY', 'ACTION']
  };
  $('#payrollHead').className = `payroll-head ${selectedPayrollRole}`;
  $('#payrollHead').innerHTML = headers[selectedPayrollRole].map(header => `<span>${header}</span>`).join('');
  currentPayrollRows = buildPayrollRows();
  $('#payrollRows').innerHTML = currentPayrollRows.map(row => {
    const recipient = paystubRecipients.find(item => item.employee_id === row.person.id);
    const person = `<div class="person"><span class="person-avatar" style="background:${row.person.color}">${row.person.initials}</span><span>${escapeHtml(row.person.name)}<small>${escapeHtml(row.person.role)}</small><small>${recipient ? `Paystub: ${escapeHtml(recipient.recipient_email)}` : 'No paystub recipient'}</small></span></div>`;
    const approvalLabel = row.paystubApproved ? 'Approved' : 'Approve';
    const edit = `<span class="payroll-actions"><button class="approve-paystub-btn ${row.paystubApproved ? 'approved' : ''}" data-approve-paystub="${row.person.id}" ${recipient ? '' : 'disabled title="No paystub recipient"'}>${approvalLabel}</button><button class="edit-adjustment-btn" data-payroll-edit="${row.person.id}">Edit</button><button class="edit-adjustment-btn" data-payroll-recipient="${row.person.id}">Recipient</button><button class="paystub-btn" data-paystub="${row.person.id}">Paystub</button></span>`;
    if (selectedPayrollRole === 'coaches') return `<div class="payroll-row coaches">${person}<span>${row.expectedHours.toFixed(2)}</span><span>${row.actualHours.toFixed(2)}</span><span>${row.otHours.toFixed(2)}</span><span>$${row.hourlyUsd.toFixed(2)}</span><span>₱${fx.toFixed(4)}</span><span class="payroll-money">$${row.grossUsd.toFixed(2)}</span><span class="payroll-money">${phpMoney(row.grossPhp)}</span><span class="payroll-money" title="${escapeHtml(row.note)}">${phpMoney(row.adjustment)}</span><b class="payroll-money">${phpMoney(row.netPay)}</b>${edit}</div>`;
    if (selectedPayrollRole === 'admin') return `<div class="payroll-row admin">${person}<span>${row.expectedHours.toFixed(2)}</span><span>${row.actualHours.toFixed(2)}</span><span>${row.otHours.toFixed(2)}</span><span class="payroll-money">${phpMoney(row.cutoffPay)}</span><span class="payroll-money">${phpMoney(row.otPay)}</span><span class="payroll-money">${phpMoney(row.deductions)}</span><span class="payroll-money">${phpMoney(row.commission)}</span><b class="payroll-money">${phpMoney(row.netPay)}</b>${edit}</div>`;
    return `<div class="payroll-row ${selectedPayrollRole}">${person}<span class="payroll-money">${phpMoney(row.grossPhp)}</span><span class="payroll-money">${phpMoney(row.deductions)}</span><span class="payroll-money">${phpMoney(row.commission)}</span><b class="payroll-money">${phpMoney(row.netPay)}</b>${edit}</div>`;
  }).join('') || '<div class="empty-state">No employees are assigned to this role group.</div>';
  $('#payrollEmployeeCount').textContent = currentPayrollRows.length;
  $('#payrollActualHours').textContent = formatDuration(currentPayrollRows.reduce((sum, row) => sum + row.actualHours * 3600, 0));
  $('#payrollOtHours').textContent = formatDuration(currentPayrollRows.reduce((sum, row) => sum + row.otHours * 3600, 0));
  $('#payrollNetPay').textContent = phpMoney(currentPayrollRows.reduce((sum, row) => sum + row.netPay, 0));
  $('#payrollRangeLabel').textContent = `${businessDateLabel(start)} to ${businessDateLabel(end)} · ${selectedPayrollRole.toUpperCase()}`;
  $('#payrollFooterHint').textContent = 'Click Edit or Recipient to update payroll values and the paystub destination email.';
  const approvedCount = currentPayrollRows.filter(row => row.paystubApproved).length;
  const recipientCount = currentPayrollRows.filter(row => paystubRecipients.some(item => item.employee_id === row.person.id)).length;
  const emailedCount = currentPayrollRows.filter(row => row.paystubEmailedAt).length;
  const ready = currentPayrollRows.length > 0 && approvedCount === currentPayrollRows.length && recipientCount === currentPayrollRows.length;
  const allEmailed = emailedCount === currentPayrollRows.length && currentPayrollRows.length > 0;
  $('#bulkPaystubTitle').textContent = allEmailed ? `${selectedPayrollRole} paystubs were sent` : ready ? `${selectedPayrollRole} paystubs are ready` : 'Approve employees to enable sending';
  $('#bulkPaystubStatus').textContent = `${approvedCount} of ${currentPayrollRows.length} approved · ${recipientCount} recipients matched · ${emailedCount} sent`;
  $('#sendPaystubs').disabled = !ready || allEmailed;
  $('#sendPaystubs').textContent = allEmailed ? 'Paystubs Sent' : 'Send Paystubs';
}

function loadPaystubLogo() {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = 'sync2va-logo.png';
  });
}

async function buildEmployeePaystub(employeeId, shouldDownload = true) {
  const row = currentPayrollRows.find(item => item.person.id === employeeId);
  if (!row) return showToast('Payroll row not found.');
  if (!window.jspdf?.jsPDF) return showToast('PDF library is still loading. Please try again.');
  const { start, end, payDateKey } = payrollRange();
  const payDate = businessDateFromKey(payDateKey);
  const doc = new window.jspdf.jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setFillColor(10, 34, 61);
  doc.rect(0, 0, pageWidth, 126, 'F');
  doc.setFillColor(20, 111, 181);
  doc.rect(0, 0, pageWidth * .68, 126, 'F');
  doc.setFillColor(239, 119, 31);
  doc.rect(0, 116, pageWidth, 10, 'F');
  try {
    const logo = await loadPaystubLogo();
    doc.addImage(logo, 'PNG', 32, 18, 90, 90);
  } catch {
    // The paystub remains usable if the browser blocks a local logo image.
  }
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text('SYNC2TIME PAYSTUB', 145, 50);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Sync2VA Online Learning Corp.', 145, 72);
  doc.text(`Pay date: ${businessDateLabel(payDate)}`, 145, 90);
  doc.setTextColor(24, 35, 49);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(row.person.name, 38, 164);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${row.person.role} | ${row.person.department || 'Sync2VA'}`, 38, 182);
  doc.text(`Payroll cutoff: ${businessDateLabel(start)} - ${businessDateLabel(end)}`, 38, 199);
  doc.setDrawColor(205, 216, 228);
  doc.line(38, 216, pageWidth - 38, 216);
  const lines = [];
  if (selectedPayrollRole === 'coaches') {
    lines.push(['Expected hours', row.expectedHours.toFixed(2)]);
    lines.push(['Actual hours', row.actualHours.toFixed(2)]);
    lines.push(['Approved OT hours', row.otHours.toFixed(2)]);
    lines.push(['USD hourly rate', `USD ${row.hourlyUsd.toFixed(2)}`]);
    lines.push(['USD to PHP rate', payrollUsdPhpRate().toFixed(4)]);
    lines.push(['Gross USD pay', `USD ${row.grossUsd.toFixed(2)}`]);
    lines.push(['Gross PHP pay', `PHP ${row.grossPhp.toFixed(2)}`]);
    lines.push(['Adjustments', `PHP ${row.adjustment.toFixed(2)}`]);
  } else if (selectedPayrollRole === 'admin') {
    lines.push(['Expected hours', row.expectedHours.toFixed(2)]);
    lines.push(['Actual hours', row.actualHours.toFixed(2)]);
    lines.push(['Approved OT hours', row.otHours.toFixed(2)]);
    lines.push(['Cutoff pay', `PHP ${row.cutoffPay.toFixed(2)}`]);
    lines.push(['OT pay', `PHP ${row.otPay.toFixed(2)}`]);
    lines.push(['Gross pay', `PHP ${row.grossPhp.toFixed(2)}`]);
    lines.push(['Deductions', `PHP ${row.deductions.toFixed(2)}`]);
    lines.push(['Commission', `PHP ${row.commission.toFixed(2)}`]);
  } else {
    lines.push(['Gross pay', `PHP ${row.grossPhp.toFixed(2)}`]);
    lines.push(['Deductions', `PHP ${row.deductions.toFixed(2)}`]);
    lines.push(['Commission', `PHP ${row.commission.toFixed(2)}`]);
  }
  let y = 246;
  doc.setFontSize(10);
  lines.forEach(([label, value], index) => {
    if (index % 2 === 0) {
      doc.setFillColor(246, 249, 252);
      doc.rect(38, y - 15, pageWidth - 76, 28, 'F');
    }
    doc.setTextColor(91, 103, 118);
    doc.setFont('helvetica', 'normal');
    doc.text(label, 50, y + 3);
    doc.setTextColor(24, 35, 49);
    doc.setFont('helvetica', 'bold');
    doc.text(value, pageWidth - 50, y + 3, { align: 'right' });
    y += 30;
  });
  doc.setFillColor(10, 34, 61);
  doc.roundedRect(38, y + 8, pageWidth - 76, 68, 7, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.text('NET PAY', 54, y + 35);
  doc.setFontSize(22);
  doc.text(`PHP ${row.netPay.toFixed(2)}`, pageWidth - 54, y + 43, { align: 'right' });
  if (row.note) {
    doc.setTextColor(75, 84, 96);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Payroll notes:', 38, y + 104);
    doc.text(doc.splitTextToSize(row.note, pageWidth - 76), 38, y + 120);
  }
  doc.setTextColor(120, 129, 140);
  doc.setFontSize(8);
  doc.text(`Generated by Sync2Time on ${businessDateTimeLabel(new Date())}`, 38, 808);
  doc.text('Confidential payroll document', pageWidth - 38, 808, { align: 'right' });
  const filename = `Sync2Time-Paystub-${slug(row.person.name)}-${isoDate(start)}-to-${isoDate(end)}.pdf`;
  const base64 = doc.output('datauristring').split(',')[1];
  if (shouldDownload) {
    doc.save(filename);
    showToast(`${row.person.name}'s paystub downloaded.`);
  }
  return { base64, filename, row };
}

function closePayrollAdjustment() {
  $('#payrollAdjustmentBackdrop').hidden = true;
  editingPayrollAdjustment = null;
  $('#payrollAdjustmentError').hidden = true;
}

function openPayrollAdjustment(employeeId) {
  const row = currentReportRows.find(item => item.employeeId === employeeId);
  if (!row) return showToast('This employee report is no longer available.');
  const { start, end } = reportRange();
  editingPayrollAdjustment = { employeeId, start: isoDate(start), end: isoDate(end), row };
  const adjustment = adjustmentFor(employeeId, start, end);
  $('#payrollAdjustmentEmployee').textContent = row.name;
  $('#payrollAdjustmentPeriod').textContent = `${businessDateLabel(start)} to ${businessDateLabel(end)} · ${formatDuration(row.seconds)} worked`;
  $('#deductHours').value = adjustment?.deducted_hours ?? adjustment?.deductedHours ?? 0;
  $('#deductAmount').value = adjustment?.deducted_amount ?? adjustment?.deductedAmount ?? 0;
  $('#commissionAmount').value = adjustment?.commission ?? 0;
  $('#adjustmentNote').value = adjustment?.note ?? '';
  $('#payrollAdjustmentError').hidden = true;
  $('#payrollAdjustmentBackdrop').hidden = false;
}

async function savePayrollAdjustment(event) {
  event.preventDefault();
  if (!editingPayrollAdjustment) return;
  const deductedHours = Math.max(0, Number($('#deductHours').value) || 0);
  const deductedAmount = Math.max(0, Number($('#deductAmount').value) || 0);
  const commission = Math.max(0, Number($('#commissionAmount').value) || 0);
  const note = $('#adjustmentNote').value.trim();
  if ((deductedHours || deductedAmount || commission) && !note) {
    $('#payrollAdjustmentError').textContent = 'Add a reason or note for the payroll audit trail.';
    $('#payrollAdjustmentError').hidden = false;
    return;
  }
  const record = {
    employee_id: editingPayrollAdjustment.employeeId,
    period_start: editingPayrollAdjustment.start,
    period_end: editingPayrollAdjustment.end,
    deducted_hours: deductedHours,
    deducted_amount: deductedAmount,
    commission,
    note,
    paystub_approved: false,
    approved_at: null,
    approved_by: null,
    updated_at: new Date().toISOString()
  };
  if (usesSupabase()) {
    const { data, error } = await supabaseClient.from('payroll_adjustments').upsert(record, { onConflict: 'employee_id,period_start,period_end' }).select().single();
    if (error) {
      $('#payrollAdjustmentError').textContent = `Could not save: ${error.message}. Run the payroll adjustments SQL in Supabase first.`;
      $('#payrollAdjustmentError').hidden = false;
      return;
    }
    payrollAdjustments = payrollAdjustments.filter(item => item.id !== data.id && !((item.employee_id === data.employee_id) && item.period_start === data.period_start && item.period_end === data.period_end));
    payrollAdjustments.push(data);
  } else {
    payrollAdjustments = payrollAdjustments.filter(item => !((item.employeeId === record.employee_id) && item.periodStart === record.period_start && item.periodEnd === record.period_end));
    payrollAdjustments.push({ id: crypto.randomUUID(), employeeId: record.employee_id, periodStart: record.period_start, periodEnd: record.period_end, deductedHours, deductedAmount, commission, note, updatedAt: record.updated_at });
    persistPayrollAdjustments();
  }
  closePayrollAdjustment();
  renderReports();
  showToast('Payroll adjustment saved.');
}

function openPayrollRowEditor(employeeId) {
  if (!$('#payrollRowRecipientEmail')) {
    const period = $('#payrollRowPeriod');
    if (period) period.insertAdjacentHTML('afterend', '<label>Send paystub to<input id="payrollRowRecipientEmail" type="email" placeholder="employee@email.com" required></label>');
  }
  const row = currentPayrollRows.find(item => item.person.id === employeeId);
  if (!row) return;
  editingPayrollRow = row;
  const { start, end } = payrollRange();
  const recipient = paystubRecipients.find(item => item.employee_id === row.person.id);
  $('#payrollRowEmployee').textContent = row.person.name;
  $('#payrollRowPeriod').textContent = `${businessDateLabel(start)} to ${businessDateLabel(end)} · ${row.person.role}`;
  $('#payrollRowRecipientEmail').value = recipient?.recipient_email || row.person.email || '';
  $('#payrollRowAdjustment').value = row.adjustment || 0;
  $('#payrollRowDeduction').value = row.deductions || 0;
  $('#payrollRowCommission').value = row.commission || 0;
  $('#payrollRowCutoffPay').value = row.cutoffPayOverride ?? '';
  $('#payrollRowCutoffPay').placeholder = `Calculated: ${row.cutoffPay.toFixed(2)}`;
  $('#payrollRowGrossPay').value = row.grossPayOverride ?? '';
  $('#payrollRowGrossPay').placeholder = `Calculated: ${row.grossPhp.toFixed(2)}`;
  $('#payrollRowNote').value = row.note || '';
  $('#payrollCutoffPayField').hidden = selectedPayrollRole !== 'admin';
  $('#payrollGrossPayField').hidden = selectedPayrollRole !== 'smm';
  $('#payrollAdjustmentField').hidden = selectedPayrollRole !== 'coaches';
  $('#payrollDeductionField').hidden = selectedPayrollRole === 'coaches';
  $('#payrollCommissionField').hidden = selectedPayrollRole === 'coaches';
  $('#payrollRowError').hidden = true;
  $('#payrollRowBackdrop').hidden = false;
}

function closePayrollRowEditor() {
  $('#payrollRowBackdrop').hidden = true;
  editingPayrollRow = null;
}

async function savePaystubRecipient(employeeId, email) {
  const recipientEmail = String(email || '').trim().toLowerCase();
  if (!recipientEmail) throw new Error('Paystub destination email is required.');
  const existing = paystubRecipients.find(item => item.employee_id === employeeId);
  if (usesSupabase()) {
    const { data, error } = await supabaseClient
      .from('paystub_recipients')
      .upsert({
        employee_id: employeeId,
        recipient_email: recipientEmail,
        source_note: 'Payroll web page',
        updated_at: new Date().toISOString()
      }, { onConflict: 'employee_id' })
      .select('employee_id, recipient_email')
      .single();
    if (error) throw new Error(error.message);
    paystubRecipients = paystubRecipients.filter(item => item.employee_id !== data.employee_id);
    paystubRecipients.push(data);
  } else {
    const localRecord = { employee_id: employeeId, recipient_email: recipientEmail };
    paystubRecipients = paystubRecipients.filter(item => item.employee_id !== employeeId);
    paystubRecipients.push(localRecord);
  }
  persistPaystubRecipients();
  return existing?.recipient_email !== recipientEmail;
}

async function savePayrollRow(event) {
  event.preventDefault();
  if (!editingPayrollRow) return;
  const { start, end } = payrollRange();
  const recipientEmail = $('#payrollRowRecipientEmail').value.trim().toLowerCase();
  if (!recipientEmail) {
    $('#payrollRowError').textContent = 'Add the paystub destination email before saving.';
    $('#payrollRowError').hidden = false;
    return;
  }
  const existing = editingPayrollRow.record || {};
  const record = {
    employee_id: editingPayrollRow.person.id,
    period_start: isoDate(start),
    period_end: isoDate(end),
    deducted_hours: Number(existing.deducted_hours ?? existing.deductedHours ?? 0),
    deducted_amount: Number(existing.deducted_amount ?? existing.deductedAmount ?? 0),
    commission: Number(existing.commission ?? 0),
    adjustment_php: Number($('#payrollRowAdjustment').value) || 0,
    deductions_php: Number($('#payrollRowDeduction').value) || 0,
    commission_php: Number($('#payrollRowCommission').value) || 0,
    cutoff_pay_override: $('#payrollRowCutoffPay').value === '' ? null : Math.max(0, Number($('#payrollRowCutoffPay').value) || 0),
    gross_pay_override: $('#payrollRowGrossPay').value === '' ? null : Math.max(0, Number($('#payrollRowGrossPay').value) || 0),
    paystub_approved: false,
    approved_at: null,
    approved_by: null,
    note: $('#payrollRowNote').value.trim(),
    updated_at: new Date().toISOString()
  };
  try {
    await savePaystubRecipient(editingPayrollRow.person.id, recipientEmail);
  } catch (error) {
    $('#payrollRowError').textContent = `Could not save paystub destination: ${error.message}`;
    $('#payrollRowError').hidden = false;
    return;
  }
  if (usesSupabase()) {
    const { data, error } = await supabaseClient.from('payroll_adjustments').upsert(record, { onConflict: 'employee_id,period_start,period_end' }).select().single();
    if (error) {
      $('#payrollRowError').textContent = `Could not save: ${error.message}`;
      $('#payrollRowError').hidden = false;
      return;
    }
    payrollAdjustments = payrollAdjustments.filter(item => item.id !== data.id && !(item.employee_id === data.employee_id && item.period_start === data.period_start && item.period_end === data.period_end));
    payrollAdjustments.push(data);
  } else {
    payrollAdjustments = payrollAdjustments.filter(item => !((item.employeeId || item.employee_id) === record.employee_id && (item.periodStart || item.period_start) === record.period_start && (item.periodEnd || item.period_end) === record.period_end));
    payrollAdjustments.push({ ...record, id: crypto.randomUUID(), employeeId: record.employee_id, periodStart: record.period_start, periodEnd: record.period_end });
    persistPayrollAdjustments();
  }
  closePayrollRowEditor();
  renderPayroll();
  renderEmployeePayrollAdjustments();
  showToast('Payroll item and paystub destination saved.');
}

async function approvePayrollPaystub(employeeId) {
  if (currentAccount?.role !== 'admin') return;
  const row = currentPayrollRows.find(item => item.person.id === employeeId);
  if (!row) return;
  const recipient = paystubRecipients.find(item => item.employee_id === employeeId);
  if (!recipient) return showToast(`No paystub email is assigned to ${row.person.name}.`);
  const { start, end } = payrollRange();
  const approved = !row.paystubApproved;
  let result;
  if (row.record?.id && usesSupabase()) {
    result = await supabaseClient.from('payroll_adjustments').update({
      paystub_approved: approved,
      approved_at: approved ? new Date().toISOString() : null,
      approved_by: approved ? currentProfile.id : null,
      paystub_emailed_at: null
    }).eq('id', row.record.id);
  } else if (usesSupabase()) {
    result = await supabaseClient.from('payroll_adjustments').upsert({
      employee_id: employeeId,
      period_start: isoDate(start),
      period_end: isoDate(end),
      paystub_approved: approved,
      approved_at: approved ? new Date().toISOString() : null,
      approved_by: approved ? currentProfile.id : null
    }, { onConflict: 'employee_id,period_start,period_end' });
  } else {
    const existing = row.record || {};
    payrollAdjustments = payrollAdjustments.filter(item => !((item.employeeId || item.employee_id) === employeeId && (item.periodStart || item.period_start) === isoDate(start) && (item.periodEnd || item.period_end) === isoDate(end)));
    payrollAdjustments.push({ ...existing, employeeId, periodStart: isoDate(start), periodEnd: isoDate(end), paystubApproved: approved, approvedAt: approved ? new Date().toISOString() : null });
    persistPayrollAdjustments();
    renderPayroll();
    return;
  }
  if (result.error) return showToast(`Approval error: ${result.error.message}`);
  await loadPayrollAdjustments();
  renderPayroll();
  showToast(`${row.person.name}'s paystub ${approved ? 'approved' : 'reopened'}.`);
}

async function sendApprovedPaystubs() {
  const approvedRows = currentPayrollRows.filter(row => row.paystubApproved);
  const rows = approvedRows.filter(row => !row.paystubEmailedAt);
  const allReady = approvedRows.length === currentPayrollRows.length && approvedRows.every(row => paystubRecipients.some(item => item.employee_id === row.person.id));
  if (!allReady || !approvedRows.length) return showToast('Approve every employee and assign every recipient first.');
  if (!rows.length) return showToast('All paystubs in this tab were already sent.');
  if (!usesSupabase()) return showToast('Supabase connection is required for secure email delivery.');
  if (!confirm(`Send ${rows.length} ${selectedPayrollRole} paystubs now? Each PDF will only be sent to that employee's dedicated paystub email.`)) return;
  const button = $('#sendPaystubs');
  button.disabled = true;
  const original = button.textContent;
  const failures = [];
  const { start, end } = payrollRange();
  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];
    button.textContent = `Sending ${index + 1}/${rows.length}…`;
    try {
      const pdf = await buildEmployeePaystub(row.person.id, false);
      const { error } = await supabaseClient.functions.invoke('send-paystubs', {
        body: {
          employeeId: row.person.id,
          periodStart: isoDate(start),
          periodEnd: isoDate(end),
          filename: pdf.filename,
          pdfBase64: pdf.base64
        }
      });
      if (error) throw error;
    } catch (error) {
      failures.push(`${row.person.name}: ${error.message || 'send failed'}`);
    }
  }
  button.textContent = original;
  await loadPayrollAdjustments();
  renderPayroll();
  if (failures.length) {
    console.error('Paystub email failures:', failures);
    showToast(`${rows.length - failures.length} sent; ${failures.length} failed. Check the browser console and Edge Function logs.`);
  } else {
    showToast(`All ${rows.length} paystubs were emailed successfully.`);
  }
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
  $('#detailTask').textContent = person.note ? `${person.task} — ${person.note}` : person.task;
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

function enhanceEmployeeForm() {
  if ($('#employeePaystubEmail')) return;
  const emailLabel = $('#employeeEmail')?.closest('label');
  const roleLabel = $('#employeeRole')?.closest('label');
  const projectLabel = $('#employeeProject')?.closest('label');
  if (!emailLabel || !roleLabel || !projectLabel) return;
  emailLabel.insertAdjacentHTML('afterend', '<label>Paystub email <small>(for payroll delivery)</small><input id="employeePaystubEmail" type="email" placeholder="Optional; defaults to work email"></label>');
  roleLabel.insertAdjacentHTML('afterend', '<label>Department<input id="employeeDepartment" required placeholder="Department name"></label>');
  projectLabel.insertAdjacentHTML('afterend', '<div class="time-inputs"><label>Schedule start<input id="employeeScheduleStart" type="time"></label><label>Schedule end<input id="employeeScheduleEnd" type="time"></label></div><div class="time-inputs"><label>Rate<input id="employeeRate" type="number" min="0" step="0.01" placeholder="e.g. 5 or 14500"></label><label>Rate type<select id="employeeRateType"><option value="Hourly USD">Hourly USD</option><option value="Monthly PHP">Monthly PHP</option><option value="Commission Based">Commission Based</option><option value="Hourly PHP">Hourly PHP</option></select></label></div>');
}

function openEmployeeForm(employee) {
  const source = employee || null;
  editingEmployeeId = source?.id || null;
  enhanceEmployeeForm();
  renderProjectOptions();
  $('#employeeForm').reset();
  $('#employeeFormError').hidden = true;
  $('#employeeFormTitle').textContent = employee ? 'Edit employee access' : 'Give employee access';
  $('#employeeFormEyebrow').textContent = employee ? 'UPDATE ACCESS' : 'ADMIN ACCESS';
  $('#employeePassword').required = !employee;
  if (source) {
    $('#employeeName').value = source.name || '';
    $('#employeeEmail').value = source.email || '';
    $('#employeePaystubEmail').value = source.paystubEmail || source.email || '';
    $('#employeeRole').value = source.jobRole || source.role || '';
    $('#employeeDepartment').value = source.department || '';
    $('#employeeProject').value = source.task || taskOptions[0];
    $('#employeeRate').value = source.rate ?? '';
    $('#employeeRateType').value = source.rateType || (typeof source.rate === 'number' && source.rate < 1000 ? 'Hourly USD' : typeof source.rate === 'number' ? 'Monthly PHP' : 'Commission Based');
    $('#employeeScheduleStart').value = minutesToTimeInput(source.scheduledStart);
    $('#employeeScheduleEnd').value = minutesToTimeInput(source.scheduledEnd);
    $('#employeePassword').value = source.tempPassword || '';
    $('#employeePassword').placeholder = 'Leave blank to keep current password';
  } else {
    $('#employeeProject').value = taskOptions[0];
    $('#employeeRateType').value = 'Hourly USD';
    $('#employeePassword').value = randomPassword();
    $('#employeePassword').placeholder = 'Create a temporary password';
  }
  $('#employeeModalBackdrop').hidden = false;
  $('#employeeName').focus();
}

function openEmployeeEditor(identifier = '', email = '', name = '') {
  const normalizedEmail = String(email || '').toLowerCase();
  const normalizedName = String(name || '').toLowerCase();
  const employee = editableEmployeeRecords().find(item =>
    (identifier && item.id === identifier) ||
    (normalizedEmail && item.email?.toLowerCase() === normalizedEmail) ||
    (normalizedName && item.name?.toLowerCase() === normalizedName)
  );
  if (!employee) return showToast('Employee record not found.');
  openEmployeeForm(employee);
}

async function offboardEmployeeAccess(identifier = '', email = '', name = '') {
  const normalizedEmail = String(email || '').toLowerCase();
  const normalizedName = String(name || '').toLowerCase();
  const employee = editableEmployeeRecords().find(item =>
    (identifier && item.id === identifier) ||
    (normalizedEmail && item.email?.toLowerCase() === normalizedEmail) ||
    (normalizedName && item.name?.toLowerCase() === normalizedName)
  );
  if (!employee) return showToast('Employee record not found.');
  const confirmMessage = `Please confirm ${employee.name} has completed the offboarding process.\n\nThis will remove Sync2Time sign-in access while preserving historical attendance, payroll, and request records.`;
  if (!confirm(confirmMessage)) return;
  if (usesSupabase()) {
    const { data, error } = await supabaseClient.functions.invoke('admin-offboard-employee', {
      body: { employeeId: employee.id, email: employee.email }
    });
    if (error || !data?.ok) return showToast(`Offboarding error: ${error?.message || data?.error || 'Unable to offboard employee.'}`);
    managedEmployees = managedEmployees.filter(item => item.id !== employee.id);
    persistEmployees();
    await refreshSupabaseData();
    renderManagedEmployees();
    renderTeamDirectory();
    showToast(`${employee.name} was offboarded and access was removed.`);
    return;
  }
  managedEmployees = managedEmployees.filter(item => item.id !== employee.id);
  persistEmployees();
  renderManagedEmployees();
  renderTeamDirectory();
  showToast(`${employee.name}'s access was removed.`);
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

function openOvertimeForm() {
  $('#overtimeForm').reset();
  $('#overtimeFormError').hidden = true;
  $('#overtimeDate').value = isoDate(todayDate);
  $('#overtimeModalBackdrop').hidden = false;
}

function closeOvertimeForm() {
  $('#overtimeModalBackdrop').hidden = true;
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
  const adminAllowed = ['today', 'attendance', 'projects', 'reports', 'payroll', 'team', 'approvals'];
  const employeeAllowed = ['today', 'hours', 'calendar', 'documents', 'requests'];
  const allowed = currentAccount?.role === 'employee' ? employeeAllowed : adminAllowed;
  const active = allowed.includes(page) ? page : 'today';
  if (page !== active) location.hash = active;
  document.body.dataset.page = active;
  $$('.nav-item').forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${active}`));
  if (active === 'projects') renderProjects();
  if (active === 'reports') renderReports();
  if (active === 'payroll') renderPayroll();
  if (active === 'team') renderTeamDirectory();
  if (active === 'approvals') renderApprovals();
  if (active === 'hours') renderEmployeeHoursReport();
  if (active === 'calendar') renderLeaveCalendar();
  if (active === 'documents') renderDocuments();
  if (active === 'requests') renderEmployeeRequests();
  renderDeletedTimeAlerts();
  renderEmployeePayrollAdjustments();
  renderEmployeeHoursReport();
}

function applyAccess(account) {
  currentAccount = account;
  loadStateForAccount(account);
  hydrateEmployeeStateFromSupabase(account);
  document.body.classList.toggle('employee-mode', account.role === 'employee');
  document.body.classList.toggle('admin-mode', account.role === 'admin');
  $('#loginShell').hidden = true;
  updateAccountChrome(account);
  renderProjectOptions();
  const person = rosterPersonFor(account);
  if (person) $('#taskInput').value = projectFor(person, rosterSource().findIndex(item => item.email === person.email));
  if ($('#taskNoteInput')) $('#taskNoteInput').value = state.running?.note || '';
  syncOwnLivePresence();
  if (interval) clearInterval(interval);
  if (state.running || state.lunch) interval = setInterval(render, 1000);
  render();
  showPage();
}

async function signOutForInactiveAccess() {
  const message = 'Your Sync2Time access is inactive. Please contact HR if you need help.';
  currentAccount = null;
  currentProfile = null;
  supabaseSession = null;
  sessionStorage.removeItem('sync2time-supabase-session');
  if (supabaseClient) await supabaseClient.auth.signOut();
  document.body.classList.remove('employee-mode', 'admin-mode');
  $('#loginShell').hidden = false;
  setLoginMessage(message);
  render();
  showPage();
}

async function applySupabaseSession(session) {
  supabaseSession = session;
  const { data, error } = await supabaseClient.from('profiles').select('*').eq('id', session.user.id).single();
  if (error || !data) {
    $('#loginError').textContent = 'Login worked, but this user does not have a Sync2Time profile row yet. Create the matching row in public.profiles.';
    $('#loginError').hidden = false;
    await supabaseClient.auth.signOut();
    supabaseSession = null;
    currentProfile = null;
    return false;
  }
  if (!isAllowedAccessRole(data.role)) {
    await signOutForInactiveAccess();
    return false;
  }
  currentProfile = data;
  await refreshSupabaseData();
  sessionStorage.setItem('sync2time-supabase-session', 'true');
  applyAccess(accountFromProfile(data));
  return true;
}

async function clockOutActiveSession(message = 'Clocked out. Nice work.') {
  if (!state.running || longSessionClockOutPending) return;
  longSessionClockOutPending = true;
  const running = state.running;
  const end = Date.now();
  await completeSupabaseTimeEntry(end);
  await loadSupabaseTimeEntries();
  state.entries.unshift({ task: running.task, seconds: secondsBetween(running.start, end), start: running.start, end });
  state.clockOut = end;
  state.running = null;
  longSessionDeadline = null;
  $('#longSessionBackdrop').hidden = true;
  if (interval) clearInterval(interval);
  interval = null;
  removeLivePresence(currentAccount.email);
  save();
  syncOwnLivePresence();
  render();
  longSessionClockOutPending = false;
  showToast(message);
}

function reconcileAdminClockOut() {
  if (currentAccount?.role !== 'employee' || !state.running || longSessionClockOutPending) return;
  const remoteEntry = supabaseTimeEntries.find(entry => entry.id === state.running.timeEntryId);
  if (!remoteEntry || remoteEntry.status === 'working' || !remoteEntry.clock_out) return;
  const running = state.running;
  const end = new Date(remoteEntry.clock_out).getTime();
  state.entries.unshift({ task: running.task, seconds: secondsBetween(running.start, end), start: running.start, end });
  state.clockOut = end;
  state.running = null;
  longSessionDeadline = null;
  $('#longSessionBackdrop').hidden = true;
  if (interval) clearInterval(interval);
  interval = null;
  save();
  render();
  showToast('An administrator clocked you out.');
}

async function adminClockOutEmployee(button) {
  if (currentAccount?.role !== 'admin') return;
  const employeeId = button.dataset.adminClockout;
  const email = decodeURIComponent(button.dataset.clockoutEmail || '');
  const name = decodeURIComponent(button.dataset.clockoutName || 'Employee');
  if (!confirm(`Clock out ${name} now? Their active time entry will end immediately.`)) return;
  button.disabled = true;
  const end = new Date().toISOString();
  if (usesSupabase()) {
    const timeUpdate = await supabaseClient.from('time_entries').update({ clock_out: end, status: 'completed' }).eq('employee_id', employeeId).eq('status', 'working');
    if (timeUpdate.error) {
      button.disabled = false;
      showToast(`Clock-out error: ${timeUpdate.error.message}`);
      return;
    }
    const presenceDelete = await supabaseClient.from('live_presence').delete().eq('employee_id', employeeId);
    if (presenceDelete.error) showToast(`Time ended, but live status error: ${presenceDelete.error.message}`);
    if ($('#deletedTimeRows') && employeeId) {
      await supabaseClient.from('app_notifications').insert({
        employee_id: employeeId,
        type: 'admin_clock_out',
        title: 'Clocked out by admin',
        message: `Your active work session was clocked out by HR Admin at ${formatClock(end)}.`,
        is_read: false
      });
    }
    await loadSupabaseTimeEntries();
    await loadSupabaseLivePresence();
  } else {
    localStorage.setItem(LIVE_PRESENCE_KEY, JSON.stringify(readLivePresence().filter(record => record.email !== email)));
  }
  renderTeamDirectory();
  renderLiveTeam();
  renderAttendance();
  renderScheduleWatch();
  renderReports();
  showToast(`${name} was clocked out.`);
}

async function clearEmployeeDryRunTime(button) {
  if (currentAccount?.role !== 'admin') return;
  const employeeId = button.dataset.clearEmployeeTime;
  const email = decodeURIComponent(button.dataset.clearTimeEmail || '');
  const name = decodeURIComponent(button.dataset.clearTimeName || 'Employee');
  if (!confirm(`Permanently delete ALL logged time for ${name}? Use this only to clean dry-run records before launch.`)) return;
  const confirmation = prompt(`Type CLEAR to permanently remove every time entry for ${name}.`);
  if (confirmation !== 'CLEAR') return showToast('Time cleanup cancelled.');
  button.disabled = true;
  if (usesSupabase()) {
    const deleted = await supabaseClient.from('time_entries').delete().eq('employee_id', employeeId);
    if (deleted.error) {
      button.disabled = false;
      return showToast(`Cleanup error: ${deleted.error.message}`);
    }
    await supabaseClient.from('live_presence').delete().eq('employee_id', employeeId);
    await supabaseClient.from('app_notifications').insert({
      employee_id: employeeId,
      type: 'dry_run_cleanup',
      title: 'Dry-run time cleared',
      message: 'HR Admin removed all test time entries before final use.',
      meta: { clearedAt: new Date().toISOString(), clearedBy: currentProfile?.id || null }
    });
    await loadSupabaseTimeEntries();
    await loadSupabaseLivePresence();
  } else {
    supabaseTimeEntries = supabaseTimeEntries.filter(entry => entry.employee_id !== employeeId);
    localStorage.setItem(LIVE_PRESENCE_KEY, JSON.stringify(readLivePresence().filter(record => record.email !== email)));
  }
  renderAttendance();
  renderLiveTeam();
  renderScheduleWatch();
  renderReports();
  renderPayroll();
  renderTeamDirectory();
  showToast(`All dry-run time for ${name} was deleted.`);
}

function checkLongSession() {
  if (currentAccount?.role !== 'employee' || !state.running || longSessionClockOutPending) return;
  const runningSeconds = secondsBetween(state.running.start, Date.now());
  const nextCheckAt = Number(state.running.nextLongSessionCheckAt) || (new Date(state.running.start).getTime() + LONG_SESSION_SECONDS * 1000);
  if (runningSeconds < LONG_SESSION_SECONDS || Date.now() < nextCheckAt) return;
  if (!longSessionDeadline) longSessionDeadline = Date.now() + LONG_SESSION_RESPONSE_SECONDS * 1000;
  $('#longSessionBackdrop').hidden = false;
  const remaining = Math.max(0, Math.ceil((longSessionDeadline - Date.now()) / 1000));
  $('#longSessionCountdown').textContent = remaining;
  if (remaining === 0) clockOutActiveSession('Automatically clocked out because the 3-hour work-session prompt was not answered.');
}

$('#toggleTimer').onclick = async () => {
  if (currentAccount?.role !== 'employee') return;
  if (state.running) {
    await clockOutActiveSession();
    if ($('#taskNoteInput')) $('#taskNoteInput').value = '';
    return;
  } else {
    const task = $('#taskInput').value || 'Untitled task';
    const note = $('#taskNoteInput').value.trim();
    const start = Date.now();
    const timeEntryId = await createSupabaseTimeEntry(task, start);
    if (usesSupabase() && !timeEntryId) return;
    await loadSupabaseTimeEntries();
    state.running = { task, note, start, timeEntryId, nextLongSessionCheckAt: start + LONG_SESSION_SECONDS * 1000 };
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

$('#continueWorking').onclick = () => {
  if (!state.running) return;
  state.running.nextLongSessionCheckAt = Date.now() + LONG_SESSION_SECONDS * 1000;
  longSessionDeadline = null;
  $('#longSessionBackdrop').hidden = true;
  save();
  showToast('Work session continued. We will check again in 3 hours.');
};

$('#warningClockOut').onclick = () => clockOutActiveSession('Clocked out from the work-session check.');

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

$('#taskInput').onchange = async () => {
  if (!state.running) return;
  state.running.task = $('#taskInput').value || 'Untitled task';
  save();
  await updateSupabaseRunningTask(state.running.task);
  syncOwnLivePresence();
};

$('#taskNoteInput').oninput = () => {
  if (!state.running) return;
  state.running.note = $('#taskNoteInput').value.trim();
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
  const paystubEmail = ($('#employeePaystubEmail').value.trim() || email).toLowerCase();
  const jobRole = $('#employeeRole').value.trim();
  const department = $('#employeeDepartment').value.trim() || 'Added by admin';
  const task = $('#employeeProject').value || taskOptions[0];
  const password = $('#employeePassword').value.trim();
  const rate = parseEmployeeRate($('#employeeRate').value);
  const rateType = $('#employeeRateType').value || '';
  const scheduledStart = timeInputToMinutes($('#employeeScheduleStart').value);
  const scheduledEnd = timeInputToMinutes($('#employeeScheduleEnd').value);
  const editableRecords = editableEmployeeRecords();
  const old = editableRecords.find(item => item.id === editingEmployeeId) || managedEmployees.find(item => item.id === editingEmployeeId);
  const duplicate = editableRecords.find(item =>
    item.email?.toLowerCase() === email &&
    item.id !== editingEmployeeId
  );
  if (duplicate) {
    $('#employeeFormError').textContent = 'That email already has employee access.';
    $('#employeeFormError').hidden = false;
    return;
  }
  const record = {
    id: editingEmployeeId || crypto.randomUUID(),
    name,
    email,
    jobRole,
    task,
    department,
    initials: initials(name),
    tempPassword: password || old?.tempPassword || randomPassword(),
    newPassword: password || '',
    hash: password ? await hashPassword(password) : old?.hash,
    rate,
    rateType,
    scheduledStart,
    scheduledEnd,
    paystubEmail
  };
  if (usesSupabase()) {
    const result = await upsertSupabaseEmployee(record);
    if (!result.ok) {
      $('#employeeFormError').textContent = result.error;
      $('#employeeFormError').hidden = false;
      return;
    }
    record.id = result.employeeId || record.id;
    record.paystubEmail = result.recipientEmail || record.paystubEmail;
    await refreshSupabaseData();
  }
  const storedRecord = { ...record };
  delete storedRecord.newPassword;
  const storedIndex = managedEmployees.findIndex(item =>
    item.id === storedRecord.id ||
    item.id === old?.id ||
    item.email?.toLowerCase() === old?.email?.toLowerCase() ||
    item.email?.toLowerCase() === storedRecord.email
  );
  if (storedIndex >= 0) {
    managedEmployees = managedEmployees.map((item, index) => index === storedIndex ? storedRecord : item);
  } else {
    managedEmployees.push(storedRecord);
  }
  persistEmployees();
  renderManagedEmployees();
  renderTeamDirectory();
  closeEmployeeForm();
  showToast(old ? 'Employee access updated.' : 'Employee access created.');
};

$('#leaveForm').onsubmit = async event => {
  event.preventDefault();
  const date = $('#leaveDate').value;
  const conflict = leaveRequests.find(request => request.date === date && request.employeeEmail !== currentAccount.email && request.status !== 'rejected');
  if (conflict) {
    $('#leaveFormError').textContent = `${conflict.employeeName} already has leave filed for this date.`;
    $('#leaveFormError').hidden = false;
    return;
  }
  if (usesSupabase()) {
    const { error } = await supabaseClient.from('leave_requests').insert({
      employee_id: currentProfile.id,
      leave_date: date,
      reason: $('#leaveReason').value.trim(),
      status: 'pending'
    });
    if (error) {
      $('#leaveFormError').textContent = error.message.includes('one_active_leave_per_day') ? 'Someone already has leave filed for this date.' : error.message;
      $('#leaveFormError').hidden = false;
      return;
    }
    await loadSupabaseRequests();
  } else {
    leaveRequests.push({ id: crypto.randomUUID(), employeeName: currentAccount.name, employeeEmail: currentAccount.email, date, reason: $('#leaveReason').value.trim(), status: 'pending', createdAt: businessDateTimeLabel(new Date()) });
    persistLeaveRequests();
  }
  closeLeaveForm();
  renderEmployeeRequests();
  renderApprovals();
  showToast('Leave request submitted for admin approval.');
};

$('#timeEditForm').onsubmit = async event => {
  event.preventDefault();
  if (usesSupabase()) {
    const { error } = await supabaseClient.from('time_edit_requests').insert({
      employee_id: currentProfile.id,
      requested_date: $('#timeEditDate').value,
      requested_clock_in: $('#timeEditIn').value,
      requested_clock_out: $('#timeEditOut').value,
      reason: $('#timeEditReason').value.trim(),
      status: 'pending'
    });
    if (error) {
      $('#timeEditFormError').textContent = error.message;
      $('#timeEditFormError').hidden = false;
      return;
    }
    await loadSupabaseRequests();
  } else {
    timeEditRequests.push({ id: crypto.randomUUID(), employeeName: currentAccount.name, employeeEmail: currentAccount.email, date: $('#timeEditDate').value, clockIn: $('#timeEditIn').value, clockOut: $('#timeEditOut').value, reason: $('#timeEditReason').value.trim(), status: 'pending', createdAt: businessDateTimeLabel(new Date()) });
    persistTimeEditRequests();
  }
  closeTimeEditForm();
  renderEmployeeRequests();
  renderApprovals();
  showToast('Time edit request submitted for admin approval.');
};

$('#overtimeForm').onsubmit = async event => {
  event.preventDefault();
  const date = $('#overtimeDate').value;
  const hours = Number($('#overtimeHours').value);
  const reason = $('#overtimeReason').value.trim();
  if (usesSupabase()) {
    const { error } = await supabaseClient.from('overtime_requests').insert({
      employee_id: currentProfile.id,
      overtime_date: date,
      hours,
      reason,
      status: 'pending'
    });
    if (error) {
      $('#overtimeFormError').textContent = error.message;
      $('#overtimeFormError').hidden = false;
      return;
    }
    await loadSupabaseRequests();
  } else {
    overtimeRequests.unshift({ id: crypto.randomUUID(), employeeId: currentAccount.id, employeeName: currentAccount.name, employeeEmail: currentAccount.email, date, hours, reason, status: 'pending', createdAt: new Date().toISOString() });
    persistOvertimeRequests();
  }
  closeOvertimeForm();
  renderEmployeeRequests();
  renderApprovals();
  showToast('Overtime request submitted.');
};

$('#coachingUpload').onchange = async event => {
  const files = [...event.target.files];
  const uploadedAt = businessDateLabel(new Date());
  if (usesSupabase()) {
    for (const file of files) {
      const path = `${currentProfile.id}/${Date.now()}-${file.name}`;
      const upload = await supabaseClient.storage.from('coaching-documents').upload(path, file, { upsert: false });
      if (upload.error) {
        showToast(`Upload error: ${upload.error.message}`);
        continue;
      }
      const { error } = await supabaseClient.from('coaching_documents').insert({
        employee_id: currentProfile.id,
        file_name: file.name,
        file_path: path
      });
      if (error) showToast(`Document record error: ${error.message}`);
    }
    await loadSupabaseDocuments();
  } else {
    files.forEach(file => coachingDocuments.push({ id: crypto.randomUUID(), employeeName: currentAccount.name, employeeEmail: currentAccount.email, name: file.name, size: `${Math.ceil(file.size / 1024)} KB`, uploadedAt }));
    persistDocuments();
  }
  renderDocuments();
  event.target.value = '';
  showToast(`${files.length} coaching document${files.length === 1 ? '' : 's'} added.`);
};

$('#loginForm').onsubmit = async event => {
  event.preventDefault();
  const email = $('#loginEmail').value.trim().toLowerCase();
  const password = $('#loginPassword').value;
  const submitButton = event.submitter || $('#loginForm button[type="submit"]');
  if (submitButton) submitButton.disabled = true;
  setLoginMessage('Signing in… please wait.', false);
  try {
    if (supabaseClient) {
      const { data, error } = await withTimeout(
        supabaseClient.auth.signInWithPassword({ email, password }),
        15000,
        'Supabase did not respond. Check your internet connection, Supabase URL/key, or try the deployed GitHub Pages site instead of opening the file directly.'
      );
      if (!error && data.session) {
        clearLoginMessage();
        const ready = await applySupabaseSession(data.session);
        if (ready) showToast(`Welcome back, ${currentAccount.name}.`);
        return;
      }
      if (error) {
        setLoginMessage(`Supabase login error: ${error.message}`);
        return;
      }
      setLoginMessage('Supabase sign-in is required for the live shared website.');
      return;
    }
    const passwordHash = await hashPassword($('#loginPassword').value);
    const employee = managedEmployees.find(item => item.email === email && item.hash === passwordHash);
    const account = adminAccount.email === email && adminAccount.hash === passwordHash ? adminAccount : employee && { ...employee, role: 'employee' };
    if (!account) {
      setLoginMessage('That email and password combination was not recognized.');
      return;
    }
    clearLoginMessage();
    sessionStorage.setItem('minute-session', JSON.stringify(account));
    applyAccess(account);
    showToast(`Welcome back, ${account.name}.`);
  } catch (error) {
    setLoginMessage(error.message || 'Sign in failed. Please try again.');
  } finally {
    if (submitButton) submitButton.disabled = false;
  }
};

$('#profileButton').onclick = async () => {
  if (usesSupabase()) {
    removeLivePresence(currentAccount?.email);
    await supabaseClient.auth.signOut();
  }
  sessionStorage.removeItem('minute-session');
  sessionStorage.removeItem('sync2time-supabase-session');
  currentAccount = null;
  currentProfile = null;
  supabaseSession = null;
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
      const access = { id: crypto.randomUUID(), name, email: email.toLowerCase(), jobRole: jobRole || 'Employee', department: 'Imported', task: taskOptions[0], initials: initials(name), tempPassword: password, hash: await hashPassword(password), rate: null, rateType: '', scheduledStart: null, scheduledEnd: null, paystubEmail: email.toLowerCase(), newPassword: password };
      if (usesSupabase() && currentProfile?.role === 'admin') {
        const result = await upsertSupabaseEmployee(access);
        if (!result.ok) continue;
        access.id = result.employeeId || access.id;
      }
      managedEmployees.push(access);
      added++;
    }
    persistEmployees();
    if (usesSupabase()) await refreshSupabaseData();
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
  const id = $('#manageEmployeeSelect').value;
  if (!id) return showToast('Choose an employee first.');
  openEmployeeEditor(id);
};
$('#deleteEmployee').onclick = () => {
  const id = $('#manageEmployeeSelect').value;
  if (!id) return showToast('Choose an employee first.');
  offboardEmployeeAccess(id);
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
$('#overtimeModalClose').onclick = closeOvertimeForm;
$('#overtimeModalCancel').onclick = closeOvertimeForm;
$('#overtimeModalBackdrop').onclick = event => { if (event.target === event.currentTarget) closeOvertimeForm(); };
$('#employeeDetailClose').onclick = closeEmployeeDetail;
$('#detailDone').onclick = closeEmployeeDetail;
$('#employeeDetailBackdrop').onclick = event => { if (event.target === event.currentTarget) closeEmployeeDetail(); };
$('#approvalDetailClose').onclick = closeApprovalDetail;
$('#approvalDetailCancel').onclick = closeApprovalDetail;
$('#approvalDetailBackdrop').onclick = event => { if (event.target === event.currentTarget) closeApprovalDetail(); };
$('#approvalDetailApprove').onclick = async () => {
  if (!selectedApprovalRequest) return;
  const ok = await setRequestStatus(selectedApprovalRequest.type, selectedApprovalRequest.id, 'approved');
  if (ok) closeApprovalDetail();
};
$('#approvalDetailReject').onclick = async () => {
  if (!selectedApprovalRequest) return;
  const ok = await setRequestStatus(selectedApprovalRequest.type, selectedApprovalRequest.id, 'rejected');
  if (ok) closeApprovalDetail();
};
$('#reportDetailClose').onclick = closeReportDetail;
$('#reportDetailDone').onclick = closeReportDetail;
$('#reportDetailBackdrop').onclick = event => { if (event.target === event.currentTarget) closeReportDetail(); };

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  if (!$('#modalBackdrop').hidden) $('#modalBackdrop').hidden = true;
  if (!$('#employeeModalBackdrop').hidden) closeEmployeeForm();
  if (!$('#employeeDetailBackdrop').hidden) closeEmployeeDetail();
  if (!$('#approvalDetailBackdrop').hidden) closeApprovalDetail();
  if (!$('#reportDetailBackdrop').hidden) closeReportDetail();
  if (!$('#leaveModalBackdrop').hidden) closeLeaveForm();
  if (!$('#timeEditModalBackdrop').hidden) closeTimeEditForm();
  if (!$('#overtimeModalBackdrop').hidden) closeOvertimeForm();
  if (!$('#payrollAdjustmentBackdrop').hidden) closePayrollAdjustment();
  if (!$('#exportBackdrop').hidden) $('#exportBackdrop').hidden = true;
  if (!$('#payrollRowBackdrop').hidden) closePayrollRowEditor();
});

$('#employeeSearch').oninput = renderAttendance;
$('#statusFilter').onchange = renderAttendance;
$('#dateFilter').onchange = renderAttendance;
$('#exportButton').onclick = () => showToast('Employees can view time here; exports are for admin reports.');
$('#attendanceExport').onclick = () => exportCsv('sync2time-attendance-report.csv', ['Employee,Role,Date,Clock in,Clock out,Worked,Status', ...rosterSource().map(person => `"${person.name}","${person.role}","${person.date}","${person.clockIn}","${person.clockOut}","${person.worked}","${person.status === 'clocked' ? 'Clocked in' : 'Complete'}"`)].join('\n'), 'Attendance report exported as CSV.');
$('#scheduleExport').onclick = () => exportCsv('sync2time-schedule-watch.csv', ['Employee,Role,Schedule,Clock in,Clock out,Rate,Earnings,Attendance note', ...rosterSource().map(person => `"${person.name}","${person.role}","${person.schedule}","${person.clockIn}","${person.clockOut}","${rateLabel(person)}","${money(employeeEarnings(person))}","${scheduleStatus(person).label}"`)].join('\n'), 'Schedule watch exported as CSV.');
$('#reportPeriod').onchange = () => {
  syncReportDatesFromPeriod();
  renderReports();
};
$('#employeeReportPeriod').onchange = () => {
  syncEmployeeReportDatesFromPeriod();
  renderEmployeeHoursReport();
};
['reportStart', 'reportEnd'].forEach(id => {
  const input = $(`#${id}`);
  input.onchange = () => {
    $('#reportPeriod').value = 'custom';
    if ($('#reportStart').value && $('#reportEnd').value && $('#reportStart').value > $('#reportEnd').value) {
      if (id === 'reportStart') $('#reportEnd').value = $('#reportStart').value;
      else $('#reportStart').value = $('#reportEnd').value;
    }
    renderReports();
  };
});
['employeeReportStart', 'employeeReportEnd'].forEach(id => {
  const input = $(`#${id}`);
  input.onchange = () => {
    $('#employeeReportPeriod').value = 'custom';
    if ($('#employeeReportStart').value && $('#employeeReportEnd').value && $('#employeeReportStart').value > $('#employeeReportEnd').value) {
      if (id === 'employeeReportStart') $('#employeeReportEnd').value = $('#employeeReportStart').value;
      else $('#employeeReportStart').value = $('#employeeReportEnd').value;
    }
    renderEmployeeHoursReport();
  };
});
$('#reportEmployee').oninput = renderReports;
$('#reportExport').onclick = () => {
  const { start, end, period } = reportRange();
  const rows = currentReportRows.map(row => [
    row.name, row.email, row.role, businessDateLabel(start), businessDateLabel(end), period, row.entries,
    (row.seconds / 3600).toFixed(2), row.deductedHours.toFixed(2), row.deductedAmount.toFixed(2),
    row.commission.toFixed(2), (row.payableSeconds / 3600).toFixed(2), row.pay.toFixed(2),
    row.netPay.toFixed(2), row.adjustment?.note || ''
  ].map(csvCell).join(','));
  const header = ['Employee', 'Email', 'Role', 'From', 'To', 'Period', 'Entries', 'Worked Hours', 'Deducted Hours', 'Deducted Amount USD', 'Commission USD', 'Payable Hours', 'Gross Pay USD', 'Net Pay USD', 'Adjustment Note'];
  exportCsv(`sync2time-payroll-${isoDate(start)}-to-${isoDate(end)}.csv`, [header.map(csvCell).join(','), ...rows].join('\r\n'), 'Payroll report exported as CSV.');
};

$('#payrollTabs').onclick = event => {
  const tab = event.target.closest('[data-payroll-role]');
  if (!tab) return;
  selectedPayrollRole = tab.dataset.payrollRole;
  renderPayroll();
};
$('#payrollCutoff').onchange = renderPayroll;
$('#payrollFxRate').onchange = async () => {
  const rate = Number($('#payrollFxRate').value);
  if (!(rate > 0)) return showToast('Enter a valid USD to PHP rate.');
  const previous = manualPayrollFxOverride;
  manualPayrollFxOverride = rate;
  localStorage.setItem('sync2time-payroll-usd-php', String(rate));
  if (usesSupabase()) {
    try {
      await saveSupabaseSetting('payroll_usd_php_override', { rate, updatedAt: new Date().toISOString() });
    } catch (error) {
      manualPayrollFxOverride = previous;
      if (previous > 0) localStorage.setItem('sync2time-payroll-usd-php', String(previous));
      else localStorage.removeItem('sync2time-payroll-usd-php');
      showToast(`Payroll rate sync error: ${error.message}`);
      renderPayroll();
      return;
    }
  }
  renderPayroll();
};
$('#resetPayrollFx').onclick = async () => {
  const previous = manualPayrollFxOverride;
  manualPayrollFxOverride = null;
  localStorage.removeItem('sync2time-payroll-usd-php');
  if (usesSupabase()) {
    try {
      await saveSupabaseSetting('payroll_usd_php_override', { rate: null, updatedAt: new Date().toISOString() });
    } catch (error) {
      manualPayrollFxOverride = previous;
      if (previous > 0) localStorage.setItem('sync2time-payroll-usd-php', String(previous));
      showToast(`Payroll rate sync error: ${error.message}`);
      renderPayroll();
      return;
    }
  }
  refreshPayrollUsdPhpRate();
  showToast('Live/reference USD to PHP rate restored.');
};
$('#payrollExport').onclick = () => {
  const { start, end } = payrollRange();
  let header;
  let rows;
  if (selectedPayrollRole === 'coaches') {
    header = ['Employee', 'Role', 'Expected Hours', 'Actual Hours', 'Approved OT Hours', 'USD Hourly Rate', 'PHP Rate', 'Gross USD Pay', 'Gross PHP Pay', 'Adjustments PHP', 'Net Pay PHP', 'Notes'];
    rows = currentPayrollRows.map(row => [row.person.name, row.person.role, row.expectedHours.toFixed(2), row.actualHours.toFixed(2), row.otHours.toFixed(2), row.hourlyUsd.toFixed(2), payrollUsdPhpRate().toFixed(4), row.grossUsd.toFixed(2), row.grossPhp.toFixed(2), row.adjustment.toFixed(2), row.netPay.toFixed(2), row.note]);
  } else if (selectedPayrollRole === 'admin') {
    header = ['Employee', 'Role', 'Expected Hours', 'Actual Hours', 'Approved OT Hours', 'Cutoff Pay PHP', 'OT Pay PHP', 'Gross Pay PHP', 'Deductions PHP', 'Commission PHP', 'Net Pay PHP', 'Notes'];
    rows = currentPayrollRows.map(row => [row.person.name, row.person.role, row.expectedHours.toFixed(2), row.actualHours.toFixed(2), row.otHours.toFixed(2), row.cutoffPay.toFixed(2), row.otPay.toFixed(2), row.grossPhp.toFixed(2), row.deductions.toFixed(2), row.commission.toFixed(2), row.netPay.toFixed(2), row.note]);
  } else {
    header = ['Employee', 'Role', 'Gross Pay PHP', 'Deductions PHP', 'Commission PHP', 'Net Pay PHP', 'Notes'];
    rows = currentPayrollRows.map(row => [row.person.name, row.person.role, row.grossPhp.toFixed(2), row.deductions.toFixed(2), row.commission.toFixed(2), row.netPay.toFixed(2), row.note]);
  }
  const csv = [header, ...rows].map(row => row.map(csvCell).join(',')).join('\r\n');
  exportCsv(`sync2time-${selectedPayrollRole}-payroll-${isoDate(start)}-to-${isoDate(end)}.csv`, csv, `${selectedPayrollRole} payroll exported.`);
};
$('#sendPaystubs').onclick = sendApprovedPaystubs;

function csvCell(value) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`;
}

function exportCsv(filename, text, message) {
  const content = '\uFEFF' + text;
  const dataUrl = `data:text/csv;charset=utf-8,${encodeURIComponent(content)}`;
  const link = $('#downloadExportCsv');
  link.href = dataUrl;
  link.download = filename;
  $('#exportCsvPreview').value = text;
  $('#exportBackdrop').hidden = false;
  link.click();
  showToast(`${message} If no file appeared, click Download CSV in the open panel.`);
}

async function createDeletedTimeNotice({ employeeId, employeeName, timeLabel, reason, timeEntryId }) {
  const message = `${employeeName}'s time entry (${timeLabel}) was deleted by admin.${reason ? ' Reason: ' + reason : ''}`;
  const notice = {
    id: crypto.randomUUID(),
    employeeId,
    employeeName,
    title: 'A time entry was deleted',
    message,
    createdAt: new Date().toISOString()
  };
  if (usesSupabase()) {
    const { error } = await supabaseClient.from('app_notifications').insert({
      employee_id: employeeId,
      type: 'deleted_time',
      title: notice.title,
      message,
      meta: { timeEntryId, timeLabel, reason: reason || '', deletedBy: currentProfile?.id || null }
    });
    if (error) {
      showToast(`Time deleted, but notification table needs setup: ${error.message}`);
      console.error('Deleted-time notification insert failed:', error.message);
      return false;
    }
    await loadSupabaseNotifications();
  } else {
    deletedTimeAlerts.unshift(notice);
    persistDeletedTimeAlerts();
  }
  return true;
}

async function deleteEmployeeTimeEntry(button) {
  if (currentAccount?.role !== 'admin') return;
  const id = button.dataset.deleteTime;
  const employeeId = button.dataset.employeeId;
  const employeeName = decodeURIComponent(button.dataset.employeeName || 'Employee');
  const timeLabel = decodeURIComponent(button.dataset.timeLabel || 'selected time');
  if (!confirm(`Delete ${employeeName}'s time entry (${timeLabel})? The employee will be notified.`)) return;
  const reason = prompt('Optional: reason for deleting this time entry', 'Admin deleted incorrect time entry') || '';
  if (usesSupabase()) {
    const update = await supabaseClient.from('time_entries').update({ status: 'deleted' }).eq('id', id);
    if (update.error) {
      const hardDelete = await supabaseClient.from('time_entries').delete().eq('id', id);
      if (hardDelete.error) return showToast(`Delete error: ${hardDelete.error.message}`);
    }
    const notified = await createDeletedTimeNotice({ employeeId, employeeName, timeLabel, reason, timeEntryId: id });
    await loadSupabaseTimeEntries();
    if (!notified) return showToast('Time was deleted, but the employee notification failed. Run the updated notification SQL.');
  } else {
    supabaseTimeEntries = supabaseTimeEntries.filter(entry => entry.id !== id);
    await createDeletedTimeNotice({ employeeId, employeeName, timeLabel, reason, timeEntryId: id });
  }
  renderAttendance();
  renderReports();
  renderDeletedTimeAlerts();
  showToast('Time entry deleted and employee notice created.');
}

$$('[data-schedule-filter]').forEach(button => button.onclick = () => {
  scheduleFilter = button.dataset.scheduleFilter;
  $$('[data-schedule-filter]').forEach(item => item.classList.toggle('active', item === button));
  renderScheduleWatch();
});

$('#projectOptions').onclick = event => {
  const button = event.target.closest('[data-project]');
  if (!button) return;
  selectedProject = button.dataset.project;
  renderProjects();
};

$('#projectForm').onsubmit = async event => {
  event.preventDefault();
  const project = $('#projectName').value.trim();
  if (!project) return;
  if (taskOptions.some(item => item.toLowerCase() === project.toLowerCase())) return showToast('That project already exists.');
  if (usesSupabase()) {
    try {
      await saveSupabaseProject(project);
      await loadSupabaseProjects();
    } catch (error) {
      return showToast(`Project sync error: ${error.message}`);
    }
  } else {
    taskOptions.push(project);
    persistProjects();
  }
  $('#projectForm').reset();
  selectedProject = project;
  renderProjectOptions();
  renderProjects();
  showToast(`${project} project added.`);
};

$('#projectClear').onclick = () => {
  selectedProject = 'All';
  $$('[data-project]').forEach(item => item.classList.toggle('active', item.dataset.project === 'All'));
  renderProjects();
};

['liveTeamRows', 'scheduleRows', 'projectRows', 'teamRows', 'attendanceRows'].forEach(id => {
  $(`#${id}`).onclick = event => {
    if (event.target.closest('[data-delete-time], [data-admin-clockout], [data-clear-employee-time], [data-offboard-employee], [data-edit-employee]')) return;
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

$('#reportRows').onclick = event => {
  if (event.target.closest('[data-edit-adjustment]')) return;
  const row = event.target.closest('[data-report-employee]');
  if (row) openReportDetail(row.dataset.reportEmployee, decodeURIComponent(row.dataset.reportName || ''));
};
$('#reportRows').onkeydown = event => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  const row = event.target.closest('[data-report-employee]');
  if (row) {
    event.preventDefault();
    openReportDetail(row.dataset.reportEmployee, decodeURIComponent(row.dataset.reportName || ''));
  }
};

['leaveApprovalRows', 'timeEditApprovalRows', 'overtimeApprovalRows'].forEach(id => {
  $(`#${id}`).onclick = event => {
    if (event.target.closest('[data-approve], [data-reject]')) return;
    const row = event.target.closest('[data-approval-type]');
    if (row) openApprovalDetail(row.dataset.approvalType, row.dataset.approvalId);
  };
  $(`#${id}`).onkeydown = event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const row = event.target.closest('[data-approval-type]');
    if (row) {
      event.preventDefault();
      openApprovalDetail(row.dataset.approvalType, row.dataset.approvalId);
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

$('#calendarPrev').onclick = () => { calendarCursor = addBusinessMonths(calendarCursor, -1); renderHolidayCalendar(); };
$('#calendarNext').onclick = () => { calendarCursor = addBusinessMonths(calendarCursor, 1); renderHolidayCalendar(); };
$('#holidayCalendar').onclick = event => {
  const day = event.target.closest('[data-calendar-date]');
  if (!day) return;
  const holiday = philippineHolidays2026.find(item => item.date === day.dataset.calendarDate);
  showToast(holiday ? `${holiday.name}: ${holiday.type === 'regular' ? '2x regular-holiday pay applies.' : 'special non-working day.'}` : `${businessDateLabel(businessDateFromKey(day.dataset.calendarDate), { month: 'long', day: 'numeric' })}: no listed holiday.`);
};
$('#paydayCard').onclick = () => showToast($('#paydayMessage').textContent);
$('#paydayCard').onkeydown = event => cardKeyAction(event, () => showToast($('#paydayMessage').textContent));

$('#leaveCalendarPrev').onclick = () => { leaveCalendarCursor = addBusinessMonths(leaveCalendarCursor, -1); renderLeaveCalendar(); };
$('#leaveCalendarNext').onclick = () => { leaveCalendarCursor = addBusinessMonths(leaveCalendarCursor, 1); renderLeaveCalendar(); };
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
$('#openOvertimeRequest').onclick = openOvertimeForm;

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

$('#payrollAdjustmentForm').onsubmit = savePayrollAdjustment;
$('#payrollAdjustmentClose').onclick = closePayrollAdjustment;
$('#payrollAdjustmentCancel').onclick = closePayrollAdjustment;
$('#payrollAdjustmentBackdrop').onclick = event => {
  if (event.target === event.currentTarget) closePayrollAdjustment();
};
$('#payrollRowForm').onsubmit = savePayrollRow;
$('#payrollRowClose').onclick = closePayrollRowEditor;
$('#payrollRowCancel').onclick = closePayrollRowEditor;
$('#payrollRowBackdrop').onclick = event => {
  if (event.target === event.currentTarget) closePayrollRowEditor();
};
$('#exportClose').onclick = () => { $('#exportBackdrop').hidden = true; };
$('#exportBackdrop').onclick = event => {
  if (event.target === event.currentTarget) $('#exportBackdrop').hidden = true;
};
$('#copyExportCsv').onclick = async () => {
  const preview = $('#exportCsvPreview');
  try {
    await navigator.clipboard.writeText(preview.value);
    showToast('CSV copied to clipboard.');
  } catch {
    preview.focus();
    preview.select();
    document.execCommand('copy');
    showToast('CSV copied to clipboard.');
  }
};

document.body.addEventListener('click', async event => {
  const offboardEmployee = event.target.closest('[data-offboard-employee]');
  if (offboardEmployee) {
    event.stopPropagation();
    await offboardEmployeeAccess(
      offboardEmployee.dataset.offboardEmployee || '',
      decodeURIComponent(offboardEmployee.dataset.offboardEmail || ''),
      decodeURIComponent(offboardEmployee.dataset.offboardName || '')
    );
    return;
  }
  const editEmployee = event.target.closest('[data-edit-employee]');
  if (editEmployee) {
    event.stopPropagation();
    openEmployeeEditor(
      editEmployee.dataset.editEmployee || '',
      decodeURIComponent(editEmployee.dataset.editEmail || ''),
      decodeURIComponent(editEmployee.dataset.editName || '')
    );
    return;
  }
  const clearTime = event.target.closest('[data-clear-employee-time]');
  if (clearTime) {
    event.stopPropagation();
    await clearEmployeeDryRunTime(clearTime);
    return;
  }
  const adminClockOut = event.target.closest('[data-admin-clockout]');
  if (adminClockOut) {
    event.stopPropagation();
    await adminClockOutEmployee(adminClockOut);
    return;
  }
  const adjustmentButton = event.target.closest('[data-edit-adjustment]');
  if (adjustmentButton) {
    event.stopPropagation();
    openPayrollAdjustment(adjustmentButton.dataset.editAdjustment);
    return;
  }
  const payrollEdit = event.target.closest('[data-payroll-edit]');
  if (payrollEdit) {
    event.stopPropagation();
    openPayrollRowEditor(payrollEdit.dataset.payrollEdit);
    return;
  }
  const payrollRecipient = event.target.closest('[data-payroll-recipient]');
  if (payrollRecipient) {
    event.stopPropagation();
    openPayrollRowEditor(payrollRecipient.dataset.payrollRecipient);
    return;
  }
  const approvePaystub = event.target.closest('[data-approve-paystub]');
  if (approvePaystub) {
    event.stopPropagation();
    await approvePayrollPaystub(approvePaystub.dataset.approvePaystub);
    return;
  }
  const paystub = event.target.closest('[data-paystub]');
  if (paystub) {
    event.stopPropagation();
    await buildEmployeePaystub(paystub.dataset.paystub);
    return;
  }
  const deleteTime = event.target.closest('[data-delete-time]');
  if (deleteTime) {
    event.stopPropagation();
    await deleteEmployeeTimeEntry(deleteTime);
    return;
  }
  const approve = event.target.closest('[data-approve]');
  const reject = event.target.closest('[data-reject]');
  if (!approve && !reject) return;
  const button = approve || reject;
  const type = button.dataset.approve || button.dataset.reject;
  const id = button.dataset.id;
  const status = approve ? 'approved' : 'rejected';
  await setRequestStatus(type, id, status);
});

(async function init() {
  if (!supabaseClient) await seedRosterAccess(false);
  initializeReportDates();
  subscribeSupabaseRealtime();
  renderManagedEmployees();
  renderProjectOptions();
  renderProjects();
  renderTeamDirectory();
  renderPayday();
  renderHolidayPay();
  renderHolidayCalendar();
  renderLeaveCalendar();
  renderApprovals();
  renderDocuments();
  renderDeletedTimeAlerts();
  renderReports();
  renderPayroll();
  refreshFxRate();
  refreshPayrollUsdPhpRate();
  if (supabaseClient) {
    const { data } = await supabaseClient.auth.getSession();
    if (data.session) {
      await applySupabaseSession(data.session);
    }
  }
  const savedSession = (!supabaseClient && !currentAccount) ? JSON.parse(sessionStorage.getItem('minute-session') || 'null') : null;
  if (savedSession) applyAccess(savedSession);
  else if (!currentAccount) {
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
