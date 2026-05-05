"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./galaxy.css";

const PROJECTS = [
  {
    id: "orbit",
    name: "Orbit 77",
    desc: "A podcast created by people in Australia. Watch episodes, engage with the community, and support the second season.",
    status: "ACTIVE",
    color: "#39FF14",
    href: "/exhibitions/galaxy/orbit",
    badge: "COMMUNITY",
    priority: 2
  },
  {
    id: "capsule",
    name: "EterniCapsule",
    desc: "Leave a message for someone you couldn't tell before. Write what matters, set when it opens, and let them discover it in the future.",
    status: "ACTIVE",
    color: "#C4A882",
    href: "/exhibitions/galaxy/ethernicapsule",
    badge: "QUICK START",
    priority: 1
  },
  {
    id: "figurines",
    name: "Figurines",
    desc: "Turn yourself into a physical figurine. Upload your photo, customize your avatar, and receive it as a tangible object.",
    status: "ACTIVE",
    color: "#DCA88F",
    href: "/exhibitions/galaxy/figurines",
    badge: "PHYSICAL",
    priority: 3
  },
  {
    id: "ebok",
    name: "EBOK",
    desc: "Stories and reflections printed in physical books. Write something that will exist beyond screens.",
    status: "FORMING",
    color: "#8B7355",
    href: "#",
    badge: "FORMING",
    priority: 4
  }
];

export default function GalaxyExhibition() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="galaxy-container">
      {/* Top Bar */}
      <div className="galaxy-topbar">
        <Link href="/exhibitions" className="galaxy-link">
          ← RETURN
        </Link>
        <div className="galaxy-breadcrumb">
          <Link href="/exhibitions" className="breadcrumb-link">EXHIBITIONS</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">GALAXY</span>
        </div>
      </div>

      {/* Grid */}
      <div className="galaxy-grid">
        {PROJECTS.map((project) => (
          <div
            key={project.id}
            className={`galaxy-cell galaxy-cell-priority-${project.priority}`}
            data-priority={project.priority}
            onClick={() => project.href !== "#" && router.push(project.href)}
          >
            {/* Badge */}
            <div className="galaxy-badge" style={{
              borderColor: project.color,
              color: project.color
            }}>
              {project.badge}
            </div>

            {/* Artifact Shape */}
            <div className="galaxy-artifact">
              {project.id === 'orbit' && (
                <div className="shape-orbit">
                  <div className="orbit-planet"></div>
                  <div className="orbit-ring"></div>
                </div>
              )}
              {project.id === 'capsule' && (
                <div className="shape-capsule"></div>
              )}
              {project.id === 'figurines' && (
                <div className="shape-figurine"></div>
              )}
              {project.id === 'ebok' && (
                <div className="shape-book"></div>
              )}
            </div>

            {/* Text */}
            <div className="galaxy-text">
              <div className="galaxy-status" style={{ color: project.color }}>
                [ {project.status} ]
              </div>
              <h2 className="galaxy-name" style={{ color: project.color }}>
                {project.name}
              </h2>
              <p className="galaxy-desc">{project.desc}</p>
              <div className="galaxy-cta">
                {project.status === 'FORMING' ? '[ COMING SOON ]' : '[ CLICK TO ENTER ]'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
