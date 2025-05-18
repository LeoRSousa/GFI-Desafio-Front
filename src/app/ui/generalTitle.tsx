import { Typography } from "@mui/material";
import theme from "../theme";

export default function GeneralTitle({ children }: { children: React.ReactNode }) {
    return (
        <Typography variant="h5"
            sx={{
                textShadow: "2px 2px 4px rgba(37, 37, 37, 0.3)",
                fontWeight: "bold",
                color: theme.palette.secondary.main,
                mb: 2
            }}
        >
            { children }
        </Typography>
    );
}