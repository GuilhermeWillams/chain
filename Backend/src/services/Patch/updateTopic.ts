import { prisma } from "../../server";

export default async function UpdateTopic(id: string, topic: string) {
  const updateTopic = await prisma.topic.update({
    where: {
      id,
    },
    data: {
      topic,
    },
  });
  return updateTopic;
}
