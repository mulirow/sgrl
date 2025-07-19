'use client'; // <-- Importante: para que o componente possa ter interatividade (estado, eventos)

import { useRouter } from 'next/navigation'; // Importa useRouter para redirecionamento
import Header  from "../components/Header";
import React from 'react';
import { UserNav } from "@/components/auth/user-nav";



export default function Home() {
  const [currentPath, setCurrentPath] = React.useState('/');

  return (
    <>
    <Header rota="/login" user="" />
    <UserNav />

      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        {/* <img src="/bibCAC.JPG" alt="" /> */}
        
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
       
          
      </footer>
    </>
  );
}
