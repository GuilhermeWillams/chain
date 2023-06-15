import { prisma } from "../../server";

export default async function UserReplys(userId: string, page: string) {
  const pageNumber = (parseInt(page) - 1) * 10;
  const amountUserReplys = await prisma.reply.findMany({
    where: {
      userId,
    },
  });

  const userReplys = await prisma.reply.findMany({
    where: {
      userId,
    },
    orderBy: {
      replyDate: "desc",
    },
    take: 10,
    skip: pageNumber,
  });

  return { replys: userReplys, amountUserReplys: amountUserReplys.length };
}
