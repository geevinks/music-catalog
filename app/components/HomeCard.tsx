'use client';
import Link from 'next/link';
import { useState } from 'react';

interface HomeCardProps {
  href: string;
  title: string;
  description: string;
  bgImage: string;
}

export default function HomeCard({ href, title, description, bgImage}: HomeCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={href} >
      <div
        className="relative rounded-2xl shadow-md h-64 hover:shadow-xl transition-shadow duration-500 overflow-hidden border border-gray-300"
        style={{
          backgroundColor: isHovered ? 'white' : 'transparent',
          transition: 'background-color 0.5s ease-out'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Фоновое изображение */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            backgroundImage: `linear-gradient(to bottom, white 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 95%), url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'bottom',
            opacity: isHovered ? 0 : 1
          }}></div>
        
        {/* Контент */}
        <div
          className="absolute z-10 transition-all duration-500"
          style={{
            left: '50%',
            top: isHovered ? '50%' : '24px',
            transform: isHovered ? 'translate(-50%, -50%)' : 'translateX(-50%)',
            width: '100%',
            textAlign: 'center'
          }}>
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <b className="text-gray-700 transition-opacity duration-500"
          >{description}</b>
        </div>
      </div>
    </Link>
  );
}