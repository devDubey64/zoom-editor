import React from 'react';
import { Box, TextField, Typography } from '@mui/material';
import {ZoomBlockType} from "../types";

type ZoomBlockProps = {
    zoomBlock: ZoomBlockType;
    index: number;
    onEditZoomBlock: (zoomBlock: ZoomBlockType, index: number) => void;
}

export const ZoomBlock: React.FC<ZoomBlockProps> = ({ zoomBlock, index, onEditZoomBlock }) => {

    const handleChange = (key: keyof ZoomBlockType, value: string) => {
        const newZoomBlock: ZoomBlockType = {...zoomBlock, [key]: Number(value)};
        onEditZoomBlock(newZoomBlock, index);
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '300px' }}>
            <Typography variant="h6">Create Zoom Block</Typography>
            <TextField
                label="Zoom Factor"
                type="number"
                value={zoomBlock.factor}
                onChange={(e) => handleChange('factor', e.target.value)}
                fullWidth
            />
            <TextField
                label="X Coordinate"
                type="number"
                value={zoomBlock.x}
                onChange={(e) => handleChange('x', e.target.value)}
                fullWidth
            />
            <TextField
                label="Y Coordinate"
                type="number"
                value={zoomBlock.y}
                onChange={(e) => handleChange('y', e.target.value)}
                fullWidth
            />
            <TextField
                label="Start Time (sec)"
                type="number"
                value={zoomBlock.startTime}
                onChange={(e) => handleChange('startTime', e.target.value)}
                fullWidth
            />
            <TextField
                label="End Time (sec)"
                type="number"
                value={zoomBlock.endTime}
                onChange={(e) => handleChange('endTime', e.target.value)}
                fullWidth
            />
        </Box>
    );
};