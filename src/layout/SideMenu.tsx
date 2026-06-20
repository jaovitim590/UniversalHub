import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu, MoonIcon,SunIcon } from "lucide-react"
import { useEffect } from "react";
import { SheetButton } from './SheetButton';



export const SideMenu = () => {
    const isDark = document.documentElement.classList.contains("dark");
    useEffect(() => {
    const theme = localStorage.getItem("theme");

    if (theme === "dark") {
        document.documentElement.classList.add("dark");
    }
}, []);
    function toggleDarkMode() {
    const html = document.documentElement;

    html.classList.toggle("dark");

    const isDark = html.classList.contains("dark");

    localStorage.setItem("theme", isDark ? "dark" : "light");
}

    return (
        <Sheet>
                    <SheetTrigger asChild>
                        <button className="h-10 w-10 no-drag rounded p-2 transition-all duration-200 hover:bg-black/10 dark:hover:bg-white/10">
                            <Menu className="text-card-foreground" size={25} />
                        </button>
                    </SheetTrigger>

                    <SheetContent side="left" className="w-full shadow-2xl">
                        <SheetHeader className="shadow-xl bg-background">
                            <SheetTitle className="flex justify-center p-1 text-2xl">
                                <h1 className="font-bold" >Menu</h1>
                            </SheetTitle>
                        </SheetHeader>
                        <div className="flex flex-col gap-1 justify-evenly py-4 px-3">
                                <SheetButton label="Downloader" route="/downloader"></SheetButton>
                                <SheetButton label="Ramdomizer" route="/Ramdomizer"></SheetButton>
                            </div>
                        <SheetFooter className="fixed bottom-1">
                        <button onClick={toggleDarkMode} className="shadow-2xl bg-background h-10 w-10 no-drag rounded p-2 transition-all duration-200 hover:bg-black/10 dark:hover:bg-white/10">
                            {isDark ? <SunIcon /> : <MoonIcon />}
                        </button>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
    )
}
