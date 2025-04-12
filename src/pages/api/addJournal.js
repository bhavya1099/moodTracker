import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function addJournal(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }
  const { email, journal, user } = await req.body;
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (!existingUser) {
    return res.status(404).json({ message: "User does not exist" });
  }

  const newJournal = await prisma.journalEntry.create({
    data: {
      content: journal,
      userId: user.userId,
    },
  });
  return res
    .status(201)
    .json({ message: "Journal recorded successfully!", content: newJournal });
}
