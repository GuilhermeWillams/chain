import { prisma } from "../../server";

export default async function ReportReply(id: string) {
  const reportReply = await prisma.reply.update({
    where: {
      id,
    },
    data: {
      report: true,
    },
  });
  return { code: 200 };
}
