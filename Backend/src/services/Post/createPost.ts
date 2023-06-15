import { prisma } from "../../server";

interface PostBody {
  userId: string;
  title: string;
  desc: string;
  topicId: string;
}
export default async function CreatePost(body: PostBody) {
  try {
    const post = await prisma.post.create({
      data: {
        userId: body.userId,
        title: body.title,
        desc: body.desc,
        topicId: body.topicId,
      },
    });
    return post.id;
  } catch (e) {
    console.log(e);
  }
}
