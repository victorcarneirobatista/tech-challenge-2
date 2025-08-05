"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, PencilSquareIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useTransacoesStore from "@/store/useTransacoesStore";

interface Props {
  transacao: {
    id: string;
    tipo: "Depósito" | "Transferência";
    valor: number;
    data: string;
  };
}

export default function EditarTransacaoModal({ transacao }: Props) {
  const [aberto, setAberto] = useState(false);
  const [tipo, setTipo] = useState<"Depósito" | "Transferência">(transacao.tipo);
  const [valor, setValor] = useState(
    transacao.valor.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
  const [data, setData] = useState<Date | undefined>(new Date(transacao.data));
  const [popoverAberto, setPopoverAberto] = useState(false);

  const { editarTransacao } = useTransacoesStore();

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, "");
    const num = Number(raw) / 100;
    const formatado = num.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    setValor(formatado);
  };

const handleEditar = async () => {
  const token = localStorage.getItem("token");
  const accountId = localStorage.getItem("contaId");

  if (!token || !accountId) {
    alert("Token ou conta não encontrados.");
    return;
  }

  const valorConvertido = parseFloat(
    valor.replace("R$", "").replace(/\./g, "").replace(",", ".")
  );

  const payload = {
    type: tipo === "Depósito" ? "Credit" : "Debit",
    value:
      tipo === "Transferência"
        ? -Math.abs(valorConvertido)
        : Math.abs(valorConvertido),
    date: data?.toISOString().split("T")[0] ?? transacao.data,
    accountId,
  };

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/account/transaction/${transacao.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();
    if (!response.ok) {
      alert(result?.message || "Erro ao editar transação.");
      return;
    }

    // Atualiza na store local
    editarTransacao({
      id: transacao.id,
      tipo: tipo === "Depósito" ? "Credit" : "Debit",
      valor:
        tipo === "Transferência"
          ? -Math.abs(valorConvertido)
          : Math.abs(valorConvertido),
      data: data?.toISOString().split("T")[0] ?? transacao.data,
    });

    setAberto(false);
  } catch (error) {
    alert("Erro inesperado ao editar transação.");
  }
};

  return (
    <>
      <PencilSquareIcon
        className="h-5 w-5 text-blue-400 hover:text-blue-600 cursor-pointer"
        onClick={() => setAberto(true)}
      />

      {aberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-zinc-900 p-6 rounded-lg w-full max-w-sm relative">
            {/* Botão de fechar */}
            <button
              className="absolute top-3 right-3 text-zinc-400 hover:text-white"
              onClick={() => setAberto(false)}
              aria-label="Fechar"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-semibold mb-4">Editar Transação</h2>

            {/* Tipo */}
            <Select value={tipo} onValueChange={(v) => setTipo(v as "Depósito" | "Transferência")}>
              <SelectTrigger className="mb-3">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Depósito">Depósito</SelectItem>
                <SelectItem value="Transferência">Transferência</SelectItem>
              </SelectContent>
            </Select>

            {/* Valor */}
            <Input
              className="mb-3"
              value={valor}
              onChange={handleValorChange}
              placeholder="R$ 0,00"
            />

            {/* Data com calendário */}
            <Popover open={popoverAberto} onOpenChange={setPopoverAberto}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal mb-3",
                    !data && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {data ? format(data, "dd/MM/yyyy") : <span>Escolha a data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-zinc-900 border-zinc-700">
                <Calendar
                  mode="single"
                  selected={data}
                  onSelect={(d) => {
                    setData(d);
                    setPopoverAberto(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {/* Botão salvar */}
            <Button onClick={handleEditar} className="w-full">
              Salvar
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
