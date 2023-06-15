import styles from "./styles.module.scss";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";
import { api } from "../../services/api";
import { VscPass } from "react-icons/vsc";
import ProfileMenu from "../ProfileMenu";
import Link from "next/link";
import { sanitize } from "htmlescape";
import { MdArrowLeft, MdArrowRight, MdReportOff } from "react-icons/md";

export default function Replys(props: any) {
  const [modal, setModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalType, setModalType] = useState("");
  const [toEdit, setToEdit] = useState(null);
  const [pageData, setPageData] = useState<Array<object> | string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  useEffect(() => {
    getRecord();
  }, [pageNumber]);

  useEffect(() => {
    setPageNumber(1);
    getRecord();
  }, [props]);

  async function getRecord() {
    if (props.adm) {
      const { data } = await api.get(`reportedReplys?pageNumber=${pageNumber}`);
      if (data) {
        setPageData(data.replys);
        setMaxPage(Math.ceil(data.amountReportedReplys / 10));
      }
    } else {
      const { data } = await api.get(
        `userReplys/${props.userLocal.id}?pageNumber=${pageNumber}`
      );
      if (data) {
        setPageData(data.replys);
        setMaxPage(Math.ceil(data.amountUserReplys / 10));
      }
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
  function handleModal(post: any, toEdit: any, type: any) {
    setModal(true);
    setModalContent(post);
    setToEdit(toEdit);
    setModalType(type);
  }
  function closeModal() {
    setModal(false);
    setIsEdited(false);
  }
  async function deleteReply() {
    try {
      setModalContent("Salvando...");
      setIsSaving(true);
      const { data } = await api.delete(`deleteReply/${toEdit}`);
      getRecord();
      setIsSaving(false);
      setModalContent("Deletado com sucesso!");
      setIsEdited(true);
    } catch (e) {
      setModalContent(
        "Erro de servidor! Atualize a página ou tente novamente mais tarde."
      );
      setIsSaving(false);
      console.log(e);
    }
  }
  async function removeReport() {
    try {
      console.log(toEdit);
      setModalContent("Salvando...");
      setIsSaving(true);
      const { data } = await api.patch(`removeReportReply/${toEdit}`);
      getRecord();
      setIsSaving(false);
      setModalContent("Denúncia removida!");
      setIsEdited(true);
    } catch (e) {
      setModalContent(
        "Erro de servidor! Atualize a página ou tente novamente mais tarde."
      );
      setIsSaving(false);
      console.log(e);
    }
  }

  return (
    <div className={styles.postSection}>
      <ProfileMenu />

      {pageData == "" ? (
        <div className={styles.noReply}>
          <h1>
            {props.adm
              ? "Nenhuma denúncia feita em respostas"
              : "Responda a alguma postagem no fórum para listar aqui."}
          </h1>
        </div>
      ) : (
        <>
          <h1>{props.adm ? "Repostas denúnciadas" : "Suas respostas"}</h1>
          <table>
            <thead>
              <tr>
                <th>Resposta</th>
                <th>Data da Resposta</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {!Array.isArray(pageData)
                ? null
                : pageData.map((reply: any, index: number) => {
                    return (
                      <tr key={reply.id}>
                        <td>
                          <Link href={`/forum/post/${reply.postId}`}>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: sanitize(reply.reply),
                              }}
                            />
                          </Link>
                        </td>
                        <td>
                          {moment(reply.replyDate).format("L") +
                            " às " +
                            moment(reply.replyDate).format("LT")}
                        </td>

                        <td>
                          <span
                            onClick={() =>
                              handleModal(
                                "Você deseja mesmo deletar esta resposta?",
                                reply.id,
                                "delete"
                              )
                            }
                          >
                            <FaTrashAlt />
                          </span>
                          {props.adm && (
                            <span
                              onClick={() =>
                                handleModal(
                                  "Você deseja mesmo remover a denúncia?",
                                  reply.id,
                                  "remove"
                                )
                              }
                            >
                              <MdReportOff />
                            </span>
                          )}
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
        style={modal ? { opacity: 1 } : { opacity: 0, pointerEvents: "none" }}
      >
        <div>
          {isEdited && (
            <AiOutlineClose
              className={styles.closeModal}
              onClick={() => closeModal()}
            />
          )}

          <p>
            {isEdited ? (
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
          ) : !isEdited ? (
            <>
              <button onClick={() => closeModal()}>Cancelar</button>
              <button
                onClick={
                  modalType === "delete"
                    ? () => deleteReply()
                    : () => removeReport()
                }
              >
                {modalType === "delete" ? "Deletar" : "Remover"}
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
