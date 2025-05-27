"use client";

import * as React from "react";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface Props {
	session: Session | null;
	children: React.ReactNode;
}

export const RootProvider: React.FC<Props> = ({ session, children }) => {
	const queryClient = React.useMemo(() => {
		return new QueryClient();
	}, []);
	return (
		<SessionProvider session={session}>
			<QueryClientProvider client={queryClient}>
				<HeroUIProvider>
					<ToastProvider />
					{children}
				</HeroUIProvider>
			</QueryClientProvider>
		</SessionProvider>
	)
}