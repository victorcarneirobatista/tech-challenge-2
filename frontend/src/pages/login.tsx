"use client";
import { useState } from "react";
import { useRouter } from "next/router";
import useUserStore from "@/store/useUserStore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const { setToken, setAccountId, setUser } = useUserStore();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: senha }),
      });

      if (!res.ok) {
        alert("Email ou senha inválidos.");
        return;
      }

      const data = await res.json();
      if (!data || !data.result) {
        alert("Formato de resposta inesperado.");
        return;
      }

      const token = data.result?.token;
      if (!token) {
        alert("Token não recebido.");
        return;
      }

      setToken(token);
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
      }

      const resAcc = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!resAcc.ok) {
        alert("Erro ao buscar conta.");
        return;
      }

      const accData = await resAcc.json();
      const conta = accData.result?.account?.[0];
      if (!conta) {
        alert("Conta não encontrada.");
        return;
      }

      const contaId = conta._id || conta.id;
      const username = data.result?.username || "Usuário"; // ← pega do login

      setAccountId(contaId);
      setUser(username);

      if (typeof window !== "undefined") {
        localStorage.setItem("accountId", contaId);
        localStorage.setItem("username", username);
      }

      await router.push("/");
    } catch (err) {
      console.error("Erro ao fazer login:", err);
      alert("Erro inesperado ao fazer login.");
    }
  };

  return (
    <div className="min-h-screen bg-byteBackground text-white flex flex-col items-center justify-center font-inter px-4 space-y-4">
      <h1 className="text-3xl font-bold text-white">ByteBank</h1>

      <div className="bg-byteCard p-8 rounded-2xl w-full max-w-sm border border-byteBorder shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Login</h2>

        <label className="text-sm text-byteTextMuted block mb-1">Email</label>
        <input
          className="w-full mb-4 p-2 rounded-md bg-byteDark text-white border border-byteBorder"
          type="email"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="text-sm text-byteTextMuted block mb-1">Senha</label>
        <input
          className="w-full mb-4 p-2 rounded-md bg-byteDark text-white border border-byteBorder"
          type="password"
          placeholder="Digite sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-byteCream text-zinc-900 font-medium py-2 rounded-lg hover:brightness-95 transition mb-4"
        >
          Entrar
        </button>

        <div className="text-sm text-zinc-400 text-center space-y-2">
          <p>
            Esqueceu a senha?{" "}
            <a href="/esqueci-senha" className="hover:underline hover:text-white">
              Recuperar
            </a>
          </p>
          <p>
            Ainda não tem conta?{" "}
            <a href="/cadastro" className="hover:underline hover:text-white">
              Criar conta
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
