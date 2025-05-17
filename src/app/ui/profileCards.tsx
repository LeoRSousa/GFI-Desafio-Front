import { Paper } from "@mui/material";

export default function ProfileCards({ children }: { children: React.ReactNode }) {
    return (
        <Paper
            elevation={3}
            sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: "#fafafa",
            }}
        >
            { children }
        </Paper>
    );
}