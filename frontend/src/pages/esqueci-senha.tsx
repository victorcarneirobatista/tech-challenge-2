"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);

  const handleEnviar = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você pode simular envio de e-mail ou logar no console
    console.log(`Simulando envio de recuperação para: ${email}`);
    setEnviado(true);
  };

  return (
    <div className="min-h-screen bg-byteBackground flex items-center justify-center text-white font-inter">
      <form
        onSubmit={handleEnviar}
        className="bg-[#1a1b1f] p-8 rounded-xl shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-bold">Recuperar senha</h2>
        <p className="text-sm text-gray-400">Informe seu e-mail para recuperar o acesso.</p>

        <input
          type="email"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 rounded bg-[#2a2b2f] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-byteGreen"
        />

        {enviado && (
          <p className="text-green-400 text-sm">
            Instruções de recuperação foram enviadas para o seu e-mail.
          </p>
        )}

        <button
          type="submit"
          className="w-full bg-byteGreen text-black font-bold py-2 rounded hover:bg-green-500 transition"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
