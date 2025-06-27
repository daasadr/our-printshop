import React from 'react';
import Link from 'next/link';

const Logo: React.FC = () => {
  return (
    <Link href="/" className="flex-shrink-0">
      <div className="h-10 w-32 relative">
        {/* Zde by bylo vaše logo */}
        <div className="font-bold text-xl">HappyWilderness</div>
      </div>
    </Link>
  );
};

export { Logo }; 