import ComposeForm from "./ComposeForm";
export default function EterniCapsuleComposePage() {
  return (
    <div className="min-h-screen flex flex-col items-center pt-24 pb-32 px-6 md:px-0 bg-[#060504] relative">
       <div className="w-full max-w-2xl relative z-10">
         <ComposeForm />
       </div>
    </div>
  );
}
