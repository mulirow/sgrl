import { z } from 'zod';
import { StatusRecurso } from '@prisma/client';

export const LaboratorioSchema = z.object({
    id: z.string().optional(),
    nome: z.string().min(3, "O nome deve ter no mínimo 3 caracteres."),
    descricao: z.string().min(10, "A descrição deve ter no mínimo 10 caracteres."),
    centroAcademico: z.string().nonempty("O centro acadêmico é obrigatório."),
    gerenteIds: z.array(z.string()).optional().default([]),
    membroIds: z.array(z.string()).optional().default([]),
});

export type LaboratorioFormState = {
    errors?: z.ZodIssue[];
    message?: string;
    success: boolean;
};

export const RecursoSchema = z.object({
    id: z.string().optional(),
    nome: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
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

export const BookingFormSchema = z.object({
    recursoId: z.string().nonempty({ message: "Selecione um recurso." }),
    justificativa: z.string().min(10, { message: "A justificativa deve ter no mínimo 10 caracteres." }),
    data: z.date({ error: "A data da reserva é obrigatória." }),
    horaInicio: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato de hora inválido."),
    horaFim: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato de hora inválido."),
}).refine(data => {
    return data.horaFim > data.horaInicio;
}, {
    message: "O horário de fim deve ser posterior ao horário de início.",
    path: ["horaFim"],
});

export const CreateReservaSchema = z.object({
    recursoId: z.string().nonempty({ message: "Selecione um recurso." }),
    justificativa: z.string().min(10, { message: "A justificativa deve ter no mínimo 10 caracteres." }),
    inicio: z.date({ error: "A data e hora de início são obrigatórias." }),
    fim: z.date({ error: "A data e hora de fim são obrigatórias." }),
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