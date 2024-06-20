"use client";

import { authAxios } from "@/utils";
import { EyeIcon } from "@heroicons/react/24/outline";
import {
  useDisclosure,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spacer,
  Input,
  TimeInput,
  DateInput,
  Calendar,
  DatePicker,
  Checkbox,
  Textarea,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Image,
  Spinner,
} from "@nextui-org/react";
import useSWR, { mutate } from "swr";
import { Order, OrderStatus } from "../../ToyContents";
import { useEffect, useState } from "react";
import {
  DateValue,
  fromDate,
  now,
  parseAbsoluteToLocal,
} from "@internationalized/date";
import useSWRMutation from "swr/mutation";
import toast from "react-hot-toast";

interface OrderViewProps {
  orderId: string;
}

export const OrderView = ({ orderId }: OrderViewProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { data, isLoading, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/toy/get-order/${orderId}`,
    async (url: string) => {
      const { data } = await authAxios.get<Order>(url);
      return data;
    },
    {
      keepPreviousData: true,
    }
  );

  const {
    trigger,
    isMutating,
    error,
    data: updatedData,
  } = useSWRMutation(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/toy/update-order`,
    async (
      url,
      {
        arg,
      }: {
        arg: {
          orderId: string;
          deliveryLocation?: string;
          hasPaid?: boolean;
          expectedDeliveryDate?: string;
          status?: OrderStatus;
        };
      }
    ) => {
      const { data } = await authAxios.put(url, arg);
      return data;
    }
  );

  const [editedOrder, setEditedOrder] = useState<Order | null>(null);
  useEffect(() => {
    if (!data) return;
    setEditedOrder(data);
  }, [data]);

  console.log(editedOrder);

  useEffect(() => {
    if (!updatedData) return;
    toast.success(<div className="text-sm"> Cập nhật thành công </div>);
  }, [updatedData]);
  return (
    <>
      <Button onPress={onOpen} color="primary" variant="light" isIconOnly>
        <EyeIcon className="w-5 h-5" />
      </Button>
      <Modal size="4xl" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Đơn hàng
              </ModalHeader>
              <ModalBody>
                <div className="text-sm flex">
                  <div className="w-40 font-semibold text-foreground-500">
                    Mã đơn hàng
                  </div>
                  <div>
                    {orderId.slice(0, 3)}
                    {orderId.slice(-3)}
                  </div>
                </div>

                <Spacer y={4} />
                <div className="text-sm flex items-center">
                  <div className="w-40 min-w-40 font-semibold text-foreground-500">
                    Địa chỉ giao hàng
                  </div>
                  <Input
                    onValueChange={(value) => {
                      if (!editedOrder) return;

                      setEditedOrder({
                        ...editedOrder,
                        deliveryLocation: value,
                      });
                    }}
                    value={editedOrder?.deliveryLocation}
                  />
                </div>
                <Spacer y={4} />
                <div className="text-sm flex items-center">
                  <div className="w-40 min-w-40 font-semibold text-foreground-500">
                    Thời gian giao
                  </div>
                  <DatePicker
                    label=""
                    granularity="second"
                    showMonthAndYearPickers
                    onChange={(value) => {
                      if (!editedOrder) return;
                      setEditedOrder({
                        ...editedOrder,
                        expectedDeliveryDate: value.toDate(),
                      });
                    }}
                    value={parseAbsoluteToLocal(
                      (editedOrder?.expectedDeliveryDate
                        ? new Date(editedOrder?.expectedDeliveryDate)
                        : new Date() ?? new Date()
                      ).toISOString()
                    )}
                  />
                </div>
                <Spacer y={4} />
                <div className="text-sm flex items-center">
                  <div className="w-40 min-w-40 font-semibold text-foreground-500">
                    Đã nhận thanh toán
                  </div>
                  <Checkbox
                    isSelected={editedOrder?.hasPaid}
                    onValueChange={(value) => {
                      if (!editedOrder) return;
                      setEditedOrder({
                        ...editedOrder,
                        hasPaid: !editedOrder?.hasPaid,
                      });
                    }}
                  />
                </div>
                <Spacer y={4} />
                <div className="text-sm flex items-center">
                  <div className="w-40 min-w-40 font-semibold text-foreground-500">
                    Ghi chú
                  </div>
                  <div className="text-sm text-justify">
                    {editedOrder?.note}
                  </div>
                </div>
                <Spacer y={4} />
                <div className="text-sm w-40 min-w-40 font-semibold text-foreground-500">
                  Mặt hàng
                </div>
                <Spacer y={2} />
                <Table
                  removeWrapper
                  aria-label="Example static collection table"
                >
                  <TableHeader>
                    <TableColumn>Tên đồ chơi</TableColumn>
                    <TableColumn>Số lượng</TableColumn>
                    <TableColumn>Tổng</TableColumn>
                  </TableHeader>
                  <TableBody items={editedOrder?.orderDetails ?? []}>
                    {({ toy, quantity }) => (
                      <TableRow key={toy.toyId}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Image
                              removeWrapper
                              src={toy.imageUrl}
                              className="w-20"
                            />
                            {toy.name}
                          </div>
                        </TableCell>
                        <TableCell>{quantity}</TableCell>
                        <TableCell>
                          {Number(toy.price) * quantity} VND
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <Spacer y={1} />
                <div>
                  {" "}
                  <span className=" font-semibold text-foreground-500">
                    Tổng{" "}
                  </span>
                  {(editedOrder?.orderDetails ?? []).reduce(
                    (total, { toy, quantity }) =>
                      total + Number(toy.price) * quantity,
                    0
                  )}{" "}
                  VND{" "}
                </div>
              </ModalBody>
              <ModalFooter>
                {editedOrder?.deliveryLocation === data?.deliveryLocation &&
                editedOrder?.expectedDeliveryDate ===
                  data?.expectedDeliveryDate &&
                editedOrder?.hasPaid === data?.hasPaid ? (
                  <>
                    <Button
                      variant="flat"
                      endContent={
                        isMutating ? (
                          <Spinner color="default" size="sm" />
                        ) : null
                      }
                      color="primary"
                      onPress={async () => {
                        await trigger({
                          orderId,
                          status: OrderStatus.Rejected,
                        });
                      }}
                    >
                      Từ chối
                    </Button>
                    <Button
                      color="primary"
                      endContent={
                        isMutating ? (
                          <Spinner color="default" size="sm" />
                        ) : null
                      }
                      onPress={async () => {
                        await trigger({
                          orderId,
                          status: OrderStatus.Approved,
                        });
                      }}
                    >
                      Xác nhận
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="flat"
                      color="primary"
                      onPress={() => {
                        setEditedOrder(data as Order);
                      }}
                    >
                      Xoá chỉnh sửa
                    </Button>
                    <Button
                      color="primary"
                      onPress={async () => {
                        await trigger({
                          ...editedOrder,
                          expectedDeliveryDate:
                            editedOrder?.expectedDeliveryDate.toISOString(),
                          orderId,
                        });
                        await mutate();
                      }}
                    >
                      Lưu chỉnh sửa{" "}
                    </Button>
                  </>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
