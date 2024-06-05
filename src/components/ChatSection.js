"use client";
import { faCamera,faChevronRight,faClipboard,faDownload,faFile,faMicrophone,faPaste,faPhone,faPlus, faRotate, faVideo } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Romanesco } from 'next/font/google';
import { useState,useEffect } from 'react';
import { useFilePicker, FileAmountLimitValidator } from 'use-file-picker';
import Image from './messages/Image';
import {encryptMessage, decryptMessage} from '../services/encryption'
import { AES, enc } from 'crypto-js';
import { storeMessage, getMessages } from '../services/storage'

export default function ChatSection({socketRef,roomInfos,setRoomInfos, settings, setSettings, language}) {
    const [text,setText] = useState("")
    const [fileBase64, setFileBase64] = useState("")
    function downloadBase64File(base64Data, filename) {
        const [metadata, data] = base64Data.split(';base64,');
       
        const mimeType = metadata.split(':')[1];
        const byteString = atob(data);

        const byteNumbers = new Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) {
            byteNumbers[i] = byteString.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const fileBlob = new Blob([byteArray], { type: mimeType });

        const blobUrl = URL.createObjectURL(fileBlob);
   
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();

        URL.revokeObjectURL(blobUrl);
        document.body.removeChild(link);
    }
    const { openFilePicker, filesContent, loading } = useFilePicker({
        multiple: false,
        onFilesSuccessfullySelected: ({ plainFiles, filesContent }) => {
            
            const reader = new FileReader();
            reader.onload = () => {
                console.log(reader.result)
                  
                const newm = roomInfos.messages
                const date = new Date()
                if(plainFiles[0].type.startsWith('image/')){
                    newm.push({
                        type: "img",
                        isSent: true,
                        imgContent: URL.createObjectURL(plainFiles[0]),
                        date: date.getHours() + ":"+ (date.getMinutes() < 10 ? "0": "") + date.getMinutes()
                    })
                    roomInfos.peers.forEach(p => {
                        p.peer.send(AES.encrypt(JSON.stringify({
                            type: "img",
                            pdp: settings.profilePicture,
                            userName: settings.userName,
                            imgSrc: reader.result,
                            fType: plainFiles[0].type,
                            fileName: plainFiles[0].name
                        }), "secret").toString())
                        // p.peer.send(encryptMessage(p.publicKey,JSON.stringify({
                        //     type: "img",
                        //     pdp: settings.profilePicture,
                        //     userName: settings.userName,
                        //     imgSrc: reader.result,
                        //     fType: plainFiles[0].type,
                        //     fileName: plainFiles[0].name
                        // })).toString())
                    });
                
                }else{
                    newm.push({
                        type: "file",
                        isSent: true,
                        src: reader.result,
                        date: date.getHours() + ":"+ (date.getMinutes() < 10 ? "0": "") + date.getMinutes(),
                        fileName: plainFiles[0].name,
                        fileSize: "10KB"
                    })
                    roomInfos.peers.forEach(p => {
                        p.peer.send(AES.encrypt(JSON.stringify({
                            type: "file",
                            pdp: settings.profilePicture,
                            userName: settings.userName,
                            src: reader.result,
                            fType: plainFiles[0].type,
                            fileName: plainFiles[0].name,
                            fileSize: "10KB"
                        }),"secret").toString())
                        // p.peer.send(encryptMessage(p.publicKey,JSON.stringify({
                        //     type: "file",
                        //     pdp: settings.profilePicture,
                        //     userName: settings.userName,
                        //     src: reader.result,
                        //     fType: plainFiles[0].type,
                        //     fileName: plainFiles[0].name,
                        //     fileSize: "10KB"
                        // })).toString())
                    });
                }

            
        
                setRoomInfos(roomInfos => ({
                    ...roomInfos,
                    messages: newm
                }));
               
         
                
            };
            reader.readAsDataURL(plainFiles[0]);
            
         
          
        
           
          }
    });
    const getMessag = () => {
        socketRef.current.emit('get messages', roomInfos.roomID, (messages) => {
            console.log('Messages:', messages);

        
        });
    }
    const getMessagee = () => {
        console.log("aaaa")
        socketRef.current.emit('get messages', roomInfos.roomID, (messages) => {
            console.log(messages)
            if(messages){
                const newm = roomInfos.messages
                messages.forEach(mess => {
                    if(mess){
                        if(mess.userName == settings.userName){
                            const messa = {
                                type: "msg",
                                isSent: true,
                                message: mess.message,
                                date: mess.date
                            }  
                            newm.push((messa))
                        }else{
                            const messa = {
                                type: "msg",
                                isSent: false,
                                message: mess.message,
                                date: mess.date,
                                pdp: mess.pdp,
                                name: mess.userName
                            }  
    
                           
                            newm.push((messa))
                        }
                        console.log(mess.message)
                    }
                 
               
                    
                })
                setRoomInfos(roomInfos => ({
                    ...roomInfos,
                    messages: newm
                }));
            }
        
        
        
        });
    }
    const handleSubmit = (e) =>{
        if (e.key === 'Enter' && text.length != 0 && text != " ") {
            console.log(settings.sharedKey)
       
            roomInfos.peers.forEach(p => {
                const a = AES.encrypt(text, settings.sharedKey).toString()
                console.log(a)
                p.peer.send(JSON.stringify({
                    type: "msg",
                    pdp: settings.profilePicture,
                    userName: settings.userName,
                    message: a
                }))
                // const msg = await encryptMessage(p.publicKey,JSON.stringify({
                //     type: "msg",
                //     pdp: settings.profilePicture,
                //     userName: settings.userName,
                //     message: text
                // })).toString()
                // console.log(msg)
                // p.peer.send(AES.encrypt(JSON.stringify({
                //     type: "msg",
                //     pdp: settings.profilePicture,
                //     userName: settings.userName,
                //     message: text
                // }), settings.sharedKey).toString())
                // p.peer.send(encryptMessage(p.publicKey,JSON.stringify({
                //     type: "msg",
                //     pdp: settings.profilePicture,
                //     userName: settings.userName,
                //     message: text
                // })).toString())
            });
      

            const newm = roomInfos.messages
            const date = new Date()
            const mess = {
                type: "msg",
                isSent: true,
                message: text,
                date: date.getHours() + ":" + (date.getMinutes() < 10 ? "0": "") +date.getMinutes()
            }
            const messtoStore = {
                type: "msg",
                pdp: settings.profilePicture,
                userName: settings.userName,
                message: text,
                date: date.getHours() + ":" +(date.getMinutes() < 10 ? "0": "") + date.getMinutes()
            }
            newm.push(mess)
            storeMessage(socketRef, roomInfos.roomID, messtoStore)
    
            setRoomInfos(roomInfos => ({
                ...roomInfos,
                messages: newm
            }));
          


       
            setText("")
          }
    }


    return (
      <div className={"md:w-2/3 lg:w-3/4 relative dark:bg-[#1a202c]  h-screen overflow-hidden"}>

            {/* {settings.leftSectionStatus &&  */}
            <div className={"h-24 bg-[#fdfdfd] border-[#d8dae0] dark:border-[#3f465a] border-b-[1px] p-10 flex items-center dark:bg-[#1a202c] justify-between"}>
                
            <div className=" items-center gap-4  " >
                
                <div>
                    {/* <p className="font-bold dark:text-gray-200">{roomInfos.roomName}</p> */}
                    <p className="font-bold dark:text-gray-200" >{language.room} {roomInfos.roomID.length == 0 ? <span className=' dark:text-gray-400 text-sm'>{language.not_connected}</span>: <span className=' dark:text-gray-400 text-sm'>{roomInfos.roomID} <FontAwesomeIcon size="lg" icon={faPaste} className="dark:text-gray-500 cursor-pointer ml-2 hover:text-black" onClick={() => {navigator.clipboard.writeText(roomInfos.roomID)}}/></span>}</p>
                </div>
                <p className=" dark:text-gray-200 md:hidden">Online peers: <span className=' text-[#1786d8] font-bold'>{roomInfos.peers.length}</span></p>

                
            </div>
            <div className='flex gap-4'>
                <FontAwesomeIcon size="lg" icon={faRotate} className="dark:text-gray-200 cursor-pointer" onClick={() => getMessagee()}/>
            
            </div>

        </div>
            {/* } */}
            
         
            <div className="px-9 flex flex-col py-3 overflow-y-scroll h-[calc(100vh-22.5rem)] md:h-[calc(100vh-13rem)]">
                {roomInfos.messages.map((message, index)=>{
                    if(message.type == "msg"){
                       
                        if (message.isSent) {
                            return(
                                <div className="send-container w-fit self-end my-2" key={index}>
                                    <p className="bg-[#f1f2f4] w-fit py-[0.35rem] px-5 rounded-2xl text-[0.92rem]">{message.message}</p>
                                    <p className="text-gray-500 text-xs text-right">{message.date}</p>
                                </div>
                            )
                        }else{
                            return(
                                <div className="rec-container flex gap-3 my-3" key={index}>
                                    <img src={message.pdp} alt="" className="w-12 h-12 rounded-full shadow-lg"/>
                                    <div>
                                        <p className="text-gray-500 text-sm text-left">{message.name} • {message.date}</p>
                                        <p className="bg-[#1786d8] shadow-md w-fit py-[0.35rem] px-5 rounded-2xl text-[0.92rem] text-white">{message.message}</p>
                                    </div>
                                </div>
                            )
                        }
                    }else if(message.type == "img"){
                       
                        if (message.isSent){
                            return(
                                <div className="self-end mt-2" key={index}>
                                    <img src={message.imgContent} alt="" className="max-w-[400px] max-h-[400px] rounded-lg shadow-lg"/>
                                    
                                    <p className="text-gray-500 text-xs text-right">{message.date}</p>
                                      
                                </div>
                            )
                        }else{
                            return(
                                <div className="rec-container flex gap-3 my-3" key={index}>
                                    <img src={message.pdp} alt="" className="w-12 h-12 rounded-full shadow-lg"/>
                                    <div>
                                        <p className="text-gray-500 text-sm text-left">{message.name} • {message.date}</p>
                                        <img src={message.imgContent} alt="" className="max-w-[400px] max-h-[400px] rounded-lg shadow-lg"/>
                                    
                                    </div>
                                </div>
                                // <div className="flex flex-col w-fit" key={index}>
                                   
                                //     <p className="text-gray-500 text-xs text-right">{message.date}</p>
                                // </div>
                            )
                        }
                    }else if(message.type == "file"){
                     
                        if (message.isSent){
                            return(
                                <div className="self-end mt-2" key={index}>
                                    <div className="dark:bg-[#2d3647] rounded-lg w-30 flex items-center p-2 gap-3">
                                        <FontAwesomeIcon icon={faFile} size="2xl" className="text-[#1786d8]  " />                                          
                                        <div className="dark:bg-[#2d3647] rounded-lg w-30">
                                            <p className="text-gray-300 text-sm text-left">{message.fileName} </p>
                                        </div>
                                        <FontAwesomeIcon icon={faDownload} size="lg" className="text-[#1786d8] p-2 rounded-lg border-gray-700 border-[1px] cursor-pointer dark:bg-[#262d3a]" onClick={() => downloadBase64File(message.src, message.fileName)}/>     
                                    </div>
                                    <p className="text-gray-500 text-xs text-right">{message.date}</p>      
                                </div>
                            )
                        }else{
                            return(
                                <div className="rec-container flex gap-3 my-3" key={index}>
                                    <img src={message.pdp} alt="" className="w-12 h-12 rounded-full shadow-lg"/>
                                    <div>
                                        <p className="text-gray-500 text-sm text-left">{message.name} • {message.date}</p>
                                        <div className="dark:bg-[#2d3647] rounded-lg w-30 flex items-center p-2 gap-3">
                                            <FontAwesomeIcon icon={faFile} size="2xl" className="text-[#1786d8]  " />                                          
                                            <div className="dark:bg-[#2d3647] rounded-lg w-30">
                                                <p className="text-gray-300 text-sm text-left">{message.fileName} </p>
                                            </div>
                                            <FontAwesomeIcon icon={faDownload} size="lg" className="text-[#1786d8] p-2 rounded-lg border-gray-700 border-[1px] cursor-pointer dark:bg-[#262d3a]" onClick={() => downloadBase64File(message.src, message.fileName)}/>     
                                        </div>
                                    </div>
                                </div>
                                // <div className="flex flex-col w-fit" key={index}>
                                   
                                //     <p className="text-gray-500 text-xs text-right">{message.date}</p>
                                // </div>
                            )
                        }
                    }

                
                })}
       
            </div>
         
            <div className="z-10 absolute bottom-0 left-0 h-28 w-full  dark:border-[#3f465a] border-[#d8dae0] border-t-[1px] flex items-center justify-between p-10">
              
                <FontAwesomeIcon icon={faPlus} size="lg" className="text-[#1786d8] bg-[#f1f2f4] p-4 rounded-3xl dark:bg-[#262d3b] cursor-pointer" onClick={() => openFilePicker()}/>

                {/* <i className="fa-solid fa-plus text-[#1786d8] bg-[#f1f2f4] p-4 rounded-3xl" ></i> */}
                <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => {handleSubmit(e)}} type="text" className=" cursor-not-allowed w-[83%] lg:w-[90%] h-12 rounded-3xl bg-[#f1f2f4] text-gray-700 outline-none px-6 dark:bg-[#262d3b] dark:text-white" placeholder={language.input_text}/>
                {/* <i className="fa-solid fa-microphone text-[24px]"></i>
                <i className="fa-solid fa-camera text-[24px]"></i> */}
                {/* <FontAwesomeIcon size="lg" icon={faMicrophone} className="dark:text-gray-200" onClick={() => getMessag()}/>
                <FontAwesomeIcon icon={faCamera} size="lg" className='dark:text-gray-200'/> */}
            </div>
        </div>
    );
  }
  