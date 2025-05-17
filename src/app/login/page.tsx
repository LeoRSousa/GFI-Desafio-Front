'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    Snackbar,
} from '@mui/material';

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import HomeButton from '../ui/homeButton';

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [errors, setErrors] = useState({
        email: "",
        password: ""
    });

    const [canSubmit, setCanSubmit] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

    const router = useRouter();
    
    //O Token é perdido toda vez que a página é carregada novamente
    useEffect(() => {
        Cookies.remove("token");
        Cookies.remove("user_id");
    }, []);

    useEffect(() => {
        validateForm();
    }, [email, password]);

    const validateForm = () => {
        const newErrors = {
            email: "",
            password: ""
        };

        if (!email) {
            newErrors.email = "Email é obrigatório";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Email inválido";
        }

        if (!password) {
            newErrors.password = "Senha é obrigatória";
        } else if (password.length < 6) {
            newErrors.password = "Senha deve ter no mínimo 6 caracteres";
        }

        setErrors(newErrors);

        // Verifica todos os campos estão válidos, antes de liberar o botão de envio.
        const isValid = Object.values(newErrors).every((msg) => msg === "");
        setCanSubmit(isValid);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                email,
                password
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw
            };

            const response = await fetch("http://localhost:8080/user/login", requestOptions);

            if (response.status === 200) {
                //Armazenar o Token + Fazer o redirecionamento para a página do cliente
                const responseJson = await response.json();
                Cookies.set("token", responseJson.token);
                Cookies.set("user_id", responseJson.id);
                router.push("profile");
            } else {
                setSnackbarMessage("Erro ao registrar usuário!");
                setSnackbarSeverity("error");
            }
        } catch (error) {
            console.log(error);
            setSnackbarMessage(`Erro: ${(error as Error).message}`);
            setSnackbarSeverity("error");
        }
        setSnackbarOpen(true);
    };

    return (
        <div>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    width: "100%",
                    maxWidth: 400,
                    mx: "auto",
                    mt: 3,
                    mb: 3,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    p: 4,
                    bgcolor: "white",
                    borderRadius: 2,
                    boxShadow: 3,
                }}
            >
                <Typography variant="h5" align="center">
                    Login
                </Typography>

                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!errors.email}
                    helperText={errors.email}
                    fullWidth
                    required
                />

                <TextField
                    label="Senha"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={!!errors.password}
                    helperText={errors.password}
                    fullWidth
                    required
                />

                {canSubmit ? null : (
                    <Alert severity="warning">Preencha corretamente os campos para continuar. Campos </Alert>
                )}

                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={!canSubmit}
                >
                    Entrar
                </Button>

                <HomeButton />
            </Box>

            <Snackbar
                open={snackbarOpen}
                onClose={() => setSnackbarOpen(false)}
                autoHideDuration={null}
                action={
                    <Button color="inherit" size="small" onClick={() => setSnackbarOpen(false)}>
                        FECHAR
                    </Button>
                }
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity={snackbarSeverity}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}
