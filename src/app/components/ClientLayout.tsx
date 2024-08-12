// src/components/ClientLayout.tsx
"use client";

import { Inter } from "next/font/google";
import {
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  Container,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayer } from "../context/LayerContext";

const inter = Inter({ subsets: ["latin"] });

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { layer } = useLayer(); // Get the current layer value
  const pathname = usePathname();

  console.log(pathname);

  return (
    <body className={inter.className}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Link href="/" passHref>
            <Image src="/logo.svg" alt="Logo" width={40} height={40} />
          </Link>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, marginLeft: 2 }}
          >
            Drone Access Manager
          </Typography>
          <Typography variant="h6" component="div" sx={{ marginRight: 2 }}>
            {layer === "" ? "" : `Layer ${layer}`}
          </Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <main>{children}</main>
      </Container>
    </body>
  );
}
