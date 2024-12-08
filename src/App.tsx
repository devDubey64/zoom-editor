import React from 'react';
import {Box, Container} from '@mui/material';
import {VideoEditor} from "./views";
import {HeadBar} from "./components";

const App: React.FC = () => {
    return (
        <Container sx={{width:"100%"}}>
            <HeadBar/>
            <Box sx={{
                width: "100%",
                maxHeight: "calc(100vh - 36px)",
                overFlowY: 'auto',
                paddingTop: '24px',
            }}>
                <VideoEditor />
            </Box>
        </Container>
    );
};

export default App;
