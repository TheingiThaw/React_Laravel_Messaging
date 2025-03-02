import { MicrophoneIcon, PauseCircleIcon } from '@heroicons/react/16/solid';
import React, { useState } from 'react'

const AudioRecorder = ({ addFile }) => {
    const [mediaRecorder, setMediaRecorder] = useState();
    const [recording, setRecording] = useState(false);

    const onClickRecord = async () => {
        if (recording) {
            setRecording(false);
            if (mediaRecorder) {
                mediaRecorder.stop();
                setMediaRecorder(null);
            }
            return;
        }
        setRecording(true);
        try {
            let stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            const newMediaRecorder = new MediaRecorder(stream);
            const chucks = [];

            newMediaRecorder.addEventListener("dataavailable", (event) => {
                chucks.push(event.data);
            });

            newMediaRecorder.addEventListener("stop", (event) => {
                const audioBlob = new Blob('chucks', { type: 'audio/ogg; codecs=opus' });

                const audioFile = new File(audioBlob, 'recorded_audio.ogg', { type: 'audio/ogg; codecs=opus' },);
                const url = URL.createObjectURL(audioFile);

                addFile(audioFile, url);
            });

            newMediaRecorder.start();
            setMediaRecorder(newMediaRecorder);

        } catch (err) {
            console.log('error in recording', err);
            setRecording(false);
        }
    };

    return (
        <button onClick={onClickRecord}>
            {recording && (<PauseCircleIcon className='text-red-400 w-6 h-6' />)}
            {!recording && (<MicrophoneIcon className="h-6 w-6" />)}
        </button>
    )
}

export default AudioRecorder
