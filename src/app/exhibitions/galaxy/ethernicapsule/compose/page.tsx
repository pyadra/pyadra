import ComposeFormUnified from "./ComposeFormUnified";
import LiveBackground from "../../components/LiveBackground";

export default function EterniCapsuleComposePage() {
  return (
    <div className="min-h-screen w-full bg-[var(--etn-earth)] relative selection:bg-[var(--etn-bronze-bright)] selection:text-[var(--etn-earth)]">
       <LiveBackground color="var(--etn-bronze-bright)" intensity="low" />
       <ComposeFormUnified />
    </div>
  );
}
