import {
  MdArrowForwardIos,
  MdArrowLeft,
  MdArrowRight,
  MdForum,
  MdPostAdd,
} from "react-icons/md";
import { Footer } from "../../components/Footer";
import { Menu } from "../../components/Menu";
import styles from "./styles.module.scss";
import Link from "next/link";
import Head from "next/head";
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import Image from "next/image";
import moment from "moment";
import "moment/locale/pt-br";
import HandlePost from "../../components/HandlePost";
import { FaSearch } from "react-icons/fa";

export default function Forum({ data }: any) {
  moment.locale("pt-br");
  const [userLocal, setUserLocal] = useState({
    token: "",
    id: "",
    name: "",
    nickname: "",
    profilePhoto: "",
  });
  const [userNull, setUserNull] = useState(false);
  const [topics, setTopics] = useState<any>("");
  const [topicId, setTopicId] = useState("all");
  const [maxPage, setMaxPage] = useState(Math.ceil(data.amountPosts / 10));
  const [pageNumber, setPageNumber] = useState(1);
  const [tablePage, setTablePage] = useState<Array<object>>(data.posts);
  const [handlePost, setHandlePost] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTitle, setSearchTitle] = useState("");
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
    getTopics();
  }, []);

  useEffect(() => {
    getTableData();
  }, [pageNumber]);

  useEffect(() => {
    getTableData();
  }, [topicId]);

  async function getTopics() {
    const { data } = await api.get("/listTopics");
    setTopics(data);
  }
  async function handleFilter(value: any) {
    setTopicId(value);
    setPageNumber(1);
  }

  function nextPage() {
    setPageNumber(pageNumber + 1);
  }
  function previousPage() {
    setPageNumber(pageNumber - 1);
  }

  async function getTableData() {
    setIsLoading(true);
    const { data } = await api.get(
      `forum/${topicId}?pageNumber=${pageNumber}&searchTitle=${searchTitle}`
    );
    setTablePage(data.posts);
    setMaxPage(Math.ceil(data.amountPosts / 10));
    setIsLoading(false);
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
  return (
    <>
      <Menu />
      <Head>
        <title>Fórum</title>
      </Head>

      {handlePost && (
        <HandlePost
          type="create"
          setHandlePost={setHandlePost}
          post={null}
          userLocalId={userLocal.id}
        />
      )}
      <div className={styles.forumSection}>
        <div className={styles.patch}>
          <h4>
            <Link href={"/"}>Página Inicial </Link>
            <MdArrowForwardIos /> Fórum
          </h4>
        </div>

        {!userNull && (
          <div
            className={styles.createPost}
            onClick={() => setHandlePost(true)}
          >
            <h4>Postar</h4> <MdPostAdd />
          </div>
        )}

        <div className={styles.filters}>
          <h5>Filtro por tópico</h5>
          <select onChange={(e) => handleFilter(e.target.value)}>
            <option value="all">Todos</option>
            {Array.isArray(topics) &&
              topics.map((topic: any) => {
                return (
                  <option value={topic.id} key={topic.id}>
                    {topic.topic}
                  </option>
                );
              })}
          </select>
          <input
            placeholder="Pesquisar"
            onChange={(e) => setSearchTitle(e.target.value)}
          />
          <FaSearch onClick={() => getTableData()} />
        </div>
        {isLoading ? (
          <div className={styles.loading}>
            <div className={styles.loader} />
          </div>
        ) : tablePage.length === 0 ? (
          <h1 className={styles.noPosts}>Nenhuma postagem realizada.</h1>
        ) : (
          <>
            <table className={styles.table}>
              <tbody>
                {tablePage.map((pageData: any) => {
                  return (
                    <tr key={pageData.id}>
                      <td>
                        <label>
                          <MdForum />
                        </label>
                      </td>
                      <td>
                        <Link href={`forum/post/${pageData.id}`}>
                          <h3>{pageData.title}</h3>
                        </Link>
                      </td>
                      <td className={styles.replyAmount}>
                        <h4>{pageData.Reply.length} </h4>
                        <p>
                          {"Resposta" +
                            (pageData.Reply.length > 1 ||
                            pageData.Reply.length === 0
                              ? "s"
                              : "")}
                        </p>
                      </td>
                      <td className={styles.userPost}>
                        <Image
                          src={
                            pageData.user.profilePhoto !== ""
                              ? `data:image;base64,${pageData.user.profilePhoto}`
                              : "/profileTemplate.png"
                          }
                          width={80}
                          height={80}
                          alt={`Foto de perfil de ${pageData.user.profilePhoto}`}
                        />
                        <p>
                          {`Por `}
                          <Link href={`/profile/${pageData.user.nickname}`}>
                            {pageData.user.nickname}
                          </Link>
                          {`, ${moment(
                            pageData.postDate
                          ).fromNow()}, em ${moment(pageData.postDate).format(
                            "L"
                          )}`}
                        </p>
                      </td>
                      <td className={styles.tableTopic}>
                        <span>{pageData.topic.topic}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className={styles.tableFooter}>
              <h5 onClick={() => previousPage()}>
                {pageNumber !== 1 && <MdArrowLeft />}
              </h5>
              <div className={styles.pagesAmount}>{renderPages()}</div>
              <h5 onClick={() => nextPage()}>
                {pageNumber !== maxPage && <MdArrowRight />}
              </h5>
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}
export async function getServerSideProps(ctx: any) {
  const { data } = await api.get(`forum/all?pageNumber=1&searchTitle=""`);

  return {
    props: {
      data,
    },
  };
}
