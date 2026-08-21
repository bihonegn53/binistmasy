import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';

function Navbar() {
  const location = useLocation();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Courses', path: '/courses' },
    { label: 'About', path: '/about' },
    { label: 'studentdata', path: '/ContinuousAssessmentPage' },
    { label: 'Student List', path: '/studentlist' },
     { label: 'AssessmentTable', path: '/AssessmentTable' },
  ];
  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        {/* Logo Section */}
        <Link to="/" style={styles.logoLink}>
          <div style={styles.logoImageWrapper}>
          <img 
              src="/congra.jpg" 
              alt="logo" 
              style={styles.heroImg} 
            />
          </div>
          <div style={styles.logoTextGroup}>
            <span style={styles.logoTitle}>Student</span>
            <span style={styles.logoSubtitle}>ACADEMY</span>
          </div>
        </Link>

        {/* Navigation Items */}
        <ul style={styles.navList}>
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            const isHovered = hoveredIndex === index;

            return (
              <li key={index} style={{ listStyle: 'none' }}>
                <Link
                  to={item.path}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    ...styles.navLink,
                    color: isActive ? '#a855f7' : isHovered ? '#ffffff' : '#cbd5e1',
                    backgroundColor: isActive
                      ? 'rgba(168, 85, 247, 0.15)'
                      : isHovered
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'transparent',
                    border: isActive
                      ? '1px solid rgba(168, 85, 247, 0.3)'
                      : '1px solid transparent',
                  }}
                >
                  {item.label}
                  {/* Subtle active indicator dot */}
                  {isActive && <span style={styles.activeDot} />}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

// Inline styles for modern UI/UX Design
const styles = {
  navbar: {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    background: 'linear-gradient(135deg, #f9f9f8 0%, #1515e1b5 100%)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    padding: '12px 32px',
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textDecoration: 'none',
  },
  logoImageWrapper: {
    width: '42px',
    height: '42px',
    borderRadius: '2px',
    background: 'linear-gradient(135deg, #a855f7, #6366f1)',
    padding: '2px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 15px rgba(168, 85, 247, 0.4)',
  },
  logoImg: {
    width: '10%',
    height: '10%',
    objectFit: 'contain',
    borderRadius: '8px',
  },
  logoTextGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  logoTitle: {
    fontSize: '18',
    fontWeight: '800',
    letterSpacing: '0.8px',
    color: '#f70e0e',
    lineHeight: '1.1',
  },
  logoSubtitle: {
    fontSize: '15',
    fontWeight: '700',
    letterSpacing: '2px',
    color: '#09040f',
    lineHeight: '1.2',
  },
  navList: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    margin: 0,
    padding: 0,
  },
  navLink: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    textDecoration: 'none',
    transition: 'all 0.25s ease-in-out',
  },
  activeDot: {
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    backgroundColor: '#c084fc',
    boxShadow: '0 0 8px #c084fc',
  },
};

export default Navbar;