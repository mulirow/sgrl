'use client';

import { useActionState, useState, useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { startOfWeek, endOfWeek } from 'date-fns';

import { type RecursoParaForm } from '@/app/api/laboratorios/[labId]/recursos/route';
import { type CalendarEvent } from '@/app/api/recursos/[resourceId]/eventos/route';
import { BookingFormSchema, type CreateReservaState } from '@/lib/validators';
import { createReserva } from '@/app/reservas/actions';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { TimePicker } from '@/components/ui/time-picker';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { WeeklyScheduleView } from '@/components/recursos/WeeklyScheduleView';

interface UnifiedBookingFormProps {
    laboratorios: { id: string; nome: string }[];
}

type FormValues = z.infer<typeof BookingFormSchema>;

export function UnifiedBookingForm({ laboratorios }: UnifiedBookingFormProps) {
    const [selectedLabId, setSelectedLabId] = useState('');
    const [recursos, setRecursos] = useState<RecursoParaForm[]>([]);
    const [isLoadingRecursos, setIsLoadingRecursos] = useState(false);
    const [eventosDaSemana, setEventosDaSemana] = useState<CalendarEvent[]>([]);
    const [isLoadingEventos, setIsLoadingEventos] = useState(false);

    const [isPending, startTransition] = useTransition();

    const form = useForm<FormValues>({
        resolver: zodResolver(BookingFormSchema),
        defaultValues: {
            recursoId: '',
            justificativa: '',
            data: new Date(),
            horaInicio: '00:00',
            horaFim: '00:00',
        },
    });

    const watchedRecursoId = form.watch('recursoId');
    const watchedData = form.watch('data');

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
        } else if (state.message && !state.success) {
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

    useEffect(() => {
        if (!watchedRecursoId || !watchedData) {
            setEventosDaSemana([]);
            return;
        }

        const fetchEventos = async () => {
            setIsLoadingEventos(true);
            const inicioDaSemana = startOfWeek(watchedData);
            const fimDaSemana = endOfWeek(watchedData);

            try {
                const response = await fetch(`/api/recursos/${watchedRecursoId}/eventos?start=${inicioDaSemana.toISOString()}&end=${fimDaSemana.toISOString()}`);
                if (!response.ok) throw new Error('Falha ao buscar agenda da semana');
                const data: CalendarEvent[] = await response.json();
                setEventosDaSemana(data.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()));
            } catch {
                toast.error("Não foi possível carregar a agenda do recurso.");
                setEventosDaSemana([]);
            } finally {
                setIsLoadingEventos(false);
            }
        };

        fetchEventos();
    }, [watchedRecursoId, watchedData]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormItem>
                        <FormLabel>1. Laboratório</FormLabel>
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
                    </FormItem>
                    <FormField
                        control={form.control}
                        name="recursoId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>2. Recurso</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} disabled={!selectedLabId || isLoadingRecursos}>
                                    <FormControl>
                                        <SelectTrigger>
                                            {isLoadingRecursos && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            <SelectValue placeholder="Escolha um recurso..." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {recursos.map((rec) => (
                                            <SelectItem key={rec.id} value={rec.id}>{rec.nome}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="data"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>3. Data de Referência</FormLabel>
                                <DatePicker
                                    {...field}
                                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {watchedRecursoId && watchedData && (
                    <div>
                        <FormLabel>Agenda da Semana</FormLabel>
                        <WeeklyScheduleView
                            events={eventosDaSemana}
                            isLoading={isLoadingEventos}
                            weekStart={startOfWeek(watchedData)}
                        />
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <FormField
                        control={form.control}
                        name="horaInicio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>4. Horário de Início</FormLabel>
                                <TimePicker {...field} />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="horaFim"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Horário de Fim</FormLabel>
                                <TimePicker {...field} />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="justificativa"
                        render={({ field }) => (
                            <FormItem className="md:col-span-3">
                                <FormLabel>5. Justificativa</FormLabel>
                                <FormControl><Textarea placeholder="Descreva o propósito da reserva..." {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end">
                    <Button type="submit" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Solicitar Reserva
                    </Button>
                </div>
            </form>
        </Form>
    );
}