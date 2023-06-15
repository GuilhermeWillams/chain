import styles from "./styles.module.scss";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";
import { IconContext } from "react-icons";
import moment from "moment";

export function Footer(props: any) {
  return (
    <div
      className={
        props.checked ? styles.footerContainerDark : styles.footerContainerLight
      }
    >
      <div className={styles.logo}>
        <img src="/chainLogo.png" />

        <p>Chain © {moment(Date.now()).format("YYYY")}</p>
      </div>
      <div className={styles.data}>
        <ul>
          <li>
            <label>
              <IconContext.Provider
                value={{
                  style: { margin: "auto" },
                  size: "1.2rem",
                  color: "#fff",
                }}
              >
                <FaMapMarkerAlt />
              </IconContext.Provider>
            </label>
            <p>Santana de Parnaíba - São Paulo</p>
          </li>

          <li>
            <label>
              <IconContext.Provider
                value={{
                  style: { margin: "auto" },
                  size: "1.2rem",
                  color: "#fff",
                }}
              >
                <MdAlternateEmail />
              </IconContext.Provider>
            </label>
            <p>chainsuporte@gmail.com</p>
          </li>
        </ul>
      </div>
      <div className={styles.about}>
        <h2>Sobre a Chain</h2>
        <p>
          Plataforma de auxilio e automação de configuração de equipamentos de
          redes.
        </p>
      </div>
    </div>
  );
}
