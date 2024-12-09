import React, {FC, useEffect, useMemo, useRef, useState} from "react";
import {Box, Button, Typography} from "@mui/material";
import {TimeLine, ZoomBlock} from "./components";
import {ZoomBlockType} from "./types";


export const VideoEditor: FC = ()=> {

    const [videoSrc, setVideoSrc] = useState<string | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [zoomBlocks, setZoomBlocks] = useState<ZoomBlockType[]>([]);

    const baseZoomBlock: ZoomBlockType = useMemo(() => {
        return {x:400, y:200, factor:1, startTime:0, endTime: duration}
    }, [duration]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === "video/mp4") {
            setVideoSrc(URL.createObjectURL(file));
        } else {
            alert("Please select a valid MP4 file.");
        }
    };

    const drawZoom = (zoomBlock: ZoomBlockType) => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (video && canvas) {
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            const { x, y, factor} = zoomBlock;
            const videoWidth = video.videoWidth;
            const videoHeight = video.videoHeight;

            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;

            const videoAspectRatio = videoWidth / videoHeight;
            const canvasAspectRatio = canvasWidth / canvasHeight;

            let scaledVideoWidth, scaledVideoHeight;
            if (videoAspectRatio > canvasAspectRatio) {
                scaledVideoWidth = canvasWidth;
                scaledVideoHeight = canvasWidth / videoAspectRatio;
            } else {
                scaledVideoHeight = canvasHeight;
                scaledVideoWidth = canvasHeight * videoAspectRatio;
            }

            const offsetX = (canvasWidth - scaledVideoWidth) / 2;
            const offsetY = (canvasHeight - scaledVideoHeight) / 2;

            const mappedX = ((x - offsetX) / scaledVideoWidth) * videoWidth;
            const mappedY = ((y - offsetY) / scaledVideoHeight) * videoHeight;

            const zoomWidth = videoWidth / factor;
            const zoomHeight = videoHeight / factor;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(
                video,
                mappedX - zoomWidth / 2,
                mappedY - zoomHeight / 2,
                zoomWidth,
                zoomHeight,
                0,
                0,
                canvas.width,
                canvas.height
            );
        }
    };

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        const handleTimeUpdate = () => {
            setCurrentTime(video.currentTime);

            const activeBlock = zoomBlocks.find(
                (block) => video.currentTime >= block.startTime && video.currentTime <= block.endTime
            );

            if (activeBlock){
                drawZoom(activeBlock);
            } else {
                drawZoom(baseZoomBlock);
            }
        };

        video.addEventListener("timeupdate", handleTimeUpdate);
        video.addEventListener("loadedmetadata", () => setDuration(video.duration));

        return () => {
            video.removeEventListener("timeupdate", handleTimeUpdate);
        };
    }, [videoSrc, zoomBlocks]);

    const handlePausePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(prevState => !prevState);
        }
    }

    const handleMuteUnmute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(prevState => !prevState);
        }
    }

    const handleSeek = (time: number) => {
        if(videoRef.current){
            setCurrentTime(time);
            videoRef.current.currentTime = time;
        }
    }

    const handleAddZoomBlock = () => {
        setZoomBlocks(prevState => [...prevState, baseZoomBlock]);
    }

    const handleEditZoomBlock = (zoomBlock: ZoomBlockType, index: number) => {
        setZoomBlocks(prevState => {
            return [
                ...prevState.slice(0, index),
                zoomBlock,
                ...prevState.slice(index + 1),
            ]
        });
    }

    const handleVideoEnd = () => {
        setIsPlaying(false); // Set isPlaying to false when video ends
    };

    return <Box sx={{
        padding: 4,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        gap: '16px'
    }}>
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '16px'
        }}>
            <Button variant="contained" component="label">
                Upload your Video
                <input
                    type="file"
                    accept="video/mp4"
                    hidden
                    onChange={handleFileChange}
                />
            </Button>
        </Box>
        { videoSrc && (
            <Box sx={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', }}>
            <Box sx={{ position: "relative",width: "800px", height: "400px"}}>
                <video
                    ref={videoRef}
                    src={videoSrc || ''}
                    style={{
                        display: "none"
                    }}
                    onEnded={handleVideoEnd}
                />
                <canvas
                    ref={canvasRef}
                    style={{
                        position: "absolute",
                        display: "block",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        pointerEvents: "none",
                    }}
                    width='800px'
                    height='400px'
                />
                <TimeLine
                    isPlaying={isPlaying}
                    handlePausePlay={handlePausePlay}
                    isMuted={isMuted}
                    handleMuteUnmute={handleMuteUnmute}
                    currentTime={currentTime}
                    handleSeek={handleSeek}
                    duration={duration}
                />
            </Box>
            <Typography fontSize={'1rem'} fontWeight={600}>Customize your zoom blocks</Typography>
            {
                zoomBlocks.map((zoomBlock, index) => {
                    return (
                        <ZoomBlock key={`zoomBlock_${index}`} onEditZoomBlock={handleEditZoomBlock} index={index} zoomBlock={zoomBlock} />
                    );
                })
            }
                <Button variant={'contained'} onClick={() => handleAddZoomBlock()}>Add New Zoom Block</Button>
            </Box>
        )}
    </Box>;
}