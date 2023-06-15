import styles from "./styles.module.scss";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FaEye, FaTrashAlt } from "react-icons/fa";
import { SiCisco, SiJunipernetworks, SiFortinet } from "react-icons/si";
import { api } from "../../services/api";
import { VscPass } from "react-icons/vsc";
import ProfileMenu from "../ProfileMenu";
import { MdArrowLeft, MdArrowRight } from "react-icons/md";
import ModalScript from "../ModalScript";

export default function Scripts(props: any) {
  const [modal, setModal] = useState(false);
  const [script, setScript] = useState("");
  const [equipBrand, setEquipBrand] = useState("");
  const [modalDelete, setModalDelete] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [toDelete, setToDelete] = useState(null);
  const [pageData, setPageData] = useState<Array<object> | string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  useEffect(() => {
    getRecord();
  }, [pageNumber]);
  moment.locale("pt-br");

  useEffect(() => {
    getRecord();
  }, []);
  async function getRecord() {
    const { data } = await api.get(
      `userScripts/${props.userLocal.id}?pageNumber=${pageNumber}`
    );

    if (data) {
      setPageData(data.scripts);
      setMaxPage(Math.ceil(data.amountScripts / 10));
    }
  }
  function handleModal(script: string, equipBrand: string) {
    setModal(true);
    setScript(script);
    setEquipBrand(equipBrand);
  }
  function handleModalDelete(script: any, type: any, toDelete: any) {
    setModalDelete(true);
    setModalContent(script);

    setToDelete(toDelete);
  }
  async function deleteScript() {
    try {
      setModalContent("Salvando...");
      setIsSaving(true);
      const { data } = await api.delete(`deleteScript/${toDelete}`);

      getRecord();
      setIsSaving(false);
      setPageData(data.scripts);
      setModalContent("Deletado com sucesso!");
      setIsDeleted(true);
    } catch (e) {
      setModalContent(
        "Erro de servidor! Atualize a página ou tente novamente mais tarde."
      );
      setIsSaving(false);
      console.log(e);
    }
  }
  function nextPage() {
    setPageNumber(pageNumber + 1);
  }
  function previousPage() {
    setPageNumber(pageNumber - 1);
  }
  function renderPages() {
    const divs = [];

    for (let i = 1; i <= maxPage; i++) {
      divs.push(
        <p
          key={i}
          style={pageNumber === i ? { color: "#f0ad56" } : {}}
          onClick={() => setPageNumber(i)}
        >
          {i}
        </p>
      );
    }
    return divs;
  }
  function closeModal() {
    setModalDelete(false);
    setIsDeleted(false);
  }

  return (
    <>
      <div className={styles.scriptSection}>
        <ProfileMenu />
        {pageData == "" ? (
          <div className={styles.noScript}>
            <h1>Produza algum script para listar aqui.</h1>
          </div>
        ) : (
          <>
            <h1>Seus scripts</h1>
            <table>
              <thead>
                <tr>
                  <th>Número</th>
                  <th>Fabricante</th>
                  <th>Modelo</th>
                  <th>Script</th>
                  <th>Data da Criação</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {!Array.isArray(pageData)
                  ? null
                  : pageData.map((script: any, index: number) => {
                      return (
                        <tr key={script.id}>
                          <td>
                            {pageNumber > 1
                              ? index + 1 + (pageNumber - 1) * 10
                              : index + 1}
                          </td>
                          <td>
                            {script.equipBrand === "Cisco" ? (
                              <SiCisco style={{ fontSize: "3rem" }} />
                            ) : script.equipBrand === "Juniper" ? (
                              <SiJunipernetworks style={{ fontSize: "4rem" }} />
                            ) : (
                              <SiFortinet style={{ fontSize: "2rem" }} />
                            )}
                          </td>
                          <td>{script.equipModel}</td>
                          <td
                            className={styles.tdScript}
                            onClick={() =>
                              handleModal(script.script, script.equipBrand)
                            }
                          >
                            <label>{script.script}</label>
                          </td>
                          <td>
                            {moment(script.createdDate).format("L") +
                              " às " +
                              moment(script.createdDate).format("LT")}
                          </td>
                          <td>
                            <span
                              onClick={() =>
                                handleModalDelete(
                                  "Você deseja mesmo deletar este script?",
                                  "delete",
                                  script.id
                                )
                              }
                            >
                              <FaTrashAlt />
                            </span>
                            <span
                              onClick={() =>
                                handleModal(script.script, script.equipBrand)
                              }
                            >
                              <FaEye style={{ translate: "0 0.1rem" }} />
                            </span>
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
          </>
        )}
        <div className={styles.tableFooter}>
          <h5 onClick={() => previousPage()}>
            {pageNumber !== 1 && <MdArrowLeft />}
          </h5>
          <div className={styles.pagesAmount}>{renderPages()}</div>
          <h5 onClick={() => nextPage()}>
            {pageNumber !== maxPage && <MdArrowRight />}
          </h5>
        </div>

        <div
          className={styles.modalDelete}
          style={
            modalDelete ? { opacity: 1 } : { opacity: 0, pointerEvents: "none" }
          }
        >
          <div>
            {isDeleted ? (
              <AiOutlineClose
                className={styles.closeModal}
                onClick={() => closeModal()}
              />
            ) : null}

            <p>
              {isDeleted ? (
                <>
                  <span style={{ color: "#198754" }}>
                    {modalContent}
                    <VscPass
                      style={{
                        fontSize: "1.5rem",
                        marginLeft: "0.5rem",
                        translate: "0 0.3rem",
                      }}
                    />
                  </span>
                </>
              ) : (
                modalContent
              )}
            </p>
            {isSaving ? (
              <label className={styles.loader} />
            ) : !isDeleted ? (
              <>
                <button onClick={() => closeModal()}>Cancelar</button>
                <button onClick={() => deleteScript()}>Deletar</button>
              </>
            ) : null}
          </div>
        </div>
      </div>
      {modal && (
        <ModalScript
          script={script}
          equipBrand={equipBrand}
          setModal={setModal}
        />
      )}
    </>
  );
}
