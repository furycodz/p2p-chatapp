"use client";
import { faCamera,faCircle,faEllipsis,faGear,faMagnifyingGlass,faMicrophone,faMoon,faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState,useEffect,useRef } from 'react';
import Modal from 'react-modal'

export default function Home() {
    const [isOpen, setIsOpen] = useState(false)
    
    const [darkmode, setDarkMode] = useState(false)
    const [lang, setLang] = useState('en')
    const language = {
        fr: {
            search_text:"Chercher ..."
        },
        en: {
            search_text:"Search ..."
        }
    }
    useEffect(()=>{
        if (typeof window !== 'undefined') {
            localStorage.setItem('lang', lang)
        }
 
    },[lang])

    useEffect(() => {

      
        const root = window.document.documentElement;
        if (darkmode) {
            document.body.classList.toggle("dark")
        } else {
            document.body.classList.toggle("dark")
        }
      }, [darkmode]);

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
        <div class="w-1/4 bg-[#fdfdfd] border-[#d8dae0] dark:border-[#3f465a] border-r-[1px] dark:bg-[#1a202c]">
    
        <div class="h-24 bg-[#fdfdfd] border-[#d8dae0] border-b-[1px] flex items-center justify-between px-4 dark:bg-[#1a202c] dark:border-[#3f465a]">
            <div class="flex items-center gap-5">
                <img src="/b.jpg" alt="" class="w-16 rounded-2xl"/>
                <p class="font-bold text-lg text-gray-800 dark:text-gray-200">Badr EL HOUARI</p>
            </div>
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
                                <input type="checkbox" onClick={(e) => {setDarkMode(!darkmode)}} checked={darkmode}
/>
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
                            <select onClick={(e) => setLang(e.target.value)} 
                            
                            value={lang}
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
                {/* <i class="fa-solid fa-gear text-2xl " id="dark"></i> */}
            </div>
            

        </div>
     
        <div class="h-14 bg-[#f1f2f4] flex items-center justify-center border-b-[1px] dark:bg-[#262d3b] dark:border-[#3f465a]">
            <div class=" bg-white h-8 rounded-2xl px-5 flex items-center gap-3 w-full mx-7 dark:bg-[#3e4457]">
                <FontAwesomeIcon icon={faMagnifyingGlass} size="lg" className="text-center dark:text-gray-200"/>
                <i class="fa-solid fa-magnifying-glass text-center"></i>
                <input type="text" class="text-gray-700 outline-none dark:bg-[#3e4457] dark:text-gray-200" placeholder={language['en'].search_text}/>
                {/* <input type="text" class="text-gray-700 outline-none dark:bg-[#3e4457] dark:text-gray-200" placeholder={language[typeof window !== "undefined" ? window.localStorage.getItem('lang') : 'en'].search_text}/> */}

            </div>
        </div>
     
        <div class="">  
        
            <div class="bg-[#e6f2fa] dark:bg-[#313648] border-[#d8dae0] dark:border-[#3f465a] border-b-[1px] h-24 flex items-center justify-between">
                <div class="flex items-center">
                    <div class="mx-4">
                        <img src="/a.jpg" alt="" class="w-16 rounded-2xl"/>

                    </div>
                    <div>
                        <p class="text-gray-800 font-bold dark:text-gray-400">Mohammed</p>
                        <p class="text-gray-600 text-[13px] font-semibold dark:text-gray-200 "><FontAwesomeIcon icon={faCircle} size="md" className="text-center text-green-500 mr-2 animate-pulse"/>Online</p>
                    </div>
                </div>
                
                <div class="mx-4">
                <FontAwesomeIcon icon={faEllipsis} size="lg" className="text-center cursor-pointer dark:text-gray-200"/>
                </div>
            </div>
            <div class="bg-[#e6f2fa] dark:bg-[#313648] border-[#d8dae0] dark:border-[#3f465a] border-b-[1px] h-24 flex items-center justify-between">
                <div class="flex items-center">
                    <div class="mx-4">
                        <img src="/b.jpg" alt="" class="w-16 rounded-2xl"/>

                    </div>
                    <div>
                        <p class="text-gray-800 font-bold dark:text-gray-400">Badr</p>
                        <p class="text-gray-600 text-[13px] font-semibold dark:text-gray-200 "><FontAwesomeIcon icon={faCircle} size="md" className="text-center text-green-500 mr-2 animate-pulse"/>Online</p>
                    </div>
                </div>
                
                <div class="mx-4">
                <FontAwesomeIcon icon={faEllipsis} size="lg" className="text-center cursor-pointer dark:text-gray-200"/>
                </div>
            </div>
            <div class="bg-[#e6f2fa] dark:bg-[#313648] border-[#d8dae0] dark:border-[#3f465a] border-b-[1px] h-24 flex items-center justify-between">
                <div class="flex items-center">
                    <div class="mx-4">
                        <img src="/c.jpg" alt="" class="w-16 rounded-2xl"/>

                    </div>
                    <div>
                        <p class="text-gray-800 font-bold dark:text-gray-400">Omar</p>
                        <p class="text-gray-600 text-[13px] font-semibold dark:text-gray-200 "><FontAwesomeIcon icon={faCircle} size="md" className="text-center text-green-500 mr-2 animate-pulse"/>Online</p>
                    </div>
                </div>
                
                <div class="mx-4">
                    <FontAwesomeIcon icon={faEllipsis} size="lg" className="text-center cursor-pointer dark:text-gray-200"/>
                </div>
            </div>
            
    
        </div>
     
    </div>
    );
  }
  