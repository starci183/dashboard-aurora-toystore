"use client";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { StoreProvider } from "@/redux/StoreProvider";
import { Toaster } from "react-hot-toast";
import { authAxios } from "@/utils";
import { createContext, useEffect } from "react";
import useSWR, { SWRResponse } from "swr";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setAuth } from "@/redux/auth.slice";
import { useRouter } from "next/navigation";
import { RootContext } from "./root-provider";

const font = Open_Sans({ subsets: ["latin"] });

const WrappedRoot = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  const meSwr = useSWR(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`,
    async (url) => {
      const { data } = await authAxios.get(url);
      return data;
    }
  );

  useEffect(() => {
    if (!meSwr.data) return;
    console.log(meSwr.data);
    dispatch(setAuth(meSwr.data));
    router.push("/home");
  }, [meSwr.data]);

  return (
    <RootContext.Provider value={{ meSwr }}>
      <html lang="en">
        <body className={font.className}>
          <NextUIProvider>
            <Toaster />
            {children}
          </NextUIProvider>
        </body>
      </html>
    </RootContext.Provider>
  );
};

const Root = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <StoreProvider>
      <WrappedRoot>{children}</WrappedRoot>
    </StoreProvider>
  );
};

export default Root;
