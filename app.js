const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const palette = ['#e6aab1', '#bad7ed', '#f2d18a', '#c8d9b6', '#d8c1e8', '#f2b7a6', '#b9e2dc', '#e3d29d'];
const DEFAULT_TASK_OPTIONS = ['Coaching', 'Meeting', 'On Class', 'Admin', 'Webinar', 'SMM', 'Bookkeeping'];
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
let payrollAdjustmentEvents = JSON.parse(localStorage.getItem('sync2time-payroll-adjustment-events') || '[]');
let paystubRecipients = JSON.parse(localStorage.getItem('sync2time-paystub-recipients') || '[]');
const DEFAULT_ROLE_HOUR_RULES = [
  { role_name: 'Admin', daily_hour_limit: 8, weekly_hour_limit: 40, allowed_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], is_flexible: false, requires_ot_approval: true },
  { role_name: 'Coach', daily_hour_limit: 3, weekly_hour_limit: 15, allowed_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], is_flexible: false, requires_ot_approval: true },
  { role_name: 'Webinar Specialist', daily_hour_limit: 2, weekly_hour_limit: 4, allowed_days: ['Thursday', 'Friday'], is_flexible: false, requires_ot_approval: true },
  { role_name: 'SMM', daily_hour_limit: null, weekly_hour_limit: 40, allowed_days: null, is_flexible: true, requires_ot_approval: true },
  { role_name: 'Other', daily_hour_limit: 8, weekly_hour_limit: 40, allowed_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], is_flexible: true, requires_ot_approval: true }
];
let roleHourRules = JSON.parse(localStorage.getItem('sync2time-role-hour-rules') || 'null') || [...DEFAULT_ROLE_HOUR_RULES];
let overtimeAlerts = JSON.parse(localStorage.getItem('sync2time-overtime-alerts') || '[]');
const DEFAULT_PAYSTUB_EMAIL_TEMPLATES = [
  {
    id: 'standard-paystub',
    name: 'Standard paystub',
    subject: 'Sync2Time Paystub - {{pay_period}}',
    body: 'Hello {{employee_name}},\n\nPlease find attached your Sync2Time paystub for {{pay_period}}.\n\nNet pay: {{net_pay}}\nPay date: {{pay_date}}\n\nPlease review the attached document and contact HR if you have any questions.\n\nRegards,\nSync2VA HR'
  }
];
let paystubEmailTemplates = JSON.parse(localStorage.getItem('sync2time-paystub-email-templates') || 'null') || [...DEFAULT_PAYSTUB_EMAIL_TEMPLATES];
let selectedPaystubEmailTemplateId = localStorage.getItem('sync2time-paystub-email-template-selected') || paystubEmailTemplates[0]?.id || '';
let emailingPayrollRow = null;
let currentReportRows = [];
let currentPayrollRows = [];
let currentAdjustmentRows = [];
let currentEmployeeReportRows = [];
let selectedPayrollRole = 'coaches';
const PAYROLL_ROLES = ['coaches', 'admin', 'webinar', 'smm', 'other'];
const PAYROLL_ROLE_LABELS = { coaches: 'Coaches', admin: 'Admin', webinar: 'Webinar', smm: 'SMM', other: 'Other' };
const MONTHLY_STATUTORY_CUTOFF_DAYS = { startDay: 1, endDay: 15, payDay: 20 };
const STATUTORY_DEFAULTS_BY_EMPLOYEE = {
  'meabel borreta': { sss: 625, philHealth: 250, pagibig: 200 }
};
const DUAL_PAYROLL_ASSIGNMENTS = [
  {
    key: 'bookkeeping',
    email: 'emily.lima@sync2va.com',
    nameKey: 'emily a lima',
    project: 'Bookkeeping',
    role: 'Bookkeeper',
    department: 'Bookkeeping',
    payrollRole: 'other',
    monthlyPhp: 8000,
    cutoffPayPhp: 4000,
    schedule: 'Flexible bookkeeping'
  }
];
let editingPayrollRow = null;
let editingPayrollAdjustment = null;
let editingQuickHoursRow = null;
let quickBooksStatus = { checked: false, connected: false, message: 'QuickBooks status has not been checked yet.' };
let quickBooksSyncInProgress = false;
let quickHoursDrafts = [];
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
const WIDE_TABLE_SCROLL_SELECTORS = [
  '.adjustment-center-scroll',
  '.attendance-card',
  '.project-list-card',
  '.team-list-card',
  '.ai-alert-card',
  '.audit-card',
  '.schedule-card',
  '.live-team-card',
  '.payroll-table-scroll'
];
let calendarCursor = businessMonthCursor(todayDate);
let leaveCalendarCursor = businessMonthCursor(todayDate);
let phpUsdRate = Number(localStorage.getItem('minute-php-usd-rate')) || FALLBACK_PHP_USD;
let fxRateDate = localStorage.getItem('minute-php-usd-date') || 'offline reference';
let liveUsdPhpRate = Number(localStorage.getItem('sync2time-live-usd-php')) || null;
let liveUsdPhpDate = localStorage.getItem('sync2time-live-usd-php-date') || '';
let manualPayrollFxOverride = Number(localStorage.getItem('sync2time-payroll-usd-php')) || null;
let payrollFxOverrides = JSON.parse(localStorage.getItem('sync2time-payroll-usd-php-overrides') || '{}');
let settingsTableMissing = false;
const liveCalculatorOpenedAt = Date.now();
const LIVE_PRESENCE_KEY = 'sync2time-live-presence';
const LIVE_ACTIVITY_PREFIX = '__sync2time__';
const TIME_EDIT_ADD_PREFIX = '[Sync2Time add time] ';
const TIME_EDIT_ENTRY_PREFIX = '[Sync2Time edit entry:';

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

function nameKey(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/gi, ' ')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

function realEmployeeId(person = {}) {
  return person.employeeId || person.employee_id || person.id || '';
}

function personMatchesAssignment(person = {}, assignment) {
  const email = String(person.email || '').toLowerCase();
  return (assignment.email && email === assignment.email.toLowerCase()) ||
    (assignment.nameKey && nameKey(person.name || person.full_name) === assignment.nameKey);
}

function dualAssignmentForPerson(person = {}, key = '') {
  return DUAL_PAYROLL_ASSIGNMENTS.find(assignment =>
    personMatchesAssignment(person, assignment) &&
    (!key || assignment.key === key)
  ) || null;
}

function payrollAssignmentKey(person = {}) {
  return person.payrollAssignmentKey || person.assignmentKey || 'primary';
}

function isSecondaryPayrollAssignment(person = {}) {
  return payrollAssignmentKey(person) !== 'primary';
}

function taskMatchesProject(task = '', project = '') {
  const normalizedTask = nameKey(task);
  const normalizedProject = nameKey(project);
  return !!normalizedTask && !!normalizedProject && normalizedTask.includes(normalizedProject);
}

function entryMatchesDualAssignment(entry = {}, assignment) {
  return taskMatchesProject(entry.task || '', assignment.project);
}

function currentEmployeeTaskValue() {
  return state.running?.task || $('#taskInput')?.value || '';
}

function currentWorkIsDualAssignment(project = 'Bookkeeping') {
  if (currentAccount?.role !== 'employee') return false;
  const person = rosterPersonFor(currentAccount) || currentProfile || currentAccount || {};
  const assignment = dualAssignmentForPerson(person);
  return !!assignment && taskMatchesProject(currentEmployeeTaskValue(), project || assignment.project);
}

function crossesDualAssignmentBoundary(previousTask = '', nextTask = '') {
  if (currentAccount?.role !== 'employee') return false;
  const person = rosterPersonFor(currentAccount) || currentProfile || currentAccount || {};
  const assignment = dualAssignmentForPerson(person);
  if (!assignment) return false;
  return taskMatchesProject(previousTask, assignment.project) !== taskMatchesProject(nextTask, assignment.project);
}

function employeeEffectiveOvertimeRole(role = '', task = '') {
  const person = rosterPersonFor(currentAccount) || currentProfile || currentAccount || {};
  const assignment = dualAssignmentForPerson(person);
  if (assignment && taskMatchesProject(task || currentEmployeeTaskValue(), assignment.project)) return 'Other';
  return overtimeRoleName(role);
}

function timeEditEffectiveRole(mode = 'correction', sourceEntryId = '') {
  const sourceEntry = sourceEntryId ? supabaseTimeEntries.find(entry => entry.id === sourceEntryId) : null;
  const task = sourceEntry?.task || currentEmployeeTaskValue();
  return employeeEffectiveOvertimeRole(currentEmployeeJobRole(), task);
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

function businessDateTimeRange(key, startTime, endTime) {
  const start = businessDateTime(key, startTime);
  let end = businessDateTime(key, endTime);
  if (Number.isFinite(start.getTime()) && Number.isFinite(end.getTime()) && end <= start) {
    end = new Date(end.getTime() + 24 * 60 * 60 * 1000);
  }
  return { start, end };
}

function timeEditHours(key, startTime, endTime) {
  const { start, end } = businessDateTimeRange(key, startTime, endTime);
  return Number.isFinite(start.getTime()) && Number.isFinite(end.getTime()) && end > start
    ? secondsBetween(start, end) / 3600
    : 0;
}

function businessTimeInput(date) {
  const parts = businessParts(date);
  const hour = parts.hour === '24' ? '00' : parts.hour;
  return `${hour}:${parts.minute}`;
}

function isAddTimeEditRequest(request) {
  return String(request?.reason || '').startsWith(TIME_EDIT_ADD_PREFIX);
}

function timeEditSourceEntryId(reason = '') {
  const match = String(reason || '').match(/^\[Sync2Time edit entry:([^\]]+)\]\s*/);
  return match?.[1] || '';
}

function timeEditReasonWithSource(entryId, reason = '') {
  return entryId ? `${TIME_EDIT_ENTRY_PREFIX}${entryId}] ${reason || ''}` : reason;
}

function cleanTimeEditReason(reason = '') {
  return String(reason || '')
    .replace(TIME_EDIT_ADD_PREFIX, '')
    .replace(/^\[Sync2Time edit entry:[^\]]+\]\s*/, '')
    .trim();
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

async function invokeEdgeFunction(name, payload) {
  if (!usesSupabase()) throw new Error('Supabase session is required.');
  let token = supabaseSession?.access_token;
  if (!token && supabaseClient?.auth) {
    const { data } = await supabaseClient.auth.getSession();
    token = data.session?.access_token;
  }
  if (!token) throw new Error('Your admin login session expired. Please sign in again.');
  const response = await fetch(`${SUPABASE_URL}/functions/v1/${name}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: SUPABASE_PUBLISHABLE_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }
  if (!response.ok || data?.ok === false || data?.error) {
    let message = data?.error || text || `Edge Function returned status ${response.status}`;
    if (payload?.testMode && /Paystub is not approved/i.test(message)) {
      message = 'Supabase is still running the older send-paystubs function. Deploy the updated send-paystubs/index.ts, then try the sample again.';
    }
    throw new Error(message);
  }
  return data || { ok: true };
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

function persistPayrollAdjustmentEvents() {
  localStorage.setItem('sync2time-payroll-adjustment-events', JSON.stringify(payrollAdjustmentEvents));
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
  if (error) {
    if (isMissingAppSettingsError(error)) settingsTableMissing = true;
    throw error;
  }
}

function isMissingAppSettingsError(error) {
  const message = String(error?.message || error || '');
  return /app_settings|schema cache|could not find the table/i.test(message);
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
    if (/one_working_shift_per_employee|duplicate key/i.test(error.message || '')) {
      const resumed = await resumeExistingSupabaseShift(task);
      if (resumed) return resumed;
    }
    showToast(`Clock-in error: ${error.message}`);
    return null;
  }
  return { id: data.id, start, task, resumed: false };
}

async function resumeExistingSupabaseShift(task) {
  if (!usesSupabase() || !currentProfile?.id) return null;
  const { data, error } = await supabaseClient
    .from('time_entries')
    .select('id, task, clock_in')
    .eq('employee_id', currentProfile.id)
    .or('status.eq.working,clock_out.is.null')
    .order('clock_in', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error || !data?.id) {
    showToast(`Clock-in recovery error: ${error?.message || 'No active shift found to resume.'}`);
    return null;
  }
  const cleanTask = task || data.task || 'Tracked time';
  if (cleanTask !== data.task) {
    await supabaseClient
      .from('time_entries')
      .update({ task: cleanTask })
      .eq('id', data.id)
      .eq('employee_id', currentProfile.id);
  }
  return {
    id: data.id,
    start: new Date(data.clock_in).getTime(),
    task: cleanTask,
    resumed: true
  };
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
  else if (!currentWorkIsDualAssignment()) requestAiOvertimeReview(state.running.timeEntryId).then(() => loadOvertimeAlerts().then(renderAiAlerts));
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

function localLiveEmployees() {
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

function isActiveSupabaseTimeEntry(entry) {
  return !!entry?.employee_id && !!entry?.clock_in && entry.status !== 'deleted' && (entry.status === 'working' || !entry.clock_out);
}

function liveEmployeeFromActiveTimeEntry(entry, index) {
  const base = attendanceRecordFromSupabase(entry, index);
  const live = supabaseLivePresence.find(record =>
    record.employeeId === entry.employee_id ||
    record.email?.toLowerCase() === base.email?.toLowerCase()
  );
  const liveActivity = live ? parseLiveActivity(live.task, live.note) : null;
  const entryActivity = entry.task ? parseLiveActivity(entry.task) : null;
  return {
    ...base,
    id: entry.employee_id,
    employeeId: entry.employee_id,
    timeEntryId: entry.id,
    task: liveActivity?.task || entryActivity?.task || base.task || 'Working',
    note: liveActivity?.note || entryActivity?.note || '',
    clockOut: '—',
    status: 'clocked',
    liveSeconds: typeof base.liveSeconds === 'number'
      ? base.liveSeconds
      : secondsBetween(new Date(entry.clock_in), Date.now())
  };
}

function activeClockedEmployees() {
  if (!usesSupabase()) return localLiveEmployees();
  const activeEntries = supabaseTimeEntries
    .filter(isActiveSupabaseTimeEntry)
    .map(liveEmployeeFromActiveTimeEntry);
  const activeEmployeeIds = new Set(activeEntries.map(person => person.employeeId).filter(Boolean));
  const liveOnly = supabaseLivePresence
    .filter(record => record.employeeId && !activeEmployeeIds.has(record.employeeId))
    .map((record, index) => {
      const roster = rosterSource().find(person =>
        person.email?.toLowerCase() === record.email?.toLowerCase() ||
        person.id === record.employeeId ||
        person.name === record.name
      );
      const seconds = secondsBetween(record.clockInAt, Date.now());
      const activity = parseLiveActivity(record.task, record.note);
      return {
        ...(roster || {}),
        id: record.employeeId,
        employeeId: record.employeeId,
        name: record.name,
        email: record.email,
        role: record.role || roster?.role || 'Employee',
        department: record.department || roster?.department || 'Employee',
        task: activity.task || 'Working',
        note: activity.note || '',
        initials: roster?.initials || initials(record.name),
        color: roster?.color || palette[(activeEntries.length + index) % palette.length],
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
  return [...activeEntries, ...liveOnly];
}

function liveEmployees() {
  return activeClockedEmployees();
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
  const activity = entry.task ? parseLiveActivity(entry.task) : null;
  return {
    ...(roster || {}),
    id: entry.id,
    employeeId: entry.employee_id,
    name,
    email: profile.email || roster?.email || entry.employee_id,
    role: profile.job_role || roster?.role || 'Employee',
    department: profile.department || roster?.department || '',
    task: activity?.task || roster?.task || 'Tracked time',
    note: activity?.note || '',
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

async function loadPayrollAdjustmentEvents() {
  if (!usesSupabase()) return;
  const { data, error } = await supabaseClient
    .from('payroll_adjustment_events')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.warn('Payroll adjustment history unavailable:', error.message);
    return;
  }
  payrollAdjustmentEvents = data || [];
  persistPayrollAdjustmentEvents();
}

async function loadRoleHourRules() {
  if (!usesSupabase()) return;
  const { data, error } = await supabaseClient
    .from('role_hour_rules')
    .select('*')
    .order('role_name', { ascending: true });
  if (error) {
    console.warn('Role hour rules unavailable:', error.message);
    roleHourRules = [...DEFAULT_ROLE_HOUR_RULES];
    return;
  }
  roleHourRules = data?.length ? data : [...DEFAULT_ROLE_HOUR_RULES];
  localStorage.setItem('sync2time-role-hour-rules', JSON.stringify(roleHourRules));
}

async function loadOvertimeAlerts() {
  if (!usesSupabase() || currentProfile?.role !== 'admin') return;
  const { data, error } = await supabaseClient
    .from('overtime_alerts')
    .select('*, profiles:employee_id(email, full_name, job_role)')
    .order('created_at', { ascending: false });
  if (error) {
    console.warn('Overtime alerts unavailable:', error.message);
    return;
  }
  overtimeAlerts = data || [];
  localStorage.setItem('sync2time-overtime-alerts', JSON.stringify(overtimeAlerts));
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
  DEFAULT_TASK_OPTIONS.forEach(option => {
    if (!taskOptions.some(item => item.toLowerCase() === option.toLowerCase())) taskOptions.push(option);
  });
  if (!taskOptions.length) taskOptions = [...DEFAULT_TASK_OPTIONS];
  if (selectedProject !== 'All' && !taskOptions.includes(selectedProject)) selectedProject = 'All';
}

async function loadSupabaseSettings() {
  if (!usesSupabase()) return;
  const { data, error } = await supabaseClient
    .from('app_settings')
    .select('setting_key, value_json');
  if (error) {
    if (isMissingAppSettingsError(error)) {
      settingsTableMissing = true;
      return;
    }
    showToast(`Settings sync error: ${error.message}`);
    return;
  }
  settingsTableMissing = false;
  sharedSettings = {};
  (data || []).forEach(item => {
    sharedSettings[item.setting_key] = item.value_json || {};
  });
  const manualRate = Number(sharedSettings.payroll_usd_php_override?.rate);
  manualPayrollFxOverride = manualRate > 0 ? manualRate : null;
  if (manualPayrollFxOverride) localStorage.setItem('sync2time-payroll-usd-php', String(manualPayrollFxOverride));
  else localStorage.removeItem('sync2time-payroll-usd-php');
  const sharedFxOverrides = sharedSettings.payroll_usd_php_overrides?.rates;
  if (sharedFxOverrides && typeof sharedFxOverrides === 'object' && !Array.isArray(sharedFxOverrides)) {
    payrollFxOverrides = Object.fromEntries(Object.entries(sharedFxOverrides).filter(([, value]) => Number(value) > 0).map(([key, value]) => [key, Number(value)]));
    localStorage.setItem('sync2time-payroll-usd-php-overrides', JSON.stringify(payrollFxOverrides));
  }
  const sharedTemplates = sharedSettings.paystub_email_templates?.templates;
  if (Array.isArray(sharedTemplates) && sharedTemplates.length) {
    paystubEmailTemplates = normalizePaystubEmailTemplates(sharedTemplates);
    localStorage.setItem('sync2time-paystub-email-templates', JSON.stringify(paystubEmailTemplates));
  }
  if (!paystubEmailTemplates.some(template => template.id === selectedPaystubEmailTemplateId)) {
    selectedPaystubEmailTemplateId = paystubEmailTemplates[0]?.id || '';
  }
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
  const { start, end } = businessDateTimeRange(request.date, request.clockIn, request.clockOut);
  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end <= start) {
    return { ok: false, message: 'The requested clock-out must be after clock-in.' };
  }
  const addAsSeparateEntry = isAddTimeEditRequest(request);
  const sourceEntryId = timeEditSourceEntryId(request.reason);
  const existing = addAsSeparateEntry ? null : sourceEntryId
    ? supabaseTimeEntries.find(entry => entry.id === sourceEntryId && entry.employee_id === request.employeeId)
    : supabaseTimeEntries.find(entry =>
    entry.employee_id === request.employeeId &&
    entry.clock_in &&
    isoDate(new Date(entry.clock_in)) === request.date
  );
  let result;
  let savedEntryId = null;
  if (existing) {
    result = await supabaseClient.from('time_entries').update({
      clock_in: start.toISOString(),
      clock_out: end.toISOString(),
      status: 'completed'
    }).eq('id', existing.id).select('id').maybeSingle();
    if (result.error) return { ok: false, message: result.error.message };
    savedEntryId = result.data?.id || null;
  }
  if (!savedEntryId) {
    result = await supabaseClient.from('time_entries').insert({
      employee_id: request.employeeId,
      task: addAsSeparateEntry ? `Approved added time${cleanTimeEditReason(request.reason) ? ` - ${cleanTimeEditReason(request.reason)}` : ''}` : 'Approved time correction',
      clock_in: start.toISOString(),
      clock_out: end.toISOString(),
      status: 'completed'
    }).select('id').maybeSingle();
    if (result.error) return { ok: false, message: result.error.message };
    savedEntryId = result.data?.id || null;
  }
  await loadSupabaseTimeEntries();
  if (savedEntryId) await requestAiOvertimeReview(savedEntryId);
  if (!silent) showToast('Approved time was applied to the employee log.');
  return { ok: true };
}

async function applyCoachSelfTimeEdit({ sourceEntryId, date, clockIn, clockOut, reason }) {
  if (!usesSupabase() || currentAccount?.role !== 'employee' || !currentProfile?.id) {
    return { ok: false, message: 'Supabase employee session is required.' };
  }
  const { start, end } = businessDateTimeRange(date, clockIn, clockOut);
  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end <= start) {
    return { ok: false, message: 'Clock-out must be after clock-in.' };
  }
  const totalHours = secondsBetween(start, end) / 3600;
  const approvedEnd = totalHours > 3 ? new Date(start.getTime() + 3 * 60 * 60 * 1000) : end;
  const existing = sourceEntryId ? supabaseTimeEntries.find(entry => entry.id === sourceEntryId && entry.employee_id === currentProfile.id) : null;
  const task = existing?.task || state.running?.task || 'Employee corrected time';
  const payload = {
    employee_id: currentProfile.id,
    task,
    clock_in: start.toISOString(),
    clock_out: approvedEnd.toISOString(),
    status: 'completed'
  };
  let savedEntryId = null;
  let result;
  if (sourceEntryId) {
    result = await supabaseClient
      .from('time_entries')
      .update(payload)
      .eq('id', sourceEntryId)
      .eq('employee_id', currentProfile.id)
      .select('id')
      .maybeSingle();
    if (result.error) return { ok: false, message: result.error.message };
    savedEntryId = result.data?.id || null;
  }
  if (sourceEntryId && !savedEntryId) {
    return {
      ok: false,
      message: 'Sync2Time could not update the original time entry. Run outputs/sync2time-employee-time-edit-policy-sql.sql in Supabase, refresh the app, then try again.'
    };
  }
  if (!savedEntryId) {
    result = await supabaseClient.from('time_entries').insert(payload).select('id').maybeSingle();
    if (result.error) return { ok: false, message: result.error.message };
    savedEntryId = result.data?.id || null;
  }
  if (savedEntryId) await requestAiOvertimeReview(savedEntryId);
  let pendingExtra = 0;
  if (totalHours > 3) {
    pendingExtra = totalHours - 3;
    const request = await supabaseClient.from('time_edit_requests').insert({
      employee_id: currentProfile.id,
      requested_date: isoDate(approvedEnd),
      requested_clock_in: businessTimeInput(approvedEnd),
      requested_clock_out: businessTimeInput(end),
      reason: `${TIME_EDIT_ADD_PREFIX}Extra coach time beyond 3 auto-approved hours${reason ? `: ${reason}` : ''}`,
      status: 'pending'
    });
    if (request.error) return { ok: false, message: `The first 3 hours were saved, but the extra-time approval request failed: ${request.error.message}` };
  }
  await supabaseClient.from('live_presence').delete().eq('employee_id', currentProfile.id);
  await loadSupabaseTimeEntries();
  await loadSupabaseLivePresence();
  await loadSupabaseRequests();
  hydrateEmployeeStateFromSupabase(currentAccount);
  syncOwnLivePresence();
  return {
    ok: true,
    totalHours,
    pendingExtra,
    message: pendingExtra > 0
      ? `3 hours were auto-approved. ${pendingExtra.toFixed(2)} extra hour${pendingExtra === 1 ? '' : 's'} sent to admin approval.`
      : `${totalHours.toFixed(2)} hour${totalHours === 1 ? '' : 's'} saved.`
  };
}

async function repairApprovedTimeEdits() {
  if (!usesSupabase() || currentProfile?.role !== 'admin' || approvedTimeEditRepairAttempted) return;
  approvedTimeEditRepairAttempted = true;
  const approved = timeEditRequests.filter(request => request.status === 'approved' && request.employeeId);
  for (const request of approved) {
    const { start, end } = businessDateTimeRange(request.date, request.clockIn, request.clockOut);
    const requestedStart = start.getTime();
    const requestedEnd = end.getTime();
    const alreadyApplied = supabaseTimeEntries.some(entry =>
      entry.employee_id === request.employeeId &&
      entry.clock_in &&
      entry.clock_out &&
      Math.abs(new Date(entry.clock_in).getTime() - requestedStart) < 60000 &&
      Math.abs(new Date(entry.clock_out).getTime() - requestedEnd) < 60000
    );
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
  await loadPayrollAdjustmentEvents();
  await loadRoleHourRules();
  await loadOvertimeAlerts();
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
  renderAdjustmentCenter();
  renderAiAlerts();
  renderAuditLog();
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
      renderAdjustmentCenter();
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
      renderAdjustmentCenter();
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
      await detectOvertimeForCompletedEntries();
      await loadOvertimeAlerts();
      reconcileAdminClockOut();
      hydrateEmployeeStateFromSupabase();
      renderLiveTeam();
      renderAttendance();
      renderScheduleWatch();
      renderTeamDirectory();
      renderReports();
      renderAdjustmentCenter();
      renderAiAlerts();
      renderAuditLog();
      render();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'payroll_adjustments' }, async () => {
      await loadPayrollAdjustments();
      await loadPayrollAdjustmentEvents();
      renderReports();
      renderPayroll();
      renderAdjustmentCenter();
      renderEmployeePayrollAdjustments();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'payroll_adjustment_events' }, async () => {
      await loadPayrollAdjustmentEvents();
      renderEmployeePayrollAdjustments();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'role_hour_rules' }, async () => {
      await loadRoleHourRules();
      renderAiAlerts();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'overtime_alerts' }, async () => {
      await loadOvertimeAlerts();
      renderAiAlerts();
      renderPayroll();
      renderAdjustmentCenter();
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
      renderAuditLog();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'overtime_requests' }, async () => {
      await loadSupabaseRequests();
      renderApprovals();
      renderEmployeeRequests();
      renderPayroll();
      renderAdjustmentCenter();
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
  const active = supabaseTimeEntries.find(entry =>
    entry.employee_id === currentProfile.id &&
    entry.clock_in &&
    (!entry.clock_out || entry.status === 'working')
  );
  const ownEntries = supabaseTimeEntries.filter(entry =>
    entry.employee_id === currentProfile.id &&
    entry.clock_in &&
    isoDate(new Date(entry.clock_in)) === todayKey
  );
  const completed = ownEntries.filter(entry => entry.clock_out && entry.status !== 'working');
  const liveRecord = supabaseLivePresence.find(record => record.employeeId === currentProfile.id || record.email === account?.email);
  state.entries = completed.map(entry => ({
    task: entry.task || 'Tracked time',
    seconds: secondsBetween(entry.clock_in, entry.clock_out),
    start: new Date(entry.clock_in).getTime(),
    end: new Date(entry.clock_out).getTime(),
    timeEntryId: entry.id,
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
  const starts = [...ownEntries, active].filter(Boolean).map(entry => new Date(entry.clock_in).getTime()).filter(Number.isFinite);
  const ends = completed.map(entry => new Date(entry.clock_out).getTime()).filter(Number.isFinite);
  state.clockIn = starts.length ? Math.min(...starts) : null;
  state.clockOut = active ? null : (ends.length ? Math.max(...ends) : null);
  save();
}

async function refreshOwnActiveSessionFromSupabase() {
  if (!usesSupabase() || currentAccount?.role !== 'employee' || !currentProfile?.id) return;
  await loadSupabaseTimeEntries();
  await loadSupabaseLivePresence();
  hydrateEmployeeStateFromSupabase(currentAccount);
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

function isEdgeFunctionRequestFailure(error) {
  const message = String(error?.message || error || '').toLowerCase();
  return message.includes('failed to send a request') ||
    message.includes('failed to fetch') ||
    message.includes('network') ||
    message.includes('not found') ||
    message.includes('functions/v1');
}

function edgeFunctionDeployMessage(functionName = 'admin-save-employee') {
  return `Supabase Edge Function "${functionName}" is not deployed or reachable. Deploy outputs/supabase/functions/${functionName}/index.ts in Supabase Edge Functions, then refresh the website.`;
}

async function supabaseFunctionErrorMessage(error, data = null) {
  if (data?.error) return data.error;
  const response = error?.context;
  if (response) {
    try {
      const copy = typeof response.clone === 'function' ? response.clone() : response;
      const body = await copy.json();
      if (body?.error) return body.error;
      if (body?.message) return body.message;
    } catch {
      try {
        const copy = typeof response.clone === 'function' ? response.clone() : response;
        const text = await copy.text();
        if (text) return text.slice(0, 240);
      } catch {
        // Fall back to the SDK error below.
      }
    }
  }
  return error?.message || 'Unable to save employee to Supabase.';
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

async function updateSupabaseEmployeeProfileDirect(record) {
  if (!supabaseClient || currentProfile?.role !== 'admin') return { ok: false, error: 'Admin Supabase session required.' };
  if (!isUuid(record.id)) return { ok: false, error: 'This employee does not have a real Supabase profile ID yet.' };
  const existingProfile = supabaseProfiles.find(profile =>
    profile.id === record.id ||
    profile.email?.toLowerCase() === record.email?.toLowerCase() ||
    profile.full_name?.toLowerCase() === record.name?.toLowerCase()
  );
  const payload = {
    email: record.email,
    full_name: record.name,
    role: existingProfile?.role === 'admin' ? 'admin' : 'employee',
    job_role: record.jobRole,
    department: record.department || '',
    rate: record.rate,
    rate_type: record.rateType || '',
    schedule_start: minutesToSupabaseTime(record.scheduledStart),
    schedule_end: minutesToSupabaseTime(record.scheduledEnd),
    project: record.task || '',
    task: record.task || ''
  };
  const attempts = [
    payload,
    Object.fromEntries(Object.entries(payload).filter(([key]) => key !== 'project')),
    Object.fromEntries(Object.entries(payload).filter(([key]) => key !== 'task')),
    Object.fromEntries(Object.entries(payload).filter(([key]) => key !== 'project' && key !== 'task'))
  ];
  let profileData = null;
  let lastError = null;
  for (const attempt of attempts) {
    const { data, error } = await supabaseClient
      .from('profiles')
      .update(attempt)
      .eq('id', record.id)
      .select('*')
      .single();
    if (!error) {
      profileData = data;
      lastError = null;
      break;
    }
    lastError = error;
    const message = error.message || '';
    if (!message.includes('project') && !message.includes('task')) break;
  }
  if (lastError) return { ok: false, error: lastError.message || 'Direct profile update failed.' };
  const { data: recipientData, error: recipientError } = await supabaseClient
    .from('paystub_recipients')
    .upsert({
      employee_id: record.id,
      recipient_email: record.paystubEmail || record.email,
      source_note: 'Sync2Time admin access',
      updated_at: new Date().toISOString()
    }, { onConflict: 'employee_id' })
    .select('recipient_email')
    .single();
  if (recipientError) return { ok: false, error: `Profile saved, but paystub email failed: ${recipientError.message}` };
  return {
    ok: true,
    employeeId: record.id,
    recipientEmail: recipientData?.recipient_email || record.paystubEmail || record.email,
    profile: profileData,
    warning: 'Employee profile updated. Password and sign-in email changes still require the Supabase Edge Function.'
  };
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
  const previousEmail = String(record.previousEmail || record.email || '').toLowerCase();
  const emailChanged = previousEmail && previousEmail !== record.email;
  const passwordChanged = Boolean(record.newPassword);
  let data = null;
  let error = null;
  try {
    const response = await supabaseClient.functions.invoke('admin-save-employee', { body: payload });
    data = response.data;
    error = response.error;
  } catch (requestError) {
    error = requestError;
  }
  if (error || !data?.ok) {
    const detailedMessage = await supabaseFunctionErrorMessage(error, data);
    if (isEdgeFunctionRequestFailure(error) && isUuid(record.id) && !emailChanged && !passwordChanged) {
      const directResult = await updateSupabaseEmployeeProfileDirect(record);
      if (directResult.ok) return directResult;
      return {
        ok: false,
        error: `${edgeFunctionDeployMessage('admin-save-employee')} Direct profile fallback also failed: ${directResult.error}`
      };
    }
    const functionMessage = isEdgeFunctionRequestFailure(error)
      ? edgeFunctionDeployMessage('admin-save-employee')
      : detailedMessage;
    return { ok: false, error: functionMessage };
  }
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
    ...(running ? [{ task: running.task, seconds: runningSeconds, live: true, note: running.note || '', start: running.start, end: Date.now(), timeEntryId: running.timeEntryId || null }] : []),
    ...(state.lunch ? [{ task: 'Lunch break', seconds: secondsBetween(state.lunch.start, Date.now()), live: true, lunch: true }] : []),
    ...state.entries
  ];
  entries.innerHTML = all.map((entry, index) => {
    const canEdit = currentAccount?.role === 'employee' && !entry.lunch && entry.start && (entry.end || entry.live);
    const editButton = canEdit ? `<button class="entry-edit-btn" data-entry-edit="${index}" data-entry-id="${entry.timeEntryId || ''}" data-entry-start="${entry.start}" data-entry-end="${entry.end}">Edit</button>` : '<span></span>';
    return `<div class="entry dashboard-clickable" tabindex="0" role="button" data-entry-index="${index}"><div class="entry-title"><span class="project-dot ${entry.lunch ? 'blue' : entry.live ? 'coral' : 'blue'}"></span><div>${escapeHtml(entry.task)}<small>${entry.note ? escapeHtml(entry.note) : entry.live ? 'Currently active' : 'Tracked time'}</small></div></div><span class="entry-time">${formatDuration(entry.seconds)}</span>${editButton}</div>`;
  }).join('');
  $('#emptyState').hidden = all.length > 0;

  const daily = [2.8, 4.1, Math.min(7.5, total / 3600), 3.4, 2.2, .3, 0];
  $('#bars').innerHTML = daily.map((value, index) => `<div class="bar ${index === 2 ? 'today' : ''}" data-day="${['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][index]}" style="height:${Math.max(4, value / 8 * 112)}px"></div>`).join('');
  renderAttendance();
  renderLiveTeam();
  renderScheduleWatch();
  renderReports();
  renderPayroll();
  renderAiAlerts();
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
    const actionButton = person.status === 'clocked'
      ? `<button class="admin-clockout-btn" data-admin-clockout="${person.employeeId || person.id || ''}" data-clockout-email="${encodeURIComponent(person.email || '')}" data-clockout-name="${encodeURIComponent(person.name)}">Clock out</button>`
      : person.id
        ? `<button class="delete-time-btn" data-delete-time="${person.id}" data-employee-id="${person.employeeId || ''}" data-employee-name="${encodeURIComponent(person.name)}" data-time-label="${encodeURIComponent(`${person.date} ${person.clockIn}-${person.clockOut}`)}">Delete</button>`
        : '<span>—</span>';
    return `<div class="attendance-row" data-employee="${encodeURIComponent(person.name)}"><div class="person"><span class="person-avatar" style="background:${person.color}">${person.initials}</span><span>${person.name}<small>${person.role}</small></span></div><span class="attendance-date">${person.date}</span><span class="attendance-time">${person.clockIn}</span><span class="attendance-time">${person.clockOut}</span><span class="attendance-time">${person.worked}</span><span class="status ${person.status === 'clocked' ? 'live' : 'complete'}">${person.status === 'clocked' ? 'Clocked in' : 'Complete'}</span>${actionButton}</div>`;
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

function overtimeRoleName(role = '') {
  const text = String(role || '').toLowerCase();
  if (text.includes('webinar')) return 'Webinar Specialist';
  if (text.includes('smm')) return 'SMM';
  if (text.includes('coach')) return 'Coach';
  if (text.includes('admin')) return 'Admin';
  return 'Other';
}

function currentEmployeeJobRole() {
  if (currentProfile?.job_role) return currentProfile.job_role;
  if (currentAccount?.jobRole) return currentAccount.jobRole;
  const email = currentAccount?.email?.toLowerCase();
  return rosterSource().find(person => person.email?.toLowerCase() === email)?.role || '';
}

function longSessionPromptAppliesToCurrentEmployee() {
  return currentAccount?.role === 'employee' &&
    employeeEffectiveOvertimeRole(currentEmployeeJobRole(), currentEmployeeTaskValue()) === 'Coach';
}

function roleHourRuleFor(role = '') {
  const family = overtimeRoleName(role);
  return roleHourRules.find(rule => rule.role_name === family) || DEFAULT_ROLE_HOUR_RULES.find(rule => rule.role_name === family) || DEFAULT_ROLE_HOUR_RULES.at(-1);
}

function alertEmployeeName(alert) {
  return alert.profiles?.full_name || rosterSource().find(person => person.id === alert.employee_id)?.name || 'Employee';
}

function alertBelongsToPersonRole(alert, person) {
  const assignment = dualAssignmentForPerson(person);
  if (!assignment) return true;
  const entry = alert.time_log_id ? supabaseTimeEntries.find(item => item.id === alert.time_log_id) : null;
  const isAssignmentAlert = entry ? entryMatchesDualAssignment(entry, assignment) : false;
  if (payrollAssignmentKey(person) === assignment.key) return isAssignmentAlert;
  if (payrollRole(person) === 'coaches') return !isAssignmentAlert;
  return true;
}

function approvedAiAlertOtHours(person, start, end) {
  const employeeId = payrollEntryEmployeeId(person);
  return overtimeAlerts.filter(alert => {
    const date = businessDateFromKey(alert.alert_date);
    return alert.employee_id === employeeId &&
      alert.status === 'approved' &&
      alert.admin_decision === 'approve_ot' &&
      !alert.has_approved_ot &&
      alertBelongsToPersonRole(alert, person) &&
      date >= start &&
      date <= end;
  }).reduce((sum, alert) => sum + Number(alert.excess_hours || 0), 0);
}

function pendingAiAlertHours(person, start, end) {
  const employeeId = payrollEntryEmployeeId(person);
  return overtimeAlerts.filter(alert => {
    const date = businessDateFromKey(alert.alert_date);
    return alert.employee_id === employeeId &&
      ['new', 'pending_employee_explanation', 'payroll_pending'].includes(alert.status) &&
      alertBelongsToPersonRole(alert, person) &&
      date >= start &&
      date <= end;
  }).reduce((sum, alert) => sum + Number(alert.excess_hours || 0), 0);
}

function rejectedAiAlertHours(person, start, end) {
  const employeeId = payrollEntryEmployeeId(person);
  return overtimeAlerts.filter(alert => {
    const date = businessDateFromKey(alert.alert_date);
    return alert.employee_id === employeeId &&
      alert.status === 'rejected' &&
      alertBelongsToPersonRole(alert, person) &&
      date >= start &&
      date <= end;
  }).reduce((sum, alert) => sum + Number(alert.excess_hours || 0), 0);
}

async function requestAiOvertimeReview(timeEntryId) {
  if (!usesSupabase() || !timeEntryId) return null;
  try {
    const { data, error } = await supabaseClient.functions.invoke('ai-overtime-review', { body: { timeEntryId } });
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn('AI overtime review unavailable:', error.message || error);
    return null;
  }
}

async function detectOvertimeForCompletedEntries() {
  if (!usesSupabase()) return;
  const known = new Set(overtimeAlerts.map(alert => alert.time_log_id).filter(Boolean));
  const completed = supabaseTimeEntries
    .filter(entry => entry.id && entry.clock_in && entry.clock_out && entry.status !== 'working' && entry.status !== 'deleted' && !known.has(entry.id))
    .slice(0, 12);
  for (const entry of completed) await requestAiOvertimeReview(entry.id);
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
  const activeEmployees = activeClockedEmployees();
  $('#teamRows').innerHTML = roster.map(person => {
    const access = managedEmployees.find(employee => employee.email === person.email || employee.name === person.name);
    const profile = usesSupabase() && person.id ? supabaseProfiles.find(item => item.id === person.id) : null;
    const isOffboarded = profile?.role && !isAllowedAccessRole(profile.role);
    const hasSupabaseAccess = !!(profile && !isOffboarded);
    const live = activeEmployees.some(record =>
      record.employeeId === person.id ||
      record.id === person.id ||
      record.email?.toLowerCase() === person.email?.toLowerCase()
    );
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

function renderAiAlerts() {
  if (!$('#aiAlertRows')) return;
  const status = $('#aiAlertStatus')?.value || 'new';
  const severity = $('#aiAlertSeverity')?.value || 'all';
  const term = ($('#aiAlertEmployee')?.value || '').toLowerCase();
  const start = $('#aiAlertStart')?.value || '';
  const end = $('#aiAlertEnd')?.value || '';
  const alerts = overtimeAlerts.filter(alert => {
    const name = alertEmployeeName(alert).toLowerCase();
    return (status === 'all' || alert.status === status) &&
      (severity === 'all' || alert.severity === severity) &&
      (!term || name.includes(term) || String(alert.role_name || '').toLowerCase().includes(term)) &&
      (!start || alert.alert_date >= start) &&
      (!end || alert.alert_date <= end);
  });
  $('#aiRoleRules').innerHTML = roleHourRules.map(rule => {
    const days = Array.isArray(rule.allowed_days) && rule.allowed_days.length ? rule.allowed_days.join(', ') : 'Flexible days';
    const daily = rule.daily_hour_limit === null || rule.daily_hour_limit === undefined ? 'Flexible' : `${Number(rule.daily_hour_limit).toFixed(2)}h/day`;
    const weekly = rule.weekly_hour_limit === null || rule.weekly_hour_limit === undefined ? '' : ` · ${Number(rule.weekly_hour_limit).toFixed(2)}h/week`;
    return `<article><span>${escapeHtml(rule.role_name)}</span><b>${daily}${weekly}</b><small>${escapeHtml(days)}</small></article>`;
  }).join('');
  $('#aiAlertNewCount').textContent = overtimeAlerts.filter(alert => alert.status === 'new').length;
  $('#aiAlertHighCount').textContent = overtimeAlerts.filter(alert => alert.severity === 'high').length;
  $('#aiAlertPayrollCount').textContent = overtimeAlerts.filter(alert => alert.status === 'payroll_pending').length;
  $('#aiAlertPendingHours').textContent = formatDuration(overtimeAlerts.filter(alert => ['new', 'pending_employee_explanation', 'payroll_pending'].includes(alert.status)).reduce((sum, alert) => sum + Number(alert.excess_hours || 0) * 3600, 0));
  $('#aiAlertRows').innerHTML = alerts.map(alert => {
    const name = alertEmployeeName(alert);
    const hours = `<b>${Number(alert.actual_hours || 0).toFixed(2)}h</b><small>Allowed ${Number(alert.allowed_hours || 0).toFixed(2)}h · Excess ${Number(alert.excess_hours || 0).toFixed(2)}h</small><small>${alert.has_approved_ot ? 'Approved OT context found' : 'No approved OT found'}</small>`;
    const ai = `<b>${escapeHtml(alert.ai_summary || 'AI recommendation unavailable. Please review manually.')}</b><small>${escapeHtml(alert.ai_suggested_action || 'Review manually.')}</small><small>Payroll: ${escapeHtml(alert.ai_payroll_recommendation || 'Keep pending until admin decision.')}</small>`;
    const actions = `<div class="ai-alert-actions"><button class="approve-btn" data-ai-alert-action="approve_ot" data-ai-alert-id="${alert.id}">Approve OT</button><button class="reject-btn" data-ai-alert-action="reject_excess" data-ai-alert-id="${alert.id}">Reject excess</button><button class="secondary" data-ai-alert-action="ask_explanation" data-ai-alert-id="${alert.id}">Ask employee</button><button class="secondary" data-ai-alert-action="reviewed" data-ai-alert-id="${alert.id}">Reviewed</button><button class="secondary" data-ai-alert-action="note" data-ai-alert-id="${alert.id}">Note</button></div>`;
    return `<div class="ai-alert-row"><div class="person"><span class="person-avatar" style="background:#bad7ed">${initials(name)}</span><span>${escapeHtml(name)}<small>${escapeHtml(alert.role_name || alert.profiles?.job_role || '')}</small></span></div><span>${escapeHtml(alert.alert_date)}</span><span class="ai-alert-hours">${hours}</span><span class="severity-pill ${escapeHtml(alert.severity)}">${escapeHtml(alert.severity)}</span><span class="ai-alert-copy">${ai}</span><span class="access-state ${alert.status === 'new' ? 'pending' : ''}">${escapeHtml(alert.status)}</span>${actions}</div>`;
  }).join('') || '<div class="empty-state">No AI overtime alerts match these filters.</div>';
  $('#aiAlertCount').textContent = `${alerts.length} alert${alerts.length === 1 ? '' : 's'}`;
}

async function updateAiAlertAction(id, action) {
  const alert = overtimeAlerts.find(item => item.id === id);
  if (!alert) return showToast('AI alert not found.');
  let status = alert.status;
  let decision = alert.admin_decision || '';
  let note = alert.admin_note || '';
  if (action === 'approve_ot') {
    status = 'approved';
    decision = 'approve_ot';
  } else if (action === 'reject_excess') {
    status = 'rejected';
    decision = 'reject_excess';
  } else if (action === 'ask_explanation') {
    status = 'pending_employee_explanation';
    decision = 'ask_employee_explanation';
  } else if (action === 'reviewed') {
    status = 'reviewed';
    decision = decision || 'reviewed';
  } else if (action === 'note') {
    const response = prompt('Add or update the admin note for this alert:', note);
    if (response === null) return;
    note = response.trim();
    decision = decision || 'admin_note';
  }
  const patch = {
    status,
    admin_decision: decision,
    admin_note: note,
    reviewed_at: new Date().toISOString(),
    reviewed_by: currentProfile?.id || null
  };
  if (usesSupabase()) {
    const { error } = await supabaseClient.from('overtime_alerts').update(patch).eq('id', id);
    if (error) return showToast(`AI alert update error: ${error.message}`);
    await loadOvertimeAlerts();
  } else {
    overtimeAlerts = overtimeAlerts.map(item => item.id === id ? { ...item, ...patch } : item);
    localStorage.setItem('sync2time-overtime-alerts', JSON.stringify(overtimeAlerts));
  }
  renderAiAlerts();
  renderPayroll();
  showToast('AI alert decision saved.');
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
    reason: cleanTimeEditReason(request.reason) || 'No notes provided.'
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
  renderAuditLog();
  showToast(`Request ${status}.`);
  return true;
}

function renderEmployeeRequests() {
  if (!currentAccount) return;
  const myLeaves = leaveRequests.filter(request => request.employeeEmail === currentAccount.email);
  const myEdits = timeEditRequests.filter(request => request.employeeEmail === currentAccount.email);
  const myOvertime = overtimeRequests.filter(request => request.employeeEmail === currentAccount.email);
  $('#myLeaveRows').innerHTML = myLeaves.map(request => `<div class="approval-row"><div><b>${request.date}</b><small>${escapeHtml(request.reason)}</small></div><span class="access-state ${request.status === 'pending' ? 'pending' : ''}">${request.status}</span></div>`).join('') || '<div class="empty-state">No leave requests yet.</div>';
  $('#myTimeEditRows').innerHTML = myEdits.map(request => `<div class="approval-row"><div><b>${escapeHtml(request.date)}</b><small>${escapeHtml(request.clockIn)}-${escapeHtml(request.clockOut)}</small><small>${escapeHtml(cleanTimeEditReason(request.reason) || 'No note provided')}</small></div><span class="access-state ${request.status === 'pending' ? 'pending' : ''}">${request.status}</span></div>`).join('') || '<div class="empty-state">No time edit requests yet.</div>';
  $('#myOvertimeRows').innerHTML = myOvertime.map(request => `<div class="approval-row"><div><b>${escapeHtml(request.date)}</b><small>${Number(request.hours).toFixed(2)} OT hours</small><small>${escapeHtml(request.reason)}</small></div><span class="access-state ${request.status === 'pending' ? 'pending' : ''}">${request.status}</span></div>`).join('') || '<div class="empty-state">No overtime requests yet.</div>';
  renderLeaveCalendar();
}

function auditLogRecords() {
  const since = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const rows = [];
  const timeEntries = [...supabaseTimeEntries, ...supabaseDeletedTimeEntries];
  timeEntries.forEach((entry, index) => {
    const person = attendanceRecordFromSupabase(entry, index);
    const activity = parseLiveActivity(entry.task);
    const clockInAt = entry.clock_in ? new Date(entry.clock_in) : null;
    const clockOutAt = entry.clock_out ? new Date(entry.clock_out) : null;
    if (clockInAt && clockInAt.getTime() >= since) {
      rows.push({
        at: clockInAt,
        employee: person.name,
        activity: 'Clock in',
        details: activity.task || 'Tracked time',
        status: entry.status === 'working' || !entry.clock_out ? 'Working' : entry.status || 'completed'
      });
    }
    if (clockOutAt && clockOutAt.getTime() >= since) {
      rows.push({
        at: clockOutAt,
        employee: person.name,
        activity: entry.status === 'deleted' ? 'Deleted time entry' : 'Clock out',
        details: `${person.clockIn}-${person.clockOut} · ${person.worked}`,
        status: entry.status || 'completed'
      });
    }
  });
  timeEditRequests.forEach(request => {
    const created = new Date(request.createdAt || request.date || Date.now());
    if (!Number.isFinite(created.getTime()) || created.getTime() < since) return;
    rows.push({
      at: created,
      employee: request.employeeName,
      activity: isAddTimeEditRequest(request) ? 'Added time request' : timeEditSourceEntryId(request.reason) ? 'Time correction request' : 'Time edit request',
      details: `${request.date} · ${request.clockIn}-${request.clockOut}${cleanTimeEditReason(request.reason) ? ` · ${cleanTimeEditReason(request.reason)}` : ''}`,
      status: request.status || 'pending'
    });
  });
  return rows.sort((a, b) => b.at - a.at);
}

function renderAuditLog() {
  const rowsTarget = $('#auditRows');
  if (!rowsTarget) return;
  const rows = auditLogRecords();
  rowsTarget.innerHTML = rows.map(row => `<div class="audit-row"><span class="audit-time">${businessDateTimeLabel(row.at, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span><span><b>${escapeHtml(row.employee)}</b></span><span>${escapeHtml(row.activity)}</span><span>${escapeHtml(row.details)}</span><span class="access-state ${row.status === 'pending' ? 'pending' : ''}">${escapeHtml(row.status)}</span></div>`).join('') || '<div class="empty-state">No audit activity in the last 30 days.</div>';
  $('#auditCount').textContent = `${rows.length} audit record${rows.length === 1 ? '' : 's'}`;
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

function payrollAdjustmentHistoryFor(employeeId) {
  return payrollAdjustmentEvents
    .filter(item => (item.employee_id || item.employeeId) === employeeId)
    .sort((left, right) => new Date(right.created_at || right.createdAt || 0) - new Date(left.created_at || left.createdAt || 0));
}

function renderEmployeePayrollAdjustments() {
  if (!$('#employeeAdjustmentRows')) return;
  const employeeId = currentProfile?.id || currentAccount?.id;
  const history = payrollAdjustmentHistoryFor(employeeId);
  const own = payrollAdjustments.filter(item => (item.employee_id || item.employeeId) === employeeId);
  const summaryHtml = own.map(item => {
    const from = item.period_start || item.periodStart;
    const to = item.period_end || item.periodEnd;
    const hours = Number(item.deducted_hours ?? item.deductedHours ?? 0);
    const amount = Number(item.deducted_amount ?? item.deductedAmount ?? 0);
    const adjustmentPhp = Number(item.adjustment_php ?? item.adjustmentPhp ?? 0);
    const deductionsPhp = Number(item.deductions_php ?? item.deductionsPhp ?? 0);
    const commissionPhp = Number(item.commission_php ?? item.commissionPhp ?? 0);
    const holidayPayPhp = Number(item.holiday_pay_override ?? item.holidayPayOverride ?? 0);
    const otherEarningsPhp = Number(item.other_earnings_php ?? item.otherEarningsPhp ?? 0);
    const bankFeesPhp = Number(item.bank_fees_php ?? item.bankFeesPhp ?? 0);
    const otherDeductionsPhp = Number(item.other_deductions_php ?? item.otherDeductionsPhp ?? 0);
    const pagibigPhp = Number(item.statutory_pagibig_php ?? item.statutoryPagibigPhp ?? 0);
    const philHealthPhp = Number(item.statutory_philhealth_php ?? item.statutoryPhilHealthPhp ?? 0);
    const sssPhp = Number(item.statutory_sss_php ?? item.statutorySssPhp ?? 0);
    const payableOverride = payableHoursOverrideValue(item);
    const details = `Current summary | Hour adjustment: ${signedHourLabel(hours)}${payableOverride !== null ? ` | Approved payable: ${payableOverride.toFixed(2)}h` : ''} | USD amount: ${money(amount)} | Holiday: ${phpMoney(holidayPayPhp)} | PHP adjustment: ${phpMoney(adjustmentPhp)} | Other earnings: ${phpMoney(otherEarningsPhp)} | Deductions: ${phpMoney(deductionsPhp)} | Commission: ${phpMoney(commissionPhp)} | Pag-IBIG: ${phpMoney(pagibigPhp)} | PhilHealth: ${phpMoney(philHealthPhp)} | SSS: ${phpMoney(sssPhp)} | Bank fees: ${phpMoney(bankFeesPhp)} | Other deduction: ${phpMoney(otherDeductionsPhp)}`;
    return `<div class="payroll-adjustment-notice payroll-adjustment-summary-notice"><div><b>${escapeHtml(from)} to ${escapeHtml(to)}</b><small>${escapeHtml(details)}</small><small>${escapeHtml(item.note || 'No note provided')}</small></div><span class="access-state">Summary</span></div>`;
  }).join('');
  if (history.length) {
    const historyHtml = history.map(item => {
      const from = item.period_start || item.periodStart;
      const to = item.period_end || item.periodEnd;
      const actual = Number(item.actual_hours ?? item.actualHours ?? 0);
      const previousPayable = Number(item.previous_payable_hours ?? item.previousPayableHours ?? 0);
      const newPayable = Number(item.new_payable_hours ?? item.newPayableHours ?? 0);
      const delta = Number(item.deducted_hours_delta ?? item.deductedHoursDelta ?? 0);
      const total = Number(item.total_deducted_hours ?? item.totalDeductedHours ?? 0);
      const createdAt = item.created_at || item.createdAt;
      const details = `Actual: ${actual.toFixed(2)}h | Payable: ${previousPayable.toFixed(2)}h → ${newPayable.toFixed(2)}h | This edit: ${signedHourShort(delta)} | Total adjustment: ${signedHourShort(total)}`;
      return `<div class="payroll-adjustment-notice"><div><b>${escapeHtml(from)} to ${escapeHtml(to)}</b><small>${escapeHtml(details)}</small><small>${escapeHtml(item.note || 'No note provided')}</small><small>${createdAt ? businessDateTimeLabel(createdAt) : 'Recorded by admin'}</small></div><span class="access-state">Time edit</span></div>`;
    }).join('');
    $('#employeeAdjustmentRows').innerHTML = `${historyHtml}${summaryHtml}`;
    return;
  }
  $('#employeeAdjustmentRows').innerHTML = summaryHtml || '<div class="empty-state">No payroll adjustments.</div>';
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

function adjustmentFor(employeeId, start, end, assignmentKey = 'primary') {
  const startKey = isoDate(start);
  const endKey = isoDate(end);
  return payrollAdjustments.find(item =>
    (item.employee_id || item.employeeId) === employeeId &&
    (item.period_start || item.periodStart) === startKey &&
    (item.period_end || item.periodEnd) === endKey &&
    ((item.assignment_key || item.assignmentKey || 'primary') === assignmentKey)
  ) || null;
}

function payrollAdjustmentConflictTarget() {
  return 'employee_id,period_start,period_end,assignment_key';
}

function payrollAdjustmentMatches(item, employeeId, startKey, endKey, assignmentKey = 'primary') {
  return (item.employee_id || item.employeeId) === employeeId &&
    (item.period_start || item.periodStart) === startKey &&
    (item.period_end || item.periodEnd) === endKey &&
    ((item.assignment_key || item.assignmentKey || 'primary') === assignmentKey);
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
    const actualHours = row.seconds / 3600;
    const payableOverride = payableHoursOverrideValue(adjustment);
    const deductedHours = signedHoursFromAdjustment(adjustment, actualHours);
    const deductedAmount = Math.max(0, Number(adjustment?.deducted_amount ?? adjustment?.deductedAmount ?? 0));
    const commission = Math.max(0, Number(adjustment?.commission ?? 0));
    const holidayPayPhp = Number(adjustment?.holiday_pay_override ?? adjustment?.holidayPayOverride ?? 0);
    const otherEarningsPhp = Number(adjustment?.other_earnings_php ?? adjustment?.otherEarningsPhp ?? 0);
    const manualDeductionsPhp = Number(adjustment?.deductions_php ?? adjustment?.deductionsPhp ?? 0);
    const bankFeesPhp = Number(adjustment?.bank_fees_php ?? adjustment?.bankFeesPhp ?? 0);
    const otherDeductionsPhp = Number(adjustment?.other_deductions_php ?? adjustment?.otherDeductionsPhp ?? 0);
    const rate = hourlyRate(row) || 0;
    const payableSeconds = payableOverride !== null ? Math.max(0, payableOverride * 3600) : Math.max(0, row.seconds - deductedHours * 3600);
    const netPay = Math.max(0, row.pay - deductedHours * rate - deductedAmount + commission);
    return { ...row, adjustment, payableOverride, deductedHours, deductedAmount, commission, holidayPayPhp, otherEarningsPhp, manualDeductionsPhp, bankFeesPhp, otherDeductionsPhp, payableSeconds, netPay };
  });
  currentReportRows = rows;
  $('#reportTotalHours').textContent = formatDuration(rows.reduce((sum, row) => sum + row.seconds, 0));
  $('#reportEmployeeCount').textContent = new Set(rows.map(row => row.email)).size;
  $('#reportEntryCount').textContent = records.length;
  $('#reportPayEstimate').textContent = money(rows.reduce((sum, row) => sum + row.netPay, 0));
  $('#reportPayDate').textContent = payDate ? businessDateLabel(payDate, { month: 'short', day: 'numeric' }) : 'N/A';
  $('#reportPayDateNote').textContent = payDate ? (businessDateFromKey(payDateKey) < businessDateFromKey(isoDate(todayDate)) ? 'Completed payroll date' : 'Scheduled payroll date') : 'Only applies to payroll cutoffs';
  $('#reportRows').innerHTML = rows.map(row => {
    const adjustmentText = row.adjustment ? `${signedHourShort(row.deductedHours)} · -${money(row.deductedAmount)} · +${money(row.commission)} · Holiday ${phpMoney(row.holidayPayPhp)} · Other earnings ${phpMoney(row.otherEarningsPhp)} · Deductions ${phpMoney(row.manualDeductionsPhp)} · Bank ${phpMoney(row.bankFeesPhp)} · Other deduction ${phpMoney(row.otherDeductionsPhp)}` : 'No adjustment';
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
  if (person?.payrollRoleOverride) return person.payrollRoleOverride;
  const role = String(person.role || '').toLowerCase();
  if (role.includes('webinar')) return 'webinar';
  if (role.includes('smm')) return 'smm';
  if (role.includes('coach')) return 'coaches';
  if (role.includes('admin')) return 'admin';
  return 'other';
}

function payrollPersonForDualAssignment(person, assignment) {
  return {
    ...person,
    payrollAssignmentKey: assignment.key,
    payrollRoleOverride: assignment.payrollRole,
    primaryRole: person.role,
    role: assignment.role,
    department: assignment.department,
    task: assignment.project,
    rate: assignment.monthlyPhp,
    rateType: 'Monthly PHP',
    scheduledStart: null,
    scheduledEnd: null,
    schedule: assignment.schedule,
    dualAssignment: assignment
  };
}

function payrollRosterForRole(role = selectedPayrollRole) {
  const base = rosterSource().filter(person =>
    person.email?.toLowerCase() !== adminAccount.email &&
    payrollRole(person) === role
  );
  const dualRows = role === 'other'
    ? rosterSource()
      .filter(person => person.email?.toLowerCase() !== adminAccount.email)
      .flatMap(person => DUAL_PAYROLL_ASSIGNMENTS
        .filter(assignment => assignment.payrollRole === role && personMatchesAssignment(person, assignment))
        .map(assignment => payrollPersonForDualAssignment(person, assignment)))
    : [];
  return [...base, ...dualRows];
}

function payrollEntryBelongsToPersonRole(entry, person, role) {
  const assignment = dualAssignmentForPerson(person);
  if (!assignment) return true;
  const isAssignmentEntry = entryMatchesDualAssignment(entry, assignment);
  if (payrollAssignmentKey(person) === assignment.key) return isAssignmentEntry;
  if (role === 'coaches') return !isAssignmentEntry;
  return true;
}

function payrollEntryEmployeeId(person) {
  return realEmployeeId(person);
}

function scheduledHoursInRange(person, start, end) {
  if (person.scheduledStart === null || person.scheduledEnd === null) return 0;
  let daily = person.scheduledEnd - person.scheduledStart;
  if (daily <= 0) daily += 1440;
  daily /= 60;
  let workUnits = 0;
  let cursor = businessDateFromKey(isoDate(start));
  const last = businessDateFromKey(isoDate(end));
  while (cursor <= last) {
    if (payrollRole(person) === 'admin') {
      workUnits += adminWorkUnitForDate(cursor);
    } else if (cursor.getUTCDay() !== 0 && cursor.getUTCDay() !== 6) {
      workUnits++;
    }
    cursor = addBusinessDays(cursor, 1);
  }
  return daily * workUnits;
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

function payrollFxOverrideKey(start, end) {
  return `${isoDate(start)}_${isoDate(end)}`;
}

function currentPayrollFxOverrideKey() {
  const { start, end } = payrollRange();
  return payrollFxOverrideKey(start, end);
}

function payrollUsdPhpRate(start = null, end = null) {
  const key = start && end ? payrollFxOverrideKey(start, end) : currentPayrollFxOverrideKey();
  const cutoffRate = Number(payrollFxOverrides[key]);
  return cutoffRate > 0 ? cutoffRate : (manualPayrollFxOverride > 0 ? manualPayrollFxOverride : (liveUsdPhpRate || 1 / phpUsdRate));
}

function persistPayrollFxOverrides() {
  localStorage.setItem('sync2time-payroll-usd-php-overrides', JSON.stringify(payrollFxOverrides));
}

async function savePayrollFxOverridesSetting() {
  if (!usesSupabase()) return;
  await saveSupabaseSetting('payroll_usd_php_overrides', { rates: payrollFxOverrides, updatedAt: new Date().toISOString() });
  await saveSupabaseSetting('payroll_usd_php_override', { rate: null, updatedAt: new Date().toISOString() });
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

function signedHourLabel(hours = 0, deductWord = 'Deducted', addWord = 'Added') {
  const value = Number(hours || 0);
  if (Math.abs(value) <= 0.004) return 'No hour adjustment';
  return `${value > 0 ? deductWord : addWord} ${Math.abs(value).toFixed(2)}h`;
}

function signedHourShort(hours = 0) {
  const value = Number(hours || 0);
  if (Math.abs(value) <= 0.004) return '0.00h';
  return `${value > 0 ? '-' : '+'}${Math.abs(value).toFixed(2)}h`;
}

function payableHoursOverrideValue(adjustment) {
  const raw = adjustment?.payable_hours_override ?? adjustment?.payableHoursOverride;
  if (raw === null || raw === undefined || raw === '') return null;
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : null;
}

function signedHoursFromAdjustment(adjustment, actualHours) {
  const payableOverride = payableHoursOverrideValue(adjustment);
  if (payableOverride !== null) return Number(actualHours || 0) - payableOverride;
  return Number(adjustment?.deducted_hours ?? adjustment?.deductedHours ?? 0);
}

function dbDeductedHours(hours) {
  return Math.max(0, Number(hours || 0));
}

function signedPhpMoney(value = 0) {
  const amount = Number(value || 0);
  if (Math.abs(amount) <= 0.004) return phpMoney(0);
  return `${amount > 0 ? '-' : '+'}${phpMoney(Math.abs(amount))}`;
}

function signedPhpPlain(value = 0) {
  const amount = Number(value || 0);
  if (Math.abs(amount) <= 0.004) return 'PHP 0.00';
  return `${amount > 0 ? '-' : '+'}PHP ${Math.abs(amount).toFixed(2)}`;
}

function clampNumber(value, min, max) {
  const number = Number(value || 0);
  if (!Number.isFinite(number)) return min;
  return Math.min(max, Math.max(min, number));
}

function nullableMoneyValue(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, number) : null;
}

function nonNegativeMoneyValue(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? Math.max(0, number) : 0;
}

function isMonthlyStatutoryCutoff(start, end) {
  return Number(isoDate(start).slice(8, 10)) === MONTHLY_STATUTORY_CUTOFF_DAYS.startDay
    && Number(isoDate(end).slice(8, 10)) === MONTHLY_STATUTORY_CUTOFF_DAYS.endDay;
}

function calculatedMonthlyStatutoryDeductions(person) {
  const monthlyPhp = Number(person?.rate || 0) >= 1000 ? Number(person.rate || 0) : 0;
  if (!monthlyPhp) {
    return { sss: 0, philHealth: 0, pagibig: 0, total: 0 };
  }
  const sssMonthly = Math.min(monthlyPhp, 35000) * 0.05;
  const philHealthMonthly = clampNumber(monthlyPhp, 10000, 100000) * 0.025;
  const pagibigMonthly = Math.min(monthlyPhp, 10000) * 0.02;
  const sss = sssMonthly;
  const philHealth = philHealthMonthly;
  const pagibig = pagibigMonthly;
  return {
    sss,
    philHealth,
    pagibig,
    total: sss + philHealth + pagibig
  };
}

function statutoryAdminDeductions(person, values, start, end) {
  const appliesThisCutoff = isMonthlyStatutoryCutoff(start, end);
  const fallback = STATUTORY_DEFAULTS_BY_EMPLOYEE[nameKey(person?.name)] || calculatedMonthlyStatutoryDeductions(person);
  if (!appliesThisCutoff) {
    return { sss: 0, philHealth: 0, pagibig: 0, total: 0, appliesThisCutoff, fallback };
  }
  const sss = nullableMoneyValue(values?.statutorySssOverride) ?? fallback.sss;
  const philHealth = nullableMoneyValue(values?.statutoryPhilHealthOverride) ?? fallback.philHealth;
  const pagibig = nullableMoneyValue(values?.statutoryPagibigOverride) ?? fallback.pagibig;
  return {
    sss,
    philHealth,
    pagibig,
    total: sss + philHealth + pagibig,
    appliesThisCutoff,
    fallback
  };
}

function statutoryPayrollDeductions(person, values, start, end, role) {
  const adminDeductions = statutoryAdminDeductions(person, values, start, end);
  const hasManualStatutory = ['statutorySssOverride', 'statutoryPhilHealthOverride', 'statutoryPagibigOverride']
    .some(key => values?.[key] !== null && values?.[key] !== undefined && values?.[key] !== '');
  if (role === 'admin') return adminDeductions;
  if (!hasManualStatutory) {
    return { sss: 0, philHealth: 0, pagibig: 0, total: 0, appliesThisCutoff: false, fallback: { sss: 0, philHealth: 0, pagibig: 0 } };
  }
  const sss = nullableMoneyValue(values.statutorySssOverride) ?? 0;
  const philHealth = nullableMoneyValue(values.statutoryPhilHealthOverride) ?? 0;
  const pagibig = nullableMoneyValue(values.statutoryPagibigOverride) ?? 0;
  return {
    sss,
    philHealth,
    pagibig,
    total: sss + philHealth + pagibig,
    appliesThisCutoff: true,
    fallback: { sss: 0, philHealth: 0, pagibig: 0 }
  };
}

function holidayDatesInRange(start, end) {
  const startKey = isoDate(start);
  const endKey = isoDate(end);
  return philippineHolidays2026
    .filter(holiday => holiday.date >= startKey && holiday.date <= endKey)
    .map(holiday => ({ ...holiday, dateObject: businessDateFromKey(holiday.date) }));
}

function adminWorkUnitForDate(date) {
  const day = businessDateFromKey(isoDate(date)).getUTCDay();
  if (day >= 1 && day <= 5) return 1;
  if (day === 6) return 0.5;
  return 0;
}

function adminWorkUnitsInRange(start, end) {
  let units = 0;
  let cursor = businessDateFromKey(isoDate(start));
  const last = businessDateFromKey(isoDate(end));
  while (cursor <= last) {
    units += adminWorkUnitForDate(cursor);
    cursor = addBusinessDays(cursor, 1);
  }
  return units;
}

function monthlyRateDailyValue(person, start) {
  const monthlyPhp = typeof person?.rate === 'number' && person.rate >= 1000 ? Number(person.rate) : 0;
  if (!monthlyPhp) return 0;
  const monthStart = businessDateFromKey(`${isoDate(start).slice(0, 7)}-01`);
  const monthEnd = businessDateFromKey(`${isoDate(start).slice(0, 7)}-${pad(businessMonthLastDay(Number(isoDate(start).slice(0, 4)), Number(isoDate(start).slice(5, 7))))}`);
  return monthlyPhp / Math.max(1, adminWorkUnitsInRange(monthStart, monthEnd));
}

function holidayHoursFromEntries(entries) {
  return entries.reduce((sum, entry) => {
    if (!entry.clock_in) return sum;
    const entryDate = businessDateFromKey(isoDate(new Date(entry.clock_in)));
    if (!holidayForDate(entryDate)) return sum;
    return sum + secondsBetween(entry.clock_in, entry.clock_out || Date.now()) / 3600;
  }, 0);
}

function calculatedHolidayPay(person, role, entries, start, end, fx, hourlyUsd, monthlyPhp) {
  if (role === 'coaches') {
    return holidayHoursFromEntries(entries) * Number(hourlyUsd || 0) * Number(fx || 0);
  }
  if (role === 'admin' && monthlyPhp) {
    const dailyRate = monthlyRateDailyValue(person, start);
    return holidayDatesInRange(start, end).reduce((sum, holiday) => {
      const unit = adminWorkUnitForDate(holiday.dateObject);
      return sum + dailyRate * unit;
    }, 0);
  }
  return 0;
}

function payrollAdjustmentValues(person, start, end) {
  const adjustment = adjustmentFor(payrollEntryEmployeeId(person), start, end, payrollAssignmentKey(person));
  return {
    record: adjustment,
    deductedHours: Number(adjustment?.deducted_hours ?? adjustment?.deductedHours ?? 0),
    payableHoursOverride: payableHoursOverrideValue(adjustment),
    deductedAmount: Math.max(0, Number(adjustment?.deducted_amount ?? adjustment?.deductedAmount ?? 0)),
    adjustment: Number(adjustment?.adjustment_php ?? adjustment?.adjustmentPhp ?? 0),
    deductions: Number(adjustment?.deductions_php ?? adjustment?.deductionsPhp ?? 0),
    commission: Number(adjustment?.commission_php ?? adjustment?.commissionPhp ?? adjustment?.commission ?? 0),
    otherEarnings: Number(adjustment?.other_earnings_php ?? adjustment?.otherEarningsPhp ?? 0),
    bankFees: nonNegativeMoneyValue(adjustment?.bank_fees_php ?? adjustment?.bankFeesPhp ?? 0),
    otherDeductions: nonNegativeMoneyValue(adjustment?.other_deductions_php ?? adjustment?.otherDeductionsPhp ?? 0),
    holidayPayOverride: adjustment?.holiday_pay_override ?? adjustment?.holidayPayOverride ?? null,
    cutoffPayOverride: adjustment?.cutoff_pay_override ?? adjustment?.cutoffPayOverride ?? null,
    grossPayOverride: adjustment?.gross_pay_override ?? adjustment?.grossPayOverride ?? null,
    statutorySssOverride: adjustment?.statutory_sss_php ?? adjustment?.statutorySssPhp ?? null,
    statutoryPhilHealthOverride: adjustment?.statutory_philhealth_php ?? adjustment?.statutoryPhilHealthPhp ?? null,
    statutoryPagibigOverride: adjustment?.statutory_pagibig_php ?? adjustment?.statutoryPagibigPhp ?? null,
    paystubApproved: Boolean(adjustment?.paystub_approved ?? adjustment?.paystubApproved),
    paystubEmailedAt: adjustment?.paystub_emailed_at ?? adjustment?.paystubEmailedAt ?? null,
    note: adjustment?.note || ''
  };
}

function buildPayrollRows(role = selectedPayrollRole, rangeOverride = null) {
  const { start, end, startKey } = rangeOverride || payrollRange();
  const fx = payrollUsdPhpRate(start, end);
  return payrollRosterForRole(role).map(person => {
    const employeeId = payrollEntryEmployeeId(person);
    const entries = supabaseTimeEntries.filter(entry => {
      if (entry.employee_id !== employeeId || !entry.clock_in) return false;
      const date = new Date(entry.clock_in);
      return date >= start && date <= end && payrollEntryBelongsToPersonRole(entry, person, role);
    });
    const actualHours = entries.reduce((sum, entry) => sum + secondsBetween(entry.clock_in, entry.clock_out || Date.now()) / 3600, 0);
    const requestedOtHours = overtimeRequests.filter(request => {
      const date = businessDateFromKey(request.date);
      return request.employeeId === employeeId && request.status === 'approved' && date >= start && date <= end && !isSecondaryPayrollAssignment(person);
    }).reduce((sum, request) => sum + Number(request.hours || 0), 0);
    const aiApprovedOtHours = approvedAiAlertOtHours(person, start, end);
    const otHours = requestedOtHours + aiApprovedOtHours;
    const pendingOtHours = pendingAiAlertHours(person, start, end);
    const rejectedOtHours = rejectedAiAlertHours(person, start, end);
    const excludedAiHours = pendingOtHours + rejectedOtHours;
    const payrollBaseHours = Math.max(0, actualHours - excludedAiHours);
    const expectedHours = scheduledHoursInRange(person, start, end);
    const values = payrollAdjustmentValues(person, start, end);
    const hourlyUsd = typeof person.rate === 'number' && person.rate < 1000 ? person.rate : 0;
    const monthlyPhp = typeof person.rate === 'number' && person.rate >= 1000 ? person.rate : 0;
    const calculatedCutoffPay = person.dualAssignment?.cutoffPayPhp ?? monthlyPhp / 2;
    const cutoffPay = values.cutoffPayOverride === null ? calculatedCutoffPay : Number(values.cutoffPayOverride);
    const monthStart = businessDateFromKey(`${startKey.slice(0, 7)}-01`);
    const monthEnd = businessDateFromKey(`${startKey.slice(0, 7)}-${pad(businessMonthLastDay(Number(startKey.slice(0, 4)), Number(startKey.slice(5, 7))))}`);
    const dailyRate = role === 'admin' ? monthlyRateDailyValue(person, start) : monthlyPhp / Math.max(1, weekdayCount(monthStart, monthEnd));
    const otPay = otHours * (dailyRate / 8) * 1.25;
    const hourlyDeductionRatePhp = monthlyPhp ? dailyRate / 8 : hourlyUsd * fx;
    const hourAdjustment = values.payableHoursOverride !== null
      ? payrollBaseHours - values.payableHoursOverride
      : values.deductedHours;
    const hourDeductionPhp = hourAdjustment * hourlyDeductionRatePhp;
    const amountDeductionPhp = role === 'coaches' || (!monthlyPhp && hourlyUsd) ? values.deductedAmount * fx : values.deductedAmount;
    const quickDeductionPhp = hourDeductionPhp + amountDeductionPhp;
    const payableHours = values.payableHoursOverride !== null ? Math.max(0, values.payableHoursOverride) : Math.max(0, payrollBaseHours - hourAdjustment);
    const statutory = statutoryPayrollDeductions(person, values, start, end, role);
    let grossUsd = 0;
    let grossPhp = 0;
    if (role === 'coaches') {
      grossUsd = payrollBaseHours * hourlyUsd;
      grossPhp = grossUsd * fx;
    } else if (role === 'admin') {
      grossPhp = cutoffPay + otPay;
    } else if (role === 'smm') {
      grossPhp = values.grossPayOverride === null ? cutoffPay : Number(values.grossPayOverride);
    } else if (role === 'other') {
      grossPhp = monthlyPhp ? cutoffPay : payrollBaseHours * hourlyUsd * fx;
    }
    const calculatedHolidayPayPhp = calculatedHolidayPay(person, role, entries, start, end, fx, hourlyUsd, monthlyPhp);
    const holidayPayPhp = values.holidayPayOverride === null || values.holidayPayOverride === undefined || values.holidayPayOverride === ''
      ? calculatedHolidayPayPhp
      : Math.max(0, Number(values.holidayPayOverride) || 0);
    const calculatedNetPay = grossPhp + holidayPayPhp + values.adjustment + values.otherEarnings + values.deductions + values.commission - quickDeductionPhp - statutory.total - values.bankFees - values.otherDeductions;
    const netPay = Math.max(0, calculatedNetPay);
    return { ...values, assignmentKey: payrollAssignmentKey(person), employeeId, payrollRole: role, person, expectedHours, actualHours, payrollBaseHours, excludedAiHours, otHours, requestedOtHours, aiApprovedOtHours, pendingOtHours, rejectedOtHours, hourlyUsd, monthlyPhp, cutoffPay, otPay, grossUsd, grossPhp, calculatedHolidayPayPhp, holidayPayPhp, netPay, payableHours, deductedHours: hourAdjustment, storedDeductedHours: dbDeductedHours(hourAdjustment), hourlyDeductionRatePhp, hourDeductionPhp, amountDeductionPhp, quickDeductionPhp, statutorySssPhp: statutory.sss, statutoryPhilHealthPhp: statutory.philHealth, statutoryPagibigPhp: statutory.pagibig, statutoryDeductionsPhp: statutory.total, statutoryAppliesThisCutoff: statutory.appliesThisCutoff, statutoryFallback: statutory.fallback };
  });
}

function payrollHourChip(row) {
  const deducted = Number(row.deductedHours || 0);
  const payable = Number(row.payableHours ?? row.actualHours);
  const alertBits = [];
  if (Number(row.pendingOtHours || 0) > 0) alertBits.push(`Pending OT ${row.pendingOtHours.toFixed(2)}h`);
  if (Number(row.rejectedOtHours || 0) > 0) alertBits.push(`Rejected ${row.rejectedOtHours.toFixed(2)}h`);
  const note = deducted > 0
    ? `Deducted ${deducted.toFixed(2)}h · payable ${payable.toFixed(2)}h`
    : deducted < 0
      ? `Added ${Math.abs(deducted).toFixed(2)}h · payable ${payable.toFixed(2)}h`
    : Number(row.excludedAiHours || 0) > 0
      ? `Payable ${payable.toFixed(2)}h after pending/rejected excess`
      : 'Click to quickly adjust hours';
  const sublabel = Math.abs(deducted) > 0.004 || Number(row.excludedAiHours || 0) > 0
    ? `<small>Payable ${payable.toFixed(2)}</small>`
    : '<small>Click to edit</small>';
  return `<button type="button" class="payroll-hour-chip" data-quick-hours="${escapeHtml(row.person.id)}" title="${escapeHtml(note)}"><b>${row.actualHours.toFixed(2)}</b>${sublabel}${alertBits.length ? `<small>${escapeHtml(alertBits.join(' · '))}</small>` : ''}</button>`;
}

function payrollAdjustmentStack(row, baseAmount, label = 'Manual') {
  const parts = [];
  const hourAdjustment = Number(row.deductedHours || 0);
  const payAdjustment = Number(row.quickDeductionPhp || 0);
  if (Math.abs(hourAdjustment) > 0.004) parts.push(signedHourShort(hourAdjustment));
  if (Math.abs(payAdjustment) > 0.004) parts.push(signedPhpMoney(payAdjustment));
  const details = parts.length ? parts.join(' · ') : 'No hour adjustment';
  return `<span class="payroll-money payroll-adjustment-stack" title="${escapeHtml(row.note || details)}">${phpMoney(baseAmount)}<small>${escapeHtml(details)}${row.note ? ` · ${escapeHtml(row.note)}` : ''}</small></span>`;
}

function coachAdjustmentStack(row) {
  const adjustment = Number(row.adjustment || 0);
  const deductions = Number(row.deductions || 0);
  const commission = Number(row.commission || 0);
  const holiday = Number(row.holidayPayPhp || 0);
  const otherEarnings = Number(row.otherEarnings || 0);
  const bankFees = Number(row.bankFees || 0);
  const otherDeductions = Number(row.otherDeductions || 0);
  const statutory = Number(row.statutoryDeductionsPhp || 0);
  const total = holiday + adjustment + otherEarnings + deductions + commission - bankFees - otherDeductions - statutory;
  const parts = [
    `Holiday ${phpMoney(holiday)}`,
    `Adjustment ${phpMoney(adjustment)}`,
    `Other earnings ${phpMoney(otherEarnings)}`,
    `Deductions ${phpMoney(deductions)}`,
    `Commission ${phpMoney(commission)}`,
    `Bank fees -${phpMoney(bankFees)}`,
    `Other deduction -${phpMoney(otherDeductions)}`,
    statutory ? `Gov -${phpMoney(statutory)}` : ''
  ];
  const hourAdjustment = Number(row.deductedHours || 0);
  const payAdjustment = Number(row.quickDeductionPhp || 0);
  if (Math.abs(hourAdjustment) > 0.004) parts.push(signedHourShort(hourAdjustment));
  if (Math.abs(payAdjustment) > 0.004) parts.push(signedPhpMoney(payAdjustment));
  return `<span class="payroll-money payroll-adjustment-stack" title="${escapeHtml(row.note || parts.filter(Boolean).join(' · '))}">${phpMoney(total)}<small>${escapeHtml(parts.filter(Boolean).join(' · '))}${row.note ? ` · ${escapeHtml(row.note)}` : ''}</small></span>`;
}

function adminDeductionsStack(row) {
  const adjustment = Number(row.adjustment || 0);
  const manual = Number(row.deductions || 0);
  const statutory = Number(row.statutoryDeductionsPhp || 0);
  const holiday = Number(row.holidayPayPhp || 0);
  const otherEarnings = Number(row.otherEarnings || 0);
  const bankFees = Number(row.bankFees || 0);
  const otherDeductions = Number(row.otherDeductions || 0);
  const totalDeductionLine = holiday + adjustment + otherEarnings + manual - statutory - bankFees - otherDeductions;
  const details = [
    `Holiday ${phpMoney(holiday)}`,
    `Adjustment ${phpMoney(adjustment)}`,
    `Other earnings ${phpMoney(otherEarnings)}`,
    `Manual ${phpMoney(manual)}`,
    `SSS -${phpMoney(row.statutorySssPhp)}`,
    `PhilHealth -${phpMoney(row.statutoryPhilHealthPhp)}`,
    `Pag-IBIG -${phpMoney(row.statutoryPagibigPhp)}`,
    `Bank fees -${phpMoney(bankFees)}`,
    `Other deduction -${phpMoney(otherDeductions)}`
  ];
  const statutoryNote = row.statutoryAppliesThisCutoff
    ? 'Government deductions are charged once monthly on the 1-15 cutoff and can be edited per employee.'
    : 'Government deductions are not charged on this cutoff. They apply only to the 1-15 cutoff paid on the 20th.';
  return `<span class="payroll-money payroll-adjustment-stack" title="${escapeHtml(statutoryNote)}">${phpMoney(totalDeductionLine)}<small>${escapeHtml(details.join(' · '))}</small></span>`;
}

function generalAdjustmentStack(row) {
  const adjustment = Number(row.adjustment || 0);
  const deductions = Number(row.deductions || 0);
  const holiday = Number(row.holidayPayPhp || 0);
  const otherEarnings = Number(row.otherEarnings || 0);
  const commission = Number(row.commission || 0);
  const statutory = Number(row.statutoryDeductionsPhp || 0);
  const bankFees = Number(row.bankFees || 0);
  const otherDeductions = Number(row.otherDeductions || 0);
  const total = holiday + adjustment + otherEarnings + deductions + commission - statutory - bankFees - otherDeductions;
  const parts = [
    `Holiday ${phpMoney(holiday)}`,
    `Adjustment ${phpMoney(adjustment)}`,
    `Other earnings ${phpMoney(otherEarnings)}`,
    `Deductions ${phpMoney(deductions)}`,
    `Commission ${phpMoney(commission)}`,
    statutory ? `Gov -${phpMoney(statutory)}` : '',
    `Bank fees -${phpMoney(bankFees)}`,
    `Other deduction -${phpMoney(otherDeductions)}`
  ];
  const hourAdjustment = Number(row.deductedHours || 0);
  const payAdjustment = Number(row.quickDeductionPhp || 0);
  if (Math.abs(hourAdjustment) > 0.004) parts.push(signedHourShort(hourAdjustment));
  if (Math.abs(payAdjustment) > 0.004) parts.push(signedPhpMoney(payAdjustment));
  return `<span class="payroll-money payroll-adjustment-stack" title="${escapeHtml(row.note || parts.filter(Boolean).join(' · '))}">${phpMoney(total)}<small>${escapeHtml(parts.filter(Boolean).join(' · '))}${row.note ? ` · ${escapeHtml(row.note)}` : ''}</small></span>`;
}

function renderPayroll() {
  if (!$('#payrollRows')) return;
  const { start, end } = payrollRange();
  const fx = payrollUsdPhpRate();
  $('#payrollStart').value = isoDate(start);
  $('#payrollEnd').value = isoDate(end);
  $('#payrollFxRate').value = fx.toFixed(4);
  const cutoffRate = Number(payrollFxOverrides[payrollFxOverrideKey(start, end)]);
  const manual = cutoffRate > 0 || manualPayrollFxOverride > 0;
  $('#payrollFxSource').innerHTML = cutoffRate > 0
    ? `${settingsTableMissing ? 'Manual rate saved on this browser' : 'Manual rate saved for this cutoff'} · <a href="https://www.google.com/finance/quote/USD-PHP" target="_blank" rel="noopener">compare with Google</a>`
    : manualPayrollFxOverride > 0
      ? 'Legacy manual payroll rate · save this cutoff to lock its own rate · <a href="https://www.google.com/finance/quote/USD-PHP" target="_blank" rel="noopener">compare with Google</a>'
    : `Daily market rate ${escapeHtml(liveUsdPhpDate || fxRateDate)} · <a href="https://www.exchangerate-api.com" target="_blank" rel="noopener">Rates by Exchange Rate API</a>`;
  $$('#payrollTabs [data-payroll-role]').forEach(button => button.classList.toggle('active', button.dataset.payrollRole === selectedPayrollRole));
  const headers = {
    coaches: ['EMPLOYEE', 'EXPECTED HRS', 'ACTUAL HRS', 'OT HRS', 'USD RATE', 'PHP RATE', 'GROSS USD', 'GROSS PHP', 'ADJ / DED / COMM', 'NET PAY', 'ACTION'],
    admin: ['EMPLOYEE', 'EXPECTED HRS', 'ACTUAL HRS', 'OT HRS', 'CUTOFF PAY', 'OT PAY', 'ADJ / DED + GOV', 'COMMISSION', 'NET PAY', 'ACTION'],
    webinar: ['EMPLOYEE', 'GROSS PAY', 'ADJ / DED', 'COMMISSION', 'NET PAY', 'ACTION'],
    smm: ['EMPLOYEE', 'GROSS PAY', 'ADJ / DED', 'COMMISSION', 'NET PAY', 'ACTION'],
    other: ['EMPLOYEE', 'GROSS PAY', 'ADJ / DED', 'COMMISSION', 'NET PAY', 'ACTION']
  };
  $('#payrollHead').className = `payroll-head ${selectedPayrollRole}`;
  $('#payrollHead').innerHTML = headers[selectedPayrollRole].map(header => `<span>${header}</span>`).join('');
  currentPayrollRows = buildPayrollRows();
  $('#payrollRows').innerHTML = currentPayrollRows.map(row => {
    const recipient = paystubRecipients.find(item => item.employee_id === row.person.id);
    const person = `<div class="person"><span class="person-avatar" style="background:${row.person.color}">${row.person.initials}</span><span>${escapeHtml(row.person.name)}<small>${escapeHtml(row.person.role)}</small><small>${recipient ? `Paystub: ${escapeHtml(recipient.recipient_email)}` : 'No paystub recipient'}</small></span></div>`;
    const approvalLabel = row.paystubApproved ? 'Approved' : 'Approve';
    const edit = `<span class="payroll-actions"><button class="approve-paystub-btn ${row.paystubApproved ? 'approved' : ''}" data-approve-paystub="${row.person.id}" ${recipient ? '' : 'disabled title="No paystub recipient"'}>${approvalLabel}</button><button class="quick-hours-btn" data-quick-hours="${row.person.id}">Hours</button><button class="edit-adjustment-btn" data-payroll-edit="${row.person.id}">Edit</button><button class="edit-adjustment-btn" data-payroll-recipient="${row.person.id}">Recipient</button><button class="paystub-btn" data-paystub="${row.person.id}">Paystub</button><button class="manual-email-btn" data-email-paystub="${row.person.id}" ${recipient ? '' : 'disabled title="Add a paystub recipient first"'}>Email</button></span>`;
    if (selectedPayrollRole === 'coaches') return `<div class="payroll-row coaches">${person}<span>${row.expectedHours.toFixed(2)}</span>${payrollHourChip(row)}<span>${row.otHours.toFixed(2)}</span><span>$${row.hourlyUsd.toFixed(2)}</span><span>₱${fx.toFixed(4)}</span><span class="payroll-money">$${row.grossUsd.toFixed(2)}</span><span class="payroll-money">${phpMoney(row.grossPhp)}</span>${coachAdjustmentStack(row)}<b class="payroll-money">${phpMoney(row.netPay)}</b>${edit}</div>`;
    if (selectedPayrollRole === 'admin') return `<div class="payroll-row admin">${person}<span>${row.expectedHours.toFixed(2)}</span>${payrollHourChip(row)}<span>${row.otHours.toFixed(2)}</span><span class="payroll-money">${phpMoney(row.cutoffPay)}</span><span class="payroll-money">${phpMoney(row.otPay)}</span>${adminDeductionsStack(row)}<span class="payroll-money">${phpMoney(row.commission)}</span><b class="payroll-money">${phpMoney(row.netPay)}</b>${edit}</div>`;
    return `<div class="payroll-row ${selectedPayrollRole}">${person}<span class="payroll-money">${phpMoney(row.grossPhp)}</span>${generalAdjustmentStack(row)}<span class="payroll-money">${phpMoney(row.commission)}</span><b class="payroll-money">${phpMoney(row.netPay)}</b>${edit}</div>`;
  }).join('') || '<div class="empty-state">No employees are assigned to this role group.</div>';
  $('#payrollEmployeeCount').textContent = currentPayrollRows.length;
  $('#payrollActualHours').textContent = formatDuration(currentPayrollRows.reduce((sum, row) => sum + row.actualHours * 3600, 0));
  $('#payrollOtHours').textContent = formatDuration(currentPayrollRows.reduce((sum, row) => sum + row.otHours * 3600, 0));
  $('#payrollPendingOtHours').textContent = formatDuration(currentPayrollRows.reduce((sum, row) => sum + row.pendingOtHours * 3600, 0));
  $('#payrollRejectedOtHours').textContent = formatDuration(currentPayrollRows.reduce((sum, row) => sum + row.rejectedOtHours * 3600, 0));
  $('#payrollNetPay').textContent = phpMoney(currentPayrollRows.reduce((sum, row) => sum + row.netPay, 0));
  $('#payrollRangeLabel').textContent = `${businessDateLabel(start)} to ${businessDateLabel(end)} · ${selectedPayrollRole.toUpperCase()}`;
  $('#payrollFooterHint').textContent = 'Click Actual Hrs or Hours to adjust time quickly. Admin SSS, PhilHealth, and Pag-IBIG amounts are editable and charged only on the 1-15 cutoff paid on the 20th.';
  const approvedCount = currentPayrollRows.filter(row => row.paystubApproved).length;
  const recipientCount = currentPayrollRows.filter(row => paystubRecipients.some(item => item.employee_id === row.person.id)).length;
  const ready = currentPayrollRows.length > 0 && approvedCount === currentPayrollRows.length && recipientCount === currentPayrollRows.length;
  $('#bulkPaystubTitle').textContent = ready ? `Bulk ${selectedPayrollRole} paystubs are ready` : `Approve every ${selectedPayrollRole} paystub before bulk sending`;
  $('#bulkPaystubStatus').textContent = `${approvedCount} of ${currentPayrollRows.length} approved · ${recipientCount} recipients matched · sends one paystub to each employee recipient from hr@sync2va.com`;
  $('#sendPaystubs').disabled = !ready;
  $('#sendPaystubs').textContent = ready ? `Send all ${selectedPayrollRole} paystubs` : 'Approve all first';
  if ($('#sendEmployeeSamplePaystubs')) {
    $('#sendEmployeeSamplePaystubs').disabled = !currentPayrollRows.length || !usesSupabase();
    $('#sendEmployeeSamplePaystubs').textContent = currentPayrollRows.length
      ? `Send sample email${currentPayrollRows.length === 1 ? '' : 's'} first`
      : 'Send sample emails first';
  }
  renderSampleBulkEmailPreview();
  renderQuickBooksPanel();
  if (document.body.dataset.page === 'adjustments') renderAdjustmentCenter();
}

function adjustmentsRange() {
  const now = new Date();
  const period = $('#adjustmentsPeriod')?.value || 'current';
  let startKey;
  let endKey;
  let payDateKey = null;
  if (period === 'previous') {
    ({ startKey, endKey, payDateKey } = currentCutoffKeys(now, true));
  } else if (period === 'custom') {
    startKey = $('#adjustmentsStart')?.value || isoDate(now);
    endKey = $('#adjustmentsEnd')?.value || isoDate(now);
  } else {
    ({ startKey, endKey, payDateKey } = currentCutoffKeys(now, false));
  }
  return { start: businessStartFromKey(startKey), end: businessEndFromKey(endKey), startKey, endKey, period, payDateKey };
}

function syncAdjustmentsDatesFromPeriod() {
  if (!$('#adjustmentsPeriod') || $('#adjustmentsPeriod').value === 'custom') return;
  const { start, end } = adjustmentsRange();
  $('#adjustmentsStart').value = isoDate(start);
  $('#adjustmentsEnd').value = isoDate(end);
}

function adjustmentPageRows() {
  const range = adjustmentsRange();
  return PAYROLL_ROLES.flatMap(role => buildPayrollRows(role, range).map(row => ({ ...row, payrollRole: role })));
}

function adjustmentInput(value, field, step = '0.01') {
  return `<input class="adjustment-money-input" data-adjust-field="${field}" type="number" min="0" step="${step}" value="${Number(value || 0).toFixed(2)}">`;
}

function renderAdjustmentCenter() {
  if (!$('#adjustmentCenterRows')) return;
  syncAdjustmentsDatesFromPeriod();
  const { start, end, period } = adjustmentsRange();
  const term = ($('#adjustmentSearch')?.value || '').toLowerCase();
  const rows = adjustmentPageRows().filter(row => {
    const haystack = `${row.person.name} ${row.person.email} ${row.person.role} ${row.person.department}`.toLowerCase();
    return !term || haystack.includes(term);
  });
  currentAdjustmentRows = rows;
  $('#adjustmentCenterRows').innerHTML = rows.map((row, index) => {
    const deductionValue = Math.abs(Number(row.deductions || 0));
    const statutoryLabel = row.payrollRole === 'admin' && !row.statutoryAppliesThisCutoff
      ? ' title="Government deductions are saved here but are only charged on the 1-15 cutoff paid on the 20th."'
      : '';
    return `<div class="adjustment-center-row" data-adjust-index="${index}">
      <div class="person"><span class="person-avatar" style="background:${row.person.color}">${row.person.initials}</span><span>${escapeHtml(row.person.name)}<small>${escapeHtml(row.person.role)} · ${escapeHtml(PAYROLL_ROLE_LABELS[row.payrollRole] || row.payrollRole)}</small></span></div>
      <span class="payroll-money">${row.actualHours.toFixed(2)}h</span>
      <span class="payroll-money">${phpMoney(row.grossPhp)}</span>
      <label>Holiday pay${adjustmentInput(row.holidayPayPhp, 'holidayPay')}</label>
      <label>Commission${adjustmentInput(row.commission, 'commission')}</label>
      <label>Other earnings${adjustmentInput(row.otherEarnings, 'otherEarnings')}</label>
      <label>Deductions${adjustmentInput(deductionValue, 'deductions')}</label>
      <label${statutoryLabel}>Pag-IBIG${adjustmentInput(row.statutoryPagibigPhp, 'pagibig')}</label>
      <label${statutoryLabel}>PhilHealth${adjustmentInput(row.statutoryPhilHealthPhp, 'philHealth')}</label>
      <label${statutoryLabel}>SSS${adjustmentInput(row.statutorySssPhp, 'sss')}</label>
      <label>Bank fees${adjustmentInput(row.bankFees, 'bankFees')}</label>
      <label>Other deduction${adjustmentInput(row.otherDeductions, 'otherDeductions')}</label>
      <b class="payroll-money">${phpMoney(row.netPay)}</b>
      <label class="adjustment-note-field">Notes<input data-adjust-field="note" value="${escapeHtml(row.note || '')}" maxlength="250" placeholder="Payroll note"></label>
      <button class="start-btn" type="button" data-save-adjustment-row="${index}">Save</button>
    </div>`;
  }).join('') || '<div class="empty-state">No employees found for this selected period.</div>';
  $('#adjustmentCenterActualHours').textContent = formatDuration(rows.reduce((sum, row) => sum + row.actualHours * 3600, 0));
  $('#adjustmentCenterGross').textContent = phpMoney(rows.reduce((sum, row) => sum + row.grossPhp, 0));
  $('#adjustmentCenterHoliday').textContent = phpMoney(rows.reduce((sum, row) => sum + row.holidayPayPhp, 0));
  $('#adjustmentCenterNet').textContent = phpMoney(rows.reduce((sum, row) => sum + row.netPay, 0));
  $('#adjustmentCenterRange').textContent = `${businessDateLabel(start)} to ${businessDateLabel(end)} · ${period === 'custom' ? 'Custom date' : period === 'previous' ? 'Previous cutoff' : 'Current cutoff'}`;
}

function adjustmentCenterValue(container, field, fallback = 0) {
  const input = container.querySelector(`[data-adjust-field="${field}"]`);
  if (!input) return fallback;
  if (field === 'note') return input.value.trim();
  const number = Number(input.value);
  return Number.isFinite(number) ? number : fallback;
}

async function saveAdjustmentCenterRow(index) {
  const row = currentAdjustmentRows[Number(index)];
  const container = document.querySelector(`[data-adjust-index="${index}"]`);
  if (!row || !container) return showToast('Adjustment row not found.');
  const { start, end } = adjustmentsRange();
  const existing = row.record || {};
  const assignmentKey = row.assignmentKey || 'primary';
  const record = {
    employee_id: row.employeeId || row.person.id,
    period_start: isoDate(start),
    period_end: isoDate(end),
    assignment_key: assignmentKey,
    deducted_hours: Number(existing.deducted_hours ?? existing.deductedHours ?? 0),
    payable_hours_override: existing.payable_hours_override ?? existing.payableHoursOverride ?? null,
    deducted_amount: Number(existing.deducted_amount ?? existing.deductedAmount ?? 0),
    commission: Number(existing.commission ?? 0),
    adjustment_php: Number(existing.adjustment_php ?? existing.adjustmentPhp ?? row.adjustment ?? 0),
    deductions_php: -nonNegativeMoneyValue(adjustmentCenterValue(container, 'deductions', Math.abs(row.deductions))),
    commission_php: nonNegativeMoneyValue(adjustmentCenterValue(container, 'commission', row.commission)),
    holiday_pay_override: nonNegativeMoneyValue(adjustmentCenterValue(container, 'holidayPay', row.holidayPayPhp)),
    other_earnings_php: nonNegativeMoneyValue(adjustmentCenterValue(container, 'otherEarnings', row.otherEarnings)),
    statutory_sss_php: nonNegativeMoneyValue(adjustmentCenterValue(container, 'sss', row.statutorySssPhp)),
    statutory_philhealth_php: nonNegativeMoneyValue(adjustmentCenterValue(container, 'philHealth', row.statutoryPhilHealthPhp)),
    statutory_pagibig_php: nonNegativeMoneyValue(adjustmentCenterValue(container, 'pagibig', row.statutoryPagibigPhp)),
    bank_fees_php: nonNegativeMoneyValue(adjustmentCenterValue(container, 'bankFees', row.bankFees)),
    other_deductions_php: nonNegativeMoneyValue(adjustmentCenterValue(container, 'otherDeductions', row.otherDeductions)),
    cutoff_pay_override: existing.cutoff_pay_override ?? existing.cutoffPayOverride ?? null,
    gross_pay_override: existing.gross_pay_override ?? existing.grossPayOverride ?? null,
    paystub_approved: false,
    approved_at: null,
    approved_by: null,
    paystub_emailed_at: null,
    note: adjustmentCenterValue(container, 'note', row.note || ''),
    updated_at: new Date().toISOString()
  };
  const button = container.querySelector('[data-save-adjustment-row]');
  const originalText = button?.textContent || 'Save';
  if (button) {
    button.disabled = true;
    button.textContent = 'Saving...';
  }
  if (usesSupabase()) {
    const { data, error } = await supabaseClient.from('payroll_adjustments').upsert(record, { onConflict: payrollAdjustmentConflictTarget() }).select().single();
    if (error) {
      const needsNewSql = /holiday_pay_override|other_earnings_php|bank_fees_php|other_deductions_php|column/i.test(error.message || '');
      showToast(`Could not save payroll additions/deductions: ${error.message}.${needsNewSql ? ' Run outputs/sync2time-additional-pay-deductions-sql.sql in Supabase first.' : ''}`);
      if (button) {
        button.disabled = false;
        button.textContent = originalText;
      }
      return;
    }
    payrollAdjustments = payrollAdjustments.filter(item => item.id !== data.id && !payrollAdjustmentMatches(item, data.employee_id, data.period_start, data.period_end, data.assignment_key || 'primary'));
    payrollAdjustments.push(data);
  } else {
    payrollAdjustments = payrollAdjustments.filter(item => !payrollAdjustmentMatches(item, record.employee_id, record.period_start, record.period_end, record.assignment_key));
    payrollAdjustments.push({
      ...record,
      id: crypto.randomUUID(),
      employeeId: record.employee_id,
      periodStart: record.period_start,
      periodEnd: record.period_end,
      assignmentKey: record.assignment_key,
      holidayPayOverride: record.holiday_pay_override,
      otherEarningsPhp: record.other_earnings_php,
      bankFeesPhp: record.bank_fees_php,
      otherDeductionsPhp: record.other_deductions_php
    });
    persistPayrollAdjustments();
  }
  renderAdjustmentCenter();
  renderPayroll();
  renderReports();
  renderEmployeePayrollAdjustments();
  renderQuickBooksPanel();
  showToast(`${row.person.name}'s additions/deductions were saved for this selected period.`);
}

function exportAdjustmentCenter() {
  const { start, end } = adjustmentsRange();
  const header = ['Employee', 'Role', 'Payroll Group', 'Actual Hours', 'Gross Pay PHP', 'Calculated Holiday Pay PHP', 'Holiday Pay Used PHP', 'Commission PHP', 'Other Earnings PHP', 'Deductions PHP', 'Pag-IBIG PHP', 'PhilHealth PHP', 'SSS PHP', 'Bank Fees PHP', 'Other Deduction PHP', 'Net Pay PHP', 'Notes'];
  const rows = currentAdjustmentRows.map(row => [
    row.person.name,
    row.person.role,
    PAYROLL_ROLE_LABELS[row.payrollRole] || row.payrollRole,
    row.actualHours.toFixed(2),
    row.grossPhp.toFixed(2),
    row.calculatedHolidayPayPhp.toFixed(2),
    row.holidayPayPhp.toFixed(2),
    row.commission.toFixed(2),
    row.otherEarnings.toFixed(2),
    row.deductions.toFixed(2),
    row.statutoryPagibigPhp.toFixed(2),
    row.statutoryPhilHealthPhp.toFixed(2),
    row.statutorySssPhp.toFixed(2),
    row.bankFees.toFixed(2),
    row.otherDeductions.toFixed(2),
    row.netPay.toFixed(2),
    row.note || ''
  ]);
  const csv = [header, ...rows].map(row => row.map(csvCell).join(',')).join('\r\n');
  exportCsv(`sync2time-additions-deductions-${isoDate(start)}-to-${isoDate(end)}.csv`, csv, 'Additions and deductions exported.');
}

let horizontalScrollControlCounter = 0;
let horizontalScrollQueued = false;

function visibleElement(element) {
  return Boolean(element && (element.offsetWidth || element.offsetHeight || element.getClientRects().length));
}

function labelForWideScroller(scroller) {
  const section = scroller.closest('section');
  const heading = section?.querySelector('.section-title h2, h2, h3')?.textContent?.trim();
  if (heading) return heading;
  if (scroller.classList.contains('adjustment-center-scroll')) return 'Add/Deduct table';
  if (scroller.classList.contains('payroll-table-scroll')) return 'Payroll table';
  if (scroller.classList.contains('team-list-card')) return 'Team table';
  if (scroller.classList.contains('audit-card')) return 'Audit log';
  return 'This table';
}

function needsHorizontalControls(scroller) {
  if (!visibleElement(scroller)) return false;
  const ownOverflow = scroller.scrollWidth > scroller.clientWidth + 8;
  const widestChild = [...scroller.children].reduce((width, child) => Math.max(width, child.scrollWidth || child.clientWidth || 0), 0);
  return ownOverflow || widestChild > scroller.clientWidth + 8;
}

function updateHorizontalControlState(scroller, controls) {
  if (!controls) return;
  const maxScroll = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
  controls.querySelector('[data-scroll-left]').disabled = scroller.scrollLeft <= 2;
  controls.querySelector('[data-scroll-right]').disabled = scroller.scrollLeft >= maxScroll - 2;
}

function ensureHorizontalScrollControls() {
  horizontalScrollQueued = false;
  const seen = new Set();
  WIDE_TABLE_SCROLL_SELECTORS.forEach(selector => {
    $$(selector).forEach(scroller => {
      if (!scroller || seen.has(scroller)) return;
      seen.add(scroller);
      const existingPayrollControls = scroller.previousElementSibling?.classList?.contains('payroll-scroll-controls') ? scroller.previousElementSibling : null;
      const needed = needsHorizontalControls(scroller);
      scroller.classList.toggle('wide-scrollable', needed);
      if (existingPayrollControls) {
        existingPayrollControls.hidden = !needed;
        return;
      }
      if (!scroller.dataset.scrollControlId) scroller.dataset.scrollControlId = `wide-scroll-${++horizontalScrollControlCounter}`;
      let controls = scroller.previousElementSibling?.dataset?.scrollControlsFor === scroller.dataset.scrollControlId
        ? scroller.previousElementSibling
        : null;
      if (!controls) {
        controls = document.createElement('div');
        controls.className = 'table-scroll-controls';
        controls.dataset.scrollControlsFor = scroller.dataset.scrollControlId;
        controls.innerHTML = `<button class="secondary" type="button" data-scroll-left>← Left</button><span>${escapeHtml(labelForWideScroller(scroller))} has more columns. Use these buttons anytime.</span><button class="secondary" type="button" data-scroll-right>Right →</button>`;
        controls.querySelector('[data-scroll-left]').onclick = () => scroller.scrollBy({ left: -Math.max(420, scroller.clientWidth * 0.65), behavior: 'smooth' });
        controls.querySelector('[data-scroll-right]').onclick = () => scroller.scrollBy({ left: Math.max(420, scroller.clientWidth * 0.65), behavior: 'smooth' });
        scroller.parentElement?.insertBefore(controls, scroller);
        scroller.addEventListener('scroll', () => updateHorizontalControlState(scroller, controls), { passive: true });
      }
      controls.hidden = !needed;
      updateHorizontalControlState(scroller, controls);
    });
  });
}

function queueHorizontalScrollControls() {
  if (horizontalScrollQueued) return;
  horizontalScrollQueued = true;
  requestAnimationFrame(ensureHorizontalScrollControls);
}

function sampleBulkEmailRows() {
  return currentPayrollRows;
}

function paystubRecipientForRow(row) {
  return paystubRecipients.find(item => item.employee_id === row.person.id)?.recipient_email || '';
}

function renderSampleBulkEmailPreview() {
  const preview = $('#sampleBulkEmailPreview');
  if (!preview) return;
  const rows = sampleBulkEmailRows();
  if ($('#sampleBulkEmailRecipient') && !$('#sampleBulkEmailRecipient').value) $('#sampleBulkEmailRecipient').value = 'hr@sync2va.com';
  const button = $('#sendSampleBulkEmail');
  if (!rows.length) {
    preview.textContent = 'No employee rows are available in this payroll tab yet.';
    if (button) button.disabled = true;
    return;
  }
  const { start, end } = payrollRange();
  preview.textContent = `Bulk test will send ${rows.length} ${selectedPayrollRole} sample paystub${rows.length === 1 ? '' : 's'} for ${businessDateLabel(start)} to ${businessDateLabel(end)} to the test email below. It does not email employees and does not mark paystubs emailed.`;
  if (button) button.disabled = !usesSupabase();
  if (button) button.textContent = `Send ${rows.length} sample email${rows.length === 1 ? '' : 's'}`;
}

async function sendSampleBulkEmail() {
  const button = $('#sendSampleBulkEmail');
  const input = $('#sampleBulkEmailRecipient');
  const recipient = (input?.value || '').trim().toLowerCase();
  if (!recipient || !recipient.includes('@')) return showToast('Add a valid email address for the sample.');
  if (!usesSupabase()) return showToast('Supabase must be connected before sending a sample email.');
  const rows = sampleBulkEmailRows();
  if (!rows.length) return showToast('No payroll rows are available for sample bulk email.');
  const originalText = button?.textContent || 'Send sample email';
  if (button) {
    button.disabled = true;
    button.textContent = 'Preparing samples...';
  }
  const failures = [];
  try {
    const { start, end } = payrollRange();
    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];
      if (button) button.textContent = `Sending sample ${index + 1}/${rows.length}...`;
      try {
        const pdf = await buildEmployeePaystub(row.person.id, false);
        if (!pdf?.base64) throw new Error('Could not create the sample paystub PDF');
        await invokeEdgeFunction('send-paystubs', {
          testMode: true,
          testRecipient: recipient,
          employeeId: row.person.id,
          assignmentKey: row.assignmentKey || 'primary',
          employeeName: row.person.name,
          periodStart: isoDate(start),
          periodEnd: isoDate(end),
          filename: `TEST-${pdf.filename}`,
          pdfBase64: pdf.base64
        });
      } catch (error) {
        failures.push(`${row.person.name}: ${error.message || 'sample send failed'}`);
      }
    }
    if (failures.length) {
      console.error('Sample bulk email failures:', failures);
      showToast(`${rows.length - failures.length} sample sent; ${failures.length} failed. First error: ${failures[0]}`);
    } else {
      showToast(`All ${rows.length} sample paystubs were sent to ${recipient}.`);
    }
  } catch (error) {
    showToast(`Sample email failed: ${error.message || 'unknown error'}`);
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = originalText;
    }
  }
}

async function sendEmployeeSamplePaystubs() {
  if (!usesSupabase()) return showToast('Supabase must be connected before sending employee sample emails.');
  const rows = currentPayrollRows;
  if (!rows.length) return showToast('No payroll rows are available for this tab.');
  const missing = rows.filter(row => !paystubRecipientForRow(row));
  if (missing.length) return showToast(`Add paystub email first for: ${missing.slice(0, 3).map(row => row.person.name).join(', ')}${missing.length > 3 ? '...' : ''}`);
  if (!confirm(`Send TEST paystub emails to ${rows.length} ${selectedPayrollRole} employee recipient${rows.length === 1 ? '' : 's'} now? This will not mark paystubs emailed.`)) return;
  const button = $('#sendEmployeeSamplePaystubs');
  const originalText = button?.textContent || 'Send sample emails first';
  if (button) {
    button.disabled = true;
    button.textContent = 'Preparing samples...';
  }
  const failures = [];
  const { start, end } = payrollRange();
  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];
    if (button) button.textContent = `Sending sample ${index + 1}/${rows.length}...`;
    try {
      const pdf = await buildEmployeePaystub(row.person.id, false);
      if (!pdf?.base64) throw new Error('Could not create the sample paystub PDF');
      await invokeEdgeFunction('send-paystubs', {
        testMode: true,
        testRecipient: paystubRecipientForRow(row),
        employeeId: row.person.id,
        assignmentKey: row.assignmentKey || 'primary',
        employeeName: row.person.name,
        periodStart: isoDate(start),
        periodEnd: isoDate(end),
        filename: `TEST-${pdf.filename}`,
        pdfBase64: pdf.base64
      });
    } catch (error) {
      failures.push(`${row.person.name}: ${error.message || 'sample send failed'}`);
    }
  }
  if (button) {
    button.disabled = false;
    button.textContent = originalText;
  }
  if (failures.length) {
    console.error('Employee sample email failures:', failures);
    showToast(`${rows.length - failures.length} employee samples sent; ${failures.length} failed. First error: ${failures[0]}`);
  } else {
    showToast(`All ${rows.length} employee sample paystubs were sent.`);
  }
}

function loadPaystubLogo() {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = 'sync2va-logo.png';
  });
}

function compactPaystubLogoSource(image) {
  try {
    const canvas = document.createElement('canvas');
    const size = 240;
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, size, size);
    const ratio = Math.min(size / image.naturalWidth, size / image.naturalHeight);
    const width = image.naturalWidth * ratio;
    const height = image.naturalHeight * ratio;
    context.drawImage(image, (size - width) / 2, (size - height) / 2, width, height);
    return canvas.toDataURL('image/png');
  } catch {
    return image;
  }
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
    doc.addImage(compactPaystubLogoSource(logo), 'PNG', 32, 18, 90, 90, undefined, 'FAST');
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
    lines.push(['Payable hours', row.payableHours.toFixed(2)]);
    lines.push(['Hour adjustment', signedHourShort(row.deductedHours)]);
    lines.push(['Approved OT hours', row.otHours.toFixed(2)]);
    lines.push(['Pending OT hours', row.pendingOtHours.toFixed(2)]);
    lines.push(['Rejected excess hours', row.rejectedOtHours.toFixed(2)]);
    lines.push(['USD hourly rate', `USD ${row.hourlyUsd.toFixed(2)}`]);
    lines.push(['USD to PHP rate', payrollUsdPhpRate().toFixed(4)]);
    lines.push(['Gross USD pay', `USD ${row.grossUsd.toFixed(2)}`]);
    lines.push(['Gross PHP pay', `PHP ${row.grossPhp.toFixed(2)}`]);
    lines.push(['Holiday pay', `PHP ${Number(row.holidayPayPhp || 0).toFixed(2)}`]);
    lines.push(['Hour adjustment value', signedPhpPlain(row.quickDeductionPhp)]);
    lines.push(['Adjustments', `PHP ${row.adjustment.toFixed(2)}`]);
    lines.push(['Other earnings', `PHP ${Number(row.otherEarnings || 0).toFixed(2)}`]);
    lines.push(['Deductions', `PHP ${row.deductions.toFixed(2)}`]);
    lines.push(['Commission', `PHP ${row.commission.toFixed(2)}`]);
    lines.push(['Pag-IBIG', `PHP ${Number(row.statutoryPagibigPhp || 0).toFixed(2)}`]);
    lines.push(['PhilHealth', `PHP ${Number(row.statutoryPhilHealthPhp || 0).toFixed(2)}`]);
    lines.push(['SSS', `PHP ${Number(row.statutorySssPhp || 0).toFixed(2)}`]);
    lines.push(['Bank fees', `PHP ${Number(row.bankFees || 0).toFixed(2)}`]);
    lines.push(['Other deduction', `PHP ${Number(row.otherDeductions || 0).toFixed(2)}`]);
  } else if (selectedPayrollRole === 'admin') {
    lines.push(['Expected hours', row.expectedHours.toFixed(2)]);
    lines.push(['Actual hours', row.actualHours.toFixed(2)]);
    lines.push(['Payable hours', row.payableHours.toFixed(2)]);
    lines.push(['Hour adjustment', signedHourShort(row.deductedHours)]);
    lines.push(['Approved OT hours', row.otHours.toFixed(2)]);
    lines.push(['Pending OT hours', row.pendingOtHours.toFixed(2)]);
    lines.push(['Rejected excess hours', row.rejectedOtHours.toFixed(2)]);
    lines.push(['Cutoff pay', `PHP ${row.cutoffPay.toFixed(2)}`]);
    lines.push(['OT pay', `PHP ${row.otPay.toFixed(2)}`]);
    lines.push(['Gross pay', `PHP ${row.grossPhp.toFixed(2)}`]);
    lines.push(['Holiday pay', `PHP ${Number(row.holidayPayPhp || 0).toFixed(2)}`]);
    lines.push(['Hour adjustment value', signedPhpPlain(row.quickDeductionPhp)]);
    lines.push(['Adjustments', `PHP ${row.adjustment.toFixed(2)}`]);
    lines.push(['Other earnings', `PHP ${Number(row.otherEarnings || 0).toFixed(2)}`]);
    lines.push(['Manual deductions', `PHP ${row.deductions.toFixed(2)}`]);
    lines.push(['Government deductions', row.statutoryAppliesThisCutoff ? 'Charged this cutoff' : 'Not charged this cutoff']);
    lines.push(['SSS employee share', `PHP ${Number(row.statutorySssPhp || 0).toFixed(2)}`]);
    lines.push(['PhilHealth employee share', `PHP ${Number(row.statutoryPhilHealthPhp || 0).toFixed(2)}`]);
    lines.push(['Pag-IBIG employee share', `PHP ${Number(row.statutoryPagibigPhp || 0).toFixed(2)}`]);
    lines.push(['Bank fees', `PHP ${Number(row.bankFees || 0).toFixed(2)}`]);
    lines.push(['Other deduction', `PHP ${Number(row.otherDeductions || 0).toFixed(2)}`]);
    lines.push(['Commission', `PHP ${row.commission.toFixed(2)}`]);
  } else {
    lines.push(['Gross pay', `PHP ${row.grossPhp.toFixed(2)}`]);
    lines.push(['Actual hours', row.actualHours.toFixed(2)]);
    lines.push(['Payable hours', row.payableHours.toFixed(2)]);
    lines.push(['Hour adjustment', signedHourShort(row.deductedHours)]);
    lines.push(['Approved OT hours', row.otHours.toFixed(2)]);
    lines.push(['Pending OT hours', row.pendingOtHours.toFixed(2)]);
    lines.push(['Rejected excess hours', row.rejectedOtHours.toFixed(2)]);
    lines.push(['Holiday pay', `PHP ${Number(row.holidayPayPhp || 0).toFixed(2)}`]);
    lines.push(['Hour adjustment value', signedPhpPlain(row.quickDeductionPhp)]);
    lines.push(['Adjustments', `PHP ${row.adjustment.toFixed(2)}`]);
    lines.push(['Other earnings', `PHP ${Number(row.otherEarnings || 0).toFixed(2)}`]);
    lines.push(['Deductions', `PHP ${row.deductions.toFixed(2)}`]);
    lines.push(['Pag-IBIG', `PHP ${Number(row.statutoryPagibigPhp || 0).toFixed(2)}`]);
    lines.push(['PhilHealth', `PHP ${Number(row.statutoryPhilHealthPhp || 0).toFixed(2)}`]);
    lines.push(['SSS', `PHP ${Number(row.statutorySssPhp || 0).toFixed(2)}`]);
    lines.push(['Bank fees', `PHP ${Number(row.bankFees || 0).toFixed(2)}`]);
    lines.push(['Other deduction', `PHP ${Number(row.otherDeductions || 0).toFixed(2)}`]);
    lines.push(['Commission', `PHP ${row.commission.toFixed(2)}`]);
  }
  let y = 246;
  const lineStep = lines.length > 18 ? 22 : 30;
  const lineHeight = lineStep - 2;
  doc.setFontSize(10);
  lines.forEach(([label, value], index) => {
    if (index % 2 === 0) {
      doc.setFillColor(246, 249, 252);
      doc.rect(38, y - 14, pageWidth - 76, lineHeight, 'F');
    }
    doc.setTextColor(91, 103, 118);
    doc.setFont('helvetica', 'normal');
    doc.text(label, 50, y + 3);
    doc.setTextColor(24, 35, 49);
    doc.setFont('helvetica', 'bold');
    doc.text(value, pageWidth - 50, y + 3, { align: 'right' });
    y += lineStep;
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
  const assignmentSuffix = row.assignmentKey && row.assignmentKey !== 'primary' ? `-${slug(row.assignmentKey)}` : '';
  const filename = `Sync2Time-Paystub-${slug(row.person.name)}${assignmentSuffix}-${isoDate(start)}-to-${isoDate(end)}.pdf`;
  const base64 = doc.output('datauristring').split(',')[1];
  if (shouldDownload) {
    doc.save(filename);
    showToast(`${row.person.name}'s paystub downloaded.`);
  }
  return { base64, filename, row };
}

function normalizePaystubEmailTemplates(templates) {
  const normalized = (Array.isArray(templates) ? templates : []).map((template, index) => ({
    id: String(template?.id || `paystub-template-${index + 1}`),
    name: String(template?.name || `Template ${index + 1}`).trim(),
    subject: String(template?.subject || '').trim(),
    body: String(template?.body || '')
  })).filter(template => template.name && template.subject && template.body);
  return normalized.length ? normalized : [...DEFAULT_PAYSTUB_EMAIL_TEMPLATES];
}

function persistPaystubEmailTemplates() {
  paystubEmailTemplates = normalizePaystubEmailTemplates(paystubEmailTemplates);
  localStorage.setItem('sync2time-paystub-email-templates', JSON.stringify(paystubEmailTemplates));
  localStorage.setItem('sync2time-paystub-email-template-selected', selectedPaystubEmailTemplateId);
}

function selectedPaystubEmailTemplate() {
  return paystubEmailTemplates.find(template => template.id === selectedPaystubEmailTemplateId) || paystubEmailTemplates[0];
}

function renderPaystubEmailTemplatePicker() {
  const select = $('#paystubEmailTemplate');
  if (!select) return;
  select.innerHTML = paystubEmailTemplates.map(template => `<option value="${escapeHtml(template.id)}">${escapeHtml(template.name)}</option>`).join('');
  if (!paystubEmailTemplates.some(template => template.id === selectedPaystubEmailTemplateId)) selectedPaystubEmailTemplateId = paystubEmailTemplates[0]?.id || '';
  select.value = selectedPaystubEmailTemplateId;
  loadPaystubEmailTemplateEditor();
}

function loadPaystubEmailTemplateEditor() {
  const template = selectedPaystubEmailTemplate();
  if (!template) return;
  $('#paystubEmailTemplateName').value = template.name;
  $('#paystubEmailSubject').value = template.subject;
  $('#paystubEmailBody').value = template.body;
  $('#deletePaystubEmailTemplate').disabled = paystubEmailTemplates.length <= 1;
  $('#paystubEmailError').hidden = true;
}

function openPaystubEmailEditor(employeeId = '') {
  emailingPayrollRow = employeeId ? currentPayrollRows.find(item => item.person.id === employeeId) || null : null;
  const recipient = emailingPayrollRow ? paystubRecipients.find(item => item.employee_id === emailingPayrollRow.person.id) : null;
  $('#paystubEmailEmployee').textContent = emailingPayrollRow ? `Email ${emailingPayrollRow.person.name}'s paystub` : 'Manage paystub email templates';
  $('#paystubEmailRecipient').value = recipient?.recipient_email || '';
  $('#paystubEmailRecipientLabel').hidden = !emailingPayrollRow;
  $('#openPaystubGmail').hidden = !emailingPayrollRow;
  $('#paystubEmailCancel').textContent = emailingPayrollRow ? 'Cancel' : 'Done';
  renderPaystubEmailTemplatePicker();
  $('#paystubEmailBackdrop').hidden = false;
}

function closePaystubEmailEditor() {
  $('#paystubEmailBackdrop').hidden = true;
  emailingPayrollRow = null;
  $('#paystubEmailError').hidden = true;
}

function addPaystubEmailTemplate() {
  const id = `paystub-template-${Date.now()}`;
  paystubEmailTemplates.push({
    id,
    name: 'New paystub template',
    subject: 'Sync2Time Paystub - {{pay_period}}',
    body: 'Hello {{employee_name}},\n\nPlease find attached your paystub for {{pay_period}}.\n\nRegards,\nSync2VA HR'
  });
  selectedPaystubEmailTemplateId = id;
  persistPaystubEmailTemplates();
  renderPaystubEmailTemplatePicker();
  $('#paystubEmailTemplateName').focus();
  $('#paystubEmailTemplateName').select();
}

async function savePaystubEmailTemplate() {
  const name = $('#paystubEmailTemplateName').value.trim();
  const subject = $('#paystubEmailSubject').value.trim();
  const body = $('#paystubEmailBody').value.trim();
  if (!name || !subject || !body) {
    $('#paystubEmailError').textContent = 'Template name, subject, and message are required.';
    $('#paystubEmailError').hidden = false;
    return false;
  }
  const index = paystubEmailTemplates.findIndex(template => template.id === selectedPaystubEmailTemplateId);
  const updated = { id: selectedPaystubEmailTemplateId || `paystub-template-${Date.now()}`, name, subject, body };
  if (index >= 0) paystubEmailTemplates[index] = updated;
  else paystubEmailTemplates.push(updated);
  selectedPaystubEmailTemplateId = updated.id;
  persistPaystubEmailTemplates();
  if (usesSupabase()) {
    try {
      await saveSupabaseSetting('paystub_email_templates', { templates: paystubEmailTemplates });
    } catch (error) {
      renderPaystubEmailTemplatePicker();
      $('#paystubEmailError').textContent = `Template saved in this browser, but Supabase sync failed: ${error.message}. You can still open the Gmail draft.`;
      $('#paystubEmailError').hidden = false;
      return true;
    }
  }
  renderPaystubEmailTemplatePicker();
  showToast('Paystub email template saved.');
  return true;
}

async function deletePaystubEmailTemplate() {
  if (paystubEmailTemplates.length <= 1) return showToast('Keep at least one paystub email template.');
  const template = selectedPaystubEmailTemplate();
  if (!template || !confirm(`Delete the "${template.name}" email template?`)) return;
  paystubEmailTemplates = paystubEmailTemplates.filter(item => item.id !== template.id);
  selectedPaystubEmailTemplateId = paystubEmailTemplates[0].id;
  persistPaystubEmailTemplates();
  if (usesSupabase()) {
    try {
      await saveSupabaseSetting('paystub_email_templates', { templates: paystubEmailTemplates });
    } catch (error) {
      showToast(`Template was deleted locally, but Supabase sync failed: ${error.message}`);
    }
  }
  renderPaystubEmailTemplatePicker();
}

function fillPaystubEmailTemplate(text, row) {
  const { start, end, payDateKey } = payrollRange();
  const replacements = {
    employee_name: row.person.name,
    pay_period: `${businessDateLabel(start)} to ${businessDateLabel(end)}`,
    pay_date: businessDateLabel(businessDateFromKey(payDateKey)),
    net_pay: phpMoney(row.netPay),
    role: row.person.role || 'Employee'
  };
  return String(text || '').replace(/\{\{\s*(employee_name|pay_period|pay_date|net_pay|role)\s*\}\}/gi, (_, key) => replacements[key.toLowerCase()] || '');
}

async function openManualPaystubGmail(event) {
  event.preventDefault();
  if (!emailingPayrollRow) return;
  const row = emailingPayrollRow;
  const recipient = $('#paystubEmailRecipient').value.trim().toLowerCase();
  const button = $('#openPaystubGmail');
  const originalLabel = button.textContent;
  if (!recipient) {
    $('#paystubEmailError').textContent = 'This employee does not have a paystub recipient email.';
    $('#paystubEmailError').hidden = false;
    return;
  }
  if (!row.paystubApproved && !confirm('This paystub is not approved yet. Open the Gmail draft anyway?')) return;
  const gmailWindow = window.open('', '_blank');
  if (!gmailWindow) {
    $('#paystubEmailError').textContent = 'Your browser blocked the Gmail window. Allow pop-ups for this site, then try again.';
    $('#paystubEmailError').hidden = false;
    return;
  }
  button.disabled = true;
  button.textContent = 'Preparing Gmail draft...';
  try {
    gmailWindow.document.write('<p style="font-family:sans-serif;padding:24px">Preparing Gmail draft and downloading the paystub...</p>');
    const saved = await savePaystubEmailTemplate();
    if (!saved) {
      gmailWindow.document.body.innerHTML = '<p style="font-family:sans-serif;padding:24px">Sync2Time could not save the email template. Please return to Sync2Time and check the error message.</p>';
      return;
    }
    const result = await buildEmployeePaystub(row.person.id, true);
    if (!result?.filename) {
      gmailWindow.document.body.innerHTML = '<p style="font-family:sans-serif;padding:24px">Sync2Time could not create the paystub PDF. Please return to Sync2Time and try again.</p>';
      return;
    }
    const template = selectedPaystubEmailTemplate();
    const subject = fillPaystubEmailTemplate(template.subject, row);
    const body = `${fillPaystubEmailTemplate(template.body, row)}\n\nAttachment reminder: ${result.filename}`;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&authuser=${encodeURIComponent(adminAccount.email)}&to=${encodeURIComponent(recipient)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    gmailWindow.location.replace(gmailUrl);
    closePaystubEmailEditor();
    showToast(`Gmail draft opened for ${row.person.name}. Attach the downloaded PDF before sending.`);
  } catch (error) {
    console.error('Manual Gmail paystub error:', error);
    $('#paystubEmailError').textContent = `Could not open the Gmail draft: ${error.message || 'unknown error'}`;
    $('#paystubEmailError').hidden = false;
    if (!gmailWindow.closed) {
      gmailWindow.document.body.innerHTML = '<p style="font-family:sans-serif;padding:24px">Sync2Time hit an error while preparing the Gmail draft. Please return to Sync2Time and check the message.</p>';
    }
  } finally {
    button.disabled = false;
    button.textContent = originalLabel;
  }
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
  const actualHours = Math.max(0, Number(row.seconds || 0) / 3600);
  const savedHours = signedHoursFromAdjustment(adjustment, actualHours);
  $('#payrollAdjustmentEmployee').textContent = row.name;
  $('#payrollAdjustmentPeriod').textContent = `${businessDateLabel(start)} to ${businessDateLabel(end)} · ${formatDuration(row.seconds)} worked`;
  if ($('#deductHoursMode')) $('#deductHoursMode').value = savedHours < 0 ? 'add' : 'deduct';
  $('#deductHours').value = Math.abs(savedHours).toFixed(2);
  $('#deductAmount').value = adjustment?.deducted_amount ?? adjustment?.deductedAmount ?? 0;
  $('#commissionAmount').value = adjustment?.commission ?? 0;
  $('#adjustmentNote').value = adjustment?.note ?? '';
  $('#payrollAdjustmentError').hidden = true;
  $('#payrollAdjustmentBackdrop').hidden = false;
}

async function savePayrollAdjustment(event) {
  event.preventDefault();
  if (!editingPayrollAdjustment) return;
  const hourMagnitude = Math.max(0, Number($('#deductHours').value) || 0);
  const deductedHours = $('#deductHoursMode')?.value === 'add' ? -hourMagnitude : hourMagnitude;
  const deductedAmount = Math.max(0, Number($('#deductAmount').value) || 0);
  const commission = Math.max(0, Number($('#commissionAmount').value) || 0);
  const note = $('#adjustmentNote').value.trim();
  const previousAdjustment = adjustmentFor(editingPayrollAdjustment.employeeId, businessDateFromKey(editingPayrollAdjustment.start), businessDateFromKey(editingPayrollAdjustment.end));
  const actualHours = Math.max(0, Number(editingPayrollAdjustment.row?.seconds || 0) / 3600);
  const previousDeductedHours = signedHoursFromAdjustment(previousAdjustment, actualHours);
  const previousPayableHours = Math.max(0, actualHours - previousDeductedHours);
  const newPayableHours = Math.max(0, actualHours - deductedHours);
  const deductedHoursDelta = deductedHours - previousDeductedHours;
  if ((Math.abs(deductedHours) > 0.004 || deductedAmount || commission) && !note) {
    $('#payrollAdjustmentError').textContent = 'Add a reason or note for the payroll audit trail.';
    $('#payrollAdjustmentError').hidden = false;
    return;
  }
  const record = {
    employee_id: editingPayrollAdjustment.employeeId,
    period_start: editingPayrollAdjustment.start,
    period_end: editingPayrollAdjustment.end,
    assignment_key: 'primary',
    deducted_hours: dbDeductedHours(deductedHours),
    payable_hours_override: newPayableHours,
    deducted_amount: deductedAmount,
    commission,
    note,
    paystub_approved: false,
    approved_at: null,
    approved_by: null,
    updated_at: new Date().toISOString()
  };
  let savedAdjustmentId = previousAdjustment?.id || null;
  if (usesSupabase()) {
    const { data, error } = await supabaseClient.from('payroll_adjustments').upsert(record, { onConflict: payrollAdjustmentConflictTarget() }).select().single();
    if (error) {
      const sqlHint = /assignment_key|unique|conflict/i.test(error.message || '')
        ? ' Run outputs/sync2time-dual-role-payroll-sql.sql in Supabase first.'
        : /payable_hours_override|column/i.test(error.message || '')
          ? ' Run outputs/sync2time-payable-hours-override-sql.sql in Supabase first.'
          : ' Run the payroll adjustments SQL in Supabase first.';
      $('#payrollAdjustmentError').textContent = `Could not save: ${error.message}.${sqlHint}`;
      $('#payrollAdjustmentError').hidden = false;
      return;
    }
    savedAdjustmentId = data.id;
    payrollAdjustments = payrollAdjustments.filter(item => item.id !== data.id && !payrollAdjustmentMatches(item, data.employee_id, data.period_start, data.period_end, data.assignment_key || 'primary'));
    payrollAdjustments.push(data);
  } else {
    payrollAdjustments = payrollAdjustments.filter(item => !payrollAdjustmentMatches(item, record.employee_id, record.period_start, record.period_end, record.assignment_key));
    payrollAdjustments.push({ id: crypto.randomUUID(), employeeId: record.employee_id, periodStart: record.period_start, periodEnd: record.period_end, assignmentKey: record.assignment_key, deductedHours: record.deducted_hours, payableHoursOverride: record.payable_hours_override, deductedAmount, commission, note, updatedAt: record.updated_at });
    persistPayrollAdjustments();
  }
  if (Math.abs(deductedHoursDelta) > 0.004 || note) {
    await savePayrollAdjustmentEvent({
      payrollAdjustmentId: savedAdjustmentId,
      employeeId: editingPayrollAdjustment.employeeId,
      periodStart: editingPayrollAdjustment.start,
      periodEnd: editingPayrollAdjustment.end,
      changeType: 'hours',
      payrollRole: 'report',
      actualHours,
      previousPayableHours,
      newPayableHours,
      deductedHoursDelta,
      totalDeductedHours: deductedHours,
      deductedAmountDelta: deductedAmount,
      commissionPhpDelta: commission,
      note
    });
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
  const statutoryFields = $('#payrollStatutoryFields');
  const showStatutoryFields = selectedPayrollRole === 'admin';
  if (statutoryFields) statutoryFields.hidden = !showStatutoryFields;
  ['payrollRowSss', 'payrollRowPhilHealth', 'payrollRowPagibig'].forEach(id => {
    const input = $(`#${id}`);
    if (input) input.disabled = !showStatutoryFields || !row.statutoryAppliesThisCutoff;
  });
  if ($('#payrollRowSss')) $('#payrollRowSss').value = Number(row.statutorySssPhp || 0).toFixed(2);
  if ($('#payrollRowPhilHealth')) $('#payrollRowPhilHealth').value = Number(row.statutoryPhilHealthPhp || 0).toFixed(2);
  if ($('#payrollRowPagibig')) $('#payrollRowPagibig').value = Number(row.statutoryPagibigPhp || 0).toFixed(2);
  if ($('#payrollStatutoryNote')) {
    $('#payrollStatutoryNote').textContent = row.statutoryAppliesThisCutoff
      ? `Charged once monthly on the 1-15 cutoff paid on the ${MONTHLY_STATUTORY_CUTOFF_DAYS.payDay}th. Edit these amounts if HR needs a different SSS, PhilHealth, or Pag-IBIG value.`
      : `Not charged on this cutoff. SSS, PhilHealth, and Pag-IBIG are charged only on the 1-15 cutoff paid on the ${MONTHLY_STATUTORY_CUTOFF_DAYS.payDay}th.`;
  }
  $('#payrollRowNote').value = row.note || '';
  $('#payrollCutoffPayField').hidden = selectedPayrollRole !== 'admin';
  $('#payrollGrossPayField').hidden = selectedPayrollRole !== 'smm';
  $('#payrollAdjustmentField').hidden = false;
  $('#payrollDeductionField').hidden = false;
  $('#payrollCommissionField').hidden = false;
  $('#payrollRowError').hidden = true;
  $('#payrollRowBackdrop').hidden = false;
}

function closePayrollRowEditor() {
  $('#payrollRowBackdrop').hidden = true;
  editingPayrollRow = null;
}

function closeQuickHoursEditor() {
  $('#quickHoursBackdrop').hidden = true;
  editingQuickHoursRow = null;
  quickHoursDrafts = [];
  if ($('#quickEditDraftRows')) $('#quickEditDraftRows').innerHTML = '';
  if ($('#quickSavedEditRows')) $('#quickSavedEditRows').innerHTML = '';
  $('#quickHoursError').hidden = true;
}

function enhanceQuickHoursEditor() {
  const actualInput = $('#quickActualHours');
  const payableInput = $('#quickPayableHours');
  const deductInput = $('#quickDeductHours');
  if (!actualInput || !payableInput || !deductInput) return;
  const actualLabel = actualInput.closest('label');
  const payableLabel = payableInput.closest('label');
  const deductLabel = deductInput.closest('label');
  if (payableLabel?.firstChild) payableLabel.firstChild.textContent = 'Approved payable hours';
  if (deductLabel?.firstChild) deductLabel.firstChild.textContent = 'Total hour adjustment after save';
  deductInput.removeAttribute('min');
  deductInput.placeholder = '-1.00 adds time, 1.00 deducts';
  if (!$('#quickCurrentPayableHours') && actualLabel) {
    actualLabel.insertAdjacentHTML('afterend', '<label>Current payable hours<input id="quickCurrentPayableHours" type="number" readonly></label>');
  }
  if (!$('#quickHourDirection') && payableLabel) {
    payableLabel.insertAdjacentHTML('beforebegin', '<label>Action<select id="quickHourDirection"><option value="deduct">Deduct hours</option><option value="add">Add hours</option></select></label>');
  }
  if (!$('#quickAddDeductHours') && payableLabel) {
    payableLabel.insertAdjacentHTML('beforebegin', '<label>Hours this edit<input id="quickAddDeductHours" type="number" min="0" step="0.01" placeholder="0.50"></label>');
  }
  const preview = $('#quickDeductionPreview');
  if (preview && !$('#quickAddEdit')) {
    preview.insertAdjacentHTML('afterend', '<div class="quick-edit-tools"><button class="secondary quick-add-edit" id="quickAddEdit" type="button" title="Add this correction as a separate saved edit"><span aria-hidden="true">+</span> Add adjustment</button><small>Add every correction separately, then click Save once.</small></div><div class="quick-edit-list" id="quickEditDraftRows" aria-live="polite"></div><div class="quick-edit-history" id="quickSavedEditRows"></div>');
  }
  if ($('#quickHourDirection') && !$('#quickHourDirection').dataset.bound) {
    $('#quickHourDirection').dataset.bound = 'true';
    $('#quickHourDirection').onchange = () => syncQuickHoursInputs('add');
  }
  if ($('#quickAddEdit') && !$('#quickAddEdit').dataset.bound) {
    $('#quickAddEdit').dataset.bound = 'true';
    $('#quickAddEdit').onclick = addQuickHoursDraft;
  }
  if ($('#quickAddDeductHours') && !$('#quickAddDeductHours').dataset.bound) {
    $('#quickAddDeductHours').dataset.bound = 'true';
    $('#quickAddDeductHours').oninput = () => syncQuickHoursInputs('add');
    $('#quickAddDeductHours').onblur = () => finalizeQuickHoursInputs('add');
  }
}

function quickHoursPreviewText(row, deductHours) {
  const rate = Number(row.hourlyDeductionRatePhp || 0);
  const signedHours = Number(deductHours || 0);
  const pesoAdjustment = signedHours * rate;
  if (Math.abs(signedHours) <= 0.004) return 'No hour adjustment calculated yet.';
  if (!rate) return `${signedHourLabel(signedHours, 'Deduct', 'Add')}. No hourly payroll rate is available, so net pay will not change automatically.`;
  const rateSource = row.monthlyPhp ? 'PHP hourly equivalent from monthly rate' : 'USD hourly rate converted to PHP';
  const moneyDirection = pesoAdjustment > 0 ? 'from' : 'to';
  return `${signedHourLabel(signedHours, 'Deduct', 'Add')} × ${phpMoney(rate)} ${rateSource} = ${signedPhpMoney(pesoAdjustment)} ${moneyDirection} net pay.`;
}

function compactHoursValue(value) {
  const fixed = Number(value || 0).toFixed(2);
  return fixed.replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
}

function quickHoursNumber(value, options = {}) {
  const text = String(value ?? '').trim();
  if (!text || text === '.' || text === '-') return null;
  const number = Number(text);
  if (!Number.isFinite(number)) return null;
  return options.signed ? number : Math.max(0, number);
}

function quickDraftHoursTotal() {
  return quickHoursDrafts.reduce((sum, draft) => sum + Number(draft.hours || 0), 0);
}

function quickBaseDeductedHours(row = editingQuickHoursRow, actualOverride = null) {
  if (!row) return 0;
  const actual = actualOverride === null ? Math.max(0, Number($('#quickActualHours')?.value) || 0) : Math.max(0, Number(actualOverride) || 0);
  return Math.min(actual, Number(row.deductedHours || 0) + quickDraftHoursTotal());
}

function quickSavedHistoryForCurrent() {
  if (!editingQuickHoursRow) return [];
  const { start, end } = payrollRange();
  const startKey = isoDate(start);
  const endKey = isoDate(end);
  return payrollAdjustmentHistoryFor(editingQuickHoursRow.person.id)
    .filter(item => (item.period_start || item.periodStart) === startKey && (item.period_end || item.periodEnd) === endKey);
}

function renderQuickHoursDrafts() {
  const draftRows = $('#quickEditDraftRows');
  const historyRows = $('#quickSavedEditRows');
  if (!draftRows || !historyRows || !editingQuickHoursRow) return;
  draftRows.innerHTML = quickHoursDrafts.length
    ? quickHoursDrafts.map((draft, index) => `<div class="quick-edit-row"><div><b>Edit ${index + 1}: ${signedHourShort(draft.hours)}</b><small>${escapeHtml(draft.note || 'No note provided')}</small></div><button type="button" class="secondary" data-remove-quick-edit="${escapeHtml(draft.id)}">Remove</button></div>`).join('')
    : '<div class="quick-edit-empty">No new time adjustments added yet. Choose add or deduct, enter hours and a note, then click + Add adjustment.</div>';

  const history = quickSavedHistoryForCurrent();
  historyRows.innerHTML = history.length
    ? `<p class="quick-edit-caption">Saved edits for this cutoff</p>${history.map(item => {
      const delta = Number(item.deducted_hours_delta ?? item.deductedHoursDelta ?? 0);
      const previousPayable = Number(item.previous_payable_hours ?? item.previousPayableHours ?? 0);
      const newPayable = Number(item.new_payable_hours ?? item.newPayableHours ?? 0);
      const createdAt = item.created_at || item.createdAt;
      return `<div class="quick-edit-row saved"><div><b>${signedHourShort(delta)} · payable ${previousPayable.toFixed(2)}h → ${newPayable.toFixed(2)}h</b><small>${escapeHtml(item.note || 'No note provided')}</small><small>${createdAt ? businessDateTimeLabel(createdAt) : 'Saved edit'}</small></div></div>`;
    }).join('')}`
    : '<div class="quick-edit-empty saved">No saved time edits yet for this cutoff.</div>';
}

function refreshQuickHoursDraftTotals() {
  if (!editingQuickHoursRow) return;
  const actual = Math.max(0, Number($('#quickActualHours').value) || 0);
  const totalDeducted = quickBaseDeductedHours(editingQuickHoursRow, actual);
  const payable = Math.max(0, actual - totalDeducted);
  $('#quickDeductHours').value = totalDeducted.toFixed(2);
  $('#quickPayableHours').value = payable.toFixed(2);
  if ($('#quickAddDeductHours')) $('#quickAddDeductHours').value = '0.00';
  $('#quickDeductionPreview').textContent = quickHoursPreviewText(editingQuickHoursRow, totalDeducted);
}

function addQuickHoursDraft() {
  if (!editingQuickHoursRow) return false;
  const activeQuickMode = document.activeElement?.id === 'quickPayableHours'
    ? 'payable'
    : document.activeElement?.id === 'quickDeductHours'
      ? 'deduct'
      : 'add';
  finalizeQuickHoursInputs(activeQuickMode);
  const actual = Math.max(0, Number($('#quickActualHours').value) || 0);
  const baseBeforeThisEdit = quickBaseDeductedHours(editingQuickHoursRow, actual);
  const typedAdditional = quickHoursNumber($('#quickAddDeductHours')?.value);
  const direction = $('#quickHourDirection')?.value === 'add' ? 'add' : 'deduct';
  const requestedAdditional = direction === 'add' ? -(typedAdditional ?? 0) : (typedAdditional ?? 0);
  const additional = direction === 'add'
    ? requestedAdditional
    : Math.min(Math.max(0, requestedAdditional), Math.max(0, actual - baseBeforeThisEdit));
  const note = $('#quickHoursNote').value.trim();
  if (Math.abs(additional) <= 0.004) {
    $('#quickHoursError').textContent = 'Enter the hours for this adjustment before clicking + Add adjustment.';
    $('#quickHoursError').hidden = false;
    return false;
  }
  if (!note) {
    $('#quickHoursError').textContent = 'Add a reason or note for this specific time edit.';
    $('#quickHoursError').hidden = false;
    return false;
  }
  quickHoursDrafts.push({
    id: crypto.randomUUID(),
    hours: additional,
    note,
    createdAt: new Date().toISOString()
  });
  $('#quickHoursNote').value = '';
  $('#quickHoursError').hidden = true;
  refreshQuickHoursDraftTotals();
  renderQuickHoursDrafts();
  $('#quickAddDeductHours')?.focus();
  $('#quickAddDeductHours')?.select();
  return true;
}

function removeQuickHoursDraft(id) {
  quickHoursDrafts = quickHoursDrafts.filter(draft => draft.id !== id);
  refreshQuickHoursDraftTotals();
  renderQuickHoursDrafts();
}

function syncQuickHoursInputs(mode = 'deduct') {
  if (!editingQuickHoursRow) return;
  const actual = Math.max(0, Number($('#quickActualHours').value) || 0);
  const previousDeducted = quickBaseDeductedHours(editingQuickHoursRow, actual);
  if (mode === 'payable') {
    const typedPayable = quickHoursNumber($('#quickPayableHours').value);
    if (typedPayable === null) {
      $('#quickDeductHours').value = '';
      if ($('#quickAddDeductHours')) $('#quickAddDeductHours').value = '';
      $('#quickDeductionPreview').textContent = 'Enter payable hours and Sync2Time will calculate the hour adjustment.';
      return;
    }
    const payable = Math.max(0, typedPayable);
    const deduct = Math.min(actual, actual - payable);
    const additional = deduct - previousDeducted;
    $('#quickDeductHours').value = compactHoursValue(deduct);
    if ($('#quickHourDirection')) $('#quickHourDirection').value = additional < 0 ? 'add' : 'deduct';
    if ($('#quickAddDeductHours')) $('#quickAddDeductHours').value = compactHoursValue(Math.abs(additional));
    $('#quickDeductionPreview').textContent = quickHoursPreviewText(editingQuickHoursRow, deduct);
  } else if (mode === 'add') {
    const typedAdditional = quickHoursNumber($('#quickAddDeductHours')?.value);
    if (typedAdditional === null) {
      $('#quickDeductionPreview').textContent = 'Enter only the hours for this adjustment. Sync2Time will add it to the current total.';
      return;
    }
    const signedAdditional = $('#quickHourDirection')?.value === 'add' ? -typedAdditional : typedAdditional;
    const deduct = Math.min(actual, previousDeducted + signedAdditional);
    const payable = Math.max(0, actual - deduct);
    $('#quickDeductHours').value = compactHoursValue(deduct);
    $('#quickPayableHours').value = compactHoursValue(payable);
    $('#quickDeductionPreview').textContent = quickHoursPreviewText(editingQuickHoursRow, deduct);
  } else {
    const typedDeduct = quickHoursNumber($('#quickDeductHours').value, { signed: true });
    if (typedDeduct === null) {
      $('#quickPayableHours').value = '';
      if ($('#quickAddDeductHours')) $('#quickAddDeductHours').value = '';
      $('#quickDeductionPreview').textContent = 'Enter total hour adjustment and Sync2Time will calculate payable hours.';
      return;
    }
    const deduct = Math.min(actual, typedDeduct);
    const payable = Math.max(0, actual - deduct);
    const additional = deduct - previousDeducted;
    $('#quickPayableHours').value = compactHoursValue(payable);
    if ($('#quickHourDirection')) $('#quickHourDirection').value = additional < 0 ? 'add' : 'deduct';
    if ($('#quickAddDeductHours')) $('#quickAddDeductHours').value = compactHoursValue(Math.abs(additional));
    $('#quickDeductionPreview').textContent = quickHoursPreviewText(editingQuickHoursRow, deduct);
  }
}

function finalizeQuickHoursInputs(mode = 'deduct') {
  if (!editingQuickHoursRow) return;
  syncQuickHoursInputs(mode);
  const actual = Math.max(0, Number($('#quickActualHours').value) || 0);
  const deduct = Math.min(actual, Number($('#quickDeductHours').value) || 0);
  const payable = Math.max(0, actual - deduct);
  const previousDeducted = quickBaseDeductedHours(editingQuickHoursRow, actual);
  const additional = deduct - previousDeducted;
  $('#quickDeductHours').value = deduct.toFixed(2);
  $('#quickPayableHours').value = payable.toFixed(2);
  if ($('#quickHourDirection')) $('#quickHourDirection').value = additional < 0 ? 'add' : 'deduct';
  if ($('#quickAddDeductHours')) $('#quickAddDeductHours').value = Math.abs(additional).toFixed(2);
  $('#quickDeductionPreview').textContent = quickHoursPreviewText(editingQuickHoursRow, deduct);
}

async function savePayrollAdjustmentEvent(record) {
  const eventRecord = {
    payroll_adjustment_id: record.payrollAdjustmentId || null,
    employee_id: record.employeeId,
    period_start: record.periodStart,
    period_end: record.periodEnd,
    change_type: record.changeType || 'hours',
    payroll_role: record.payrollRole || '',
    actual_hours: Number(record.actualHours || 0),
    previous_payable_hours: Number(record.previousPayableHours || 0),
    new_payable_hours: Number(record.newPayableHours || 0),
    deducted_hours_delta: Number(record.deductedHoursDelta || 0),
    total_deducted_hours: Number(record.totalDeductedHours || 0),
    deducted_amount_delta: Number(record.deductedAmountDelta || 0),
    adjustment_php_delta: Number(record.adjustmentPhpDelta || 0),
    deductions_php_delta: Number(record.deductionsPhpDelta || 0),
    commission_php_delta: Number(record.commissionPhpDelta || 0),
    note: record.note || '',
    created_by: currentProfile?.id || null,
    created_at: new Date().toISOString()
  };
  if (usesSupabase()) {
    const { data, error } = await supabaseClient
      .from('payroll_adjustment_events')
      .insert(eventRecord)
      .select()
      .single();
    if (error) {
      console.warn('Payroll adjustment history save failed:', error.message);
      return { ok: false, error };
    }
    payrollAdjustmentEvents = [data, ...payrollAdjustmentEvents.filter(item => item.id !== data.id)];
    persistPayrollAdjustmentEvents();
    return { ok: true, data };
  }
  const localRecord = {
    ...eventRecord,
    id: crypto.randomUUID(),
    employeeId: eventRecord.employee_id,
    periodStart: eventRecord.period_start,
    periodEnd: eventRecord.period_end,
    changeType: eventRecord.change_type,
    payrollRole: eventRecord.payroll_role,
    actualHours: eventRecord.actual_hours,
    previousPayableHours: eventRecord.previous_payable_hours,
    newPayableHours: eventRecord.new_payable_hours,
    deductedHoursDelta: eventRecord.deducted_hours_delta,
    totalDeductedHours: eventRecord.total_deducted_hours,
    createdAt: eventRecord.created_at
  };
  payrollAdjustmentEvents = [localRecord, ...payrollAdjustmentEvents];
  persistPayrollAdjustmentEvents();
  return { ok: true, data: localRecord };
}

function openQuickHoursEditor(employeeId) {
  enhanceQuickHoursEditor();
  const row = currentPayrollRows.find(item => item.person.id === employeeId);
  if (!row) return showToast('Payroll row not found.');
  const { start, end } = payrollRange();
  const currentPayable = Math.max(0, Number(row.payableHours ?? row.actualHours));
  editingQuickHoursRow = row;
  quickHoursDrafts = [];
  $('#quickHoursEmployee').textContent = row.person.name;
  $('#quickHoursPeriod').textContent = `${businessDateLabel(start)} to ${businessDateLabel(end)} · ${row.person.role}`;
  $('#quickActualHours').value = row.actualHours.toFixed(2);
  if ($('#quickCurrentPayableHours')) $('#quickCurrentPayableHours').value = currentPayable.toFixed(2);
  if ($('#quickHourDirection')) $('#quickHourDirection').value = 'deduct';
  if ($('#quickAddDeductHours')) $('#quickAddDeductHours').value = '0.00';
  $('#quickDeductHours').value = Number(row.deductedHours || 0).toFixed(2);
  $('#quickPayableHours').value = currentPayable.toFixed(2);
  $('#quickHoursNote').value = '';
  $('#quickDeductionPreview').textContent = quickHoursPreviewText(row, row.deductedHours || 0);
  $('#quickHoursError').hidden = true;
  renderQuickHoursDrafts();
  $('#quickHoursBackdrop').hidden = false;
  ($('#quickAddDeductHours') || $('#quickPayableHours')).focus();
  ($('#quickAddDeductHours') || $('#quickPayableHours')).select();
}

async function saveQuickHoursAdjustment(event) {
  event.preventDefault();
  if (!editingQuickHoursRow) return;
  const row = editingQuickHoursRow;
  const { start, end } = payrollRange();
  const pendingAdditional = quickHoursNumber($('#quickAddDeductHours')?.value) || 0;
  const pendingNote = $('#quickHoursNote').value.trim();
  if (quickHoursDrafts.length && pendingAdditional > 0.004) {
    if (!pendingNote) {
      $('#quickHoursError').textContent = 'Add a note for the current edit, then click Save again.';
      $('#quickHoursError').hidden = false;
      return;
    }
    if (!addQuickHoursDraft()) return;
  }
  const activeQuickMode = document.activeElement?.id === 'quickPayableHours'
    ? 'payable'
    : document.activeElement?.id === 'quickAddDeductHours'
      ? 'add'
      : 'deduct';
  if (!quickHoursDrafts.length) finalizeQuickHoursInputs(activeQuickMode);
  const actual = Math.max(0, Number($('#quickActualHours').value) || 0);
  const previousDeductedHours = Math.min(actual, Number(row.deductedHours || 0));
  const previousPayableHours = Math.max(0, actual - previousDeductedHours);
  const draftTotal = quickDraftHoursTotal();
  const deductedHours = quickHoursDrafts.length
    ? Math.min(actual, previousDeductedHours + draftTotal)
    : Math.min(actual, Number($('#quickDeductHours').value) || 0);
  const newPayableHours = Math.max(0, actual - deductedHours);
  const deductedHoursDelta = deductedHours - previousDeductedHours;
  const note = quickHoursDrafts.length
    ? quickHoursDrafts.map((draft, index) => `Edit ${index + 1}: ${signedHourShort(draft.hours)} - ${draft.note}`).join(' | ')
    : $('#quickHoursNote').value.trim();
  if (Math.abs(deductedHoursDelta) > 0.004 && !note) {
    $('#quickHoursError').textContent = 'Add a reason or note before saving an hour adjustment.';
    $('#quickHoursError').hidden = false;
    return;
  }
  const existing = row.record || {};
  const existingHasStatutoryColumns = ['statutory_sss_php', 'statutory_philhealth_php', 'statutory_pagibig_php'].some(key => Object.prototype.hasOwnProperty.call(existing, key));
  const assignmentKey = row.assignmentKey || 'primary';
  const record = {
    employee_id: row.employeeId || row.person.id,
    period_start: isoDate(start),
    period_end: isoDate(end),
    assignment_key: assignmentKey,
    deducted_hours: dbDeductedHours(deductedHours),
    payable_hours_override: newPayableHours,
    deducted_amount: Number(existing.deducted_amount ?? existing.deductedAmount ?? 0),
    commission: Number(existing.commission ?? 0),
    adjustment_php: Number(existing.adjustment_php ?? existing.adjustmentPhp ?? row.adjustment ?? 0),
    deductions_php: Number(existing.deductions_php ?? existing.deductionsPhp ?? row.deductions ?? 0),
    commission_php: Number(existing.commission_php ?? existing.commissionPhp ?? row.commission ?? 0),
    cutoff_pay_override: existing.cutoff_pay_override ?? existing.cutoffPayOverride ?? null,
    gross_pay_override: existing.gross_pay_override ?? existing.grossPayOverride ?? null,
    ...(existingHasStatutoryColumns ? {
      statutory_sss_php: existing.statutory_sss_php ?? existing.statutorySssPhp ?? null,
      statutory_philhealth_php: existing.statutory_philhealth_php ?? existing.statutoryPhilHealthPhp ?? null,
      statutory_pagibig_php: existing.statutory_pagibig_php ?? existing.statutoryPagibigPhp ?? null
    } : {}),
    paystub_approved: false,
    approved_at: null,
    approved_by: null,
    note,
    updated_at: new Date().toISOString()
  };
  let savedAdjustmentId = existing.id || null;
  if (usesSupabase()) {
    const { data, error } = await supabaseClient.from('payroll_adjustments').upsert(record, { onConflict: payrollAdjustmentConflictTarget() }).select().single();
    if (error) {
      const sqlHint = /assignment_key|unique|conflict|column/i.test(error.message || '')
        ? ' Run outputs/sync2time-dual-role-payroll-sql.sql in Supabase first.'
        : /payable_hours_override|column/i.test(error.message || '')
          ? ' Run outputs/sync2time-payable-hours-override-sql.sql in Supabase first.'
          : '';
      $('#quickHoursError').textContent = `Could not save quick hours: ${error.message}.${sqlHint}`;
      $('#quickHoursError').hidden = false;
      return;
    }
    savedAdjustmentId = data.id;
    payrollAdjustments = payrollAdjustments.filter(item => item.id !== data.id && !payrollAdjustmentMatches(item, data.employee_id, data.period_start, data.period_end, data.assignment_key || 'primary'));
    payrollAdjustments.push(data);
  } else {
    payrollAdjustments = payrollAdjustments.filter(item => !payrollAdjustmentMatches(item, record.employee_id, record.period_start, record.period_end, record.assignment_key));
    payrollAdjustments.push({ ...record, id: crypto.randomUUID(), employeeId: record.employee_id, periodStart: record.period_start, periodEnd: record.period_end, assignmentKey: record.assignment_key, deductedHours: record.deducted_hours, payableHoursOverride: record.payable_hours_override });
    persistPayrollAdjustments();
  }
  let historyResult = { ok: true };
  if (quickHoursDrafts.length) {
    let runningDeducted = previousDeductedHours;
    for (const draft of quickHoursDrafts) {
      const draftHours = Math.min(actual - runningDeducted, Number(draft.hours || 0));
      if (Math.abs(draftHours) <= 0.004) continue;
      const draftPreviousPayable = Math.max(0, actual - runningDeducted);
      runningDeducted = Math.min(actual, runningDeducted + draftHours);
      const result = await savePayrollAdjustmentEvent({
        payrollAdjustmentId: savedAdjustmentId,
        employeeId: row.employeeId || row.person.id,
        periodStart: isoDate(start),
        periodEnd: isoDate(end),
        changeType: 'hours',
        payrollRole: selectedPayrollRole,
        actualHours: actual,
        previousPayableHours: draftPreviousPayable,
        newPayableHours: Math.max(0, actual - runningDeducted),
        deductedHoursDelta: draftHours,
        totalDeductedHours: runningDeducted,
        note: draft.note
      });
      if (!result.ok) historyResult = result;
    }
  } else if (Math.abs(deductedHoursDelta) > 0.004 || note) {
    historyResult = await savePayrollAdjustmentEvent({
      payrollAdjustmentId: savedAdjustmentId,
      employeeId: row.employeeId || row.person.id,
      periodStart: isoDate(start),
      periodEnd: isoDate(end),
      changeType: 'hours',
      payrollRole: selectedPayrollRole,
      actualHours: actual,
      previousPayableHours,
      newPayableHours,
      deductedHoursDelta,
      totalDeductedHours: deductedHours,
      note
    });
  }
  quickHoursDrafts = [];
  closeQuickHoursEditor();
  renderPayroll();
  renderReports();
  renderEmployeePayrollAdjustments();
  showToast(historyResult.ok ? `${row.person.name}'s payable hours were updated.` : 'Hours saved, but the employee history table is missing. Run the new SQL file in Supabase.');
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
  const assignmentKey = editingPayrollRow.assignmentKey || 'primary';
  const record = {
    employee_id: editingPayrollRow.employeeId || editingPayrollRow.person.id,
    period_start: isoDate(start),
    period_end: isoDate(end),
    assignment_key: assignmentKey,
    deducted_hours: Number(existing.deducted_hours ?? existing.deductedHours ?? 0),
    payable_hours_override: existing.payable_hours_override ?? existing.payableHoursOverride ?? null,
    deducted_amount: Number(existing.deducted_amount ?? existing.deductedAmount ?? 0),
    commission: Number(existing.commission ?? 0),
    adjustment_php: Number($('#payrollRowAdjustment').value) || 0,
    deductions_php: Number($('#payrollRowDeduction').value) || 0,
    commission_php: Number($('#payrollRowCommission').value) || 0,
    cutoff_pay_override: $('#payrollRowCutoffPay').value === '' ? null : Math.max(0, Number($('#payrollRowCutoffPay').value) || 0),
    gross_pay_override: $('#payrollRowGrossPay').value === '' ? null : Math.max(0, Number($('#payrollRowGrossPay').value) || 0),
    ...(editingPayrollRow.payrollRole === 'admin' ? {
      statutory_sss_php: editingPayrollRow.statutoryAppliesThisCutoff ? Math.max(0, Number($('#payrollRowSss')?.value) || 0) : null,
      statutory_philhealth_php: editingPayrollRow.statutoryAppliesThisCutoff ? Math.max(0, Number($('#payrollRowPhilHealth')?.value) || 0) : null,
      statutory_pagibig_php: editingPayrollRow.statutoryAppliesThisCutoff ? Math.max(0, Number($('#payrollRowPagibig')?.value) || 0) : null
    } : {}),
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
    const { data, error } = await supabaseClient.from('payroll_adjustments').upsert(record, { onConflict: payrollAdjustmentConflictTarget() }).select().single();
    if (error) {
      const sqlHint = /assignment_key|unique|conflict/i.test(error.message || '')
        ? ' Run outputs/sync2time-dual-role-payroll-sql.sql in Supabase first.'
        : /statutory_sss_php|statutory_philhealth_php|statutory_pagibig_php/i.test(error.message || '')
        ? ' Run outputs/sync2time-statutory-deductions-sql.sql in Supabase first.'
        : /payable_hours_override|column/i.test(error.message || '')
          ? ' Run outputs/sync2time-payable-hours-override-sql.sql in Supabase first.'
          : '';
      $('#payrollRowError').textContent = `Could not save: ${error.message}.${sqlHint}`;
      $('#payrollRowError').hidden = false;
      return;
    }
    payrollAdjustments = payrollAdjustments.filter(item => item.id !== data.id && !payrollAdjustmentMatches(item, data.employee_id, data.period_start, data.period_end, data.assignment_key || 'primary'));
    payrollAdjustments.push(data);
  } else {
    payrollAdjustments = payrollAdjustments.filter(item => !payrollAdjustmentMatches(item, record.employee_id, record.period_start, record.period_end, record.assignment_key));
    payrollAdjustments.push({ ...record, id: crypto.randomUUID(), employeeId: record.employee_id, periodStart: record.period_start, periodEnd: record.period_end, assignmentKey: record.assignment_key });
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
      assignment_key: row.assignmentKey || 'primary',
      paystub_approved: approved,
      approved_at: approved ? new Date().toISOString() : null,
      approved_by: approved ? currentProfile.id : null
    }, { onConflict: payrollAdjustmentConflictTarget() });
  } else {
    const existing = row.record || {};
    payrollAdjustments = payrollAdjustments.filter(item => !payrollAdjustmentMatches(item, employeeId, isoDate(start), isoDate(end), row.assignmentKey || 'primary'));
    payrollAdjustments.push({ ...existing, employeeId, periodStart: isoDate(start), periodEnd: isoDate(end), assignmentKey: row.assignmentKey || 'primary', paystubApproved: approved, approvedAt: approved ? new Date().toISOString() : null });
    persistPayrollAdjustments();
    renderPayroll();
    return;
  }
  if (result.error) {
    const sqlHint = /assignment_key|unique|conflict|column/i.test(result.error.message || '')
      ? ' Run outputs/sync2time-dual-role-payroll-sql.sql in Supabase first.'
      : '';
    return showToast(`Approval error: ${result.error.message}.${sqlHint}`);
  }
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
  if (!confirm(`Send ${rows.length} ${selectedPayrollRole} paystubs now from hr@sync2va.com? Each PDF will only be sent to that employee's dedicated paystub email.`)) return;
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
      await invokeEdgeFunction('send-paystubs', {
        employeeId: row.person.id,
        assignmentKey: row.assignmentKey || 'primary',
        periodStart: isoDate(start),
        periodEnd: isoDate(end),
        filename: pdf.filename,
        pdfBase64: pdf.base64
      });
    } catch (error) {
      failures.push(`${row.person.name}: ${error.message || 'send failed'}`);
    }
  }
  button.textContent = original;
  await loadPayrollAdjustments();
  renderPayroll();
  if (failures.length) {
    console.error('Paystub email failures:', failures);
    showToast(`${rows.length - failures.length} sent; ${failures.length} failed. First error: ${failures[0]}`);
  } else {
    showToast(`All ${rows.length} paystubs were emailed successfully.`);
  }
}

function appReturnUrl() {
  if (location.protocol === 'http:' || location.protocol === 'https:') return `${location.origin}${location.pathname}#payroll`;
  return 'https://time.sync2va.com/#payroll';
}

function handleQuickBooksReturnNotice() {
  const hash = location.hash || '';
  if (!hash.includes('?')) return;
  const [pageHash, queryString] = hash.split('?');
  const params = new URLSearchParams(queryString || '');
  const status = params.get('quickbooks');
  if (!status) return;
  if (pageHash.replace('#', '') !== 'payroll') location.hash = '#payroll';
  if (status === 'connected') {
    quickBooksStatus = {
      checked: true,
      connected: true,
      environment: params.get('environment') || '',
      realmId: params.get('realmId') || '',
      message: 'QuickBooks connected successfully.'
    };
    showToast('QuickBooks connected successfully.');
    setTimeout(() => refreshQuickBooksStatus(false), 700);
  } else {
    quickBooksStatus = {
      checked: true,
      connected: false,
      error: params.get('message') || 'QuickBooks connection failed.'
    };
    showToast(`QuickBooks connection error: ${quickBooksStatus.error}`);
  }
  renderQuickBooksPanel();
  if (history.replaceState) history.replaceState(null, document.title, `${location.pathname}${pageHash || '#payroll'}`);
  showPage();
}

function buildQuickBooksPayrollRows() {
  return PAYROLL_ROLES.flatMap(role => buildPayrollRows(role).map(row => ({ ...row, payrollRole: role })));
}

function quickBooksRoleSummary(rows) {
  return PAYROLL_ROLES.map(role => {
    const roleRows = rows.filter(row => row.payrollRole === role);
    return {
      role,
      label: PAYROLL_ROLE_LABELS[role] || role,
      employeeCount: roleRows.length,
      grossPhp: Number(roleRows.reduce((sum, row) => sum + Number(row.grossPhp || 0), 0).toFixed(2)),
      netPayPhp: Number(roleRows.reduce((sum, row) => sum + Number(row.netPay || 0), 0).toFixed(2))
    };
  }).filter(item => item.employeeCount > 0);
}

function quickBooksPayloadRows(rows) {
  return rows.map(row => ({
    employeeId: row.person.id,
    assignmentKey: row.assignmentKey || 'primary',
    employeeName: row.person.name,
    email: row.person.email || '',
    role: row.person.role || '',
    payrollRole: row.payrollRole,
    department: row.person.department || '',
    expectedHours: Number(row.expectedHours || 0),
    actualHours: Number(row.actualHours || 0),
    payableHours: Number(row.payableHours || 0),
    approvedOtHours: Number(row.otHours || 0),
    pendingOtHours: Number(row.pendingOtHours || 0),
    rejectedOtHours: Number(row.rejectedOtHours || 0),
    usdHourlyRate: Number(row.hourlyUsd || 0),
    phpRate: Number(payrollUsdPhpRate() || 0),
    grossUsd: Number(row.grossUsd || 0),
    grossPhp: Number(row.grossPhp || 0),
    calculatedHolidayPayPhp: Number(row.calculatedHolidayPayPhp || 0),
    holidayPayPhp: Number(row.holidayPayPhp || 0),
    hourAdjustment: Number(row.deductedHours || 0),
    hourAdjustmentPhp: Number(row.hourDeductionPhp || 0),
    amountDeductionPhp: Number(row.amountDeductionPhp || 0),
    quickDeductionPhp: Number(row.quickDeductionPhp || 0),
    adjustmentPhp: Number(row.adjustment || 0),
    otherEarningsPhp: Number(row.otherEarnings || 0),
    deductionsPhp: Number(row.deductions || 0),
    commissionPhp: Number(row.commission || 0),
    statutorySssPhp: Number(row.statutorySssPhp || 0),
    statutoryPhilHealthPhp: Number(row.statutoryPhilHealthPhp || 0),
    statutoryPagibigPhp: Number(row.statutoryPagibigPhp || 0),
    statutoryDeductionsPhp: Number(row.statutoryDeductionsPhp || 0),
    bankFeesPhp: Number(row.bankFees || 0),
    otherDeductionsPhp: Number(row.otherDeductions || 0),
    netPayPhp: Number(row.netPay || 0),
    note: row.note || ''
  }));
}

function renderQuickBooksPanel() {
  const statusEl = $('#quickbooksStatus');
  const noteEl = $('#quickbooksSyncNote');
  if (!statusEl || !noteEl) return;
  const rows = buildQuickBooksPayrollRows();
  const approvedRows = rows.filter(row => row.paystubApproved);
  const totalNet = rows.reduce((sum, row) => sum + Number(row.netPay || 0), 0);
  const missingApprovals = rows.filter(row => !row.paystubApproved);
  const connectButton = $('#quickbooksConnect');
  const refreshButton = $('#quickbooksRefresh');
  const syncButton = $('#quickbooksSyncPayroll');

  if (!usesSupabase()) {
    statusEl.textContent = 'Sign in with the Supabase admin account before connecting QuickBooks.';
    noteEl.textContent = 'QuickBooks sync is disabled while Sync2Time is running without a live Supabase admin session.';
    if (connectButton) connectButton.disabled = true;
    if (refreshButton) refreshButton.disabled = true;
    if (syncButton) syncButton.disabled = true;
    return;
  }

  const environmentLabel = quickBooksStatus.environment ? `${quickBooksStatus.environment}` : 'environment not checked';
  if (quickBooksStatus.connected) {
    statusEl.textContent = `Connected to QuickBooks ${environmentLabel}${quickBooksStatus.realmId ? ` · Company ID ${quickBooksStatus.realmId}` : ''}${quickBooksStatus.lastSyncAt ? ` · Last sync ${businessDateLabel(new Date(quickBooksStatus.lastSyncAt))}` : ''}.`;
  } else {
    statusEl.textContent = quickBooksStatus.message || quickBooksStatus.error || 'QuickBooks is not connected yet.';
  }

  if (!rows.length) {
    noteEl.textContent = 'No payroll rows are available for this cutoff yet.';
  } else if (missingApprovals.length) {
    noteEl.textContent = `${approvedRows.length} of ${rows.length} paystubs approved. Missing approval: ${missingApprovals.slice(0, 4).map(row => row.person.name).join(', ')}${missingApprovals.length > 4 ? '...' : ''}.`;
  } else {
    noteEl.textContent = `${rows.length} approved employees are ready to sync as accounting journal lines. Total net pay: ${phpMoney(totalNet)}.`;
  }

  if (connectButton) connectButton.disabled = quickBooksSyncInProgress;
  if (refreshButton) refreshButton.disabled = quickBooksSyncInProgress;
  if (syncButton) {
    syncButton.disabled = quickBooksSyncInProgress || !quickBooksStatus.connected || !rows.length || Boolean(missingApprovals.length);
    syncButton.textContent = quickBooksSyncInProgress ? 'Syncing...' : 'Sync approved cutoff';
  }
}

async function refreshQuickBooksStatus(showFeedback = true) {
  if (!usesSupabase()) {
    quickBooksStatus = { checked: true, connected: false, message: 'Supabase admin login is required before checking QuickBooks.' };
    renderQuickBooksPanel();
    return quickBooksStatus;
  }
  const refreshButton = $('#quickbooksRefresh');
  const originalText = refreshButton?.textContent || 'Check status';
  if (refreshButton) {
    refreshButton.disabled = true;
    refreshButton.textContent = 'Checking...';
  }
  try {
    const result = await invokeEdgeFunction('quickbooks-status', {});
    quickBooksStatus = { checked: true, ...result };
    if (showFeedback) showToast(result.connected ? 'QuickBooks is connected.' : (result.message || 'QuickBooks is not connected yet.'));
  } catch (error) {
    quickBooksStatus = { checked: true, connected: false, error: error.message || 'Could not check QuickBooks status.' };
    if (showFeedback) showToast(`QuickBooks status error: ${quickBooksStatus.error}`);
  } finally {
    if (refreshButton) {
      refreshButton.disabled = false;
      refreshButton.textContent = originalText;
    }
    renderQuickBooksPanel();
  }
  return quickBooksStatus;
}

async function connectQuickBooks() {
  if (!usesSupabase()) return showToast('Sign in as admin before connecting QuickBooks.');
  const button = $('#quickbooksConnect');
  const originalText = button?.textContent || 'Connect QuickBooks';
  if (button) {
    button.disabled = true;
    button.textContent = 'Opening QuickBooks...';
  }
  try {
    const result = await invokeEdgeFunction('quickbooks-connect', { returnUrl: appReturnUrl() });
    if (!result.authorizationUrl) throw new Error('QuickBooks authorization URL was not returned.');
    window.location.href = result.authorizationUrl;
  } catch (error) {
    showToast(`QuickBooks connect error: ${error.message || 'unknown error'}`);
    if (button) {
      button.disabled = false;
      button.textContent = originalText;
    }
  }
}

async function syncApprovedPayrollToQuickBooks() {
  if (!usesSupabase()) return showToast('Supabase admin login is required before QuickBooks sync.');
  let status = quickBooksStatus;
  if (!status.connected) status = await refreshQuickBooksStatus(false);
  if (!status.connected) return showToast(status.error || status.message || 'Connect QuickBooks before syncing payroll.');

  const rows = buildQuickBooksPayrollRows();
  if (!rows.length) return showToast('No payroll rows are available for this cutoff.');
  const missingApprovals = rows.filter(row => !row.paystubApproved);
  if (missingApprovals.length) {
    return showToast(`Approve every paystub first. Missing: ${missingApprovals.slice(0, 4).map(row => row.person.name).join(', ')}${missingApprovals.length > 4 ? '...' : ''}`);
  }

  const { start, end, payDateKey } = payrollRange();
  const totalNetPayPhp = Number(rows.reduce((sum, row) => sum + Number(row.netPay || 0), 0).toFixed(2));
  if (!(totalNetPayPhp > 0)) return showToast('The approved net pay total is zero, so nothing will be sent to QuickBooks.');
  if (!confirm(`Sync ${rows.length} approved employee pay lines to QuickBooks for ${businessDateLabel(start)} to ${businessDateLabel(end)}?\n\nThis creates one accounting Journal Entry only. It does not run QuickBooks Payroll.\n\nTotal net pay: ${phpMoney(totalNetPayPhp)}.`)) return;

  const button = $('#quickbooksSyncPayroll');
  quickBooksSyncInProgress = true;
  renderQuickBooksPanel();
  try {
    const payload = {
      periodStart: isoDate(start),
      periodEnd: isoDate(end),
      payDate: payDateKey,
      roleScope: 'all',
      fxRate: payrollUsdPhpRate(),
      totalGrossPhp: Number(rows.reduce((sum, row) => sum + Number(row.grossPhp || 0), 0).toFixed(2)),
      totalNetPayPhp,
      employeeCount: rows.length,
      roleSummary: quickBooksRoleSummary(rows),
      rows: quickBooksPayloadRows(rows)
    };
    if (button) button.textContent = 'Sending to QuickBooks...';
    const result = await invokeEdgeFunction('quickbooks-sync-payroll', payload);
    await refreshQuickBooksStatus(false);
    if (result.alreadySynced) {
      showToast(`This cutoff was already synced to QuickBooks accounting Journal Entry ${result.journalEntryId || result.quickbooksId || ''}.`);
    } else {
      showToast(`QuickBooks accounting sync complete. Journal Entry ${result.journalEntryId || result.quickbooksId || 'created'}.`);
    }
  } catch (error) {
    showToast(`QuickBooks sync error: ${error.message || 'unknown error'}`);
  } finally {
    quickBooksSyncInProgress = false;
    renderQuickBooksPanel();
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
    $('#employeePassword').dataset.originalPassword = source.tempPassword || '';
    $('#employeePassword').placeholder = 'Leave blank to keep current password';
  } else {
    $('#employeeProject').value = taskOptions[0];
    $('#employeeRateType').value = 'Hourly USD';
    $('#employeePassword').value = randomPassword();
    $('#employeePassword').dataset.originalPassword = '';
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

function openTimeEditForm(date = '', options = {}) {
  $('#timeEditForm').reset();
  $('#timeEditFormError').hidden = true;
  const mode = options.mode || 'correction';
  $('#timeEditForm').dataset.mode = mode;
  $('#timeEditForm').dataset.timeEntryId = options.timeEntryId || '';
  $('#timeEditForm h2').textContent = mode === 'edit' ? 'Edit this time entry' : mode === 'add' ? 'Add missed time' : 'Request correction';
  $('#timeEditReason').placeholder = mode === 'add' ? 'Example: power interruption, missed clock-in, app issue' : 'Explain the correction';
  if (options.start && options.end) {
    const start = new Date(Number(options.start));
    const end = new Date(Number(options.end));
    $('#timeEditDate').value = isoDate(start);
    $('#timeEditIn').value = businessTimeInput(start);
    $('#timeEditOut').value = businessTimeInput(end);
  } else {
    $('#timeEditDate').value = date || isoDate(todayDate);
  }
  $('#timeEditModalBackdrop').hidden = false;
}

function closeTimeEditForm() {
  $('#timeEditModalBackdrop').hidden = true;
}

function openWholeTimeEditor() {
  if (currentAccount?.role !== 'employee') return;
  if (state.running?.start) {
    return openTimeEditForm('', {
      mode: 'edit',
      timeEntryId: state.running.timeEntryId || '',
      start: state.running.start,
      end: Date.now()
    });
  }
  const latest = state.entries.find(entry => entry.start && entry.end && !entry.lunch);
  if (latest) {
    return openTimeEditForm('', {
      mode: 'edit',
      timeEntryId: latest.timeEntryId || '',
      start: latest.start,
      end: latest.end
    });
  }
  openTimeEditForm(isoDate(todayDate), { mode: 'correction' });
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
  const adminAllowed = ['today', 'attendance', 'projects', 'reports', 'payroll', 'adjustments', 'team', 'approvals', 'ai-alerts', 'audit'];
  const employeeAllowed = ['today', 'hours', 'calendar', 'documents', 'requests'];
  const allowed = currentAccount?.role === 'employee' ? employeeAllowed : adminAllowed;
  const active = allowed.includes(page) ? page : 'today';
  if (page !== active) location.hash = active;
  document.body.dataset.page = active;
  $$('.nav-item').forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${active}`));
  if (active === 'projects') renderProjects();
  if (active === 'reports') renderReports();
  if (active === 'payroll') renderPayroll();
  if (active === 'adjustments') renderAdjustmentCenter();
  if (active === 'team') renderTeamDirectory();
  if (active === 'approvals') renderApprovals();
  if (active === 'ai-alerts') renderAiAlerts();
  if (active === 'audit') renderAuditLog();
  if (active === 'hours') renderEmployeeHoursReport();
  if (active === 'calendar') renderLeaveCalendar();
  if (active === 'documents') renderDocuments();
  if (active === 'requests') renderEmployeeRequests();
  renderDeletedTimeAlerts();
  renderEmployeePayrollAdjustments();
  renderEmployeeHoursReport();
  queueHorizontalScrollControls();
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
  state.entries.unshift({ task: running.task, seconds: secondsBetween(running.start, end), start: running.start, end, timeEntryId: running.timeEntryId || null });
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
  state.entries.unshift({ task: running.task, seconds: secondsBetween(running.start, end), start: running.start, end, timeEntryId: running.timeEntryId || remoteEntry.id || null });
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
  let employeeId = button.dataset.adminClockout;
  const email = decodeURIComponent(button.dataset.clockoutEmail || '');
  const name = decodeURIComponent(button.dataset.clockoutName || 'Employee');
  if (!confirm(`Clock out ${name} now? Their active time entry will end immediately.`)) return;
  button.disabled = true;
  const end = new Date().toISOString();
  if (usesSupabase()) {
    if (!employeeId && email) {
      employeeId = supabaseProfiles.find(profile => profile.email?.toLowerCase() === email.toLowerCase())?.id || '';
    }
    if (!employeeId) {
      button.disabled = false;
      return showToast(`Clock-out error: ${name} does not have a synced employee profile.`);
    }
    const timeUpdate = await supabaseClient
      .from('time_entries')
      .update({ clock_out: end, status: 'completed' })
      .eq('employee_id', employeeId)
      .or('status.eq.working,clock_out.is.null')
      .select('id');
    if (timeUpdate.error) {
      button.disabled = false;
      showToast(`Clock-out error: ${timeUpdate.error.message}`);
      return;
    }
    if (!(timeUpdate.data || []).length) {
      button.disabled = false;
      showToast(`${name} has no active clock-in to close.`);
      await loadSupabaseTimeEntries();
      await loadSupabaseLivePresence();
      renderTeamDirectory();
      renderAttendance();
      renderScheduleWatch();
      return;
    }
    for (const entry of timeUpdate.data || []) await requestAiOvertimeReview(entry.id);
    const presenceDelete = await supabaseClient.from('live_presence').delete().eq('employee_id', employeeId);
    if (presenceDelete.error) showToast(`Time ended, but live status error: ${presenceDelete.error.message}`);
    if ($('#deletedTimeRows') && employeeId) {
      await supabaseClient.from('app_notifications').insert({
        employee_id: employeeId,
        type: 'admin_clock_out',
        title: 'Clocked out by admin',
        message: `Your active work session was clocked out by HR Admin at ${formatClock(end)}.`,
        meta: { clockedOutAt: end, clockedOutBy: currentProfile?.id || null }
      });
    }
    await loadSupabaseTimeEntries();
    await loadSupabaseLivePresence();
    await loadOvertimeAlerts();
  } else {
    localStorage.setItem(LIVE_PRESENCE_KEY, JSON.stringify(readLivePresence().filter(record => record.email !== email)));
  }
  renderTeamDirectory();
  renderLiveTeam();
  renderAttendance();
  renderScheduleWatch();
  renderReports();
  renderAiAlerts();
  renderAuditLog();
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
  if (!longSessionPromptAppliesToCurrentEmployee()) {
    longSessionDeadline = null;
    if ($('#longSessionBackdrop')) $('#longSessionBackdrop').hidden = true;
    return;
  }
  if (!state.running || longSessionClockOutPending) return;
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
  const button = $('#toggleTimer');
  button.disabled = true;
  try {
    await refreshOwnActiveSessionFromSupabase();
    if (state.running) {
      await clockOutActiveSession();
      if ($('#taskNoteInput')) $('#taskNoteInput').value = '';
      return;
    } else {
      const task = $('#taskInput').value || 'Untitled task';
      const note = $('#taskNoteInput').value.trim();
      const start = Date.now();
      const timeEntry = await createSupabaseTimeEntry(task, start);
      if (usesSupabase() && !timeEntry) return;
      await loadSupabaseTimeEntries();
      const runningStart = timeEntry?.start || start;
      const runningTask = timeEntry?.task || task;
      state.running = { task: runningTask, note, start: runningStart, timeEntryId: timeEntry?.id || null, nextLongSessionCheckAt: runningStart + LONG_SESSION_SECONDS * 1000 };
      state.clockIn = state.clockIn || runningStart;
      state.clockOut = null;
      syncOwnLivePresence();
      showToast(timeEntry?.resumed ? 'Existing active shift resumed. You are clocked in.' : 'Clocked in.');
    }
  } finally {
    button.disabled = false;
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
  if (currentAccount?.role === 'employee') return openWholeTimeEditor();
  $('#modalBackdrop').hidden = false;
};

$('#taskInput').onchange = async () => {
  if (!state.running) return;
  const nextTask = $('#taskInput').value || 'Untitled task';
  const previousRunning = { ...state.running };
  if (usesSupabase() && crossesDualAssignmentBoundary(previousRunning.task, nextTask)) {
    const switchAt = Date.now();
    await completeSupabaseTimeEntry(switchAt);
    await loadSupabaseTimeEntries();
    const nextEntry = await createSupabaseTimeEntry(nextTask, switchAt);
    if (!nextEntry) {
      await refreshOwnActiveSessionFromSupabase();
      render();
      return;
    }
    state.entries.unshift({
      task: previousRunning.task,
      seconds: secondsBetween(previousRunning.start, switchAt),
      start: previousRunning.start,
      end: switchAt,
      timeEntryId: previousRunning.timeEntryId || null,
      remote: true
    });
    const runningStart = nextEntry.start || switchAt;
    state.running = {
      task: nextEntry.task || nextTask,
      note: previousRunning.note || '',
      start: runningStart,
      timeEntryId: nextEntry.id || null,
      nextLongSessionCheckAt: runningStart + LONG_SESSION_SECONDS * 1000
    };
    longSessionDeadline = null;
    if ($('#longSessionBackdrop')) $('#longSessionBackdrop').hidden = true;
    save();
    syncOwnLivePresence();
    render();
    showToast(`Started a new ${nextTask} time segment for accurate payroll.`);
    return;
  }
  state.running.task = nextTask;
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
  const originalPassword = $('#employeePassword').dataset.originalPassword || '';
  const passwordChanged = !old ? Boolean(password) : Boolean(password && password !== originalPassword);
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
    previousEmail: old?.email || email,
    newPassword: passwordChanged ? password : '',
    hash: passwordChanged ? await hashPassword(password) : old?.hash,
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
    record.saveWarning = result.warning || '';
    record.id = result.employeeId || record.id;
    record.paystubEmail = result.recipientEmail || record.paystubEmail;
    await refreshSupabaseData();
  }
  const storedRecord = { ...record };
  delete storedRecord.newPassword;
  delete storedRecord.previousEmail;
  delete storedRecord.saveWarning;
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
  showToast(record.saveWarning || (old ? 'Employee access updated.' : 'Employee access created.'));
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
  const form = $('#timeEditForm');
  const mode = form.dataset.mode || 'correction';
  const date = $('#timeEditDate').value;
  const clockIn = $('#timeEditIn').value;
  const clockOut = $('#timeEditOut').value;
  const hours = timeEditHours(date, clockIn, clockOut);
  let reason = $('#timeEditReason').value.trim();
  if (!hours) {
    $('#timeEditFormError').textContent = 'Clock-out must be after clock-in.';
    $('#timeEditFormError').hidden = false;
    return;
  }
  const effectiveEditRole = timeEditEffectiveRole(mode, form.dataset.timeEntryId || '');
  const isCoachEdit = mode === 'edit' && effectiveEditRole === 'Coach';
  if (isCoachEdit && usesSupabase()) {
    if (hours > 3) {
      const proceed = confirm(`This coach time edit is ${hours.toFixed(2)} hours. Sync2Time will auto-approve the first 3 hours and send the extra ${(hours - 3).toFixed(2)} hour${hours - 3 === 1 ? '' : 's'} to admin approval. Continue?`);
      if (!proceed) return;
    }
    const result = await applyCoachSelfTimeEdit({
      sourceEntryId: form.dataset.timeEntryId || '',
      date,
      clockIn,
      clockOut,
      reason
    });
    if (!result.ok) {
      $('#timeEditFormError').textContent = result.message;
      $('#timeEditFormError').hidden = false;
      return;
    }
    closeTimeEditForm();
    render();
    renderApprovals();
    renderEmployeeRequests();
    renderAuditLog();
    showToast(result.message);
    return;
  }
  if (effectiveEditRole === 'Coach' && hours > 3) {
    const proceed = confirm(`This coach time edit is ${hours.toFixed(2)} hours, which is more than the 3-hour coach limit. It will be sent to admin for approval before it is added to payroll. Continue?`);
    if (!proceed) return;
  }
  if (mode === 'add') reason = `${TIME_EDIT_ADD_PREFIX}${reason}`;
  if (mode === 'edit') reason = timeEditReasonWithSource(form.dataset.timeEntryId, reason);
  if (usesSupabase()) {
    const { error } = await supabaseClient.from('time_edit_requests').insert({
      employee_id: currentProfile.id,
      requested_date: date,
      requested_clock_in: clockIn,
      requested_clock_out: clockOut,
      reason,
      status: 'pending'
    });
    if (error) {
      $('#timeEditFormError').textContent = error.message;
      $('#timeEditFormError').hidden = false;
      return;
    }
    await loadSupabaseRequests();
  } else {
    timeEditRequests.push({ id: crypto.randomUUID(), employeeName: currentAccount.name, employeeEmail: currentAccount.email, date, clockIn, clockOut, reason, status: 'pending', createdAt: businessDateTimeLabel(new Date()) });
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
  if (!$('#quickHoursBackdrop').hidden) closeQuickHoursEditor();
});

$('#employeeSearch').oninput = renderAttendance;
$('#statusFilter').onchange = renderAttendance;
$('#dateFilter').onchange = renderAttendance;
$('#exportButton').onclick = () => showToast('Employees can view time here; exports are for admin reports.');
$('#attendanceExport').onclick = () => exportCsv('sync2time-attendance-report.csv', ['Employee,Role,Date,Clock in,Clock out,Worked,Status', ...rosterSource().map(person => `"${person.name}","${person.role}","${person.date}","${person.clockIn}","${person.clockOut}","${person.worked}","${person.status === 'clocked' ? 'Clocked in' : 'Complete'}"`)].join('\n'), 'Attendance report exported as CSV.');
$('#scheduleExport').onclick = () => exportCsv('sync2time-schedule-watch.csv', ['Employee,Role,Schedule,Clock in,Clock out,Rate,Earnings,Attendance note', ...rosterSource().map(person => `"${person.name}","${person.role}","${person.schedule}","${person.clockIn}","${person.clockOut}","${rateLabel(person)}","${money(employeeEarnings(person))}","${scheduleStatus(person).label}"`)].join('\n'), 'Schedule watch exported as CSV.');
if ($('#auditExport')) $('#auditExport').onclick = () => {
  const rows = auditLogRecords();
  const cell = value => `"${String(value ?? '').replace(/"/g, '""')}"`;
  const csv = ['Date/Time,Employee,Activity,Details,Status', ...rows.map(row => [businessDateTimeLabel(row.at), row.employee, row.activity, row.details, row.status].map(cell).join(','))].join('\n');
  exportCsv('sync2time-audit-log.csv', csv, 'Audit log exported as CSV.');
};
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
    row.commission.toFixed(2), row.holidayPayPhp.toFixed(2), row.otherEarningsPhp.toFixed(2),
    row.manualDeductionsPhp.toFixed(2), row.bankFeesPhp.toFixed(2), row.otherDeductionsPhp.toFixed(2),
    (row.payableSeconds / 3600).toFixed(2), row.pay.toFixed(2),
    row.netPay.toFixed(2), row.adjustment?.note || ''
  ].map(csvCell).join(','));
  const header = ['Employee', 'Email', 'Role', 'From', 'To', 'Period', 'Entries', 'Worked Hours', 'Hour Adjustment', 'Deducted Amount USD', 'Commission USD', 'Holiday Pay PHP', 'Other Earnings PHP', 'Manual Deductions PHP', 'Bank Fees PHP', 'Other Deduction PHP', 'Payable Hours', 'Gross Pay USD', 'Net Pay USD', 'Adjustment Note'];
  exportCsv(`sync2time-payroll-${isoDate(start)}-to-${isoDate(end)}.csv`, [header.map(csvCell).join(','), ...rows].join('\r\n'), 'Payroll report exported as CSV.');
};

$('#payrollTabs').onclick = event => {
  const tab = event.target.closest('[data-payroll-role]');
  if (!tab) return;
  selectedPayrollRole = tab.dataset.payrollRole;
  renderPayroll();
};
$('#payrollCutoff').onchange = renderPayroll;
if ($('#adjustmentsPeriod')) {
  $('#adjustmentsPeriod').onchange = () => {
    syncAdjustmentsDatesFromPeriod();
    renderAdjustmentCenter();
  };
}
['adjustmentsStart', 'adjustmentsEnd'].forEach(id => {
  const input = $(`#${id}`);
  if (input) input.onchange = () => {
    $('#adjustmentsPeriod').value = 'custom';
    if ($('#adjustmentsStart').value && $('#adjustmentsEnd').value && $('#adjustmentsStart').value > $('#adjustmentsEnd').value) {
      if (id === 'adjustmentsStart') $('#adjustmentsEnd').value = $('#adjustmentsStart').value;
      else $('#adjustmentsStart').value = $('#adjustmentsEnd').value;
    }
    renderAdjustmentCenter();
  };
});
if ($('#adjustmentSearch')) $('#adjustmentSearch').oninput = renderAdjustmentCenter;
if ($('#adjustmentCenterExport')) $('#adjustmentCenterExport').onclick = exportAdjustmentCenter;
async function savePayrollFxOverride() {
  const rate = Number($('#payrollFxRate').value);
  if (!(rate > 0)) return showToast('Enter a valid USD to PHP rate.');
  const { start, end } = payrollRange();
  const key = payrollFxOverrideKey(start, end);
  const previousOverrides = { ...payrollFxOverrides };
  const previousLegacy = manualPayrollFxOverride;
  payrollFxOverrides[key] = rate;
  manualPayrollFxOverride = null;
  persistPayrollFxOverrides();
  localStorage.removeItem('sync2time-payroll-usd-php');
  if (usesSupabase()) {
    try {
      await savePayrollFxOverridesSetting();
    } catch (error) {
      if (isMissingAppSettingsError(error)) {
        settingsTableMissing = true;
        renderPayroll();
        showToast(`USD to PHP rate saved on this browser for ${businessDateLabel(start)} to ${businessDateLabel(end)}. Run the app settings SQL to sync it for everyone.`);
        return;
      }
      payrollFxOverrides = previousOverrides;
      manualPayrollFxOverride = previousLegacy;
      persistPayrollFxOverrides();
      if (previousLegacy > 0) localStorage.setItem('sync2time-payroll-usd-php', String(previousLegacy));
      showToast(`Payroll rate sync error: ${error.message}`);
      renderPayroll();
      return;
    }
  }
  renderPayroll();
  showToast(`USD to PHP rate saved for ${businessDateLabel(start)} to ${businessDateLabel(end)}.`);
}

async function resetPayrollFxOverride() {
  const { start, end } = payrollRange();
  const key = payrollFxOverrideKey(start, end);
  const previousOverrides = { ...payrollFxOverrides };
  const previousLegacy = manualPayrollFxOverride;
  delete payrollFxOverrides[key];
  manualPayrollFxOverride = null;
  persistPayrollFxOverrides();
  localStorage.removeItem('sync2time-payroll-usd-php');
  if (usesSupabase()) {
    try {
      await savePayrollFxOverridesSetting();
    } catch (error) {
      if (isMissingAppSettingsError(error)) {
        settingsTableMissing = true;
        renderPayroll();
        showToast(`Live/reference rate restored on this browser for ${businessDateLabel(start)} to ${businessDateLabel(end)}. Run the app settings SQL to sync it for everyone.`);
        return;
      }
      payrollFxOverrides = previousOverrides;
      manualPayrollFxOverride = previousLegacy;
      persistPayrollFxOverrides();
      if (previousLegacy > 0) localStorage.setItem('sync2time-payroll-usd-php', String(previousLegacy));
      showToast(`Payroll rate sync error: ${error.message}`);
      renderPayroll();
      return;
    }
  }
  refreshPayrollUsdPhpRate();
  showToast(`Live/reference USD to PHP rate restored for ${businessDateLabel(start)} to ${businessDateLabel(end)}.`);
}

$('#payrollFxRate').onchange = savePayrollFxOverride;
if ($('#savePayrollFx')) $('#savePayrollFx').onclick = savePayrollFxOverride;
$('#resetPayrollFx').onclick = resetPayrollFxOverride;
$('#payrollExport').onclick = () => {
  const { start, end } = payrollRange();
  let header;
  let rows;
  if (selectedPayrollRole === 'coaches') {
    header = ['Employee', 'Role', 'Expected Hours', 'Actual Hours', 'Payable Hours', 'Hour Adjustment', 'Approved OT Hours', 'Pending OT Hours', 'Rejected Excess Hours', 'USD Hourly Rate', 'PHP Rate', 'Gross USD Pay', 'Gross PHP Pay', 'Calculated Holiday Pay PHP', 'Holiday Pay Used PHP', 'Hour Adjustment PHP', 'Manual Adjustments PHP', 'Other Earnings PHP', 'Deductions PHP', 'Commission PHP', 'Pag-IBIG PHP', 'PhilHealth PHP', 'SSS PHP', 'Bank Fees PHP', 'Other Deduction PHP', 'Net Pay PHP', 'Notes'];
    rows = currentPayrollRows.map(row => [row.person.name, row.person.role, row.expectedHours.toFixed(2), row.actualHours.toFixed(2), row.payableHours.toFixed(2), row.deductedHours.toFixed(2), row.otHours.toFixed(2), row.pendingOtHours.toFixed(2), row.rejectedOtHours.toFixed(2), row.hourlyUsd.toFixed(2), payrollUsdPhpRate().toFixed(4), row.grossUsd.toFixed(2), row.grossPhp.toFixed(2), row.calculatedHolidayPayPhp.toFixed(2), row.holidayPayPhp.toFixed(2), row.quickDeductionPhp.toFixed(2), row.adjustment.toFixed(2), row.otherEarnings.toFixed(2), row.deductions.toFixed(2), row.commission.toFixed(2), row.statutoryPagibigPhp.toFixed(2), row.statutoryPhilHealthPhp.toFixed(2), row.statutorySssPhp.toFixed(2), row.bankFees.toFixed(2), row.otherDeductions.toFixed(2), row.netPay.toFixed(2), row.note]);
  } else if (selectedPayrollRole === 'admin') {
    header = ['Employee', 'Role', 'Expected Hours', 'Actual Hours', 'Payable Hours', 'Hour Adjustment', 'Approved OT Hours', 'Pending OT Hours', 'Rejected Excess Hours', 'Cutoff Pay PHP', 'OT Pay PHP', 'Gross Pay PHP', 'Calculated Holiday Pay PHP', 'Holiday Pay Used PHP', 'Hour Adjustment PHP', 'Manual Adjustments PHP', 'Other Earnings PHP', 'Manual Deductions PHP', 'SSS PHP', 'PhilHealth PHP', 'Pag-IBIG PHP', 'Total Government Deductions PHP', 'Bank Fees PHP', 'Other Deduction PHP', 'Commission PHP', 'Net Pay PHP', 'Notes'];
    rows = currentPayrollRows.map(row => [row.person.name, row.person.role, row.expectedHours.toFixed(2), row.actualHours.toFixed(2), row.payableHours.toFixed(2), row.deductedHours.toFixed(2), row.otHours.toFixed(2), row.pendingOtHours.toFixed(2), row.rejectedOtHours.toFixed(2), row.cutoffPay.toFixed(2), row.otPay.toFixed(2), row.grossPhp.toFixed(2), row.calculatedHolidayPayPhp.toFixed(2), row.holidayPayPhp.toFixed(2), row.quickDeductionPhp.toFixed(2), row.adjustment.toFixed(2), row.otherEarnings.toFixed(2), row.deductions.toFixed(2), row.statutorySssPhp.toFixed(2), row.statutoryPhilHealthPhp.toFixed(2), row.statutoryPagibigPhp.toFixed(2), row.statutoryDeductionsPhp.toFixed(2), row.bankFees.toFixed(2), row.otherDeductions.toFixed(2), row.commission.toFixed(2), row.netPay.toFixed(2), row.note]);
  } else {
    header = ['Employee', 'Role', 'Actual Hours', 'Payable Hours', 'Hour Adjustment', 'Approved OT Hours', 'Pending OT Hours', 'Rejected Excess Hours', 'Gross Pay PHP', 'Calculated Holiday Pay PHP', 'Holiday Pay Used PHP', 'Hour Adjustment PHP', 'Manual Adjustments PHP', 'Other Earnings PHP', 'Deductions PHP', 'Pag-IBIG PHP', 'PhilHealth PHP', 'SSS PHP', 'Bank Fees PHP', 'Other Deduction PHP', 'Commission PHP', 'Net Pay PHP', 'Notes'];
    rows = currentPayrollRows.map(row => [row.person.name, row.person.role, row.actualHours.toFixed(2), row.payableHours.toFixed(2), row.deductedHours.toFixed(2), row.otHours.toFixed(2), row.pendingOtHours.toFixed(2), row.rejectedOtHours.toFixed(2), row.grossPhp.toFixed(2), row.calculatedHolidayPayPhp.toFixed(2), row.holidayPayPhp.toFixed(2), row.quickDeductionPhp.toFixed(2), row.adjustment.toFixed(2), row.otherEarnings.toFixed(2), row.deductions.toFixed(2), row.statutoryPagibigPhp.toFixed(2), row.statutoryPhilHealthPhp.toFixed(2), row.statutorySssPhp.toFixed(2), row.bankFees.toFixed(2), row.otherDeductions.toFixed(2), row.commission.toFixed(2), row.netPay.toFixed(2), row.note]);
  }
  const csv = [header, ...rows].map(row => row.map(csvCell).join(',')).join('\r\n');
  exportCsv(`sync2time-${selectedPayrollRole}-payroll-${isoDate(start)}-to-${isoDate(end)}.csv`, csv, `${selectedPayrollRole} payroll exported.`);
};
$('#payrollScrollLeft').onclick = () => $('#payrollTableScroll').scrollBy({ left: -520, behavior: 'smooth' });
$('#payrollScrollRight').onclick = () => $('#payrollTableScroll').scrollBy({ left: 520, behavior: 'smooth' });
['aiAlertStatus', 'aiAlertSeverity', 'aiAlertStart', 'aiAlertEnd', 'aiAlertEmployee'].forEach(id => {
  const input = $(`#${id}`);
  if (input) input.oninput = renderAiAlerts;
  if (input) input.onchange = renderAiAlerts;
});
$('#aiAlertRefresh').onclick = async () => {
  await detectOvertimeForCompletedEntries();
  await loadOvertimeAlerts();
  renderAiAlerts();
  showToast('AI alerts refreshed.');
};
$('#sendPaystubs').onclick = sendApprovedPaystubs;
if ($('#sendEmployeeSamplePaystubs')) $('#sendEmployeeSamplePaystubs').onclick = sendEmployeeSamplePaystubs;
if ($('#sendSampleBulkEmail')) $('#sendSampleBulkEmail').onclick = sendSampleBulkEmail;
if ($('#quickbooksRefresh')) $('#quickbooksRefresh').onclick = () => refreshQuickBooksStatus(true);
if ($('#quickbooksConnect')) $('#quickbooksConnect').onclick = connectQuickBooks;
if ($('#quickbooksSyncPayroll')) $('#quickbooksSyncPayroll').onclick = syncApprovedPayrollToQuickBooks;
$('#managePaystubTemplates').onclick = () => openPaystubEmailEditor();
$('#paystubEmailForm').onsubmit = openManualPaystubGmail;
$('#paystubEmailClose').onclick = closePaystubEmailEditor;
$('#paystubEmailCancel').onclick = closePaystubEmailEditor;
$('#paystubEmailBackdrop').onclick = event => {
  if (event.target === event.currentTarget) closePaystubEmailEditor();
};
$('#paystubEmailTemplate').onchange = event => {
  selectedPaystubEmailTemplateId = event.target.value;
  localStorage.setItem('sync2time-paystub-email-template-selected', selectedPaystubEmailTemplateId);
  loadPaystubEmailTemplateEditor();
};
$('#newPaystubEmailTemplate').onclick = addPaystubEmailTemplate;
$('#savePaystubEmailTemplate').onclick = savePaystubEmailTemplate;
$('#deletePaystubEmailTemplate').onclick = deletePaystubEmailTemplate;
window.addEventListener('resize', queueHorizontalScrollControls);
if ($('main')) {
  new MutationObserver(queueHorizontalScrollControls).observe($('main'), {
    childList: true,
    subtree: true
  });
}

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
  renderAuditLog();
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
$('#entries').onclick = event => {
  const button = event.target.closest('[data-entry-edit]');
  if (!button || currentAccount?.role !== 'employee') return;
  event.stopPropagation();
  openTimeEditForm('', {
    mode: button.dataset.entryId ? 'edit' : 'add',
    timeEntryId: button.dataset.entryId || '',
    start: button.dataset.entryStart,
    end: button.dataset.entryEnd
  });
};
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
$('#quickHoursForm').onsubmit = saveQuickHoursAdjustment;
$('#quickHoursClose').onclick = closeQuickHoursEditor;
$('#quickHoursCancel').onclick = closeQuickHoursEditor;
$('#quickHoursBackdrop').onclick = event => {
  if (event.target === event.currentTarget) closeQuickHoursEditor();
};
enhanceQuickHoursEditor();
if ($('#quickAddEdit')) $('#quickAddEdit').onclick = addQuickHoursDraft;
if ($('#quickAddDeductHours')) $('#quickAddDeductHours').oninput = () => syncQuickHoursInputs('add');
$('#quickPayableHours').oninput = () => syncQuickHoursInputs('payable');
$('#quickDeductHours').oninput = () => syncQuickHoursInputs('deduct');
if ($('#quickAddDeductHours')) $('#quickAddDeductHours').onblur = () => finalizeQuickHoursInputs('add');
$('#quickPayableHours').onblur = () => finalizeQuickHoursInputs('payable');
$('#quickDeductHours').onblur = () => finalizeQuickHoursInputs('deduct');
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
  const removeQuickEdit = event.target.closest('[data-remove-quick-edit]');
  if (removeQuickEdit) {
    event.stopPropagation();
    removeQuickHoursDraft(removeQuickEdit.dataset.removeQuickEdit);
    return;
  }
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
  const aiAlertAction = event.target.closest('[data-ai-alert-action]');
  if (aiAlertAction) {
    event.stopPropagation();
    await updateAiAlertAction(aiAlertAction.dataset.aiAlertId, aiAlertAction.dataset.aiAlertAction);
    return;
  }
  const adjustmentButton = event.target.closest('[data-edit-adjustment]');
  if (adjustmentButton) {
    event.stopPropagation();
    openPayrollAdjustment(adjustmentButton.dataset.editAdjustment);
    return;
  }
  const quickHours = event.target.closest('[data-quick-hours]');
  if (quickHours) {
    event.stopPropagation();
    openQuickHoursEditor(quickHours.dataset.quickHours);
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
  const emailPaystub = event.target.closest('[data-email-paystub]');
  if (emailPaystub) {
    event.stopPropagation();
    openPaystubEmailEditor(emailPaystub.dataset.emailPaystub);
    return;
  }
  const saveAdjustmentRow = event.target.closest('[data-save-adjustment-row]');
  if (saveAdjustmentRow) {
    event.stopPropagation();
    await saveAdjustmentCenterRow(saveAdjustmentRow.dataset.saveAdjustmentRow);
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
  renderAiAlerts();
  renderDocuments();
  renderDeletedTimeAlerts();
  renderReports();
  renderPayroll();
  renderAdjustmentCenter();
  refreshFxRate();
  refreshPayrollUsdPhpRate();
  if (supabaseClient) {
    const { data } = await supabaseClient.auth.getSession();
    if (data.session) {
      await applySupabaseSession(data.session);
      handleQuickBooksReturnNotice();
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
