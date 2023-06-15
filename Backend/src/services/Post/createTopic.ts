import { prisma } from "../../server";

export default async function CreateTopic(userId: string, topic: string) {
  console.log(userId, topic);
  const exists = await prisma.topic.findFirst({
    where: {
      topic,
    },
  });

  if (exists === null) {
    const createTopic = await prisma.topic.create({
      data: {
        topic,
        userId,
      },
    });
    return { topic: false };
  } else {
    return { topic: true };
  }
}
