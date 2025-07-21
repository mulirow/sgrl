import Header from "@/components/Header";
import React from 'react';
import { UserNav } from "@/components/auth/user-nav";

// ANTES DE RODAR

// baixar .env
// npm install
// npx prisma generate
// npx prisma db push

// RODAR:

// npm run dev

// Antes do comit

// npm run lint
// npm run build


export default function Home() {
  return (
    <>
      <UserNav />
      <Header rota="/login" user="" />

      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        {/* <img src="/bibCAC.JPG" alt="" /> */}
        
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
       
          
      </footer>
    </>
  );
}
