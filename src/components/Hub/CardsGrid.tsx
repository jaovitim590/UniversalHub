import { CardFunction, type CardProps } from './Card';

const mock: CardProps[] = [
    {
        title: "Downloader",
        img: "/public/downloadButton.png",
        route: "/downloader"
    }
]

export const CardGrid = () =>{
    return(
        <main>
        {mock.map((card, index)=>(
            <CardFunction key={index} {...card}/>
        ))}
        </main>
    )
}