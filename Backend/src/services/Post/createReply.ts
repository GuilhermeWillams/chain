import { prisma } from "../../server";

interface ReplyBody {
  userId: string;
  postId: string;
  reply: string;
}

export default async function CreateReply(body: ReplyBody) {
  try {
    const reply = await prisma.reply.create({
      data: {
        userId: body.userId,
        postId: body.postId,
        reply: body.reply,
      },
    });
    return reply.id;
  } catch (e) {
    console.log(e);
  }
}
