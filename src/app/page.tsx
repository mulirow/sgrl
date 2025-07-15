'use client'; // <-- Importante: para que o componente possa ter interatividade (estado, eventos)
import Header from "./componentes";

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Importa useRouter para redirecionamento

export default function Home() {
  return (
    <>
    <Header rota="/login" />
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        sd
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
       
          
      </footer>
    </>
  );
}
