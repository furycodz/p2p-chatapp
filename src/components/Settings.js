"use client";
import { faCamera,faMicrophone,faPlus, faGear, faMoon } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { useState,useEffect,useRef } from 'react';
import Modal from 'react-modal'


export default function ChatSection({language, settings, setSettings}) {
    const [isOpen, setIsOpen] = useState(false)


    const customStyles = {
        overlay: {
           backgroundColor: 'rgba(0, 0, 0, 0.6)'
        },
        content: {
           top: '50%',
           left: '50%',
           right: 'auto',
           bottom: 'auto',
           marginRight: '-50%',
           transform: 'translate(-50%, -50%)'
        }
     }
    return (
        <div>
          
              
        <FontAwesomeIcon icon={faGear} size="lg" className="text-gray-800 cursor-pointer dark:text-gray-200" onClick={() => setIsOpen(true)}/>
        <Modal isOpen={isOpen} onRequestClose={() => setIsOpen(false)} style={customStyles}> 
        <div className="rounded-3xl flex flex-col gap-y-4">
            <h2 className="font-bold w-full border-b-[1px] border-gray-400 mb-4 py-2 text-lg ">Settings</h2>
            <div class="flex justify-between items-center gap-7">
                <div class="flex gap-5">
                    <FontAwesomeIcon icon={faMoon} size="xl" className="text-[#1786d8] cursor-pointer p-3 bg-gray-100 rounded-lg " />
                    <div>
                        <h2 className="font-bold text-[#1d425d]" >Dark mode</h2>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                        
                    </div>
                </div>
               
                <label class="switch">
                    <input type="checkbox" onClick={(e) => {setSettings({...settings, darkmode: !settings.darkmode})}} defaultChecked={settings.darkmode}/>
                    <span class="slider round"></span>
                </label>
           
              
            </div>
            <div class="flex justify-between items-center gap-7">
                <div class="flex gap-5">
                <FontAwesomeIcon icon={faMoon} size="xl" className="text-[#1786d8] cursor-pointer p-3 bg-gray-100 rounded-lg " />
                <div>
                    <h2 className="font-bold text-[#1d425d]" >Language</h2>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                    
                </div>
                </div>
                
                <div class="relative h-10 w-32 ">
                <select defaultValue={settings.lang} onClick={(e) => setSettings({...settings, lang: e.target.value})} 
                    class="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-gray-900 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50">
                
                    <option value="en">English</option>
                    <option value="fr">Francais</option>
                </select>
                <label
                    class="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                    Select Language
                </label>
                </div>

           
           
              
            </div>

        </div> 
    </Modal>
    </div>
    );
  }
  