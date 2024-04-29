"use client";
import { faCamera,faMicrophone,faPhone,faPlus, faVideo } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState,useEffect } from 'react';



export default function ChatSection() {
    const [text,setText] = useState("")
    const [messages,setMessages] = useState([
        {
            isSent: true,
            message: "Test 1",
            date: "23:52 PM"
        },
        {
            isSent: false,
            message: "Test 1",
            date: "23:52 PM",
            pdp: "/a.jpg",
            name: "Mohammed"
        },
        {
            isSent: true,
            message: "Test 1",
            date: "23:52 PM"
        },
        {
            isSent: true,
            message: "Test 1",
            date: "23:52 PM"
        },
    ])
    const handleSubmit = (e) =>{
        if (e.key === 'Enter' && text.length != 0 && text != " ") {
            
            const a =   {
                isSent: true,
                message: text,
                date: "23:52 PM"
            }
            setMessages(messages => [...messages, a]);
           
            setText("")
           
          }
    }
    const language = {
        fr: {
            type_text:"Ecrire un message ..."
        },
        en: {
            type_text:"Type a message ..."
        }
    }
    // const messages = [
       
    // ]
    return (
      <div class="w-3/4 relative dark:bg-[#1a202c]  h-screen">

            <div class="h-24 bg-[#fdfdfd] border-[#d8dae0] dark:border-[#3f465a] border-b-[1px] p-10 flex items-center dark:bg-[#1a202c] justify-between">
                <div class="flex items-center gap-4 ">
                    <div>
                   
                        <img src="/a.jpg" alt="" class="w-12 rounded-3xl"/>
                    </div>
                    <div>
                        <p class="font-bold dark:text-gray-200">Mohammed</p>
                        <p class="text-gray-500 text-xs text">Last seen 7h ago</p>
                    </div>
                    
                  
                </div>
                <div className='flex gap-4'>
                <FontAwesomeIcon size="lg" icon={faPhone} className="dark:text-gray-200 cursor-pointer"/>
                <FontAwesomeIcon size="lg" icon={faVideo} className="dark:text-gray-200 cursor-pointer"/>
                </div>

            </div>
         
            <div class="mx-9 flex flex-col  ">
                {messages.map((message)=>{
                    
                    if (message.isSent) {
                        return(
                            <div class="send-container w-fit self-end my-2">
                                <p class="bg-[#f1f2f4] w-fit py-[0.35rem] px-5 rounded-2xl text-[0.92rem]">{message.message}</p>
                                <p class="text-gray-500 text-xs text-right">{message.date}</p>
                            </div>
                        )
                    }else{
                        return(
                            <div class="rec-container flex gap-3 my-3">
                                <img src={message.pdp} alt="" class="w-12 rounded-xl shadow-lg"/>
                                <div>
                                    <p class="text-gray-500 text-sm text-left">{message.name} • {message.date}</p>
                                    <p class="bg-[#1786d8] shadow-md w-fit py-[0.35rem] px-5 rounded-2xl text-[0.92rem] text-white">{message.message}</p>
                                </div>
                            </div>
                        )
                    }
                })}
                {/* Received */}
                {/* <div class="rec-container flex gap-3 my-5">
                    <img src="/a.jpg" alt="" class="w-12 rounded-xl shadow-lg"/>
                    <div>
                        <p class="text-gray-500 text-sm text-left">Mohammed • 23:52 PM</p>
                        <p class="bg-[#1786d8] shadow-md w-fit py-[0.35rem] px-5 rounded-2xl text-[0.92rem] text-white">Test Message</p>
                    </div>
                </div> */}
            
             {/* Sent */}
                {/* <div class="send-container w-fit self-end my-5">
                    <p class="bg-[#f1f2f4] w-fit py-[0.35rem] px-5 rounded-2xl text-[0.92rem]">Test Message</p>
                    <p class="text-gray-500 text-xs text-right">23:52 PM</p>
                </div> */}
               

            </div>
         
            <div class="absolute bottom-0 left-0 h-28 w-full  dark:border-[#3f465a] border-[#d8dae0] border-t-[1px] flex items-center justify-between p-10">
                <FontAwesomeIcon icon={faPlus} size="lg" className="text-[#1786d8] bg-[#f1f2f4] p-4 rounded-3xl dark:bg-[#262d3b]"/>
                {/* <i class="fa-solid fa-plus text-[#1786d8] bg-[#f1f2f4] p-4 rounded-3xl" ></i> */}
                <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => {handleSubmit(e)}} type="text" class="w-[88%] h-12 rounded-3xl bg-[#f1f2f4] text-gray-700 outline-none px-6 dark:bg-[#262d3b] dark:text-white" placeholder="Type a message ...."/>
                {/* <i class="fa-solid fa-microphone text-[24px]"></i>
                <i class="fa-solid fa-camera text-[24px]"></i> */}
                <FontAwesomeIcon size="lg" icon={faMicrophone} className="dark:text-gray-200"/>
                <FontAwesomeIcon icon={faCamera} size="lg" className='dark:text-gray-200'/>
            </div>
        </div>
    );
  }
  