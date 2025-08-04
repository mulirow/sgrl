'use client';

import { useState, useEffect, useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getStatusVariant } from '@/lib/utils';
import { type CalendarEvent } from '@/app/api/recursos/[resourceId]/eventos/route';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { startOfMonth, endOfMonth, isSameDay } from 'date-fns';

interface ResourceCalendarProps {
    resourceId: string;
}

export function ResourceCalendar({ resourceId }: ResourceCalendarProps) {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            setIsLoading(true);
            setError(null);

            const start = startOfMonth(currentMonth);
            const end = endOfMonth(currentMonth);

            try {
                const response = await fetch(`/api/recursos/${resourceId}/eventos?start=${start.toISOString()}&end=${end.toISOString()}`);
                if (!response.ok) {
                    throw new Error('Falha ao buscar os eventos.');
                }
                const data: CalendarEvent[] = await response.json();
                setEvents(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, [resourceId, currentMonth]);

    const selectedDayEvents = useMemo(() => {
        if (!date) return [];
        return events
            .filter(event => {
                const eventStart = new Date(event.start);
                const eventEnd = new Date(event.end);
                return isSameDay(date, eventStart) || (date > eventStart && date < eventEnd);
            })
            .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    }, [date, events]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    onMonthChange={setCurrentMonth}
                    className="rounded-md border"
                    locale={ptBR}
                />
            </div>
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Eventos para {date ? format(date, 'dd/MM/yyyy') : 'Nenhum dia selecionado'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-96 overflow-y-auto">
                        {isLoading && (
                            <div className="flex justify-center items-center h-full">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                        )}
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Erro</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        {!isLoading && !error && (
                            <>
                                {selectedDayEvents.length > 0 ? (
                                    <div className="space-y-4">
                                        {selectedDayEvents.map(event => (
                                            <div key={event.id} className="p-3 rounded-lg border bg-card">
                                                <div className="flex justify-between items-center">
                                                    <p className="font-semibold text-sm">{event.title}</p>
                                                    <Badge variant={getStatusVariant(event.status)}>{event.status.replace('_', ' ')}</Badge>
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {format(new Date(event.start), 'HH:mm')} - {format(new Date(event.end), 'HH:mm')}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center pt-10">
                                        Nenhum evento para este dia.
                                    </p>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}