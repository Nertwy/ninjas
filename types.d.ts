import { type Image, type Superhero, type Superpower } from "@prisma/client";
type FullHero = Superhero & { images: Image[] } & { superpowers: Superpower[] };
type HeroesArr = { heroes: FullHero[] };
type SuperPowerActions = "Add" | "Delete" | "Change";
type ClientFullHero = Omit<Superhero, "id"> & {
  images: Omit<Image, "id" | "superheroId">[];
  superpowers: Omit<Superpower, "id" | "superheroId">[];
};

type UrlPattern = {
  protocol: string;
  pathname: string;
  hostname: string;
  port: string;
};

type UrlInputProps = {
  allowedPatterns: UrlPattern[];
  onChange: (newUrl: string) => void;
};

//? Functions

type ChangeHandler<T> = (
  e: React.ChangeEvent<HTMLInputElement>,
  obj: T,
  key: keyof T,
  setter: React.Dispatch<React.SetStateAction<T>>,
) => void;
