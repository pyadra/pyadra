import ComposeForm from "./ComposeForm";
import ProjectNav from "../../components/ProjectNav";
import LiveBackground from "../../components/LiveBackground";

export default function EterniCapsuleComposePage() {
  return (
    <div className="h-[100dvh] w-full flex flex-col bg-[#02040A] relative selection:bg-[#C4A882] selection:text-[#02040A] overflow-hidden">
       <LiveBackground color="#C4A882" intensity="low" />
       <ProjectNav
         projectName="EtherniCapsule"
         projectColor="#C4A882"
         links={[
           { href: "/exhibitions/galaxy/ethernicapsule", label: "Home" },
           { href: "/exhibitions/galaxy/ethernicapsule/compose", label: "Compose" },
           { href: "/exhibitions/galaxy/ethernicapsule/unlock", label: "Unlock" }
         ]}
       />
       <ComposeForm />
    </div>
  );
}
