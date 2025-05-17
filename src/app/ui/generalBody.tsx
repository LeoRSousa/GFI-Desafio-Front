'use client';

import { Box } from '@mui/material';

export default function GeneralBody({ children }: { children: React.ReactNode }) {
    return (
        <Box
            sx={{
                m: 5,
            }}
        >
            { children }
        </Box>
    );
}
