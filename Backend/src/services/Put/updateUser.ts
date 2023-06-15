import userObject from "../../models/userObject";
import { prisma } from "../../server";
import formatName from "../../utils/formatName";
import validateToken from "../../utils/validadeToken";
interface UpdateUserBody {
  token: string;
  phone: string;
  id: string;
  name: string;
  lastName: string;
  roleLevel: string;
}
export default async function UpdateUser(body: UpdateUserBody) {
  const token = await validateToken(body.token);
  const phone = body.phone;
  const id = body.id;
  if (token) {
    const verifyPhone = await prisma.user.findFirst({
      where: {
        phone,
      },
      select: {
        id: true,
        phone: true,
      },
    });
    const validatePhone = () => {
      const valid = verifyPhone?.id === id || verifyPhone?.phone !== phone;
      return valid;
    };

    if (validatePhone()) {
      const { name, lastName } = formatName(body.name, body.lastName);

      try {
        const user = await prisma.user.update({
          where: {
            id: body.id,
          },
          data: {
            name,
            lastName,
            phone: body.phone,
            roleLevel: body.roleLevel,
          },
        });
        const userData = userObject(user, body.token);
        return userData;
      } catch (e) {
        console.log(e);
      }
    } else {
      return { phone: true };
    }
  } else {
    return { token: false };
  }
}
