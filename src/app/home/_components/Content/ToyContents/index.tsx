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
} from "@nextui-org/react";
import React, { useMemo } from "react";
import useSWR from "swr";
import dayjs from "dayjs";
import {
  EyeIcon,
  PencilIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";


export enum OrderStatus {
    Pending = "pending",
    Approved = "approved",
    Rejected = "rejected"
}

export interface Order {
    orderId: string
    deliveryLocation: string
    discountPercent: number
    orderDetails: Array<OrderDetail>
    hasPaid: boolean
    createdAt: Date
    note: string
    updatedAt: Date
    expectedDeliveryDate: Date,
    status: OrderStatus
}

export interface OrderDetail {
    orderDetailId: string
    orderId: string
    order: Order
    toyId: string
    quantity: number
    toy: Toy
    createdAt: Date
    updatedAt: Date
}

export interface Category {
  categoryId: string;
  name: string;
  toys: Array<Toy>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Toy {
  toyId: string;
  name: string;
  imageUrl: string;
  description: string;
  categoryId: string;
  category: Category;
  orderDetails: Array<OrderDetail>;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

interface GetToysResponseData {
  toys: Array<Toy>;
  count: number;
}

export const ToyContent = () => {
  const [page, setPage] = React.useState(0);

  const { data, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/toy/get-toys?pageNumber=${page}&pageSize=10`,
    async (url: string) => {
      const { data } = await authAxios.get<GetToysResponseData>(url);
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
    isLoading || data?.toys.length === 0 ? "loading" : "idle";

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
        <TableColumn key="avatar">Ảnh</TableColumn>
        <TableColumn key="name">Tên</TableColumn>
        <TableColumn key="category">Thể loại</TableColumn>
        <TableColumn width={"30%"} key="description">Mô tả</TableColumn>
        <TableColumn key="price">Giá</TableColumn>
        <TableColumn key="createdAt">Ngày tạo</TableColumn>
        <TableColumn key="action">Hành động</TableColumn>
      </TableHeader>
      <TableBody
        items={data?.toys ?? []}
        loadingContent={<Spinner />}
        loadingState={loadingState}
      >
        {({
          toyId,
          createdAt,
          imageUrl,
          name,
          category,
          description, 
          price
        }) => (
          <TableRow key={toyId}>
            <TableCell>
              <Image className="w-40" removeWrapper alt="image" src={imageUrl}/>
            </TableCell>
            <TableCell>
              <div className="font-semibold">{name}</div>
            </TableCell>
            <TableCell>
              <div>{category.name}</div>
            </TableCell>
            <TableCell><div className="text-justify">{description}</div></TableCell>
            <TableCell>{`${Number(price)} VND`}</TableCell>
            <TableCell>{dayjs(createdAt).format("DD/MM/YYYY")}</TableCell>
            <TableCell>
              <ButtonGroup>
                <Button color="primary" variant="light" isIconOnly>
                  <EyeIcon className="w-5 h-5" />
                </Button>
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
