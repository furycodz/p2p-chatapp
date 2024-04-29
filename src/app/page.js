"use client"
import Image from "next/image";
import LeftSection from "../components/LeftSection"
import ChatSection from "../components/ChatSection"
import { useState, useEffect } from "react";

export default function Home() {

  const [settings,setSettings] = useState({
    darkmode: false,
    lang: 'en'
  })
  const [peers, setPeers] = useState([])
  // const [lang, setLang] = useState('en')
  // const [darkmode, setDarkMode] = useState(false)

  //Load settings from Local storage 
  useEffect(() => {
    if (typeof window !== 'undefined') {
    const sett = JSON.parse(localStorage.getItem('settings'));
    if (sett) {
     setSettings(sett);
     console.log(sett)
    }
    
    }
  }, []);
  //Save Settings to Local Storage
  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));

  }, [settings]);

  // useEffect(()=>{
  //     if (typeof window !== 'undefined') {
  //         localStorage.setItem('lang', settings.lang)
  //     }

  // },[lang])

  useEffect(() => {
   
      if (settings.darkmode) {
          document.body.classList.add("dark")
      } else {
          document.body.classList.remove("dark")
      }
     
    }, [settings.darkmode]);

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
     
         <LeftSection language={language[settings.lang]} settings={settings} setSettings={setSettings}/>
      
        <ChatSection language={language[settings.lang]} /> 
    </main>
  );
}
