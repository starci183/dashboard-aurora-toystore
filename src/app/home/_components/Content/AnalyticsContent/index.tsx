"use client";

import { authAxios } from "@/utils";
import { Card, CardBody, CardHeader, Spacer } from "@nextui-org/react";
import useSWR from "swr";
import { Chart } from "./Chart";
import PieChartNe from "./Pie";
import { UserIcon } from "@heroicons/react/24/outline";

interface GetAllCounts {
  numberOfAccounts: number;
  numberOfOrders: number;
  numberOfToys: number;
  revenue: number
}

export const AnalyticsContent = () => {
  const { data, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/account/get-all-counts`,
    async (url: string) => {
      const { data } = await authAxios.get<GetAllCounts>(url);
      return data;
    },
    {
      keepPreviousData: true,
    }
  );  

  return (
    <div>
      <div className="grid grid-cols-3 gap-6">
        <Card>
          <CardHeader className="p-4 pb-0">Tổng số người dùng</CardHeader>
          <CardBody className="p-4">
            <div className="text-4xl font-semibol">
              124
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-0">Tổng số đồ chơi</CardHeader>
          <CardBody className="p-4">
            <div className="text-4xl font-semibol">{data?.numberOfToys}</div>
          </CardBody>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-0">Tổng số đơn hàng</CardHeader>
          <CardBody className="p-4">
            <div className="text-4xl font-semibol">{data?.numberOfOrders}</div>
          </CardBody>
        </Card>
      </div>
      <Spacer y={6} />
      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardHeader className="p-4 pb-0">KPI</CardHeader>
          <CardBody className="p-4 min-h-[200px]">
            <div><span className="">Tổng số người dùng:</span> <span className="text-warning">100</span>  <span className="text-success">(Thực tế 124 - Vượt 24%)</span></div>
            <div><span className="">Tổng số đơn:</span>  <span className="text-warning">100</span> <span className="text-success">(Thực tế 103 - Vượt 3%)</span></div>
          </CardBody>
        </Card>
        <Card className="col-span-2">
          <CardHeader className="p-4 pb-0">Thống kê doanh thu</CardHeader>
          <CardBody className="p-4 min-h-[200px]">
            <div className="text-2xl text-primary">{data?.revenue} VND</div>
            <Spacer y={4}/>
            <Chart/>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
