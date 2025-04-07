"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

interface SalaryInputProps {
  defaultValues?: {
    from: number;
    to: number;
  };
  onSalaryChange?: (value: { from: number; to: number }) => void;
  onCurrencyChange?: (value: string) => void;
  onPeriodChange?: (value: string) => void;
  isLoading?: boolean;
}

export function SalaryInput({ 
  defaultValues, 
  onSalaryChange, 
  onCurrencyChange, 
  onPeriodChange,
  isLoading
}: SalaryInputProps) {
  const [from, setFrom] = useState<string>(defaultValues?.from?.toString() || "");
  const [to, setTo] = useState<string>(defaultValues?.to?.toString() || "");

  // Aktualizace stavů když se změní defaultValues
  useEffect(() => {
    if (defaultValues?.from) {
      setFrom(defaultValues.from.toString());
    }
    if (defaultValues?.to) {
      setTo(defaultValues.to.toString());
    }
  }, [defaultValues]);

  const handleFromChange = (value: string) => {
    setFrom(value);
    if (onSalaryChange) {
      onSalaryChange({
        from: value ? parseInt(value) : 0,
        to: to ? parseInt(to) : 0
      });
    }
  };

  const handleToChange = (value: string) => {
    setTo(value);
    if (onSalaryChange) {
      onSalaryChange({
        from: from ? parseInt(from) : 0,
        to: value ? parseInt(value) : 0
      });
    }
  };

  return (
    <div className="space-y-1">
      <Label>Mzda</Label>
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2 relative">
          <Input
            type="number"
            placeholder="Od"
            className="w-[120px]"
            value={from}
            onChange={(e) => handleFromChange(e.target.value)}
          />
          <span>-</span>
          <Input 
            type="number" 
            placeholder="Do" 
            className="w-[120px]" 
            value={to}
            onChange={(e) => handleToChange(e.target.value)} 
          />
          {isLoading && (
            <div className="absolute right-[-35px] top-1/2 transform -translate-y-1/2 flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">načítám...</span>
              <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
        <Select onValueChange={onCurrencyChange} defaultValue="czk">
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Měna" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="czk">CZK</SelectItem>
            <SelectItem value="eur">EUR</SelectItem>
            <SelectItem value="usd">USD</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={onPeriodChange} defaultValue="month">
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Období" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">měsíc</SelectItem>
            <SelectItem value="hour">hodina</SelectItem>
            <SelectItem value="day">den</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

