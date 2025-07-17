import Link from 'next/link';

interface SidebarProps {
  rota: string; // 'rota' é uma string que representa o caminho para o Link
  user?: string; // 'user' é uma string que pode representar o nome do usuário, etc.
}


// Descobrir cmo usar a biblioteca de ícones e tentar terminar as páginas iniciais com base no design:
// https://lovable.dev/projects/7c1c4c37-a7f2-4b45-bb51-2910ed929d70
// https://preview--arte-reserva-gest.lovable.app/


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