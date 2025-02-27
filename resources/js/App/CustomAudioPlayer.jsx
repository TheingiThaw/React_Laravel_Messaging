import React, { useRef, useState } from 'react'

const CustomAudioPlayer = () => {

    const [isPlaying, setIsPlaying] = useState(false);
    const audio = useRef();

    const playPause = () => {
        if (isPlaying) {
            audio.pause();
        }
    }


    return (
        <div>

        </div>
    )
}

export default CustomAudioPlayer
