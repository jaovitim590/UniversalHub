import { Card,
    CardTitle,
    CardContent,
    CardHeader,
    CardFooter
 } from "../ui/card";
import { Button } from "../ui/button";


export type CardProps = {
    title: string,
    img: string,
    route: string
}

export const CardFunction = (props: CardProps) => {

    return(
        <Card className="max-h-80 bg-background flex justify-center items-center">
            <CardHeader className="bg-secondary ">
                <CardTitle>
                    <h1>{props.title}</h1>
                </CardTitle>
            </CardHeader>
            <CardContent className="max-w-1/3">
                <img className="w-fit" src={props.img} alt="" />
            </CardContent>
            <CardFooter>
                <Button>Ir</Button>
            </CardFooter>
        </Card>
    )
}