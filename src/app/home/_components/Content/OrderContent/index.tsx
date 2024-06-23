"use client";
import { Account } from "@/redux/auth.slice";
import { authAxios } from "@/utils";
import {
  Table,
  Pagination,
  TableHeader,
  TableColumn,
  TableBody,
  Spinner,
  TableRow,
  TableCell,
  getKeyValue,
  Avatar,
  ButtonGroup,
  Image,
  Button,
  Chip,
  Snippet,
} from "@nextui-org/react";
import React, { useMemo } from "react";
import useSWR from "swr";
import dayjs from "dayjs";
import {
  CheckIcon,
  EyeIcon,
  PencilIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Order, OrderStatus } from "../ToyContents";
import { OrderView } from "./OrderView";
import { parseAbsoluteToLocal } from "@internationalized/date";

interface GetOrdersResponseData {
  orders: Array<Order>;
  count: number;
}

export const OrderContent = () => {
  const [page, setPage] = React.useState(1);

  const { data, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/toy/get-orders?pageNumber=${page-1}&pageSize=10`,
    async (url: string) => {
      const { data } = await authAxios.get<GetOrdersResponseData>(url);
      return data;
    },
    {
      keepPreviousData: true,
    }
  );

  const rowsPerPage = 10;

  const pages = useMemo(() => {
    return data?.count ? Math.ceil(data.count / rowsPerPage) : 0;
  }, [data?.count, rowsPerPage]);

  const loadingState =
    isLoading || data?.orders.length === 0 ? "loading" : "idle";

  return (
    <Table
      removeWrapper
      aria-label="Example table with client async pagination"
      bottomContent={
        pages > 0 ? (
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        ) : null
      }
    >
      <TableHeader>
        <TableColumn key="code">Mã</TableColumn>
        <TableColumn key="deliveryAddress">Địa chỉ giao hàng</TableColumn>
        <TableColumn key="deliveryDate">Ngày giao hàng dự kiến</TableColumn>
        <TableColumn key="deliveryStatus">Tình trạng</TableColumn>
        <TableColumn key="totalAmount">Tổng</TableColumn>
        <TableColumn key="creationDate">Ngày tạo</TableColumn>
        <TableColumn key="actions">Hành động</TableColumn>
      </TableHeader>
      <TableBody
        items={data?.orders ?? []}
        loadingContent={<Spinner />}
        loadingState={loadingState}
      >
        {({
          orderId,
          createdAt,
          orderDetails,
          deliveryLocation,
          hasPaid,
          status,
          expectedDeliveryDate,
        }) => (
          <TableRow key={orderId}>
            <TableCell>
              <Snippet
                classNames={{
                  base: "p-0 bg-background gap-1",
                  copyIcon: "w-5 h-5",
                }}
                hideSymbol
              >
                {" "}
                {`${orderId.slice(0, 3)}${orderId.slice(-3)}`}{" "}
              </Snippet>
            </TableCell>
            <TableCell>
              <div>{deliveryLocation}</div>
            </TableCell>
            <TableCell>
              <div>{expectedDeliveryDate ? dayjs(expectedDeliveryDate).format("DD/MM/YYYY HH:mm:ss") : dayjs().format("DD/MM/YYYY HH:mm:ss")}</div>
            </TableCell>
            <TableCell>
              {status === OrderStatus.Approved ? (
                <Chip
                  variant="flat"
                  color="success"
                  startContent={<CheckIcon className="w-3.5 h-3.5" />}
                >
                  Đã xác nhận
                </Chip>
              ) : status === OrderStatus.Rejected ? (
                <Chip
                  color="danger"
                  variant="flat"
                  startContent={<XMarkIcon className="w-3.5 h-3.5" />}
                >
                  Đã từ chối
                </Chip>
              ) : (
                <Chip
                  color="warning"
                  variant="flat"
                  startContent={<XMarkIcon className="w-3.5 h-3.5" />}
                >
                  Đang chờ duyệt
                </Chip>
              )}
            </TableCell>
            <TableCell>
              {(orderDetails ?? []).reduce(
                (total, { toy, quantity }) =>
                  total + Number(toy.price) * quantity,
                0
              )}{" "}
              VND
            </TableCell>
            <TableCell>{dayjs(createdAt).format("DD/MM/YYYY")}</TableCell>
            <TableCell>
              <ButtonGroup>
                <OrderView orderId={orderId} />
                <Button color="primary" variant="light" isIconOnly>
                  <PencilSquareIcon className="w-5 h-5" />
                </Button>
                <Button color="danger" variant="light" isIconOnly>
                  <TrashIcon className="w-5 h-5" />
                </Button>
              </ButtonGroup>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
