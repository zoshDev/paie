import { createContext, useContext, useState,  } from "react";
import type { ReactNode } from "react";

interface AuthContextType{
    user: any;

    login: (userData:any) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider( {children} : {children: ReactNode} ){
    const [user, setUser] = useState<any>(null);

    const login = (userData : any ) => setUser(userData);

    const logout = () => setUser(null);

    return(
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(){
    const context = useContext(AuthContext);
    if(!context) throw new Error("useAuth doit imperativement etre utilise a l'interieur de AuthProvider")
    return context;
}