"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import store from "@/store/store";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      {children}
      <Toaster />
    </Provider>
  );
}
