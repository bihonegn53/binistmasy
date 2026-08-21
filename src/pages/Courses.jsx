import React, { useState } from 'react';

// Data structure for Departments and Courses with Images
const departmentsData = [
  {
    id: 'cs',
    name: 'Computer Science',
    icon: '💻',
    bannerImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    description: 'Master software engineering, algorithms, artificial intelligence, and modern system design.',
    courses: [
      { 
        code: 'CS101', 
        title: 'Data Structures & Algorithms', 
        duration: '12 Weeks', 
        credits: '4 Credits', 
        level: 'Beginner',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80' 
      },
      { 
        code: 'CS204', 
        title: 'Full-Stack Web Development', 
        duration: '16 Weeks', 
        credits: '4 Credits', 
        level: 'Intermediate',
        image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=400&q=80' 
      },
      { 
        code: 'CS310', 
        title: 'Artificial Intelligence & Machine Learning', 
        duration: '14 Weeks', 
        credits: '3 Credits', 
        level: 'Advanced',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=400&q=80' 
      },
    ],
  },
  {
    id: 'it',
    name: 'Information Technology',
    icon: '🌐',
    bannerImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    description: 'Learn cloud computing, cybersecurity, system administration, and enterprise networking.',
    courses: [
      { 
        code: 'IT102', 
        title: 'Network Fundamentals & Security', 
        duration: '10 Weeks', 
        credits: '3 Credits', 
        level: 'Beginner',
        image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=400&q=80' 
      },
      { 
        code: 'IT220', 
        title: 'Cloud Infrastructure & DevOps', 
        duration: '12 Weeks', 
        credits: '4 Credits', 
        level: 'Intermediate',
        image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=400&q=80' 
      },
      { 
        code: 'IT305', 
        title: 'Database Administration (SQL & NoSQL)', 
        duration: '10 Weeks', 
        credits: '3 Credits', 
        level: 'Intermediate',
        image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=400&q=80' 
      },
    ],
  },
  {
    id: 'data-science',
    name: 'Data Science & Big Data',
    icon: '📊',
    bannerImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    description: 'Extract actionable insights from massive datasets using Python, data visualization, and predictive modeling.',
    courses: [
      { 
        code: 'DS101', 
        title: 'Python for Data Analytics', 
        duration: '10 Weeks', 
        credits: '3 Credits', 
        level: 'Beginner',
        image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80' 
      },
      { 
        code: 'DS210', 
        title: 'Applied Statistics & Visualizations', 
        duration: '12 Weeks', 
        credits: '4 Credits', 
        level: 'Intermediate',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80' 
      },
      { 
        code: 'DS350', 
        title: 'Deep Learning & Neural Networks', 
        duration: '14 Weeks', 
        credits: '4 Credits', 
        level: 'Advanced',
        image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=400&q=80' 
      },
    ],
  },
  {
    id: 'design',
    name: 'Graphic & UI/UX Design',
    icon: '🎨',
    bannerImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80',
    description: 'Design intuitive digital experiences, design systems, visual branding, and interactive prototypes.',
    courses: [
      { 
        code: 'DES101', 
        title: 'User Interface (UI) Fundamentals', 
        duration: '8 Weeks', 
        credits: '3 Credits', 
        level: 'Beginner',
        image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=400&q=80' 
      },
      { 
        code: 'DES205', 
        title: 'UX Research & Wireframing', 
        duration: '12 Weeks', 
        credits: '4 Credits', 
        level: 'Intermediate',
        image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=400&q=80' 
      },
      { 
        code: 'DES320', 
        title: 'Design Systems & Micro-Animations', 
        duration: '10 Weeks', 
        credits: '3 Credits', 
        level: 'Advanced',
        image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=400&q=80' 
      },
    ],
  },
  {
    id: 'engineering',
    name: 'Electrical & Computer Engineering',
    icon: '⚡',
    bannerImage: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=800&q=80',
    description: 'Explore embedded systems, IoT devices, microelectronics, and digital signal processing.',
    courses: [
      { 
        code: 'ECE101', 
        title: 'Circuit Theory & Electronics', 
        duration: '12 Weeks', 
        credits: '4 Credits', 
        level: 'Beginner',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80' 
      },
      { 
        code: 'ECE240', 
        title: 'Embedded Systems & Microcontrollers', 
        duration: '14 Weeks', 
        credits: '4 Credits', 
        level: 'Intermediate',
        image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=400&q=80' 
      },
      { 
        code: 'ECE330', 
        title: 'Internet of Things (IoT) Engineering', 
        duration: '12 Weeks', 
        credits: '3 Credits', 
        level: 'Advanced',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80' 
      },
    ],
  },
  {
    id: 'accounting',
    name: 'Accounting & Finance',
    icon: '📈',
    bannerImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    description: 'Build expertise in financial reporting, corporate auditing, taxation, and cost analysis.',
    courses: [
      { 
        code: 'ACC101', 
        title: 'Principles of Financial Accounting', 
        duration: '12 Weeks', 
        credits: '3 Credits', 
        level: 'Beginner',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80' 
      },
      { 
        code: 'ACC215', 
        title: 'Managerial Accounting & Costing', 
        duration: '10 Weeks', 
        credits: '3 Credits', 
        level: 'Intermediate',
        image: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=400&q=80' 
      },
      { 
        code: 'ACC340', 
        title: 'Auditing & Corporate Taxation', 
        duration: '12 Weeks', 
        credits: '4 Credits', 
        level: 'Advanced',
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80' 
      },
    ],
  },
  {
    id: 'management',
    name: 'Management & Business',
    icon: '🏛️',
    bannerImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
    description: 'Develop executive leadership, operational efficiency, human resource strategy, and marketing skills.',
    courses: [
      { 
        code: 'MGMT101', 
        title: 'Principles of Business Management', 
        duration: '10 Weeks', 
        credits: '3 Credits', 
        level: 'Beginner',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80' 
      },
      { 
        code: 'MGMT230', 
        title: 'Organizational Behavior & Leadership', 
        duration: '12 Weeks', 
        credits: '3 Credits', 
        level: 'Intermediate',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80' 
      },
      { 
        code: 'MGMT310', 
        title: 'Strategic Project Management', 
        duration: '12 Weeks', 
        credits: '4 Credits', 
        level: 'Advanced',
        image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=400&q=80' 
      },
    ],
  },
];

function Courses() {
  const [selectedDept, setSelectedDept] = useState('all');
  const [hoveredCourse, setHoveredCourse] = useState(null);

  const filteredDepartments = selectedDept === 'all'
    ? departmentsData
    : departmentsData.filter((dept) => dept.id === selectedDept);

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        {/* Header Section */}
        <header style={styles.header}>
          <span style={styles.badge}>Academic Programs</span>
          <h1 style={styles.title}>Our Departments & Courses</h1>
          <p style={styles.subtitle}>
            Explore industry-aligned academic tracks tailored for academic excellence and modern career growth.
          </p>
        </header>

        {/* Department Filter Tabs */}
        <div style={styles.filterContainer}>
          <button
            onClick={() => setSelectedDept('all')}
            style={{
              ...styles.filterBtn,
              ...(selectedDept === 'all' ? styles.filterBtnActive : {}),
            }}
          >
            All Departments
          </button>
          {departmentsData.map((dept) => (
            <button
              key={dept.id}
              onClick={() => setSelectedDept(dept.id)}
              style={{
                ...styles.filterBtn,
                ...(selectedDept === dept.id ? styles.filterBtnActive : {}),
              }}
            >
              <span style={{ marginRight: '6px' }}>{dept.icon}</span>
              {dept.name}
            </button>
          ))}
        </div>

        {/* Departments and Courses Display */}
        <div style={styles.deptStack}>
          {filteredDepartments.map((dept) => (
            <section key={dept.id} style={styles.deptSection}>
              {/* Department Short Image Banner */}
              <div style={{ ...styles.deptBanner, backgroundImage: `url(${dept.bannerImage})` }}>
                <div style={styles.deptBannerOverlay} />
                <div style={styles.deptHeaderContent}>
                  <div style={styles.deptIconWrapper}>{dept.icon}</div>
                  <div>
                    <h2 style={styles.deptTitle}>{dept.name}</h2>
                    <p style={styles.deptDescription}>{dept.description}</p>
                  </div>
                </div>
              </div>

              {/* Course Cards Grid */}
              <div style={styles.courseGrid}>
                {dept.courses.map((course, idx) => {
                  const courseKey = `${dept.id}-${idx}`;
                  const isHovered = hoveredCourse === courseKey;

                  return (
                    <div
                      key={courseKey}
                      onMouseEnter={() => setHoveredCourse(courseKey)}
                      onMouseLeave={() => setHoveredCourse(null)}
                      style={{
                        ...styles.courseCard,
                        ...(isHovered ? styles.courseCardHover : {}),
                      }}
                    >
                      {/* Short Course Image Thumbnail */}
                      <div style={styles.courseImgWrapper}>
                        <img 
                          src={course.image} 
                          alt={course.title} 
                          style={styles.courseImg} 
                        />
                      </div>

                      <div style={styles.cardContent}>
                        <div style={styles.cardTop}>
                          <span style={styles.courseCode}>{course.code}</span>
                          <span style={styles.courseLevel}>{course.level}</span>
                        </div>
                        <h3 style={styles.courseTitle}>{course.title}</h3>
                        <div style={styles.cardFooter}>
                          <span style={styles.metaItem}>⏱️ {course.duration}</span>
                          <span style={styles.metaItem}>🎓 {course.credits}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

// Inline Styles matching the Dark UI Theme
const styles = {
  pageWrapper: {
    minHeight: '100vh',
    backgroundColor: '#0b0f19',
    color: '#f8fafc',
    padding: '60px 24px',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: '48px',
  },
  badge: {
    display: 'inline-block',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    color: '#c084fc',
    backgroundColor: 'rgba(168, 85, 247, 0.12)',
    border: '1px solid rgba(168, 85, 247, 0.3)',
    marginBottom: '16px',
  },
  title: {
    fontSize: '38px',
    fontWeight: '800',
    color: '#ffffff',
    margin: '0 0 12px 0',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#94a3b8',
    maxWidth: '640px',
    margin: '0 auto',
    lineHeight: '1.6',
  },
  filterContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '48px',
  },
  filterBtn: {
    padding: '10px 20px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#cbd5e1',
    backgroundColor: '#1e293b',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    cursor: 'pointer',
    transition: 'all 0.25s ease-in-out',
  },
  filterBtnActive: {
    color: '#ffffff',
    backgroundColor: '#8b5cf6',
    border: '1px solid #a855f7',
    boxShadow: '0 0 16px rgba(168, 85, 247, 0.4)',
  },
  deptStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '48px',
  },
  deptSection: {
    backgroundColor: '#111827',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
    overflow: 'hidden',
  },
  deptBanner: {
    position: 'relative',
    height: '140px',
    borderRadius: '12px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    marginBottom: '28px',
    display: 'flex',
    alignItems: 'center',
    padding: '0 24px',
    overflow: 'hidden',
  },
  deptBannerOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
    backdropFilter: 'blur(3px)',
  },
  deptHeaderContent: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  deptIconWrapper: {
    width: '52px',
    height: '52px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #a855f7, #6366f1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    boxShadow: '0 0 15px rgba(168, 85, 247, 0.3)',
    flexShrink: 0,
  },
  deptTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0 0 4px 0',
  },
  deptDescription: {
    fontSize: '14px',
    color: '#cbd5e1',
    margin: 0,
    maxWdith: '800px',
  },
  courseGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
  },
  courseCard: {
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.25s ease-in-out',
    cursor: 'pointer',
  },
  courseCardHover: {
    transform: 'translateY(-4px)',
    border: '1px solid rgba(168, 85, 247, 0.4)',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.4), 0 0 12px rgba(168, 85, 247, 0.2)',
  },
  courseImgWrapper: {
    width: '100%',
    height: '120px',
    overflow: 'hidden',
    backgroundColor: '#0f172a',
  },
  courseImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  cardContent: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  courseCode: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#c084fc',
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    padding: '4px 10px',
    borderRadius: '6px',
  },
  courseLevel: {
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '600',
  },
  courseTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#f8fafc',
    margin: '0 0 20px 0',
    lineHeight: '1.4',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#94a3b8',
    paddingTop: '12px',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
  },
  metaItem: {
    fontWeight: '500',
  },
};

export default Courses;