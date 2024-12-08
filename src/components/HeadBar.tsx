import React, {FC} from "react";

import {Box, Typography} from "@mui/material";

export const HeadBar:FC = () => {
    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "36px",
                backgroundColor: "#222",
                color: "#fff",
                padding: "8px 20px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                zIndex: 1000,
            }}
        >
            <Typography sx={{fontSize: "1.5rem", textAlign: "center" }}>
                Video Zoom Editor
            </Typography>
        </Box>
    );
}