import { prismaClient } from "../database/dbConfig.js";

// POST /api/sales
const create = async (req, res) => {
  try {
    const {
      invoiceNo,
      productName,
      buyerName,
      quantity,
      unitPrice,
      paymentMethod,
      notes,
    } = req.body;

    if (!productName || !quantity || !unitPrice || !paymentMethod) {
      return res.status(400).json({
        status: false,
        message:
          "productName, quantity, unitPrice, dan paymentMethod wajib diisi",
      });
    }

    const finalQuantity = Number(quantity);
    const finalUnitPrice = Number(unitPrice);

    if (
      !Number.isInteger(finalQuantity) ||
      finalQuantity <= 0 ||
      finalUnitPrice <= 0
    ) {
      return res.status(400).json({
        status: false,
        message: "Quantity dan unitPrice harus lebih dari 0",
      });
    }

    const totalPrice = finalQuantity * finalUnitPrice;

    const sale = await prismaClient.sale.create({
      data: {
        invoiceNo: invoiceNo || `INV-${Date.now()}`,
        productName,
        buyerName: buyerName || null,
        quantity: finalQuantity,
        unitPrice: finalUnitPrice,
        totalPrice,
        paymentMethod,
        notes: notes || null,
      },
    });

    return res.status(201).json({
      status: true,
      message: "Data penjualan berhasil ditambahkan",
      data: sale,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        status: false,
        message: "Nomor invoice sudah digunakan",
      });
    }

    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan saat menambahkan penjualan",
      error: error.message,
    });
  }
};

// GET /api/sales
const getAll = async (req, res) => {
  try {
    const sales = await prismaClient.sale.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      status: true,
      message: "Data penjualan berhasil ditampilkan",
      totalData: sales.length,
      data: sales,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan saat mengambil data penjualan",
      error: error.message,
    });
  }
};

// GET /api/sales/:id
const getById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        status: false,
        message: "ID penjualan tidak valid",
      });
    }

    const sale = await prismaClient.sale.findUnique({
      where: { id },
    });

    if (!sale) {
      return res.status(404).json({
        status: false,
        message: "Data penjualan tidak ditemukan",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Detail penjualan berhasil ditampilkan",
      data: sale,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan saat mengambil detail penjualan",
      error: error.message,
    });
  }
};

// PUT /api/sales/:id
const update = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        status: false,
        message: "ID penjualan tidak valid",
      });
    }

    const existingSale = await prismaClient.sale.findUnique({
      where: { id },
    });

    if (!existingSale) {
      return res.status(404).json({
        status: false,
        message: "Data penjualan tidak ditemukan",
      });
    }

    const {
      invoiceNo,
      productName,
      buyerName,
      quantity,
      unitPrice,
      paymentMethod,
      notes,
    } = req.body;

    const finalQuantity =
      quantity !== undefined ? Number(quantity) : existingSale.quantity;

    const finalUnitPrice =
      unitPrice !== undefined
        ? Number(unitPrice)
        : Number(existingSale.unitPrice);

    if (
      !Number.isInteger(finalQuantity) ||
      finalQuantity <= 0 ||
      finalUnitPrice <= 0
    ) {
      return res.status(400).json({
        status: false,
        message: "Quantity dan unitPrice harus lebih dari 0",
      });
    }

    const totalPrice = finalQuantity * finalUnitPrice;

    const updatedSale = await prismaClient.sale.update({
      where: { id },
      data: {
        invoiceNo: invoiceNo ?? existingSale.invoiceNo,
        productName: productName ?? existingSale.productName,
        buyerName: buyerName ?? existingSale.buyerName,
        quantity: finalQuantity,
        unitPrice: finalUnitPrice,
        totalPrice,
        paymentMethod: paymentMethod ?? existingSale.paymentMethod,
        notes: notes ?? existingSale.notes,
      },
    });

    return res.status(200).json({
      status: true,
      message: "Data penjualan berhasil diperbarui",
      data: updatedSale,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        status: false,
        message: "Nomor invoice sudah digunakan",
      });
    }

    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan saat memperbarui penjualan",
      error: error.message,
    });
  }
};

// DELETE /api/sales/:id
const remove = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        status: false,
        message: "ID penjualan tidak valid",
      });
    }

    const existingSale = await prismaClient.sale.findUnique({
      where: { id },
    });

    if (!existingSale) {
      return res.status(404).json({
        status: false,
        message: "Data penjualan tidak ditemukan",
      });
    }

    await prismaClient.sale.delete({
      where: { id },
    });

    return res.status(200).json({
      status: true,
      message: "Data penjualan berhasil dihapus",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan saat menghapus penjualan",
      error: error.message,
    });
  }
};

const saleController = {
  create,
  getAll,
  getById,
  update,
  remove,
};

export default saleController;