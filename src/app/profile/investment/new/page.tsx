'use client';

import GeneralBody from "@/app/ui/generalBody";
import GeneralTitle from "@/app/ui/generalTitle";
import NavBarHeader from "@/app/ui/navBarHeader";
import ProfileCards from "@/app/ui/profileCards";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, FormLabel, Menu, MenuItem, Radio, RadioGroup, Snackbar, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";

export default function NewInvestment() {
    const router = useRouter();

    const [investmentName, setInvestmentName] = useState("");
    const [investmentType, setInvestmentType] = useState<"STOCK" | "FUND" | "BOND">("STOCK");
    const [investmentValue, setInvestmentValue] = useState(0.01);
    const [investmentStartDate, setInvestmentStartDate] = useState("");

    const [errors, setErrors] = useState({
        investmentName: "",
        investmentValue: "",
        investmentStartDate
    });

    const [canSubmit, setCanSubmit] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

    const [success, setSuccess] = useState(false);

    useEffect(() => {
        validateForm();
    }, [investmentName, investmentValue, investmentStartDate]);

    const validateForm = () => {
        const newErrors = {
            investmentName: "",
            investmentValue: "",
            investmentStartDate: ""
        };

        if (!investmentName) {
            newErrors.investmentName = "Nome é obrigatório";
        } else if (investmentName.length < 3) {
            newErrors.investmentName = "Nome deve ter no mínimo 3 caracteres";
        }

        if (isNaN(investmentValue) || investmentValue <= 0) {
            newErrors.investmentValue = "Valor deve ser um número positivo.";
        }

        if (!investmentStartDate) {
            newErrors.investmentStartDate = "Selecione a data";
        } else {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const selectedDate = new Date(investmentStartDate);
            selectedDate.setHours(0, 0, 0, 0);

            console.log(`1: ${today}, 2: ${selectedDate}`);

            if (selectedDate >= today) {
                newErrors.investmentStartDate = "A data não pode estar no futuro";
            }
        }

        setErrors(newErrors);

        // Verifica todos os campos estão válidos, antes de liberar o botão de envio.
        const isValid = Object.values(newErrors).every((msg) => msg === "");
        setCanSubmit(isValid);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        //console.log(`Nome: ${investmentName} | Tipo: ${investmentType} | Valor: ${investmentValue} | Data: ${investmentStartDate}`);
        try {
            const token = Cookies.get("token");
            const user_id = Cookies.get("user_id");

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${token}`);

            const raw = JSON.stringify({
                "name": investmentName,
                "type": investmentType,
                "value": investmentType,
                "startDate": investmentStartDate,
                "userId": user_id
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw
            };

            const response = await fetch("http://localhost:8080/investments/create", requestOptions);

            if (response.status === 201) {
                setSuccess(true);
            } else {
                setSnackbarMessage("Erro ao registrar o investimento! Certifique-se de que não exista um investimento com este nome.");
                setSnackbarSeverity("error");
            }
        } catch (error) {
            setSnackbarMessage(`Erro de rede: ${(error as Error).message}`);
            setSnackbarSeverity("error");
        }
        setSnackbarOpen(true);
    }

    const handlePlusOne = () => {
        router.push("/profile/investment/new");
    }

    const handleExit = () => {
        router.push("/profile");
    }

    return (
        <div>
            <NavBarHeader />
            <GeneralBody>
                <div>
                    <GeneralTitle>CRIAR INVESTIMENTO</GeneralTitle>
                    <div>
                        <Box
                            component="form"
                            onSubmit={() => null}
                            sx={{
                                // width: "100%",
                                // maxWidth: 400,
                                mx: "auto",
                                mt: 3,
                                mb: 3,
                                display: "flex",
                                flexDirection: "column",
                                gap: 5,
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
                                label="Nome"
                                type="text"
                                value={investmentName}
                                onChange={(e) => setInvestmentName(e.target.value)}
                                error={!!errors.investmentName}
                                helperText={errors.investmentName}
                                fullWidth
                                required
                            />

                            <TextField
                                select
                                label="Tipo"
                                defaultValue="STOCK"
                                onChange={(e) => setInvestmentType(e.target.value as "STOCK" | "FUND" | "BOND")}
                            >
                                <MenuItem key="STOCK" value="STOCK"> Ação</MenuItem>
                                <MenuItem key="FUND" value="FUND"> Fundo</MenuItem>
                                <MenuItem key="BOND" value="BOND"> Título</MenuItem>
                            </TextField>

                            <TextField
                                label="Valor"
                                type="number"
                                slotProps={{ htmlInput: { step: "0.01" } }}
                                value={investmentValue}
                                onChange={(e) => setInvestmentValue(parseFloat(e.target.value))}
                                error={!!errors.investmentValue}
                                helperText={errors.investmentValue}
                                fullWidth
                                required
                            />

                            <TextField
                                label="Data de Início"
                                type="date"
                                slotProps={{ inputLabel: { shrink: true } }}
                                value={investmentStartDate}
                                onChange={(e) => setInvestmentStartDate(e.target.value)}
                                error={!!errors.investmentStartDate}
                                helperText={errors.investmentStartDate}
                            />

                            {canSubmit ? null : (
                                <Alert severity="warning">Preencha corretamente os campos para continuar. </Alert>
                            )}

                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                disabled={!canSubmit}
                                onClick={handleSubmit}
                            >
                                Criar
                            </Button>


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

                    <Dialog
                        open={success}
                        onClose={() => {}}
                    >
                        <DialogTitle>Investimento Criado</DialogTitle>
                        <DialogContent>
                            <DialogContentText>Seu investimento foi criado! Você pode criar outro ou voltar ao seu perfil</DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button variant="text" color="secondary" onClick={handlePlusOne}></Button>
                            <Button variant="text" color="secondary" onClick={handleExit}></Button>
                        </DialogActions>
                    </Dialog>

                </div>
            </GeneralBody>
        </div>
    );
}