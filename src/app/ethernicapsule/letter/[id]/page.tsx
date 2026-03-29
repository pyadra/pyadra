import { redirect } from "next/navigation";
import crypto from "crypto";
import { getSupabase } from "@/app/lib/db";
import LetterRenderClient from "./LetterRenderClient";

function hashKey(key: string) {
  return crypto.createHash('sha256').update(key).digest('hex');
}

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ key?: string; type?: string }>;
}

export default async function EterniCapsuleLetter({ params, searchParams }: Props) {
  const p = await params;
  const sp = await searchParams;

  const id = p.id;
  const key = sp.key;
  const type = sp.type || 'capsule';

  if (!id || !key || (type !== 'capsule' && type !== 'sender')) {
    redirect('/ethernicapsule');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = getSupabase() as any;
  const hash = hashKey(key);
  const column = type === 'capsule' ? 'capsule_key_hash' : 'sender_key_hash';

  const { data: capsule, error } = await supabase
    .from('ethernicapsule_capsules')
    .select('created_at, opened_at, sender_name, recipient_name, message')
    .eq('id', id)
    .eq(column, hash)
    .single();

  if (error || !capsule) {
    redirect('/ethernicapsule');
  }

  // In preview mode we just spoof the opened_at if it's not set
  const renderedCapsule = {
    ...capsule,
    id,
    opened_at: type === 'capsule' ? (capsule.opened_at || new Date().toISOString()) : null
  };

  return <LetterRenderClient capsule={renderedCapsule} type={type} />;
}
