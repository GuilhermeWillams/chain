import Image from "next/image";
import styles from "./styles.module.scss";
import { useContext, useState } from "react";
import { AiFillHome, AiFillWechat, AiFillFileAdd } from "react-icons/ai";
import { BsFillPersonFill } from "react-icons/bs";
import { CgLogOff } from "react-icons/cg";
import { useRouter } from "next/router";
import UserLocalContext, {
  UserLocalData,
} from "../../contexts/UserLocalContext";
import Link from "next/link";

export default function ProfileMenu() {
  const router = useRouter();
  const { userLocal, updateLocal, verifyLocal } = useContext(UserLocalContext);

  const [profileMenu, setProfileMenu] = useState(false);

  const userMenu = [
    {
      icon: BsFillPersonFill,
      type: "profile",
      desc: "Perfil",
    },
    {
      icon: AiFillHome,
      type: "home",
      desc: "Página inicial",
    },
    {
      icon: AiFillWechat,
      type: "forum",
      desc: "Fórum",
    },
    {
      icon: AiFillFileAdd,
      type: "createScript",
      desc: "Criar Script",
    },
    {
      icon: CgLogOff,
      type: "disconnect",
      desc: "Sair",
    },
  ];
  function redirect(type: string) {
    setProfileMenu(false);
    if (type === "profile") {
      router.push(`/profile/${userLocal.nickname}`);
    } else if (type === "home") {
      router.push(`/`);
    } else if (type === "disconnect") {
      const removeUser: UserLocalData = {
        createdDate: "",
        email: "",
        id: "",
        name: "",
        lastName: "",
        nickname: "",
        phone: "",
        profilePhoto: "",
        roleLevel: "",
        token: "",
        logged: false,
      };
      router.push("/");
      updateLocal("disconnect", removeUser);
    } else if (type === "forum") {
      router.push("/forum");
    } else if (type === "createScript") {
      router.push("/automation");
    }
  }
  return (
    <div className={styles.profileContainer}>
      {verifyLocal() ? (
        <>
          <Image
            src={
              userLocal.profilePhoto !== ""
                ? `data:image;base64,${userLocal.profilePhoto}`
                : "/profileTemplate.png"
            }
            onClick={() => setProfileMenu(!profileMenu)}
            width={80}
            height={80}
            style={profileMenu ? { filter: "brightness(70%)" } : {}}
            alt={"Sua foto de perfil."}
          />
          <div
            style={
              profileMenu
                ? { opacity: 1 }
                : { opacity: 0, pointerEvents: "none" }
            }
          >
            {userMenu.map((menuOption, index) => {
              return (
                <p onClick={() => redirect(menuOption.type)} key={index}>
                  <span>
                    <menuOption.icon />
                  </span>
                  {menuOption.desc}
                </p>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <Link href={"/register"}>
            <h4 className={styles.signUp}>Cadastrar</h4>
          </Link>
          <Link href={"/login"}>
            <button className={styles.signIn}>Entrar</button>
          </Link>
        </>
      )}
    </div>
  );
}
