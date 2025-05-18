import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from "@mui/material";
import { Investment } from "../customTypes/Investment";
import theme from "../theme";
import { Delete, Edit } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from 'js-cookie';

type InvestmentTableProps = {
    investments: Investment[];
}

export default function InvestmentTable({ investments }: InvestmentTableProps) {
    const router = useRouter();

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
    const [openSuccessDeleteDialog, setOpenSuccessDeleteDialog] = useState(false);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const [orderBy, setOrderBy] = useState<keyof Investment>("name");
    const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleDateString();
    };

    const formatType = (type: Investment["type"]) => {
        switch (type) {
            case "STOCK":
                return "Ação";
            case "FUND":
                return "Fundo";
            case "BOND":
                return "Título";
            default:
                return type;
        }
    };

    const handleEdit = (id: string) => {
        router.push(`/profile/investment/${id}`);
    };

    const handleDelete = (id: string) => {
        const investment = investments.find(investment => investment.id === id);
        if (investment) {
            setSelectedInvestment(investment);
            setOpenDialog(true);
        }
    };

    const handleConfirmDelete = async () => {
        const token = Cookies.get("token");

        try {
            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${token}`);

            const requestOptions = {
                method: "DELETE",
                headers: myHeaders
            };

            const response = await fetch(`http://localhost:8080/investments/delete/${selectedInvestment?.id}`, requestOptions);
            if (response.status === 200) {
                setOpenDialog(false);
                setSelectedInvestment(null);
                setOpenSuccessDeleteDialog(true);
                router.refresh();
            } else {
                setSnackbarMessage("Falha o deletar o investimento!");
                setSnackbarOpen(true);
            }
        } catch (error) {
            setSnackbarMessage(`Erro de rede: ${(error as Error).message}`);
            setSnackbarOpen(true);
        }

        setOpenDialog(false);
        setSelectedInvestment(null);
    };

    const handleCancelDelete = () => {
        setOpenDialog(false);
        setSelectedInvestment(null);
    };

    const handleCloseSnackbar = () => {
        setSnackbarMessage("");
        setSnackbarOpen(false);
    }

    const sortedInvestments = [...investments].sort((a, b) => {
        const aValue = a[orderBy];
        const bValue = b[orderBy];

        if (aValue < bValue) return orderDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return orderDirection === "asc" ? 1 : -1;
        return 0;
    });

    const handleSort = (property: keyof Investment) => {
        const isAsc = orderBy === property && orderDirection === "asc";
        setOrderBy(property);
        setOrderDirection(isAsc ? "desc" : "asc");
    };

    return (
        <div>
            <TableContainer
                sx={{
                    borderRadius: 1,
                    overflow: 'hidden',
                    boxShadow: 3,
                    mb: 2
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: theme.palette.secondary.main }}>
                            <TableCell sx={{ color: "white", width: "30%" }}>
                                <TableSortLabel
                                    active={orderBy === "name"}
                                    direction={orderBy === "name" ? orderDirection : "asc"}
                                    onClick={() => handleSort("name")}
                                    sx={{ color: "white !important", '& .MuiTableSortLabel-icon': { color: "white !important" } }}
                                >
                                    <strong>Nome</strong>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell sx={{ color: "white" }}>
                                <TableSortLabel
                                    active={orderBy === "type"}
                                    direction={orderBy === "type" ? orderDirection : "asc"}
                                    onClick={() => handleSort("type")}
                                    sx={{ color: "white !important", '& .MuiTableSortLabel-icon': { color: "white !important" } }}
                                >
                                    <strong>Tipo</strong>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell sx={{ color: "white" }}>
                                <TableSortLabel
                                    active={orderBy === "value"}
                                    direction={orderBy === "value" ? orderDirection : "asc"}
                                    onClick={() => handleSort("value")}
                                    sx={{ color: "white !important", '& .MuiTableSortLabel-icon': { color: "white !important" } }}
                                >
                                    <strong>Valor ($)</strong>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell sx={{ color: "white" }}>
                                <TableSortLabel
                                    active={orderBy === "startDate"}
                                    direction={orderBy === "startDate" ? orderDirection : "asc"}
                                    onClick={() => handleSort("startDate")}
                                    sx={{ color: "white !important", '& .MuiTableSortLabel-icon': { color: "white !important" } }}
                                >
                                    <strong>Data de Início</strong>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell sx={{ color: "white", width: "5%" }}><strong>Editar</strong></TableCell>
                            <TableCell sx={{ color: "white", width: "5%" }}><strong>Apagar</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedInvestments.map((investment, index) => (
                            <TableRow key={investment.id} sx={{ backgroundColor: index % 2 === 0 ? "white" : "#eaeaea" }}>
                                <TableCell sx={{ width: "30%" }}>{investment.name}</TableCell>
                                <TableCell>{formatType(investment.type)}</TableCell>
                                <TableCell>{investment.value.toFixed(2)}</TableCell>
                                <TableCell>{formatDate(investment.startDate)}</TableCell>
                                <TableCell sx={{ width: "5%" }}><Button variant="text" color="secondary" onClick={() => handleEdit(investment.id)}><Edit /> </Button></TableCell>
                                <TableCell sx={{ width: "5%" }}><Button variant="text" color="secondary" onClick={() => handleDelete(investment.id)}><Delete /></Button></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCancelDelete}>
                <DialogTitle>Confirmar exclusão</DialogTitle>
                <DialogContent>
                    {selectedInvestment && (
                        <DialogContentText>
                            <strong>Nome:</strong> {selectedInvestment.name}<br />
                            <strong>Tipo:</strong> {formatType(selectedInvestment.type)}<br />
                            <strong>Valor:</strong> ${selectedInvestment.value.toFixed(2)}<br />
                            <strong>Data de início:</strong> {formatDate(selectedInvestment.startDate)}
                            <br /><br />
                            Tem certeza que deseja excluir este investimento?
                        </DialogContentText>
                    )}
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

            <Dialog open={openSuccessDeleteDialog} onClose={() => setOpenSuccessDeleteDialog(false)}>
                <DialogTitle>Sucesso</DialogTitle>
                <DialogContent>
                    O investimento foi excluído com sucesso.
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        console.log("APERTOU");
                        setOpenSuccessDeleteDialog(false);
                        setTimeout(() => {
                            window.location.href = "/profile";
                        }, 200);
                    }} color="secondary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>

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
                    severity={"error"}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}