"use client";
import { useState } from "react";
import { useRouter } from "next/router";
import { useToast } from "@/hooks/use-toast";

export default function CadastroPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const handleCadastro = async () => {
    if (senha !== confirmarSenha) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    try {
      const resCriar = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: nome, email, password: senha }),
        }
      );

      if (!resCriar.ok) {
        const errorData = await resCriar.json();
        if (errorData.message?.includes("email already exists")) {
          toast({
            title: "Erro",
            description: "Este email já está cadastrado.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erro",
            description: "Erro ao criar usuário.",
            variant: "destructive",
          });
        }
        return;
      }

      toast({
        title: "Sucesso",
        description: "Cadastro realizado com sucesso! Redirecionando...",
      });

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      console.error("Erro ao cadastrar:", err);
      toast({
        title: "Erro inesperado",
        description: "Não foi possível completar o cadastro.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-byteBackground text-white flex flex-col items-center justify-center font-inter px-4 space-y-4">
      <h1 className="text-3xl font-bold text-white">ByteBank</h1>

      <div className="bg-byteCard p-8 rounded-2xl w-full max-w-sm border border-byteBorder shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Criar Conta</h2>

        <label className="text-sm text-byteTextMuted block mb-1">Nome</label>
        <input
          className="w-full mb-4 p-2 rounded-md bg-byteDark text-white border border-byteBorder"
          type="text"
          placeholder="Digite seu nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

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
          placeholder="Crie uma senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <label className="text-sm text-byteTextMuted block mb-1">Confirmar Senha</label>
        <input
          className="w-full mb-4 p-2 rounded-md bg-byteDark text-white border border-byteBorder"
          type="password"
          placeholder="Confirme a senha"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
        />

        <button
          onClick={handleCadastro}
          className="w-full bg-byteCream text-zinc-900 font-medium py-2 rounded-lg hover:brightness-95 transition mb-4"
        >
          Criar Conta
        </button>

        <div className="text-sm text-zinc-400 text-center">
          Já tem conta?{" "}
          <a href="/login" className="hover:underline hover:text-white">
            Fazer login
          </a>
        </div>
      </div>
    </div>
  );
}
