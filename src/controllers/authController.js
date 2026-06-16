import { prismaClient } from "../database/dbConfig.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const authController = {
  async login(req, res) {
    const { email, password } = req.body;
    const user = await prismaClient.users.findUnique({
      where: { email: email },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ error: "Invalid Password" });
    const token = jwt.sign(
      { id: Number(user.id), email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.json({
      status: true,
      message: "Login Success",
      data: {
        id: Number(user.id),
        name: user.name,
        email: user.email,
        access_token: token,
      },
    });
  },
};
export default authController;
