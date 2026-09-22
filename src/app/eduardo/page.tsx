import { permanentRedirect } from 'next/navigation';

/* A sample business card was printed with a QR pointing here, so this
   route can never simply disappear. The room itself moved to
   /team, where it holds the whole team rather than one person. */
export default function EduardoRedirect() {
  permanentRedirect('/team/edu');
}
