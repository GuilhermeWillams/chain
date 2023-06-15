import { prisma } from "../../server";

export default async function DeletePost(id: string) {
  const deleteReply = await prisma.reply.deleteMany({
    where: {
      postId: id,
    },
  });
  const deletePost = await prisma.post.delete({
    where: {
      id,
    },
  });
  return deletePost.id;
}
