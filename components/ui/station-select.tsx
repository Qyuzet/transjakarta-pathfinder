'use client';

import * as React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface StationSelectProps {
  stations: { id: string; name: string }[];
  value: string | undefined;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function StationSelect({
  stations,
  value,
  onValueChange,
  placeholder = "Select station",
  className,
}: StationSelectProps) {
  const [open, setOpen] = React.useState(false);
  
  const selectedStation = React.useMemo(() => {
    return stations.find((station) => station.id === value);
  }, [stations, value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between h-9", className)}
        >
          {selectedStation ? selectedStation.name : placeholder}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-full p-0 z-[9999]" 
        align="start"
        side="bottom"
        sideOffset={5}
        avoidCollisions={false}
      >
        <Command>
          <CommandInput placeholder="Search station..." className="h-9" />
          <CommandEmpty>No station found.</CommandEmpty>
          <CommandGroup>
            <ScrollArea className="h-[200px]">
              {stations.map((station) => (
                <CommandItem
                  key={station.id}
                  value={station.id}
                  onSelect={() => {
                    onValueChange(station.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === station.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {station.name}
                </CommandItem>
              ))}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
