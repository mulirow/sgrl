'use client';

import { useFormStatus } from 'react-dom';
import { createReserva } from '@/app/reservas/actions';
import { type CreateReservaState } from '@/lib/validators';
import { useActionState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from 'lucide-react';

interface RecursoParaForm {
    id: string;
    nome: string;
    laboratorio: {
        nome: string;
    }
}

interface BookingFormProps {
    recursos: RecursoParaForm[];
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? 'Solicitando...' : 'Solicitar Reserva'}
        </Button>
    );
}

export function BookingForm({ recursos }: BookingFormProps) {
    const initialState: CreateReservaState = { message: '', errors: {}, success: false };
    const [state, dispatch] = useActionState(createReserva, initialState);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state.success && state.message) {
            toast.success('Sucesso!', {
                description: state.message,
            });
            formRef.current?.reset();
        }
        else if (!state.success && state.message && !state.errors) {
            toast.error('Ocorreu um erro', {
                description: state.message,
            });
        }
    }, [state]);

    return (
        <form ref={formRef} action={dispatch} className="space-y-6">
            {state.errors?.geral && (
                <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Erro de Agendamento</AlertTitle>
                    <AlertDescription>
                        {state.errors.geral[0]}
                    </AlertDescription>
                </Alert>
            )}

            <div className="space-y-2">
                <Label htmlFor="recursoId">Recurso</Label>
                <Select name="recursoId">
                    <SelectTrigger id="recursoId">
                        <SelectValue placeholder="Selecione o recurso desejado" />
                    </SelectTrigger>
                    <SelectContent>
                        {recursos.map(recurso => (
                            <SelectItem key={recurso.id} value={recurso.id}>
                                {recurso.nome} ({recurso.laboratorio.nome})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {state.errors?.recursoId && <p className="text-sm font-medium text-destructive">{state.errors.recursoId[0]}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="inicio">Início da Reserva</Label>
                    <Input id="inicio" name="inicio" type="datetime-local" />
                    {state.errors?.inicio && <p className="text-sm font-medium text-destructive">{state.errors.inicio[0]}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="fim">Fim da Reserva</Label>
                    <Input id="fim" name="fim" type="datetime-local" />
                    {state.errors?.fim && <p className="text-sm font-medium text-destructive">{state.errors.fim[0]}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="justificativa">Justificativa</Label>
                <Textarea
                    id="justificativa"
                    name="justificativa"
                    placeholder="Ex: Aula da disciplina XYZ, desenvolvimento de projeto de pesquisa, etc."
                    rows={4}
                />
                {state.errors?.justificativa && <p className="text-sm font-medium text-destructive">{state.errors.justificativa[0]}</p>}
            </div>
            <SubmitButton />
        </form>
    );
}