'use client';

/* ------------------------------------------------------------------ */
/*  PYADRA · SiteNav — the one nav every page uses.                    */
/*                                                                     */
/*  Three zones, always in this order:                                 */
/*    LEFT     the symbol (always goes home) — the anchor.             */
/*    CENTER   breadcrumb — the only zone that changes with depth.     */
/*    RIGHT    action links + optional status chip.                    */
/*                                                                     */
/*  Visual: floating pill (or inline pill for dashboards), white/80,   */
/*  backdrop-blur, emerald accent. Same style, everywhere.             */
/* ------------------------------------------------------------------ */

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import PyadraLogo from '@/app/components/brand/PyadraLogo';
import BringIdeaDialog from '@/app/components/nav/BringIdeaDialog';

export type NavCrumb = { label: string; href?: string };
export type NavAction = { label: string; href: string };
export type NavStatus = { label: string; live?: boolean };

type Props = {
  /** Breadcrumb from top of hierarchy → current page. Last item = current. */
  crumbs?: NavCrumb[];
  /** Extra right-side action links. Defaults to Store (hidden if already on Store). */
  actions?: NavAction[];
  /** Optional non-clickable status chip on the right (e.g. "For sale", "4 live projects"). */
  status?: NavStatus;
  /**
   * floating (default) — fixed top-center over the page.
   * inline           — flows inside the page layout (project dashboards).
   */
  variant?: 'floating' | 'inline';
  /** Skip the mount reveal animation (rare — only if page manages it itself). */
  noAnim?: boolean;
};

const REVEAL_SPRING = { type: 'spring' as const, stiffness: 130, damping: 18, mass: 0.9 };

export default function SiteNav({
  crumbs = [],
  actions,
  status,
  variant = 'floating',
  noAnim = false,
}: Props) {
  const pathname = usePathname();
  const onStore = !!pathname && pathname.startsWith('/store');
  const rightActions: NavAction[] = actions ?? (onStore ? [] : [{ label: 'Store', href: '/store' }]);
  const [showIdea, setShowIdea] = useState(false);

  const pill = (
    <div className="flex items-center gap-1 rounded-full bg-white/80 backdrop-blur-md shadow-lg shadow-[#1A1C1A]/5 ring-1 ring-[#1A1C1A]/5 pl-2 pr-1.5 py-1.5">
      {/* LEFT — the anchor */}
      <Link
        href="/"
        aria-label="Pyadra — home"
        className="flex items-center justify-center px-2 py-1 rounded-full hover:bg-[#EDEFED] transition-colors"
      >
        <PyadraLogo size={22} interactive />
      </Link>

      {/* CENTER (mobile) — compact breadcrumb: parent link + current page.
          Without this, project pages have no way back on small screens. */}
      {crumbs.length > 0 && (
        <div className="flex sm:hidden items-center pl-1 min-w-0">
          {(() => {
            const current = crumbs[crumbs.length - 1];
            const parent = crumbs
              .slice(0, -1)
              .reverse()
              .find((c) => c.href);
            return (
              <>
                {parent && (
                  <Link
                    href={parent.href!}
                    aria-label={`Back to ${parent.label}`}
                    className="rounded-full px-2 py-1.5 t-d5 font-medium text-[#6B8070] hover:text-[#059669] transition-colors whitespace-nowrap"
                  >
                    ← {parent.label}
                  </Link>
                )}
                <span
                  aria-current="page"
                  className="px-2 py-1.5 t-d5 font-bold text-[#1A1C1A] truncate"
                >
                  {current.label}
                </span>
              </>
            );
          })()}
        </div>
      )}

      {/* CENTER — breadcrumb */}
      {crumbs.length > 0 && (
        <div className="hidden sm:flex items-center pl-1">
          {crumbs.map((c, i) => {
            const isLast = i === crumbs.length - 1;
            const separator = i > 0 && (
              <span aria-hidden className="text-[13px] text-[#6B8070]/60 mx-0.5">/</span>
            );
            if (c.href && !isLast) {
              return (
                <div key={i} className="flex items-center">
                  {separator}
                  <Link
                    href={c.href}
                    className="rounded-full px-2.5 py-1.5 t-d5 font-medium text-[#6B8070] hover:text-[#059669] hover:bg-[#EDEFED] transition-colors"
                  >
                    {c.label}
                  </Link>
                </div>
              );
            }
            return (
              <div key={i} className="flex items-center">
                {separator}
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className="px-2.5 py-1.5 t-d5 font-bold text-[#1A1C1A]"
                >
                  {c.label}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* RIGHT — actions + status */}
      <div className="flex items-center gap-1 pl-1">
        {rightActions.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="rounded-full px-3 py-1.5 t-d5 font-medium text-[#3A4A3E] hover:text-[#059669] hover:bg-[#EDEFED] transition-colors"
          >
            {a.label}
          </Link>
        ))}
        <button
          type="button"
          onClick={() => setShowIdea(true)}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#059669]/10 text-[#047857] px-3 py-1.5 t-d5 font-medium hover:bg-[#059669] hover:text-white transition-colors whitespace-nowrap"
        >
          <span aria-hidden className="text-[10px]">✦</span>
          <span className="hidden sm:inline">Bring your idea</span>
          <span className="sm:hidden">Idea</span>
        </button>
        {status && (
          <span
            role="status"
            aria-label={status.label}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[#059669]/10 text-[#047857] px-3 py-1.5 t-d6 cursor-default select-none"
          >
            {status.live && (
              <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
            )}
            {status.label}
          </span>
        )}
      </div>
    </div>
  );

  const wrapperMotion = noAnim
    ? {}
    : {
        initial: { opacity: 0, y: -16 },
        animate: { opacity: 1, y: 0 },
        transition: REVEAL_SPRING,
      };

  const ideaDialog = <BringIdeaDialog open={showIdea} onClose={() => setShowIdea(false)} />;

  if (variant === 'floating') {
    return (
      <>
        <motion.nav
          {...wrapperMotion}
          className="fixed top-4 inset-x-0 z-50 flex justify-center px-4"
        >
          {pill}
        </motion.nav>
        {ideaDialog}
      </>
    );
  }

  // inline — flows with the page layout (project dashboards).
  // Centered inside the max-w-7xl container, matching the floating variant.
  return (
    <>
      <motion.header
        {...wrapperMotion}
        className="relative z-20 w-full max-w-7xl mx-auto mb-4 lg:mb-0 flex justify-center"
      >
        {pill}
      </motion.header>
      {ideaDialog}
    </>
  );
}
