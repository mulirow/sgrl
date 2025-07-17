'use client'; // <-- Importante: para que o componente possa ter interatividade (estado, eventos)
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Importa useRouter para redirecionamento
import Header from "./componentes/Header";
import Sidebar from './componentes/Sidebar';

export default function Home() {
  return (
    <>
    <Header rota="/login" user="" />
    <Sidebar rota="/login" user="" />
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        {/* <img src="/bibCAC.JPG" alt="" /> */}
        
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
       
          
      </footer>
    </>
  );
}
