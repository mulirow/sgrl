'use client'; // <-- Importante: para que o componente possa ter interatividade (estado, eventos)
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Importa useRouter para redirecionamento
import Header  from "./componentes/Header";
import Sidebar from './componentes/Sidebar';
import React from 'react';



export default function Home() {
  const [currentPath, setCurrentPath] = React.useState('/');
  const [userType, setUserType] = React.useState<'user' | 'manager'>('user');
  const navigate = (path: string) => {
    setCurrentPath(path);
    // Em um aplicativo Next.js, você usaria algo como 'router.push(path)' aqui.
  };
  return (
    <>
    <Header rota="/login" user="" />
    <Sidebar userType={userType} activePath={currentPath} onNavigate={navigate} />

      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        {/* <img src="/bibCAC.JPG" alt="" /> */}
        
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
       
          
      </footer>
    </>
  );
}
