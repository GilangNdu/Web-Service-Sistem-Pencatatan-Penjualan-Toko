import newsModel from "../models/newsModel.js";
import validator from "../validators/validator.js";
import { newsValidationSchema } from "../validators/newsValidator.js";
import slugify from "slugify";

const getAll = async (req, res, next) => {
  try {
    const user = req.user;
    console.log("user", user);
    // ambil semua kategori
    const news = await newsModel.getAll();
    // jika data kosong response 404
    if (!news) return res.status(404).json({ error: "Data tidak ditemukan" });
    const convertedNews = news.map((item) => ({
      ...item,
      id: Number(item.id),
      // konversi jika object categories ada
      categories: item.categories
        ? {
            ...item.categories,
            id: Number(item.categories.id),
          }
        : null,

      // Konversi jika objek users ada
      users: item.users
        ? {
            ...item.users,
            id: Number(item.users.id),
          }
        : null,
    }));
    return res.status(200).json({
      status: true,
      message: "berhasil",
      data: convertedNews,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: error.message || "Terjadi kesalahan pada server",
    });
  }
};
const getById = async (req, res, next) => {
  try {
    // ambil parameter id
    const { id } = req.params;
    // jika id ada dan bukan number maka response error
    if (id && isNaN(id))
      return res.status(400).json({ error: "ID Berita dibutuhkan" });
    // ambil detail berita
    const news = await newsModel.getById(id);
    // jika tidak ditemukan response 404
    if (!news) return res.status(404).json({ error: "Data tidak ditemukan" });
    return res.status(200).json({
      status: true,
      message: "berhasil",
      data: {
        ...news,
        id: Number(news.id),
        // konversi jika object categories ada
        categories: news.categories
          ? {
              ...news.categories,
              id: Number(news.categories.id),
            }
          : null,

        // Konversi jika objek users ada
        users: news.users
          ? {
              ...news.users,
              id: Number(news.users.id),
            }
          : null,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
const create = async (req, res, next) => {
  try {
    // ambil data dari body request
    const { body } = req;
    // jika data undefined maka response error
    if (!body) return res.status(400).json({ error: "Data tidak lengkap" });
    // validasi data
    const { error, value } = validator(newsValidationSchema, body);
    // jika validasi salah tampilkan error

    // simpan berita baru
    const data = {
      title: value.title,
      slug: `${slugify(value.title)}-${Date.now()}`,
      content: value.content,
      image: value.image || "",
      user_id: req.user?.id,
      category_id: value.category_id,
      created_at: new Date(),
    };
    const newContent = await newsModel.create(data);
    return res.status(201).json({
      status: true,
      message: "berhasil",
      data: {
        ...newContent,
        id: Number(newContent.id),
        category_id: Number(newContent.category_id),
        user_id: Number(newContent.user_id),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
const update = async (req, res, next) => {
  try {
    // ambil parameter id
    const { id } = req.params;
    // jika id ada dan bukan number maka response error
    if (id && isNaN(id))
      return res.status(400).json({ error: "ID Berita dibutuhkan" });
    // ambil data dari body request
    const { body } = req;
    // jika data undefined maka response error
    if (!body) return res.status(400).json({ error: "Data tidak lengkap" });
    // ambil berita yang mau diupdate
    const news = await newsModel.getById(id);
    // jika tidak ditemukan response 404
    if (!news) return res.status(404).json({ error: "Data tidak ditemukan" });

    // validasi data
    const { error, value } = validator(newsValidationSchema, body);
    // jika validasi salah tampilkan error
    if (error) return res.status(400).json({ error: error });

    const data = {
      title: value.title,
      slug: `${slugify(value.title)}-${Date.now()}`,
      content: value.content,
      image: value.image || "",
      // user_id: 1,
      category_id: value.category_id,
      updated_at: new Date(),
    };
    // update berita
    const updatedNews = await newsModel.update(data, id);
    return res.status(201).json({
      status: true,
      message: "berhasil",
      data: {
        ...updatedNews,
        id: Number(updatedNews.id),
        category_id: Number(updatedNews.category_id),
        user_id: Number(updatedNews.user_id),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
const destroy = async (req, res, next) => {
  try {
    // ambil parameter id
    const { id } = req.params;
    // jika id ada dan bukan number maka response error
    if (id && isNaN(id))
      return res.status(400).json({ error: "ID Berita dibutuhkan" });
    // ambil info berita
    const news = await newsModel.getById(id);
    // jika tidak ditemukan response 404
    if (!news) return res.status(404).json({ error: "Data tidak ditemukan" });
    // hapus berita berdasarkan id
    await newsModel.delete(id);
    return res.status(200).json({
      status: true,
      message: "berhasil dihapus",
      data: {
        id: Number(news.id),
        title: news.title,
        category_id: Number(news.categories?.id),
        user_id: Number(news.users?.id),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export default { getAll, getById, create, update, destroy };
