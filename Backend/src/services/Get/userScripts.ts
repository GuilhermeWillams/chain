import { prisma } from "../../server";

export default async function UserScripts(userId: string, page: string) {
  const pageNumber = (parseInt(page) - 1) * 10;
  const amountScripts = await prisma.script.findMany({
    where: {
      userId,
    },
  });
  const userScripts = await prisma.script.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdDate: "desc",
    },
    take: 10,
    skip: pageNumber,
  });

  return { scripts: userScripts, amountScripts: amountScripts.length };
}
