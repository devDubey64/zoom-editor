import React from 'react';
import {Box, Container} from '@mui/material';
import {VideoEditor} from "./views";
import {HeadBar} from "./components";

const App: React.FC = () => {
    return (
        <Container sx={{width:"100%"}}>
            <HeadBar/>
            <Box sx={{
                position: "fixed",
                top: '36px',
                left: 0,
                width: "100%",
                height: "calc(100% - 36px)"
            }}>
                <VideoEditor />
            </Box>
        </Container>
    );
};

export default App;
