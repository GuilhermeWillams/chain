import { ScriptForm } from "../../models/scriptForm";
import { prisma } from "../../server";
import ScriptCisco from "../scriptCisco";
import ScriptFortinet from "../scriptFortinet";
import ScriptJuniper from "../scriptJuniper";

export default async function CreateScript(body: ScriptForm, userId: string) {
  var script: string;
  if (body.equipBrand === "Cisco") {
    script = ScriptCisco(body);
  } else if (body.equipBrand === "Juniper") {
    script = ScriptJuniper(body);
  } else {
    script = ScriptFortinet(body);
  }
  if (userId !== "off") {
    const insertScript = await prisma.script.create({
      data: {
        equipBrand: body.equipBrand,
        script,
        equipModel: body.equipModel,
        userId,
      },
    });
  }

  return script;
}
