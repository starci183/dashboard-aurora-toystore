"use client";
import React from "react";
import { UserContent } from "./UserContent";
import { ToyContent } from "./ToyContents";
import { OrderContent } from "./OrderContent";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { CurentPageKey } from "@/redux/sidebar.slice";

export const Content = () => {
  const selected = useSelector(
    (state: RootState) => state.sidebarReducer.value
  );

  const mapSelectedToComponent: Record<CurentPageKey, JSX.Element> = {
    [CurentPageKey.Orders]: <OrderContent />,
    [CurentPageKey.Toys]: <ToyContent />,
    [CurentPageKey.Users]: <UserContent />,
  };

  return <div>{mapSelectedToComponent[selected]}</div>;
};
