import { Footer } from "../../components/Footer";
import { Menu } from "../../components/Menu";
import { SiCisco, SiJunipernetworks, SiFortinet } from "react-icons/si";
import styles from "./styles.module.scss";
import { useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MdArrowForwardIos } from "react-icons/md";
import Head from "next/head";
import {
  RiCheckboxBlankFill,
  RiCheckboxFill,
  RiFileDownloadLine,
} from "react-icons/ri";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { AiFillMinusCircle, AiOutlineClose } from "react-icons/ai";
import { api } from "../../services/api";
import { sanitize } from "htmlescape";
import { BiCopy, BiHelpCircle } from "react-icons/bi";
import UserLocalContext from "../../contexts/UserLocalContext";
import ModalScript from "../../components/ModalScript";

interface ReactiveInputs {
  banner: boolean;
  brand: boolean;
  switchSelected: boolean;
  switchName: boolean;
  adminPassword: boolean;
  globalPassword: boolean;
  consolePassword: boolean;
}
interface PortConfig {
  portId: string | number;
  vlanId: string | number;
  portDesc: string;
  looping: boolean;
  connexionType: string;
  portSpeed: string | number;
  trunkMode: boolean;
}
interface VlanConfig {
  id: string | number;
  desc: string;
}
interface ReactiveForm {
  equipBrand: string;
  equipModel: string;
  switchName: string;
  globalPassword: string;
  adminPassword: string;
  encryptAdmin: boolean;
  encryptGlobal: boolean;
  vlan: Array<VlanConfig>;
  ports: Array<PortConfig>;
  managementVlan: string;
  ip: string;
  mask: string;
  gateway: string;
  banner: string;
  consolePassword: string;
}
export default function Automation() {
  const ref = useRef<null | HTMLDivElement>(null);
  const { userLocal } = useContext(UserLocalContext);
  const [modal, setModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cardClicked, setCardClicked] = useState<string | undefined>("");
  const [amountPorts, setAmountPorts] = useState<number>(0);
  const [amountVlan, setAmountVlan] = useState<number>(0);
  const [selectedPorts, setSelectedPorts] = useState(
    Array(48).fill({ configId: "", selected: false })
  );
  const [reactiveInputs, setReactiveInputs] = useState<ReactiveInputs>(
    {} as ReactiveInputs
  );
  const [amountConfig, setAmountConfig] = useState(0);
  const [configsPort, setConfigsPort] = useState<Array<PortConfig>>([]);
  const [reactiveForm, setReactiveForm] = useState<ReactiveForm>({
    equipBrand: "",
    equipModel: "",
    switchName: "",
    globalPassword: "",
    adminPassword: "",
    encryptAdmin: false,
    encryptGlobal: false,
    vlan: [],
    ports: [],
    managementVlan: "",
    ip: "",
    mask: "",
    gateway: "",
    banner: "",
    consolePassword: "",
  });
  const [script, setScript] = useState<string>("");
  const [inputsValid, setInputsValid] = useState({
    general: { error: "", valid: false },
    ip: { error: "", valid: false },
    mask: { error: "", valid: false },
    gateway: { error: "", valid: false },
    managementVlan: { error: "", valid: false },
    vlan: { error: "", valid: false },
    ports: { error: "", valid: false },
    admin: { error: "", valid: false },
    switchModel: { error: "", valid: false },
  });

  const switchModels = {
    cisco: [
      { model: "Cisco 2960-24-TC-L", ports: 24, default: true },
      { model: "Cisco C1000-48T-4G-L", ports: 48 },
    ],
    juniper: [
      { model: "Juniper EX2200-C-12T-2G", ports: 12, default: true },
      { model: "Juniper EX2200-24T-4G", ports: 24 },
      { model: "Juniper EX2200-48T-4G", ports: 48 },
    ],
    fortinet: [
      { model: "Fortinet Fortiswitch 108F", ports: 12, default: true },
      { model: "Fortinet Fortiswitch 224e", ports: 24 },
      { model: "Fortinet Fortiswitch 248d", ports: 48 },
    ],
  };
  async function createScript() {
    setIsLoading(true);
    const form = new FormData();
    form.append("equipBrand", reactiveForm.equipBrand);
    form.append("equipModel", reactiveForm.equipModel);
    form.append("switchName", reactiveForm.switchName);
    form.append("globalPassword", reactiveForm.globalPassword);
    form.append("adminPassword", reactiveForm.adminPassword);
    form.append("encryptAdmin", JSON.stringify(reactiveForm.encryptAdmin));
    form.append("encryptGlobal", JSON.stringify(reactiveForm.encryptGlobal));
    form.append("vlan", JSON.stringify(reactiveForm.vlan));
    form.append("ports", JSON.stringify(reactiveForm.ports));
    form.append("managementVlan", reactiveForm.managementVlan);
    form.append("ip", reactiveForm.ip);
    form.append("mask", reactiveForm.mask);
    form.append("gateway", reactiveForm.gateway);
    form.append("banner", reactiveForm.banner);
    form.append("consolePassword", reactiveForm.consolePassword);
    if (validateReactiveForm()) {
      var urlParam: string;
      if (userLocal.id) {
        urlParam = `createScript/${userLocal.id}`;
      } else {
        urlParam = "createScript/off";
      }
      const { data } = await api.post(urlParam, form);
      setModal(true);
      setScript(data);
    }
    setIsLoading(false);
  }

  function validateReactiveForm() {
    const inputs = { ...inputsValid };

    const switchModelValid = reactiveForm.equipModel !== "";
    inputs.switchModel.valid = switchModelValid;
    if (!switchModelValid) {
      inputs.switchModel.error = "Selecione o modelo do equipamento";
    }

    const vlanValid = () => {
      if (reactiveForm.vlan.length === 0) {
        inputs.vlan.valid = false;
        inputs.vlan.error = "Insira ao menos uma Vlan";
        return false;
      } else if (!verifyVlan()) {
        inputs.vlan.valid = false;
        inputs.vlan.error = "Preencha os campos das Vlans corretamente";
        return false;
      } else {
        inputs.vlan.valid = true;
        inputs.vlan.error = "";
        return true;
      }
    };
    vlanValid();
    const adminValid = () => {
      if (reactiveForm.equipBrand !== "Fortinet") {
        return true;
      } else {
        const admin = reactiveForm.adminPassword !== "";
        if (admin) {
          inputs.admin.valid = true;
          inputs.admin.error = "";
          return true;
        } else {
          inputs.admin.valid = false;
          inputs.admin.error =
            "Na fabricante Fortinet é obrigatório o uso da senha de administrador";
          return false;
        }
      }
    };
    adminValid();
    const portsValid = reactiveForm.ports.length > 0;
    inputs.ports.valid = portsValid;
    if (!portsValid) {
      inputs.ports.error = "Selecione ao menos uma porta para as configurações";
    }

    const managementVlanValid = reactiveForm.managementVlan !== "";
    inputs.managementVlan.valid = managementVlanValid;
    if (!managementVlanValid) {
      inputs.managementVlan.error = "Selecione a Vlan de gerência";
    }
    //25[0-5] corresponde a 250 a 255.
    //2[0-4][0-9] corresponde a 200 a 249.
    //[01]?[0-9][0-9]? corresponde a 0 a 199. O ? indica que o dígito anterior é opcional.
    //{3} repetição
    // \. é o ponto entre os 3 digitos
    const patternAddress =
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    const ipValid = patternAddress.test(reactiveForm.ip);
    inputs.ip.valid = ipValid;
    if (!ipValid) {
      inputs.ip.error = "Formato inválido de IP";
    }
    const maskValid = patternAddress.test(reactiveForm.mask);
    inputs.mask.valid = maskValid;
    if (!maskValid) {
      inputs.mask.error = "Formato inválido de mascára";
    }
    const gatewayValid = patternAddress.test(reactiveForm.gateway);
    inputs.gateway.valid = gatewayValid;
    if (!ipValid) {
      inputs.gateway.error = "Formato inválido de gateway";
    }

    if (
      switchModelValid &&
      vlanValid() &&
      adminValid() &&
      portsValid &&
      managementVlanValid &&
      ipValid &&
      maskValid &&
      gatewayValid
    ) {
      inputs.general.valid = true;
      inputs.general.error = "";
      setInputsValid(inputs);
      return true;
    } else {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      inputs.general.valid = false;
      inputs.general.error = "Verifique os campos e tente novamente";
      setInputsValid(inputs);
      return false;
    }
  }
  function verifyVlan() {
    const vlanValid = reactiveForm.vlan.some(
      (vlan) =>
        vlan.id === "" ||
        vlan.desc === "" ||
        (vlan.id as number) > 4096 ||
        (vlan.id as number) < 2
    );
    return !vlanValid;
  }
  function verifyConfig(configIndex: number) {
    const port = { ...configsPort[configIndex] };
    const configValid = Object.keys(port).every((field) => {
      if (
        field === "trunkMode" ||
        field === "portId" ||
        field === "looping" ||
        field === "portDesc"
      ) {
        return true;
      } else if (port.trunkMode) {
        if (field === "vlanId") {
          return true;
        }
      }
      return port[field as keyof PortConfig] !== "";
    });

    return configValid;
  }
  function handleReactiveInputs(input: keyof ReactiveInputs) {
    setReactiveInputs({ ...reactiveInputs, [input]: !reactiveInputs[input] });
    if (input !== "adminPassword" && input !== "globalPassword") {
      setReactiveForm({ ...reactiveForm, [input]: "" });
    } else {
      setReactiveForm({
        ...reactiveForm,
        encryptAdmin: false,
        encryptGlobal: false,
      });
    }
  }
  function handleBrand(brand: string) {
    setCardClicked(brand);

    const cleanInputs = reactiveInputs;
    cleanInputs.brand = true;
    setReactiveInputs(cleanInputs);

    setReactiveForm({ ...reactiveForm, equipBrand: brand, equipModel: "" });

    const cleanInputsValid = {
      general: { error: "", valid: false },
      ip: { error: "", valid: false },
      mask: { error: "", valid: false },
      gateway: { error: "", valid: false },
      managementVlan: { error: "", valid: false },
      vlan: { error: "", valid: false },
      ports: { error: "", valid: false },
      admin: { error: "", valid: false },
      switchModel: { error: "", valid: false },
    };
    setInputsValid(cleanInputsValid);
  }
  function handleVlan(
    type: string,
    index?: number,
    value?: string,
    field?: keyof VlanConfig
  ) {
    if (value !== undefined && index !== undefined && field !== undefined) {
      const updateVlan = {
        ...reactiveForm,
        vlan: [...reactiveForm.vlan],
      };
      if (field === "id") {
        const numberPattern = /^[0-9]*$/;
        if (numberPattern.test(value)) {
          updateVlan.vlan[index].id = value;
        }
      } else {
        updateVlan.vlan[index].desc = value;
      }

      setReactiveForm(updateVlan);
    } else {
      const vlans = reactiveForm.vlan;
      if (type === "add") {
        setAmountVlan(amountVlan + 1);
        const vlan: VlanConfig = { id: "", desc: "" };
        vlans.push(vlan);
      } else if (type === "remove") {
        setAmountVlan(amountVlan - 1);

        vlans.pop();
      } else if (type === "all") {
        setAmountVlan(0);
        vlans.splice(0);
      }

      if (amountVlan <= 1) {
        setConfigsPort([]);
        const allPorts = selectedPorts;
        const cleanPorts = allPorts.map(() => {
          return { configId: "", selected: false };
        });
        setSelectedPorts(cleanPorts);
      }

      setReactiveForm({ ...reactiveForm, vlan: vlans });
    }
  }

  function handlePortConfig(type: string) {
    const configs = [...configsPort];
    if (type === "add") {
      const newConfig: PortConfig = {
        portId: "",
        vlanId: "",
        portDesc: "",
        looping: false,
        connexionType: "",
        portSpeed: "",
        trunkMode: false,
      };
      configs.push(newConfig);
      setAmountConfig(amountConfig + 1);
    } else if (type === "remove") {
      configs.pop();
      setAmountConfig(amountConfig - 1);
    }
    setConfigsPort(configs);
  }
  function handleFormConfig(
    index: number,
    value: string | boolean,
    field: keyof PortConfig
  ) {
    const updatePortSpeed = () => {
      if (value === "half") {
        return "10";
      } else if (value === "full") {
        return "1000";
      } else {
        return "auto";
      }
    };
    const allConfigs = configsPort;
    const updateConfigs = allConfigs.map((config, configIndex) => {
      if (index === configIndex) {
        if (field === "trunkMode") {
          return {
            ...config,
            trunkMode: !config.trunkMode,
            vlanId: "",
          };
        } else if (field === "connexionType") {
          return {
            ...config,
            connexionType: value as string,
            portSpeed: updatePortSpeed(),
          };
        } else {
          return {
            ...config,
            [field]: value,
          };
        }
      }
      return config;
    });

    setConfigsPort(updateConfigs);
  }
  function handlePort(portNumber: number, configIndex: number, type: string) {
    if (type === "select") {
      const updatePort = selectedPorts.map((port, index) => {
        if (index === portNumber) {
          return { ...port, configId: configIndex, selected: true };
        }
        return port;
      });
      setSelectedPorts(updatePort);

      const scriptForm = [...reactiveForm.ports];

      const allConfigs = configsPort;
      allConfigs.map((config, index) => {
        if (index === configIndex) {
          config = { ...config, portId: portNumber + 1 };
          scriptForm.push(config);
        }
      });
      const organizePorts = scriptForm.sort(
        (a, b) => Number(a.portId) - Number(b.portId)
      );
      setReactiveForm({ ...reactiveForm, ports: organizePorts });
    } else if (type === "remove") {
      const updatePort = selectedPorts.map((port, index) => {
        if (index === portNumber) {
          return { ...port, configId: "", selected: false };
        }
        return port;
      });
      setSelectedPorts(updatePort);

      const scriptForm = [...reactiveForm.ports];
      const removePort = scriptForm.filter(
        (port) => port.portId !== portNumber + 1
      );

      setReactiveForm({ ...reactiveForm, ports: removePort });
    }
  }
  function verifySelectedPort(configIndex: number) {
    const portSelected = selectedPorts.some(
      (port) => port.configId === configIndex
    );
    return portSelected;
  }
  function handleReactiveForm(
    form: keyof ReactiveForm,
    value: string | number | Array<PortConfig | string> | boolean | undefined
  ) {
    if (
      form === "switchName" ||
      form === "globalPassword" ||
      form === "adminPassword" ||
      form === "consolePassword"
    ) {
      if (typeof value !== undefined && typeof value === "string") {
        const noSpacing = value.replace(/\s+/g, "_");
        const updateForm = { ...reactiveForm, [form]: noSpacing };
        setReactiveForm(updateForm);
      }
    } else if (form === "ip" || form === "mask" || form === "gateway") {
      if (typeof value !== undefined && typeof value === "string") {
        const numberPattern = /^[\d.]*$/;
        if (numberPattern.test(value)) {
          const updateForm = { ...reactiveForm, [form]: value };
          setReactiveForm(updateForm);
        }
      }
    } else {
      if (typeof value !== undefined) {
        const updateForm = { ...reactiveForm, [form]: value };
        setReactiveForm(updateForm);
      }
    }
  }
  function handleAmountPorts(amount: number, brand: string) {
    setAmountPorts(amount);
    setReactiveInputs({ ...reactiveInputs, switchSelected: true });

    const model = () => {
      let model;
      if (brand === "Cisco") {
        model = switchModels.cisco.find((model) => model.ports === amount);
      } else if (brand === "Juniper") {
        model = switchModels.juniper.find((model) => model.ports === amount);
      } else {
        model = switchModels.fortinet.find((model) => model.ports === amount);
      }

      return model ? model.model : "";
    };

    const allFormPorts = reactiveForm.ports;
    const cleanFormPorts = allFormPorts.filter(
      (port) => (port.portId as number) <= amount
    );
    setReactiveForm({
      ...reactiveForm,
      ports: cleanFormPorts,
      equipModel: model(),
    });
    const allPorts = selectedPorts;

    const cleanPorts = allPorts.map((port, index) => {
      if (index >= amount) {
        return { configId: "", selected: false };
      }
      return port;
    });
    setSelectedPorts(cleanPorts);
  }

  return (
    <>
      <Head>
        <title>Criar Script</title>
      </Head>
      <Menu />
      <div className={styles.automationSection}>
        <div className={styles.patch}>
          <h4>
            <Link href={"/"}>Página Inicial </Link>
            <MdArrowForwardIos /> Criar Script
          </h4>
        </div>

        <div className={styles.form}>
          <h4 className={styles.inputErrors} ref={ref}>
            {!inputsValid.general.valid && inputsValid.general.error}
          </h4>
          <h4>
            {!cardClicked
              ? "Escolha a fabricante para começar"
              : reactiveForm.equipBrand}
          </h4>
          <div className={styles.cardGroup}>
            <div
              className={`${styles.brandCard} ${
                cardClicked === "Cisco" && styles.pressed
              }`}
              onClick={() => handleBrand("Cisco")}
            >
              <SiCisco />
            </div>
            <div
              className={`${styles.brandCard} ${
                cardClicked === "Juniper" && styles.pressed
              }`}
              onClick={() => handleBrand("Juniper")}
            >
              <SiJunipernetworks />
            </div>
            <div
              className={`${styles.brandCard} ${
                cardClicked === "Fortinet" && styles.pressed
              }`}
              onClick={() => handleBrand("Fortinet")}
            >
              <label>
                <SiFortinet />
              </label>
              <span>FORTINET</span>
            </div>
          </div>

          {reactiveInputs.brand && (
            <>
              <h4>Modelo do Switch</h4>
              <div className={styles.model}>
                {cardClicked === "Cisco" && (
                  <select
                    onChange={(e) =>
                      handleAmountPorts(parseInt(e.target.value), "Cisco")
                    }
                  >
                    <option selected disabled>
                      Escolha o modelo do switch
                    </option>
                    {switchModels.cisco.map((model, index) => {
                      return (
                        <option value={model.ports} key={index}>
                          {`${model.model} (${model.ports} Portas)`}
                        </option>
                      );
                    })}
                  </select>
                )}
                {cardClicked === "Juniper" && (
                  <select
                    onChange={(e) =>
                      handleAmountPorts(parseInt(e.target.value), "Juniper")
                    }
                  >
                    <option selected disabled>
                      Escolha o modelo do switch
                    </option>
                    {switchModels.juniper.map((model, index) => {
                      return (
                        <option
                          defaultChecked={model.default}
                          value={model.ports}
                          key={index}
                        >
                          {`${model.model} (${model.ports} Portas)`}
                        </option>
                      );
                    })}
                  </select>
                )}
                {cardClicked === "Fortinet" && (
                  <select
                    onChange={(e) =>
                      handleAmountPorts(parseInt(e.target.value), "Fortinet")
                    }
                  >
                    <option selected disabled>
                      Escolha o modelo do switch
                    </option>
                    {switchModels.fortinet.map((model, index) => {
                      return (
                        <option
                          defaultChecked={model.default}
                          value={model.ports}
                          key={index}
                        >
                          {`${model.model} (${model.ports} Portas)`}
                        </option>
                      );
                    })}
                  </select>
                )}
              </div>
              <h6 className={styles.inputErrors}>
                {!inputsValid.switchModel.valid &&
                  inputsValid.switchModel.error}
              </h6>
              {reactiveInputs.switchSelected && (
                <>
                  <div className={styles.question}>
                    <h4>Deseja nomear o switch? </h4>
                    <span onClick={() => handleReactiveInputs("switchName")}>
                      {reactiveInputs.switchName ? (
                        <RiCheckboxFill />
                      ) : (
                        <RiCheckboxBlankFill />
                      )}
                    </span>
                  </div>
                  {reactiveInputs.switchName && (
                    <>
                      <h5>Nome do Switch</h5>
                      <input
                        onChange={(e) =>
                          handleReactiveForm("switchName", e.target.value)
                        }
                        maxLength={20}
                        placeholder="Máximo 20 caracteres"
                      />
                    </>
                  )}
                  {reactiveForm.equipBrand === "Cisco" && (
                    <>
                      <div className={styles.question}>
                        <h4>
                          Deseja colocar uma senha de configuração global?{" "}
                        </h4>
                        <span
                          onClick={() => handleReactiveInputs("globalPassword")}
                        >
                          {reactiveInputs.globalPassword ? (
                            <RiCheckboxFill />
                          ) : (
                            <RiCheckboxBlankFill />
                          )}
                        </span>
                      </div>

                      {reactiveInputs.globalPassword && (
                        <>
                          <h5>Senha de global</h5>
                          <input
                            onChange={(e) =>
                              handleReactiveForm(
                                "globalPassword",
                                e.target.value
                              )
                            }
                            maxLength={20}
                            placeholder="Máximo 20 caracteres"
                          />
                          <div className={styles.question}>
                            <h5>Encriptar senha global?</h5>
                            <span
                              onClick={() =>
                                handleReactiveForm(
                                  "encryptGlobal",
                                  !reactiveForm.encryptGlobal
                                )
                              }
                              style={{
                                fontSize: "1rem",
                                translate: "0 0.25rem",
                                marginLeft: "0.5rem",
                              }}
                            >
                              {reactiveForm.encryptGlobal ? (
                                <RiCheckboxFill />
                              ) : (
                                <RiCheckboxBlankFill />
                              )}
                            </span>
                          </div>
                        </>
                      )}
                    </>
                  )}
                  {reactiveForm.equipBrand !== "Fortinet" && (
                    <div className={styles.question}>
                      <h4>Sua rede possui senha de administrador? </h4>
                      <span
                        onClick={() => handleReactiveInputs("adminPassword")}
                      >
                        {reactiveInputs.adminPassword ? (
                          <RiCheckboxFill />
                        ) : (
                          <RiCheckboxBlankFill />
                        )}
                      </span>
                    </div>
                  )}

                  {reactiveInputs.adminPassword ||
                  reactiveForm.equipBrand === "Fortinet" ? (
                    <>
                      <h5>Sua senha de administrador </h5>
                      <input
                        onChange={(e) =>
                          handleReactiveForm("adminPassword", e.target.value)
                        }
                        placeholder="Insira a sua senha de administrador"
                      />
                      <h6 className={styles.inputErrors}>
                        {!inputsValid.admin.valid && inputsValid.admin.error}
                      </h6>
                      {reactiveForm.equipBrand === "Cisco" && (
                        <div className={styles.question}>
                          <h5>Encriptar senha de administrador?</h5>
                          <span
                            onClick={() =>
                              handleReactiveForm(
                                "encryptAdmin",
                                !reactiveForm.encryptAdmin
                              )
                            }
                            style={{
                              fontSize: "1rem",
                              translate: "0 0.25rem",
                              marginLeft: "0.5rem",
                            }}
                          >
                            {reactiveForm.encryptAdmin ? (
                              <RiCheckboxFill />
                            ) : (
                              <RiCheckboxBlankFill />
                            )}
                          </span>
                        </div>
                      )}
                    </>
                  ) : null}
                  <h4>Vlan</h4>
                  <h6 className={styles.inputErrors}>
                    {!inputsValid.vlan.valid && inputsValid.vlan.error}
                  </h6>
                  <h5>
                    <span
                      className={styles.addItem}
                      onClick={() => handleVlan("add")}
                      style={
                        configsPort.length > 0
                          ? { opacity: 0.5, pointerEvents: "none" }
                          : {}
                      }
                    >
                      Adicionar Vlan
                      <BsFillPlusCircleFill />
                    </span>
                  </h5>
                  {reactiveForm.vlan &&
                    reactiveForm.vlan.map((vlan, index) => {
                      return (
                        <div
                          key={index}
                          className={styles.vlanInput}
                          style={
                            configsPort.length > 0
                              ? { opacity: 0.5, pointerEvents: "none" }
                              : {}
                          }
                        >
                          {index === amountVlan - 1 && (
                            <span onClick={() => handleVlan("remove")}>
                              <AiFillMinusCircle />
                            </span>
                          )}
                          <h5>{index + 1}° Vlan </h5>
                          <div>
                            <h6>Id da Vlan</h6>
                            <input
                              value={reactiveForm.vlan[index].id}
                              onChange={(e) =>
                                handleVlan("", index, e.target.value, "id")
                              }
                              placeholder="Somente números (Valor mínimo é 2 e o máximo é 4096  )"
                              maxLength={4}
                            />
                            <h6>Descrição da Vlan</h6>
                            <input
                              onChange={(e) =>
                                handleVlan("", index, e.target.value, "desc")
                              }
                              placeholder="Máximo 20 caracteres"
                              maxLength={20}
                            />
                          </div>
                        </div>
                      );
                    })}

                  <h4>Configuração de porta</h4>
                  <h6 className={styles.inputErrors}>
                    {!inputsValid.ports.valid && inputsValid.ports.error}
                  </h6>
                  {Array.isArray(reactiveForm.vlan) &&
                  reactiveForm.vlan.length === 0 ? (
                    <h5>
                      Adicione uma vlan para poder fazer a configuração das
                      portas.
                    </h5>
                  ) : !verifyVlan() ? (
                    <h5>
                      Preencha todos os campos da seção Vlan para poder
                      adicionar uma configuração.
                    </h5>
                  ) : (
                    <h5>
                      <span
                        className={styles.addItem}
                        onClick={() => handlePortConfig("add")}
                      >
                        Adicionar configuração
                        <BsFillPlusCircleFill />
                      </span>
                    </h5>
                  )}

                  {verifyVlan() &&
                    configsPort &&
                    configsPort.map((port: PortConfig, index) => {
                      return (
                        <div
                          className={`${styles.portsConfig} ${
                            verifySelectedPort(index) && styles.portSelected
                          }`}
                          key={index}
                        >
                          {index + 1 === amountConfig && (
                            <label onClick={() => handlePortConfig("remove")}>
                              <AiFillMinusCircle />
                            </label>
                          )}

                          <h5>Configuração {index + 1}</h5>
                          <div>
                            <div className={styles.loop}>
                              <h6>Modo Trunk?</h6>
                              <span
                                onClick={() =>
                                  handleFormConfig(
                                    index,
                                    !configsPort[index].trunkMode,
                                    "trunkMode"
                                  )
                                }
                              >
                                {configsPort[index].trunkMode ? (
                                  <RiCheckboxFill />
                                ) : (
                                  <RiCheckboxBlankFill />
                                )}
                              </span>
                            </div>
                            {!port.trunkMode && (
                              <>
                                <h6>Em qual Vlan vai ficar?</h6>
                                <select
                                  onChange={(e) =>
                                    handleFormConfig(
                                      index,
                                      e.target.value,
                                      "vlanId"
                                    )
                                  }
                                >
                                  <option selected disabled>
                                    Escolha a Vlan
                                  </option>
                                  {reactiveForm.vlan.map((vlan, index) => {
                                    return (
                                      <option value={vlan.id}>
                                        {vlan.desc}
                                      </option>
                                    );
                                  })}
                                </select>
                              </>
                            )}
                          </div>

                          <div>
                            <h6>Descrição da porta (Opcional)</h6>
                            <input
                              onChange={(e) =>
                                handleFormConfig(
                                  index,
                                  e.target.value,
                                  "portDesc"
                                )
                              }
                              placeholder="Máximo 20 caracteres"
                              maxLength={20}
                            />
                          </div>

                          <div className={styles.loop}>
                            <>
                              <h6>Evitar looping na porta? </h6>
                              <span
                                onClick={() =>
                                  handleFormConfig(
                                    index,
                                    !port.looping,
                                    "looping"
                                  )
                                }
                              >
                                {port.looping ? (
                                  <RiCheckboxFill />
                                ) : (
                                  <RiCheckboxBlankFill />
                                )}
                              </span>
                            </>
                          </div>
                          <div>
                            <h6>Tipo de Conexão</h6>
                            <select
                              onChange={(e) =>
                                handleFormConfig(
                                  index,
                                  e.target.value,
                                  "connexionType"
                                )
                              }
                            >
                              <option selected disabled>
                                Escolha o tipo da conexão
                              </option>
                              <option value={"auto"}>Auto</option>
                              <option value={"half"}>Half Duplex</option>
                              <option value={"full"}>Full Duplex</option>
                            </select>
                          </div>
                          <div>
                            <h6>Velocidade da Porta</h6>
                            <select
                              value={port.portSpeed}
                              onChange={(e) =>
                                handleFormConfig(
                                  index,
                                  e.target.value,
                                  "portSpeed"
                                )
                              }
                            >
                              <option selected disabled>
                                Escolha a velocidade
                              </option>
                              <option>Auto</option>
                              <option
                                value={"10"}
                                disabled={
                                  port.connexionType !== "half" &&
                                  port.connexionType !== "auto"
                                }
                              >
                                10 mb/s
                              </option>
                              <option
                                value={"100"}
                                disabled={
                                  port.connexionType !== "half" &&
                                  port.connexionType !== "auto"
                                }
                              >
                                100 mb/s
                              </option>
                              <option
                                value={"1000"}
                                disabled={
                                  port.connexionType !== "full" &&
                                  port.connexionType !== "auto"
                                }
                              >
                                1000 mb/s
                              </option>

                              {reactiveForm.equipBrand === "Juniper" && (
                                <option
                                  value={"10000"}
                                  disabled={
                                    port.connexionType !== "full" &&
                                    port.connexionType !== "auto"
                                  }
                                >
                                  10 gb/s
                                </option>
                              )}
                            </select>
                          </div>
                          <h6>
                            {reactiveForm.equipModel !== ""
                              ? verifyConfig(index)
                                ? "Escolha as portas"
                                : "Preencha os campos para escolher as portas"
                              : "Escolha o modelo do switch"}
                          </h6>
                          <div className={styles.switchPorts}>
                            {selectedPorts.map((port, portNumber) => {
                              return (
                                <span
                                  key={portNumber}
                                  onClick={
                                    port.selected
                                      ? () =>
                                          handlePort(
                                            portNumber,
                                            index,
                                            "remove"
                                          )
                                      : () =>
                                          handlePort(
                                            portNumber,
                                            index,
                                            "select"
                                          )
                                  }
                                  style={
                                    reactiveForm.equipModel === ""
                                      ? {
                                          filter: "brightness(70%)",
                                          pointerEvents: "none",
                                        }
                                      : !verifyConfig(index)
                                      ? {
                                          filter: "brightness(70%)",
                                          pointerEvents: "none",
                                        }
                                      : portNumber + 1 > amountPorts
                                      ? {
                                          filter: "brightness(70%)",
                                          pointerEvents: "none",
                                        }
                                      : port.selected
                                      ? port.configId !== index
                                        ? {
                                            backgroundColor: "#f0ad56",
                                            filter: "brightness(70%)",
                                            pointerEvents: "none",
                                          }
                                        : { backgroundColor: "#f0ad56" }
                                      : {}
                                  }
                                >
                                  {portNumber + 1}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}

                  <h4>Vlan de gerência</h4>
                  {Array.isArray(reactiveForm.vlan) &&
                  reactiveForm.vlan.length === 0 ? (
                    <h5>
                      Adicione uma vlan para poder escolher a Vlan de gerência
                    </h5>
                  ) : verifyVlan() ? (
                    <div className={styles.generalVlan}>
                      <select
                        onChange={(e) =>
                          handleReactiveForm("managementVlan", e.target.value)
                        }
                      >
                        <option selected disabled>
                          Escolha a vlan de gerência
                        </option>
                        {reactiveForm.vlan.map((vlan) => {
                          return <option value={vlan.id}>{vlan.desc}</option>;
                        })}
                      </select>
                    </div>
                  ) : (
                    <h5>
                      Preencha todos os campos da seção Vlan para poder
                      selecionar a Vlan de gerência.
                    </h5>
                  )}
                  <h6 className={styles.inputErrors}>
                    {!inputsValid.managementVlan.valid &&
                      inputsValid.managementVlan.error}
                  </h6>
                  <h4>IP</h4>
                  <input
                    value={reactiveForm.ip}
                    onChange={(e) => handleReactiveForm("ip", e.target.value)}
                    placeholder="Insira o IP no formato (0.0.0.0)"
                    maxLength={15}
                  />
                  <h6 className={styles.inputErrors}>
                    {!inputsValid.ip.valid && inputsValid.ip.error}
                  </h6>
                  <h4>Máscara</h4>
                  <input
                    value={reactiveForm.mask}
                    onChange={(e) => handleReactiveForm("mask", e.target.value)}
                    placeholder="Insira a máscara no formato (0.0.0.0)"
                    maxLength={15}
                  />
                  <h6 className={styles.inputErrors}>
                    {!inputsValid.mask.valid && inputsValid.mask.error}
                  </h6>
                  <h4>Gateway da rede</h4>
                  <input
                    value={reactiveForm.gateway}
                    onChange={(e) =>
                      handleReactiveForm("gateway", e.target.value)
                    }
                    placeholder="Insira o gateway no formato (0.0.0.0)"
                    maxLength={15}
                  />
                  <h6 className={styles.inputErrors}>
                    {!inputsValid.gateway.valid && inputsValid.gateway.error}
                  </h6>
                  {reactiveForm.equipBrand !== "Fortinet" && (
                    <>
                      <div className={styles.question}>
                        <h4>Deseja adicionar um Banner para a rede? </h4>
                        <span onClick={() => handleReactiveInputs("banner")}>
                          {reactiveInputs.banner ? (
                            <RiCheckboxFill />
                          ) : (
                            <RiCheckboxBlankFill />
                          )}
                        </span>
                      </div>
                      {reactiveInputs.banner && (
                        <>
                          <h5>Banner da rede</h5>
                          <input
                            onChange={(e) =>
                              handleReactiveForm("banner", e.target.value)
                            }
                            placeholder="Máximo 100 caracteres"
                            maxLength={100}
                          />
                        </>
                      )}
                    </>
                  )}

                  {reactiveForm.equipBrand === "Cisco" && (
                    <>
                      <div className={styles.question}>
                        <h4>Seu console possui uma senha? </h4>
                        <span
                          onClick={() =>
                            handleReactiveInputs("consolePassword")
                          }
                        >
                          {reactiveInputs.consolePassword ? (
                            <RiCheckboxFill />
                          ) : (
                            <RiCheckboxBlankFill />
                          )}
                        </span>
                      </div>
                      {reactiveInputs.consolePassword && (
                        <>
                          <h5>Senha do console</h5>
                          <input
                            onChange={(e) =>
                              handleReactiveForm(
                                "consolePassword",
                                e.target.value
                              )
                            }
                            placeholder="Insira sua senha do console"
                          />
                        </>
                      )}
                    </>
                  )}

                  <button
                    className={`${styles.createScript} ${
                      isLoading && styles.loading
                    }`}
                    onClick={() => createScript()}
                  >
                    {isLoading ? (
                      <div className={styles.loader} />
                    ) : (
                      "Criar Script"
                    )}
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
      {modal && (
        <ModalScript
          script={script}
          equipBrand={reactiveForm.equipBrand}
          setModal={setModal}
        />
      )}

      <Footer />
    </>
  );
}
