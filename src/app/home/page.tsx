"use client"
import { Listbox, ListboxItem } from "@nextui-org/react";
import { Navbar } from "./_components/Navbar";
import { CurentPageKey, setCurretnPageKey } from "@/redux/sidebar.slice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { Content } from "./_components/Content";

const Page = () => {
    const dispatch: AppDispatch = useDispatch();
    const currentPageKey = useSelector((state: RootState) => state.sidebarReducer.value)
  return (
    <div>
      <Navbar />
      <div className="grid grid-cols-4 gap-6 p-6">
        <div>
          <Listbox
            aria-label="Single selection example"
            variant="flat"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={[currentPageKey]}
            onSelectionChange={(key) => {
                if (key === "all") return 
                const afterKey = Array.from(key.keys())[0]
                dispatch(setCurretnPageKey(afterKey))
            }}
          >
            <ListboxItem key={CurentPageKey.Analytics}>Thống kê</ListboxItem>
            <ListboxItem key={CurentPageKey.Users}>Quản lý người dùng</ListboxItem>
            <ListboxItem key={CurentPageKey.Toys}>Quản lý đồ chơi</ListboxItem>
            <ListboxItem key={CurentPageKey.Orders}>Quản lý đơn hàng</ListboxItem>
          </Listbox>
        </div>
        <div className="col-span-3">
            <Content/>
        </div>
      </div>
    </div>
  );
};

export default Page;
