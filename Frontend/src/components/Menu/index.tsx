import styles from "./styles.module.scss";
import { AiFillFileAdd, AiFillWechat } from "react-icons/ai";
import Link from "next/link";
import { useEffect, useState } from "react";
import ProfileMenu from "../ProfileMenu";

export function Menu() {
  return (
    <>
      <header className={styles.headerContainerLight}>
        <Link href={"/"}>
          <img src="/chainLogo.png" alt="Chain" className={styles.logoResize} />
        </Link>
        <div className={styles.menuItens}>
          <div>
            <Link href={"/forum"}>
              <h2>
                Fórum <AiFillWechat />
              </h2>
            </Link>
          </div>
          <div>
            <Link href={"/automation"}>
              <h2>
                Criar script <AiFillFileAdd />
              </h2>
            </Link>
          </div>
        </div>
      </header>
      <ProfileMenu />
    </>
  );
}
