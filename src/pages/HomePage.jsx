import React, { useState } from 'react';
import './HomePage.css'; 

// Data: Core Curriculum (ምስሎቹ ከኦንላይን እንዲመጡ ተደርጓል)
const curriculumData = [
  {
    id: 'foundations',
    cardNumber: 'CARD 1',
    title: 'FOUNDATIONS',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=400&q=80',
    color: '#34d399',
    points: ['UX Research', 'Information Architecture', 'User Journeys'],
  },
  {
    id: 'interface-design',
    cardNumber: 'CARD 2',
    title: 'INTERFACE DESIGN',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=400&q=80',
    color: '#60a5fa',
    points: ['Wireframing & Prototyping', 'Visual Hierarchy', 'Design Systems'],
  },
  {
    id: 'advanced-practice',
    cardNumber: 'CARD 3',
    title: 'ADVANCED PRACTICE',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=400&q=80',
    color: '#a78bfa',
    points: ['Usability Testing', 'Interactive Micro-animations', 'Design Hand-off'],
  },
];

// Data: School Highlights & Stats
const schoolStats = [
  { label: 'Graduates Trained', value: '500+' },
  { label: 'Career Placement Rate', value: '94%' },
  { label: 'Real-World Projects Built', value: '120+' },
  { label: 'Industry Mentors', value: '15+' },
];

// Data: Featured Student Projects
const featuredProjects = [
  {
    title: 'Fintech Mobile Banking App',
    category: 'UI/UX Case Study',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    description: 'A simplified mobile banking experience focused on micro-investments and clear transaction breakdowns.',
    tags: ['Figma', 'User Research', 'Mobile App'],
  },
  {
    title: 'Healthcare Patient Dashboard',
    category: 'Web App & Design System',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    description: 'An accessible electronic health records dashboard enabling doctors to review patient vitals seamlessly.',
    tags: ['Design System', 'Accessibility (WCAG)', 'Dashboard'],
  },
  {
    title: 'Eco-Friendly E-Commerce Store',
    category: 'E-Commerce UX',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    description: 'An interactive shopping experience designed to highlight sustainable manufacturing supply chains.',
    tags: ['E-Commerce', 'Prototyping', 'User Testing'],
  },
];

// Reusable Sub-components
const CurriculumCard = ({ cardNumber, title, image, color, points, onApply }) => (
  <div className="curriculum-card">
    <div className="card-header" style={{ backgroundColor: color, position: 'relative', overflow: 'hidden' }}>
      <span className="card-number">{cardNumber}</span>
      <div className="card-image-container">
        <img 
          src={image} 
          alt={title} 
          style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', display: 'block', margin: '10px auto 0' }} 
        />
      </div>
    </div>
    <div className="card-content">
      <h3 className="card-title">{title}</h3>
      <ul className="card-points">
        {points.map((point, index) => (
          <li key={index}>• {point}</li>
        ))}
      </ul>
      <button className="card-apply-btn" onClick={() => onApply(title)}>
        Enroll in Track
      </button>
    </div>
  </div>
);

const ProjectCard = ({ title, category, image, description, tags }) => (
  <div className="project-card">
    <div className="project-image-wrapper">
      <img src={image} alt={title} className="project-img" />
      <span className="project-category">{category}</span>
    </div>
    <div className="project-info">
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="project-tags">
        {tags.map((tag, idx) => (
          <span key={idx} className="tag-badge">{tag}</span>
        ))}
      </div>
    </div>
  </div>
);

// Modal Component
const EnrollmentModal = ({ isOpen, onClose, selectedTrack }) => {
  const initialFormData = {
    fullName: '',
    email: '',
    phone: '',
    track: selectedTrack || 'FOUNDATIONS',
    experienceLevel: 'Beginner',
    message: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  React.useEffect(() => {
    if (selectedTrack) {
      setFormData((prev) => ({ ...prev, track: selectedTrack }));
    }
  }, [selectedTrack]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1200);
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setFormData(initialFormData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleResetAndClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={handleResetAndClose} aria-label="Close modal">
          &times;
        </button>

        {isSuccess ? (
          <div className="modal-success">
            <div className="success-icon">✓</div>
            <h2>Application Submitted!</h2>
            <p>
              Thank you, <strong>{formData.fullName}</strong>. Our admissions team will contact you at{' '}
              <strong>{formData.email}</strong> within 24 hours.
            </p>
            <button className="btn-primary" onClick={handleResetAndClose}>Done</button>
          </div>
        ) : (
          <>
            <h2 className="modal-title">Apply to ASE&BINI Academy</h2>
            <p className="modal-subtitle">Start your UI/UX Design journey today.</p>

            <form onSubmit={handleSubmit} className="enrollment-form">
              <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  placeholder="e.g. Abebe Bikila"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="student@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    placeholder="0953595426"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="track">Preferred Track</label>
                  <select id="track" name="track" value={formData.track} onChange={handleChange}>
                    <option value="FOUNDATIONS">Foundations (UX Research & IA)</option>
                    <option value="INTERFACE DESIGN">Interface Design (Prototyping & Systems)</option>
                    <option value="ADVANCED PRACTICE">Advanced Practice (Testing & Animation)</option>
                    <option value="FULL BOOTCAMP">Full UI/UX Bootcamp</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="experienceLevel">Design Experience</label>
                  <select id="experienceLevel" name="experienceLevel" value={formData.experienceLevel} onChange={handleChange}>
                    <option value="Beginner">Complete Beginner</option>
                    <option value="Intermediate">Self-Taught / Basic Knowledge</option>
                    <option value="Advanced">Professional / Switching Careers</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Why do you want to join? (Optional)</label>
                <textarea
                  id="message"
                  name="message"
                  rows="3"
                  placeholder="Tell us briefly about your goals..."
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="btn-primary submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState('');

  const handleOpenModal = (trackName = '') => {
    setSelectedTrack(trackName);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="homepage">
      <EnrollmentModal isOpen={isModalOpen} onClose={handleCloseModal} selectedTrack={selectedTrack} />

      {/* 1. Hero Section */}
      <header className="hero-section" style={{ backgroundColor: '#7422c5', padding: '70px 20px' }}>
        <div className="container hero-container" style={{ display: 'flex', alignItems: 'center', gap: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div className="hero-image-container" style={{ flex: '1.2' }}>
            <img 
              src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80" 
              alt="ASE&BINI School Campus" 
              style={{ width: '100%', height: '380px', objectFit: 'cover', borderRadius: '18px', display: 'block', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)' }} 
            />
          </div>

          <div className="hero-text-content" style={{ flex: '1', color: '#ffffff' }}>
            <h1 className="hero-title" style={{ marginTop: '10px', fontSize: '2.5rem', lineHeight: '1.2' }}>
              WELCOME TO ASE&BINI SCHOOL ACADEMY
            </h1>
            <p className="hero-subtitle" style={{ fontSize: '1.1rem', margin: '20px 0 30px', opacity: 0.9 }}>
              Master the skills that shape the digital future. Join our immersive, project-based curriculum led by industry practitioners.
            </p>
            <button className="btn-hero-cta" onClick={() => handleOpenModal()} style={{ background: '#fff', color: '#7422c5', padding: '12px 28px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              Apply Now
            </button>
          </div>
        </div>
      </header>

      {/* 2. About Our School Section */}
      <section className="about-school-section" style={{ padding: '60px 20px', backgroundColor: '#f9fafb' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
            <div className="about-text">
              <h2 className="section-title" style={{ textAlign: 'left', color: '#1f2937', fontSize: '2rem', marginBottom: '20px' }}>About ASE&BINI School</h2>
              <p style={{ fontSize: '1.05rem', lineHeight: '1.7', color: '#4b5563' }}>
                At <strong>ASE&BINI UI Designer Academy</strong>, we bridge the gap between creative curiosity and industry readiness. Founded by passionate product designers, our mission is to empower the next generation of visual thinkers, UX researchers, and interface specialists.
              </p>
              <p style={{ fontSize: '1.05rem', lineHeight: '1.7', color: '#4b5563', marginTop: '12px' }}>
                We prioritize hands-on learning through real-world client briefs, design sprints, and personalized mentorship. Whether you are stepping into UI design for the first time or leveling up your visual system workflows, our studio environment gives you the tools to succeed.
              </p>
            </div>
            <div className="about-image-wrapper">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" 
                alt="Students collaborating at ASE&BINI" 
                style={{ width: '100%', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
              />
            </div>
          </div>

          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginTop: '50px', textAlign: 'center' }}>
            {schoolStats.map((stat, idx) => (
              <div key={idx} className="stat-card" style={{ padding: '20px', background: '#ffffff', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize: '2rem', color: '#7422c5', margin: '0 0 5px 0' }}>{stat.value}</h3>
                <p style={{ color: '#6b7280', margin: 0, fontWeight: '500' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Core Curriculum Section */}
      <section className="curriculum-section" style={{ padding: '60px 20px' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 className="section-title" style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '40px', color: '#1f2937' }}>Core Learning Tracks</h2>
          <div className="curriculum-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {curriculumData.map((card, index) => (
              <CurriculumCard key={index} {...card} onApply={handleOpenModal} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Student Projects Section */}
      <section className="projects-section" style={{ padding: '60px 20px', backgroundColor: '#f3f4f6' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 className="section-title" style={{ textAlign: 'center', fontSize: '2rem', color: '#1f2937' }}>Student Portfolio Projects</h2>
          <p className="section-subtitle" style={{ textAlign: 'center', color: '#6b7280', marginBottom: '40px' }}>
            Explore actual work built by our students during their design studio modules.
          </p>
          <div className="projects-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {featuredProjects.map((project, idx) => (
              <ProjectCard key={idx} {...project} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Contact & CTA Section */}
      <section className="contact-section container" style={{ padding: '60px 20px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: '15px', color: '#1f2937' }}>Get In Touch</h2>
        <p style={{ fontSize: '1.1rem', color: '#f2f5fa', marginBottom: '30px' }}>
          Interested in enrolling or hiring our top UI design graduates? Reach out to us today.
        </p>
        <div className="contact-details" style={{ background: '#7422c5', color: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(116, 34, 197, 0.2)' }}>
          <p style={{ margin: '10px 0', fontSize: '1.1rem' }}><strong>Phone:</strong> 0953595426</p>
          <p style={{ margin: '10px 0', fontSize: '1.1rem' }}><strong>Email:</strong> bihonegntadie@gmail.com</p>
          <p style={{ margin: '10px 0', fontSize: '1.1rem' }}><strong>Location:</strong> Addis Ababa, Ethiopia</p>
          <button 
            className="btn-primary" 
            style={{ marginTop: '25px', backgroundColor: '#ffffff', color: '#7422c5', padding: '12px 30px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
            onClick={() => handleOpenModal()}
          >
            Submit Application
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;