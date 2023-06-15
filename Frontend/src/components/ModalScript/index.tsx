import { BiCopy, BiHelpCircle } from "react-icons/bi";
import styles from "./styles.module.scss";
import { useContext, useState } from "react";
import { RiFileDownloadLine } from "react-icons/ri";
import { AiOutlineClose } from "react-icons/ai";
import { sanitize } from "htmlescape";
import UserLocalContext from "../../contexts/UserLocalContext";
import Link from "next/link";
export default function ModalScript(props: any) {
  const { userLocal } = useContext(UserLocalContext);
  const [tooltips, setTooltips] = useState({
    tooltip1: false,
    tooltip2: false,
    tooltip3: false,
    tooltip4: false,
  });
  const [help, setHelp] = useState({ clicked: false, content: "" });
  const [banner, setBanner] = useState(!userLocal.logged);
  const script = props.script;
  const equipBrand = props.equipBrand;

  function formatScript() {
    const scriptHtml = document.createElement("div");
    scriptHtml.innerHTML = script;
    const scriptFormat = script.replace(/<br>/g, "\n").replace(/&nbsp;/g, " ");
    return scriptFormat;
  }
  async function copyScript() {
    await navigator.clipboard.writeText(formatScript());
  }
  function handleHelp() {
    const tab = `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`;
    const helpCisco = `<h3>Como jogar script de configuração Cisco</h3>
    <br>1 - Identifique a porta de console no equipamento <strong>Cisco</strong> (Geralmente rotulada como <strong>"Console"</strong> ou <strong>"CON"</strong>).
    <br>2 - Conecte a extremidade <strong>RJ-45</strong> do cabo console à porta de <strong>console</strong> no equipamento <strong>Cisco</strong>.
    <br>3 - Conecte a outra extremidade do cabo <strong>console</strong> ao seu computador (Dependendo do conector <strong>serial</strong> disponível no seu computador, você pode precisar de um adaptador <strong>serial-USB</strong>).
    <br>4 - Abra um aplicativo de emulação de terminal, como o <strong>PuTTY</strong>, <strong>Tera Term</strong> ou <strong>SecureCRT</strong>, no seu computador.
    <br>5 - Configure as propriedades da conexão no aplicativo de emulação de terminal da seguinte maneira:
    <br>${tab}5.1 -Tipo de conexão: <strong>Serial</strong>
    <br>${tab}5.2 -Porta: Selecione a porta <strong>serial</strong> correta à qual o cabo console está conectado no seu computador (por exemplo, <strong>COM1</strong>, <strong>COM2</strong> etc.).
    <br>${tab}5.3 -Velocidade (baud rate): Geralmente é <strong>9600</strong>, mas pode variar dependendo da configuração do equipamento <strong>Cisco</strong>.
    <br>6 - Clique em <strong>"Conectar"</strong> ou pressione <strong>Enter</strong> para estabelecer a conexão.
    <br>7 - Certifique-se de ter o <strong>script</strong> de configuração pronto em um arquivo de texto (<strong>clique acima para baixar</strong>). O <strong>script</strong> deve conter os comandos de configuração que você deseja aplicar no switch.
    <br>8 - No aplicativo de emulação de terminal, copie e cole o <strong>script</strong> de configuração.`;
    const helpJuniper = `<h3>Como jogar script de configuração no Switch Juniper</h3>
    <br>1 - Localize a porta de console no switch <strong>Juniper</strong> (Geralmente localizada na parte traseira do dispositivo e é rotulada como <strong>"Console"</strong> ou <strong>"CON"</strong>).
    <br>2 - Conecte a extremidade <strong>RJ-45</strong> do cabo console à porta de console no switch <strong>Juniper</strong>.
    <br>3 - Conecte a outra extremidade do cabo console ao seu computador (Dependendo do conector serial disponível em seu computador, você pode precisar de um adaptador serial-USB).
    <br>4 - Abra um aplicativo de emulação de terminal, como o <strong>PuTTY</strong>, <strong>Tera Term</strong> ou <strong>SecureCRT</strong>, em seu computador.
    <br>5 - Configure as propriedades da conexão no aplicativo de emulação de terminal da seguinte maneira:
    <br>${tab}5.1 - Tipo de conexão: <strong>Serial</strong>
    <br>${tab}5.2 - Porta: Selecione a porta serial correta à qual o cabo console está conectado em seu computador (por exemplo, <strong>COM1</strong>, <strong>COM2</strong> etc.).
    <br>${tab}5.3 - Velocidade (baud rate): A velocidade de conexão padrão para os switches Juniper geralmente é <strong>9600</strong>.
    <br>6 - Clique em <strong>"Conectar"</strong> ou pressione <strong>Enter</strong> para estabelecer a conexão.
    <br>7 - Após estabelecer a conexão com o console do switch <strong>Juniper</strong>, você estará pronto para jogar o <strong>script</strong> de configuração.
    <br>8 - Certifique-se de ter o <strong>script</strong> de configuração pronto em um arquivo de texto (<strong>clique acima para baixar</strong>). O <strong>script</strong> deve conter os comandos de configuração que você deseja aplicar no switch <strong>Juniper</strong>.
    <br>9 - Entre no modo de configuração do equipamento executando o comando <strong>edit</strong>.
    <br>10 - Logo em seguida digite o comando <strong>load set terminal</strong>, copie e cole o <strong>script</strong> e espere carregar.
    <br>11 - Após terminar de carregar digite as teclas <strong>crtl+D</strong> e em seguida o comando <strong>commit and-quit.</strong>`;
    const helpFortinet = `<h3>Como jogar script de configuração no Switch FORTINET</h3>
    <br>Localize a porta de gerência no switch <strong>FORTINET</strong>. Geralmente ela está rotulada como <strong>"MGMT"</strong>.
    <br>Conecte uma extremidade <strong>RJ-45</strong> do cabo de rede à porta <strong>MGMT</strong> do switch.
    <br>Conecte a outra extremidade do cabo de rede ao seu computador. 
    <br>O endereço <strong>IP</strong> padrão de fábrica do switch <strong>Fortinet</strong> é <strong>192.168.1.99</strong>. Portanto, abra a configuração da placa de rede do seu computador e configure o seguinte endereço <strong>IP</strong>:
    <br>${tab}IP: <strong>192.168.1.98</strong>
    <br>${tab}Máscara: <strong>255.255.255.0</strong>
    <br>${tab}Gateway: <strong>192.168.1.99</strong>
    <br>Entre em algum navegador de sua escolha, digite na barra pesquisa <strong>https://192.168.1.99</strong> e pressione <strong>Enter</strong> para estabelecer a conexão.
    <br>O navegador irá exibir um aviso de certificado de segurança, pois o certificado autoassinado do switch <strong>Fortinet</strong> não é confiável. Clique em <strong>"Avançado"</strong> ou <strong>"Continuar"</strong> para prosseguir para o site.
    <br>Na página de <strong>login</strong>, insira o nome de usuário e a senha padrão do switch <strong>Fortinet</strong>. O nome de usuário padrão é <strong>"admin"</strong> e não possui senha, após apertar <strong>enter</strong> é necessário inserir uma nova senha.
    <br>Com as credenciais inseridas, você será direcionado para a interface gráfica do switch <strong>Fortinet</strong>.
    <br>Navegue pelas opções de menu para encontrar a seção de configuração ou gerenciamento do switch. Normalmente, essa seção é chamada de <strong>"System"</strong> ou <strong>"Configuration"</strong>.
    <br>Procure por opções relacionadas à importação ou upload de arquivos de configuração. Essa opção pode ser denominada <strong>"Import"</strong>, <strong>"Upload"</strong> ou <strong>"Restore"</strong>.
    <br>Selecione a opção de <strong>importação</strong> ou <strong>upload</strong> e localize o arquivo de <strong>script</strong> de configuração em seu computador, lembrando que extensão do arquivo deve estar como <strong>.conf</strong>. Certifique-se de ter o arquivo de <strong>script</strong> de configuração pronto em um local acessível. (<strong>clique acima para baixar o .conf</strong>)
    <br>Selecione o arquivo de <strong>script</strong> de configuração e clique em <strong>"Abrir"</strong> ou <strong>"Upload"</strong> para iniciar o processo de <strong>importação</strong>.
    <br>Aguarde até que o <strong>upload</strong> seja concluído. O tempo necessário dependerá do tamanho do arquivo de configuração e da velocidade da conexão de rede.
    <br>Após o <strong>upload</strong>, o switch <strong>Fortinet</strong> processará o <strong>script</strong> de configuração e aplicará as alterações. Isso pode levar um certo tempo.
    <br>Depois que o <strong>script</strong> de configuração for processado, você receberá uma confirmação na interface gráfica informando que as configurações foram aplicadas com <strong>sucesso</strong>.`;

    const helpSet = help;
    if (!helpSet.clicked) {
      if (equipBrand === "Cisco") {
        helpSet.content = helpCisco;
      } else if (equipBrand === "Juniper") {
        helpSet.content = helpJuniper;
      } else {
        helpSet.content = helpFortinet;
      }
    } else {
      helpSet.content = "";
    }

    helpSet.clicked = !help.clicked;
    setHelp(helpSet);
  }
  function closeModal() {
    props.setModal(false);
    const closeTooltip = tooltips;
    closeTooltip.tooltip1 = false;
    closeTooltip.tooltip2 = false;
    closeTooltip.tooltip3 = false;
    closeTooltip.tooltip4 = false;
    setTooltips(closeTooltip);
    setHelp({ ...help, clicked: false, content: "" });
  }
  function downloadScript() {
    const element = document.createElement("a");
    const file = new Blob([formatScript() as string], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    if (equipBrand === "Fortinet") {
      element.download = `Script - ${equipBrand}.conf`;
    } else {
      element.download = `Script - ${equipBrand}.txt`;
    }

    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  return (
    <div className={styles.modalBackground}>
      {banner && (
        <div className={styles.bannerLogin}>
          <h4>
            <Link href={"/login"}>Entre </Link>ou faça seu{" "}
            <Link href={"/register"}>cadastro</Link> para deixar este script
            salvo no seu perfil.
          </h4>
          <AiOutlineClose onClick={() => setBanner(false)} />
        </div>
      )}

      <div className={styles.modal}>
        <div className={styles.login}></div>
        <div className={styles.modalActions}>
          <BiCopy
            onMouseEnter={() => setTooltips({ ...tooltips, tooltip1: true })}
            onMouseLeave={() => setTooltips({ ...tooltips, tooltip1: false })}
            onClick={() => copyScript()}
          />
          {tooltips.tooltip1 && (
            <span
              style={{ translate: "-0.7rem -1.8rem" }}
              className={styles.tooltip}
            >
              <label />
              <p>Copiar</p>
            </span>
          )}
          <RiFileDownloadLine
            onMouseEnter={() => setTooltips({ ...tooltips, tooltip2: true })}
            onMouseLeave={() => setTooltips({ ...tooltips, tooltip2: false })}
            onClick={() => downloadScript()}
          />
          {tooltips.tooltip2 && (
            <span
              style={{ translate: "1.7rem -1.8rem" }}
              className={styles.tooltip}
            >
              <label />
              <p>Baixar</p>
            </span>
          )}

          <BiHelpCircle
            style={help.clicked ? { color: "#c99249" } : {}}
            onMouseEnter={() => setTooltips({ ...tooltips, tooltip3: true })}
            onMouseLeave={() => setTooltips({ ...tooltips, tooltip3: false })}
            onClick={() => handleHelp()}
          />
          {tooltips.tooltip3 && (
            <span
              style={{ translate: "4.1rem -1.8rem" }}
              className={styles.tooltip}
            >
              <label />
              <p>{help.clicked ? "Fechar" : " Ajuda"}</p>
            </span>
          )}
          <AiOutlineClose
            onMouseEnter={() => setTooltips({ ...tooltips, tooltip4: true })}
            onMouseLeave={() => setTooltips({ ...tooltips, tooltip4: false })}
            onClick={() => closeModal()}
          />
          {tooltips.tooltip4 && (
            <span
              style={{ translate: "90.6rem -1.8rem" }}
              className={styles.tooltip}
            >
              <label />
              <p>Fechar</p>
            </span>
          )}
        </div>

        <div
          className={styles.modalContent}
          dangerouslySetInnerHTML={{
            __html: sanitize(help.clicked ? help.content : script),
          }}
        ></div>
      </div>
    </div>
  );
}
