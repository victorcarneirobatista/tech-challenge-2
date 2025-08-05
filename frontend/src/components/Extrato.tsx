import { useState, useEffect, useRef } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import EditarTransacaoModal from "./EditarTransacaoModal";
import useTransacoesStore from "@/store/useTransacoesStore";

type Transacao = {
  id: string;
  tipo: "Depósito" | "Transferência";
  valor: number;
  data: string;
};

export default function Extrato() {
  const {
    transacoesPaginadas,
    removerTransacao,
    editarTransacao,
    carregarMais,
    resetarPaginacao,
    fimDaPaginacao,
    carregandoMais,
  } = useTransacoesStore();

  const [confirmarExclusaoId, setConfirmarExclusaoId] = useState<string | null>(null);
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    resetarPaginacao();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !carregandoMais && !fimDaPaginacao) {
          carregarMais();
        }
      },
      { threshold: 1 }
    );

    const current = observerRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [observerRef, carregandoMais, fimDaPaginacao]);

  const formatarBRL = (valor: number) =>
    valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const formatarData = (data: string) => {
    const date = new Date(data);
    const dataCorrigida = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    return dataCorrigida.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  const transacoesOrdenadas = [...(transacoesPaginadas ?? [])].sort(
    (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
  );

  return (
    <div className="bg-zinc-900 p-4 rounded-xl mt-6">
      <h2 className="text-lg font-semibold mb-4">Extrato</h2>

      {transacoesOrdenadas.length === 0 ? (
        <p className="text-muted-foreground">Nenhuma transação registrada.</p>
      ) : (
        <div className="pr-1">
          <ul className="flex flex-col gap-3 w-full">
            {transacoesOrdenadas.map((t) => {
              const tipoConvertido = t.tipo === "Credit" ? "Depósito" : "Transferência";
              const corTexto = Number(t.valor) < 0 ? "text-red-400" : "text-green-400";

              return (
                <li
                  key={t.id}
                  className="relative w-full flex justify-between items-center hover:bg-zinc-800 px-4 py-3 rounded transition-colors"
                >
                  <div>
                    <p className="text-sm text-muted-foreground">{formatarData(t.data)}</p>
                    <p className={`font-semibold ${corTexto}`}>
                      {t.valor < 0 ? "Transferência" : "Depósito"}{" "}
                      {formatarBRL(Math.abs(t.valor))}
                    </p>
                  </div>

                  <div className="flex gap-3 items-center">
                    <EditarTransacaoModal transacao={{ ...t, tipo: tipoConvertido }} />
                    <TrashIcon
                      className="h-5 w-5 text-red-400 hover:text-red-600 cursor-pointer"
                      onClick={() => setConfirmarExclusaoId(t.id)}
                    />
                  </div>

                  {confirmarExclusaoId === t.id && (
                    <div className="absolute top-full right-0 z-50 mt-2 bg-zinc-900 border border-zinc-700 rounded p-4 shadow-lg">
                      <p className="mb-2 text-sm">Tem certeza que deseja excluir?</p>
                      <div className="flex gap-2">
                        <button
                          className="px-3 py-1 bg-red-600 text-white rounded"
                          onClick={() => {
                            removerTransacao(t.id);
                            setConfirmarExclusaoId(null);
                          }}
                        >
                          Sim
                        </button>
                        <button
                          className="px-3 py-1 bg-zinc-600 text-white rounded"
                          onClick={() => setConfirmarExclusaoId(null)}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Elemento de interseção para scroll infinito */}
          <div ref={observerRef} className="h-6" />

          {/* Feedback de carregamento ou fim */}
          <div className="text-center text-xs text-muted-foreground pt-2">
            {carregandoMais
              ? "Carregando mais..."
              : fimDaPaginacao
              ? "Fim do extrato"
              : ""}
          </div>
        </div>
      )}
    </div>
  );
}
