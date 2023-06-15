import { useContext, useEffect, useRef, useState } from "react";
import { api } from "../../services/api";
import styles from "./styles.module.scss";
import Link from "next/link";
import InputMask from "react-input-mask";
import {
  BsFillPersonFill,
  BsPostcardFill,
  BsPersonBadgeFill,
  BsFillTelephoneFill,
} from "react-icons/bs";
import { FaNetworkWired } from "react-icons/fa";
import {
  MdQuestionAnswer,
  MdSettings,
  MdSave,
  MdReport,
  MdDescription,
  MdReportProblem,
  MdOutlineManageSearch,
  MdEdit,
} from "react-icons/md";
import moment from "moment";
import "moment/locale/pt-br";
import Head from "next/head";
import Image from "next/image";
import Scripts from "../../components/Scripts";
import Posts from "../../components/Posts";
import Replys from "../../components/Replys";
import Topics from "../../components/Topics";
import ProfileMenu from "../../components/ProfileMenu";
import UserLocalContext, {
  UserLocalData,
} from "../../contexts/UserLocalContext";

interface UserData {
  name: string;
  lastName: string;
  phone: string;
  roleLevel: string;
}
export default function Profile({ data }: any) {
  moment.locale("pt-br");

  const [page, setPage] = useState<string | undefined>("profile");
  const { userLocal, updateLocal } = useContext(UserLocalContext);
  const [userData, setUserData] = useState<UserData>({
    name: data.name,
    lastName: data.lastName,
    phone: data.phone,
    roleLevel: data.roleLevel,
  });

  const [editMode, setEditMode] = useState(false);
  const [tooltip, setTooltip] = useState(false);
  const [errorHide, setErrorHide] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [nameValid, setNameValid] = useState(false);
  const [lastNameValid, setLastNameValid] = useState(false);
  const [phoneValid, setPhoneValid] = useState(false);
  const [unlockButton, setUnlockButton] = useState(false);
  const [errorPhone, setErrorPhone] = useState(false);
  const [selectedFile, setSelectedFile] = useState<Blob | null>(null);
  const fileInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    validateInput();
  }, [userData]);

  const roleLevelList = [
    "Estagiário",
    "Júnior",
    "Pleno",
    "Sênior",
    "Coordenador",
  ];
  const menuOptions = [
    {
      title: "Perfil",
      type: "profile",
      icon: BsFillPersonFill,
      verify: false,
    },
    {
      title: "Scripts",
      type: "script",
      icon: MdDescription,
      verify: true,
    },
    {
      title: "Posts",
      type: "post",
      icon: BsPostcardFill,
      verify: true,
    },
    {
      title: "Respostas",
      type: "reply",
      icon: MdQuestionAnswer,
      verify: true,
    },
    {
      title: "Postagens denúnciadas",
      type: "reportPost",
      icon: MdReport,
      verify: false,
      adm: true,
    },
    {
      title: "Respostas denúnciadas",
      type: "reportReply",
      icon: MdReportProblem,
      verify: false,
      adm: true,
    },
    {
      title: "Gerenciar Tópicos",
      type: "topic",
      icon: MdOutlineManageSearch,
      verify: false,
      adm: true,
    },
  ];
  const userInfo = [
    {
      title: "Nome",
      type: "name",
      value: userData.name,
      valid: nameValid,
      placeholder: "Insira o novo nome",
      icon: BsPersonBadgeFill,
    },
    {
      title: "Sobrenome",
      type: "lastName",
      value: userData.lastName,
      valid: lastNameValid,
      placeholder: "Insira o novo sobrenome",
      icon: BsPersonBadgeFill,
    },
    {
      title: "Telefone",
      type: "phone",
      value: userData.phone,
      valid: phoneValid,
      placeholder: "Insira o novo número de celular",
      icon: BsFillTelephoneFill,
    },
    {
      title: "Nivel de Cargo",
      type: "roleLevel",
      value: userData.roleLevel,
      icon: FaNetworkWired,
    },
  ];

  function isUser() {
    const isUser = userLocal.id === data.id;
    return isUser;
  }

  function handleUser(name: any, value: any) {
    setUserData({ ...userData, [name]: value });
  }

  function handleEditMode(editMode: boolean) {
    setIsSaving(false);
    setErrorHide(true);
    setEditMode(editMode);
    setSelectedFile(null);
    setUnlockButton(false);
  }
  async function updateUser(pageData: any) {
    const isEqual = () => {
      const page = {
        name: pageData.name,
        lastName: pageData.lastName,
        phone: pageData.phone,
        roleLevel: pageData.roleLevel,
      };
      return JSON.stringify(page) === JSON.stringify(userData);
    };

    if (!isEqual()) {
      setIsSaving(true);
      const form = new FormData();
      form.append("token", userLocal.token || "");
      form.append("id", userLocal.id || "");
      form.append("name", userData.name);
      form.append("lastName", userData.lastName);
      form.append("phone", userData.phone);
      form.append("roleLevel", userData.roleLevel);
      try {
        if (validateInput()) {
          const { data } = await api.put("updateUser/", form);
          const phoneInvalid = data?.phone === true;
          const tokenInvalid = data?.token === false;
          if (tokenInvalid) {
            setErrorHide(false);
            setErrorMessage(
              "Erro de autenticação desconecte e conecte novamente."
            );
            setIsSaving(false);
          } else if (phoneInvalid) {
            setErrorHide(false);
            setErrorMessage(
              "Este número de telefone já é utilizado por outro usuário."
            );
            setErrorPhone(true);
            setIsSaving(false);
          } else {
            const userData: UserLocalData = {
              createdDate: data.createdDate,
              email: data.email,
              id: data.id,
              lastName: data.lastName,
              name: data.name,
              nickname: data.nickname,
              phone: data.phone,
              profilePhoto: data.profilePhoto,
              roleLevel: data.roleLevel,
              token: data.token,
              logged: true,
            };
            updateLocal("update", userData);
            const upUserData: UserData = {
              name: data.name,
              lastName: data.lastName,
              phone: data.phone,
              roleLevel: data.roleLevel,
            };
            setUserData(upUserData);
            handleEditMode(!editMode);
          }
        }
      } catch (e) {
        console.log(e);
        setErrorHide(false);
        setErrorMessage(
          "Erro ao se conectar com o servidor, verifique a conexão ou tente novamente mais tarde!"
        );
        setIsSaving(false);
      }
    } else {
      setErrorHide(false);
      setErrorMessage(
        "As informações estão iguais, mude alguma informação para atualizar."
      );
    }
  }
  async function updatePhoto() {
    setIsSaving(true);
    if (!selectedFile) {
      setErrorHide(false);
      setErrorMessage("Selecione algum arquivo.");
      return;
    }
    const form = new FormData();
    form.append("token", userLocal.token || "");
    form.append("photo", selectedFile);
    try {
      const { data } = await api.put(`profilePhoto/${userLocal.id}`, form);
      const userData: UserLocalData = {
        createdDate: data.createdDate,
        email: data.email,
        id: data.id,
        lastName: data.lastName,
        name: data.name,
        nickname: data.nickname,
        phone: data.phone,
        profilePhoto: data.profilePhoto,
        roleLevel: data.roleLevel,
        token: data.token,
        logged: true,
      };
      updateLocal("update", userData);
      const upUserData: UserData = {
        name: data.name,
        lastName: data.lastName,
        phone: data.phone,
        roleLevel: data.roleLevel,
      };
      setUserData(upUserData);
      handleEditMode(!editMode);
    } catch (e) {
      console.log(e);
      setErrorHide(false);
      setErrorMessage(
        "Erro ao se conectar com o servidor, verifique a conexão ou tente novamente mais tarde!"
      );
      setIsSaving(false);
    }
  }
  function handleFileInput(file: any) {
    if (!file) {
      setErrorHide(false);
      setErrorMessage("Selecione algum arquivo.");
      return;
    }

    setErrorHide(true);
    setErrorMessage("");
    const extensions = [".jpg", ".jpeg", ".png"];
    const fileExtension = file?.name
      .substring(file?.name.lastIndexOf("."))
      .toLowerCase();
    const extensionValid = extensions.includes(fileExtension);

    if (!extensionValid) {
      setErrorHide(false);
      setErrorMessage(
        "São permitidos somente arquivos nas extensões JPG, JPEG ou PNG."
      );
      return;
    }

    const maxSize = 2 * 1024 * 1024; //2 MB
    if (file?.size > maxSize) {
      setErrorHide(false);
      setErrorMessage("Somente arquivos de até 2 megabytes são permitidos.");
      return;
    }
    console.log(file);
    setSelectedFile(file);
    return;
  }
  function validateInput() {
    setErrorPhone(false);
    const phoneValid = () => {
      const phone = userData.phone.replace(/[_()-]/g, "");
      const valid = phone.length === 11;
      setPhoneValid(valid);

      return valid;
    };
    const nameValid = () => {
      const valid = userData.name !== "";
      setNameValid(valid);
      return valid;
    };
    const lastNameValid = () => {
      const valid = userData.lastName !== "";
      setLastNameValid(valid);
      return valid;
    };
    if (phoneValid() && nameValid() && lastNameValid()) {
      setUnlockButton(true);
      return true;
    } else {
      setUnlockButton(false);
      return false;
    }
  }
  function menuAdmin() {
    const menuActive = userLocal.id === data.id && data.admin;
    return menuActive;
  }

  return (
    <>
      <Head>
        <title>
          {isUser()
            ? `${userLocal.name} ${userLocal.lastName} (${userLocal.nickname})`
            : `${data.name} ${data.lastName} (${data.nickname})`}
        </title>
      </Head>
      <div className={styles.menuSection}>
        <Link href="/">
          <img src="/chainLogo.png" alt="Chain" className={styles.logoResize} />
        </Link>
        {menuOptions.map((option, index) => {
          return (
            <div
              key={index}
              style={
                option.adm && !menuAdmin()
                  ? { display: "none" }
                  : option.verify
                  ? isUser()
                    ? {}
                    : { display: "none" }
                  : {}
              }
              className={
                page === option.title ? styles.activeItem : styles.changeItem
              }
              onClick={() => setPage(option.type)}
            >
              <label>
                <option.icon />
              </label>
              <span>{option.title}</span>
            </div>
          );
        })}
      </div>
      {page === "profile" ? (
        <div className={styles.profileSection}>
          <ProfileMenu />

          <div className={styles.profilePhoto}>
            <Image
              src={
                isUser()
                  ? userLocal.profilePhoto !== ""
                    ? `data:image;base64,${userLocal.profilePhoto}`
                    : "/profileTemplate.png"
                  : data.profilePhoto !== ""
                  ? `data:image;base64,${data.profilePhoto}`
                  : "/profileTemplate.png"
              }
              width={80}
              height={80}
              alt={`Foto de perfil de ${data.name} ${data.lastName} de apelido ${data.nickname}`}
            />
            <div
              className={styles.editPhotoContainer}
              style={
                editMode
                  ? { opacity: 1 }
                  : { opacity: 0, pointerEvents: "none" }
              }
            >
              <input
                ref={fileInput}
                type="file"
                style={{ display: "none" }}
                onChange={(e) => handleFileInput(e.target.files?.[0])}
              />
              <article onClick={() => fileInput.current?.click()}>
                <MdEdit />
              </article>
            </div>
            {editMode ? (
              <div>
                {selectedFile && selectedFile.name}
                <button
                  className={styles.buttonPhoto}
                  style={
                    isSaving
                      ? { pointerEvents: "none", filter: "brightness(80%)" }
                      : selectedFile
                      ? {}
                      : { filter: "brightness(80%)", pointerEvents: "none" }
                  }
                  onClick={() => updatePhoto()}
                >
                  {isSaving ? (
                    <div className={styles.loader} style={{ translate: "0" }} />
                  ) : selectedFile ? (
                    "Atualizar foto"
                  ) : (
                    "Selecione um arquivo"
                  )}
                </button>
              </div>
            ) : (
              <div>
                {data.admin ? <span>Administrador</span> : null}
                <h3>{isUser() ? `Você (${data.nickname})` : data.nickname}</h3>
                <h5>{`Membro ${moment(
                  data.createdDate
                ).fromNow()}, entrou em ${moment(data.createdDate).format(
                  "L"
                )}`}</h5>
              </div>
            )}

            {isUser() ? (
              <label
                onMouseEnter={() => setTooltip(true)}
                onMouseLeave={() => setTooltip(false)}
                onClick={() => handleEditMode(!editMode)}
              >
                <div
                  style={tooltip ? { opacity: "1" } : { opacity: "0" }}
                  className={styles.tooltip}
                >
                  <label />
                  <span>
                    {editMode ? "Sair da configuração" : "Alterar informações"}
                  </span>
                </div>
                <MdSettings style={editMode ? { color: "#F0AD56" } : {}} />
              </label>
            ) : null}
          </div>
          <div className={styles.userInformation}>
            <h2>
              {isUser()
                ? "Suas informações"
                : `Informações de ${data.name + " " + data.lastName}`}{" "}
            </h2>
            {userInfo.map((option, index) => {
              return (
                <div key={index}>
                  <span>
                    <option.icon />
                  </span>
                  <h3>{option.title}</h3>
                  {option.type === "roleLevel" ? (
                    <select
                      value={option.value}
                      disabled={!editMode}
                      style={
                        editMode
                          ? { border: "1px solid #198754" }
                          : {
                              cursor: "default",
                              backgroundColor: "rgba(239, 239, 239, 0.3)",
                            }
                      }
                      onChange={(e) => handleUser(option.type, e.target.value)}
                    >
                      {roleLevelList.map((role, index) => {
                        return <option key={index}>{role}</option>;
                      })}
                    </select>
                  ) : option.type === "phone" ? (
                    <InputMask
                      mask={"(99)99999-9999"}
                      placeholder={option.placeholder}
                      onChange={(e) => handleUser(option.type, e.target.value)}
                      disabled={!editMode}
                      style={
                        editMode
                          ? errorPhone
                            ? {
                                border: "1px solid #d9534f",
                                boxShadow:
                                  "rgba(217, 83, 79, 0.12) 0px 2px 4px 0px, rgba(217, 83, 79, 0.32) 0px 2px 16px 0px",
                              }
                            : option.valid
                            ? {
                                border: "1px solid #198754",
                                boxShadow:
                                  "rgba(25, 135, 84, 0.12) 0px 2px 4px 0px, rgba(25, 135, 84, 0.32) 0px 2px 16px 0px",
                              }
                            : { border: "1px solid #F0AD56" }
                          : {}
                      }
                      value={option.value}
                    />
                  ) : (
                    <input
                      maxLength={16}
                      placeholder={option.placeholder}
                      onChange={(e) => handleUser(option.type, e.target.value)}
                      disabled={!editMode}
                      style={
                        editMode
                          ? option.valid
                            ? {
                                border: "1px solid #198754",
                                boxShadow:
                                  "rgba(25, 135, 84, 0.12) 0px 2px 4px 0px, rgba(25, 135, 84, 0.32) 0px 2px 16px 0px",
                              }
                            : { border: "1px solid #F0AD56" }
                          : {}
                      }
                      value={option.value}
                    />
                  )}
                </div>
              );
            })}
            <span
              className={styles.errorMessage}
              style={
                errorHide
                  ? {
                      opacity: "0",
                    }
                  : { opacity: "1" }
              }
            >
              {errorMessage}
            </span>

            <button
              style={
                editMode
                  ? !unlockButton || isSaving
                    ? { pointerEvents: "none", filter: "brightness(80%)" }
                    : { opacity: 1 }
                  : { opacity: 0, pointerEvents: "none" }
              }
              onClick={() => updateUser(data)}
            >
              {isSaving ? (
                <div className={styles.loader} />
              ) : (
                <>
                  <span>Salvar</span>
                  <MdSave />
                </>
              )}
            </button>
          </div>
        </div>
      ) : page === "script" ? (
        <Scripts userLocal={userLocal} adm={false} />
      ) : page === "post" ? (
        <Posts userLocal={userLocal} adm={false} />
      ) : page === "reply" ? (
        <Replys userLocal={userLocal} adm={false} />
      ) : page === "reportPost" ? (
        <Posts userLocal={userLocal} adm={true} />
      ) : page === "reportReply" ? (
        <Replys userLocal={userLocal} adm={true} />
      ) : page === "topic" ? (
        <Topics userLocal={userLocal} />
      ) : null}
    </>
  );
}
export async function getServerSideProps(ctx: any) {
  const { slug } = ctx.params;

  const { data } = await api.get(`profile/${slug}`);
  if (!data.code) {
    return {
      props: {
        data,
      },
    };
  } else {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }
}
