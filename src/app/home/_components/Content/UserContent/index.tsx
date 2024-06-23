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
  Button,
} from "@nextui-org/react";
import React, { useMemo } from "react";
import useSWR from "swr";
import dayjs from "dayjs";
import { EyeIcon, PencilIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

interface GetAccountResponseData {
  accounts: Array<Account>;
  count: number;
}

export const UserContent = () => {
  const [page, setPage] = React.useState(1);

  const { data, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/account/get-accounts?pageNumber=${page-1}&pageSize=10`,
    async (url: string) => {
      const { data } = await authAxios.get<GetAccountResponseData>(url);
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
    isLoading || data?.accounts.length === 0 ? "loading" : "idle";

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
        <TableColumn key="avatar">Hình đại diện</TableColumn>
        <TableColumn key="email">Email</TableColumn>
        <TableColumn key="name">Tên</TableColumn>
        <TableColumn key="phoneNumber">Số điện thoại</TableColumn>
        <TableColumn key="gender">Giới tính</TableColumn>
        <TableColumn key="createdAt">Ngày tạo</TableColumn>
        <TableColumn key="action">Hành động</TableColumn>
      </TableHeader>
      <TableBody
        items={data?.accounts ?? []}
        loadingContent={<Spinner />}
        loadingState={loadingState}
      >
        {({
          accountId,
          createdAt,
          avatarUrl,
          email,
          gender,
          name,
          phoneNumber,
        }) => (
          <TableRow key={accountId}>
            <TableCell>
              <Avatar src={avatarUrl} name={email} size="sm" />
            </TableCell>
            <TableCell>
              <div className="font-semibold">{email}</div>
            </TableCell>
            <TableCell>{name}</TableCell>
            <TableCell>{phoneNumber}</TableCell>
            <TableCell>{gender}</TableCell>
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
