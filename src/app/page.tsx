"use client";
import React, { Key, useContext, useEffect } from "react";
import {
  Tabs,
  Tab,
  Input,
  Link,
  Button,
  Card,
  CardBody,
  Spinner,
} from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { useFormik } from "formik";
import * as Yup from "yup";
import useSWRMutation from 'swr/mutation'
import axios from "axios";
import toast from "react-hot-toast";
import { RootContext } from "./root-provider";

const Page = () => {
  const [selected, setSelected] = React.useState<Key>("login");
  const dispatch: AppDispatch = useDispatch();

  const { trigger, isMutating, error, data } = useSWRMutation(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/sign-in`, async (url, { arg } : { arg: {
    email: string,
    password: string
  }}) => {
    const { data } = await axios.post(url, arg)
    localStorage.setItem("accessToken", data.jwtToken)
    return data
  })

  const { meSwr } = useContext(RootContext)!

  useEffect(() => {
    if (!error) return
    toast.error(<div className="text-sm">Sai tài khoản hoặc mật khẩu</div>)
  }, [error])

  useEffect(() => {
    if (!data) return
    const handleEffect = async () => {
      await meSwr.mutate()
    } 
    handleEffect()
  }, [data])



  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async ({ email, password }) => {
       await trigger({email, password})
    },
  });

  return (
    <div className="w-screen h-screen grid place-content-center">
      <div className="flex flex-col w-full">
        <Card className="max-w-full w-[340px] h-[400px]">
          <CardBody className="overflow-hidden">
            <Tabs
              fullWidth
              size="md"
              aria-label="Tabs form"
              selectedKey={selected as any}
              onSelectionChange={setSelected}
            >
              <Tab key="login" title="Login">
                <form
                  className="flex flex-col gap-4"
                  onSubmit={formik.handleSubmit}
                  onReset={formik.handleReset}
                >
                  <Input
                    id="email"
                    isRequired
                    label="Email"
                    placeholder="Enter your email"
                    type="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={!!(formik.touched.email && formik.errors.email)}
                    errorMessage={formik.touched.email && formik.errors.email}
                  />
                  <Input
                    id="password"
                    isRequired
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      !!(formik.touched.password && formik.errors.password)
                    }
                    errorMessage={
                      formik.touched.password && formik.errors.password
                    }
                  />
                  <p className="text-center text-small">
                    Need to create an account?{" "}
                    <Link size="sm" onPress={() => setSelected("sign-up")}>
                      Sign up
                    </Link>
                  </p>
                  <div className="flex gap-2 justify-end">
                    <Button endContent={isMutating ? <Spinner size="sm" color="default"/> : null} type="submit" fullWidth color="primary">
                      Login
                    </Button>
                  </div>
                </form>
              </Tab>
              <Tab key="sign-up" title="Sign up">
                <form className="flex flex-col gap-4 h-[300px]">
                  <Input
                    isRequired
                    label="Name"
                    placeholder="Enter your name"
                    type="password"
                  />
                  <Input
                    isRequired
                    label="Email"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Input
                    isRequired
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                  />
                  <p className="text-center text-small">
                    Already have an account?{" "}
                    <Link size="sm" onPress={() => setSelected("login")}>
                      Login
                    </Link>
                  </p>
                  <div className="flex gap-2 justify-end">
                    <Button fullWidth color="primary">
                      Sign up
                    </Button>
                  </div>
                </form>
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Page;
