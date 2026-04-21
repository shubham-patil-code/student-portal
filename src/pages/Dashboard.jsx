// pages/Dashboard.jsx

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchStudents } from '../utils/api';
import { decodeToken, getToken } from '../utils/auth';
import { PageHeader, Spinner, Card } from '../components/UI';
import styles from './Dashboard.module.css';

const GRADE_COLORS = { 'A+': 'success', 'A': 'success', 'B+': 'accent', 'B': 'accent', 'C': 'warning', 'F': 'danger' };

export default function Dashboard() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const tokenInfo = decodeToken(getToken());

  useEffect(() => {
    fetchStudents().then(data => {
      setStudents(data);
      setLoading(false);
    });
  }, []);

  const gradeCount = students.reduce((acc, s) => {
    acc[s.grade] = (acc[s.grade] || 0) + 1;
    return acc;
  }, {});

  const courses = [...new Set(students.map(s => s.course))].length;
  const topGrade = students.filter(s => s.grade === 'A' || s.grade === 'A+').length;

  const stats = [
    { label: 'Total Students', value: students.length, icon: '◎', color: 'accent' },
    { label: 'Courses',        value: courses,          icon: '📚', color: 'warning' },
    { label: 'Top Grades',     value: topGrade,         icon: '⭐', color: 'success' },
  ];

  if (loading) return <Spinner />;

  return (
    <div>
      <PageHeader
        className={styles.pageHeader}
        title={`Good day, ${user?.name?.split(' ')[0]} `}
        subtitle="Here's an overview of your student portal"
      />

      {/* JWT Info strip */}
      <div className={styles.tokenStrip}>
        <span className={styles.tokenDot} />
        <span className={styles.tokenLabel}>Active session</span>
        <span className={styles.tokenChip}>JWT</span>
        <span className={styles.tokenMeta}>
          Role: <b>{tokenInfo?.role}</b> 
           {/* ·  Expires: <b>{new Date(tokenInfo?.exp * 1000).toLocaleTimeString()}</b> */}
        </span>
      </div>

      {/* Stats */}
      <div className={styles.statsRow}>
        {stats.map(s => (
          <Card key={s.label} className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles['icon_' + s.color]}`}>{s.icon}</div>
            <div className={styles.statValue}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Recent students */}
      <Card className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>Recent Students</h2>
          <Link to="/students" className={styles.viewAll}>View all →</Link>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Student</th>
              <th>Course</th>
              <th>Year</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            {students.slice(0, 5).map((s, i) => (
              <tr key={s.id} style={{ animationDelay: `${i * 60}ms` }} className={styles.row}>
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
                  <span className={`${styles.grade} ${styles['grade_' + (GRADE_COLORS[s.grade] || 'default')]}`}>
                    {s.grade}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
