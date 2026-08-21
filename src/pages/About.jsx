import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  const features = [
    {
      icon: '📊',
      title: 'Continuous Assessment Engine',
      description: 'Streamlines student evaluation with real-time grade tracking, coursework assessments, and performance metrics across departments.',
    },
    {
      icon: '👨‍🎓',
      title: 'Centralized Student Directory',
      description: 'Provides a secure and searchable student list, making record management and profile access seamless for faculty and administration.',
    },
    {
      icon: '🏫',
      title: 'Multi-Department Curriculum',
      description: 'Organizes academic tracks across diverse fields including Computer Science, Information Technology, Accounting, and Management.',
    },
    {
      icon: '⚡',
      title: 'Modern & Responsive UX',
      description: 'Engineered with a fast, single-page React architecture, ensuring an intuitive user interface across desktop and mobile devices.',
    },
  ];

  const techStack = [
    'React.js (SPA Architecture)',
    'React Router DOM',
    'Component-driven UI Design',
    'Dynamic State Management',
  ];

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        {/* Header Section */}
        <header style={styles.header}>
          <span style={styles.badge}>Platform Overview</span>
          <h1 style={styles.title}>About Student Academy</h1>
          <p style={styles.subtitle}>
            An integrated academic management system designed to simplify continuous assessment, course tracking, and student data administration.
          </p>
        </header>

        {/* System Mission & Purpose with School Image */}
        <section style={styles.missionCard}>
          <div style={styles.missionGrid}>
            <div style={styles.missionContent}>
              <h2 style={styles.sectionTitle}>Project Mission & Purpose</h2>
              <p style={styles.paragraph}>
                <strong>Student Academy</strong> was built to bridge the gap between traditional academic record-keeping and modern digital solutions. By consolidating continuous student assessments, departmental course offerings, and student records into a single platform, educators can focus more on teaching while students gain clear visibility into their academic progress.
              </p>
              <p style={styles.paragraph}>
                Whether evaluating continuous performance in the classroom or navigating multi-departmental curriculums, our portal ensures accuracy, transparency, and ease of use.
              </p>
            </div>
            
            {/* 🏫 Attractive School/Campus Image Added Here */}
            <div style={styles.imageWrapper}>
              <img
                src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1000&q=80"
                alt="Student Academy Campus"
                style={styles.schoolImage}
              />
            </div>
          </div>
        </section>

        {/* Key Features Grid */}
        <section style={styles.section}>
          <h2 style={styles.centeredSectionTitle}>Core System Capabilities</h2>
          <div style={styles.grid}>
            {features.map((item, index) => (
              <div key={index} style={styles.featureCard}>
                <div style={styles.iconWrapper}>{item.icon}</div>
                <h3 style={styles.featureTitle}>{item.title}</h3>
                <p style={styles.featureDescription}>{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack & System Architecture */}
        <section style={styles.techSection}>
          <div style={styles.techContent}>
            <h2 style={styles.sectionTitle}>Built with Modern Technology</h2>
            <p style={styles.paragraph}>
              The application leverages modern web technologies to ensure optimal performance, accessible navigation, and client-side routing speed.
            </p>
            <div style={styles.pillsContainer}>
              {techStack.map((tech, index) => (
                <span key={index} style={styles.techPill}>
                  ⚡ {tech}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Footer */}
        <section style={styles.ctaSection}>
          <h2 style={{ ...styles.sectionTitle, marginBottom: '12px' }}>Explore the Platform</h2>
          <p style={styles.paragraph}>
            Check out our academic departments or jump straight to student management records.
          </p>
          <div style={styles.ctaButtonGroup}>
            <Link to="/courses" style={styles.primaryBtn}>
              Browse Courses
            </Link>
            <Link to="/ContinuousAssessmentPage" style={styles.secondaryBtn}>
              Student Assessment Data
            </Link>
          </div>
        </section>
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
    maxWidth: '1100px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: '52px',
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
    fontSize: '40px',
    fontWeight: '800',
    color: '#ffffff',
    margin: '0 0 16px 0',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '18px',
    color: '#94a3b8',
    maxWidth: '700px',
    margin: '0 auto',
    lineHeight: '1.6',
  },
  missionCard: {
    backgroundColor: '#111827',
    borderRadius: '16px',
    padding: '36px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
    marginBottom: '48px',
    background: 'linear-gradient(145deg, #111827 0%, #1e1b4b 100%)',
  },
  missionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '32px',
    alignItems: 'center',
  },
  missionContent: {
    flex: '1',
  },
  imageWrapper: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: '12px',
  },
  schoolImage: {
    width: '100%',
    height: '260px',
    objectFit: 'cover',
    display: 'block',
    borderRadius: '12px',
    border: '1px solid rgba(168, 85, 247, 0.25)',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
  },
  section: {
    marginBottom: '56px',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0 0 16px 0',
  },
  centeredSectionTitle: {
    fontSize: '26px',
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: '36px',
  },
  paragraph: {
    fontSize: '15px',
    color: '#cbd5e1',
    lineHeight: '1.7',
    margin: '0 0 16px 0',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '24px',
  },
  featureCard: {
    backgroundColor: '#1e293b',
    borderRadius: '14px',
    padding: '28px 24px',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    transition: 'transform 0.2s ease',
  },
  iconWrapper: {
    fontSize: '32px',
    marginBottom: '16px',
    width: '50px',
    height: '50px',
    borderRadius: '12px',
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justify: 'center',
  },
  featureTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0 0 10px 0',
  },
  featureDescription: {
    fontSize: '14px',
    color: '#94a3b8',
    lineHeight: '1.5',
    margin: 0,
  },
  techSection: {
    backgroundColor: '#111827',
    borderRadius: '16px',
    padding: '36px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    marginBottom: '48px',
  },
  pillsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    marginTop: '20px',
  },
  techPill: {
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#c084fc',
    backgroundColor: 'rgba(168, 85, 247, 0.12)',
    border: '1px solid rgba(168, 85, 247, 0.25)',
  },
  ctaSection: {
    textAlign: 'center',
    padding: '40px 20px',
    backgroundColor: '#1e293b',
    borderRadius: '16px',
    border: '1px solid rgba(168, 85, 247, 0.3)',
    boxShadow: '0 0 20px rgba(168, 85, 247, 0.15)',
  },
  ctaButtonGroup: {
    display: 'flex',
    justify: 'center',
    gap: '16px',
    marginTop: '24px',
    flexWrap: 'wrap',
  },
  primaryBtn: {
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '700',
    color: '#ffffff',
    backgroundColor: '#8b5cf6',
    textDecoration: 'none',
    boxShadow: '0 0 12px rgba(168, 85, 247, 0.4)',
    transition: 'all 0.2s ease',
  },
  secondaryBtn: {
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '700',
    color: '#cbd5e1',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
  },
};