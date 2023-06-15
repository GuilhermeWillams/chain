import { prisma } from "../../server";
export default async function GetProfile(nickname: string) {
  const users = await prisma.user.findUnique({
    where: {
      nickname,
    },
    select: {
      id: true,
      admin: true,
      name: true,
      lastName: true,
      nickname: true,
      profilePhoto: true,
      email: true,
      roleLevel: true,
      phone: true,
      createdDate: true,
    },
  });
  if (users) {
    return users;
  } else {
    return { code: 404 };
  }
}
