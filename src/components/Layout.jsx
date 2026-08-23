import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout({ onLogout }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  // የጎን ሜኑ (Sidebar) ላይ የሚኖሩት መደበኛ አስተዳደራዊ ገጾች ብቻ ናቸው
  const navItems = [ 
    { label: 'Dashboard', path: '/', icon: '👥' },
    { label: 'Teacher', path: '/Teacher', icon: '📚' },
    { label: 'Employe', path: '/Employe', icon: 'ℹ️' },
    { label: 'History', path: '/History', icon: '🎓' },
    { label: 'Other', path: '/Other', icon: '📊' },
    { label: 'Help', path: '/help', icon: '👥' },
    { label: 'Comment', path: '/Comment', icon: '👥' },
  ];

  return (
    <div style={styles.pageContainer}>
      {/* 1. TOP NAVBAR (እዚህ ላይ Home Page ሊንክ ይኖረዋል) */}
      <Navbar onLogout={onLogout} />
      
      {/* 2. MAIN BODY WRAPPER */}
      <div style={styles.bodyWrapper}>
        
        {/* VERTICAL SIDEBAR */}
        <aside style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            <span style={styles.sidebarTitle}>Admin Menu</span>
          </div>
          <nav style={styles.navStack}>
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    ...styles.link,
                    backgroundColor: active ? '#a855f7' : 'transparent',
                    color: active ? '#ffffff' : '#cbd5e1',
                    borderLeft: active ? '4px solid #c084fc' : '4px solid transparent',
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div style={styles.logoutWrapper}>
            <button onClick={onLogout} style={styles.logoutButton}>
              <span style={{ fontSize: '16px' }}>🚪</span>
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        {/* 3. DYNAMIC CONTENT AREA */}
        <main style={styles.mainContent}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#edf913',
    color: '#ffffff',
    fontFamily: 'sans-serif',
    overflowX: 'hidden',
  },
  bodyWrapper: {
    display: 'flex',
    flex: 1,
    width: '100%',
    minHeight: 'calc(100vh - 70px)',
  },
  sidebar: {
    width: '240px',
    minWidth: '240px',
    backgroundColor: '#b54141',
    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '24px 16px',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    justifyContent: 'space-between',
  },
  sidebarHeader: {
    paddingBottom: '12px',
    marginBottom: '16px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  sidebarTitle: {
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '1px',
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  navStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1,
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 14px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box',
  },
  logoutWrapper: {
    paddingTop: '16px',
    marginTop: 'auto',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    padding: '10px 14px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    backgroundColor: '#ee0707',
    color: '#ffffff',
    border: 'none',
    cursor: 'pointer',
  },
  mainContent: {
    flex: 1,
    padding: '24px',
    boxSizing: 'border-box',
    overflowY: 'auto',
    backgroundColor: '#4330bb',
  },
};