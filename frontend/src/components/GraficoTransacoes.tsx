"use client";

import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

type Transacao = {
  id: string;
  tipo: "Depósito" | "Transferência";
  valor: number;
  data: string;
};

interface Props {
  transacoes: Transacao[];
}

export default function GraficoTransacoes({ transacoes }: Props) {
  const dados = [
    {
      tipo: "Depósito",
      valor: transacoes
        .filter((t) => t.tipo === "Depósito")
        .reduce((acc, curr) => acc + curr.valor, 0),
    },
    {
      tipo: "Transferência",
      valor: transacoes
        .filter((t) => t.tipo === "Transferência")
        .reduce((acc, curr) => acc + curr.valor, 0),
    },
  ];

  return (
    <div className="bg-[#1a1b1f] rounded-2xl p-6 shadow-md border border-byteBorder mt-6 w-full">
      <h2 className="text-white text-lg font-semibold mb-4">Resumo de Transações</h2>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dados}>
            <XAxis dataKey="tipo" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip
              contentStyle={{ backgroundColor: "#2a2b2f", border: "none" }}
              formatter={(value: number) =>
                value.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })
              }
            />
            <Bar
              dataKey="valor"
              radius={[6, 6, 0, 0]}
              style={{
                fill: "hsl(var(--foreground))",
                opacity: 0.9,
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
