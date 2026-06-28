const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const palette = ['#e6aab1', '#bad7ed', '#f2d18a', '#c8d9b6', '#d8c1e8', '#f2b7a6', '#b9e2dc', '#e3d29d'];
let taskOptions = JSON.parse(localStorage.getItem('sync2time-project-options') || 'null') || ['Coaching', 'Meeting', 'On Class', 'Admin', 'Webinar', 'SMM'];
const todayDate = new Date();
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
let coachingDocuments = JSON.parse(localStorage.getItem('minute-coaching-documents') || '[]');
let state = emptyTimeState();
let currentAccount = null;
let currentProfile = null;
let supabaseSession = null;
let supabaseProfiles = [];
let supabaseLivePresence = [];
let supabaseTimeEntries = [];
let supabaseDeletedTimeEntries = [];
let deletedTimeAlerts = JSON.parse(localStorage.getItem('sync2time-deleted-time-alerts') || '[]');
let payrollAdjustments = JSON.parse(localStorage.getItem('sync2time-payroll-adjustments') || '[]');
let currentReportRows = [];
let editingPayrollAdjustment = null;
let deletedNoticeRepairAttempted = false;
let approvedTimeEditRepairAttempted = false;
let editingEmployeeId = null;
let interval;
let longSessionDeadline = null;
let longSessionClockOutPending = false;
const LONG_SESSION_SECONDS = 3 * 60 * 60;
const LONG_SESSION_RESPONSE_SECONDS = 60;
let scheduleFilter = 'checked-in';
let selectedProject = 'All';
let calendarCursor = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);
let leaveCalendarCursor = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);
let phpUsdRate = Number(localStorage.getItem('minute-php-usd-rate')) || FALLBACK_PHP_USD;
let fxRateDate = localStorage.getItem('minute-php-usd-date') || 'offline reference';
const liveCalculatorOpenedAt = Date.now();
const LIVE_PRESENCE_KEY = 'sync2time-live-presence';

$('#todayLabel').textContent = todayDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase();

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

function rosterSource() {
  if (!usesSupabase() || !supabaseProfiles.length) return employeeDirectory;
  const profilePeople = supabaseProfiles.map(profileToPerson).filter(Boolean);
  const merged = employeeDirectory.map(rosterEmployee => {
    const profileEmployee = profilePeople.find(person =>
      person.email?.toLowerCase() === rosterEmployee.email.toLowerCase() ||
      person.name?.toLowerCase() === rosterEmployee.name.toLowerCase()
    );
    if (!profileEmployee) return rosterEmployee;
    if (rosterEmployee.name === 'Claudine Angelica Pia D. San Juan') {
      return {
        ...profileEmployee,
        ...rosterEmployee,
        id: profileEmployee.id || rosterEmployee.id,
        email: 'claudine.sanjuan@sync2va.com',
        role: 'Head Coach',
        department: 'Intensive Course Dept',
        scheduledStart: 1140,
        scheduledEnd: 1260,
        schedule: '7:00 PM-9:00 PM',
        rate: 5,
        rateType: 'Hourly USD'
      };
    }
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
      task: record.task,
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
    clockInAt: state.running.start,
    lastSeen: Date.now(),
    status: 'working'
  });
}

function liveEmployees() {
  return readLivePresence().map((record, index) => {
    const roster = rosterSource().find(person => person.email === record.email || person.name === record.name);
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

function supabaseProfileFromLive(record) {
  return record.profiles || record.profile || supabaseProfiles.find(profile => profile.id === record.employee_id) || {};
}

function liveRecordFromSupabase(record) {
  const profile = supabaseProfileFromLive(record);
  return {
    email: profile.email || record.employee_id,
    employeeId: record.employee_id,
    name: profile.full_name || 'Employee',
    role: profile.job_role || 'Employee',
    department: profile.department || '',
    task: record.task || 'Working',
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
    date: clockIn ? clockIn.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Today',
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
}

async function applyApprovedTimeEdit(request, silent = false) {
  if (!usesSupabase() || !request?.employeeId) return { ok: false, message: 'The request is missing its employee ID.' };
  const start = new Date(`${request.date}T${request.clockIn}:00`);
  const end = new Date(`${request.date}T${request.clockOut}:00`);
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
    const requestedStart = new Date(`${request.date}T${request.clockIn}:00`).getTime();
    const requestedEnd = new Date(`${request.date}T${request.clockOut}:00`).getTime();
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
    uploadedAt: new Date(row.uploaded_at).toLocaleDateString()
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
  await loadSupabaseProfiles();
  await loadSupabaseLivePresence();
  await loadSupabaseTimeEntries();
  await loadPayrollAdjustments();
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
}

function subscribeSupabaseRealtime() {
  if (!supabaseClient) return;
  supabaseClient
    .channel('sync2time-realtime')
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
  return rosterSource().find(person => person.email === account?.email || person.name === account?.name);
}

function allRosterWithExtras() {
  const base = rosterSource();
  const extras = managedEmployees.filter(employee => !base.some(person => person.email === employee.email)).map((employee, index) => ({
    name: employee.name,
    email: employee.email,
    role: employee.jobRole,
    department: employee.department || 'Added by admin',
    task: employee.task || 'Not assigned',
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
  return [...base, ...extras];
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
  renderReports();
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
  const todayKey = new Date().toISOString().slice(0, 10);
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
    return `<div class="attendance-row" data-employee="${encodeURIComponent(person.name)}"><div class="person"><span class="person-avatar" style="background:${person.color}">${person.initials}</span><span>${person.name}<small>${person.role}</small></span></div><span class="attendance-date">${person.date}</span><span class="attendance-time">${person.clockIn}</span><span class="attendance-time">${person.clockOut}</span><span class="attendance-time">${person.worked}</span><span class="status ${person.status === 'clocked' ? 'live' : 'complete'}">${person.status === 'clocked' ? '? Clocked in' : 'Complete'}</span>${deleteButton}</div>`;
  }).join('') || '<div class="empty-state">No employees match these filters.</div>';
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
  select.innerHTML = '<option value="">Select employee</option>' + managedEmployees.map(employee => `<option value="${employee.id}">${escapeHtml(employee.name)} — ${escapeHtml(employee.email)}</option>`).join('');
  select.value = managedEmployees.some(employee => employee.id === selected) ? selected : '';
  $('#teamCount').textContent = rosterSource().length;
}

function renderTeamDirectory() {
  const roster = allRosterWithExtras();
  $('#teamRows').innerHTML = roster.map(person => {
    const access = managedEmployees.find(employee => employee.email === person.email || employee.name === person.name);
    const live = readLivePresence().some(record => record.employeeId === person.id || record.email === person.email);
    const passwordLine = access?.tempPassword ? `<small>${access.email} · Pass: ${access.tempPassword}</small>` : `<small>${person.department || 'Employee'}</small>`;
    const action = live ? `<button class="admin-clockout-btn" data-admin-clockout="${person.id || ''}" data-clockout-email="${encodeURIComponent(person.email || '')}" data-clockout-name="${encodeURIComponent(person.name)}">Clock out</button>` : '<button class="admin-clockout-btn" disabled>Not working</button>';
    return `<div class="team-row" role="button" tabindex="0" data-employee="${encodeURIComponent(person.name)}"><div class="person"><span class="person-avatar" style="background:${person.color}">${person.initials}</span><span>${person.name}${passwordLine}</span></div><span>${person.role}<small>${person.department || ''}</small></span><span class="schedule-shift">${person.schedule || 'Not assigned'}</span><span class="schedule-shift">${typeof person.rate === 'number' ? rateLabel(person) : person.rate || 'Pending'}</span><span class="access-state ${access ? '' : 'pending'}">${access ? 'Access active' : 'No access'}</span><span>${action}</span></div>`;
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
  const details = type === 'leave' ? `${request.date} - ${request.reason}` : `${request.date} | ${request.clockIn}-${request.clockOut} | ${request.reason}`;
  const actions = request.status === 'pending' ? `<div class="approval-actions"><button class="approve-btn" data-approve="${type}" data-id="${request.id}">Approve</button><button class="reject-btn" data-reject="${type}" data-id="${request.id}">Reject</button></div>` : '';
  return `<div class="approval-row"><div><b>${escapeHtml(request.employeeName)}</b><small>${escapeHtml(details)}</small></div><span class="access-state ${request.status === 'pending' ? 'pending' : ''}">${request.status}</span>${actions}</div>`;
}

function renderEmployeeRequests() {
  if (!currentAccount) return;
  const myLeaves = leaveRequests.filter(request => request.employeeEmail === currentAccount.email);
  const myEdits = timeEditRequests.filter(request => request.employeeEmail === currentAccount.email);
  $('#myLeaveRows').innerHTML = myLeaves.map(request => `<div class="approval-row"><div><b>${request.date}</b><small>${escapeHtml(request.reason)}</small></div><span class="access-state ${request.status === 'pending' ? 'pending' : ''}">${request.status}</span></div>`).join('') || '<div class="empty-state">No leave requests yet.</div>';
  $('#myTimeEditRows').innerHTML = myEdits.map(request => `<div class="approval-row"><div><b>${request.date}</b><small>${request.clockIn}-${request.clockOut} | ${escapeHtml(request.reason)}</small></div><span class="access-state ${request.status === 'pending' ? 'pending' : ''}">${request.status}</span></div>`).join('') || '<div class="empty-state">No time edit requests yet.</div>';
  renderLeaveCalendar();
}

function renderDocuments() {
  const mine = coachingDocuments.filter(document => document.employeeEmail === currentAccount?.email);
  $('#documentRows').innerHTML = mine.map(document => `<div class="document-row"><div><b>${escapeHtml(document.name)}</b><small>${document.size} · uploaded ${document.uploadedAt}</small></div><span class="access-state">Saved</span></div>`).join('') || '<div class="empty-state">No coaching documents uploaded yet.</div>';
}

function renderDeletedTimeAlerts() {
  if (!$('#deletedTimeRows')) return;
  const ownAlerts = deletedTimeAlerts.filter(alert => !currentProfile?.id || alert.employeeId === currentProfile.id || alert.employeeEmail === currentAccount?.email);
  $('#deletedTimeRows').innerHTML = ownAlerts.map(alert => `<div class="deleted-notice"><b>${escapeHtml(alert.title || 'Time entry deleted')}</b><small>${escapeHtml(alert.message || '')}</small><small>${new Date(alert.createdAt || Date.now()).toLocaleString()}</small></div>`).join('') || '<div class="empty-state">No deleted time notices.</div>';
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
    const commission = Number(item.commission ?? 0);
    const details = `Hours deducted: ${hours.toFixed(2)} | Amount deducted: ${money(amount)} | Commission: ${money(commission)}`;
    return `<div class="payroll-adjustment-notice"><div><b>${escapeHtml(from)} to ${escapeHtml(to)}</b><small>${escapeHtml(details)}</small><small>${escapeHtml(item.note || 'No note provided')}</small></div><span class="access-state">Recorded</span></div>`;
  }).join('') || '<div class="empty-state">No payroll adjustments.</div>';
}

function durationSecondsFromLabel(label) {
  const match = String(label || '').match(/(\d+)h\s*(\d+)m/);
  return match ? Number(match[1]) * 3600 + Number(match[2]) * 60 : 0;
}

function reportRange() {
  const now = new Date();
  const period = $('#reportPeriod')?.value || 'cutoff';
  let start = new Date(now);
  let end = new Date(now);
  let payDate = null;
  if (period === 'cutoff' || period === 'previous-cutoff') {
    const reference = new Date(now);
    if (period === 'previous-cutoff') {
      if (reference.getDate() <= 15) reference.setMonth(reference.getMonth() - 1, 16);
      else reference.setDate(1);
    }
    if (reference.getDate() <= 15) {
      start = new Date(reference.getFullYear(), reference.getMonth(), 1);
      end = new Date(reference.getFullYear(), reference.getMonth(), 15);
      payDate = new Date(reference.getFullYear(), reference.getMonth(), 20);
    } else {
      start = new Date(reference.getFullYear(), reference.getMonth(), 16);
      end = new Date(reference.getFullYear(), reference.getMonth() + 1, 0);
      payDate = new Date(reference.getFullYear(), reference.getMonth() + 1, 5);
    }
  }
  if (period === 'week') {
    start.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    end = new Date(start);
    end.setDate(start.getDate() + 6);
  }
  if (period === 'month') {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  }
  if (period === 'custom') {
    start = $('#reportStart').value ? new Date($('#reportStart').value + 'T00:00:00') : new Date(now);
    end = $('#reportEnd').value ? new Date($('#reportEnd').value + 'T23:59:59') : new Date(now);
  }
  start.setHours(0, 0, 0, 0);
  if (period !== 'custom') end.setHours(23, 59, 59, 999);
  return { start, end, period, payDate };
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
  const { start, end, period, payDate } = reportRange();
  const term = ($('#reportEmployee')?.value || '').toLowerCase();
  const records = (usesSupabase() ? supabaseTimeEntries.map(attendanceRecordFromSupabase) : []).filter(record => {
    const entryDate = record.dateKey ? new Date(record.dateKey + 'T12:00:00') : null;
    return entryDate && entryDate >= start && entryDate <= end && (!term || `${record.name} ${record.role}`.toLowerCase().includes(term));
  });
  const groups = new Map();
  records.forEach(record => {
    const key = `${record.email}-${period === 'day' ? record.dateKey : 'range'}`;
    const existing = groups.get(key) || { ...record, entries: 0, seconds: 0, pay: 0 };
    existing.entries += 1;
    existing.seconds += durationSecondsFromLabel(record.worked);
    const rate = hourlyRate(record);
    const entryDate = record.dateKey ? new Date(record.dateKey + 'T12:00:00') : todayDate;
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
  $('#reportPayDate').textContent = payDate ? payDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A';
  $('#reportPayDateNote').textContent = payDate ? (payDate < todayDate ? 'Completed payroll date' : 'Scheduled payroll date') : 'Only applies to payroll cutoffs';
  $('#reportRows').innerHTML = rows.map(row => {
    const adjustmentText = row.adjustment ? `-${row.deductedHours.toFixed(2)}h · -${money(row.deductedAmount)} · +${money(row.commission)}` : 'No adjustment';
    return `<div class="report-row payroll-report-row"><div class="person"><span class="person-avatar" style="background:${row.color}">${row.initials}</span><span>${escapeHtml(row.name)}<small>${escapeHtml(row.role)}</small></span></div><span>${period === 'day' ? escapeHtml(row.date) : `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`}</span><span>${row.entries}</span><span class="attendance-time">${formatDuration(row.seconds)}</span><span class="adjustment-summary">${adjustmentText}<small>Payable: ${formatDuration(row.payableSeconds)}</small></span><span class="attendance-time">${money(row.netPay)}</span><button class="edit-adjustment-btn" data-edit-adjustment="${row.employeeId}">Edit</button></div>`;
  }).join('') || '<div class="empty-state">No worked hours found for this report.</div>';
  $('#reportRangeLabel').textContent = `Showing ${start.toLocaleDateString()} to ${end.toLocaleDateString()}`;
}

function initializeReportDates() {
  if (!$('#reportStart')) return;
  syncReportDatesFromPeriod();
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
  $('#payrollAdjustmentPeriod').textContent = `${start.toLocaleDateString()} to ${end.toLocaleDateString()} · ${formatDuration(row.seconds)} worked`;
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
  renderProjectOptions();
  $('#employeeForm').reset();
  $('#employeeFormError').hidden = true;
  $('#employeeFormTitle').textContent = employee ? 'Edit employee access' : 'Give employee access';
  $('#employeeFormEyebrow').textContent = employee ? 'UPDATE ACCESS' : 'ADMIN ACCESS';
  $('#employeePassword').required = !employee;
  if (employee) {
    $('#employeeName').value = employee.name;
    $('#employeeEmail').value = employee.email;
    $('#employeeRole').value = employee.jobRole;
    $('#employeeProject').value = employee.task || taskOptions[0];
    $('#employeePassword').value = employee.tempPassword || '';
    $('#employeePassword').placeholder = 'Leave blank to keep current password';
  } else {
    $('#employeeProject').value = taskOptions[0];
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
  const adminAllowed = ['today', 'attendance', 'projects', 'reports', 'team', 'approvals'];
  const employeeAllowed = ['today', 'calendar', 'documents', 'requests'];
  const allowed = currentAccount?.role === 'employee' ? employeeAllowed : adminAllowed;
  const active = allowed.includes(page) ? page : 'today';
  if (page !== active) location.hash = active;
  document.body.dataset.page = active;
  $$('.nav-item').forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${active}`));
  if (active === 'projects') renderProjects();
  if (active === 'reports') renderReports();
  if (active === 'team') renderTeamDirectory();
  if (active === 'approvals') renderApprovals();
  if (active === 'calendar') renderLeaveCalendar();
  if (active === 'documents') renderDocuments();
  if (active === 'requests') renderEmployeeRequests();
  renderDeletedTimeAlerts();
  renderEmployeePayrollAdjustments();
}

function applyAccess(account) {
  currentAccount = account;
  loadStateForAccount(account);
  hydrateEmployeeStateFromSupabase(account);
  document.body.classList.toggle('employee-mode', account.role === 'employee');
  document.body.classList.toggle('admin-mode', account.role === 'admin');
  $('#loginShell').hidden = true;
  $('#accessChip').innerHTML = `<i></i> ${account.role === 'admin' ? 'Admin' : 'Employee'} access`;
  $('#profileInitials').textContent = account.initials;
  $('#profileName').textContent = account.name;
  $('#profileRole').textContent = account.role === 'admin' ? 'Administrator' : 'Employee workspace';
  $('#greeting').textContent = `Good morning, ${account.name.split(' ')[0]}.`;
  renderProjectOptions();
  const person = rosterPersonFor(account);
  if (person) $('#taskInput').value = projectFor(person, rosterSource().findIndex(item => item.email === person.email));
  syncOwnLivePresence();
  if (interval) clearInterval(interval);
  if (state.running || state.lunch) interval = setInterval(render, 1000);
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
    return;
  } else {
    const task = $('#taskInput').value.trim() || 'Untitled task';
    const start = Date.now();
    const timeEntryId = await createSupabaseTimeEntry(task, start);
    if (usesSupabase() && !timeEntryId) return;
    await loadSupabaseTimeEntries();
    state.running = { task, start, timeEntryId, nextLongSessionCheckAt: start + LONG_SESSION_SECONDS * 1000 };
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
  const task = $('#employeeProject').value || taskOptions[0];
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
    task,
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
    leaveRequests.push({ id: crypto.randomUUID(), employeeName: currentAccount.name, employeeEmail: currentAccount.email, date, reason: $('#leaveReason').value.trim(), status: 'pending', createdAt: new Date().toLocaleString() });
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
    timeEditRequests.push({ id: crypto.randomUUID(), employeeName: currentAccount.name, employeeEmail: currentAccount.email, date: $('#timeEditDate').value, clockIn: $('#timeEditIn').value, clockOut: $('#timeEditOut').value, reason: $('#timeEditReason').value.trim(), status: 'pending', createdAt: new Date().toLocaleString() });
    persistTimeEditRequests();
  }
  closeTimeEditForm();
  renderEmployeeRequests();
  renderApprovals();
  showToast('Time edit request submitted for admin approval.');
};

$('#coachingUpload').onchange = async event => {
  const files = [...event.target.files];
  const uploadedAt = new Date().toLocaleDateString();
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
  if (!$('#payrollAdjustmentBackdrop').hidden) closePayrollAdjustment();
  if (!$('#exportBackdrop').hidden) $('#exportBackdrop').hidden = true;
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
$('#reportEmployee').oninput = renderReports;
$('#reportExport').onclick = () => {
  const { start, end, period } = reportRange();
  const rows = currentReportRows.map(row => [
    row.name, row.email, row.role, start.toLocaleDateString(), end.toLocaleDateString(), period, row.entries,
    (row.seconds / 3600).toFixed(2), row.deductedHours.toFixed(2), row.deductedAmount.toFixed(2),
    row.commission.toFixed(2), (row.payableSeconds / 3600).toFixed(2), row.pay.toFixed(2),
    row.netPay.toFixed(2), row.adjustment?.note || ''
  ].map(csvCell).join(','));
  const header = ['Employee', 'Email', 'Role', 'From', 'To', 'Period', 'Entries', 'Worked Hours', 'Deducted Hours', 'Deducted Amount USD', 'Commission USD', 'Payable Hours', 'Gross Pay USD', 'Net Pay USD', 'Adjustment Note'];
  exportCsv(`sync2time-payroll-${isoDate(start)}-to-${isoDate(end)}.csv`, [header.map(csvCell).join(','), ...rows].join('\r\n'), 'Payroll report exported as CSV.');
};

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

$('#projectForm').onsubmit = event => {
  event.preventDefault();
  const project = $('#projectName').value.trim();
  if (!project) return;
  if (taskOptions.some(item => item.toLowerCase() === project.toLowerCase())) return showToast('That project already exists.');
  taskOptions.push(project);
  persistProjects();
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
    if (event.target.closest('[data-delete-time], [data-admin-clockout]')) return;
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

$('#payrollAdjustmentForm').onsubmit = savePayrollAdjustment;
$('#payrollAdjustmentClose').onclick = closePayrollAdjustment;
$('#payrollAdjustmentCancel').onclick = closePayrollAdjustment;
$('#payrollAdjustmentBackdrop').onclick = event => {
  if (event.target === event.currentTarget) closePayrollAdjustment();
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
  if (usesSupabase()) {
    const table = type === 'leave' ? 'leave_requests' : 'time_edit_requests';
    if (type === 'time' && approve) {
      const request = timeEditRequests.find(item => item.id === id);
      const applied = await applyApprovedTimeEdit(request);
      if (!applied.ok) {
        showToast(`Time edit could not be applied: ${applied.message}`);
        return;
      }
    }
    const { error } = await supabaseClient.from(table).update({ status }).eq('id', id);
    if (error) {
      showToast(`Approval error: ${error.message}`);
      return;
    }
    await loadSupabaseRequests();
  } else if (type === 'leave') {
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
  refreshFxRate();
  if (supabaseClient) {
    const { data } = await supabaseClient.auth.getSession();
    if (data.session) {
      await applySupabaseSession(data.session);
    }
  }
  const savedSession = currentAccount ? null : JSON.parse(sessionStorage.getItem('minute-session') || 'null');
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
