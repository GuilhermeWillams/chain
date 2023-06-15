import { prisma } from "../../server";

export default async function RemoveReportReply(id: string) {
  const removedReport = await prisma.reply.update({
    where: {
      id,
    },
    data: {
      report: false,
    },
  });
  return removedReport.id;
}
