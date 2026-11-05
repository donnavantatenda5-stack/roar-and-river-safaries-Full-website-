import Assistant from "@/components/Assistant";
import Navbar from "@/components/Navbar";
import SandCanvas from "@/components/SandCanvas";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="relative z-[1]">{children}</div>
      <SandCanvas />
      <Assistant />
    </>
  );
}
