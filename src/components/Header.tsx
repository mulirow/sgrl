import Link from 'next/link';
import './Header.css';

interface HeaderProps {
  rota: string; // 'rota' é uma string que representa o caminho para o Link
  user?: string; // 'user' é uma string que pode representar o nome do usuário, etc.
}

export default function Header({ rota, user }: HeaderProps) {
  function renderizaBotao (){
    if (rota !== ''){
      return(
        <Link className="BotaoLogin" href={rota}>
            <button>
              {/* Exemplo de uso da prop 'user' aqui */}
              {user ? `BBem-vindo, ${user}` : 'Login'}
            </button>
        </Link>
      )
    }
  }

  return (
    <>
      <header className="Header">
        <img
            src="/BrasaoUFPE.png"
            alt="Brasão Universidade Federal De Pernambuco"
            style={{ height: '10vh' }}
            />
        <div> 
          <p style={{
            fontWeight: 'bold', // Propriedades CSS em camelCase e valores como strings
            fontSize: '1.2em',   // 'font-size' vira 'fontSize'
          }} >Sistema de Reservas</p>
          <p style={{
            fontSize: '0.9em',   // 'font-size' vira 'fontSize'
          }}>UFPE</p>
        </div>
        
        {renderizaBotao()}
      </header>
    </>
  );
}

