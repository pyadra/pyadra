'use client'
import Link from 'next/link';
import { useState, useEffect } from 'react';

const MEMBERS = [
  {
    id: 1,
    name: 'Maria Santos',
    role: 'Seeder',
    avatar: 'https://i.pravatar.cc/150?img=1',
    color: '#66FFB2',
    contributions: {
      money: '$15,000',
      projects: ['Solar Hub', 'Clean Ocean', 'Food Co-op'],
      hours: 0,
      type: 'Financial Support'
    },
    bio: 'Passionate about sustainable energy and community development.',
    achievements: ['Top Supporter 2024', 'Early Adopter']
  },
  {
    id: 2,
    name: 'Alex Chen',
    role: 'Builder',
    avatar: 'https://i.pravatar.cc/150?img=2',
    color: '#29ABE2',
    contributions: {
      money: '$0',
      projects: ['Urban Garden', 'Code for Kids', 'Tech Lab'],
      hours: 340,
      type: 'Development & Design'
    },
    bio: 'Full-stack developer building the future one commit at a time.',
    achievements: ['500+ Commits', 'Core Contributor']
  },
  {
    id: 3,
    name: 'Jordan Lee',
    role: 'Creator',
    avatar: 'https://i.pravatar.cc/150?img=3',
    color: '#00E0C7',
    contributions: {
      money: '$2,500',
      projects: ['Code for Kids', 'Mental Health Circles', 'Local Library'],
      hours: 120,
      type: 'Project Leadership'
    },
    bio: 'Educator and project founder with 3 successful initiatives launched.',
    achievements: ['450+ Supporters', 'Project Founder']
  },
  {
    id: 4,
    name: 'Emma Rivera',
    role: 'Harvester',
    avatar: 'https://i.pravatar.cc/150?img=4',
    color: '#7B61FF',
    contributions: {
      money: '$500',
      projects: ['Clean Ocean', 'Community Hub', 'Green City'],
      hours: 89,
      type: 'Network Building'
    },
    bio: 'Community connector bringing people and ideas together.',
    achievements: ['89 Connections Made', 'Network Catalyst']
  },
  {
    id: 5,
    name: 'Sam Taylor',
    role: 'Builder',
    avatar: 'https://i.pravatar.cc/150?img=5',
    color: '#29ABE2',
    contributions: {
      money: '$0',
      projects: ['Tech Lab', 'Urban Garden', 'Code for Kids', 'Solar Hub', 'Food Co-op', 'Mental Health'],
      hours: 280,
      type: 'Backend Development'
    },
    bio: 'Backend engineer specializing in scalable systems and APIs.',
    achievements: ['28 Features Shipped', 'Performance Hero']
  },
  {
    id: 6,
    name: 'Amir Hassan',
    role: 'Creator',
    avatar: 'https://i.pravatar.cc/150?img=6',
    color: '#00E0C7',
    contributions: {
      money: '$8,000',
      projects: ['Refugee Skills Academy', 'Language Bridge'],
      hours: 200,
      type: 'Social Impact'
    },
    bio: 'Social entrepreneur focused on education and refugee integration.',
    achievements: ['$40K Raised', '2 Projects Launched']
  },
  {
    id: 7,
    name: 'Lisa Wong',
    role: 'Seeder',
    avatar: 'https://i.pravatar.cc/150?img=7',
    color: '#66FFB2',
    contributions: {
      money: '$22,000',
      projects: ['Food Co-op', 'Urban Garden', 'Local Library', 'Community Hub'],
      hours: 0,
      type: 'Strategic Funding'
    },
    bio: 'Angel investor supporting local community initiatives.',
    achievements: ['24 Projects Funded', 'Impact Investor']
  },
  {
    id: 8,
    name: 'Dev Patel',
    role: 'Harvester',
    avatar: 'https://i.pravatar.cc/150?img=8',
    color: '#7B61FF',
    contributions: {
      money: '$1,200',
      projects: ['Tech Lab', 'Code for Kids', 'Digital Literacy'],
      hours: 150,
      type: 'Community Outreach'
    },
    bio: 'Tech advocate connecting developers with social causes.',
    achievements: ['120+ Connections', 'Community Builder']
  },
  {
    id: 9,
    name: 'Sofia Martinez',
    role: 'Builder',
    avatar: 'https://i.pravatar.cc/150?img=9',
    color: '#29ABE2',
    contributions: {
      money: '$0',
      projects: ['Urban Garden', 'Food Co-op', 'Community Hub', 'Green City', 'Solar Hub'],
      hours: 310,
      type: 'UI/UX Design'
    },
    bio: 'Product designer creating beautiful and accessible experiences.',
    achievements: ['5 Design Systems', 'User Experience Award']
  },
  {
    id: 10,
    name: 'Kai Johnson',
    role: 'Creator',
    avatar: 'https://i.pravatar.cc/150?img=10',
    color: '#00E0C7',
    contributions: {
      money: '$5,000',
      projects: ['Community Hub', 'Local Library', 'Youth Center', 'Sports Initiative'],
      hours: 180,
      type: 'Community Leadership'
    },
    bio: 'Community organizer building spaces for people to connect.',
    achievements: ['4 Initiatives Founded', 'Community Hero']
  },
  {
    id: 11,
    name: 'Priya Sharma',
    role: 'Seeder',
    avatar: 'https://i.pravatar.cc/150?img=11',
    color: '#66FFB2',
    contributions: {
      money: '$18,500',
      projects: ['Code for Kids', 'Tech Lab', 'Digital Literacy', 'Youth Center'],
      hours: 0,
      type: 'Education Funding'
    },
    bio: 'Education philanthropist supporting tech literacy programs.',
    achievements: ['31 Creators Supported', 'Education Champion']
  },
  {
    id: 12,
    name: 'Marcus Brown',
    role: 'Harvester',
    avatar: 'https://i.pravatar.cc/150?img=12',
    color: '#7B61FF',
    contributions: {
      money: '$3,000',
      projects: ['All Active Projects'],
      hours: 220,
      type: 'Growth Strategy'
    },
    bio: 'Growth strategist helping the collective expand and thrive.',
    achievements: ['200+ Members Onboarded', 'Network Architect']
  }
];

export default function CollectivePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [formData, setFormData] = useState({ name: '', role: '', wallet: '' });

  useEffect(() => {
    const canvas = document.getElementById('neural-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2.5 + 0.5
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2);
        gradient.addColorStop(0, 'rgba(41, 171, 226, 0.8)');
        gradient.addColorStop(1, 'rgba(41, 171, 226, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            const opacity = 0.4 * (1 - dist / 180);
            ctx.strokeStyle = `rgba(41, 171, 226, ${opacity})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    }
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = () => {
    if (formData.name && formData.role) {
      alert(`Welcome to The Collective, ${formData.name}!`);
      setIsModalOpen(false);
      setFormData({ name: '', role: '', wallet: '' });
    } else {
      alert('Please fill in your name and select a role.');
    }
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#0B1D26', color: '#F4F6F8', minHeight: '100vh', overflowX: 'hidden', position: 'relative' }}>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');

        #neural-canvas {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          opacity: 0.4;
          pointer-events: none;
        }

        .orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.3;
          pointer-events: none;
          z-index: 1;
          animation: float 20s infinite ease-in-out;
        }

        .orb-1 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, #29ABE2 0%, transparent 70%);
          top: -200px;
          right: -150px;
        }

        .orb-2 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, #00E0C7 0%, transparent 70%);
          bottom: -100px;
          left: -100px;
          animation-delay: 5s;
        }

        .orb-3 {
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, #7B61FF 0%, transparent 70%);
          top: 50%;
          left: 50%;
          animation-delay: 10s;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(100px, -50px) scale(1.1); }
          50% { transform: translate(-50px, 100px) scale(0.9); }
          75% { transform: translate(80px, 80px) scale(1.05); }
        }

        .hero-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 80px;
          font-weight: 700;
          margin-bottom: 24px;
          background: linear-gradient(135deg, #F4F6F8 0%, #29ABE2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: titlePulse 4s ease-in-out infinite;
        }

        @keyframes titlePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }

        .hero-btn {
          padding: 18px 48px;
          border: none;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          background: linear-gradient(135deg, #29ABE2, #00E0C7);
          color: white;
          box-shadow: 0 0 40px rgba(41, 171, 226, 0.6);
          transition: all 0.3s;
          animation: breathe 3s ease-in-out infinite;
        }

        @keyframes breathe {
          0%, 100% { box-shadow: 0 0 40px rgba(41, 171, 226, 0.6); }
          50% { box-shadow: 0 0 60px rgba(41, 171, 226, 0.9); transform: scale(1.05); }
        }

        .hero-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 0 80px rgba(41, 171, 226, 1);
        }

        .central-core {
          position: absolute;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(41, 171, 226, 0.4), rgba(0, 224, 199, 0.2));
          border: 2px solid rgba(41, 171, 226, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: corePulse 3s ease-in-out infinite;
          box-shadow: 0 0 60px rgba(41, 171, 226, 0.8), inset 0 0 40px rgba(41, 171, 226, 0.3);
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }

        @keyframes corePulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); box-shadow: 0 0 60px rgba(41, 171, 226, 0.8); }
          50% { transform: translate(-50%, -50%) scale(1.1); box-shadow: 0 0 100px rgba(41, 171, 226, 1); }
        }

        .orbit-ring {
          position: absolute;
          border: 1px dashed rgba(41, 171, 226, 0.2);
          border-radius: 50%;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          animation: rotate 30s linear infinite;
        }

        .orbit-ring-1 { width: 350px; height: 350px; }
        .orbit-ring-2 { width: 500px; height: 500px; animation-duration: 40s; animation-direction: reverse; }
        .orbit-ring-3 { width: 650px; height: 650px; animation-duration: 50s; }

        @keyframes rotate {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        .node {
          position: absolute;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(11, 29, 38, 0.9);
          backdrop-filter: blur(20px);
          border: 2px solid;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 0 20px rgba(41, 171, 226, 0.4);
        }

        .node:hover {
          transform: scale(1.2);
          z-index: 100;
          box-shadow: 0 0 40px rgba(41, 171, 226, 0.9);
        }

        .node img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          object-fit: cover;
        }

        .role-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(30px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 40px;
          text-align: center;
          transition: all 0.5s;
          position: relative;
          overflow: hidden;
        }

        .role-card:hover {
          transform: translateY(-10px);
          border-color: rgba(41, 171, 226, 0.5);
          box-shadow: 0 20px 60px rgba(41, 171, 226, 0.3);
        }

        .role-icon {
          font-size: 64px;
          margin-bottom: 20px;
          display: inline-block;
          animation: bounce 2s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          overflow-y: auto;
        }

        .modal-content {
          background: rgba(11, 29, 38, 0.95);
          backdrop-filter: blur(40px);
          border: 1px solid rgba(41, 171, 226, 0.3);
          border-radius: 24px;
          padding: 48px;
          max-width: 600px;
          width: 100%;
          box-shadow: 0 30px 80px rgba(41, 171, 226, 0.4);
          max-height: 90vh;
          overflow-y: auto;
        }

        .stat-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          font-size: 14px;
          margin: 4px;
        }

        .project-tag {
          display: inline-block;
          padding: 6px 12px;
          background: rgba(41, 171, 226, 0.15);
          border: 1px solid rgba(41, 171, 226, 0.3);
          border-radius: 12px;
          font-size: 12px;
          margin: 4px;
          color: #29ABE2;
        }

        .achievement-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: linear-gradient(135deg, rgba(41, 171, 226, 0.2), rgba(0, 224, 199, 0.2));
          border: 1px solid rgba(41, 171, 226, 0.4);
          border-radius: 16px;
          font-size: 13px;
          margin: 6px;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .hero-title { font-size: 48px; }
          .orbit-ring-1 { width: 250px; height: 250px; }
          .orbit-ring-2 { width: 350px; height: 350px; }
          .orbit-ring-3 { width: 450px; height: 450px; }
          .node { width: 60px; height: 60px; }
          .node img { width: 40px; height: 40px; }
        }
      `}</style>

      <canvas id="neural-canvas"></canvas>
      
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1400px', margin: '0 auto', padding: '80px 24px' }}>
        <section style={{ textAlign: 'center', marginBottom: '120px' }}>
          <h1 className="hero-title">The Collective</h1>
          <p style={{ fontSize: '24px', color: 'rgba(244, 246, 248, 0.7)', marginBottom: '48px' }}>
            Real people, growing together through collective action.
          </p>
          <button className="hero-btn" onClick={() => setIsModalOpen(true)}>
            Join the Collective
          </button>
        </section>

        <section style={{ position: 'relative', height: '600px', marginBottom: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="central-core">
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '32px', fontWeight: 700, color: 'white' }}>
              PYADRA
            </div>
          </div>

          <div className="orbit-ring orbit-ring-1">
            {[0, 1, 2, 3].map((i) => {
              const member = MEMBERS[i];
              const positions = [
                { top: 0, left: '50%', transform: 'translate(-50%, -50%)' },
                { bottom: 0, left: '50%', transform: 'translate(-50%, 50%)' },
                { left: 0, top: '50%', transform: 'translate(-50%, -50%)' },
                { right: 0, top: '50%', transform: 'translate(50%, -50%)' }
              ];
              return (
                <div
                  key={member.id}
                  className="node"
                  style={{ borderColor: member.color, ...positions[i] }}
                  onClick={() => setSelectedMember(member)}
                >
                  <img src={member.avatar} alt={member.name} />
                </div>
              );
            })}
          </div>

          <div className="orbit-ring orbit-ring-2">
            {[4, 5, 6, 7].map((i) => {
              const member = MEMBERS[i];
              const positions = [
                { top: '10%', left: '20%' },
                { top: '10%', right: '20%' },
                { bottom: '10%', left: '20%' },
                { bottom: '10%', right: '20%' }
              ];
              return (
                <div
                  key={member.id}
                  className="node"
                  style={{ borderColor: member.color, ...positions[i - 4] }}
                  onClick={() => setSelectedMember(member)}
                >
                  <img src={member.avatar} alt={member.name} />
                </div>
              );
            })}
          </div>

          <div className="orbit-ring orbit-ring-3">
            {[8, 9, 10, 11].map((i) => {
              const member = MEMBERS[i];
              const positions = [
                { top: '5%', left: '50%', transform: 'translate(-50%, 0)' },
                { bottom: '5%', left: '50%', transform: 'translate(-50%, 0)' },
                { left: '5%', top: '50%', transform: 'translate(0, -50%)' },
                { right: '5%', top: '50%', transform: 'translate(0, -50%)' }
              ];
              return (
                <div
                  key={member.id}
                  className="node"
                  style={{ borderColor: member.color, ...positions[i - 8] }}
                  onClick={() => setSelectedMember(member)}
                >
                  <img src={member.avatar} alt={member.name} />
                </div>
              );
            })}
          </div>
        </section>

        <section style={{ marginBottom: '80px' }}>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '48px', fontWeight: 700, textAlign: 'center', marginBottom: '16px' }}>
            Find Your Role
          </h2>
          <p style={{ textAlign: 'center', color: 'rgba(244, 246, 248, 0.7)', marginBottom: '60px', fontSize: '18px' }}>
            Every role is vital to the collective. Choose how you want to contribute.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            <div className="role-card">
              <div className="role-icon">🌱</div>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '28px', fontWeight: 600, marginBottom: '12px' }}>Seeders</h3>
              <p style={{ color: 'rgba(244, 246, 248, 0.7)' }}>Support ideas with resources</p>
            </div>

            <div className="role-card">
              <div className="role-icon">🛠</div>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '28px', fontWeight: 600, marginBottom: '12px' }}>Builders</h3>
              <p style={{ color: 'rgba(244, 246, 248, 0.7)' }}>Contribute time and skills</p>
            </div>

            <div className="role-card">
              <div className="role-icon">💡</div>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '28px', fontWeight: 600, marginBottom: '12px' }}>Creators</h3>
              <p style={{ color: 'rgba(244, 246, 248, 0.7)' }}>Start projects that inspire</p>
            </div>

            <div className="role-card">
              <div className="role-icon">🌐</div>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '28px', fontWeight: 600, marginBottom: '12px' }}>Harvesters</h3>
              <p style={{ color: 'rgba(244, 246, 248, 0.7)' }}>Connect and amplify collective impact</p>
            </div>
          </div>
        </section>
      </div>

      {selectedMember && (
        <div className="modal" onClick={() => setSelectedMember(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedMember(null)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer', opacity: 0.7 }}
            >
              ×
            </button>

            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 20px' }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: `radial-gradient(circle, ${selectedMember.color}40, transparent)`, filter: 'blur(20px)' }}></div>
                <img
                  src={selectedMember.avatar}
                  alt={selectedMember.name}
                  style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '50%', border: `3px solid ${selectedMember.color}`, objectFit: 'cover' }}
                />
              </div>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '36px', fontWeight: 700, marginBottom: '8px' }}>
                {selectedMember.name}
              </h2>
              <span
                style={{
                  display: 'inline-block',
                  padding: '8px 20px',
                  background: `${selectedMember.color}20`,
                  color: selectedMember.color,
                  border: `1px solid ${selectedMember.color}40`,
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: 600
                }}
              >
                {selectedMember.role}
              </span>
            </div>

            <p style={{ fontSize: '16px', color: 'rgba(244, 246, 248, 0.8)', marginBottom: '32px', lineHeight: '1.6', textAlign: 'center' }}>
              {selectedMember.bio}
            </p>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#29ABE2' }}>
                💼 Contribution Type
              </h3>
              <p style={{ fontSize: '16px', color: 'rgba(244, 246, 248, 0.9)', fontWeight: 500 }}>
                {selectedMember.contributions.type}
              </p>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#29ABE2' }}>
                📊 Contributions
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
                {selectedMember.contributions.money !== '$0' && (
                  <div className="stat-badge" style={{ background: 'rgba(102, 255, 178, 0.1)', borderColor: 'rgba(102, 255, 178, 0.3)' }}>
                    <span style={{ fontSize: '18px' }}>💰</span>
                    <span style={{ color: '#66FFB2' }}>{selectedMember.contributions.money}</span>
                  </div>
                )}
                {selectedMember.contributions.hours > 0 && (
                  <div className="stat-badge" style={{ background: 'rgba(41, 171, 226, 0.1)', borderColor: 'rgba(41, 171, 226, 0.3)' }}>
                    <span style={{ fontSize: '18px' }}>⏱️</span>
                    <span style={{ color: '#29ABE2' }}>{selectedMember.contributions.hours} hours</span>
                  </div>
                )}
                <div className="stat-badge" style={{ background: 'rgba(0, 224, 199, 0.1)', borderColor: 'rgba(0, 224, 199, 0.3)' }}>
                  <span style={{ fontSize: '18px' }}>🚀</span>
                  <span style={{ color: '#00E0C7' }}>{selectedMember.contributions.projects.length} projects</span>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#29ABE2' }}>
                🎯 Active in Projects
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                {selectedMember.contributions.projects.map((project, idx) => (
                  <span key={idx} className="project-tag">
                    {project}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#29ABE2' }}>
                🏆 Achievements
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                {selectedMember.achievements.map((achievement, idx) => (
                  <span key={idx} className="achievement-badge">
                    ⭐ {achievement}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="modal" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '36px', textAlign: 'center', marginBottom: '16px' }}>
              Join The Collective
            </h2>
            <p style={{ textAlign: 'center', color: 'rgba(244, 246, 248, 0.7)', marginBottom: '32px' }}>
              Be part of something living — help ideas grow.
            </p>

            <input
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{ width: '100%', padding: '16px', marginBottom: '16px', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '12px', color: 'white', fontSize: '16px' }}
            />
            
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              style={{ width: '100%', padding: '16px', marginBottom: '16px', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '12px', color: 'white', fontSize: '16px' }}
            >
              <option value="" style={{ background: '#0B1D26' }}>Select a role...</option>
              <option value="seeder" style={{ background: '#0B1D26' }}>🌱 Seeder</option>
              <option value="builder" style={{ background: '#0B1D26' }}>🛠 Builder</option>
              <option value="creator" style={{ background: '#0B1D26' }}>💡 Creator</option>
              <option value="harvester" style={{ background: '#0B1D26' }}>🌐 Harvester</option>
            </select>

            <input
              type="text"
              placeholder="Wallet Address (optional)"
              value={formData.wallet}
              onChange={(e) => setFormData({ ...formData, wallet: e.target.value })}
              style={{ width: '100%', padding: '16px', marginBottom: '24px', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '12px', color: 'white', fontSize: '16px' }}
            />

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ flex: 1, padding: '16px', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '12px', fontSize: '16px', fontWeight: 600, cursor: 'pointer', background: 'rgba(255, 255, 255, 0.1)', color: 'white' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                style={{ flex: 1, padding: '16px', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 600, cursor: 'pointer', background: 'linear-gradient(135deg, #29ABE2, #00E0C7)', color: 'white', boxShadow: '0 0 30px rgba(41, 171, 226, 0.5)' }}
              >
                Join Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}