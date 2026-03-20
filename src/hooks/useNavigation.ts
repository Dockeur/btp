import { create } from "zustand";

export const useNavigationStore = create((set, get: any) => ({
    openDrawer: false,
    contract: false,
    hoverContract: false,
    setHoverContract: (hoverContract: boolean) => set({ hoverContract }),
    getHoverContract: () => get().hoverContract,
    setContract: (contract: boolean) => set({ contract }),
    getContract: () => get().contract,
    setOpenDrawer: (openDrawer: boolean) => set({ openDrawer }),
    getOpenDrawer: () => get().openDrawer,
}))

export const useNavigation = () => useNavigationStore((state) => state)