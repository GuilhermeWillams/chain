import Link from "next/link";
import { Footer } from "../components/Footer";
import { Menu } from "../components/Menu";
import styles from "./404.module.scss";

export default function Custom404() {
  return (
    <div className={styles.section404}>
      <div className={styles.text}>
        <h1>404</h1>
        <h2>Página não encontrada</h2>
        <div>
          <p>
            Sentimos muito pelo erro, a página que você requisitou não foi
            localizada.
          </p>
          <p>Por favor volte para a página inicial.</p>
        </div>

        <Link href={"/"}>
          <button>Página inicial</button>
        </Link>
      </div>

      <img className={styles.plug} src={"/404error.png"} />
    </div>
  );
}
