"use client"
import Image from "next/image";
import LeftSection from "../components/LeftSection"
import ChatSection from "../components/ChatSection"
import { useState, useEffect, useRef, useCallback } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import { generateUsername } from "unique-username-generator";
import { generateKeyPair,encryptMessage } from "../services/encryption"
import { requestPermission } from "@/services/notifications";

export default function Home() {

  const socketRef = useRef();
  
  // User Settings
  const [settings,setSettings] = useState({
    darkmode: true,
    lang: 'en',
    notificationSound: true,
    notifications: true,
    userName: "",
    profilePicture: "/user.jpg",
    leftSectionStatus: false,
    publicKey: '',
    privateKey: '',
    sharedKey: ''
  })

  // Room settings
  const [roomInfos, setRoomInfos] = useState({
    
    roomID: "",
    messages: [],
    peers: []
  })

  // React hook to load settings & connect to Signaling server
  useEffect(async() => {
    if (typeof window !== 'undefined') {
      
      const sett = JSON.parse(localStorage.getItem('settings'));
      if (sett) {
        if(sett.publicKey == undefined){
         
        }else{
          setSettings(sett);
        }
        const key = await generateKeyPair()
        setSettings({...sett, publicKey: key[0], privateKey: key[1]})
  
        
      }
      socketRef.current = io.connect("http://localhost:8000");
    }
    
    
  }, []);

  // React hook to save settings to local Storage
  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));

  }, [settings]);

  // React hook to handle Dark/Ligh Mode
  useEffect(() => {
   
      if (settings.darkmode) {
          document.body.classList.add("dark")
      } else {
          document.body.classList.remove("dark")
      }
     
    }, [settings.darkmode]);

  const requestNotificationPermission = useCallback(requestPermission, [])
 
  // Ask for notification Permission
  useEffect(() => {
    if('Notification' in window){
      requestNotificationPermission()
    }
  }, [requestNotificationPermission])

  // App translation to 4 languages
  const language = {
    fr: {
        search_text:"Créer ou rejoindre un groupe",
        online_peers :"Peers en ligne:",
        settings_name: "Parametres",
        room: "Groupe :",
        not_connected: "Non connecté",
        input_text: "Tapez un message ....",
        settings_name: "Paramètres ",
        settings_username: "Nom d'utilisateur",
        settings_profile_picture: "Image du profil",
        settings_darkmode: "Mode sombre",
        settings_notifications: "Notifications",
        settings_message_sound: "Son Message",
        settings_language: "Langue",
        settings_select_language: "Sélectionner la langue",
    },
    
    en: {
        search_text:"Create or Join Room",
        online_peers :"Online peers:",
        room: "Room :",
        not_connected: "Not connected",
        input_text: "Type a message ....",
        settings_name: "Settings",
        settings_username: "Username",
        settings_profile_picture: "Profile Picture",
        settings_darkmode: "Dark mode",
        settings_notifications: "Notifications",
        settings_message_sound: "Message Sound",
        settings_language: "Language",
        settings_select_language: "Select Language",
    },
    ar: {
        search_text:"إنشاء غرفة أو الانضمام إلى غرفة",
        online_peers :":الأقران أونلاين",
        room: "غرفة :",
        not_connected: "غير متصل",
        input_text: "اكتب رسالة ....",
        settings_name: "الإعدادات",
        settings_username: "اسم المستخدم",
        settings_profile_picture: "صورة الملف الشخصي",
        settings_darkmode: "الوضع المظلم",
        settings_notifications: "الإشعارات",
        settings_message_sound: "صوت الرسالة",
        settings_language: "اللغة",
        settings_select_language: "تحديد اللغة",
    },
    tf: {
        search_text: "ⵣⴰⴽⴽⴰⵜ ⵓ ⴇⵔ ⵜⵜⴰⵎⴰⵍⵉⵜ ⵏ ⵉⵎⵣⴰⵣⵉⵜ", 
        online_peers: "ⵉⵎⵣⴰⵣⵉⵜ ⴰⵙⵏⴰⵏ:", 
        room: "ⵜⵜⴰⵎⴰⵍⵉⵜ :", 
        not_connected: "ⴰⵙⵕⴰⵏ ⵢⴻⵔ ⵎⵅⵙⵏ", 
        input_text: "ⴰⵙⴳ ⵏ ⵉⵏⵄⵉⵖ ....", 
        settings_name: "ⴰⵙⵍⵜⴰⴽⵙ", 
        settings_username: "ⵜⵜⵙⴽⴷⴰⵢⵏ", 
        settings_profile_picture: "ⵖⵔⴼⵉ ⴰⵣⴹⵉⵖⴹ", 
        settings_darkmode: "ⵜⵜⵙⴽⴷⴷⴱⴱⵏ ⵜⵉ⵼ⴰⵔⴷⵜ", 
        settings_notifications: "ⵏⵏⵖⵎⵉⵜⵙⵏⵙ", 
        settings_message_sound: "ⵏⵜⵜⵊ ⵜⵜⵙⵡ ⵙⵏⵙⴰ", 
        settings_language: "ⵖⵉⵥⵉⵏ", 
        settings_select_language: "ⴰⵏⴽⵔ ⵉⵥⵉⵏ"
    }
  }
  return (
    <main className="flex flex-col md:flex-row h-screen overflow-hidden">
     
         <LeftSection language={language[settings.lang]} settings={settings} setSettings={setSettings} socketRef={socketRef} roomInfos={roomInfos} setRoomInfos={setRoomInfos} />
      
        <ChatSection language={language[settings.lang]} roomInfos={roomInfos} setRoomInfos={setRoomInfos} settings={settings} setSettings={setSettings} socketRef={socketRef}/> 
    </main>
  );
}
