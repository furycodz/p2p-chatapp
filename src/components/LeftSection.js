"use client";
import { faCamera,faCircle,faEllipsis,faGear,faMagnifyingGlass,faMicrophone,faMoon,faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Settings from './Settings'
import { useState,useEffect,useRef } from 'react';

import io from "socket.io-client";

export default function Home({language, settings,setSettings, socketRef, sendChannel, roomInfos, setRoomInfos}) {

    const [roomID, setRoomID] = useState("")

    const peerRef = useRef();
   
    const otherUser = useRef();

    
    const joinRoom = (e) =>{
      
        socketRef.current.emit("join room", roomID);

        socketRef.current.on('other user', userID => {
            callUser(userID);
            otherUser.current = userID;
        });

        socketRef.current.on("user joined", userID => {
            otherUser.current = userID;
        });

        socketRef.current.on("offer", handleOffer);

        socketRef.current.on("answer", handleAnswer);

        socketRef.current.on("ice-candidate", handleNewICECandidateMsg);
        
        setRoomID("")
    }
   
    function callUser(userID) {
        peerRef.current = createPeer(userID);
        sendChannel.current = peerRef.current.createDataChannel("sendChannel")
        sendChannel.current.onmessage = handleReceiveMessage;
    }
    function handleReceiveMessage(e) {
        setRoomInfos({...roomInfos,messages: [...roomInfos.messages,{
            isSent: false,
            message: e.data,
            date: "23:52 PM"
        }]})
      
    }

    function createPeer(userID) {
        const peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: "stun:stun.stunprotocol.org"
                },
                {
                    urls: 'turn:numb.viagenie.ca',
                    credential: 'muazkh',
                    username: 'webrtc@live.com'
                },
            ]
        });

        peer.onicecandidate = handleICECandidateEvent;
        peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID);

        return peer;
    }

    function handleNegotiationNeededEvent(userID) {
        peerRef.current.createOffer().then(offer => {
            return peerRef.current.setLocalDescription(offer);
        }).then(() => {
            const payload = {
                target: userID,
                caller: socketRef.current.id,
                sdp: peerRef.current.localDescription
            };
            socketRef.current.emit("offer", payload);
        }).catch(e => console.log(e));
    }

    function handleOffer(incoming) {
        peerRef.current = createPeer();
        peerRef.current.ondatachannel = (event) =>{
            sendChannel.current = event.channel;
            sendChannel.current.onmessage = handleReceiveMessage
        }
        const desc = new RTCSessionDescription(incoming.sdp);
        peerRef.current.setRemoteDescription(desc).then(() => {
        }).then(() => {
            return peerRef.current.createAnswer();
        }).then(answer => {
            return peerRef.current.setLocalDescription(answer);
        }).then(() => {
            const payload = {
                target: incoming.caller,
                caller: socketRef.current.id,
                sdp: peerRef.current.localDescription
            }
            socketRef.current.emit("answer", payload);
        })
    }

    function handleAnswer(message) {
        const desc = new RTCSessionDescription(message.sdp);
        peerRef.current.setRemoteDescription(desc).catch(e => console.log(e));
    }

    function handleICECandidateEvent(e) {
        if (e.candidate) {
            const payload = {
                target: otherUser.current,
                candidate: e.candidate,
            }
            socketRef.current.emit("ice-candidate", payload);
        }
    }

    function handleNewICECandidateMsg(incoming) {
        const candidate = new RTCIceCandidate(incoming);

        peerRef.current.addIceCandidate(candidate)
            .catch(e => console.log(e));
    }
    function handleChange(e) {
        setText(e.target.value);
    }

   
    return (
        <div class="w-1/4 bg-[#fdfdfd] border-[#d8dae0] dark:border-[#3f465a] border-r-[1px] dark:bg-[#1a202c]">
    
        <div class="h-24 bg-[#fdfdfd] border-[#d8dae0] border-b-[1px] flex items-center justify-between px-4 dark:bg-[#1a202c] dark:border-[#3f465a]">
            <div class="flex items-center gap-5">
                <img src="/b.jpg" alt="" class="w-16 rounded-2xl"/>
                <p class="font-bold text-lg text-gray-800 dark:text-gray-200">Badr EL HOUARI</p>
            </div>
            <Settings settings={settings} setSettings={setSettings} language={language}/>
            

        </div>
     
        <div class="h-14 bg-[#f1f2f4] flex items-center justify-center border-b-[1px] dark:bg-[#262d3b] dark:border-[#3f465a]">
            <div class=" bg-white h-8 rounded-2xl px-5 flex items-center gap-3 w-full mx-7 dark:bg-[#3e4457]">
                <FontAwesomeIcon icon={faPlus} size="lg" className="text-center dark:text-gray-200 cursor-pointer" onClick={() => joinRoom()}/>
                <i class="fa-solid fa-magnifying-glass text-center"></i>
                <input type="text" class="text-gray-700 outline-none dark:bg-[#3e4457] dark:text-gray-200" placeholder={language.search_text} onChange={(e) => setRoom(e.target.value)}/>

            </div>
        </div>
     
        <div class="">  
            {roomInfos.peers.map((peer)=>{
                return (
                    <div class="bg-[#e6f2fa] cursor-pointer dark:hover:bg-[#272b3a] dark:bg-[#313648] border-[#d8dae0] dark:border-[#3f465a] border-b-[1px] h-24 flex items-center justify-between">
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
         

            
    
        </div>
     
    </div>
    );
  }
  