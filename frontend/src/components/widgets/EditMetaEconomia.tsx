"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useWidgetStore } from "@/store/useWidgetStore";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

function formatarParaBRL(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function limparMascara(valorFormatado: string) {
  return Number(valorFormatado.replace(/\D/g, "")) / 100;
}

export default function EditMetaEconomia() {
  const { metaEconomia, setMetaEconomia } = useWidgetStore();
  const [aberto, setAberto] = useState(false);
  const [valor, setValor] = useState(metaEconomia);
  const [campoTexto, setCampoTexto] = useState(formatarParaBRL(metaEconomia));
  const [limiteFlexivel, setLimiteFlexivel] = useState(false);

  const handleSalvar = () => {
    const valorFinal = limiteFlexivel ? limparMascara(campoTexto) : valor;
    setMetaEconomia(valorFinal);
    setAberto(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    const numero = Number(raw) / 100;
    setCampoTexto(formatarParaBRL(numero));
  };

  return (
    <Dialog open={aberto} onOpenChange={setAberto}>
      <span
        onClick={() => setAberto(true)}
        className="text-sm text-zinc-400 hover:text-white cursor-pointer"
      >
        Editar
      </span>

      <DialogContent className="bg-zinc-900 border-zinc-700 text-white">
        <DialogHeader>
          <DialogTitle>Editar Meta de Economia</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!limiteFlexivel ? (
            <>
              <p className="text-sm">Nova meta: {formatarParaBRL(valor)}</p>
              <Slider
                min={100}
                max={10000}
                step={100}
                value={[valor]}
                onValueChange={([v]) => setValor(v)}
              />
            </>
          ) : (
            <>
              <label className="text-sm">Digite a nova meta:</label>
              <input
                type="text"
                value={campoTexto}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded bg-zinc-800 border border-zinc-600 text-white"
              />
            </>
          )}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="flexivel"
              checked={limiteFlexivel}
              onChange={() => setLimiteFlexivel(!limiteFlexivel)}
              className="accent-green-500"
            />
            <label htmlFor="flexivel" className="text-sm cursor-pointer">
              Permitir definir acima de R$ 10.000,00
            </label>
          </div>

          <Button onClick={handleSalvar} className="w-full bg-green-500 text-black hover:bg-green-400">
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
