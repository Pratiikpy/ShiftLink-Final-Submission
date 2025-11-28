'use client';

import CreateLink from '@/components/CreateLink';

export default function Home() {
  return (
    <>
      {/* Ambient Background */}
      <div className="absolute inset-0 bg-tactical-grid z-0 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-black/20 to-black pointer-events-none z-0"></div>

      <CreateLink />
    </>
  );
}