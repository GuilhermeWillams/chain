import userObject from "../../models/userObject";
import { prisma } from "../../server";

export default async function UpdateProfilePhoto(
  token: string,
  id: string,
  file: Express.Multer.File | undefined
) {
  const profilePhoto = file?.buffer.toString("base64");
  const user = await prisma.user.update({
    where: {
      id,
    },
    data: {
      profilePhoto,
    },
  });
  const userData = userObject(user, token);

  return userData;
}
