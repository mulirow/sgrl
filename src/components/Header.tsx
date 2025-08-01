"use client";
import { usePathname } from 'next/navigation'; // Importa o hook para obter o caminho atual
import { UserNav } from "./auth/user-nav";
// fhfgh

export default function Header() {
  const pathname = usePathname(); // Obtém o caminho da URL atual

  // Define se o UserNav deve ser exibido (apenas na rota raiz '/')
  const shouldShowUserNav = pathname === '/';
  return (
    <>
      <header className="Header">

        <div className='container'>
            <img
              src="/BrasaoUFPE.png"
              alt="Brasão Universidade Federal De Pernambuco"
              style={{ height: '10vh' }}/>
          <div className='containerNomes'>
            <p style={{
                color: 'white',
                fontWeight: 'bold', // Propriedades CSS em camelCase e valores como strings
                fontSize: '1.2em',   // 'font-size' vira 'fontSize'
              }} >Sistema de Reservas</p>
              <p style={{
                color: 'white',
                fontSize: '0.9em',   // 'font-size' vira 'fontSize'
              }}>UFPE</p>
          </div>
        </div>

        {shouldShowUserNav && <UserNav />} {/* Botão de "Entrar com Google" */}

      </header>
    </>
  );
}

