'use client';
import GeneralBody from "@/app/ui/generalBody";
import GeneralTitle from "@/app/ui/generalTitle";
import NavBarHeader from "@/app/ui/navBarHeader";
import ProfileCards from "@/app/ui/profileCards";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Skeleton, Snackbar, TextField } from "@mui/material";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function InvestmentEdit() {
    const router = useRouter();
    const token = Cookies.get("token");
    const user_id = Cookies.get("user_id");

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

    const [openDialog, setOpenDialog] = useState(false);

    const [email, setEmail] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
    const isEmailMatch = email === confirmEmail && isValidEmail(email);
    const isPasswordValid = password.length >= 6;
    const isPasswordMatch = password === confirmPassword && isPasswordValid;

    const handleEmailSubmit = async () => {
        try {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${token}`);

            const raw = JSON.stringify({
                email
            });

            const requestOptions = {
                method: "PUT",
                headers: myHeaders,
                body: raw
            };

            const response = await fetch(`http://localhost:8080/user/update/email/${user_id}`, requestOptions);
            if (response.status === 200) {
                setSnackbarMessage("Email atualizado!");
                setSnackbarSeverity("success");
                setSnackbarOpen(true);
            } else {
                setSnackbarMessage("Email não pode ser atualizado, tente outro!");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
            }
        } catch (error) {
            setSnackbarMessage(`Erro: ${(error as Error).message}`);
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    const handlePasswordSubmit = async () => {
        try {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${token}`);

            const raw = JSON.stringify({
                password
            });

            const requestOptions = {
                method: "PUT",
                headers: myHeaders,
                body: raw
            };

            const response = await fetch(`http://localhost:8080/user/update/password/${user_id}`, requestOptions);
            if (response.status === 200) {
                setSnackbarMessage("Senha atualizada!");
                setSnackbarSeverity("success");
                setSnackbarOpen(true);
            } else {
                setSnackbarMessage("Senha não pode ser atualizada!");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
            }
        } catch (error) {
            setSnackbarMessage(`Erro: ${(error as Error).message}`);
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    const handleDelete = () => {
        setOpenDialog(true);
    };

    const handleConfirmDelete = async () => {
        const token = Cookies.get("token");

        try {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${token}`);

            const requestOptions = {
                method: "DELETE",
                headers: myHeaders
            };

            const response = await fetch(`http://localhost:8080/user/delete/${user_id}`, requestOptions);
            if (response.status === 200) {
                router.replace('/');
            } else {
                setSnackbarMessage("Usuário não pode ser apagado!");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
            }
        } catch (error) {
            setSnackbarMessage(`Erro de rede: ${(error as Error).message}`);
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    const handleCancelDelete = () => {
        setOpenDialog(false);
    };

    const handleCancel = () => {
        router.back();
    };

    const handleCloseSnackbar = () => {
        setSnackbarMessage("");
        setSnackbarOpen(false);
    }

    const handlerRender = () => {
        if (!token) {
            return (
                <>
                    <Alert severity="warning" sx={{ mt: 4 }}>
                        Sua sessão pode ter expirado ou você não está autenticado.
                    </Alert>

                    <Skeleton variant="text" width={200} height={40} />
                    <Skeleton variant="rectangular" height={100} sx={{ my: 2 }} />
                    <Skeleton variant="text" width={150} height={30} />
                    <Skeleton variant="rectangular" height={200} sx={{ my: 2 }} />
                </>
            );
        } else {
            return (
                <div>
                    <div id="edit-email">
                        <GeneralTitle>Mudar Email</GeneralTitle>
                        <ProfileCards>
                            <TextField
                                fullWidth
                                label="Novo E-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                margin="normal"
                                required
                            />

                            <TextField
                                fullWidth
                                label="Confirmar E-mail"
                                value={confirmEmail}
                                onChange={(e) => setConfirmEmail(e.target.value)}
                                margin="normal"
                                error={confirmEmail !== "" && !isEmailMatch}
                                helperText={confirmEmail !== "" && !isEmailMatch ? "Os e-mails não coincidem ou são inválidos." : ""}
                                required
                            />

                            <Box mt={2}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleEmailSubmit}
                                    disabled={!isEmailMatch}
                                >
                                    Editar E-mail
                                </Button>
                            </Box>
                        </ProfileCards>
                    </div>

                    <Divider sx={{ my: 4 }} />

                    <div id="edit-password">
                        <GeneralTitle>Mudar Senha</GeneralTitle>
                        <ProfileCards>
                            <TextField
                                fullWidth
                                label="Nova Senha"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Confirmar Senha"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                margin="normal"
                                error={confirmPassword !== "" && !isPasswordMatch}
                                helperText={confirmPassword !== "" && !isPasswordMatch ? "As senhas não coincidem ou são muito curtas." : ""}
                            />
                            <Box mt={2}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handlePasswordSubmit}
                                    disabled={!isPasswordMatch}
                                >
                                    Editar Senha
                                </Button>
                            </Box>
                        </ProfileCards>
                    </div>

                    <div id="back">
                        <Box display="flex" justifyContent="center" gap={2}>
                            <Button
                                variant="contained"
                                color="secondary"
                                type="button"
                                onClick={handleCancel}
                                sx={{ mt: 4 }}
                            >
                                Voltar
                            </Button>

                            <Button
                                variant="contained"
                                color="error"
                                type="button"
                                onClick={handleDelete}
                                sx={{ mt: 4 }}
                            >
                                Apagar usuário
                            </Button>

                        </Box>
                    </div>

                    <Snackbar
                        open={snackbarOpen}
                        onClose={() => setSnackbarOpen(false)}
                        autoHideDuration={null}
                        action={
                            <Button color="inherit" size="small" onClick={handleCloseSnackbar}>
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

                    <Dialog open={openDialog} onClose={handleCancelDelete}>
                        <DialogTitle>Confirmar exclusão</DialogTitle>
                        <DialogContent>
                            <DialogContentText>

                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCancelDelete} color="secondary">
                                Cancelar
                            </Button>
                            <Button onClick={handleConfirmDelete} color="error" variant="contained" autoFocus>
                                Confirmar
                            </Button>
                        </DialogActions>
                    </Dialog>

                </div>
            );
        }
    }

    return (
        <div>
            <NavBarHeader />
            <GeneralBody>
                {handlerRender()}
            </GeneralBody>
        </div>
    );
}