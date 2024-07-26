"use client";
import { authAxios } from "@/utils";
import axios from "axios";
import React from "react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import useSWR from "swr";
import { Order } from "../../ToyContents";
import dayjs from "dayjs";

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
  },
];

interface GetOrdersResponseData {
  orders: Array<Order>;
  count: number;
}

export const Chart = () => {
  const { data, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/toy/get-orders?pageNumber=${0}&pageSize=999`,
    async (url: string) => {
      const { data } = await authAxios.get<GetOrdersResponseData>(url);
      return data;
    },
    {
      keepPreviousData: true,
    }
  );

  let startDate = new Date('2024-07-15');
  const dataArray: {
    name: string
    totalAmount: number
  }[] = []

  const divisor = Math.ceil(103 / 11)
  for (let i = 0; i<11; i ++) {
    let totalAmount = 0
    for (let j = 0; j < divisor; j++) {
      totalAmount+= (data?.orders[i*divisor + j]?.orderDetails ?? []).reduce(
        (total, { toy, quantity }) =>
          total + Number(toy.price) * quantity,
        0
      )
    }

    dataArray.push({
      name: dayjs(startDate).format("MMMM D"),
      totalAmount,
    })

    startDate.setDate(startDate.getDate() + 1)
  }

  return (
      <BarChart width={670} height={400} data={dataArray}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="totalAmount" name="Tổng doanh thu (VND)" fill="#fc645f" />
      </BarChart>
  );
};
