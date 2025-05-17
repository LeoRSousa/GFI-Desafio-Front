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
import HomeButton from '../ui/homeButton';

export default function RegisterForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const [errors, setErrors] = useState({
        email: "",
        password: "",
        confirm: "",
    });

    const [canSubmit, setCanSubmit] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

    useEffect(() => {
        validateForm();
    }, [email, password, confirm]);

    //O Token é perdido toda vez que a página é carregada novamente
    useEffect(() => {
        Cookies.remove("token");
        Cookies.remove("user_id");
    }, []);

    const validateForm = () => {
        const newErrors = {
            email: "",
            password: "",
            confirm: "",
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

        if (!confirm) {
            newErrors.confirm = "Confirmação de senha é obrigatória";
        } else if (password !== confirm) {
            newErrors.confirm = "As senhas não coincidem";
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

            const response = await fetch("http://localhost:8080/user/create", requestOptions);

            if (response.status === 201) {
                setEmail("");
                setPassword("");
                setConfirm("");
                setSnackbarMessage("Usuário registrado com sucesso!");
                setSnackbarSeverity("success");
            } else {
                setSnackbarMessage("Erro ao registrar usuário!");
                setSnackbarSeverity("error");
            }
        } catch (error) {
            setSnackbarMessage(`Erro de rede: ${(error as Error).message}`);
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
                    Registro
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

                <TextField
                    label="Confirmar Senha"
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    error={!!errors.confirm}
                    helperText={errors.confirm}
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
                    Registrar
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
