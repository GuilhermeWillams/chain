import { prisma } from "../../server";

export default async function DeleteTopic(id: string) {
  const deleteTopic = await prisma.topic.delete({
    where: {
      id,
    },
  });
  return deleteTopic.id;
}
