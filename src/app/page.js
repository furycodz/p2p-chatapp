"use client"
import Image from "next/image";
import LeftSection from "../components/LeftSection"
import ChatSection from "../components/ChatSection"
import { useState } from "react";

export default function Home() {

  const [peers, setPeers] = useState([])
  const [lang, setLang] = useState('en')
  const language = {
    fr: {
        search_text:"Ajouter un Contact ou Groupe"
    },
    en: {
        search_text:"Add Contact or Group"
    }
}
  return (
    <main className="flex h-screen">
     
         <LeftSection language={language[lang]} lang={lang} setLang={setLang} />
      
        <ChatSection language={language[lang]} /> 
    </main>
  );
}
