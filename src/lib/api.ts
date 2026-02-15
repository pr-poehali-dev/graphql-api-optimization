const AUTH_URL = "https://functions.poehali.dev/f409c555-3e6e-4f6e-88da-7456583ddc0c";
const OLYMPIADS_URL = "https://functions.poehali.dev/e68d4956-bf0b-4581-81df-1bfd810404c4";

function getToken(): string | null {
  return localStorage.getItem("token");
}

function setToken(token: string) {
  localStorage.setItem("token", token);
}

function removeToken() {
  localStorage.removeItem("token");
}

async function request<T = unknown>(
  baseUrl: string,
  action: string,
  options: {
    method?: string;
    body?: unknown;
    params?: Record<string, string>;
  } = {}
): Promise<T> {
  const { method = "POST", body, params = {} } = options;

  const url = new URL(baseUrl);
  url.searchParams.set("action", action);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || "Request failed");
  }

  return data as T;
}

// Auth
export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "student" | "teacher";
  grade?: number;
  subject?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: "student" | "teacher" | "admin";
  grade?: number;
  subject?: string;
}

export async function register(data: RegisterData): Promise<LoginResponse> {
  const result = await request<LoginResponse>(AUTH_URL, "register", {
    body: {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password: data.password,
      role: data.role,
      grade: data.grade,
      subject: data.subject,
    },
  });
  if (result.token) {
    setToken(result.token);
  }
  return result;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const result = await request<LoginResponse>(AUTH_URL, "login", {
    body: { email, password },
  });
  if (result.token) {
    setToken(result.token);
  }
  return result;
}

export async function getMe(): Promise<User> {
  const res = await request<{ user: User }>(AUTH_URL, "me", { method: "GET" });
  return res.user;
}

export function logout() {
  removeToken();
}

// Olympiads
export interface Olympiad {
  id: number;
  title: string;
  subject: string;
  level: "school" | "municipal" | "regional" | "national";
  event_date: string;
  description?: string;
  is_approved?: boolean;
  created_by?: number;
  created_by_name?: string;
  created_at?: string;
}

export interface OlympiadResult {
  id: number;
  olympiad_id: number;
  student_id: number;
  place: number;
  year: number;
  olympiad_title?: string;
  subject?: string;
  level?: string;
  event_date?: string;
}

export interface StudentStats {
  total: number;
  wins: number;
  prizes: number;
}

export async function listOlympiads(params?: Record<string, string>): Promise<Olympiad[]> {
  const res = await request<{ olympiads: Olympiad[] }>(OLYMPIADS_URL, "list", { method: "GET", params });
  return res.olympiads;
}

export async function createOlympiad(data: {
  title: string;
  subject: string;
  level: string;
  event_date: string;
  description?: string;
}): Promise<{ id: number; message: string }> {
  return request(OLYMPIADS_URL, "create", { body: data });
}

export async function addResult(data: {
  student_id: number;
  olympiad_id: number;
  place: number;
  year: number;
}): Promise<{ id: number; message: string }> {
  return request(OLYMPIADS_URL, "result", { body: data });
}

export async function getMyResults(studentId?: number): Promise<OlympiadResult[]> {
  const params: Record<string, string> = {};
  if (studentId) params.student_id = String(studentId);
  const res = await request<{ results: OlympiadResult[] }>(OLYMPIADS_URL, "my-results", { method: "GET", params });
  return res.results;
}

export async function getStats(studentId?: number): Promise<StudentStats> {
  const params: Record<string, string> = {};
  if (studentId) params.student_id = String(studentId);
  const res = await request<{ stats: StudentStats }>(OLYMPIADS_URL, "stats", { method: "GET", params });
  return res.stats;
}

export async function listStudents(): Promise<User[]> {
  const res = await request<{ students: User[] }>(OLYMPIADS_URL, "students", { method: "GET" });
  return res.students;
}

export async function approveOlympiad(id: number): Promise<{ message: string }> {
  return request(OLYMPIADS_URL, "approve", { body: { olympiad_id: id } });
}

export default {
  register,
  login,
  getMe,
  logout,
  listOlympiads,
  createOlympiad,
  addResult,
  getMyResults,
  getStats,
  listStudents,
  approveOlympiad,
};