import { prisma, CRYPTO_KEY, TOKEN_KEY } from "../../server";
import { AES, enc } from "crypto-js";
import * as jwt from "jsonwebtoken";
import userObject from "../../models/userObject";

interface LoginBody {
  email: string;
  password: string;
}
export default async function Login(body: LoginBody) {
  const email = body.email;
  const bodyPassword = AES.decrypt(body.password, CRYPTO_KEY);
  const password = bodyPassword.toString(enc.Utf8);

  const user = await prisma.user.findFirst({
    where: {
      email,
      password,
    },
  });

  if (user) {
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      TOKEN_KEY
    );
    const userData = userObject(user, token);

    return userData;
  } else {
    return { code: 404 };
  }
}
