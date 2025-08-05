'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ChevronDownIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DateTimePickerProps {
    value?: Date;
    onChange: (date: Date | undefined) => void;
    label: string;
}

export function DateTimePicker({ value, onChange, label }: DateTimePickerProps) {
    const [datePart, setDatePart] = useState<Date | undefined>(value ? new Date(value) : undefined);
    const [timePart, setTimePart] = useState<string>(value ? format(new Date(value), 'HH:mm') : '00:00');
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    useEffect(() => {
        if (!datePart) {
            onChange(undefined);
            return;
        }
        const [hours, minutes] = timePart.split(':').map(Number);
        const newDate = new Date(datePart);
        newDate.setHours(hours);
        newDate.setMinutes(minutes);
        newDate.setSeconds(0);
        newDate.setMilliseconds(0);
        onChange(newDate);
    }, [datePart, timePart, onChange]);

    useEffect(() => {
        if (value) {
            setDatePart(new Date(value));
            setTimePart(format(new Date(value), 'HH:mm'));
        } else {
            setDatePart(undefined);
            setTimePart('00:00');
        }
    }, [value]);


    return (
        <div className='flex flex-col gap-3'>
            <Label className='px-1'>
                {label}
            </Label>
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                    <Button variant='outline' className='w-full justify-between font-normal'>
                        {datePart ? format(datePart, 'PPP') : 'Escolha uma data'}
                        <ChevronDownIcon className="h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto overflow-hidden p-0' align='start'>
                    <Calendar
                        mode='single'
                        selected={datePart}
                        onSelect={date => {
                            setDatePart(date);
                            setIsPopoverOpen(false);
                        }}
                    />
                </PopoverContent>
            </Popover>
            <Input
                type='time'
                step='60'
                value={timePart}
                onChange={(e) => setTimePart(e.target.value)}
                className='bg-background'
            />
        </div>
    );
}