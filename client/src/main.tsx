import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import GameDetailPage from "./routes/game-detail-page";
import HomePage from "./routes/home-page";
import SettingsPage from "./routes/settings-page";
import UnitPlacementTestPage from "./routes/unit-placement-test";
import CreateStoryPage from "./routes/create-story";
import Root from "./routes/root";

const router = createHashRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "games/:nid",
        element: <GameDetailPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
      {
        path: "unit-placement-test",
        element: <UnitPlacementTestPage />,
      },
      {
        path: "create-story",
        element: <CreateStoryPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
