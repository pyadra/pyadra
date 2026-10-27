import { permanentRedirect } from 'next/navigation';

/* Galaxy is the only open room, so the museum's hall became a step that
   only delayed it (owner, October 27, 2026). Links to /exhibitions — the
   footer of old shares, printed material — still land in the right place.
   When a second exhibition opens, this page comes back as the hall. */
export default function ExhibitionsRedirect() {
  permanentRedirect('/exhibitions/galaxy');
}
