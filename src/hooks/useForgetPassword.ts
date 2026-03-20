import { getResetCode, resetPassword, verifyResetCode } from "src/services/AuthService";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useForgetPasswordStore: any = create(persist((set, get: any) => ({
    error: null,
    code: null,
    email: null,
    success: null,
    step: 0,
    getError: () => get().error,
    getSuccess: () => get().success,
    getEmail: () => get().email,
    resetAll: () => set({ error: null, code: null, email: null, success: null, step: 0 }),
    resetMessage: () => set({ error: null, success: null }),
    getCode: async (data: any) => {
        try {
            const res = await getResetCode(data);
            if (res.success) {
                set({ email: data.email, success: res.message, step: 1 });
            } else {
                set({ error: res.message });
            }
        } catch (error: any) {
            set({ error: error.response.data.data.errors.email[0] });
        }
    },
    confirmCode: async (data: any) => {
        try {
            const res = await verifyResetCode({ ...data, email: get().email });
            if (res.success) {
                set({ code: data.code, success: res.message, step: 2 });
            } else {
                set({ error: res.data.errors.code[0] });
            }
        } catch (error: any) {
            console.log(error);

            set({ error: error.response.data.data.errors.code[0] });
        }
    },
    resetPassword: async (data: any) => {
        try {
            const res = await resetPassword({ ...data, email: get().email, code: get().code });
            if (res.success) {
                set({ success: res.message });
            } else {
                set({ error: res.message });
            }
        } catch (error: any) {
            set({ error: error.message });
        }
    }
}), { name: "forget-password" }))

export const useForgetPassword: any = () => useForgetPasswordStore((state: any) => state)