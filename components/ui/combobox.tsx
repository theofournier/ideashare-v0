"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

export interface ComboboxOption {
  value: string
  label: string
  color?: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  placeholder?: string
  emptyMessage?: string
  selectedValues: string[]
  onSelect: (value: string) => void
  onRemove: (value: string) => void
  multiple?: boolean
  className?: string
}

export function Combobox({
  options,
  placeholder = "Select option",
  emptyMessage = "No options found.",
  selectedValues,
  onSelect,
  onRemove,
  multiple = false,
  className,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  // Filter options based on search
  const filteredOptions = options.filter((option) => {
    const matchesSearch = option.label.toLowerCase().includes(search.toLowerCase())
    const isSelected = selectedValues.includes(option.value)
    // If multiple, show all matching options, otherwise hide selected ones
    return matchesSearch && (multiple || !isSelected)
  })

  // Get selected options for display
  const selectedOptions = selectedValues.map(
    (value) => options.find((option) => option.value === value) || { value, label: value },
  )

  return (
    <div className={cn("space-y-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
            {selectedValues.length > 0 && !multiple
              ? options.find((option) => option.value === selectedValues[0])?.label
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start" sideOffset={5}>
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={`Search ${placeholder.toLowerCase()}...`}
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => {
                      if (multiple) {
                        onSelect(option.value)
                        setSearch("")
                      } else {
                        onSelect(option.value)
                        setOpen(false)
                      }
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedValues.includes(option.value) ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {multiple && selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedOptions.map((option) => (
            <Badge key={option.value} variant="secondary" className={cn("gap-1 px-2 py-1", option.color)}>
              {option.label}
              <X className="h-3 w-3 cursor-pointer" onClick={() => onRemove(option.value)} />
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
