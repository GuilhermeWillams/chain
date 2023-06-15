import { prisma } from "../../server";

export default async function GetTopics(page: string) {
  const pageNumber = (parseInt(page) - 1) * 10;
  const amountTopics = await prisma.topic.findMany({});
  const topics = await prisma.topic.findMany({
    select: {
      id: true,
      topic: true,
      user: {
        select: {
          id: true,
          nickname: true,
          profilePhoto: true,
        },
      },
    },
    orderBy: {
      topic: "asc",
    },
    take: 10,
    skip: pageNumber,
  });
  return {
    topics: topics,
    amountTopics: amountTopics.length,
  };
}
