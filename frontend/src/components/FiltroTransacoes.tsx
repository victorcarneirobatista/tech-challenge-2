"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Props {
  onFiltrar: (tipo: string, data: Date | null) => void;
}

export default function FiltroTransacoes({ onFiltrar }: Props) {
  const [tipoSelecionado, setTipoSelecionado] = useState("Todos");
  const [dataSelecionada, setDataSelecionada] = useState<Date | null>(null);

  const aplicarFiltro = () => {
    onFiltrar(tipoSelecionado, dataSelecionada);
  };

  const resetarFiltro = () => {
    setTipoSelecionado("Todos");
    setDataSelecionada(null);
    onFiltrar("Todos", null);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select
        value={tipoSelecionado}
        onValueChange={(value) => setTipoSelecionado(value)}
      >
        <SelectTrigger className="w-[160px] bg-zinc-900 text-white border border-zinc-700">
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-900 text-white border-zinc-700">
          <SelectItem value="Todos">Todos</SelectItem>
          <SelectItem value="Depósito">Depósitos</SelectItem>
          <SelectItem value="Transferência">Transferências</SelectItem>
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="bg-zinc-800 text-white border border-zinc-700"
          >
            <CalendarDaysIcon className="h-4 w-4 mr-2" />
            {dataSelecionada
              ? format(dataSelecionada, "dd/MM/yyyy")
              : "Selecionar data"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="bg-zinc-900 border border-zinc-700 text-white w-auto p-2">
          <Calendar
            mode="single"
            selected={dataSelecionada ?? undefined}
            onSelect={(date) => setDataSelecionada(date ?? null)}
            locale={ptBR}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Button
        onClick={aplicarFiltro}
        className="bg-byteGreen hover:bg-green-600 text-black"
      >
        Aplicar Filtro
      </Button>

      <Button
        onClick={resetarFiltro}
        variant="outline"
        className="border border-zinc-600"
      >
        Limpar
      </Button>
    </div>
  );
}
