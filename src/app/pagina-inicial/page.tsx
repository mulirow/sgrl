// app/login/page.tsx

'use client'; 

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Importa useRouter para redirecionamento
import './login.css';
import Header  from "../../components/Header";
import Sidebar from './../../components/Sidebar';
import React from 'react';



export default function LoginPage() {
  const [currentPath, setCurrentPath] = React.useState('/');
  const [userType, setUserType] = React.useState<'user' | 'manager'>('user');
  const navigate = (path: string) => {
    setCurrentPath(path);
      // Em um aplicativo Next.js, você usaria algo como 'router.push(path)' aqui.
  }

  

  return (
    <>
    <Header rota="" />
    <Sidebar userType={userType} activePath={currentPath} onNavigate={navigate} />
    </>
  );
}
