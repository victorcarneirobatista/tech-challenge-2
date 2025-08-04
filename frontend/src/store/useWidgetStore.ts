import { create } from "zustand";

interface WidgetStore {
  metaEconomia: number;
  economizado: number;
  limiteGastos: number;
  setMetaEconomia: (valor: number) => void;
  setEconomizado: (valor: number) => void;
  setLimiteGastos: (valor: number) => void;
}

export const useWidgetStore = create<WidgetStore>((set) => ({
  metaEconomia: 0,            // valor inicial zerado
  economizado: 0,             // valor inicial zerado
  limiteGastos: 0,            // valor inicial zerado

  setMetaEconomia: (valor) => set({ metaEconomia: valor }),
  setEconomizado: (valor) => set({ economizado: valor }),
  setLimiteGastos: (valor) => set({ limiteGastos: valor }),
}));
