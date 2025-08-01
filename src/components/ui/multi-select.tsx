'use client'
import { KeyboardEvent, useState, useId } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { X as RemoveIcon, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export type MultiSelectOption = { value: string; label: string; };

interface MultiSelectProps {
    name: string;
    options: MultiSelectOption[];
    defaultValues?: string[];
    placeholder?: string;
}

export function MultiSelect({ name, options, defaultValues = [], placeholder = "Selecione..." }: MultiSelectProps) {
    const [selectedValues, setSelectedValues] = useState<string[]>(defaultValues);
    const [isOpen, setIsOpen] = useState(false);
    const listboxId = useId();

    const toggleOption = (value: string) => {
        setSelectedValues(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
    };

    const getLabel = (value: string) => options.find(o => o.value === value)?.label || value;

    const handleKeyDown = (e: KeyboardEvent<HTMLSpanElement>, value: string) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            toggleOption(value);
        }
    };

    return (
        <div>
            {selectedValues.map(value => <input key={value} type="hidden" name={name} value={value} />)}

            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <div
                        role="combobox"
                        aria-haspopup="listbox"
                        aria-expanded={isOpen}
                        aria-controls={listboxId}
                        className={cn(
                            "flex items-center justify-between w-full h-auto min-h-10 py-1.5 px-3 text-sm ring-offset-background",
                            "border border-input bg-transparent rounded-md",
                            "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 cursor-pointer"
                        )}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <div className="flex gap-1 flex-wrap">
                            {selectedValues.length > 0 ? (
                                selectedValues.map(value => (
                                    <Badge variant="secondary" key={value} className="flex items-center gap-1">
                                        <span>{getLabel(value)}</span>
                                        <span
                                            role="button"
                                            tabIndex={0}
                                            aria-label={`Remover ${getLabel(value)}`}
                                            className="ml-1 ring-offset-background rounded-full outline-none"
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleOption(value); }}
                                            onKeyDown={(e) => handleKeyDown(e, value)}
                                        >
                                            <RemoveIcon className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                        </span>
                                    </Badge>
                                ))
                            ) : (
                                <span className="text-muted-foreground">{placeholder}</span>
                            )}
                        </div>
                    </div>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <Command>
                        <CommandInput placeholder="Buscar..." />
                        <CommandList id={listboxId} role="listbox">
                            <CommandEmpty>Nenhum resultado.</CommandEmpty>
                            <CommandGroup>
                                {options.map(option => (
                                    <CommandItem
                                        key={option.value}
                                        onSelect={() => toggleOption(option.value)}
                                        className="cursor-pointer"
                                        role="option"
                                        aria-selected={selectedValues.includes(option.value)}
                                    >
                                        <Check className={cn("mr-2 h-4 w-4", selectedValues.includes(option.value) ? "opacity-100" : "opacity-0")} />
                                        {option.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}