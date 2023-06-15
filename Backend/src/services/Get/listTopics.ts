import { prisma } from "../../server";

export default async function ListTopics() {
  const topics = await prisma.topic.findMany({
    select: {
      id: true,
      topic: true,
    },
  });
  return topics;
}
