import { NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabase } from "@/app/lib/db";

export const runtime = "nodejs";

function hashKey(key: string) {
  return crypto.createHash('sha256').update(key).digest('hex');
}

export async function POST(req: Request) {
  try {
    const { key, type } = await req.json();

    if (!key || !type) {
      return NextResponse.json({ error: "Key and type are required" }, { status: 400 });
    }

    if (type !== "capsule" && type !== "sender") {
      return NextResponse.json({ error: "Invalid key type" }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = getSupabase() as any;
    if (!supabase) throw new Error("Missing DB connection");

    const hash = hashKey(key);
    const column = type === "capsule" ? "capsule_key_hash" : "sender_key_hash";

    const { data: capsule, error } = await supabase
      .from("ethernicapsule_capsules")
      .select("id, status")
      .eq(column, hash)
      .single();

    if (error || !capsule) {
      return NextResponse.json({ error: "This key does not match any capsule." }, { status: 404 });
    }

    // Update status if needed
    if (type === "capsule" && capsule.status !== "opened") {
      await supabase
        .from("ethernicapsule_capsules")
        .update({ status: "opened", opened_at: new Date().toISOString() })
        .eq("id", capsule.id);
    } else if (type === "sender" && capsule.status === "sealed") {
      await supabase
        .from("ethernicapsule_capsules")
        .update({ status: "previewed", previewed_at: new Date().toISOString() })
        .eq("id", capsule.id);
    }

    return NextResponse.json({ success: true, capsuleId: capsule.id });

  } catch (err: unknown) {
    console.error("Key verification error:", err);
    return NextResponse.json({ error: "Failed to verify key." }, { status: 500 });
  }
}
