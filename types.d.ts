import { type Image, type Superhero, type Superpower } from "@prisma/client";
type FullHero = Superhero & { images: Image[] } & { superpowers: Superpower[] };
type HeroesArr = { heroes: FullHero[] };
type SuperPowerActions = "Add" | "Delete" | "Change";
