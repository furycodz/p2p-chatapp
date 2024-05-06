"use client";
import { faCamera,faMicrophone,faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState,useEffect } from 'react';



export default function Image({isSent, date,imgContent, index}) {

    if (isSent){
      return(
          <div class="self-end mt-2" key={index}>
              <img src={imgContent} alt="" class="max-w-[300px] max-h-[300px] rounded-lg shadow-lg"/>
              
              <p class="text-gray-500 text-xs text-right">{date}</p>
                
          </div>
      )
  }else{
      return(
          <div class="flex" key={index}>
              <img src={imgContent} alt="" class="max-w-[300px] max-h-[300px] rounded-lg shadow-lg"/>
              <p class="text-gray-500 text-xs text-right">{date}</p>
          </div>
      )
  }
}
