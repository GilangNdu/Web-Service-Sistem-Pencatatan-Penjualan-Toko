import Joi from "joi";

/*
title       String     @db.VarChar(255)
  slug        String     @unique(map: "news_slug_unique") @db.VarChar(255)
  content     String     @db.Text
  image       String     @db.VarChar(255)
  user_id     BigInt     @db.UnsignedBigInt
  category_id BigInt     @db.UnsignedBigInt
*/
const newsValidationSchema = Joi.object({
  title: Joi.string().required().min(25).max(255).messages({
    "string.base": "Judul berita harus string",
    "string.empty": "Judul berita tidak boleh kosong",
    "string.min": "Isi konten berita minimal 25 karakter atau lebih",
    "string.max": "Judul berita maksimal 255 karakter atau kurang",
    "any.required": "Judul berita tidak boleh kosong",
  }),
  content: Joi.string().required().min(50).messages({
    "string.base": "Isi konten berita harus string",
    "string.empty": "Isi konten berita tidak boleh kosong",
    "string.min": "Isi konten berita minimal 50 karakter atau lebih",
    "any.required": "Isi konten berita tidak boleh kosong",
  }),
  image: Joi.string().allow("", null).max(255).messages({
    "string.base": "Nama file gambar berita harus string",
    "string.max": "Nama file gambar berita maksimal 255 karakter atau kurang",
  }),
  category_id: Joi.number().integer().positive().required().messages({
    "number.base": "Kategori ID harus angka",
    "number.integer": "Kategori ID harus angka bulat",
    "number.positive": "Kategori ID harus berupa angka positif",
    "any.required": "Kategori ID wajib diisi",
  }),
});

export { newsValidationSchema };
