import { PortConfig } from "../models/portConfig";
import { ScriptForm } from "../models/scriptForm";
import { VlanConfig } from "../models/vlanConfig";

export default function ScriptFortinet(body: ScriptForm) {
  const tab = "&nbsp;&nbsp;";
  var script: string = `#config-version=S248DN-6.04-FW-build411-200409:opmode=0:vdom=0<br>#conf_file_ver=14873120099970628460<br>#buildno=0411<br>#global_vdom=1<br>`;
  script += "config system global<br>";
  // if (body.banner) {
  //   script += `${tab}set admin-banner enable<br>${tab}set admin-banner-message "${body.banner}"<br>`;
  // }
  script += `${tab}set auto-isl enable<br>${tab}set fortilink-auto-discovery enable<br>`;
  if (body.switchName) {
    script += `${tab}set hostname "${body.switchName}"<br>`;
  }
  script += `${tab}set language english<br>${tab}set timezone 18<br>end<br>`;
  script += `config system accprofile<br>${tab}edit "prof_admin"<br>${
    tab + tab
  }set admingrp read-write<br>${tab + tab}set loggrp read-write<br>${
    tab + tab
  }set netgrp read-write<br>${tab + tab}set routegrp read-write<br>${
    tab + tab
  }set sysgrp read-write<br>${tab}next<br>end<br>`;
  script += `config switch lldp profile<br>${tab}edit "default"<br>${
    tab + tab
  }config med-network-policy<br>${tab + tab + tab}edit "voice"<br>${
    tab + tab + tab
  }next<br>${tab + tab + tab}edit "voice-signaling"<br>${
    tab + tab + tab
  }next<br>${tab + tab + tab}edit "guest-voice"<br>${tab + tab + tab}next<br>${
    tab + tab + tab
  }edit "guest-voice-signaling"<br>${tab + tab + tab}next<br>${
    tab + tab + tab
  }edit "softphone-voice"<br>${tab + tab + tab}next<br>${
    tab + tab + tab
  }edit "video-conferencing"<br>${tab + tab + tab}next<br>${
    tab + tab + tab
  }edit "streaming-video"<br>${tab + tab + tab}next<br>${
    tab + tab + tab
  }edit "video-signaling"<br>${tab + tab + tab}next<br>${tab + tab}end<br>${
    tab + tab
  }set med-tlvs inventory-management network-policy<br>${tab}next<br>${tab}edit "default-auto-isl"<br>${
    tab + tab
  }set auto-isl enable<br>${tab}next<br>end<br>`;
  script += `config switch vlan-tpid<br>${tab}edit "default"<br>${
    tab + tab
  }set ether-type 0x8100<br>${tab}next<br>end<br>`;
  script += `config switch qos qos-policy<br>${tab}edit "default"<br>${
    tab + tab
  }config cos-queue<br>${tab + tab + tab}edit "queue-0"<br>${
    tab + tab + tab
  }next<br>${tab + tab + tab}edit "queue-1"<br>${tab + tab + tab}next<br>${
    tab + tab + tab
  }edit "queue-2"<br>${tab + tab + tab}next<br>${
    tab + tab + tab
  }edit "queue-3"<br>${tab + tab + tab}next<br>${
    tab + tab + tab
  }edit "queue-4"<br>${tab + tab + tab}next<br>${
    tab + tab + tab
  }edit "queue-5"<br>${tab + tab + tab}next<br>${
    tab + tab + tab
  }edit "queue-6"<br>${tab + tab + tab}next<br>${
    tab + tab + tab
  }edit "queue-7"<br>${tab + tab + tab}next<br>${tab + tab}end<br>${
    tab + tab
  }set rate-by kbps<br>${
    tab + tab
  }set schedule round-robin<br>${tab}next<br>end<br>`;
  script += `config switch physical-port<br>`;

  const ports = JSON.parse(body.ports);

  ports.map((port: PortConfig) => {
    var portNegotiation;
    if (port.portSpeed === "auto" && port.connexionType === "auto") {
      portNegotiation = "auto";
    } else if (port.portSpeed === "1000") {
      portNegotiation = "1000auto";
    } else {
      portNegotiation = port.portSpeed + port.connexionType;
    }
    script += `${tab}edit "port${port.portId}"<br>${tab + tab}`;
    if (port.portDesc) {
      script += `set description "${port.portDesc}"<br>${tab + tab}`;
    }
    script += `set lldp-profile "default"<br>${
      tab + tab
    }set speed ${portNegotiation}<br>${tab}next<br>`;
  });

  script += `<br>end<br>`;
  script += `config switch vlan<br>`;

  const vlans = JSON.parse(body.vlan);
  vlans.map((vlan: VlanConfig) => {
    script += `${tab}edit ${vlan.id}<br>${tab + tab}set description "${
      vlan.desc
    }"<br>${tab}next<br>`;
  });
  script += `<br>end<br>`;
  script += `config switch interface<br>`;
  ports.map((port: PortConfig) => {
    script += `${tab}edit "port${port.portId}"<br>`;
    if (port.trunkMode) {
      script += `${tab + tab}set native-vlan ${body.managementVlan}<br>`;
      script += `${tab + tab}set allowed-vlans ${vlans.map(
        (vlan: VlanConfig) => {
          return vlan.id;
        }
      )}<br>`;
    } else {
      script += `${tab + tab}set native-vlan ${port.vlanId}<br>`;
    }
    if (!port.looping) {
      script += `${tab + tab}set stp-state disabled<br>${
        tab + tab
      }set edge-port disabled<br>`;
    }
    script += `${tab + tab}set snmp-index ${port.portId}<br>${tab}next<br>`;
  });
  script += `end<br>`;
  script += `config switch stp instance<br>${tab}edit "0"<br>${
    tab + tab
  }config stp-port`;
  ports.map((port: PortConfig) => {
    script += `<br>${tab + tab + tab}edit "port${port.portId}"<br>${
      tab + tab + tab
    }next`;
  });
  script += `<br>${tab + tab}end<br>${tab}next<br>end<br>`;
  script += `config switch storm-control<br>${tab}set rate 0<br>end<br>`;
  script += `config switch acl service custom<br>`;
  script += `${tab}edit "ALL_TCP"<br>${
    tab + tab
  }set tcp-portrange 1-65535<br>${tab}next<br>`;

  script += `${tab}edit "ALL_UDP"<br>${
    tab + tab
  }set udp-portrange 1-65535<br>${tab}next<br>`;

  script += `${tab}edit "ALL_TCP"<br>${
    tab + tab
  }set tcp-portrange 1-65535<br>${tab}next<br>`;

  script += `${tab}edit "ALL_ICMP"<br>${
    tab + tab
  }set protocol ICMP<br>${tab}next<br>`;

  script += `${tab}edit "AOL"<br>${
    tab + tab
  }set tcp-portrange 5190-5194<br>${tab}next<br>`;

  script += `${tab}edit "BGP"<br>${
    tab + tab
  }set tcp-portrange 179<br>${tab}next<br>`;

  script += `${tab}edit "DHCP"<br>${
    tab + tab
  }set udp-portrange 67-68<br>${tab}next<br>`;

  script += `${tab}edit "DNS_TCP"<br>${
    tab + tab
  }set tcp-portrange 53<br>${tab}next<br>`;

  script += `${tab}edit "DNS_UDP"<br>${
    tab + tab
  }set udp-portrange 53<br>${tab}next<br>`;

  script += `${tab}edit "FINGER"<br>${
    tab + tab
  }set tcp-portrange 79<br>${tab}next<br>`;

  script += `${tab}edit "FTP"<br>${
    tab + tab
  }set tcp-portrange 21<br>${tab}next<br>`;

  script += `${tab}edit "FTP_GET"<br>${
    tab + tab
  }set tcp-portrange 21<br>${tab}next<br>`;

  script += `${tab}edit "FTP_PUT"<br>${
    tab + tab
  }set tcp-portrange 21<br>${tab}next<br>`;

  script += `${tab}edit "GOPHER"<br>${
    tab + tab
  }set tcp-portrange 70<br>${tab}next<br>`;

  script += `${tab}edit "H323_TCP1"<br>${
    tab + tab
  }set tcp-portrange 1720<br>${tab}next<br>`;

  script += `${tab}edit "H323_TCP2"<br>${
    tab + tab
  }set tcp-portrange 1503<br>${tab}next<br>`;

  script += `${tab}edit "H323_UDP"<br>${
    tab + tab
  }set udp-portrange 1719<br>${tab}next<br>`;

  script += `${tab}edit "HTTP"<br>${
    tab + tab
  }set tcp-portrange 80<br>${tab}next<br>`;

  script += `${tab}edit "HTTPS"<br>${
    tab + tab
  }set tcp-portrange 443<br>${tab}next<br>`;

  script += `${tab}edit "IKE"<br>${
    tab + tab
  }set udp-portrange 500<br>${tab}next<br>`;

  script += `${tab}edit "IKE2"<br>${
    tab + tab
  }set udp-portrange 4500<br>${tab}next<br>`;

  script += `${tab}edit "IMAP"<br>${
    tab + tab
  }set tcp-portrange 143<br>${tab}next<br>`;

  script += `${tab}edit "IMAPS"<br>${
    tab + tab
  }set tcp-portrange 993<br>${tab}next<br>`;

  script += `${tab}edit "Internet-Locator-Service"<br>${
    tab + tab
  }set tcp-portrange 389<br>${tab}next<br>`;

  script += `${tab}edit "IRC"<br>${
    tab + tab
  }set tcp-portrange 6660-6669<br>${tab}next<br>`;

  script += `${tab}edit "L2TP_TCP"<br>${
    tab + tab
  }set tcp-portrange 1701<br>${tab}next<br>`;

  script += `${tab}edit "L2TP_UDP"<br>${
    tab + tab
  }set udp-portrange 1701<br>${tab}next<br>`;

  script += `${tab}edit "LDAP"<br>${
    tab + tab
  }set tcp-portrange 389<br>${tab}next<br>`;

  script += `${tab}edit "NetMeeting"<br>${
    tab + tab
  }set tcp-portrange 1720<br>${tab}next<br>`;

  script += `${tab}edit "NFS_TCP1"<br>${
    tab + tab
  }set tcp-portrange 111<br>${tab}next<br>`;

  script += `${tab}edit "NFS_TCP2"<br>${
    tab + tab
  }set tcp-portrange 2049<br>${tab}next<br>`;

  script += `${tab}edit "NFS_UDP1"<br>${
    tab + tab
  }set udp-portrange 111<br>${tab}next<br>`;

  script += `${tab}edit "NFS_UDP2"<br>${
    tab + tab
  }set udp-portrange 2049<br>${tab}next<br>`;

  script += `${tab}edit "NNTP"<br>${
    tab + tab
  }set tcp-portrange 119<br>${tab}next<br>`;

  script += `${tab}edit "NTP_TCP"<br>${
    tab + tab
  }set tcp-portrange 123<br>${tab}next<br>`;

  script += `${tab}edit "NTP_UDP"<br>${
    tab + tab
  }set udp-portrange 123<br>${tab}next<br>`;

  script += `${tab}edit "OSPF"<br>${
    tab + tab
  }set tcp-portrange 89<br>${tab}next<br>`;

  script += `${tab}edit "PC-Anywhere_TCP"<br>${
    tab + tab
  }set tcp-portrange 5631<br>${tab}next<br>`;

  script += `${tab}edit "PC-Anywhere_UDP"<br>${
    tab + tab
  }set udp-portrange 5632<br>${tab}next<br>`;

  script += `${tab}edit "PTP_UDP"<br>${
    tab + tab
  }set udp-portrange 319-320<br>${tab}next<br>`;

  script += `${tab}edit "ONC-RPC-TCP"<br>${
    tab + tab
  }set tcp-portrange 111<br>${tab}next<br>`;

  script += `${tab}edit "ONC-RPC-UDP"<br>${
    tab + tab
  }set udp-portrange 111<br>${tab}next<br>`;

  script += `${tab}edit "DCE-RPC-TCP"<br>${
    tab + tab
  }set tcp-portrange 135<br>${tab}next<br>`;

  script += `${tab}edit "DCE-RPC-UDP"<br>${
    tab + tab
  }set udp-portrange 135<br>${tab}next<br>`;

  script += `${tab}edit "POP3"<br>${
    tab + tab
  }set tcp-portrange 110<br>${tab}next<br>`;

  script += `${tab}edit "POP3S"<br>${
    tab + tab
  }set tcp-portrange 995<br>${tab}next<br>`;

  script += `${tab}edit "PPTP"<br>${
    tab + tab
  }set tcp-portrange 1723<br>${tab}next<br>`;

  script += `${tab}edit "QUAKE1"<br>${
    tab + tab
  }set udp-portrange 26000<br>${tab}next<br>`;

  script += `${tab}edit "QUAKE2"<br>${
    tab + tab
  }set udp-portrange 27000<br>${tab}next<br>`;

  script += `${tab}edit "QUAKE3"<br>${
    tab + tab
  }set udp-portrange 27910<br>${tab}next<br>`;

  script += `${tab}edit "QUAKE4"<br>${
    tab + tab
  }set udp-portrange 27960<br>${tab}next<br>`;

  script += `${tab}edit "RAUDIO"<br>${
    tab + tab
  }set udp-portrange 7070<br>${tab}next<br>`;

  script += `${tab}edit "REXEC"<br>${
    tab + tab
  }set tcp-portrange 512<br>${tab}next<br>`;

  script += `${tab}edit "RIP"<br>${
    tab + tab
  }set udp-portrange 520<br>${tab}next<br>`;

  script += `${tab}edit "RLOGIN"<br>${
    tab + tab
  }set tcp-portrange 513:512-1023<br>${tab}next<br>`;

  script += `${tab}edit "RSH"<br>${
    tab + tab
  }set tcp-portrange 514:512-1023<br>${tab}next<br>`;

  script += `${tab}edit "SCCP"<br>${
    tab + tab
  }set tcp-portrange 2000<br>${tab}next<br>`;

  script += `${tab}edit "SIP_TCP"<br>${
    tab + tab
  }set tcp-portrange 5060<br>${tab}next<br>`;

  script += `${tab}edit "SIP_UDP"<br>${
    tab + tab
  }set udp-portrange 5060<br>${tab}next<br>`;

  script += `${tab}edit "SIP-MSNmessenger"<br>${
    tab + tab
  }set tcp-portrange 1863<br>${tab}next<br>`;

  script += `${tab}edit "SAMBA"<br>${
    tab + tab
  }set tcp-portrange 139<br>${tab}next<br>`;

  script += `${tab}edit "SMTP"<br>${
    tab + tab
  }set tcp-portrange 25<br>${tab}next<br>`;

  script += `${tab}edit "SMTPS"<br>${
    tab + tab
  }set tcp-portrange 465<br>${tab}next<br>`;

  script += `${tab}edit "SNMP_TCP"<br>${
    tab + tab
  }set tcp-portrange 161-162<br>${tab}next<br>`;

  script += `${tab}edit "SNMP_UDP"<br>${
    tab + tab
  }set udp-portrange 161-162<br>${tab}next<br>`;

  script += `${tab}edit "SSH"<br>${
    tab + tab
  }set tcp-portrange 22<br>${tab}next<br>`;

  script += `${tab}edit "SYSLOG"<br>${
    tab + tab
  }set udp-portrange 514<br>${tab}next<br>`;

  script += `${tab}edit "TALK"<br>${
    tab + tab
  }set udp-portrange 517-518<br>${tab}next<br>`;

  script += `${tab}edit "TELNET"<br>${
    tab + tab
  }set tcp-portrange 23<br>${tab}next<br>`;

  script += `${tab}edit "TFTP"<br>${
    tab + tab
  }set udp-portrange 69<br>${tab}next<br>`;

  script += `${tab}edit "MGCP"<br>${
    tab + tab
  }set udp-portrange 2427<br>${tab}next<br>`;

  script += `${tab}edit "MGCP2"<br>${
    tab + tab
  }set udp-portrange 2727<br>${tab}next<br>`;

  script += `${tab}edit "UUCP"<br>${
    tab + tab
  }set tcp-portrange 540<br>${tab}next<br>`;

  script += `${tab}edit "VDOLIVE"<br>${
    tab + tab
  }set tcp-portrange 7000-7010<br>${tab}next<br>`;

  script += `${tab}edit "WAIS"<br>${
    tab + tab
  }set tcp-portrange 210<br>${tab}next<br>`;

  script += `${tab}edit "WINFRAME1"<br>${
    tab + tab
  }set tcp-portrange 1494<br>${tab}next<br>`;

  script += `${tab}edit "WINFRAME2"<br>${
    tab + tab
  }set tcp-portrange 2598<br>${tab}next<br>`;

  script += `${tab}edit "X-WINDOWS"<br>${
    tab + tab
  }set tcp-portrange 6000-6063<br>${tab}next<br>`;

  script += `${tab}edit "MS-SQL"<br>${
    tab + tab
  }set tcp-portrange 1433-1434<br>${tab}next<br>`;

  script += `${tab}edit "MYSQL"<br>${
    tab + tab
  }set tcp-portrange 3306<br>${tab}next<br>`;

  script += `${tab}edit "RDP"<br>${
    tab + tab
  }set tcp-portrange 3389<br>${tab}next<br>`;

  script += `${tab}edit "VNC"<br>${
    tab + tab
  }set tcp-portrange 5900<br>${tab}next<br>`;

  script += `${tab}edit "DHCP6"<br>${
    tab + tab
  }set udp-portrange 546-547<br>${tab}next<br>`;

  script += `${tab}edit "SQUID"<br>${
    tab + tab
  }set tcp-portrange 3128<br>${tab}next<br>`;

  script += `${tab}edit "SOCKS_TCP"<br>${
    tab + tab
  }set tcp-portrange 1080<br>${tab}next<br>`;

  script += `${tab}edit "SOCKS_UDP"<br>${
    tab + tab
  }set udp-portrange 1080<br>${tab}next<br>`;

  script += `${tab}edit "WINS_TCP"<br>${
    tab + tab
  }set tcp-portrange 1512<br>${tab}next<br>`;

  script += `${tab}edit "WINS_UDP"<br>${
    tab + tab
  }set udp-portrange 1512<br>${tab}next<br>`;

  script += `${tab}edit "RADIUS"<br>${
    tab + tab
  }set udp-portrange 1812-1813<br>${tab}next<br>`;

  script += `${tab}edit "RADIUS-OLD"<br>${
    tab + tab
  }set udp-portrange 1645-1646<br>${tab}next<br>`;

  script += `${tab}edit "CVSPSERVER_TCP"<br>${
    tab + tab
  }set tcp-portrange 2401<br>${tab}next<br>`;

  script += `${tab}edit "CVSPSERVER_UDP"<br>${
    tab + tab
  }set udp-portrange 2401<br>${tab}next<br>`;

  script += `${tab}edit "AFS3_TCP"<br>${
    tab + tab
  }set tcp-portrange 7000-7009<br>${tab}next<br>`;

  script += `${tab}edit "AFS3_UDP"<br>${
    tab + tab
  }set udp-portrange 7000-7009<br>${tab}next<br>`;

  script += `${tab}edit "TRACEROUTE"<br>${
    tab + tab
  }set udp-portrange 33434-33535<br>${tab}next<br>`;

  script += `${tab}edit "RTSP_TCP1"<br>${
    tab + tab
  }set tcp-portrange 554<br>${tab}next<br>`;

  script += `${tab}edit "RTSP_TCP2"<br>${
    tab + tab
  }set tcp-portrange 7070<br>${tab}next<br>`;

  script += `${tab}edit "RTSP_TCP3"<br>${
    tab + tab
  }set tcp-portrange 8554<br>${tab}next<br>`;

  script += `${tab}edit "RTSP_UDP"<br>${
    tab + tab
  }set udp-portrange 554<br>${tab}next<br>`;

  script += `${tab}edit "MMS_TCP"<br>${
    tab + tab
  }set tcp-portrange 1755<br>${tab}next<br>`;

  script += `${tab}edit "MMS_UDP"<br>${
    tab + tab
  }set udp-portrange 1024-5000<br>${tab}next<br>`;

  script += `${tab}edit "KERBEROS_TCP"<br>${
    tab + tab
  }set tcp-portrange 88<br>${tab}next<br>`;

  script += `${tab}edit "KERBEROS_UDP"<br>${
    tab + tab
  }set tcp-portrange 88<br>${tab}next<br>`;

  script += `${tab}edit "LDAP_UDP"<br>${
    tab + tab
  }set udp-portrange 389<br>${tab}next<br>`;

  script += `${tab}edit "SMB"<br>${
    tab + tab
  }set tcp-portrange 445<br>${tab}next<br>`;

  script += `${tab}edit "NONE"<br>${
    tab + tab
  }set tcp-portrange 0<br>${tab}next<br>`;

  script += `${tab}edit "ALL"<br>${
    tab + tab
  }set protocol IP<br>${tab}next<br>end<br>`;

  script += `config system interface<br>`;
  script += `${tab} edit "mgmt"<br>${tab + tab}set mode dhcp<br>${
    tab + tab
  }set allowaccess ping https ssh<br>${tab + tab}set type physical<br>${
    tab + tab
  }set secondary-IP enable<br>${tab + tab}set snmp-index 55<br>${
    tab + tab
  }set defaultgw enable<br>${tab + tab + tab}config secondaryip<br>${
    tab + tab + tab + tab
  }edit 1<br>${
    tab + tab + tab + tab + tab
  }set ip 192.168.1.99 255.255.255.0<br>${
    tab + tab + tab + tab + tab
  }set allowaccess ping https http ssh<br>${tab + tab + tab + tab}next<br>${
    tab + tab + tab
  }end<br>${tab}next<br>${tab}edit "internal"<br>${
    tab + tab
  }set type physical<br>${tab + tab}set snmp-index 54<br>${tab}next<br>${tab}`;
  const managementVlan = vlans.find(
    (vlan: VlanConfig) => vlan.id === body.managementVlan
  );

  script += `edit "${managementVlan.desc}"<br>`;
  script += `${tab + tab}set ip ${body.ip} ${body.mask}<br>${
    tab + tab
  }set allowaccess ping https ssh snmp<br>${tab + tab}set snpm-index 56<br>${
    tab + tab
  }set vlanid ${managementVlan.id}<br>${
    tab + tab
  }set interface "internal"<br>${tab}next<br>end<br>`;
  script += `config system admin<br>${tab}edit "admin"<br>${
    tab + tab
  }set accprofile "super_admin"<br>${tab + tab}set password ${
    body.adminPassword
  }<br>${tab}next<br>end<br>`;
  script += `config system dns<br>end<br>config system snmp sysinfo<br>end<br>config system snmp community<br>end<br>config system certificate ca<br>end<br>config system certificate local<br>end<br>config system ntp<br>end<br>config user tacacs+<br>end<br>config user group<br>end<br>`;
  script += `config router static<br>${tab}edit 1<br>${
    tab + tab
  }set dst 0.0.0.0 0.0.0.0<br>${tab + tab}set gateway ${
    body.gateway
  }<br>${tab}next<br>end`;
  return script;
}
