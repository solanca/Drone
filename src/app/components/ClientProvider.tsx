// src/components/ClientProvider.tsx
"use client";

import React from "react";
import { LayerProvider } from "../context/LayerContext";

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayerProvider>{children}</LayerProvider>;
}
