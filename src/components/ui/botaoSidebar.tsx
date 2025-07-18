import React from 'react';
import Link from 'next/link';
import './botaoSidebar.css';

// Definição de Tipo para um Item da Sidebar
interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  path: string;
  roles?: ('user' | 'manager')[];
}

// Interface para as propriedades do componente BotaoSidebar
interface BotaoSidebarProps {
  lista: SidebarItem[];
  activePath: string;
}

// Componente principal da barra lateral que renderiza os botões
export default function BotaoSidebar({ lista, activePath }: BotaoSidebarProps) {
  return (
    <>
      {/* Mapeia sobre a prop 'lista' para criar um botão para cada item */}
      {lista.map((item) => {
        const IconComponent = item.icon;
        const isActive = activePath === item.path;

        return (
          // Falta implementar a propriedade hoover do css para mudar quando o mouse estiver por cima
          <Link
            key={item.id}
            href={item.path}
            className={`botaoSidebar
                ${isActive
                  ? 'ativo'
                  : 'desativado'
                }`}>
            <IconComponent className={`icone
                ${isActive
                  ? 'ativo'
                  : 'desativado'
                }`} />
            <span className={`labelBotao
                ${isActive
                  ? 'ativo'
                  : 'desativado'
                }`}>{item.label}</span>
          </Link>
        );
      })}
    </>
  );
}