import type { AppType } from "next/app";
import { trpc } from "../utils/trpc";
import "../styles/globals.css";
import Header from "@/components/Header";

const MyApp: AppType = ({ Component, pageProps }) => {
	return (
		<div>
			<Header />
			<Component {...pageProps} />
		</div>
	);
};
export default trpc.withTRPC(MyApp);
