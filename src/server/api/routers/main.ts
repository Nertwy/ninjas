import { z } from "zod";
import { checkImageAndAllowed } from "~/function";

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

const heroSchema = z.object({
  catch_phrase: z.string().default(""),
  nickname: z.string().default(""),
  real_name: z.string().default(""),
  images: z
    .array(
      z.object({
        url: z.string().default(""),
      }),
    )
    .default([{ url: "" }]),
  origin_description: z.string().default(""),
  superpowers: z
    .array(
      z.object({
        description: z.string().default(""),
      }),
    )
    .default([{ description: "-" }]),
});

export const mainRouter = createTRPCRouter({
  updateHero: publicProcedure
    .input(superheroSchema)
    .mutation(async ({ ctx, input }) => {
      const { images, superpowers } = input;
      try {
        if (!input.images.every((item) => checkImageAndAllowed(item.url)))
          throw new Error("Url Is not walid!");

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
          superpowers.every(
            (otherPower) => power.description !== otherPower.description,
          ),
        );

        const powerToInsert = superpowers.filter((image) =>
          superPowersOfHero.every(
            (item) => image.description !== item.description,
          ),
        );

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
  insertHero: publicProcedure
    .input(heroSchema)
    .mutation(async ({ ctx, input }) => {
      const createdHero = await ctx.db.superhero.create({
        data: {
          nickname: input.nickname,
          real_name: input.real_name,
          catch_phrase: input.catch_phrase,
          origin_description: input.origin_description,
        },
      });
      for (const image of input.images) {
        await ctx.db.image.create({
          data: {
            url: image.url,
            superheroId: createdHero.id,
          },
        });
      }
      for (const superpower of input.superpowers) {
        await ctx.db.superpower.create({
          data: {
            description: superpower.description,
            superheroId: createdHero.id,
          },
        });
      }
    }),
});
