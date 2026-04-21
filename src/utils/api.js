// utils/api.js — Axios instance + mock student CRUD

import axios from 'axios';
import { getToken, removeToken } from './auth';

/* ─── Axios instance ─────────────────────────────────────── */
const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com', // real endpoint base
  timeout: 8000,
});

// Attach JWT to every request
api.interceptors.request.use(config => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;

/* ─── Mock student store (localStorage) ─────────────────── */
const STUDENTS_KEY = 'sp_students';

const SEED_STUDENTS = [
  { id: 1, name: 'Aarav Mehta',     email: 'aarav@demo.com',   course: 'Computer Science', grade: 'A', year: 3, phone: '9876543210', avatar: 'AM' },
  { id: 2, name: 'Priya Sharma',    email: 'priya@demo.com',   course: 'Data Science',     grade: 'A+', year: 2, phone: '9812345678', avatar: 'PS' },
  { id: 3, name: 'Rohan Verma',     email: 'rohan@demo.com',   course: 'Cybersecurity',    grade: 'B+', year: 4, phone: '9823456789', avatar: 'RV' },
  { id: 4, name: 'Ananya Joshi',    email: 'ananya@demo.com',  course: 'AI & ML',          grade: 'A',  year: 1, phone: '9834567890', avatar: 'AJ' },
  { id: 5, name: 'Karan Patel',     email: 'karan@demo.com',   course: 'Web Development',  grade: 'B',  year: 2, phone: '9845678901', avatar: 'KP' },
];

function loadStudents() {
  try {
    const raw = localStorage.getItem(STUDENTS_KEY);
    return raw ? JSON.parse(raw) : SEED_STUDENTS;
  } catch {
    return SEED_STUDENTS;
  }
}

function persistStudents(students) {
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
}

function delay(ms = 350) {
  return new Promise(r => setTimeout(r, ms));
}

/* ─── CRUD ──────────────────────────────────────────────── */
export async function fetchStudents() {
  await delay();
  return loadStudents();
}

export async function fetchStudent(id) {
  await delay();
  const student = loadStudents().find(s => s.id === Number(id));
  if (!student) throw new Error('Student not found');
  return student;
}

export async function createStudent(data) {
  await delay();
  const students = loadStudents();
  const newId = students.length ? Math.max(...students.map(s => s.id)) + 1 : 1;
  const initials = data.name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase();
  const newStudent = { ...data, id: newId, avatar: initials };
  students.push(newStudent);
  persistStudents(students);
  return newStudent;
}

export async function updateStudent(id, data) {
  await delay();
  const students = loadStudents();
  const idx = students.findIndex(s => s.id === Number(id));
  if (idx === -1) throw new Error('Student not found');
  const initials = data.name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase();
  students[idx] = { ...students[idx], ...data, avatar: initials };
  persistStudents(students);
  return students[idx];
}

export async function deleteStudent(id) {
  await delay();
  const students = loadStudents().filter(s => s.id !== Number(id));
  persistStudents(students);
  return true;
}

/* ─── Mock auth ─────────────────────────────────────────── */
const MOCK_USERS = [
  { id: 'u1', email: 'admin@portal.com', password: 'admin123', name: 'Admin User', role: 'admin' },
  { id: 'u2', email: 'teacher@portal.com', password: 'teach123', name: 'Dr. Priya', role: 'teacher' },
];

export async function loginUser(email, password) {
  await delay(600);

  if (!email || !password) {
    throw new Error('Invalid credentials');
  }

  return {
    id: Date.now(),
    email,
    name: email.split('@')[0],
    role: 'student'
  };
}    