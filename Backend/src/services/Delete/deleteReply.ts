import { prisma } from "../../server";

export default async function DeleteReply(id: string) {
  const deleteReply = await prisma.reply.delete({
    where: {
      id,
    },
  });
  return deleteReply.id;
}
