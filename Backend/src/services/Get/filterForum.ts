import { prisma } from "../../server";

export default async function FilterForum(
  topicId: string,
  page: string,
  searchTitle: string
) {
  const pageNumber = (parseInt(page) - 1) * 10;
  let where = {};

  if (topicId !== "all" && searchTitle === "") {
    where = {
      topicId,
    };
  } else if (topicId === "all" && searchTitle !== "") {
    where = {
      title: {
        contains: searchTitle,
      },
    };
  } else if (topicId !== "all" && searchTitle !== "") {
    where = {
      topicId,
      title: {
        contains: searchTitle,
      },
    };
  }
  const amountPosts = await prisma.post.findMany({ where });

  const posts = await prisma.post.findMany({
    where,
    select: {
      user: {
        select: {
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
    posts: posts,
    amountPosts: amountPosts.length,
  };
}
