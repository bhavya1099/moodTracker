import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function addMood(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only PATCH requests allowed" });
  }
  console.log("value in add mood", req.body);
  const { email, moodEntry, user } = await req.body;
  console.log("email value", email);
  console.log("user", user);
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (!existingUser) {
    return res.status(404).json({ message: "User does not exist" });
  }

  const newMood = await prisma.moodEntry.create({
    data: {
      moodType: moodEntry,
      userId: user.userId,
    },
  });
  return res
    .status(201)
    .json({ message: "Mood recorded successfully!", mood: newMood });
}
