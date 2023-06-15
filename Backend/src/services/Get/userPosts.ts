import { prisma } from "../../server";

export default async function UserPosts(userId: string, page: string) {
  const pageNumber = (parseInt(page) - 1) * 10;
  const amountUserPosts = await prisma.post.findMany({
    where: {
      userId,
    },
  });
  const userPosts = await prisma.post.findMany({
    where: {
      userId,
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

  return { posts: userPosts, amountUserPosts: amountUserPosts.length };
}
