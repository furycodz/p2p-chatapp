import Image from "next/image";
import LeftSection from "../components/LeftSection"
import ChatSection from "../components/ChatSection"

export default function Home() {
  return (
    <main className="flex h-screen">
     
         <LeftSection/>
      
        <ChatSection/> 
    </main>
  );
}
