import { PauseCircleIcon, PlayCircleIcon } from '@heroicons/react/16/solid';
import React, { useRef, useState } from 'react'

const CustomAudioPlayer = ({ file, showVolume = false }) => {
    const [duration, setDuration] = useState();
    const [currentTime, setCurrentTime] = useState();
    const [volume, setVolume] = useState();
    const [isPlaying, setIsPlaying] = useState(false);
    const audioCtr = useRef();

    const togglePlayPause = () => {
        const audio = audioCtr.current;
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
        const audio = audioCtr.current;
        const volume = e.target.value;
        audio.current.volume = volume;
        setVolume(volume);
    }

    const handleLoadedMetaData = (e) => {
        setDuration(e.target.value);
    };

    const timeUpdate = (e) => {
        const audio = audioCtr.current;
        setDuration(audio.duration);
        setCurrentTime(e.target.currentTime);
    }

    const handleChange = (e) => {
        const audio = audioCtr.current;
        const time = e.target.value;
        audio.current.currentTime = time;
        setCurrentTime(time);
    }

    return (
        <div className='w-full gap-2 rounded-md bg-black/20 flex items-center'>
            <audio
                ref={audioCtr}
                src={file.url}
                controls
                onTimeUpdate={timeUpdate}
                onLoadedMetadata={handleLoadedMetaData}
                className='hidden'
            />

            <button onClick={togglePlayPause}>
                {isPlaying && <PauseCircleIcon className='w-6 h-6 text-gray-400' />}
                {!isPlaying && <PlayCircleIcon className='w-6 h-6 text-gray-400' />}
            </button>

            {showVolume && (
                <input
                    type='range'
                    min='0'
                    max='1'
                    step='0.01'
                    value={volume}
                    onChange={volumeChange}
                />
            )}

            <input
                type='range'
                min='0'
                max={duration}
                step='0.01'
                value={currentTime}
                onChange={handleChange}
            ></input>
        </div>
    )
}

export default CustomAudioPlayer
