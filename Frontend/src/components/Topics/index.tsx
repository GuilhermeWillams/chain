import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { api } from "../../services/api";
import Image from "next/image";
import { MdArrowLeft, MdArrowRight, MdEdit } from "react-icons/md";
import Link from "next/link";
import ProfileMenu from "../ProfileMenu";
import { CgPlayListAdd } from "react-icons/cg";
import { FaTrashAlt } from "react-icons/fa";

export default function Topics(props: any) {
  const [topics, setTopics] = useState<Array<object> | string>("");
  const [modal, setModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [inputTopic, setInputTopic] = useState("");
  const [oldTopic, setOldTopic] = useState("");
  const [idTopic, setIdTopic] = useState("");
  const [unlockButton, setUnlockButton] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  useEffect(() => {
    getRecord();
  }, [pageNumber]);

  async function getRecord() {
    const { data } = await api.get(`topics?pageNumber=${pageNumber}`);
    if (data) {
      setTopics(data.topics);
      console.log(data);
      setMaxPage(Math.ceil(data.amountTopics / 10));
    }
  }
  useEffect(() => {
    getRecord();
  }, []);
  useEffect(() => {
    validateInput();
  }, [inputTopic]);

  function validateInput() {
    setErrorMessage("");
    const valid = inputTopic.length > 0;
    setUnlockButton(valid);
    return valid;
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
  function handleModal(type: any, value: any, id: any) {
    setModalType(type);
    if (type === "Edit" || type === "Delete") {
      setInputTopic(value);
      setOldTopic(value);
      setIdTopic(id);
    }
    setErrorMessage("");
    setModal(!modal);
  }
  async function updateTopic() {
    setIsSaving(true);
    const form = new FormData();
    form.append("topic", inputTopic);
    if (inputTopic === oldTopic) {
      setErrorMessage("Modifique o tópico para editar.");
      setIsSaving(false);
    } else if (validateInput()) {
      try {
        const { data } = await api.patch(`updateTopic/${idTopic}`, form);
        getRecord();
        closeModal();
        setIsSaving(false);
      } catch (e) {
        console.log(e);
        setIsSaving(false);
        setErrorMessage("Erro de servidor.");
      }
    } else {
      setErrorMessage("Valor inválido.");
      setIsSaving(false);
    }
  }
  async function createTopic() {
    setIsSaving(true);
    const form = new FormData();
    form.append("topic", inputTopic);
    if (validateInput()) {
      try {
        const { data } = await api.post(
          `createTopic/${props.userLocal.id}`,
          form
        );
        if (data.topic) {
          setErrorMessage("Já existe este tópico, insira outro.");
          setIsSaving(false);
        } else {
          getRecord();
          closeModal();
          setIsSaving(false);
        }
      } catch (e) {
        console.log(e);
        setIsSaving(false);
        setErrorMessage("Erro de servidor.");
      }
    }
  }
  async function deleteTopic() {
    setIsSaving(true);

    try {
      const { data } = await api.delete(`deleteTopic/${idTopic}`);
      getRecord();
      closeModal();
      setIsSaving(false);
    } catch (e) {
      console.log(e);
      setIsSaving(false);
      setErrorMessage("Erro de servidor.");
    }
  }
  function closeModal() {
    setModal(false);
    setOldTopic("");
    setInputTopic("");
    setErrorMessage("");
    setIdTopic("");
  }
  return (
    <div className={styles.topicSection}>
      <ProfileMenu />
      {topics == "" ? (
        <div className={styles.noTopic}>
          <h1>Produza algum script para listar aqui.</h1>
        </div>
      ) : (
        <>
          <h1>Tópicos</h1>
          <h3 onClick={() => handleModal("Add", "", "")}>
            Adicionar tópico
            <span>
              <CgPlayListAdd />
            </span>
          </h3>
          <table>
            <thead>
              <tr>
                <th>Id</th>
                <th>Criado por</th>
                <th>Tópico</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {!Array.isArray(topics)
                ? null
                : topics.map((topic: any, index: number) => {
                    return (
                      <tr key={index}>
                        <td>{topic.id}</td>
                        <td>
                          <div>
                            <Image
                              src={
                                topic.user.profilePhoto !== ""
                                  ? `data:image;base64,${topic.user.profilePhoto}`
                                  : "/profileTemplate.png"
                              }
                              width={80}
                              height={80}
                              alt={`Foto de perfil de ${topic.user.nickname}`}
                            />
                            <label>
                              <Link href={`/profile/${topic.user.nickname}`}>
                                {topic.user.nickname}
                              </Link>
                            </label>
                          </div>
                        </td>
                        <td>
                          <label>{topic.topic}</label>
                        </td>

                        <td>
                          <span
                            onClick={() =>
                              handleModal("Edit", topic.topic, topic.id)
                            }
                          >
                            <MdEdit />
                          </span>
                          <span
                            onClick={() =>
                              handleModal("Delete", topic.topic, topic.id)
                            }
                          >
                            <FaTrashAlt />
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
        style={modal ? { opacity: 1 } : { opacity: 0, pointerEvents: "none" }}
      ></div>
      <div
        className={styles.modal}
        style={modal ? { opacity: 1 } : { opacity: 0, pointerEvents: "none" }}
      >
        <div>
          <h4 style={modalType === "Delete" ? { marginTop: "2rem" } : {}}>
            {modalType === "Edit"
              ? "Editar tópico"
              : modalType === "Add"
              ? "Novo tópico"
              : "Deletar tópico?"}
          </h4>
          {modalType !== "Delete" && (
            <input
              placeholder="Insira um novo tópico"
              onChange={(e) => setInputTopic(e.target.value)}
              value={inputTopic}
              maxLength={30}
            />
          )}

          <span
            style={
              errorMessage
                ? { opacity: 1 }
                : { opacity: 0, pointerEvents: "none" }
            }
          >
            {errorMessage}
          </span>
          <button
            onClick={() => closeModal()}
            style={
              isSaving
                ? {
                    pointerEvents: "none",
                    filter: "brightness(70%)",
                    translate: "0 -0.5rem",
                  }
                : {}
            }
          >
            Cancelar
          </button>
          {modalType === "Delete" && (
            <button
              onClick={() => deleteTopic()}
              style={
                isSaving
                  ? {
                      pointerEvents: "none",
                      filter: "brightness(70%)",
                      translate: "0 -0.5rem",
                      backgroundColor: "#d9534f",
                      marginTop: "1rem",
                    }
                  : { backgroundColor: "#d9534f", marginTop: "1rem" }
              }
            >
              Deletar
            </button>
          )}
          {modalType !== "Delete" && (
            <button
              style={
                isSaving
                  ? { pointerEvents: "none", filter: "brightness(70%)" }
                  : unlockButton
                  ? {}
                  : { filter: "brightness(80%)", pointerEvents: "none" }
              }
              onClick={
                modalType === "Edit" ? () => updateTopic() : () => createTopic()
              }
            >
              {isSaving ? (
                <label className={styles.loader} />
              ) : modalType === "Edit" ? (
                "Editar"
              ) : (
                "Adicionar"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
