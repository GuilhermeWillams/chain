import { prisma } from "../../server";

export default async function ReportPost(id: string) {
  const reportPost = await prisma.post.update({
    where: {
      id,
    },
    data: {
      report: true,
    },
  });
  return { code: 200 };
}
