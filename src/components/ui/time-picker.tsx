'use client';

import { Input } from '@/components/ui/input';
import { ChangeEvent } from 'react';

interface FieldProps {
    name: string;
    value?: string;
    onChange: (value: string) => void;
    onBlur: () => void;
    ref: (instance: HTMLInputElement | null) => void;
}

export function TimePicker(props: FieldProps) {
    const { onChange, ...rest } = props;

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value);
    };

    return (
        <Input
            type="time"
            step="60"
            {...rest}
            onChange={handleChange}
        />
    );
}