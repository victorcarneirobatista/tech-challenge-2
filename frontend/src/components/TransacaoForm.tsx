"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarDaysIcon, PaperClipIcon } from "@heroicons/react/24/outline";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import useTransacoesStore from "@/store/useTransacoesStore";

type Transacao = {
  id: string;
  tipo: "Depósito" | "Transferência";
  valor: number;
  data: string;
};

interface Props {
  contaId: string;
  transacoes: Transacao[];
  setTransacoes: (lista: Transacao[]) => void;
  limparFiltro: () => void;
  transacaoSelecionada: Transacao | null;
  setTransacaoSelecionada: (t: Transacao | null) => void;
  modoEdicao: boolean;
  setModoEdicao: (v: boolean) => void;
}

export default function TransacaoForm({
  contaId,
  transacoes,
  setTransacoes,
  limparFiltro,
  transacaoSelecionada,
  setTransacaoSelecionada,
  modoEdicao,
  setModoEdicao,
}: Props) {
  const [tipo, setTipo] = useState<"" | "Depósito" | "Transferência">("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState<Date | undefined>(new Date());
  const [comprovante, setComprovante] = useState<File | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const [categoriaSugerida, setCategoriaSugerida] = useState("");

  const { adicionarTransacao } = useTransacoesStore();

  const formatarParaBRL = (valor: string) => {
    const clean = valor.replace(/\D/g, "");
    const numero = parseFloat(clean) / 100;
    return numero.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valorInput = e.target.value;
    setValor(formatarParaBRL(valorInput));

    const valorNumerico = parseFloat(valorInput.replace(/\D/g, "")) / 100;
    let sugestao = "";

    if (tipo === "Depósito") {
      sugestao =
        valorNumerico >= 500
          ? "💼 Salário ou entrada fixa"
          : "💰 Pix recebido ou transferência entre contas";
    } else if (tipo === "Transferência") {
      sugestao =
        valorNumerico >= 500
          ? "🧾 Pagamento de fatura ou aluguel"
          : "🍔 Gasto cotidiano ou conta básica (água, luz)";
    }

    setCategoriaSugerida(valorNumerico > 0 ? sugestao : "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contaId) return alert("Conta ainda não carregada.");
    const token = localStorage.getItem("token");
    if (!token) return alert("Token não encontrado.");
    if (!tipo) return alert("Selecione o tipo da transação.");

    const valorNumerico = parseFloat(
      valor.replace("R$", "").replace(/\./g, "").replace(",", ".")
    );
    if (valorNumerico <= 0) return alert("Informe um valor válido.");

    const novaTransacao = {
      type: tipo === "Depósito" ? "Credit" : "Debit",
      value: valorNumerico,
      date: data
        ? new Date(data.getFullYear(), data.getMonth(), data.getDate(), 12, 0, 0)
            .toISOString()
            .substring(0, 10)
        : "",
      accountId: contaId,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/account/transaction`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(novaTransacao),
        }
      );

      const resultado = await response.json();
      if (!response.ok) return alert(resultado?.message || "Erro na transação");

      const nova = resultado?.result?.result;
      const id = nova?.id || nova?._id;

      if (!id || !nova?.type || nova.value == null || !nova.date) {
        alert("Transação criada, mas resposta incompleta.");
        return;
      }

      const tipoMapeado =
        nova.type?.toLowerCase?.() === "credit"
          ? "Depósito"
          : "Transferência";

      const novaFormatada: Transacao = {
        id,
        tipo: tipoMapeado,
        valor: nova.value,
        data: nova.date,
      };

      setTransacoes([...transacoes, novaFormatada]);
      adicionarTransacao({
        id,
        tipo: nova.type,
        valor: nova.value,
        data: nova.date,
      });

      limparFiltro();

      setTipo("");
      setValor("");
      setData(new Date());
      setComprovante(undefined);
      setCategoriaSugerida("");

      setMensagemSucesso("Transação criada com sucesso!");
      setTimeout(() => setMensagemSucesso(""), 4000);
    } catch {
      alert("Erro inesperado ao criar transação.");
    }
  };

  return (
    <div className="relative">
      <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Tipo</label>
            <Select value={tipo} onValueChange={(v) => setTipo(v as any)}>
              <SelectTrigger className="w-full bg-background border border-zinc-700 text-white">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent className="bg-background text-white border border-zinc-700">
                <SelectItem value="Depósito">Depósito</SelectItem>
                <SelectItem value="Transferência">Transferência</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Valor</label>
            <Input
              type="text"
              value={valor}
              onChange={handleValorChange}
              placeholder="R$ 0,00"
            />
            {categoriaSugerida && (
              <p className="text-xs text-gray-400 mt-1">
                Sugestão: {categoriaSugerida}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Data da transação
            </label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-background text-white",
                    !data && "text-muted-foreground"
                  )}
                >
                  <CalendarDaysIcon className="mr-2 h-4 w-4" />
                  {data ? format(data, "dd/MM/yyyy") : "Selecionar data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 bg-background text-white"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={data}
                  onSelect={(d) => {
                    if (d) {
                      setData(d);
                      setOpen(false);
                    }
                  }}
                  locale={ptBR}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Comprovante (opcional)
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                onChange={(e) => setComprovante(e.target.files?.[0])}
              />
              {comprovante && (
                <PaperClipIcon className="w-5 h-5 text-green-400" />
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Concluir transação
          </Button>
        </form>
      </div>

      {mensagemSucesso && (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white px-4 py-2 rounded-md shadow-lg z-50">
          {mensagemSucesso}
        </div>
      )}
    </div>
  );
}
