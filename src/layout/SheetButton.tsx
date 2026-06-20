import { Link } from "react-router-dom"

type buttonProps = {
    label: string,
    route: string
}

export const SheetButton = (props: buttonProps) => {
    return(
        <div className="shadow-lg no-drag p-1 transition-all duration-200 hover:bg-black/10 dark:hover:bg-white/10 bg-background rounded-r-xl rounded-l-xs text-card-foreground hover:font-bold hover:scale-105"> 
            <Link to={props.route}
            ><button className="pl-2">{props.label}</button>
            </Link>
            
        </div>
    )
}