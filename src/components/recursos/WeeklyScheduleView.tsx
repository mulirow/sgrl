'use client';

import { format, getDay, getHours, getMinutes, differenceInMinutes, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { type CalendarEvent } from '@/app/api/recursos/[resourceId]/eventos/route';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface WeeklyScheduleViewProps {
    events: CalendarEvent[];
    isLoading: boolean;
    weekStart: Date;
}

const ROW_HEIGHT_IN_REM = 3;
const HOURS_IN_DAY = 24;

export function WeeklyScheduleView({ events, isLoading, weekStart }: WeeklyScheduleViewProps) {
    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    const hours = Array.from({ length: HOURS_IN_DAY }, (_, i) => i);

    const eventsByDay: Record<number, CalendarEvent[]> = {};
    for (let i = 0; i < 7; i++) { eventsByDay[i] = []; }
    events.forEach(event => {
        const dayIndex = getDay(new Date(event.start));
        if (eventsByDay[dayIndex]) {
            eventsByDay[dayIndex].push(event);
        }
    });

    return (
        <div className="relative border rounded-lg overflow-auto bg-background" style={{ height: `${(HOURS_IN_DAY + 1) * ROW_HEIGHT_IN_REM}rem` }}>
            {isLoading && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-20">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            )}
            <div className="grid grid-cols-[4rem_repeat(7,minmax(120px,1fr))]">
                <div className="row-start-1 col-start-1 sticky top-0 z-10 bg-background border-b border-r"></div>
                {days.map((day) => (
                    <div key={day.toISOString()} className="row-start-1 col-start-auto text-center font-medium p-2 border-b border-l sticky top-0 z-10 bg-background">
                        <p className="text-sm capitalize">{format(day, 'EEE', { locale: ptBR })}</p>
                        <p className="text-lg">{format(day, 'd')}</p>
                    </div>
                ))}

                <div className="row-start-2 col-start-1">
                    {hours.map(hour => (
                        <div key={hour} className="text-xs text-right pr-2 border-r" style={{ height: `${ROW_HEIGHT_IN_REM}rem` }}>
                            <span className="relative top-[-0.5em] text-muted-foreground">{format(new Date(2000, 0, 1, hour), 'h a')}</span>
                        </div>
                    ))}
                </div>

                {days.map((day, dayIndex) => (
                    <div key={day.toISOString()} className="row-start-2 col-start-auto relative border-l">
                        {hours.map(hour => (
                            <div key={hour} className="border-b" style={{ height: `${ROW_HEIGHT_IN_REM}rem` }}></div>
                        ))}

                        {!isLoading && eventsByDay[dayIndex].map(event => {
                            const start = new Date(event.start);
                            const end = new Date(event.end);

                            const topOffset = (getHours(start) + getMinutes(start) / 60) * ROW_HEIGHT_IN_REM;
                            const durationInMinutes = differenceInMinutes(end, start);
                            const height = (durationInMinutes / 60) * ROW_HEIGHT_IN_REM;

                            return (
                                <div
                                    key={event.id}
                                    className={cn(
                                        "absolute left-1 right-1 p-2 rounded-md text-white overflow-hidden text-xs shadow-md z-10",
                                        event.status === 'APROVADA' && 'bg-green-700 hover:bg-green-600',
                                        event.status === 'PENDENTE' && 'bg-gray-700 hover:bg-gray-600 border-2 border-dashed border-gray-400',
                                        event.status === 'EM_USO' && 'bg-green-700 hover:bg-green-600'
                                    )}
                                    style={{
                                        top: `${topOffset}rem`,
                                        height: `${height}rem`,
                                    }}
                                >
                                    <p className="font-semibold truncate">{event.title.split(' - ')[1] || event.title}</p>
                                    <p>{format(start, 'HH:mm')} - {format(end, 'HH:mm')}</p>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}