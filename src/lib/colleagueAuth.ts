import {
  ColleagueProfile,
  ReviewItem,
  ClientHistoryItem,
  UpcomingAppointment,
  DEFAULT_COLLEAGUES,
  INITIAL_REVIEWS,
  INITIAL_CLIENT_HISTORY,
  INITIAL_UPCOMING_APPOINTMENTS,
} from '../data/colleagueData';

const SESSION_KEY = 'panah_colleague_session';
const PROFILES_KEY = 'panah_colleague_profiles';
const REVIEWS_KEY = 'panah_colleague_reviews';
const HISTORY_KEY = 'panah_colleague_history';
const APPOINTMENTS_KEY = 'panah_colleague_appointments';

// Helper to initialize or load stored data
export function getStoredProfiles(): Record<string, ColleagueProfile> {
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  localStorage.setItem(PROFILES_KEY, JSON.stringify(DEFAULT_COLLEAGUES));
  return DEFAULT_COLLEAGUES;
}

export function getStoredReviews(username: string): ReviewItem[] {
  try {
    const raw = localStorage.getItem(REVIEWS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed[username]) return parsed[username];
    }
  } catch {
    // fallback
  }
  return INITIAL_REVIEWS[username] || [];
}

export function getStoredHistory(username: string): ClientHistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed[username]) return parsed[username];
    }
  } catch {
    // fallback
  }
  return INITIAL_CLIENT_HISTORY[username] || [];
}

export function getStoredAppointments(username: string): UpcomingAppointment[] {
  try {
    const raw = localStorage.getItem(APPOINTMENTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed[username]) return parsed[username];
    }
  } catch {
    // fallback
  }
  return INITIAL_UPCOMING_APPOINTMENTS[username] || [];
}

// Session Management
export function getCurrentColleagueSession(): ColleagueProfile | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const sessionData = JSON.parse(raw);
    const profiles = getStoredProfiles();
    return profiles[sessionData.username] || sessionData;
  } catch {
    return null;
  }
}

export function loginColleague(username: string, password?: string): ColleagueProfile | null {
  const cleanUsername = username.trim().toLowerCase();
  const profiles = getStoredProfiles();

  // If match found in default profiles
  if (profiles[cleanUsername]) {
    const profile = profiles[cleanUsername];
    localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
    return profile;
  }

  // Generic fallback profile if username not found
  const newProfile: ColleagueProfile = {
    id: `psych-${Date.now()}`,
    username: cleanUsername,
    fullName: `روانشناس ${cleanUsername}`,
    title: 'متخصص روان‌شناسی بالینی و مشاوره خانواده',
    age: 36,
    avatarUrl: 'https://images.unsplash.com/photo-1594824813566-818a4d4554b2?auto=format&fit=crop&q=80&w=400',
    degree: 'دکتری تخصصی روان‌شناسی بالینی',
    university: 'دانشگاه علوم پزشکی تهران',
    medicalCouncilNumber: `ن-${Math.floor(10000 + Math.random() * 90000)}`,
    yearsOfExperience: 8,
    rating: 4.9,
    reviewCount: 45,
    specialties: ['مشاوره فردی', 'درمان اضطراب', 'زوج درمانی'],
    bio: 'درمانگر بالینی با رویکرد شناختی-رفتاری و طرح‌واره درمانی.',
    officeAddress: 'تهران، خیابان شریعتی، بالاتر از پل رومی، پلاک ۴۲۰',
    phone: '021-22001122',
    email: `${cleanUsername}@panah.psych`,
  };

  profiles[cleanUsername] = newProfile;
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  localStorage.setItem(SESSION_KEY, JSON.stringify(newProfile));
  return newProfile;
}

export function logoutColleague(): void {
  localStorage.removeItem(SESSION_KEY);
}

// Profile updates
export function updateColleagueProfile(username: string, updates: Partial<ColleagueProfile>): ColleagueProfile {
  const profiles = getStoredProfiles();
  const current = profiles[username] || getCurrentColleagueSession();
  if (!current) throw new Error('Profile not found');

  const updated = { ...current, ...updates };
  profiles[username] = updated;
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));

  const session = getCurrentColleagueSession();
  if (session && session.username === username) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
  }

  return updated;
}

// Appointments updates
export function updateAppointmentStatus(
  username: string,
  appointmentId: string,
  status: 'confirmed' | 'pending'
): UpcomingAppointment[] {
  const appointments = getStoredAppointments(username);
  const updated = appointments.map((app) =>
    app.id === appointmentId ? { ...app, status } : app
  );

  const raw = localStorage.getItem(APPOINTMENTS_KEY) || '{}';
  const all = JSON.parse(raw);
  all[username] = updated;
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(all));

  return updated;
}

export function saveAppointmentNotes(
  username: string,
  appointmentId: string,
  notes: string
): UpcomingAppointment[] {
  const appointments = getStoredAppointments(username);
  const updated = appointments.map((app) =>
    app.id === appointmentId ? { ...app, notes } : app
  );

  const raw = localStorage.getItem(APPOINTMENTS_KEY) || '{}';
  const all = JSON.parse(raw);
  all[username] = updated;
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(all));

  return updated;
}

export function addReviewResponse(
  username: string,
  reviewId: string,
  response: string
): ReviewItem[] {
  const reviews = getStoredReviews(username);
  const updated = reviews.map((rev) =>
    rev.id === reviewId ? { ...rev, response } : rev
  );

  const raw = localStorage.getItem(REVIEWS_KEY) || '{}';
  const all = JSON.parse(raw);
  all[username] = updated;
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(all));

  return updated;
}
