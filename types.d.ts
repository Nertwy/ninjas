import { type Image, type Superhero, type Superpower } from "@prisma/client";
// images: {
//     id: number;
//     url: string;
//     superheroId: number;
// }[];
// superpowers: {
//     id: number;
//     description: string;
//     superheroId: number;
// }[];
// } & {
// id: number;
// nickname: string;
// real_name: string;
// origin_description: string;
// catch_phrase: string;
// })[] | undefined
type FullHero = Superhero & {images:Image[]} & {superpowers:Superpower[]};
type HeroesArr = { heroes: FullHero[] };
