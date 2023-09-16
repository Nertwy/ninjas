import { PrismaClient, type Superhero } from "@prisma/client";
type clientHero = Omit<Superhero, "id"> & {
  images: { id: undefined | number; url: string }[];
  superpowers: {
    id: number | undefined;
    description: string;
    superheroId: number | undefined;
  }[];
};

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});
const main = async () => {
  try {
    const data = await fetch(
      "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/all.json",
    );
    const result = await data.json();
    result.forEach(async (item:any) => {
      const superpower: string[] = [];
      const urls: string[] = Object.values(item.images);
      for (const [key, value] of Object.entries(item.powerstats)) {
        superpower.push(key + "-" + value);
      }

      const filteredData: clientHero = {
        nickname: item.name,
        real_name: item.biography.fullName,
        origin_description: item.work.occupation,
        catch_phrase: item.slug,
        images: urls.map((item) => ({ url: item, id: undefined })),
        superpowers: superpower.map((item) => ({
          description: item,
          id: undefined,
          superheroId: undefined,
        })),
      };
      await prisma.superhero.create({
        data: {
          ...filteredData,
          images: {
            createMany: {
              data: filteredData.images,
            },
          },
          superpowers: {
            createMany: {
              data: filteredData.superpowers,
            },
          },
        },
        include: {
          images: true,
          superpowers: true,
        },
      });
    });
  } catch (error) {
    console.error(error);
  }
};
main().catch((error) => console.error(error));
