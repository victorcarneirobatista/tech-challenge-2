"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import SaldoCard from "../components/SaldoCard"
import TransacaoForm from "../components/TransacaoForm"
import Extrato from "../components/Extrato"
import ResumoDrawer from "../components/ResumoDrawer"
import FiltroTransacoes from "../components/FiltroTransacoes"
import useUserStore from "@/store/useUserStore"
import useTransacoesStore from "@/store/useTransacoesStore"
import { format } from "date-fns"
import DashboardWidgets from "../components/widgets/DashboardWidgets"
import { Toaster } from "@/components/ui/toaster"
import { Bars3Icon } from "@heroicons/react/24/outline"
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
} from "@/components/ui/drawer"

type Transacao = {
  id: string
  tipo: "Depósito" | "Transferência"
  valor: number
  data: string
}

type TransacaoAPI = {
  _id: string
  type: "Credit" | "Debit"
  value: number
  date: string
}

export default function Home() {
  const router = useRouter()
  const [contaId, setContaId] = useState<string>("")
  const [transacaoSelecionada, setTransacaoSelecionada] = useState<Transacao | null>(null)
  const [modoEdicao, setModoEdicao] = useState(false)

  const { user, token, setAccountId, setUser } = useUserStore()
  const {
    setTransacoes: setTransacoesGlobal,
    transacoes,
    transacoesFiltradas,
    balance,
    editarTransacao,
    removerTransacao,
    aplicarFiltro,
    limparFiltro,
  } = useTransacoesStore()

  useEffect(() => {
    if (!token) {
      router.push("/login")
      return
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/account`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Erro ao buscar contas")
        const resposta = await res.json()
        const contas = resposta.result.account
        const nome = resposta.result.username

        if (nome) setUser(nome)

        if (contas.length > 0) {
          const conta = contas[0]
          const id = conta._id || conta.id
          setContaId(id)
          setAccountId(id)
          buscarExtrato(id, token)
        }
      })
      .catch((err) => console.error("Erro ao buscar contas:", err.message))
  }, [token])

  function buscarExtrato(accountId: string, token: string) {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/${accountId}/statement`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Erro ao buscar extrato")
        const extrato = await res.json()
        const transacoesAPI: TransacaoAPI[] = extrato.result?.transactions || []

        const paraStore = transacoesAPI.map((t) => ({
          id: t._id,
          tipo: t.type,
          valor: t.value,
          data: t.date,
        }))
        setTransacoesGlobal(paraStore)
      })
      .catch((err) => console.error("Erro ao buscar extrato:", err.message))
  }

  const filtrarTransacoes = (tipo: string, data: Date | null) => {
    aplicarFiltro(tipo, data || undefined)
  }

  const handleEditarTransacao = (t: Transacao) => {
    setTransacaoSelecionada(t)
    setModoEdicao(true)
  }

  return (
    <div className="min-h-screen font-inter bg-byteBackground text-white">
      <Toaster />
      <Header />

      <div className="px-4 md:px-6 py-6 flex justify-center">
        <div className="flex flex-col gap-6 w-full max-w-screen-xl md:grid md:grid-cols-[240px_1fr_380px]">

          {/* COLUNA 1: Sidebar (Mobile: Drawer, Desktop: visível) */}
          <>
            {/* Mobile: Drawer */}
            <div className="block md:hidden mb-4">
              <Drawer>
                <DrawerTrigger className="flex items-center gap-2 text-white px-4 py-2 border border-gray-600 rounded-md">
                  <Bars3Icon className="w-5 h-5" />
                  Menu
                </DrawerTrigger>
                <DrawerContent className="p-4">
                  <Sidebar />
                </DrawerContent>
              </Drawer>
            </div>

            {/* Desktop: Sidebar visível */}
            <div className="hidden md:block">
              <Sidebar />
            </div>
          </>

          {/* COLUNA 2: Conteúdo principal */}
          <div className="flex flex-col gap-6">
            <SaldoCard />
            <DashboardWidgets />

            {/* FORMULÁRIO VISUALMENTE APÓS SALDO NO MOBILE */}
            <div className="block md:hidden">
              <TransacaoForm
                contaId={contaId}
                transacoes={transacoes}
                setTransacoes={() => {}}
                limparFiltro={limparFiltro}
                transacaoSelecionada={transacaoSelecionada}
                setTransacaoSelecionada={setTransacaoSelecionada}
                modoEdicao={modoEdicao}
                setModoEdicao={setModoEdicao}
              />
            </div>

            <div className="flex justify-between items-center flex-wrap gap-4">
              <div className="flex gap-4">
                <ResumoDrawer />
              </div>
              <FiltroTransacoes onFiltrar={filtrarTransacoes} />
            </div>

            <Extrato />
          </div>

          {/* COLUNA 3: Formulário fixo no desktop */}
          <div className="hidden md:flex flex-col gap-6 sticky top-6 self-start h-fit">
            <TransacaoForm
              contaId={contaId}
              transacoes={transacoes}
              setTransacoes={() => {}}
              limparFiltro={limparFiltro}
              transacaoSelecionada={transacaoSelecionada}
              setTransacaoSelecionada={setTransacaoSelecionada}
              modoEdicao={modoEdicao}
              setModoEdicao={setModoEdicao}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
