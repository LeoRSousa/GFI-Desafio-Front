'use client';

import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function HomeButton() {
    const router = useRouter();
    
    const handleToLogin = () => {
        router.push("/");
    };

    return (
        <Button
            variant="text"
            color="secondary"
            onClick={handleToLogin}
        >
            Início
        </Button>
    );
}