import {
  HomeIcon,
  ArrowsRightLeftIcon,
  BanknotesIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/solid";
import useUserStore from "@/store/useUserStore";
import { useRouter } from "next/router";

type Props = {
  visivel?: boolean;
};

const menu = [
  { nome: "Início", icon: HomeIcon },
  { nome: "Transferências", icon: ArrowsRightLeftIcon },
  { nome: "Investimentos", icon: BanknotesIcon },
  { nome: "Outros serviços", icon: Cog6ToothIcon },
];

export default function Sidebar({ visivel = true }: Props) {
  const router = useRouter();
  const clearUser = useUserStore((state) => state.clearUser);

  const handleLogout = () => {
    localStorage.removeItem("token");
    clearUser();
    router.push("/login");
  };

  return (
    <aside
      className={`${
        visivel ? "block" : "hidden"
      } w-60 bg-zinc-900 text-white rounded-lg p-4 shadow-md border border-zinc-700 h-fit flex flex-col justify-between min-h-[500px]`}
    >
      {/* Logo Bytebank */}
      <div className="text-center mb-4">
        <h1 className="text-lg font-bold text-white">Bytebank</h1>
      </div>

      {/* Menu principal */}
      <div className="flex flex-col gap-2">
        {menu.map((item, i) => {
          const Icon = item.icon;
          const isActive = i === 0; // ❗️Você pode ajustar essa lógica para corresponder à rota

          return (
            <button
              key={item.nome}
              className={`flex items-center gap-3 py-2 px-4 rounded-md border-l-4 transition-all duration-200 text-left w-full
                ${
                  isActive
                    ? "border-green-500 font-semibold text-green-400 bg-zinc-800"
                    : "border-transparent text-zinc-400 hover:bg-zinc-800 hover:text-white hover:border-green-500"
                }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span>{item.nome}</span>
            </button>
          );
        })}
      </div>

      {/* Logout */}
      <div className="mt-6 text-center">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 text-sm text-zinc-400 hover:text-red-400 transition-colors"
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5" />
          Sair
        </button>
      </div>
    </aside>
  );
}
