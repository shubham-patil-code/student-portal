// pages/Students.jsx

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchStudents, deleteStudent } from '../utils/api';
import { PageHeader, Button, Spinner, Card, ConfirmDialog } from '../components/UI';
import styles from './Students.module.css';

const GRADE_COLOR = { 'A+': 'success', A: 'success', 'B+': 'accent', B: 'accent', C: 'warning', F: 'danger' };

export default function Students() {
  const navigate = useNavigate();
  const [students,  setStudents]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState('');
  const [deleting,  setDeleting]  = useState(null); // id to delete
  const [confirm,   setConfirm]   = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const data = await fetchStudents();
    setStudents(data);
    setLoading(false);
  }

  function askDelete(id) {
    setDeleting(id);
    setConfirm(true);
  }

  async function handleDelete() {
    await deleteStudent(deleting);
    setStudents(s => s.filter(x => x.id !== deleting));
    setConfirm(false);
    setDeleting(null);
  }

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.course.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Spinner />;

  return (
    <div>
      <PageHeader
        title="Students"
        subtitle={`${students.length} enrolled students`}
        action={
          <Button onClick={() => navigate('/students/add')}>
            + Add Student
          </Button>
        }
      />

      {/* Search */}
      <div className={styles.searchRow}>
        <div className={styles.searchWrap}>
          <span className={styles.searchIco}>🔍</span>
          <input
            className={styles.searchInput}
            placeholder="Search by name, email or course…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className={styles.clearBtn} onClick={() => setSearch('')}>✕</button>
          )}
        </div>
        <span className={styles.count}>{filtered.length} results</span>
      </div>

      {filtered.length === 0 ? (
        <Card className={styles.empty}>
          <div className={styles.emptyIcon}>◎</div>
          <div className={styles.emptyText}>No students found</div>
          <div className={styles.emptySub}>Try a different search term</div>
        </Card>
      ) : (
        <Card className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Year</th>
                <th>Grade</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.id} style={{ animationDelay: `${i * 40}ms` }} className={styles.row}>
                  <td>
                    <div className={styles.studentCell}>
                      <div className={styles.avatar}>{s.avatar}</div>
                      <div>
                        <div className={styles.name}>{s.name}</div>
                        <div className={styles.email}>{s.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className={styles.course}>{s.course}</span></td>
                  <td><span className={styles.year}>Year {s.year}</span></td>
                  <td>
                    <span className={`${styles.grade} ${styles['g_' + (GRADE_COLOR[s.grade] || 'default')]}`}>
                      {s.grade}
                    </span>
                  </td>
                  <td><span className={styles.phone}>{s.phone}</span></td>
                  <td>
                    <div className={styles.actions}>
                      <Link to={`/students/edit/${s.id}`} className={styles.editBtn}>Edit</Link>
                      <button className={styles.deleteBtn} onClick={() => askDelete(s.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <ConfirmDialog
        open={confirm}
        message="Are you sure you want to delete this student? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => { setConfirm(false); setDeleting(null); }}
      />
    </div>
  );
}
