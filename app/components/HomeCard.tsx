'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface HomeCardProps {
  href: string;
  title: string;
  description: string;
  bgImage: string;
  showPlus?: boolean;
  addLabel?: string;
}

export default function HomeCard({ 
  href, 
  title, 
  description, 
  bgImage, 
  showPlus = false,
  addLabel = 'исполнителя'
}: HomeCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlusHovered, setIsPlusHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const isActive = isHovered && !isPlusHovered;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768); ;
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getPlusTransform = () => {
    if (isMobile) return 'translateX(0px)';
    
    if (isPlusHovered) {
      return 'translateX(0px)';
    }
    return isActive ? 'translate(120px, 30px)' : 'translateX(90px)';
  };

  return (
    <div className="relative bg-white rounded-2xl h-64 border border-gray-300 overflow-hidden">
      <Link 
        href={href} 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            backgroundImage: `linear-gradient(to bottom, white 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 95%), url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'bottom',
            opacity: isActive ? 0 : 1
          }}
        />

        <div
          className="absolute transition-all duration-500 text-center w-full"
          style={{ top: isActive ? '35%' : '16px' }}
        >
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <b className="text-gray-700">{description}</b>
        </div>
      </Link>

      {showPlus && (
        <Link
          href={`${href}/new`}
          className="absolute bottom-0 right-0 pt-3 pl-3 transition-all duration-500"
          style={{
            transform: getPlusTransform()
          }}
          onMouseEnter={() => setIsPlusHovered(true)}
          onMouseLeave={() => setIsPlusHovered(false)}
        >
          <div className="bg-blue-600 text-white rounded-tl-full pl-5 pt-2 w-33 flex items-center gap-3">
            <span className="text-2xl font-bold">+</span>
            <div className="flex flex-col pb-1 font-bold text-xs">
              <span>добавить</span>
              <span>{addLabel}</span>
            </div>
          </div>
        </Link>
      )}
    </div>
  );
}