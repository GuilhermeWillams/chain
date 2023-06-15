import { prisma } from "../../server";

export default async function ReportedReplys(page: string) {
  const pageNumber = (parseInt(page) - 1) * 10;
  const amountReportedReplys = await prisma.reply.findMany({
    where: {
      report: true,
    },
  });
  const reportedReplys = await prisma.reply.findMany({
    where: {
      report: true,
    },
    select: {
      id: true,
      postId: true,
      reply: true,
      replyDate: true,
    },
    orderBy: {
      replyDate: "desc",
    },
    take: 10,
    skip: pageNumber,
  });
  return {
    replys: reportedReplys,
    amountReportedReplys: amountReportedReplys.length,
  };
}
