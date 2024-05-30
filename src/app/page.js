"use client"
import Image from "next/image";
import LeftSection from "../components/LeftSection"
import ChatSection from "../components/ChatSection"
import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import { generateUsername } from "unique-username-generator";
import { generateKeyPair,encryptMessage } from "../services/encryption"

export default function Home() {

  const socketRef = useRef();

  const [settings,setSettings] = useState({
    darkmode: true,
    lang: 'en',
    notificationSound: true,
    notifications: true,
    userName: "",
    profilePicture: "/user.jpg",
    leftSectionStatus: false,
    publicKey: '',
    privateKey: ''
  })

  const [roomInfos, setRoomInfos] = useState({
    
    roomID: "",
    messages: [],
    peers: []
  })


  useEffect(async () => {
    if (typeof window !== 'undefined') {
      const sett = JSON.parse(localStorage.getItem('settings'));
      if (sett) {
        // if(sett.publicKey == undefined){
         
        // }else{
        //   setSettings(sett);
        // }
        const key = await generateKeyPair()
        setSettings({...sett, publicKey: key[0], privateKey: key[1]})
  
        
      }
      socketRef.current = io.connect("http://localhost:8000");
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
        search_text:"Créer ou rejoindre un groupe",
        settings_name: "Parametres"
    },
    en: {
        search_text:"Create or Join Room",
        settings_name: "Settings"
    }
  }
  return (
    <main className="flex h-screen">
     
         <LeftSection language={language[settings.lang]} settings={settings} setSettings={setSettings} socketRef={socketRef} roomInfos={roomInfos} setRoomInfos={setRoomInfos} />
      
        <ChatSection language={language[settings.lang]} roomInfos={roomInfos} setRoomInfos={setRoomInfos} settings={settings} setSettings={setSettings} socketRef={socketRef}/> 
    </main>
  );
}
