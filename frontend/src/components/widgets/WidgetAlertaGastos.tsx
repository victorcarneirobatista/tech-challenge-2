"use client"

import { useWidgetStore } from "@/store/useWidgetStore"
import useTransacoesStore from "@/store/useTransacoesStore"
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline"
import EditAlertaGastos from "./EditAlertaGastos"

export default function WidgetAlertaGastos() {
  const limite = useWidgetStore((s) => s.limiteGastos)
  const transacoes = useTransacoesStore((s) => s.transacoes)

  // ✅ Somar apenas transferências
  const gastoAtual = transacoes
    .filter((t) => t.tipo === "Transferência")
    .reduce((acc, t) => acc + t.valor, 0)

  const dentroDoLimite = Math.abs(gastoAtual) <= limite

  const formatarBRL = (valor: number) =>
    valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

  return (
    <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-700 shadow-md flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400" />
          Alerta de Gastos
        </h3>

        <EditAlertaGastos />
      </div>

      <p className="text-sm text-zinc-400">Limite: {formatarBRL(limite)}</p>

      {limite > 0 && (
        <p className="text-sm text-zinc-400">
          {dentroDoLimite ? (
            <span className="text-green-500">Dentro do limite de gastos</span>
          ) : (
            <span className="text-red-500">⚠️ Gastos acima do limite!</span>
          )}
        </p>
      )}
    </div>
  )
}
