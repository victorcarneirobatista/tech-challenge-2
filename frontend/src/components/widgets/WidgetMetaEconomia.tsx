"use client"

import { useWidgetStore } from "@/store/useWidgetStore"
import useTransacoesStore from "@/store/useTransacoesStore"
import { BanknotesIcon } from "@heroicons/react/24/solid"
import EditMetaEconomia from "./EditMetaEconomia"

export default function WidgetMetaEconomia() {
  const meta = useWidgetStore((s) => s.metaEconomia)
  const saldo = useTransacoesStore((s) => s.balance)

  return (
    <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-700">
      <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
        <BanknotesIcon className="w-5 h-5 text-green-400" />
        Meta de Economia
        <div className="ml-auto">
          <EditMetaEconomia />
        </div>
      </h3>

      <p className="text-sm text-zinc-400">
        Meta:{" "}
        <span className="text-white">
          R$ {meta.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </span>
      </p>

      <p className="text-sm text-zinc-400">
        Economizado:{" "}
        <span className="text-white">
          R$ {saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </span>
      </p>
    </div>
  )
}
