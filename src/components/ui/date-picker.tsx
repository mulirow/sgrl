'use client';

import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DatePickerProps {
    disabled?: (date: Date) => boolean;
}

interface FieldProps {
    name: string;
    value?: Date;
    onChange: (value?: Date) => void;
}

export function DatePicker({ disabled, name, value, onChange }: DatePickerProps & FieldProps) {
    const handleSelect = (day: Date | undefined) => {
        if (day !== undefined) {
            onChange(day);
        }
    };

    return (
        <>
            {name && value && <input type="hidden" name={name} value={value.toISOString()} />}
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={'outline'}
                        className={cn('w-full justify-start text-left font-normal', !value && 'text-muted-foreground')}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {value ? format(value, 'PPP') : <span>Escolha uma data</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={value}
                        onSelect={handleSelect}
                        disabled={disabled}
                        autoFocus
                    />
                </PopoverContent>
            </Popover>
        </>
    );
}