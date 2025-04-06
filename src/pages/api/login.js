import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  const { email, password, name } = req.body;
  console.log("email in login", email);
  console.log("password in login", password);

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    console.log("existingUser!!", existingUser);
    if (!existingUser)
      return res.status(409).json({ message: "User does not exists" });

    return res.status(201).json({
      message: "User Logged In",
      userId: existingUser.id,
      userName: existingUser.name,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}
