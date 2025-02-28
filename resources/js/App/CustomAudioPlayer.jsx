import React, { useRef, useState } from 'react'

const CustomAudioPlayer = () => {
    const [duration, setDuration] = useState();
    const [currentTime, setCurrentTime] = useState();
    const [volume, setVolume] = useState();
    const [isPlaying, setIsPlaying] = useState(false);
    const audioCtr = useRef();
    const audio = audioCtr.current;

    const togglePlayPause = () => {
        if (isPlaying) {
            audio.pause();
        }

        else {
            setDuration(audio.duration);
            audio.play();
        }

        setIsPlaying(!isPlaying);
    }

    const volumeChange = (e) => {
        const volume = e.target.value;
        audio.current.volume = volume;
        setVolume(volume);
    }

    const handleLoadedMetaData = (e) => {
        setDuration(e.target.value);
    };


    return (
        <div className='w-full '>

        </div>
    )
}

export default CustomAudioPlayer
