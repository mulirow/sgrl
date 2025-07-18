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


// Definição de Tipo para um Item da Sidebar
interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  path: string;
  roles?: ('user' | 'manager')[];
}

// Definindo os itens base fora dos components para evitar recriação desnecessária.
const baseItems: SidebarItem[] = [
  { id: 'dashboard'      , label: 'Dashboard'      , icon: Home         , path: '/'               , roles: ['user','manager'] },// user e manager
  { id: 'calendar'       , label: 'Calendário'     , icon: Calendar     , path: '/calendar'       , roles: ['user','manager'] },// user e manager
  { id: 'spaces'         , label: 'Espaços'        , icon: MapPin       , path: '/spaces'         , roles: ['user','manager'] }, // manager
  { id: 'my-reservations', label: 'Minhas Reservas', icon: ClipboardList, path: '/my-reservations', roles: ['user','manager'] },// user 
  { id: 'approvals'      , label: 'Aprovações'     , icon: ClipboardList, path: '/approvals'      , roles: ['user','manager'] },// manager
  { id: 'users'          , label: 'Utilizadores'   , icon: Users        , path: '/users'          , roles: ['user','manager'] },// manager
  { id: 'reports'        , label: 'Relatórios'     , icon: BarChart3    , path: '/reports'        , roles: ['user','manager'] },// manager
  { id: 'documentation'  , label: 'Documentação'   , icon: FileText     , path: '/documentation'  , roles: ['user','manager'] },// user e manager
  { id: 'settings'       , label: 'Definições'     , icon: Settings     , path: '/settings'       , roles: ['user','manager'] }// manager
];

// Interface para as propriedades do componente BotaoSidebar
interface BotaoSidebarProps {
  lista: SidebarItem[];
  activePath: string;
}

// Novo componente Sidebar que encapsula a lógica de filtragem e renderiza BotaoSidebar
interface SidebarProps {
  userType: 'user' | 'manager';
  activePath: string;
  onNavigate: (path: string) => void; // Adicionado para permitir que a Sidebar notifique o App sobre a navegação
}

export default function Sidebar({ userType, activePath, onNavigate }: SidebarProps) {
  // Lógica para filtrar os itens da sidebar com base no tipo de utilizador
  const filteredItems = React.useMemo(() => {
    return baseItems.filter(item => item.roles?.includes(userType));
  }, [userType]);

  return (
    <aside className="Sidebar">
      {/* Passa a lista filtrada e o caminho ativo para o BotaoSidebar */}
      <BotaoSidebar lista={filteredItems} activePath={activePath} />
    </aside>
  );
}