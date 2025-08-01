import { z } from 'zod';
import { StatusRecurso } from '@prisma/client';

export const RecursoSchema = z.object({
    id: z.string().optional(),
    nome: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
    tipo: z.string().min(3, { message: "O tipo deve ter pelo menos 3 caracteres." }),
    descricao: z.string().min(10, { message: "A descrição deve ter pelo menos 10 caracteres." }),
    localizacao: z.string().min(3, { message: "A localização deve ter pelo menos 3 caracteres." }),
    laboratorioId: z.string({ error: "É necessário selecionar um laboratório." }).nonempty("É necessário selecionar um laboratório."),
    status: z.enum(StatusRecurso).default(StatusRecurso.DISPONIVEL),
    regrasReserva: z.string().optional(),
});

export type RecursoFormState = {
    errors?: z.ZodIssue[];
    message?: string;
    success: boolean;
};

export const CreateReservaSchema = z.object({
    recursoId: z.string().nonempty({ message: "Selecione um recurso." }),
    justificativa: z.string().min(10, { message: "A justificativa deve ter no mínimo 10 caracteres." }),
    inicio: z.coerce.date({ error: "A data e hora de início são obrigatórias." }),
    fim: z.coerce.date({ error: "A data e hora de fim são obrigatórias." }),
}).refine(data => data.fim > data.inicio, {
    message: "A data de fim deve ser posterior à data de início.",
    path: ["fim"],
});

export type CreateReservaState = {
    errors?: {
        recursoId?: string[];
        justificativa?: string[];
        inicio?: string[];
        fim?: string[];
        geral?: string[];
    };
    message?: string;
    success: boolean;
};