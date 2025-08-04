import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { StatusReserva } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getStatusVariant(status: StatusReserva | 'BLOQUEADO'): "default" | "destructive" | "outline" | "secondary" {
  switch (status) {
    case 'APROVADA':
    case 'EM_USO':
      return 'default';
    case 'REJEITADA':
    case 'CANCELADA':
      return 'destructive';
    case 'PENDENTE':
      return 'secondary';
    case 'BLOQUEADO':
      return 'outline';
    default:
      return 'secondary';
  }
}