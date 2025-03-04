// import { useLaunchParams, miniApp, useSignal } from "@telegram-apps/sdk-react";
// import { useLaunchParams } from "@telegram-apps/sdk-react";
import { AppRoot } from "@telegram-apps/telegram-ui";
import { Navigate, Route, Routes, HashRouter } from "react-router-dom";

import { routes } from "@/navigation/routes.tsx";
// import { useEffect } from "react";

export function App() {
  // const lp = useLaunchParams();
  // const isDark = useSignal(miniApp.isDark);

  return (
    <>
      <AppRoot
      // appearance={isDark ? "dark" : "light"}
      // platform={["macos", "ios"].includes(lp.platform) ? "ios" : "base"}
      >
        <div className="w-full min-h-screen text-black">
          <HashRouter>
            <Routes>
              {routes.map((route) => (
                <Route key={route.path} {...route} />
              ))}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </HashRouter>
        </div>
      </AppRoot>
    </>
  );
}
