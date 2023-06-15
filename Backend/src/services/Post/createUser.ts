import { CRYPTO_KEY, prisma } from "../../server";
import { AES, enc } from "crypto-js";
import formatName from "../../utils/formatName";

interface CreateUser {
  nickname: string;
  name: string;
  lastName: string;
  email: string;
  roleLevel: string;
  phone: string;
  password: string;
}
export default async function CreateUser(body: CreateUser) {
  const existsValues = { email: false, nickname: false, phone: false };
  const email = body.email;
  const verifyEmail = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  const nickname = body.nickname;
  const verifyNickName = await prisma.user.findUnique({
    where: {
      nickname,
    },
  });

  const phone = body.phone;
  const verifyPhone = await prisma.user.findFirst({
    where: {
      phone,
    },
  });

  if (verifyEmail !== null || verifyNickName !== null || verifyPhone !== null) {
    if (verifyEmail !== null) {
      existsValues.email = true;
    }
    if (verifyNickName !== null) {
      existsValues.nickname = true;
    }
    if (verifyPhone !== null) {
      existsValues.phone = true;
    }
    return existsValues;
  } else {
    const bodyPassword = AES.decrypt(body.password, CRYPTO_KEY);
    const password = bodyPassword.toString(enc.Utf8);
    const { name, lastName } = formatName(body.name, body.lastName);
    const user = await prisma.user.create({
      data: {
        name,
        lastName,
        nickname: body.nickname,
        profilePhoto: "",
        email: body.email,
        password,
        roleLevel: body.roleLevel,
        phone: body.phone,
      },
    });
    return user;
  }
}
