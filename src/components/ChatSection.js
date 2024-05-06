"use client";
import { faCamera,faClipboard,faDownload,faFile,faMicrophone,faPaste,faPhone,faPlus, faVideo } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Romanesco } from 'next/font/google';
import { useState,useEffect } from 'react';
import { useFilePicker, FileAmountLimitValidator } from 'use-file-picker';
import Image from './messages/Image';


export default function ChatSection({roomInfos,setRoomInfos, settings}) {
    const [text,setText] = useState("")
    const [fileBase64, setFileBase64] = useState("")
    function downloadBase64File(base64Data, filename) {
        const [metadata, data] = base64Data.split(';base64,');
        console.log(base64Data)
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
                        date: date.getHours() + ":" + date.getMinutes()
                    })
                    roomInfos.peers.forEach(p => {
                        p.peer.send(JSON.stringify({
                            type: "img",
                            pdp: settings.profilePicture,
                            userName: settings.userName,
                            imgSrc: reader.result,
                            fType: plainFiles[0].type,
                            fileName: plainFiles[0].name
                        }))
                    });
                
                }else{
                    newm.push({
                        type: "file",
                        isSent: true,
                        src: reader.result,
                        date: date.getHours() + ":" + date.getMinutes(),
                        fileName: plainFiles[0].name,
                        fileSize: "10KB"
                    })
                    roomInfos.peers.forEach(p => {
                        p.peer.send(JSON.stringify({
                            type: "file",
                            pdp: settings.profilePicture,
                            userName: settings.userName,
                            src: reader.result,
                            fType: plainFiles[0].type,
                            fileName: plainFiles[0].name,
                            fileSize: "10KB"
                        }))
                    });
                }

            
        
                setRoomInfos(roomInfos => ({
                    ...roomInfos,
                    messages: newm
                }));
               
         
                
            };
            reader.readAsDataURL(plainFiles[0]);
            
            // const newm = roomInfos.messages
            // const date = new Date()
            // newm.push({
            //     type: "img",
            //     isSent: true,
            //     imgContent: URL.createObjectURL(plainFiles[0]),
            //     date: date.getHours() + ":" + date.getMinutes()
            // })
          
    
            // setRoomInfos(roomInfos => ({
            //     ...roomInfos,
            //     messages: newm
            // }));
            // getBase64(plainFiles[0]) 
            // .then(res => {
               
                
            // }) 
            // const reader = new FileReader();
            // reader.onload = function(event) {
            //   const fileData = event.target.result;
            //   let uint8Array = new Uint8Array(fileData);
            //   let jsonString = new TextDecoder('utf-8').decode(uint8Array);
          
            //   roomInfos.peers.forEach(p => {
            //     p.peer.send(JSON.stringify({
            //         type: "img",
            //         pdp: settings.profilePicture,
            //         userName: settings.userName,
            //         imgSrc: jsonString,
            //         fType: plainFiles[0].type,
            //         fileName: plainFiles[0].name
            //     }))
            // });
            // };
            // reader.readAsArrayBuffer(plainFiles[0]);


            // roomInfos.peers.forEach(p => {
            //     p.peer.send(JSON.stringify({
            //         type: "img",
            //         pdp: settings.profilePicture,
            //         userName: settings.userName,
            //         imgSrc: res
            //     }))
            // });
          
        
           
          }
    });

    const handleFileSubmit = () => {
        openFilePicker()
    
    }

    const handleSubmit = (e) =>{
        if (e.key === 'Enter' && text.length != 0 && text != " ") {
            
            // const a =   {
            //     isSent: true,
            //     message: text,
            //     date: "23:52 PM"
                
            // }
          
            roomInfos.peers.forEach(p => {
                p.peer.send(JSON.stringify({
                    type: "msg",
                    pdp: settings.profilePicture,
                    userName: settings.userName,
                    message: text
                }))
            });
            // roomInfos.peers.forEach(p => {
            //     p.peer.send(settings.profilePicture+"::/::"+settings.userName+"::/::"+text)
            // });

            const newm = roomInfos.messages
            const date = new Date()
            newm.push({
                type: "msg",
                isSent: true,
                message: text,
                date: date.getHours() + ":" + date.getMinutes()
            })
          
    
            setRoomInfos(roomInfos => ({
                ...roomInfos,
                messages: newm
            }));
          

            // setRoomInfos({...roomInfos,messages: [...roomInfos.messages, a]})
       
            setText("")
          }
    }


    return (
      <div class="w-3/4 relative dark:bg-[#1a202c]  h-screen">

            <div class="h-24 bg-[#fdfdfd] border-[#d8dae0] dark:border-[#3f465a] border-b-[1px] p-10 flex items-center dark:bg-[#1a202c] justify-between">
                <div class="flex items-center gap-4 ">
                    
                    <div>
                        {/* <p class="font-bold dark:text-gray-200">{roomInfos.roomName}</p> */}
                        <p class="font-bold dark:text-gray-200">Room: {roomInfos.roomID.length == 0 ? <span className=' dark:text-gray-400 text-sm'>Not connected</span>: <span className=' dark:text-gray-400 text-sm'>{roomInfos.roomID} <FontAwesomeIcon size="lg" icon={faPaste} className="dark:text-gray-500 cursor-pointer ml-2 hover:text-black" onClick={() => {navigator.clipboard.writeText(roomInfos.roomID)}}/></span>}</p>
                    </div>
                    
                    
                </div>
                <div className='flex gap-4'>
                <FontAwesomeIcon size="lg" icon={faPhone} className="dark:text-gray-200 cursor-pointer"/>
                <FontAwesomeIcon size="lg" icon={faVideo} className="dark:text-gray-200 cursor-pointer"/>
                </div>

            </div>
         
            <div class="mx-9 flex flex-col my-4 ">
                {roomInfos.messages.map((message, index)=>{
                    if(message.type == "msg"){
                       
                        if (message.isSent) {
                            return(
                                <div class="send-container w-fit self-end my-2" key={index}>
                                    <p class="bg-[#f1f2f4] w-fit py-[0.35rem] px-5 rounded-2xl text-[0.92rem]">{message.message}</p>
                                    <p class="text-gray-500 text-xs text-right">{message.date}</p>
                                </div>
                            )
                        }else{
                            return(
                                <div class="rec-container flex gap-3 my-3" key={index}>
                                    <img src={message.pdp} alt="" class="w-12 h-12 rounded-full shadow-lg"/>
                                    <div>
                                        <p class="text-gray-500 text-sm text-left">{message.name} • {message.date}</p>
                                        <p class="bg-[#1786d8] shadow-md w-fit py-[0.35rem] px-5 rounded-2xl text-[0.92rem] text-white">{message.message}</p>
                                    </div>
                                </div>
                            )
                        }
                    }else if(message.type == "img"){
                       
                        if (message.isSent){
                            return(
                                <div class="self-end mt-2" key={index}>
                                    <img src={message.imgContent} alt="" class="max-w-[400px] max-h-[400px] rounded-lg shadow-lg"/>
                                    
                                    <p class="text-gray-500 text-xs text-right">{message.date}</p>
                                      
                                </div>
                            )
                        }else{
                            return(
                                <div class="rec-container flex gap-3 my-3" key={index}>
                                    <img src={message.pdp} alt="" class="w-12 h-12 rounded-full shadow-lg"/>
                                    <div>
                                        <p class="text-gray-500 text-sm text-left">{message.name} • {message.date}</p>
                                        <img src={message.imgContent} alt="" class="max-w-[400px] max-h-[400px] rounded-lg shadow-lg"/>
                                    
                                    </div>
                                </div>
                                // <div class="flex flex-col w-fit" key={index}>
                                   
                                //     <p class="text-gray-500 text-xs text-right">{message.date}</p>
                                // </div>
                            )
                        }
                    }else if(message.type == "file"){
                     
                        if (message.isSent){
                            return(
                                <div class="self-end mt-2" key={index}>
                                    <div className="dark:bg-[#2d3647] rounded-lg w-30 flex items-center p-2 gap-3">
                                        <FontAwesomeIcon icon={faFile} size="2xl" className="text-[#1786d8]  " />                                          
                                        <div className="dark:bg-[#2d3647] rounded-lg w-30">
                                            <p class="text-gray-300 text-sm text-left">{message.fileName} • {message.fileSize}</p>
                                        </div>
                                        <FontAwesomeIcon icon={faDownload} size="lg" className="text-[#1786d8] p-2 rounded-lg border-gray-700 border-[1px] cursor-pointer dark:bg-[#262d3a]" onClick={() => downloadBase64File(message.src, message.fileName)}/>     
                                    </div>
                                    <p class="text-gray-500 text-xs text-right">{message.date}</p>      
                                </div>
                            )
                        }else{
                            return(
                                <div class="rec-container flex gap-3 my-3" key={index}>
                                    <img src={message.pdp} alt="" class="w-12 h-12 rounded-full shadow-lg"/>
                                    <div>
                                        <p class="text-gray-500 text-sm text-left">{message.name} • {message.date}</p>
                                        <div className="dark:bg-[#2d3647] rounded-lg w-30 flex items-center p-2 gap-3">
                                            <FontAwesomeIcon icon={faFile} size="2xl" className="text-[#1786d8]  " />                                          
                                            <div className="dark:bg-[#2d3647] rounded-lg w-30">
                                                <p class="text-gray-300 text-sm text-left">{message.fileName} • {message.fileSize}</p>
                                            </div>
                                            <FontAwesomeIcon icon={faDownload} size="lg" className="text-[#1786d8] p-2 rounded-lg border-gray-700 border-[1px] cursor-pointer dark:bg-[#262d3a]" onClick={() => downloadBase64File(message.src, message.fileName)}/>     
                                        </div>
                                    </div>
                                </div>
                                // <div class="flex flex-col w-fit" key={index}>
                                   
                                //     <p class="text-gray-500 text-xs text-right">{message.date}</p>
                                // </div>
                            )
                        }
                    }

                
                })}
       
            </div>
         
            <div class="absolute bottom-0 left-0 h-28 w-full  dark:border-[#3f465a] border-[#d8dae0] border-t-[1px] flex items-center justify-between p-10">
              
                <FontAwesomeIcon icon={faPlus} size="lg" className="text-[#1786d8] bg-[#f1f2f4] p-4 rounded-3xl dark:bg-[#262d3b] cursor-pointer" onClick={() => openFilePicker()}/>

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
  