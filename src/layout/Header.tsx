import { Minus, Square, X } from "lucide-react";
import { SideMenu } from "./SideMenu";

export function Header() {
    return (
        <header className="shadow-lg drag flex flex-row justify-between items-center px-4 py-2 bg-card ">
            
            <div className="pl-3"><SideMenu /></div>
            
             <div className="flex items-center gap-3">
               
                <span className="font-bold text-2xl text-card-foreground">
                    Universal Hub
                </span>
            </div>

            <div className="flex gap-1">
                <button
                    className="no-drag flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200 hover:bg-black/10 dark:hover:bg-white/10"
                    onClick={() => {
    console.log("clicou");
    window.electronAPI.minimize();
  }}
                >
                    <Minus size={18} className="text-card-foreground" />
                </button>

                <button
                    className="no-drag flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200 hover:bg-black/10 dark:hover:bg-white/10"
                    onClick={() => window.electronAPI.maximize()}
                >
                    <Square size={16} className="text-card-foreground" />
                </button>

                <button
                    className="no-drag flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200 hover:bg-red-500"
                    onClick={() => window.electronAPI.close()}
                >
                    <X size={18} className="text-card-foreground" />
                </button>
            </div>
        </header>
    );
}