import styles from "./index.module.scss";
import { SlArrowDown } from "react-icons/sl";
import { SiCisco, SiJunipernetworks, SiFortinet } from "react-icons/si";
import { AiFillFileAdd, AiFillWechat } from "react-icons/ai";
import { BiTimer } from "react-icons/bi";
import { IconContext } from "react-icons";
import { RiSpeedFill } from "react-icons/ri";
import { ImMagicWand } from "react-icons/im";
import { useRef, useState } from "react";
import { Menu } from "../components/Menu";
import { Footer } from "../components/Footer";
import Link from "next/link";

export default function Home() {
  const ref = useRef<null | HTMLDivElement>(null);
  const ref2 = useRef<null | HTMLDivElement>(null);

  function handleClick() {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }
  function handleClick2() {
    ref2.current?.scrollIntoView({ behavior: "smooth" });
  }
  const [checked, setChecked] = useState<boolean>(false);

  return (
    <>
      <Menu />
      <div
        className={checked ? styles.indexSectionDark : styles.indexSectionLight}
      >
        <div className={styles.textHeader}>
          <h1>Automação e auxílio na configuração de switchs</h1>
          <p>
            A Chain configura os seus switchs de forma rápida, simples e
            amigável com o usuário e disponibiliza um fórum para auxiliar em
            caso de dúvidas.
          </p>
        </div>
        <img src="/networkingSymbol.png" className={styles.imageRotate} />
        <div className={styles.arrowDown} onClick={handleClick}>
          <IconContext.Provider
            value={{ color: checked ? "#E6E8EB" : "", size: "4rem" }}
          >
            <SlArrowDown />
          </IconContext.Provider>
        </div>
      </div>

      <div
        className={
          checked ? styles.secondSectionDark : styles.secondSectionLight
        }
        ref={ref}
      >
        <h1>Funcionalidades</h1>
        <div>
          <div className={styles.card}>
            <Link href={"/automation"}>
              <IconContext.Provider
                value={{ style: { marginTop: "3rem" }, size: "6rem" }}
              >
                <AiFillFileAdd />
              </IconContext.Provider>
            </Link>
            <h2>Criação</h2>
            <p>
              A Chain oferece uma <span>criação</span> de scripts de forma
              prática e simples, recebendo os dados e retornando um script
              pronto.
            </p>
          </div>
          <div className={styles.card}>
            <Link href={"/forum"}>
              <IconContext.Provider
                value={{ style: { marginTop: "3rem" }, size: "6rem" }}
              >
                <AiFillWechat />
              </IconContext.Provider>
            </Link>
            <h2>Fórum</h2>
            <p>
              A Chain oferece um <span>fórum</span> para interação com outros
              usuários, podendo tirar as suas dúvidas ou a de outros.
            </p>
          </div>
          <div className={styles.card}>
            <Link href={"/automation"}>
              <div>
                <IconContext.Provider
                  value={{
                    style: { verticalAlign: "middle", marginTop: "3rem" },
                    size: "6rem",
                  }}
                >
                  <SiCisco />
                </IconContext.Provider>
                <IconContext.Provider
                  value={{
                    style: {
                      verticalAlign: "middle",
                      margin: "3rem 2rem 0 2rem",
                    },
                    size: "6rem",
                  }}
                >
                  <SiJunipernetworks />
                </IconContext.Provider>
                <IconContext.Provider
                  value={{
                    style: { verticalAlign: "middle", marginTop: "3rem" },
                    size: "6rem",
                  }}
                >
                  <SiFortinet />
                </IconContext.Provider>
              </div>
            </Link>

            <h2>Compatibilidade</h2>
            <p>
              A Chain tem como foco <span>três</span> principais fabricantes
              para a criação de scripts, dentre elas são Cisco, Juniper e
              Fortinet
            </p>
          </div>
        </div>
        <div className={styles.arrowDown2} onClick={handleClick2}>
          <IconContext.Provider value={{ size: "4rem" }}>
            <SlArrowDown />
          </IconContext.Provider>
        </div>
      </div>

      <div
        className={checked ? styles.thirdSectionDark : styles.thirdSectionLight}
        ref={ref2}
      >
        <h1>Objetivos</h1>
        <div>
          <div className={styles.objectives}>
            <IconContext.Provider value={{ size: "8rem", color: "#ECAB55" }}>
              <BiTimer />
            </IconContext.Provider>
            <h2>Tempo</h2>
            <p>
              Ganho de tempo nas criações dos scripts, devido a praticidade da
              plataforma.
            </p>
          </div>
          <div className={styles.objectives}>
            <IconContext.Provider value={{ size: "8rem", color: "#ECAB55" }}>
              <RiSpeedFill />
            </IconContext.Provider>
            <h2>Velocidade</h2>
            <p>Com apenas alguns dados fazer seus scripts.</p>
          </div>
          <div className={styles.objectives}>
            <IconContext.Provider
              value={{
                style: { marginBottom: "1.8rem" },
                size: "6rem",
                color: "#ECAB55",
              }}
            >
              <ImMagicWand />
            </IconContext.Provider>
            <h2>Usabilidade</h2>
            <p>
              Interface interativa e prática, configuração simples e um fórum
              para poder tirar as dúvidas.
            </p>
          </div>
        </div>
      </div>
      <Footer checked={checked} />
    </>
  );
}
