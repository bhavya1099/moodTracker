import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function getJournal(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }
  const { email, user } = await req.body;
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (!existingUser) {
    return res.status(404).json({ message: "User does not exist" });
  }

  const journals = await prisma.journalEntry.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
  return res
    .status(201)
    .json({ message: "Got Journal successfully!", content: journals });
}
