"use client"
import { useState } from "react"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import useTransacoesStore from "@/store/useTransacoesStore"

export default function SaldoCard() {
  const [mostrarSaldo, setMostrarSaldo] = useState(true)
  const saldoTotal = useTransacoesStore((state) => state.balance)

  const dataAtual = new Date()
  const dataFormatada = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(dataAtual)

  return (
    <div className="bg-zinc-900 text-white border border-zinc-700 rounded-lg p-6 shadow-md flex flex-col gap-2">
      {/* Cabeçalho */}
      <div className="flex flex-col">
        <p className="text-lg font-semibold">Olá</p>
        <p className="text-sm text-zinc-400">{dataFormatada}</p>
      </div>

      {/* Saldo com botão de olho */}
      <div className="mt-4">
        <p className="text-sm text-zinc-400">Saldo</p>
        <div className="flex items-center gap-2">
          <p className="text-3xl font-bold">
            {mostrarSaldo
              ? saldoTotal.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })
              : "R$ •••••"}
          </p>

          <button
            onClick={() => setMostrarSaldo((prev) => !prev)}
            className="text-zinc-400 hover:text-white transition-colors duration-200 p-1 rounded-md hover:bg-zinc-800"
            aria-label="Mostrar ou ocultar saldo"
          >
            {mostrarSaldo ? (
              <EyeIcon className="h-5 w-5" />
            ) : (
              <EyeSlashIcon className="h-5 w-5" />
            )}
          </button>
        </div>
        <p className="text-sm text-zinc-400">Conta Corrente</p>
      </div>
    </div>
  )
}
