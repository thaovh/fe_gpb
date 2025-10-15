import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
    id: string
    username: string
    email: string
    fullName: string
    role: string
    isActive: number
    lastLoginAt: string
}

interface AuthState {
    user: User | null
    token: string | null
    refreshToken: string | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (token: string, refreshToken: string, user: User) => void
    logout: () => void
    setLoading: (loading: boolean) => void
    updateTokens: (token: string, refreshToken: string) => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,

            login: (token: string, refreshToken: string, user: User) => {
                set({
                    token,
                    refreshToken,
                    user,
                    isAuthenticated: true,
                    isLoading: false,
                })
            },

            logout: () => {
                set({
                    user: null,
                    token: null,
                    refreshToken: null,
                    isAuthenticated: false,
                    isLoading: false,
                })
            },

            setLoading: (loading: boolean) => {
                set({ isLoading: loading })
            },

            updateTokens: (token: string, refreshToken: string) => {
                set({ token, refreshToken })
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
)
