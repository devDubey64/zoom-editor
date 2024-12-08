import React, {FC} from "react";
import {Box, IconButton, Slider, Typography} from "@mui/material";
import {PauseRounded, PlayArrowRounded, VolumeMuteRounded, VolumeOffRounded} from "@mui/icons-material";

type TimeLineProps = {
    isPlaying: boolean;
    handlePausePlay: () => void;
    isMuted: boolean;
    handleMuteUnmute: () => void;
    currentTime: number;
    handleSeek: (time: number) => void;
    duration: number;
}

export const TimeLine: FC<TimeLineProps> = (
    {isPlaying, isMuted, handlePausePlay, handleMuteUnmute, currentTime, handleSeek, duration}
) => {

    const togglePlayPause = () => {
        handlePausePlay();
    };

    const _handleSeek = (value: number | number[]) => {
        if (typeof value == "number"){
            handleSeek(value);
        }
    };

    const toggleMute = () => {
        handleMuteUnmute();
    };

    const padZero = (num: number): string => (num < 10 ? `0${num}` : `${num}`);

    const formatTime = (time: number): string => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${padZero(minutes)}:${padZero(seconds)}`;
    };

    return(
        <Box
        sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            background: "rgba(0, 0, 0, 0.5)",
            color: "#fff",
            padding: "8px",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            gap: "8px",
            boxSizing: 'border-box'
        }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '8px',
                paddingX:'8px',
                justifyItems: 'flex-start',
                width: '100%',
                boxSizing: 'border-box'
            }}>
                <IconButton
                    onClick={togglePlayPause}
                    sx={{color : '#fff', cursor: 'pointer', height: '24px', width:'24px'}}
                >
                    {isPlaying ? <PauseRounded/> : <PlayArrowRounded/>}
                </IconButton>
                <IconButton
                    onClick={toggleMute}
                    sx={{color : '#fff', cursor: 'pointer', height: '24px', width:'24px'}}
                >
                    {isMuted ? <VolumeOffRounded/> : <VolumeMuteRounded/>}
                </IconButton>
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '16px',
                paddingX:'8px',
                width: '100%',
                boxSizing: 'border-box'
            }}>
                <Slider
                    value={currentTime}
                    max={duration}
                    onChange={(_, val) => _handleSeek(val)}
                    sx={{ flex: 1 , width: 'calc(100%-100px)', color: "#fff" }}
                />
                <Typography sx={{width: '100px'}}>
                    {formatTime(currentTime)} / {formatTime(duration)}
                </Typography>
            </Box>
        </Box>
    )
}