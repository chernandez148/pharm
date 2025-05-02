import React from 'react'
import { FaFilePrescription } from "react-icons/fa";
import './Card.css'

const iconMap = {
  FaFilePrescription: FaFilePrescription,
};

function Card({title, number, icon, color}: {title: string, number:number, icon: keyof typeof iconMap, color: string}) {
  const Icon = iconMap[icon];  // Get the component

  return (
    <div className='Card' style={{ backgroundColor: color }}>
      <span>
         {Icon({})}    
      </span>
      <div>
        <p>{title}</p>
        <p style={{ fontWeight: 600, fontSize: 14 }}>{number}</p>
      </div>
    </div>
  )
}

export default Card