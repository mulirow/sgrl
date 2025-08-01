"use client";

import React from 'react';
import './Sidebar.css';
import BotaoSidebar from './ui/botaoSidebar'
import {
  Calendar,
  Home,
  MapPin,
  ClipboardList,
  Settings,
  Users,
  BarChart3,
  FileText
} from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname } from 'next/navigation'; // Importa o hook para obter o caminho atual

// Definição de Tipo para um Item da Sidebar
interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className: string }>;
  path: string;
  roles?: ('user' | 'manager')[];
}

// Definindo os itens base fora dos components para evitar recriação desnecessária.
const baseItems: SidebarItem[] = [
  { id: 'dashboard'      , label: 'Dashboard'      , icon: Home         , path: '/'               , roles: ['user','manager'] }, // user e manager
  { id: 'calendar'       , label: 'Calendário'     , icon: Calendar     , path: '/calendar'       , roles: ['user','manager'] }, // user e manager
  { id: 'spaces'         , label: 'Espaços'        , icon: MapPin       , path: '/spaces'         , roles: ['user','manager'] }, // manager
  { id: 'my-reservations', label: 'Minhas Reservas', icon: ClipboardList, path: '/my-reservations', roles: ['user','manager'] }, // user 
  { id: 'approvals'      , label: 'Aprovações'     , icon: ClipboardList, path: '/approvals'      , roles: ['user','manager'] }, // manager
  { id: 'users'          , label: 'Utilizadores'   , icon: Users        , path: '/users'          , roles: ['user','manager'] }, // manager
  { id: 'reports'        , label: 'Relatórios'     , icon: BarChart3    , path: '/reports'        , roles: ['user','manager'] }, // manager
  { id: 'documentation'  , label: 'Documentação'   , icon: FileText     , path: '/documentation'  , roles: ['user','manager'] }, // user e manager
  { id: 'settings'       , label: 'Definições'     , icon: Settings     , path: '/settings'       , roles: ['user','manager'] }  // manager
];




export default function Sidebar() {
  // Lógica para filtrar os itens da sidebar com base no tipo de utilizador
  // Criar if para devolver a página se o usuário estiver logado

  
  const { data: session, status } = useSession(); // obter o estado da sessão e o tipo de utilizador
  console.log(session)
  console.log(status)
  
  const activePath = usePathname(); // caminho atual

  
  
  // passa para o ts que o tipo é uma string para não gerar erro
  const userType = (session?.user?.perfil as string) === 'GESTOR' ? 'manager' : 'user'; // no prisma tá GESTOR, USUARIO e ADMIN
  
  // Lógica para filtrar os itens da sidebar com base no tipo de utilizador.
  // O `useMemo` garante que a filtragem só ocorre quando o userType muda.
  const filteredItems = React.useMemo(() => {
      // Agora que `userType` é garantidamente uma string, a comparação é segura.
      return baseItems.filter(item => item.roles?.includes(userType as 'user' | 'manager'));
    }, [userType]);
    
    if (status === "loading" || status === "unauthenticated") { // Se a sessão estiver a carregar ou o utilizador 
                                                                // não estiver autenticado, não renderizar a barra lateral.
      return null;
    }
    return (
    <aside className="Sidebar">
      {/* Passa a lista filtrada e o caminho ativo para o BotaoSidebar */}
      <BotaoSidebar lista={filteredItems} activePath={activePath} />
    </aside>
  );
}

