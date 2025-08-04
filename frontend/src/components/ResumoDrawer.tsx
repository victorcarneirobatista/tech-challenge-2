"use client"

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts"
import { ArrowTrendingUpIcon } from "@heroicons/react/24/solid"
import { useMemo, useState } from "react"
import useTransacoesStore from "@/store/useTransacoesStore"

const COLORS = {
  Depósito: "#4ade80",
  Transferência: "#ef4444",
}

export default function ResumoDrawer() {
  const [aberto, setAberto] = useState(false)
  const transacoes = useTransacoesStore((state) => state.transacoes)

  const transacoesValidas = useMemo(
    () => transacoes.filter((t) => t.tipo === "Depósito" || t.tipo === "Transferência"),
    [transacoes]
  )

  const dadosAgrupados = useMemo(() => {
    const totais = { Depósito: 0, Transferência: 0 }

    transacoesValidas.forEach((t) => {
      const valor = typeof t.valor === "number" ? t.valor : parseFloat(t.valor)
      if (!isNaN(valor)) {
        totais[t.tipo] += Math.abs(valor)
      }
    })

    const totalGeral = totais.Depósito + totais.Transferência

    return {
      barras: [
        { tipo: "Depósito", valor: totais.Depósito },
        { tipo: "Transferência", valor: totais.Transferência },
      ],
      pizza:
        totalGeral > 0
          ? [
              {
                nome: "Depósito",
                valor: totais.Depósito,
                percentual: (totais.Depósito / totalGeral) * 100,
              },
              {
                nome: "Transferência",
                valor: totais.Transferência,
                percentual: (totais.Transferência / totalGeral) * 100,
              },
            ]
          : [],
    }
  }, [transacoesValidas])

  const dadosLinha = useMemo(() => {
    const ordenadas = [...transacoesValidas].sort(
      (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
    )

    let saldo = 0
    return ordenadas.map((t) => {
      saldo += t.tipo === "Depósito" ? t.valor : -t.valor
      return {
        data: new Date(t.data).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
        }),
        saldo: parseFloat(saldo.toFixed(2)),
      }
    })
  }, [transacoesValidas])

  return (
    <Drawer open={aberto} onOpenChange={setAberto}>
      <DrawerTrigger asChild>
        <Button className="flex items-center gap-2 w-fit bg-byteGreen hover:bg-green-500 transition">
          <ArrowTrendingUpIcon className="w-4 h-4" />
          Ver Resumo Mensal
        </Button>
      </DrawerTrigger>

      <DrawerContent className="w-full px-4 pb-6 max-h-[90vh] overflow-y-auto lg:overflow-y-visible">
        <DrawerHeader className="text-center">
          <DrawerTitle className="text-white text-lg">Resumo Mensal</DrawerTitle>
          <DrawerDescription className="text-sm text-muted-foreground">
            Análise financeira com base nas transações do mês.
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-8 w-full lg:grid lg:grid-cols-3 lg:gap-4">
          {/* Gráfico de Barras */}
          <div className="w-full min-h-[260px]">
            <h3 className="text-white text-center mb-2 text-sm font-semibold">Total por Tipo</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={dadosAgrupados.barras}>
                <XAxis dataKey="tipo" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip
                  formatter={(value: number) =>
                    value.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })
                  }
                />
                <Bar dataKey="valor">
                  {dadosAgrupados.barras.map((entry, index) => (
                    <Cell
                      key={`bar-${index}`}
                      fill={entry.tipo === "Depósito" ? COLORS.Depósito : COLORS.Transferência}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de Pizza */}
          <div className="w-full min-h-[260px]">
            <h3 className="text-white text-center mb-2 text-sm font-semibold">Distribuição por Tipo</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={dadosAgrupados.pizza}
                  dataKey="valor"
                  nameKey="nome"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  label={({ nome, percentual }) => `${nome[0]}: ${percentual.toFixed(1)}%`}
                >
                  {dadosAgrupados.pizza.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.nome === "Depósito" ? COLORS.Depósito : COLORS.Transferência}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>


          {/* Gráfico de Linha */}
          {dadosLinha.length > 0 && (
            <div className="w-full h-[280px] sm:h-[300px] lg:h-[320px] relative z-10">
              <h3 className="text-white text-center mb-2 text-sm font-semibold">
                Saldo Acumulado
              </h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dadosLinha}
                  margin={{ top: 10, right: 20, left: 10, bottom: 20 }}
                >
                  <XAxis dataKey="data" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <Tooltip
                    formatter={(value: number) =>
                      value.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })
                    }
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="saldo"
                    stroke={COLORS.Depósito}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <DrawerFooter className="mt-6">
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">Fechar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
