"use client"
import Image from "next/image";
import LeftSection from "../components/LeftSection"
import ChatSection from "../components/ChatSection"
import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
export default function Home() {

  const [settings,setSettings] = useState({
    darkmode: false,
    lang: 'en'
  })
  const [rooms, setRooms] = useState([
    {
      id: "",
      profile_picture: "/a.jpg",
      name: "Mohammed"
    },
    {
      id: "",
      profile_picture: "/b.jpg",
      name: "Badr"
    }
  ])
  const socketRef = useRef();


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sett = JSON.parse(localStorage.getItem('settings'));
      if (sett) {
        setSettings(sett);
        console.log(sett)
      }
      socketRef.current = io.connect("https://localhost:8000");
 

    }
  }, []);

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));

  }, [settings]);


  useEffect(() => {
   
      if (settings.darkmode) {
          document.body.classList.add("dark")
      } else {
          document.body.classList.remove("dark")
      }
     
    }, [settings.darkmode]);

  const language = {
    fr: {
        search_text:"Create or Join Room"
    },
    en: {
        search_text:"Add Contact or Group"
    }
}
  return (
    <main className="flex h-screen">
     
         <LeftSection language={language[settings.lang]} settings={settings} setSettings={setSettings} socketRef={socketRef} rooms={rooms}/>
      
        <ChatSection language={language[settings.lang]} /> 
    </main>
  );
}
