import Image from 'next/image';
import Link from 'next/link';
import './componentes.css';

interface HeaderProps {
  rota: string; // 'rota' é uma string que representa o caminho para o Link
}


export default function Header({ rota }: HeaderProps) {
  return (
    <>
      <header className="Header">
        <Image
          aria-hidden
          src="/BrasaoUFPE.png"
          alt="Window icon"
          width={55}
          height={55}
        />

        {/* Implementar Botão de Login */}
        {/* Usando a prop 'rota' para o href do Link */}
        <Link className="BotaoLogin" href={rota}>
          <button >
            Login
          </button>
        </Link>
      </header>
    </>
  );
}