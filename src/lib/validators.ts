import { z } from 'zod';

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