// pages/StudentForm.jsx — used for both Add and Edit

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchStudent, createStudent, updateStudent } from '../utils/api';
import { PageHeader, Button, Input, Select, Card, Spinner } from '../components/UI';
import styles from './StudentForm.module.css';

const COURSES = [
  'Computer Science', 'Data Science', 'Cybersecurity',
  'AI & ML', 'Web Development', 'Cloud Computing',
  'Software Engineering', 'Information Technology',
];

const GRADES = ['A+', 'A', 'B+', 'B', 'C', 'D', 'F'];
const YEARS  = [1, 2, 3, 4];

const EMPTY = { name: '', email: '', phone: '', course: '', year: '' };

function validate(form) {
  const errs = {};
  if (!form.name.trim())   errs.name   = 'Name is required';
  if (!form.email.trim())  errs.email  = 'Email is required';
  else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
  if (!form.phone.trim())  errs.phone  = 'Phone is required';
  if (!form.course)        errs.course = 'Select a course';
  if (!form.grade)         errs.grade  = 'Select a grade';
  if (!form.year)          errs.year   = 'Select a year';
  return errs;
}

export default function StudentForm() {
  const { id }    = useParams();
  const isEdit    = Boolean(id);
  const navigate  = useNavigate();

  const [form,    setForm]    = useState(EMPTY);
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(isEdit);
  const [saving,  setSaving]  = useState(false);
  const [toast,   setToast]   = useState('');

  useEffect(() => {
    if (isEdit) {
      fetchStudent(id)
        .then(data => { setForm(data); setLoading(false); })
        .catch(() => navigate('/students'));
    }
  }, [id]);

  function handle(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(e => ({ ...e, [name]: '' }));
  }

  async function submit(e) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    try {
      if (isEdit) {
        await updateStudent(id, form);
        showToast('Student updated successfully!');
      } else {
        await createStudent(form);
        showToast('Student added successfully!');
        setForm(EMPTY);
      }
      setTimeout(() => navigate('/students'), 1200);
    } catch (err) {
      showToast('Something went wrong. Try again.');
    } finally {
      setSaving(false);
    }
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  if (loading) return <Spinner />;

  return (
    <div>
      <PageHeader
        title={isEdit ? 'Edit Student' : 'Add Student'}
        subtitle={isEdit ? `Editing record for ${form.name}` : 'Fill in the details to enroll a new student'}
      />

      {toast && (
        <div className={`${styles.toast} ${toast.includes('success') ? styles.toastOk : styles.toastErr}`}>
          {toast.includes('success') ? '✓' : '⚠'} {toast}
        </div>
      )}

      <Card className={styles.formCard}>
        <form onSubmit={submit} noValidate>
          <div className={styles.grid}>
            {/* Name */}
            <div className={styles.span2}>
              <Input
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handle}
                error={errors.name}
                placeholder="e.g. Aarav Mehta"
                icon="👤"
              />
            </div>

            {/* Email */}
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={form.email}
              onChange={handle}
              error={errors.email}
              placeholder="student@example.com"
              icon="✉"
            />

            {/* Phone */}
            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handle}
              error={errors.phone}
              placeholder="9876543210"
              icon="📱"
            />

            {/* Course */}
            <Select
              label="Course"
              name="course"
              value={form.course}
              onChange={handle}
              error={errors.course}
            >
              <option value="">-- Select course --</option>
              {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>

            {/* Grade */}
            <Select
              label="Grade"
              name="grade"
              value={form.grade}
              onChange={handle}
              error={errors.grade}
            >
              <option value="">-- Select grade --</option>
              {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
            </Select>

            {/* Year */}
            <Select
              label="Year"
              name="year"
              value={form.year}
              onChange={handle}
              error={errors.year}
            >
              <option value="">-- Select year --</option>
              {YEARS.map(y => <option key={y} value={y}>Year {y}</option>)}
            </Select>
          </div>

          <div className={styles.formActions}>
            <Button type="button" variant="ghost" onClick={() => navigate('/students')}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {isEdit ? '✓ Save Changes' : '+ Add Student'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
