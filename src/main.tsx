import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import PartyTimeTracker from "./PartyTimeTracker";
import "./main.css";
import Layout from "./Layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/party-time-tracker",
        element: <PartyTimeTracker />,
      },
      {
        path: "/party-time-splitter",
        element: <h1>Halo</h1>,
      },
      {
        path: "/crafting-tool",
        element: <h1>Halo</h1>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);