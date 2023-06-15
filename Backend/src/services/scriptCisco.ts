import { PortConfig } from "../models/portConfig";
import { VlanConfig } from "../models/vlanConfig";
import { ScriptForm } from "../models/scriptForm";

export default function ScriptCisco(body: ScriptForm) {
  var script: string = "enable<br>conf t<br>";
  if (body.switchName) {
    script += `hostname ${body.switchName}<br>`;
  }

  if (body.globalPassword) {
    if (body.encryptGlobal === "true") {
      script += `enable secret level 15 ${body.globalPassword}<br><br>`;
    } else {
      script += `enable password level 15 ${body.globalPassword}<br><br>`;
    }
  } else {
    script += `<br>`;
  }
  if (body.adminPassword) {
    script += `username admin privilege 15 password ${body.adminPassword}<br>`;
  }
  if (body.encryptAdmin) {
    script += `service password-encryption<br>`;
  }
  script +=
    "vtp mode transparent<br>vlan internal allocation policy ascending<br><br>";
  const vlans = JSON.parse(body.vlan);
  vlans.map((vlan: VlanConfig) => {
    script += `vlan ${vlan.id}<br>name "${vlan.desc}"<br>exit<br><br>`;
  });
  const ports = JSON.parse(body.ports);
  ports.map((port: PortConfig) => {
    script += `interface GigabitEthernet1/0/${port.portId}<br>`;
    if (port.trunkMode) {
      script += `switchport mode trunk<br>`;
    } else {
      script += `switchport access vlan ${parseInt(port.vlanId)}<br>`;
    }
    if (port.portDesc) {
      script += `description "${port.portDesc}"<br>`;
    }
    script += `switchport mode access<br>`;
    if (port.looping) {
      script += `spanning-tree portfast<br>`;
    }
    script += `duplex ${port.connexionType}<br>`;
    script += `speed ${port.portSpeed}<br>exit<br><br>`;
  });
  script += `interface Vlan1<br>no ip address<br>no shutdown<br>exit<br><br>`;
  script += `interface Vlan ${parseInt(body.managementVlan)}<br>ip address ${
    body.ip
  } ${body.mask}<br>no shutdown<br>exit<br><br>`;
  script += `ip default-gateway ${body.gateway}<br>ip http server<br>ip http secure-server<br>`;
  if (body.banner) {
    script += `banner motd ^<br>${body.banner}<br>^C<br>`;
  }
  if (body.consolePassword) {
    script += `line con 0<br>password ${body.consolePassword}<br>exit<br>`;
  }
  script += `<br>end`;
  return script;
}
