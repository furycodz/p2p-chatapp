"use client";
import Gun from 'gun';
import { faChevronDown,faChevronUp,faCircle,faEllipsis,faPlus, faRotate } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Settings from './Settings'
import { useState,useRef } from 'react';
import Peer from "simple-peer";
import useSound from 'use-sound'
import { v1 as uuid } from 'uuid';
import { AES, enc } from 'crypto-js';
import { generateSymetricalKey} from '../services/encryption'
import { sendNotification } from '@/services/notifications';


const gun = Gun(['http://localhost:8000/gun']);


export default function Home({language, settings,setSettings, socketRef, roomInfos, setRoomInfos}) {

    const [roomID, setRoomID] = useState("")
    let sharedKeyy = ""
    const peersRef = useRef([]);
    const [playSound] = useSound("/notif_sound.mp3")

    //Function to generate a Random RoomID
    const randomRoomID = () => {
        setRoomID(uuid().slice(0,23))
    }

    //Function to play Notification Sound 
    const playNotificationSound = () =>{
        if(settings.notificationSound){
            playSound()
        }
    }

    //Function to handle joining a room
    const joinRoom = () =>{
     
        socketRef.current.emit("join room", [roomID,settings.publicKey]);
        setRoomInfos({...roomInfos, roomID: roomID})    

        socketRef.current.on('all users', users => {
            if(users.length == 0){
                const key = generateSymetricalKey()
                setSettings({...settings, sharedKey: key})
                sharedKeyy = key
              
            }
            users.forEach(user => {
                const userID = user[0]
                const publicKey = user[1]
                const peer = createPeer(userID, socketRef.current.id)
                peersRef.current.push({
                    peerID: userID,
                    peer,
                })
                const newm = roomInfos.peers
                newm.push({
                   
                    id: userID,
                    profile_picture: "/a.jpg",
                    name: userID,
                    peer: peer,
                    publicKey: publicKey
                 
                 })

                setRoomInfos(roomInfos => ({
                    ...roomInfos,
                    peers: newm
                }));

            })
            

        });

        socketRef.current.on("user joined", payload => {
          
            const peer = addPeer(payload.signal, payload.callerID);
         
            peersRef.current.push({
                peerID: payload.callerID,
                peer,
            })

            const newm = roomInfos.peers
            newm.push({
                
                id: payload.callerID,
                profile_picture: "/a.jpg",
                name: payload.callerID,
                peer:peer,
                publicKey: payload.publicKey
             
             })
            setRoomInfos(roomInfos => ({
                ...roomInfos,
                peers: newm
            }));
            if(sharedKeyy.length > 0){
                peer.write(JSON.stringify({
                    type: "key",
                    sharedKey: sharedKeyy
                }))
            }
            
                
             
           

        });

        socketRef.current.on("receiving returned signal", payload => {
            const item = peersRef.current.find(p => p.peerID === payload.id);
            item.peer.signal(payload.signal);
        });


        
        setRoomID("")
    }
    //Function to create a new Peer & handle data receiving
    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            config: {
                iceServers: [
                    {
                        urls: "stun:stun.stunprotocol.org"
                    },
               
                ]
            }
        });

        peer.on("signal", signal => {
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
        })
        peer.on('data', data => {
            const jsondata = JSON.parse(data.toString())
            const newm = roomInfos.messages
            const date = new Date()
         
            if(jsondata.type == "img"){
                sendNotification("You have received an image.")
                newm.push({
                    type: "img",
                    pdp: jsondata.pdp,
                    name: jsondata.userName,
                    isSent: false,
                    
                    imgContent: AES.decrypt(jsondata.imgSrc, sharedKeyy).toString(enc.Utf8),
                    date: date.getHours() + ":"+ (date.getMinutes() < 10 ? "0": "") + date.getMinutes()
                })
            }else if(jsondata.type == "msg"){
                sendNotification(jsondata.userName+":"+ AES.decrypt(jsondata.message, sharedKeyy).toString(enc.Utf8))
                
                newm.push({
                    type: "msg",
                    pdp: jsondata.pdp,
                    name: jsondata.userName,
                    isSent: false,
                    // message: jsondata.message,
                    message: AES.decrypt(jsondata.message, sharedKeyy).toString(enc.Utf8),
                    date: date.getHours() + ":" + (date.getMinutes() < 10 ? "0": "")+ date.getMinutes()
                })
            }else if(jsondata.type == "file"){
                sendNotification("You have received a file.")
                newm.push({
                    type: "file",
                    pdp: jsondata.pdp,
                    name: jsondata.userName,
                    isSent: false,
                    
                    src: AES.decrypt(jsondata.src, sharedKeyy).toString(enc.Utf8),
                    fileName: jsondata.fileName,
                    fileSize: jsondata.fileSize,
                    date: date.getHours() + ":"+ (date.getMinutes() < 10 ? "0": "") + date.getMinutes()
                })
            }else if(jsondata.type == "key"){
                setSettings({...settings, sharedKey: jsondata.sharedKey})
                sharedKeyy = jsondata.sharedKey
            }
            
          
    
            setRoomInfos(roomInfos => ({
                ...roomInfos,
                messages: newm
            }));
            if(jsondata.type != "key"){
                playNotificationSound()
            }
        })

        return peer;
    }
    //Function to add a Peer and handle data receiving
    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            config: {
                        iceServers: [
                            {
                                urls: "stun:stun.stunprotocol.org"
                            },
                       
                        ]
                    }
        })
        peer.on("signal", signal => {
            socketRef.current.emit("returning signal", { signal, callerID })
        })
        peer.on('data', data => {
            const jsondata = JSON.parse(data.toString())
            const newm = roomInfos.messages
            const date = new Date()
            if(jsondata.type == "img"){
                sendNotification("You have received an image.")
                newm.push({
                    type: "img",
                    pdp: jsondata.pdp,
                    name: jsondata.userName,
                    isSent: false,
                    imgContent: AES.decrypt(jsondata.imgSrc, sharedKeyy).toString(enc.Utf8),
                    date: date.getHours() + ":" + (date.getMinutes() < 10 ? "0": "")+ date.getMinutes()
                })
            }else if(jsondata.type == "msg"){
                sendNotification(jsondata.userName+":"+ AES.decrypt(jsondata.message, sharedKeyy).toString(enc.Utf8))
                
                newm.push({
                    type: "msg",
                    pdp: jsondata.pdp,
                    name: jsondata.userName,
                    isSent: false,
                    // message: jsondata.message,
                    message: AES.decrypt(jsondata.message, sharedKeyy).toString(enc.Utf8),
                    date: date.getHours() + ":" + (date.getMinutes() < 10 ? "0": "")+ date.getMinutes()
                })
            }else if(jsondata.type == "file"){
                sendNotification("You have received a file.")
                newm.push({
                    type: "file",
                    pdp: jsondata.pdp,
                    name: jsondata.userName,
                    isSent: false,
                    src: AES.decrypt(jsondata.src, sharedKeyy).toString(enc.Utf8),
                    fileName: jsondata.fileName,
                    fileSize: jsondata.fileSize,
                    date: date.getHours() + ":"+ (date.getMinutes() < 10 ? "0": "") + date.getMinutes()
                })
            }else if(jsondata.type == "key"){
                setSettings({...settings, sharedKey: jsondata.sharedKey})
                sharedKeyy = jsondata.sharedKey
                
            }
            
            setRoomInfos(roomInfos => ({
                ...roomInfos,
                messages: newm
            }));
            if(jsondata.type != "key"){
                playNotificationSound()
            }
            
        })
        peer.signal(incomingSignal);
        return peer;
    }

    return (
        <div className={"transition-all md:w-1/3 lg:w-1/4 bg-[#fdfdfd] border-[#d8dae0] dark:border-[#3f465a] border-r-[1px] dark:bg-[#1a202c]  md:block"}>
       
        <div className="h-24 bg-[#fdfdfd] border-[#d8dae0] border-b-[1px] flex items-center justify-between px-4 dark:bg-[#1a202c] dark:border-[#3f465a]">
            <div className="flex items-center gap-5">
                <img src={settings.profilePicture} alt="" className="w-16 h-16 rounded-full"/>
                <p className="font-bold text-lg text-gray-800 dark:text-gray-200" onClick={() => sendNotification("aaa")}>{settings.userName}</p>
            </div>
            <Settings settings={settings} setSettings={setSettings} language={language}/>
            

        </div>
       
        <div className="h-14 bg-[#f1f2f4] flex items-center justify-center border-b-[1px] dark:bg-[#262d3b] dark:border-[#3f465a]">
            <div className=" bg-white h-8 rounded-2xl px-5 flex items-center justify-between gap-3 w-full mx-7 dark:bg-[#3e4457]">
            <div className="flex items-center gap-5 w-full">
                <FontAwesomeIcon icon={faPlus} size="lg" className="text-center dark:text-gray-200 cursor-pointer" onClick={() => joinRoom()}/>
                <input type="text" className="text-gray-700 outline-none dark:bg-[#3e4457] dark:text-gray-200 w-full" placeholder={language.search_text} onChange={(e) => setRoomID(e.target.value)} value={roomID}/>
            </div>
            <FontAwesomeIcon icon={faRotate} size="lg" className="text-center dark:text-gray-200 cursor-pointer" onClick={() => randomRoomID()}/>
            </div>
            {settings.leftSectionStatus ? (
                <FontAwesomeIcon icon={faChevronUp} size="lg" className="md:hidden text-center mr-4 text-[#1786d8] cursor-pointer" onClick={() => setSettings({...settings, leftSectionStatus: !settings.leftSectionStatus})}/>

            ): (
                <FontAwesomeIcon icon={faChevronDown} size="lg" className="md:hidden text-center mr-4 text-[#1786d8] cursor-pointer" onClick={() => setSettings({...settings, leftSectionStatus: !settings.leftSectionStatus})}/>

            )}

        </div>
       
            <div className="hidden md:block items-center">  
            <h2 className='text-gray-600 text-lg ml-3 my-3 font-semibold dark:text-gray-200 cursor-pointer' >{language.online_peers} </h2>
         
            {roomInfos.peers.map((peer, index)=>{
                return (
                    <div key={index} className="flex bg-[#e6f2fa] dark:hover:bg-[#272b3a] dark:bg-[#313648] border-[#d8dae0] dark:border-[#3f465a] border-b-[1px] h-24  items-center justify-between" >
                        <div className="flex items-center">
                            <div className="mx-4">
                              
        
                            </div>
                            <div>
                                <p className="text-gray-800 font-bold dark:text-gray-400">{peer.name}</p>
                                <p className="text-gray-600 text-[13px] font-semibold dark:text-gray-200 "><FontAwesomeIcon icon={faCircle} size="md" className="text-center text-green-500 mr-2 animate-pulse"/>Online</p>
                            </div>
                        </div>
                        
                        <div className="mx-4">
                        <FontAwesomeIcon icon={faEllipsis} size="lg" className="text-center cursor-pointer dark:text-gray-200"/>
                        </div>
                </div>
                )
            })}
             {roomInfos.roomID != ""  && (
                <div className="hidden md:flex w-full flex-col items-center mt-10">
                    <div className=" inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white" role="status">
                        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                        

                    </div>    
                    <p className="text-gray-800  dark:text-gray-400 mt-2">Looking for more peers ...</p>        
                </div>

               
            )}

            
    
            </div>
   
        
     
    </div>
    );
  }
  