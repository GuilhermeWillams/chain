import { AES } from "crypto-js";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { api } from "../../services/api";
import { useRouter } from "next/router";
import styles from "./styles.module.scss";
import { VscError, VscPass } from "react-icons/vsc";
import InputMask from "react-input-mask";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Head from "next/head";

export default function Register() {
  useEffect(() => {
    const userStorage = JSON.parse(localStorage.getItem("user") || "null");
    if (userStorage) {
      router.push("/");
    }
  }, []);

  const [hidePassword, setHidePassword] = useState(true);
  const [passwordError, setPasswordError] = useState({
    minChar: false,
    uppercaseChar: false,
    specialChar: false,
    number: false,
  });
  const [nameValid, setNameValid] = useState(false);
  const [nicknameValid, setNicknameValid] = useState(false);
  const [lastNameValid, setLastNameValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [phoneValid, setPhoneValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorNickname, setErrorNickname] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPhone, setErrorPhone] = useState(false);
  const [unlockButton, setUnlockButton] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [user, setUser] = useState({
    name: "",
    nickname: "",
    lastName: "",
    email: "",
    password: "",
    roleLevel: "",
    phone: "",
  });

  useEffect(() => {
    validateInput();
  }, [user]);

  const router = useRouter();

  async function registerUser() {
    const hashPassword = AES.encrypt(
      user.password,
      "5888527683178768"
    ).toString();
    const form = new FormData();
    form.append("name", user.name);
    form.append("nickname", user.nickname);
    form.append("lastName", user.lastName);
    form.append("email", user.email);
    form.append("password", hashPassword);
    form.append("roleLevel", user.roleLevel);
    form.append("phone", user.phone);
    if (validateInput()) {
      setIsSaving(true);
      try {
        const { data } = await api.post("createUser/", form);
        if (
          data.email === true ||
          data.nickname === true ||
          data.phone === true
        ) {
          if (data.email) {
            setErrorEmail(true);
          }
          if (data.nickname) {
            setErrorNickname(true);
          }
          if (data.phone) {
            setErrorPhone(true);
          }
          setErrorMessage("Dados já cadastrados!");
          setIsSaving(false);
        } else {
          router.push("/login");
        }
      } catch (e) {
        setIsSaving(false);
        setErrorMessage(
          "Erro de servidor, reinicie a página ou tente novamente mais tarde."
        );
      }
    }
  }
  const inputRegister = [
    {
      title: "Nome de Usuário",
      error: errorNickname,
      type: "nickname",
      placeholder: "Insira seu nome de usuário (mínimo 4 letras)",
      maxLength: 10,
      valid: nicknameValid,
    },
    {
      title: "Nome",
      type: "name",
      placeholder: "Insira seu nome",
      maxLength: 12,
      valid: nameValid,
    },
    {
      title: "Sobrenome",
      type: "lastName",
      placeholder: "Insira seu sobrenome",
      maxLength: 12,
      valid: lastNameValid,
    },
    {
      title: "Email",
      type: "email",
      error: errorEmail,
      placeholder: "Insira seu email",
      valid: emailValid,
    },
    {
      title: "Nível de cargo",
      type: "roleLevel",
      placeholder: "Insira o nivel do seu cargo",
    },
    {
      title: "Telefone",
      type: "phone",
      error: errorPhone,
      placeholder: "Insira seu telefone",
      valid: phoneValid,
    },
    {
      title: "Senha",
      type: "password",
      placeholder: "Insira uma senha",
      maxLength: 16,
      valid: passwordValid,
    },
  ];
  const roleLevelList = [
    "Estagiário",
    "Júnior",
    "Pleno",
    "Sênior",
    "Coordenador",
  ];
  const passwordRequisites = [
    {
      requisite: "Mínimo 8 caracteres",
      invalid: passwordError.minChar,
    },
    {
      requisite: "Pelo menos 1 letra maiúscula",
      invalid: passwordError.uppercaseChar,
    },
    {
      requisite: "Pelo menos 1 caracter especial (!?@., etc)",
      invalid: passwordError.specialChar,
    },
    {
      requisite: "Pelo menos 1 número",
      invalid: passwordError.number,
    },
  ];
  function handleUser(name: any, value: any) {
    setUser({ ...user, [name]: value });
  }
  function validateInput() {
    setErrorMessage("");
    setErrorEmail(false);
    setErrorNickname(false);
    setErrorPhone(false);
    const nicknameValid = () => {
      const pattern = /[!@#$%^&*(),?":{}|<>/]/;
      const hasPattern = pattern.test(user.nickname);
      const nickSizeValid = user.nickname.length >= 4;
      const valid = nickSizeValid && !hasPattern;
      setNicknameValid(valid);
      return valid;
    };

    const nameValid = () => {
      const valid = user.name !== "";
      setNameValid(valid);
      return valid;
    };
    const lastNameValid = () => {
      const valid = user.lastName !== "";
      setLastNameValid(valid);
      return valid;
    };
    const emailValid = () => {
      //  Explicação RegExp de Email
      // ^ indica o início da string.
      // [^\s@]+ representa uma sequência de um ou mais caracteres que não sejam espaços em branco ou @. Isso garante que haja pelo menos um caractere antes do símbolo @ no endereço de e-mail.
      // @ representa o próprio símbolo @ presente em todos os endereços de e-mail.
      // [^\s@]+ novamente representa uma sequência de um ou mais caracteres que não sejam espaços em branco ou @. Isso garante que haja pelo menos um caractere entre o @ e o ponto . no endereço de e-mail.
      // \. representa o próprio ponto . presente em todos os endereços de e-mail.
      // [^\s@]+ mais uma vez representa uma sequência de um ou mais caracteres que não sejam espaços em branco ou @. Isso garante que haja pelo menos um caractere após o ponto . no endereço de e-mail.
      // $ indica o final da string.
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const hasPattern = emailPattern.test(user.email);
      setEmailValid(hasPattern);

      return hasPattern;
    };
    const phoneValid = () => {
      const phone = user.phone.replace(/[_()-]/g, "");
      const valid = phone.length === 11;
      setPhoneValid(valid);

      return valid;
    };
    validatePassword();

    if (
      nicknameValid() &&
      nameValid() &&
      lastNameValid() &&
      emailValid() &&
      phoneValid() &&
      validatePassword()
    ) {
      setUnlockButton(true);
      return true;
    } else {
      setUnlockButton(false);
      return false;
    }
  }
  function validatePassword() {
    //Patterns RegExp
    const specialChar = /[!@#$%^&*(),?":{}|<>/]/;
    const uppercaseChar = /[A-Z]/;
    const numberChar = /\d/;

    const password = user.password;
    const passwordSizeValid = password.length >= 8;
    const hasUppercaseChar = uppercaseChar.test(password);
    const hasSpecialChar = specialChar.test(password);
    const hasNumberChar = numberChar.test(password);
    const passwordBlank = password === "" || password === null;
    const passwordError = {
      minChar: false,
      specialChar: false,
      uppercaseChar: false,
      number: false,
    };

    if (!passwordSizeValid || passwordBlank) {
      passwordError.minChar = true;
    }
    if (!hasSpecialChar || passwordBlank) {
      passwordError.specialChar = true;
    }
    if (!hasUppercaseChar || passwordBlank) {
      passwordError.uppercaseChar = true;
    }
    if (!hasNumberChar || passwordBlank) {
      passwordError.number = true;
    }
    setPasswordError(passwordError);

    if (
      hasSpecialChar &&
      hasUppercaseChar &&
      hasNumberChar &&
      passwordSizeValid
    ) {
      setPasswordValid(true);
      return true;
    } else {
      setPasswordValid(false);
      return false;
    }
  }
  return (
    <div className={styles.background}>
      <Head>
        <title>Cadastro</title>
      </Head>
      <div className={styles.registerContainer}>
        <Link href="/">
          <img src="/chainLogo.png" alt="Chain" className={styles.logoResize} />
        </Link>
        <div className={styles.title}>
          <h1>Faça o seu cadastro</h1>
          <h4>Nossa plataforma é gratuita</h4>
        </div>
        <div className={styles.inputsContainer}>
          {inputRegister.map((input, index) => {
            return (
              <div>
                <h5>{input.title}</h5>
                {input.type === "roleLevel" ? (
                  <select
                    onChange={(e) => handleUser(input.type, e.target.value)}
                  >
                    {roleLevelList.map((role) => {
                      return <option>{role}</option>;
                    })}
                  </select>
                ) : input.type === "phone" ? (
                  <InputMask
                    mask={"(99)99999-9999"}
                    placeholder={input.placeholder}
                    onChange={(e) => handleUser(input.type, e.target.value)}
                    style={
                      input.error
                        ? {
                            border: "1px solid #d9534f",
                            boxShadow:
                              "rgba(217, 83, 79, 0.12) 0px 2px 4px 0px, rgba(217, 83, 79, 0.32) 0px 2px 16px 0px",
                          }
                        : input.valid
                        ? {
                            border: "1px solid #198754",
                            boxShadow:
                              "rgba(25, 135, 84, 0.12) 0px 2px 4px 0px, rgba(25, 135, 84, 0.32) 0px 2px 16px 0px",
                          }
                        : {}
                    }
                  />
                ) : input.type === "password" ? (
                  <>
                    <input
                      type={hidePassword ? "password" : "text"}
                      maxLength={input.maxLength}
                      placeholder={input.placeholder}
                      style={
                        input.valid
                          ? {
                              border: "1px solid #198754",
                              boxShadow:
                                "rgba(25, 135, 84, 0.12) 0px 2px 4px 0px, rgba(25, 135, 84, 0.32) 0px 2px 16px 0px",
                            }
                          : {}
                      }
                      onChange={(e) => handleUser(input.type, e.target.value)}
                    />
                    <span
                      className={styles.hidePassword}
                      style={input.valid ? { color: "#198754" } : {}}
                      onClick={() => setHidePassword(!hidePassword)}
                    >
                      {hidePassword ? (
                        <AiOutlineEyeInvisible />
                      ) : (
                        <AiOutlineEye />
                      )}
                    </span>
                  </>
                ) : (
                  <>
                    <input
                      maxLength={input.maxLength}
                      placeholder={input.placeholder}
                      style={
                        input.error
                          ? {
                              border: "1px solid #d9534f",
                              boxShadow:
                                "rgba(217, 83, 79, 0.12) 0px 2px 4px 0px, rgba(217, 83, 79, 0.32) 0px 2px 16px 0px",
                            }
                          : input.valid
                          ? {
                              border: "1px solid #198754",
                              boxShadow:
                                "rgba(25, 135, 84, 0.12) 0px 2px 4px 0px, rgba(25, 135, 84, 0.32) 0px 2px 16px 0px",
                            }
                          : {}
                      }
                      onChange={(e) => handleUser(input.type, e.target.value)}
                    />
                    <span
                      className={styles.insideInput}
                      style={
                        input.error
                          ? { color: "#d9534f" }
                          : input.valid
                          ? { color: "#198754" }
                          : {}
                      }
                    >
                      {input.error ? (
                        <VscError />
                      ) : input.valid ? (
                        <VscPass />
                      ) : (
                        <VscError />
                      )}
                    </span>
                  </>
                )}
              </div>
            );
          })}
          <ul>
            {passwordRequisites.map((req) => {
              return (
                <li
                  style={
                    req.invalid ? { color: "#d9534f" } : { color: "#198754" }
                  }
                >
                  {req.invalid ? <VscError /> : <VscPass />}
                  {req.requisite}
                </li>
              );
            })}
          </ul>
        </div>
        <div className={styles.bottomContainer}>
          <p style={errorMessage ? { opacity: 1 } : { opacity: 0 }}>
            {errorMessage}
          </p>
          <button
            style={
              isSaving
                ? { pointerEvents: "none", filter: "brightness(80%)" }
                : unlockButton
                ? {}
                : { filter: "brightness(80%)", pointerEvents: "none" }
            }
            onClick={() => registerUser()}
          >
            {isSaving ? (
              <div className={styles.loader} />
            ) : (
              <label style={{ pointerEvents: "none" }}>Cadastrar</label>
            )}
          </button>

          <Link href="/login">
            <h5>Já possui conta? Entre por aqui.</h5>
          </Link>
        </div>
      </div>
    </div>
  );
}
