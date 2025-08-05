import { create } from "zustand"

type Transacao = {
  id: string;
  tipo: "Credit" | "Debit" | "Depósito" | "Transferência";  // Aceita ambos tipos
  valor: number;
  data: string;
  accountId?: string; // Se for necessário
}

type TransacaoAPI = {
  id: string;
  tipo: "Credit" | "Debit"; // Para a API
  valor: number;
  data: string;
  accountId?: string; // Se necessário
}

type State = {
  transacoes: Transacao[]
  transacoesFiltradas: Transacao[]
  transacoesPaginadas: Transacao[]
  balance: number
  pagina: number
  carregandoMais: boolean
  fimDaPaginacao: boolean
  setTransacoes: (lista: TransacaoAPI[]) => void
  adicionarTransacao: (t: TransacaoAPI) => void
  editarTransacao: (t: TransacaoAPI) => void
  removerTransacao: (id: string) => void
  aplicarFiltro: (tipo: string, data?: Date) => void
  limparFiltro: () => void
  carregarMais: () => void
  resetarPaginacao: () => void
}

const useTransacoesStore = create<State>((set, get) => ({
  transacoes: [],
  transacoesFiltradas: [],
  transacoesPaginadas: [],
  balance: 0,
  pagina: 1,
  carregandoMais: false,
  fimDaPaginacao: false,

  setTransacoes: (lista) => {
    const transacoesConvertidas: Transacao[] = lista.map((t) => ({
      id: t.id,
      tipo: t.tipo === "Credit" ? "Depósito" : "Transferência",
      valor: t.valor,
      data: t.data,
    }))

    const novoSaldo = transacoesConvertidas.reduce((acc, t) => acc + t.valor, 0)

    set({
      transacoes: transacoesConvertidas,
      transacoesFiltradas: transacoesConvertidas,
      transacoesPaginadas: transacoesConvertidas.slice(0, 10),
      balance: novoSaldo,
      pagina: 1,
      fimDaPaginacao: transacoesConvertidas.length <= 10,
    })
  },

  adicionarTransacao: (nova) =>
    set((state) => {
      const tipoFinal: "Depósito" | "Transferência" =
        nova.tipo === "Credit" ? "Depósito" : "Transferência"

      const transacaoCorrigida: Transacao = {
        id: nova.id,
        tipo: tipoFinal,
        valor: nova.valor,
        data: nova.data,
      }

      const novas = [...state.transacoes, transacaoCorrigida]
      const novoSaldo = novas.reduce((acc, t) => acc + t.valor, 0)

      return {
        transacoes: novas,
        transacoesFiltradas: novas,
        transacoesPaginadas: novas.slice(0, 10),
        balance: novoSaldo,
        pagina: 1,
        fimDaPaginacao: novas.length <= 10,
      }
    }),

  editarTransacao: (atualizada) =>
    set((state) => {
      const tipoFinal: "Depósito" | "Transferência" =
        atualizada.tipo === "Credit" ? "Depósito" : "Transferência"

      const transacaoAtualizada: Transacao = {
        id: atualizada.id,
        tipo: tipoFinal,
        valor: atualizada.valor,
        data: atualizada.data,
      }

      const novas = state.transacoes.map((t) =>
        t.id === atualizada.id ? transacaoAtualizada : t
      )

      const novoSaldo = novas.reduce((acc, t) => acc + t.valor, 0)

      return {
        transacoes: novas,
        transacoesFiltradas: novas,
        transacoesPaginadas: novas.slice(0, 10),
        balance: novoSaldo,
        pagina: 1,
        fimDaPaginacao: novas.length <= 10,
      }
    }),

  removerTransacao: (id) =>
    set((state) => {
      const novas = state.transacoes.filter((t) => t.id !== id)
      const novoSaldo = novas.reduce((acc, t) => acc + t.valor, 0)
      return {
        transacoes: novas,
        transacoesFiltradas: novas,
        transacoesPaginadas: novas.slice(0, 10),
        balance: novoSaldo,
        pagina: 1,
        fimDaPaginacao: novas.length <= 10,
      }
    }),

  aplicarFiltro: (tipo, data) =>
    set((state) => {
      let resultado = [...state.transacoes]
      if (tipo !== "Todos") {
        resultado = resultado.filter((t) => t.tipo === tipo)
      }
      if (data) {
        const dataFormatada = data.toISOString().substring(0, 10)
        resultado = resultado.filter((t) => t.data.startsWith(dataFormatada))
      }
      return {
        transacoesFiltradas: resultado,
        transacoesPaginadas: resultado.slice(0, 10),
        pagina: 1,
        fimDaPaginacao: resultado.length <= 10,
      }
    }),

  limparFiltro: () =>
    set((state) => ({
      transacoesFiltradas: state.transacoes,
      transacoesPaginadas: state.transacoes.slice(0, 10),
      pagina: 1,
      fimDaPaginacao: state.transacoes.length <= 10,
    })),

  carregarMais: () => {
    const { pagina, transacoesFiltradas, transacoesPaginadas } = get()
    const proximaPagina = pagina + 1
    const novosItens = transacoesFiltradas.slice(0, proximaPagina * 10)

    const chegouAoFim = novosItens.length === transacoesPaginadas.length

    set({ carregandoMais: true })

    setTimeout(() => {
      set({
        transacoesPaginadas: novosItens,
        pagina: proximaPagina,
        carregandoMais: false,
        fimDaPaginacao: chegouAoFim,
      })
    }, 500)
  },

  resetarPaginacao: () => {
    const { transacoesFiltradas } = get()
    set({
      transacoesPaginadas: transacoesFiltradas.slice(0, 10),
      pagina: 1,
      fimDaPaginacao: transacoesFiltradas.length <= 10,
    })
  },
}))

export default useTransacoesStore
