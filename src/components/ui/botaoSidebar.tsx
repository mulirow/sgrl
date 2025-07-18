import React from 'react';
import Link from 'next/link';


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
          // Em um ambiente Next.js, a tag <Link> de 'next/link' seria usada.
          // Aqui, usamos uma tag <a> para simular o comportamento de link.
          <Link
            key={item.id}
            href={item.path}
            className={`
              flex items-center w-full p-3 rounded-lg text-left
              transition-colors duration-200 ease-in-out
              ${isActive
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
              }
            `}
          >
            <IconComponent className="mr-3 h-5 w-5" />
            <span className="text-sm font-medium">{item.label}</span>
          </Link>
        );
      })}
    </>
  );
}