import './Sidebar.css';
import { 
  Calendar, 
  Home, 
  MapPin, 
  Settings, 
  Users, 
  ClipboardList,
  BarChart3,
  FileText
} from "lucide-react";

import Link from 'next/link';

interface SidebarProps {
  rota: string; // 'rota' é uma string que representa o caminho para o Link
  user?: string; // 'user' é uma string que pode representar o nome do usuário, etc.
}

export default function Sidebar({ rota, user }: SidebarProps) {
  function renderizaBotao (){
    if (rota !== ''){
      return(
        <Link className="BotaoLogin" href={rota}>
          <button>
            {/* Exemplo de uso da prop 'user' aqui */}
            {user ? `Bem-vindo, ${user}` : 'Login'}
          </button>
        </Link>
      )
    }
  }

  return (
    <>
      <aside className="Sidebar">
        {/* Usar lucide */}
        {renderizaBotao()}
      </aside>
    </>
  );
}