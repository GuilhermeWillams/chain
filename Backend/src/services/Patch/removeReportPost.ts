import { prisma } from "../../server";

export default async function RemoveReportPost(id: string) {
  const removedReport = await prisma.post.update({
    where: {
      id,
    },
    data: {
      report: false,
    },
  });
  return removedReport.id;
}
