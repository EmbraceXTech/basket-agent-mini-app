import type { JSX } from "react";

import { IndexPage } from "@/pages/TestPage/IndexPage";
import { InitDataPage } from "@/pages/TestPage/InitDataPage";
import { LaunchParamsPage } from "@/pages/TestPage/LaunchParamsPage";
import { ThemeParamsPage } from "@/pages/TestPage/ThemeParamsPage";
import MainPage from "@/pages/MainPage";
import CreatePage from "@/pages/CreatePage";
import ManagePage from "@/pages/ManagePage";
import AssetPage from "@/pages/AssetPage";
import DepositPage from "@/pages/ManagePage/DepositPage";

interface Route {
  path: string;
  element: React.ReactNode;
  title?: string;
  icon?: JSX.Element;
}

export const routes: Route[] = [
  {
    path: "/",
    element: <MainPage />,
  },
  {
    path: "/create",
    element: <CreatePage />,
  },
  {
    path: "/manage/:id/deposit",
    element: <DepositPage />,
  },
  {
    path: "/manage/:id",
    element: <ManagePage />,
  },
  {
    path: "/assets/:id",
    element: <AssetPage />,
  },
  {
    path: "/test/index",
    element: <IndexPage />,
  },
  {
    path: "/test/init-data",
    element: <InitDataPage />,
    title: "Init Data",
  },
  {
    path: "/test/theme-params",
    element: <ThemeParamsPage />,
    title: "Theme Params",
  },
  {
    path: "/test/launch-params",
    element: <LaunchParamsPage />,
    title: "Launch Params",
  },
];
