import { prisma } from "../../server";

export default async function GetPost(id: string) {
  const post = await prisma.post.findUnique({
    where: {
      id,
    },
    select: {
      user: {
        select: {
          createdDate: true,
          profilePhoto: true,
          nickname: true,
        },
      },
      id: true,
      title: true,
      desc: true,
      postDate: true,
      lastEdit: true,
      topic: {
        select: {
          id: true,
          topic: true,
        },
      },
      Reply: {
        select: {
          id: true,
          reply: true,
          replyDate: true,
          user: {
            select: {
              createdDate: true,
              nickname: true,
              profilePhoto: true,
            },
          },
        },
        orderBy: {
          replyDate: "asc",
        },
      },
    },
  });
  if (post) {
    return post;
  } else {
    return { code: 404 };
  }
}
