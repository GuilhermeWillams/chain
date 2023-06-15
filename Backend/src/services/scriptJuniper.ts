import { PortConfig } from "../models/portConfig";
import { ScriptForm } from "../models/scriptForm";
import { VlanConfig } from "../models/vlanConfig";

export default function ScriptJuniper(body: ScriptForm) {
  const mask = () => {
    const octet = body.mask.split(".");
    // Calcula o número de bits definidos no formato IP
    let numBits = 0;
    for (let i = 0; i < octet.length; i++) {
      let value = parseInt(octet[i]);

      while (value > 0) {
        if (value & 1) {
          numBits++;
        }
        value >>= 1;
      }
    }

    // Retorna a máscara no formato /XX
    return "/" + numBits;
  };

  var script: string = "";
  if (body.switchName) {
    script += `set system host-name ${body.switchName}<br>`;
  }
  script += `set system auto-snapshot<br>set system time-zone America/Sao_Paulo<br>set system no-redirects<br>`;
  if (body.adminPassword) {
    script += `set system root-authentication encrypted-password ${body.adminPassword}<br>`;
  }
  script += `set system accounting events login<br>set system accounting events change-log<br>set system accounting events interactive-commands<br>`;
  if (body.banner) {
    script += `set system login message "${body.banner}"<br>`;
  }
  script += `set system login class operator-local idle-timeout 5<br>set system login class operator-local permissions all<br>set system login class read-only-local idle-timeout 5<br>set system login class read-only-local permissions all<br>set system login class super-user-local idle-timeout 5<br>set system login class super-user-local permissions all<br>set system login user admin uid valor0<br>set system login user admin class super-user<br>set system login user backup uid 2050<br>set system login user backup class read-only<br>set system login user nv1 uid 2025<br>set system login user nv1 class operator<br>set system services ssh protocol-version v2<br>set system services ssh max-sessions-per-connection 32<br>set system services netconf ssh<br>set system syslog user * any emergency<br>set system syslog file messages any notice<br>set system syslog file messages authorization info<br>set system syslog file interactive-commands interactive-commands any<br>set system syslog file default-log-messages any any<br>set system syslog file default-log-messages match "(requested 'commit' operation)|(copying configuration to juniper.save)|(commit complete)|ifAdminStatus|(FRU power)|(FRU removal)|(FRU insertion)|(link UP)|transitioned|Transferred|transfer-file|(license add)|(license delete)|(package -X update)|(package -X delete)|(FRU Online)|(FRU Offline)|(plugged in)|(unplugged)|cm_device|(Master Unchanged, Members Changed)|(Master Changed, Members Changed)|(Master Detected, Members Changed)|(vc add)|(vc delete)|(Master detected)|(Master changed)|(Backup detected)|(Backup changed)|(interface vcp-)|(AIS_DATA_AVAILABLE)"<br>set system syslog file default-log-messages structured-data<br>set system syslog file HISTORICO_DE_CHANGES any any<br>set system syslog file HISTORICO_DE_CHANGES match "(UI_COMMIT: User |UI_CFG_AUDIT)"<br>set system syslog file HISTORICO_DE_CHANGES archive size 5m<br>set system syslog file HISTORICO_DE_CHANGES archive files 5<br>set system max-configuration-rollbacks 16<br>set system commit synchronize<br>set chassis alarm management-ethernet link-down ignore<br>`;

  const ports = JSON.parse(body.ports);
  ports.map((port: PortConfig) => {
    if (port.trunkMode) {
      script += `set interfaces ge-0/0/${
        parseInt(port.portId) - 1
      } unit 0 family ethernet-switching port-mode trunk<br>`;
      script += `set interfaces ge-0/0/${
        parseInt(port.portId) - 1
      } unit 0 family ethernet-switching vlan members all`;
    } else {
      script += `set interfaces ge-0/0/${
        parseInt(port.portId) - 1
      } unit 0 family ethernet-switching port-mode access<br>`;
      script += `set interfaces ge-0/0/${
        parseInt(port.portId) - 1
      } unit 0 family ethernet-switching vlan members vlan-${port.vlanId}<br>`;
    }
    if (port.portDesc) {
      script += `set interfaces ge-0/0/${
        parseInt(port.portId) - 1
      } description "${port.portDesc}"<br>`;
    }
    if (port.connexionType === "auto") {
      script += `set interfaces ge-0/0/${
        parseInt(port.portId) - 1
      } ether-options auto-negotiation<br>`;
    } else {
      script += `set interfaces ge-0/0/${
        parseInt(port.portId) - 1
      } ether-options no-auto-negotiation<br>`;
      script += `set interfaces ge-0/0/${
        parseInt(port.portId) - 1
      } ether-options link-mode ${port.connexionType}-duplex<br>`;
    }
    const speed = () => {
      const speed = parseInt(port.portSpeed);
      if (speed === 10000) {
        return "10g";
      } else if (speed === 1000) {
        return "1g";
      } else if (speed === 100) {
        return "100m";
      } else if (speed === 10) {
        return "10m";
      } else {
        return "auto-negotiation";
      }
    };
    script += `set interfaces ge-0/0/${
      parseInt(port.portId) - 1
    } ether-options speed ${speed()}<br>`;
  });
  script += `set interfaces vlan unit ${
    body.managementVlan
  } family inet address ${body.ip}${mask()}<br>set vlans vlan-${
    body.managementVlan
  } l3-interface vlan.${body.managementVlan}<br>`;
  script += `set routing-options static route 0.0.0.0/0 next-hop ${body.gateway}<br>`;
  const portsWithLooping = ports.filter((port: PortConfig) => port.looping);

  if (portsWithLooping.length !== 0) {
    script += `set protocols rstp<br>set protocols vstp vlan all<br>`;
  } else {
    script += `delete protocols rstp<br>delete protocols vstp vlan all<br>`;
  }
  script += `set vlans default<br>`;

  const vlans = JSON.parse(body.vlan);
  vlans.map((vlan: VlanConfig) => {
    script += `set vlans vlan-${vlan.id} vlan-id ${vlan.id}<br>`;
    script += `set vlans vlan-${vlan.id} description "${vlan.desc}"<br>`;
  });

  return script;
}
