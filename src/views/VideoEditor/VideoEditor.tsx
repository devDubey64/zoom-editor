import React, {FC, useEffect, useRef, useState} from "react";
import {Box, Button} from "@mui/material";
import {TimeLine} from "./components";

type ZoomBlockType = {
    factor: number;
    x : number;
    y : number;
    startTime: number;
    endTime: number;
}

export const VideoEditor: FC = ()=> {

    const [videoSrc, setVideoSrc] = useState<string | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [currentZoomBlock, setCurrentZoomBlock] = useState<ZoomBlockType | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);

    const zoomBlocks: ZoomBlockType[] = [{
        x: 800,
        y: 300,
        factor: 1.2,
        startTime: 4,
        endTime: 8,
    }, {
        x: 1000,
        y: 300,
        factor: 1.2,
        startTime: 10,
        endTime: 15,
    }, {
        x: 1000,
        y: 800,
        factor: 1.2,
        startTime: 18,
        endTime: 25,
    }]

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
            const zoomWidth = canvas.width / factor;
            const zoomHeight = canvas.height / factor;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.drawImage(
                video,
                x - zoomWidth / 2,
                y - zoomHeight / 2,
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
                setCurrentZoomBlock(activeBlock);
                drawZoom(activeBlock);
            } else {
                setCurrentZoomBlock(null);
            }
        };

        const interval = setInterval(() => {
            if (currentZoomBlock) drawZoom(currentZoomBlock);
        }, 1000 / 30)

        video.addEventListener("timeupdate", handleTimeUpdate);
        video.addEventListener("loadedmetadata", () => setDuration(video.duration));

        return () => {
            video.removeEventListener("timeupdate", handleTimeUpdate);
            clearInterval(interval);
        };
    }, [videoSrc]);

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
            <Box sx={{ position: "relative",width: "800px", height: "400px"}}>
                <video
                    ref={videoRef}
                    src={videoSrc || ''}
                    style={{
                        display: "block",
                        width: "100%",
                        height: "100%",
                    }}
                />
                <canvas
                    ref={canvasRef}
                    style={{
                        position: "absolute",
                        display: currentZoomBlock ? "block" : "none",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        pointerEvents: "none",
                    }}
                    width={800}
                    height={400}
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
        )}
    </Box>;
}