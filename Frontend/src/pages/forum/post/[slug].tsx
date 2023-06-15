import Head from "next/head";
import { Footer } from "../../../components/Footer";
import { Menu } from "../../../components/Menu";
import { api } from "../../../services/api";
import styles from "./styles.module.scss";
import moment from "moment";
import "moment/locale/pt-br";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  MdArrowForwardIos,
  MdChat,
  MdClose,
  MdEditNote,
  MdReportProblem,
  MdSend,
} from "react-icons/md";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import { sanitize } from "htmlescape";
import HandlePost from "../../../components/HandlePost";

export default function Post({ data }: any) {
  const ref = useRef<null | HTMLDivElement>(null);

  moment.locale("pt-br");
  const [userLocal, setUserLocal] = useState({
    token: "",
    id: "",
    name: "",
    nickname: "",
    profilePhoto: "",
  });
  const [unlockReply, setUnlockReply] = useState(false);
  const [replyBox, setReplyBox] = useState(false);
  const [reply, setReply] = useState("");
  const [userNull, setUserNull] = useState(false);
  const [post, setPost] = useState(data);
  const [isSaving, setIsSaving] = useState(false);
  const [reported, setReported] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [reportId, setReportId] = useState("");
  const [handlePost, setHandlePost] = useState(false);
  const [userReply, setUserReply] = useState("");
  useEffect(() => {
    validateReply();
  }, [reply]);

  useEffect(() => {
    const userStorage = JSON.parse(localStorage.getItem("user") || "null");
    if (userStorage !== null) {
      const userDataLocal = {
        token: userStorage.token,
        id: userStorage.id,
        name: userStorage.name,
        nickname: userStorage.nickname,
        profilePhoto: userStorage.profilePhoto,
      };
      setUserLocal(userDataLocal);
    } else {
      setUserNull(true);
    }
  }, []);
  function isUser() {
    const isUser = userLocal.nickname === data.user.nickname;
    return isUser;
  }
  function handleModal(id: any, type: string) {
    setModal(!modal);
    setIsSaving(false);
    setReportId(id);
    setReported(false);
    setModalType(type);
  }

  async function createReply() {
    setIsSaving(true);
    const form = new FormData();
    form.append("reply", reply);
    form.append("postId", post.id);
    form.append("userId", userLocal.id);
    const { data } = await api.post("reply", form);
    setUserReply(data);
    refreshPost();
    closeReplyBox();
    setIsSaving(false);
    scrollToReply();
  }
  function scrollToReply() {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }
  async function reportPost() {
    setIsSaving(true);
    const { data } = await api.patch(`reportPost/${reportId}`);
    setIsSaving(false);
    if (data.code === 200) {
      setReported(true);
    }
  }
  async function reportReply() {
    setIsSaving(true);
    const { data } = await api.patch(`reportReply/${reportId}`);
    setIsSaving(false);
    if (data.code === 200) {
      setReported(true);
    }
  }
  async function refreshPost() {
    const { data } = await api.get(`post/${post.id}`);
    setPost(data);
  }

  function validateReply() {
    const cleanHtml = (html: any) => {
      const tmp = document.createElement("div");
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || "";
    };
    const cleanString = cleanHtml(reply);
    const valid = cleanString.length > 0;
    setUnlockReply(valid);
    return valid;
  }
  function closeReplyBox() {
    setReplyBox(!replyBox);
    setReply("<p><br></p>");
    setUnlockReply(false);
    setIsSaving(false);
  }
  return (
    <>
      <Head>
        <title>{`${post.title} | ${post.topic.topic}`}</title>
      </Head>
      {handlePost && (
        <HandlePost
          type="edit"
          setHandlePost={setHandlePost}
          post={post}
          refreshPost={refreshPost}
        />
      )}
      <Menu />
      <div className={styles.postSection}>
        <div className={styles.patch}>
          <h4>
            <Link href={"/"}>Página Inicial </Link>
            <MdArrowForwardIos />
            <Link href={"/forum"}> Fórum</Link> <MdArrowForwardIos />
            {post.title}
          </h4>
        </div>
        <div className={styles.post}>
          <div className={styles.userPost}>
            <Image
              src={
                post.user.profilePhoto !== ""
                  ? `data:image;base64,${post.user.profilePhoto}`
                  : "/profileTemplate.png"
              }
              width={80}
              height={80}
              alt={`Foto de perfil de ${post.user.nickname}`}
            />
            <Link href={`/profile/${post.user.nickname}`}>
              {post.user.nickname}
            </Link>
            <p>{`Membro ${moment(post.user.createdDate).fromNow()}`}</p>
          </div>

          <div className={styles.postContent}>
            <h1>{post.title}</h1>
            <p className={styles.publishedOn}>
              {`Publicado ${moment(post.postDate).fromNow()}, em ${moment(
                post.postDate
              ).format("L")}`}
              {post.lastEdit !== post.postDate &&
                ` - Editado ${moment(post.lastEdit).fromNow()}`}
            </p>
            <label>{post.topic.topic}</label>
            <div
              className={styles.postDesc}
              dangerouslySetInnerHTML={{ __html: sanitize(post.desc) }}
            />
          </div>
          <span>
            {userNull ? null : isUser() ? (
              <MdEditNote onClick={() => setHandlePost(true)} />
            ) : (
              <MdReportProblem onClick={() => handleModal(post.id, "post")} />
            )}
          </span>
        </div>
        {!userNull && (
          <>
            <div className={styles.makeReply}>
              <div className={styles.replyBox}>
                <Image
                  src={
                    userLocal.profilePhoto !== ""
                      ? `data:image;base64,${userLocal.profilePhoto}`
                      : "/profileTemplate.png"
                  }
                  width={80}
                  height={80}
                  alt={`Foto de perfil de ${post.user.nickname}`}
                />

                {replyBox ? (
                  <>
                    <ReactQuill
                      theme="snow"
                      value={reply}
                      onChange={setReply}
                      className={styles.quill}
                    />
                    <div className={styles.extraActions}>
                      <span onClick={() => closeReplyBox()}>
                        <MdClose />
                      </span>
                      <span
                        style={
                          isSaving
                            ? { pointerEvents: "none" }
                            : unlockReply
                            ? {}
                            : {
                                opacity: 0.2,
                                pointerEvents: "none",
                              }
                        }
                        onClick={() => createReply()}
                      >
                        {isSaving ? (
                          <div className={styles.miniLoader} />
                        ) : (
                          <MdSend />
                        )}
                      </span>
                    </div>
                  </>
                ) : (
                  <label onClick={() => setReplyBox(!replyBox)}>
                    Responder
                    <MdChat />
                  </label>
                )}
              </div>
            </div>
          </>
        )}
        <div className={styles.amountReply}>
          <h2>
            {post.Reply.length +
              " Resposta" +
              (post.Reply.length > 1 || post.Reply.length === 0 ? "s" : "")}
          </h2>
        </div>

        {Array.isArray(post.Reply)
          ? post.Reply.map((reply: any) => {
              return (
                <div
                  className={styles.replys}
                  key={reply.id}
                  ref={reply.id === userReply ? ref : null}
                >
                  <div className={styles.userReply}>
                    <Image
                      src={
                        reply.user.profilePhoto !== ""
                          ? `data:image;base64,${reply.user.profilePhoto}`
                          : "/profileTemplate.png"
                      }
                      width={80}
                      height={80}
                      alt={`Foto de perfil de ${reply.user.nickname}`}
                    />
                    <Link href={`/profile/${reply.user.nickname}`}>
                      {reply.user.nickname}
                    </Link>
                    <p>{`Membro ${moment(
                      reply.user.createdDate
                    ).fromNow()}`}</p>
                  </div>
                  <div className={styles.replyContent}>
                    <p className={styles.publishedOn}>{`Resposta feita ${moment(
                      reply.replyDate
                    ).fromNow()}, em ${moment(reply.replyDate).format(
                      "L"
                    )}`}</p>
                    <div
                      className={styles.replyDesc}
                      dangerouslySetInnerHTML={{
                        __html: sanitize(reply.reply),
                      }}
                    />
                  </div>

                  <span>
                    {userNull ? null : reply.user.nickname ===
                      userLocal.nickname ? null : (
                      <MdReportProblem
                        onClick={() => handleModal(reply.id, "reply")}
                      />
                    )}
                  </span>
                </div>
              );
            })
          : ""}
      </div>
      <Footer />
      <div
        className={styles.modal}
        style={modal ? { opacity: 1 } : { opacity: 0, pointerEvents: "none" }}
      >
        <div className={styles.modalContainer}>
          {reported && <MdClose onClick={() => handleModal("", "")} />}

          <h4 style={reported ? { color: "#198754" } : { marginTop: "3rem" }}>
            {reported
              ? "Reportado com sucesso!"
              : modalType === "post"
              ? "Tem certeza que deseja reportar este post?"
              : "Tem certeza que deseja reportar esta resposta?"}
          </h4>
          {!reported && (
            <div>
              <button onClick={() => handleModal("", "")}>Cancelar</button>
              <button
                onClick={
                  modalType === "post"
                    ? () => reportPost()
                    : () => reportReply()
                }
                style={
                  isSaving
                    ? {
                        filter: "brightness(70%)",
                        pointerEvents: "none",
                        translate: "0 0.5rem",
                      }
                    : {}
                }
              >
                {isSaving ? <div className={styles.loader} /> : "Reportar"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(ctx: any) {
  const { slug } = ctx.params;

  const { data } = await api.get(`post/${slug}`);
  if (!data.code) {
    return {
      props: {
        data,
      },
    };
  } else {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }
}
