"use client";
import { faCamera,faCircle,faEllipsis,faPlus, faRotate } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Settings from './Settings'
import { useState,useEffect,useRef } from 'react';
import Peer from "simple-peer";
import useSound from 'use-sound'
// import mySound from '../../public/notif_sound.mp3'
import { v1 as uuid } from 'uuid';

export default function Home({language, settings,setSettings, socketRef, roomInfos, setRoomInfos}) {

    const [roomID, setRoomID] = useState("")
    const peersRef = useRef([]);
    const [playSound] = useSound("/notif_sound.mp3")

    const randomRoomID = () => {
        setRoomID(uuid().slice(0,23))
    }
    const playNotificationSound = () =>{
        if(settings.notificationSound){
            playSound()
        }
    }
    const joinRoom = () =>{
      
        socketRef.current.emit("join room", roomID);
        setRoomInfos({...roomInfos, roomID: roomID})
        socketRef.current.on('all users', users => {
            
            users.forEach(userID => {

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
                    peer: peer
                 
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
             
             })
            setRoomInfos(roomInfos => ({
                ...roomInfos,
                peers: newm
            }));

        });

        socketRef.current.on("receiving returned signal", payload => {
            const item = peersRef.current.find(p => p.peerID === payload.id);
            item.peer.signal(payload.signal);
        });


        
        setRoomID("")
    }
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
            const newm = roomInfos.messages
            console.log(data)
            const decoder = new TextDecoder();
            const msg = decoder.decode(data).split("::/::")
            const date = new Date()
            newm.push({
                type: "msg",
                pdp: msg[0],
                name: msg[1],
                isSent: false,
                message: msg[2],
                date: date.getHours() + ":" + date.getMinutes()
            })
          
    
            setRoomInfos(roomInfos => ({
                ...roomInfos,
                messages: newm
            }));
            playNotificationSound()
        })

        return peer;
    }

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
            const newm = roomInfos.messages
            const decoder = new TextDecoder();
            const msg = decoder.decode(data).split("::/::")
            const date = new Date()
            newm.push({
                type: "msg",
                pdp: msg[0],
                name: msg[1],
                isSent: false,
                message: msg[2],
                date: date.getHours() + ":" + date.getMinutes()
            })
          
    
            setRoomInfos(roomInfos => ({
                ...roomInfos,
                messages: newm
            }));
            playNotificationSound()
          
        })
        peer.signal(incomingSignal);

        return peer;
    }


 
   
    return (
        <div class="w-1/4 bg-[#fdfdfd] border-[#d8dae0] dark:border-[#3f465a] border-r-[1px] dark:bg-[#1a202c]">
    
        <div class="h-24 bg-[#fdfdfd] border-[#d8dae0] border-b-[1px] flex items-center justify-between px-4 dark:bg-[#1a202c] dark:border-[#3f465a]">
            <div class="flex items-center gap-5">
                <img src={settings.profilePicture} alt="" class="w-16 h-16 rounded-full"/>
                <p class="font-bold text-lg text-gray-800 dark:text-gray-200">{settings.userName}</p>
            </div>
            <Settings settings={settings} setSettings={setSettings} language={language}/>
            

        </div>
     
        <div class="h-14 bg-[#f1f2f4] flex items-center justify-center border-b-[1px] dark:bg-[#262d3b] dark:border-[#3f465a]">
            <div class=" bg-white h-8 rounded-2xl px-5 flex items-center justify-between gap-3 w-full mx-7 dark:bg-[#3e4457]">
            <div class="flex items-center gap-5 w-full">
                <FontAwesomeIcon icon={faPlus} size="lg" className="text-center dark:text-gray-200 cursor-pointer" onClick={() => joinRoom()}/>
                <input type="text" class="text-gray-700 outline-none dark:bg-[#3e4457] dark:text-gray-200 w-full" placeholder={language.search_text} onChange={(e) => setRoomID(e.target.value)} value={roomID}/>
            </div>
            <FontAwesomeIcon icon={faRotate} size="lg" className="text-center dark:text-gray-200 cursor-pointer" onClick={() => randomRoomID()}/>
            </div>
        </div>
     
        <div class="items-center">  
            <h2 className='text-gray-600 text-lg ml-3 my-3 font-semibold dark:text-gray-200'>Online peers:</h2>
         
            {roomInfos.peers.map((peer)=>{
                return (
                    <div class="bg-[#e6f2fa] dark:hover:bg-[#272b3a] dark:bg-[#313648] border-[#d8dae0] dark:border-[#3f465a] border-b-[1px] h-24 flex items-center justify-between">
                        <div class="flex items-center">
                            <div class="mx-4">
                                <img src={peer.profile_picture} alt="" class="w-16 rounded-2xl"/>
        
                            </div>
                            <div>
                                <p class="text-gray-800 font-bold dark:text-gray-400">{peer.name}</p>
                                <p class="text-gray-600 text-[13px] font-semibold dark:text-gray-200 "><FontAwesomeIcon icon={faCircle} size="md" className="text-center text-green-500 mr-2 animate-pulse"/>Online</p>
                            </div>
                        </div>
                        
                        <div class="mx-4">
                        <FontAwesomeIcon icon={faEllipsis} size="lg" className="text-center cursor-pointer dark:text-gray-200"/>
                        </div>
                </div>
                )
            })}
             {roomInfos.roomID != ""  && (
                <div class="w-full  flex flex-col items-center mt-10">
                    <div class=" inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white" role="status">
                        <span class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                        

                    </div>    
                    <p class="text-gray-800  dark:text-gray-400 mt-2">Looking for more peers ...</p>        
                </div>

               
            )}

            
    
        </div>
     
    </div>
    );
  }
  