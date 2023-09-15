import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const superpowerSchema = z.object({
  id: z.number(),
  description: z.string(),
  superheroId: z.number(),
});

// Define a Zod schema for Image
const imageSchema = z.object({
  id: z.number(),
  url: z.string(),
  superheroId: z.number(),
});

// Define a Zod schema for Superhero
const superheroSchema = z.object({
  id: z.number(),
  nickname: z.string(),
  real_name: z.string(),
  origin_description: z.string(),
  catch_phrase: z.string(),
  superpowers: z.array(superpowerSchema), // Use the Superpower schema for the array
  images: z.array(imageSchema), // Use the Image schema for the array
});

export const mainRouter = createTRPCRouter({
  updateHero: publicProcedure
    .input(superheroSchema)
    .mutation(async ({ ctx, input }) => {
      const { images, superpowers } = input;
      try {
        const result = await ctx.db.superhero.update({
          where: {
            id: input.id,
          },
          include: {
            images: true,
            superpowers: true,
          },
          data: {
            nickname: input.nickname,
            origin_description: input.origin_description,
            catch_phrase: input.catch_phrase,
            real_name: input.real_name,
          },
        });

        const imagesOfHero = await ctx.db.image.findMany({
          where: {
            superheroId: input.id,
          },
        });
        const imagesToDelete = imagesOfHero.filter((image) =>
          images.every((item) => image.url !== item.url),
        );

        const imagesToInsert = images.filter((image) =>
          imagesOfHero.every((item) => image.url !== item.url),
        );

        for (const imageToDelete of imagesToDelete) {
          await ctx.db.image.delete({
            where: { id: imageToDelete.id },
          });
        }

        // Insert new images from the updated array that are not in the database
        for (const urlToInsert of imagesToInsert) {
          await ctx.db.image.create({
            data: {
              superheroId: urlToInsert.superheroId,
              url: urlToInsert.url,
            },
          });
        }

        const superPowersOfHero = await ctx.db.superpower.findMany({
          where: {
            superheroId: input.id,
          },
        });

        const powerToDelete = superPowersOfHero.filter((power) =>
          superpowers.every((otherPower) => power.description !== otherPower.description),
        );

        const powerToInsert = superpowers.filter((image) =>
          superPowersOfHero.every(
            (item) => image.description !== item.description,
          ),
        );

        console.log(superPowersOfHero.length);
        console.log(powerToDelete.length);
        console.log(superpowers.length);

        for (const power of powerToDelete) {
          await ctx.db.superpower.delete({
            where: { id: power.id },
          });
        }

        // Insert new images from the updated array that are not in the database
        for (const power of powerToInsert) {
          await ctx.db.superpower.create({
            data: {
              superheroId: power.superheroId,
              description: power.description,
            },
          });
        }
        return result;
      } catch (error) {
        console.error(error);
        console.error("Something wrong with Update");
      }
    }),
  createSuperhero: publicProcedure
    .input(superheroSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.superhero.create({
        data: {
          nickname: input.nickname,
          real_name: input.real_name,
          catch_phrase: input.catch_phrase,
          origin_description: input.origin_description,
          superpowers: {
            createMany: {
              data: input.superpowers,
            },
          },
          images: {
            createMany: {
              data: input.images,
            },
          },
        },
      });
    }),
  deleteSuperhero: publicProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.superhero.delete({
        where: {
          id: input,
        },
      });
    }),
  seed: publicProcedure.mutation(async ({ ctx }) => {
    const superman = await ctx.db.superhero.create({
      data: {
        nickname: "Superman",
        real_name: "Clark Kent",
        origin_description: "Krypton",
        catch_phrase: "Truth, justice, and the American way",
      },
    });

    const batman = await ctx.db.superhero.create({
      data: {
        nickname: "Batman",
        real_name: "Bruce Wayne",
        origin_description: "Gotham City",
        catch_phrase: "I am vengeance, I am the night",
      },
    });

    // Create superpowers
    await ctx.db.superpower.createMany({
      data: [
        {
          description: "Super strength",
          superheroId: superman.id,
        },
        {
          description: "Flight",
          superheroId: superman.id,
        },
        {
          description: "Rich and intelligent",
          superheroId: batman.id,
        },
      ],
    });

    // Create images
    await ctx.db.image.createMany({
      data: [
        {
          url: "https://example.com/superman.jpg",
          superheroId: superman.id,
        },
        {
          url: "https://example.com/batman.jpg",
          superheroId: batman.id,
        },
      ],
    });
  }),
  getSuperhero: publicProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.superhero.findMany({
      include: { images: true, superpowers: true },
      orderBy: {
        id: "asc",
      },
    });
    return result;
  }),
  getHeroById: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return await ctx.db.superhero.findFirst({
        where: {
          id: input,
        },
        include: {
          images: true,
          superpowers: true,
        },
      });
    }),
});
