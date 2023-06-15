import { prisma } from "../../server";

interface PostBody {
  title: string;
  desc: string;
  topicId: string;
}
export default async function EditPost(body: PostBody, id: string) {
  const timestamp = Date.now();
  const date = new Date(timestamp);
  const lastEdit = date.toISOString();
  const editPost = await prisma.post.update({
    where: {
      id,
    },
    data: {
      title: body.title,
      desc: body.desc,
      topicId: body.topicId,
      lastEdit,
    },
  });
  return editPost.id;
}
