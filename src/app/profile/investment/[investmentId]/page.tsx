'use client';
import GeneralBody from "@/app/ui/generalBody";
import NavBarHeader from "@/app/ui/navBarHeader";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { useParams, useRouter } from "next/navigation";
import { Investment } from "@/app/customTypes/Investment";
import { Alert, Box, Button, MenuItem, Skeleton, Snackbar, TextField, Typography } from "@mui/material";
import GeneralTitle from "@/app/ui/generalTitle";
import ProfileCards from "@/app/ui/profileCards";

export default function InvestmentEdit() {
    const { investmentId } = useParams();
    const router = useRouter();
    const token = Cookies.get("token");
    const [investment, setInvestment] = useState<Investment | null>(null);
    const [investmentName, setInvestmentName] = useState("");
    const [investmentType, setInvestmentType] = useState<"STOCK" | "FUND" | "BOND">("STOCK");
    const [investmentValue, setInvestmentValue] = useState(0.01);
    const [investmentStartDate, setInvestmentStartDate] = useState("");

    const [errors, setErrors] = useState({
        investmentName: "",
        investmentValue: "",
        investmentStartDate: ""
    });

    const [canSubmit, setCanSubmit] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

    useEffect(() => {
        // console.log(`ID: ${investmentId}`);
        const fetchInvestment = async () => {
            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${token}`);

            const requestOptions = {
                method: "GET",
                headers: myHeaders
            };

            const response = await fetch(`http://localhost:8080/investments/${investmentId}`, requestOptions);
            const investmentrJson: Investment = await response.json();
            setInvestmentName(investmentrJson.name);
            setInvestmentType(investmentrJson.type);
            setInvestmentValue(investmentrJson.value);
            const formattedDate = investmentrJson.startDate.split("T")[0];
            setInvestmentStartDate(formattedDate);
            setInvestment(investmentrJson);
        };

        fetchInvestment();
    }, []);

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

            //console.log(`1: ${today}, 2: ${selectedDate}`);

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

        try {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${token}`);

            const raw = JSON.stringify({
                "name": investmentName,
                "type": investmentType,
                "value": investmentValue,
                "startDate": investmentStartDate
            });

            const requestOptions = {
                method: "PUT",
                headers: myHeaders,
                body: raw
            };

            const response = await fetch(`http://localhost:8080/investments/update/${investmentId}`, requestOptions);
            if (response.status === 200) {
                setSnackbarMessage("Investimento editado com sucesso!");
                setSnackbarSeverity("success");
                router.refresh();
            } else {
                setSnackbarMessage("Erro ao editar o investimento! Certifique-se de que não exista um investimento com este nome.");
                setSnackbarSeverity("error");
            }
        } catch (error) {
            setSnackbarMessage(`Erro de rede: ${(error as Error).message}`);
            setSnackbarSeverity("error");
        }
        setSnackbarOpen(true);
    }

    const handleCancel = () => {
        router.back();
    }

    const handleCloseSnackbar = () => {
        setSnackbarMessage("");
        setSnackbarOpen(false);
    }

    const handlerRender = () => {
        if (!investment) {
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
            return <div>
                <div id="investment-list">
                    <GeneralTitle>INVESTIMENTO</GeneralTitle>
                    <ProfileCards>
                        <div>
                            <Box
                                component="form"
                                onSubmit={() => null}
                                sx={{
                                    mx: "auto",
                                    mt: 3,
                                    mb: 3,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 5,
                                    p: 4,
                                    bgcolor: "white",
                                }}
                            >
                                <Typography variant="h5" align="center">
                                    Editar
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
                                    defaultValue={investmentType}
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

                                <Box display="flex" justifyContent="center" gap={2}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        disabled={!canSubmit}
                                        onClick={handleSubmit}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        type="button"
                                        onClick={handleCancel}
                                    >
                                        Voltar
                                    </Button>
                                </Box>

                            </Box>

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
                        </div>
                    </ProfileCards>
                </div>
            </div>
        }
    }

    return (
        <div>
            <NavBarHeader />
            <GeneralBody>{handlerRender()}</GeneralBody>
        </div>
    );
}