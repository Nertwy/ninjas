import { type AppType } from "next/app";

import { api } from "~/utils/api";
import 'react-toastify/dist/ReactToastify.css';
import "~/styles/globals.css";
import { ToastContainer } from "react-toastify";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
    <ToastContainer/>
      <Component {...pageProps} />
    </>
  );
};

export default api.withTRPC(MyApp);
