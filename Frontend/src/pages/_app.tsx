import "../styles/globals.scss";
import type { AppProps } from "next/app";
import styles from "../styles/app.module.scss";
import Head from "next/head";
import Router from "next/router";
import NProgress from "nprogress";
import { useEffect } from "react";
import "../styles/custom-Nprogress.scss";
import { UserContextProvider } from "../contexts/UserLocalContext";

NProgress.configure({ showSpinner: false });

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Mostra a barra de progresso ao iniciar o carregamento de uma nova página
    Router.events.on("routeChangeStart", () => NProgress.start());

    // Oculta a barra de progresso quando a página termina de carregar
    Router.events.on("routeChangeComplete", () => NProgress.done());

    // Oculta a barra de progresso em caso de erro durante o carregamento da página
    Router.events.on("routeChangeError", () => NProgress.done());

    // Limpa os eventos do Router ao desmontar o componente
    return () => {
      Router.events.off("routeChangeStart", () => NProgress.start());
      Router.events.off("routeChangeComplete", () => NProgress.done());
      Router.events.off("routeChangeError", () => NProgress.done());
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <Head>
        <title>Chain</title>
      </Head>
      <main>
        <UserContextProvider>
          <Component {...pageProps} />
        </UserContextProvider>
      </main>
    </div>
  );
}
