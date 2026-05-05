"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "../providers";
import "./exhibitions.css";

const EXHIBITIONS = [
  {
    id: "jungle",
    name: "Jungle",
    subtitle: "The Living Network",
    status: "OPENING 2026",
    color: "#39FF14",
    active: false,
    position: "left"
  },
  {
    id: "galaxy",
    name: "Galaxy",
    subtitle: "Rituals of Memory",
    status: "ACTIVE NOW",
    color: "#FFB000",
    href: "/exhibitions/galaxy",
    active: true,
    position: "center"
  },
  {
    id: "city",
    name: "City",
    subtitle: "Metropolitan Scale",
    status: "OPENING 2027",
    color: "#00D9FF",
    active: false,
    position: "right"
  }
];

export default function ExhibitionsPage() {
  const [mounted, setMounted] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>("galaxy");
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleDoorClick = (exhibition: typeof EXHIBITIONS[0]) => {
    if (exhibition.active && exhibition.href) {
      router.push(exhibition.href);
    }
  };

  return (
    <div className="exhibitions-container">
      {/* Top Bar */}
      <div className="exhibitions-topbar">
        <Link href="/" className="exhibitions-link">
          ← RETURN
        </Link>
      </div>

      {/* Header Context */}
      <div className="exhibitions-header">
        <h1 className="header-title">PYADRA EXHIBITIONS</h1>
        <div className="header-divider"></div>
        <p className="header-subtitle">
          Three spaces to create what endures.
        </p>
        <p className="header-description">
          Galaxy is active now. Jungle and City are forming.
        </p>
      </div>

      {/* Three Doors */}
      <div className="doors-container">
        {EXHIBITIONS.map((exhibition) => (
          <div
            key={exhibition.id}
            className={`door door-${exhibition.position} ${exhibition.active ? 'door-active' : 'door-inactive'} ${hoveredId === exhibition.id ? 'door-hovered' : ''}`}
            onClick={() => handleDoorClick(exhibition)}
            onMouseEnter={() => setHoveredId(exhibition.id)}
            onMouseLeave={() => setHoveredId(exhibition.active ? exhibition.id : null)}
          >
            {/* Door Frame */}
            <div className="door-frame">
              {/* Badge */}
              <div className="door-badge" style={{
                borderColor: exhibition.color,
                color: exhibition.color
              }}>
                {exhibition.active ? '● ACTIVE' : '○ FORMING'}
              </div>

              {/* Artifact/Symbol */}
              <div className="door-artifact">
                {exhibition.id === 'galaxy' && (
                  <div className="artifact-galaxy">
                    <div className="galaxy-core"></div>
                    <div className="galaxy-ring galaxy-ring-1"></div>
                    <div className="galaxy-ring galaxy-ring-2"></div>
                  </div>
                )}
                {exhibition.id === 'jungle' && (
                  <div className="artifact-jungle"></div>
                )}
                {exhibition.id === 'city' && (
                  <div className="artifact-city">
                    <div className="city-tower"></div>
                  </div>
                )}
              </div>

              {/* Text */}
              <div className="door-text">
                <div className="door-status" style={{ color: exhibition.color }}>
                  [ {exhibition.status} ]
                </div>
                <h2 className="door-name" style={{ color: exhibition.color }}>
                  {exhibition.name}
                </h2>
                <p className="door-subtitle">{exhibition.subtitle}</p>
                {exhibition.active && (
                  <div className="door-cta">[ CLICK TO ENTER ]</div>
                )}
              </div>
            </div>

            {/* Glow effect for active */}
            {exhibition.active && (
              <div className="door-glow" style={{
                background: `radial-gradient(circle, ${exhibition.color}15 0%, transparent 70%)`
              }}></div>
            )}
          </div>
        ))}
      </div>

      {/* Center Title */}
      <div className="center-title">
        <div className="title-line"></div>
        <h1 className="title-text">PYADRA EXHIBITIONS</h1>
        <div className="title-line"></div>
      </div>
    </div>
  );
}
