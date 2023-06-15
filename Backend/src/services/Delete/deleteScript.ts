import { prisma } from "../../server";

export default async function DeleteScript(id: string) {
  const deleteScript = await prisma.script.delete({
    where: {
      id,
    },
  });
  return deleteScript.id;
}
