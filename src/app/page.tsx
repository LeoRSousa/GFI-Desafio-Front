'use client';
import { Button } from "@mui/material";
import Link from "next/link";
import Cookies from 'js-cookie';
import { useEffect } from "react";

export default function Home() {
  //O Token + User ID é perdido toda vez que a página é carregada novamente
  useEffect(() => {
    Cookies.remove('token');
    Cookies.remove("user_id");
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Controle de Investimentos</h1>
        <p className="text-lg text-muted-foreground">Realize seu login ou crie uma conta</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button size="large" variant="contained" color="secondary">
            <Link href="/login">Login</Link>
          </Button>
          <Button variant="contained" size="large" color="primary">
            <Link href="/register">Registro</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
