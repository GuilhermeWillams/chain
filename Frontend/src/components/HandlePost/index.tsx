const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import { sanitize } from "htmlescape";
import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { useRouter } from "next/router";

export default function HandlePost(props: any) {
  const router = useRouter();
  const [topics, setTopics] = useState<any>("");
  const [post, setPost] = useState({
    id: "",
    title: "",
    desc: "",
    topicId: "",
  });
  const [errorMessage, setErrorMessage] = useState({
    title: "",
    desc: "",
    topicId: "",
  });
  const [responseError, setResponseError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [userId, setUserId] = useState(props.userLocalId);
  useEffect(() => {
    if (props.post !== null) {
      const notNullPost = {
        id: props.post.id,
        title: props.post.title,
        desc: props.post.desc,
        topicId: props.post.topic.id,
      };
      setPost(notNullPost);
    }
    getTopics();
  }, []);

  async function createPost() {
    setResponseError("");
    if (validateInput()) {
      setIsSaving(true);
      const form = new FormData();

      form.append("userId", userId);
      form.append("title", post.title);
      form.append("desc", post.desc);
      form.append("topicId", post.topicId);

      const { data } = await api.post("createPost", form);
      router.push(`/forum/post/${data}`);
    } else {
      setResponseError("Verifique os valores dos campos.");
    }
  }
  async function updatePost() {
    setResponseError("");
    const isEqual = () => {
      const equal =
        post.id === props.post.id &&
        post.title === props.post.title &&
        post.topicId === props.post.topic.id &&
        cleanHtml(post.desc) === cleanHtml(props.post.desc);
      return equal;
    };
    if (isEqual()) {
      setResponseError("Altere algum valor para editar.");
    } else {
      if (validateInput()) {
        setIsSaving(true);
        const form = new FormData();
        form.append("title", post.title);
        form.append("desc", post.desc);
        form.append("topicId", post.topicId);
        const { data } = await api.put(`editPost/${post.id}`, form);
        props.refreshPost();
        props.setHandlePost(false);
        setIsSaving(false);
      } else {
        setResponseError("Verifique os valores dos campos.");
      }
    }
  }
  async function getTopics() {
    const { data } = await api.get("/listTopics");
    setTopics(data);
  }
  function handlePost(name: any, value: any) {
    setPost({ ...post, [name]: value });
  }
  function handleTextBox(text: any) {
    handlePost("desc", text);
  }
  function validateInput() {
    setResponseError("");
    const errorHandle = { title: "", desc: "", topicId: "" };
    setErrorMessage(errorHandle);
    const titleValid = () => {
      const valid = post.title.length > 0;
      return valid;
    };
    if (!titleValid()) {
      errorHandle.title = "Título não pode ser vazio!";
    }

    const descValid = () => {
      const valid = cleanHtml(post.desc).length > 0;
      return valid;
    };
    if (!descValid()) {
      errorHandle.desc = "Descrição não pode ser vazia!";
    }

    const topicValid = () => {
      const valid = post.topicId !== "";
      return valid;
    };

    if (!topicValid()) {
      errorHandle.topicId = "Escolha alguma opção!";
    }
    setErrorMessage(errorHandle);
    if (titleValid() && descValid() && topicValid()) {
      return true;
    } else {
      return false;
    }
  }
  function cleanHtml(html: any) {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }
  return (
    <div className={styles.handlePostBackground}>
      <div className={styles.handlePostSection}>
        <h2>{props.type === "edit" ? "Editar post" : "Criar Post"}</h2>
        <div>
          <h4>Título</h4>
          <input
            value={post.title}
            maxLength={30}
            placeholder="Título (Máximo de 30 caracteres.)"
            onChange={(e) => handlePost("title", e.target.value)}
          />
          {errorMessage.title !== "" && <label>{errorMessage.title}</label>}
        </div>
        <div>
          <h4>Descrição</h4>
          <ReactQuill
            theme="snow"
            value={post.desc}
            className={styles.quill}
            onChange={handleTextBox}
          />
          {errorMessage.desc && <label>{errorMessage.desc}</label>}
        </div>
        <div>
          <h4>Tópicos</h4>
          <select
            value={post.topicId}
            onChange={(e) => handlePost("topicId", e.target.value)}
          >
            <option value={""} selected>
              Selecione um tópico
            </option>
            {Array.isArray(topics) &&
              topics.map((topic) => {
                return <option value={topic.id}>{topic.topic}</option>;
              })}
          </select>
          {errorMessage.topicId && <label>{errorMessage.topicId}</label>}
        </div>
        <span style={{ color: "#d9534f", margin: "auto" }}>
          {responseError && responseError}
        </span>
        <div className={styles.buttons}>
          <button
            onClick={() => props.setHandlePost(false)}
            style={
              isSaving
                ? { filter: "brightness(70%)", pointerEvents: "none" }
                : {}
            }
          >
            Cancelar
          </button>
          {props.type === "edit" ? (
            <button
              onClick={() => updatePost()}
              style={
                isSaving
                  ? { filter: "brightness(70%)", pointerEvents: "none" }
                  : {}
              }
            >
              {isSaving ? <div className={styles.loader} /> : "Editar"}
            </button>
          ) : (
            <button
              onClick={() => createPost()}
              style={
                isSaving
                  ? { filter: "brightness(70%)", pointerEvents: "none" }
                  : {}
              }
            >
              {isSaving ? <div className={styles.loader} /> : "Postar"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
