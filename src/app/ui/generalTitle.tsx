import { Typography } from "@mui/material";

export default function GeneralTitle({ children }: { children: React.ReactNode }) {
    return (
        <Typography variant="h5"
            sx={{
                textShadow: "2px 2px 4px rgba(37, 37, 37, 0.3)",
                fontWeight: "bold",
                color: "rgb(22, 22, 22)",
                mb: 2
            }}
        >
            { children }
        </Typography>
    );
}