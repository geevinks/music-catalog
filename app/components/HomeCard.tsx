'use client';
import Link from 'next/link';
import { useState } from 'react';

interface HomeCardProps {
  href: string;
  title: string;
  description: string;
  bgImage: string;
  showPlus?: boolean;
}

export default function HomeCard({ href, title, description, bgImage, showPlus = false }: HomeCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlusHovered, setIsPlusHovered] = useState(false);

  return (
    <div 
      className="relative rounded-2xl h-64 border border-gray-300 cursor-pointer overflow-hidden"
      style={{
        backgroundColor: isHovered ? 'white' : 'transparent',
        transition: 'background-color 0.5s ease-out'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={href} className="block h-full">
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            backgroundImage: `linear-gradient(to bottom, white 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 95%), url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'bottom',
            opacity: isHovered && !isPlusHovered ? 0 : 1
          }}
        />
        
        <div
          className="absolute z-10 transition-all duration-500 text-center w-full"
          style={{
            left: '50%',
            top: isHovered && !isPlusHovered ? '50%' : '24px',
            transform: isHovered && !isPlusHovered ? 'translate(-50%, -50%)' : 'translateX(-50%)',
          }}
        >
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <b className="text-gray-700">{description}</b>
        </div>
      </Link>
      
      {showPlus && (
        <Link
          href={`${href}/new`}
          className="absolute rounded-tl-full bottom-0 right-0 w-16 h-16 overflow-hidden transition-all duration-500"
          style={{
            transform: isHovered && !isPlusHovered ? 'translate(30px, 30px)' : 'translate(0, 0)'
          }}
          onMouseEnter={() => setIsPlusHovered(true)}
          onMouseLeave={() => setIsPlusHovered(false)}
        >
          <div
            className="absolute bg-blue-600 rounded-tl-4xl flex items-center justify-center shadow-lg transition-transform duration-300"
            style={{
              width: '60px',
              height: '60px',
              bottom: '-20px',
              right: '-20px',
              transform: isPlusHovered ? 'scale(1.6)' : 'scale(1)'
            }}
          >
            <span className="text-white text-xl font-bold" style={{ transform: 'translate(-6px, -6px)' }}>+</span>
          </div>
        </Link>
      )}
    </div>
  );
}