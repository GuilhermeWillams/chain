import styles from "./styles.module.scss";
import { api } from "../../services/api";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { AES } from "crypto-js";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Head from "next/head";
import UserLocalContext, {
  UserLocalData,
} from "../../contexts/UserLocalContext";

export default function Login() {
  const router = useRouter();
  const { updateLocal } = useContext(UserLocalContext);
  useEffect(() => {
    //Fazendo verificação adicional além do context, pois isso executa antes do context atualizar o estado do userLocal
    const userStorage = JSON.parse(localStorage.getItem("user") || "null");
    if (userStorage) {
      router.push("/");
    }
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function login() {
    setErrorMessage("");
    setIsLoading(true);
    const hashPassword = AES.encrypt(password, "5888527683178768").toString();
    const form = new FormData();
    form.append("email", email);
    form.append("password", hashPassword);
    if (validateInputs()) {
      const { data } = await api.post("login", form);
      console.log(data);
      if (!data.code) {
        const userDataLocal: UserLocalData = {
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
        updateLocal("login", userDataLocal);
        router.push(`/`);
      } else {
        setErrorMessage("Usuário não encontrado, verifique a senha e o email.");
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }

  function validateInputs() {
    setErrorMessage("");
    const emailValid = () => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const hasPattern = emailPattern.test(email);
      return hasPattern;
    };
    const passwordValid = password.length > 0;
    if (!emailValid() && !passwordValid) {
      setErrorMessage("Email e senha inválidos.");
      return false;
    } else if (!emailValid) {
      setErrorMessage("Email inválido.");
      return false;
    } else if (!passwordValid) {
      setErrorMessage("Senha inválida.");
      return false;
    } else {
      setErrorMessage("");
      return true;
    }
  }
  return (
    <>
      <Head>
        <title>Entrar</title>
      </Head>
      <div className={styles.loginContainer}>
        <div className={styles.inputContainer}>
          <Link href="/">
            <img
              src="/chainLogo.png"
              alt="Chain"
              className={styles.logoResize}
            />
          </Link>
          <div>
            <h1>Bem-vindo de volta!</h1>
            <h4>Insira suas informações</h4>
            <h5>Email</h5>
            <input
              type={"text"}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
            <h5>Senha</h5>
            <input
              type={hidePassword ? "password" : "text"}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
            />
            <span onClick={() => setHidePassword(!hidePassword)}>
              {hidePassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
            <label style={errorMessage ? { opacity: 1 } : { opacity: 0 }}>
              {errorMessage}
            </label>
            <button
              type={"button"}
              onClick={() => login()}
              className={isLoading ? styles.loading : undefined}
            >
              {isLoading ? <div className={styles.loader} /> : <p>Entrar</p>}
            </button>
            <Link href="/register" style={{ margin: "0 auto 0 auto" }}>
              <h5>Não possui conta? Faça o cadastro aqui.</h5>
            </Link>
          </div>
        </div>
        <div className={styles.imageContainer} />
      </div>
    </>
  );
}
