import { AES } from "crypto-js";
import { verify } from "jsonwebtoken";

export default async function validateToken(token: any) {
  const TOKEN_KEY = process.env.TOKEN_KEY || "";
  if (token != null) {
    try {
      verify(token, TOKEN_KEY);
      return true;
    } catch (e) {
      return false;
    }
  } else {
    return false;
  }
}
