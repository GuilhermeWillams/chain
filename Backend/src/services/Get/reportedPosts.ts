import { prisma } from "../../server";

export default async function ReportedPosts(page: string) {
  const pageNumber = (parseInt(page) - 1) * 10;
  const amountReportedPosts = await prisma.post.findMany({
    where: {
      report: true,
    },
  });
  const reportedPosts = await prisma.post.findMany({
    where: {
      report: true,
    },
    select: {
      id: true,
      title: true,
      desc: true,
      postDate: true,
      lastEdit: true,
      topic: {
        select: {
          topic: true,
        },
      },
      Reply: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      postDate: "desc",
    },
    take: 10,
    skip: pageNumber,
  });
  return {
    posts: reportedPosts,
    amountReportedPosts: amountReportedPosts.length,
  };
}
