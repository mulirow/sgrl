'use client';

import { useActionState, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import { type RecursoParaForm } from '@/app/api/laboratorios/[labId]/recursos/route';
import { CreateReservaSchema } from '@/lib/validators';
import { createReserva } from '@/app/reservas/actions';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface UnifiedBookingFormProps {
    laboratorios: { id: string; nome: string }[];
}

type FormValues = z.infer<typeof CreateReservaSchema>;

export function UnifiedBookingForm({ laboratorios }: UnifiedBookingFormProps) {
    const [selectedLabId, setSelectedLabId] = useState('');
    const [recursos, setRecursos] = useState<RecursoParaForm[]>([]);
    const [isLoadingRecursos, setIsLoadingRecursos] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(CreateReservaSchema),
        defaultValues: {
            recursoId: '',
            justificativa: '',
            inicio: undefined,
            fim: undefined,
        },
    });

    const [state, formAction] = useActionState(createReserva, { success: false });

    useEffect(() => {
        if (state.success) {
            toast.success(state.message);
            form.reset();
            setSelectedLabId('');
            setRecursos([]);
        } else if (state.message) {
            toast.error(state.message, {
                description: state.errors?.geral?.[0]
            });
        }
    }, [state, form]);

    useEffect(() => {
        if (!selectedLabId) {
            setRecursos([]);
            form.setValue('recursoId', '');
            return;
        }

        const fetchRecursos = async () => {
            setIsLoadingRecursos(true);
            form.setValue('recursoId', '');
            try {
                const response = await fetch(`/api/laboratorios/${selectedLabId}/recursos`);
                if (!response.ok) throw new Error('Falha ao buscar recursos');
                const data: RecursoParaForm[] = await response.json();
                setRecursos(data);
            } catch (err) {
                console.error("Falha ao buscar recursos:", err);
                toast.error('Não foi possível carregar os recursos deste laboratório.');
                setRecursos([]);
            } finally {
                setIsLoadingRecursos(false);
            }
        };

        fetchRecursos();
    }, [selectedLabId, form]);

    return (
        <Form {...form}>
            <form action={formAction} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormItem>
                        <FormLabel>1. Selecione o Laboratório</FormLabel>
                        <Select onValueChange={setSelectedLabId} value={selectedLabId}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Escolha um laboratório..." />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {laboratorios.map((lab) => (
                                    <SelectItem key={lab.id} value={lab.id}>{lab.nome}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>

                    <FormField
                        control={form.control}
                        name="recursoId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>2. Selecione o Recurso</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} disabled={!selectedLabId || isLoadingRecursos}>
                                    <FormControl>
                                        <SelectTrigger>
                                            {isLoadingRecursos && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            <SelectValue placeholder="Escolha um recurso..." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {recursos.length > 0 ? (
                                            recursos.map((rec) => (
                                                <SelectItem key={rec.id} value={rec.id}>{rec.nome}</SelectItem>
                                            ))
                                        ) : (
                                            <p className="p-4 text-sm text-muted-foreground">Nenhum recurso disponível.</p>
                                        )}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="inicio"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormControl>
                                    <DateTimePicker
                                        label="Início da Reserva"
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="fim"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormControl>
                                    <DateTimePicker
                                        label="Fim da Reserva"
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="justificativa"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Justificativa</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Descreva o propósito da reserva (ex: aula de gravura, projeto de pesquisa, etc.)"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Solicitar Reserva
                </Button>
            </form>
        </Form>
    );
}