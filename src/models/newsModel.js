import { prismaClient } from "../database/dbConfig.js";

const newsModel = {
  getAll: async () => {
    return await prismaClient.news.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        image: true,
        categories: { select: { id: true, name: true } },
        users: { select: { id: true, name: true } },
      },
    });
  },
  getById: async (id) => {
    return await prismaClient.news.findUnique({
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        image: true,
        categories: { select: { id: true, name: true } },
        users: { select: { id: true, name: true } },
      },
      where: {
        id: Number(id),
      },
    });
  },
  create: async (data) => {
    return prismaClient.news.create({ data: data });
  },
  update: async (data, id) => {
    return prismaClient.news.update({
      data: data,
      where: {
        id: Number(id),
      },
    });
  },
  delete: async (id) => {
    return prismaClient.news.delete({
      where: {
        id: Number(id),
      },
    });
  },
};

export default newsModel;
