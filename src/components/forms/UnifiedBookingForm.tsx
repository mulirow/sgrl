'use client';

import { useActionState, useState, useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import { type RecursoParaForm } from '@/app/api/laboratorios/[labId]/recursos/route';
import { BookingFormSchema, type CreateReservaState } from '@/lib/validators';
import { createReserva } from '@/app/reservas/actions';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { TimePicker } from '@/components/ui/time-picker';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface UnifiedBookingFormProps {
    laboratorios: { id: string; nome: string }[];
}

type FormValues = z.infer<typeof BookingFormSchema>;

export function UnifiedBookingForm({ laboratorios }: UnifiedBookingFormProps) {
    const [selectedLabId, setSelectedLabId] = useState('');
    const [recursos, setRecursos] = useState<RecursoParaForm[]>([]);
    const [isLoadingRecursos, setIsLoadingRecursos] = useState(false);

    const [isPending, startTransition] = useTransition();

    const form = useForm<FormValues>({
        resolver: zodResolver(BookingFormSchema),
        defaultValues: {
            recursoId: '',
            justificativa: '',
            data: undefined,
            horaInicio: '00:00',
            horaFim: '00:00',
        },
    });

    const [state, formAction] = useActionState<CreateReservaState, FormData>(createReserva, { success: false });

    const handleFormSubmit = (data: FormValues) => {
        const formData = new FormData();

        formData.append('recursoId', data.recursoId);
        formData.append('justificativa', data.justificativa);
        if (data.data) {
            formData.append('data', data.data.toISOString());
        }
        formData.append('horaInicio', data.horaInicio);
        formData.append('horaFim', data.horaFim);

        startTransition(() => {
            formAction(formData);
        });
    };

    useEffect(() => {
        if (state.success) {
            toast.success(state.message);
            form.reset();
            setSelectedLabId('');
            setRecursos([]);
        } else if (state.message) {
            toast.error(state.message);
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
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="data"
                        render={({ field }) => (
                            <FormItem className="flex flex-col md:col-span-1">
                                <FormLabel>Data da Reserva</FormLabel>
                                <DatePicker value={field.value} onChange={field.onChange} />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="horaInicio"
                        render={({ field }) => (
                            <FormItem className="flex flex-col md:col-span-1">
                                <FormLabel>Horário de Início</FormLabel>
                                <TimePicker value={field.value} onChange={field.onChange} />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="horaFim"
                        render={({ field }) => (
                            <FormItem className="flex flex-col md:col-span-1">
                                <FormLabel>Horário de Fim</FormLabel>
                                <TimePicker value={field.value} onChange={field.onChange} />
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

                <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Solicitar Reserva
                </Button>
            </form>
        </Form>
    );
}