import { Component, h, Prop, State } from '@stencil/core';
import state from '../../../Store/RecorderComponentStore';


@Component({
  tag: 'daai-consultation-actions',
  styleUrl: 'daai-consultation-actions.css',
  shadow: false,
})
export class DaaiConsultationActions {
  @Prop() apiKey: string;
  @Prop() specialty: string;
  @Prop() onSuccess: any;
  @Prop() onError: any;
  @Prop() metadata: string;

  @State() mediaRecorder: MediaRecorder | null = null;
  @State() error: string = '';
  @State() localStream: MediaStream | null = null;
  @State() mode: string
  @State() chunks: BlobPart[] = [];
  @State() audioDownloadLink: string | null = null;



 choosenMode(){
  state.status = 'choosen'
 }

  startRecordingLocal = async () => {
    state.chooseModality = true
    state.status = 'recording'


   this.mode = 'local'
    const constraints = {
      audio: {
        deviceId: state.chosenMicrophone
          ? { exact: state.defaultMicrophone }
          : undefined,
      },
    };

   const stream = await navigator.mediaDevices.getUserMedia(constraints)
   const audioContext = new (window.AudioContext)();
   const source = audioContext.createMediaStreamSource(stream);
   const analyser = audioContext.createAnalyser()
   analyser.fftSize = 256
  //  const bufferLength = analyser.frequencyBinCount;
  //  const dataArray = new Uint8Array(bufferLength)

   const gainNode = audioContext.createGain()
   gainNode.gain.value = 0

   source.connect(analyser);
   analyser.connect(gainNode)
   gainNode.connect(audioContext.destination)

 this.mediaRecorder = new MediaRecorder(stream)

 this.mediaRecorder.onstart = () => {

};
this.mediaRecorder.start();
  }

  startRecordingTelemedicine = async() => {
    this.mode = 'telemedicine'
    this.error = '';
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ audio: true });
      const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const composedStream = new MediaStream();
      // screenStream.getVideoTracks().forEach(track => composedStream.addTrack(track));

      const context = new AudioContext();
      const audioDestination = context.createMediaStreamDestination();

      state.status = 'recording'
      if (screenStream.getAudioTracks().length > 0) {
        const systemSource = context.createMediaStreamSource(screenStream);
        const systemGain = context.createGain();
        systemGain.gain.value = 1.0;
        systemSource.connect(systemGain).connect(audioDestination);
      }

      if (micStream.getAudioTracks().length > 0) {
        const micSource = context.createMediaStreamSource(micStream);
        const micGain = context.createGain();
        micGain.gain.value = 1.0;
        micSource.connect(micGain).connect(audioDestination);
      }

      audioDestination.stream.getAudioTracks().forEach(track => composedStream.addTrack(track));
      this.onCombinedStreamAvailable(composedStream);

      console.log(composedStream,'composedStream')
      state.status = 'recording'

    } catch (err) {
      console.error(err);
      this.error = '';
    }
  };

  onCombinedStreamAvailable(stream: MediaStream) {
    this.localStream = stream;
  }

  pauseRecording(){
    state.status = 'paused'
  }

  resumeRecording(){
    state.status = 'resume'
  }

  finishRecording = async () => {
    console.log('Finalizou a gravação');
    console.log('mediaRecorder', this.mediaRecorder);
    console.log(this.mode, 'this.mode');

    const handleRecordingStop = async (audioChunks: Blob[]) => {
        try {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            console.log(audioBlob, 'audioBlob');

            const audioUrl = URL.createObjectURL(audioBlob);

            await this.uploadAudio(audioBlob, this.apiKey, this.onSuccess, this.onError, this.specialty, 'dev', this.metadata);

            const audioElement = document.createElement('audio');
            audioElement.src = audioUrl;
            audioElement.controls = true;
            audioElement.autoplay = true;
            document.body.appendChild(audioElement);
        } catch (error) {
            console.error('Erro ao salvar ou recuperar áudio:', error);
        }
    };

    if (this.mode === 'telemedicine' && this.localStream) {
        console.log('Modo: Telemedicina');

        this.mediaRecorder = new MediaRecorder(this.localStream);
        const chunks: Blob[] = [];

        this.mediaRecorder.ondataavailable = (event) => chunks.push(event.data);
        this.mediaRecorder.onstop = () => handleRecordingStop(chunks);

        this.mediaRecorder.start();
    } else if (this.mode === 'local') {
        console.log('Modo: Local');

        const audioChunks: Blob[] = [];
        this.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunks.push(event.data);
            }
        };
        this.mediaRecorder.onstop = () => handleRecordingStop(audioChunks);
    } else {
        console.warn('Modo de gravação não reconhecido:', this.mode);
    }

    this.mediaRecorder.stop();
    state.status = 'finished';
};


  async uploadAudio(audioBlob, apiKey, onSuccess, onError, specialty, modeApi, metadata) {
    console.log(apiKey,'apikey')
    console.log(metadata,'metadata')
    const url = modeApi === 'dev'
    ? 'https://apim.doctorassistant.ai/api/sandbox/consultations'
    : 'https://apim.doctorassistant.ai/api/production/consultations';

    const formData = new FormData();
    formData.append('recording', audioBlob);
    formData.append('specialty', specialty);
    if(metadata){
      formData.append('metadata', JSON.stringify(metadata));
    }


    console.log(apiKey,'apiKey')

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'x-daai-api-key': apiKey,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        if (typeof onError === 'function') {
          onError('Erro na requisição', errorResponse);
        }
        return;
      }

      if (response.ok) {
        const jsonResponse = await response.json();
        if (typeof onSuccess === 'function') {
          console.log('aquii')
          onSuccess(jsonResponse);
        }
      }
    } catch (error) {
      console.error('Erro ao enviar o áudio:', error);
      if (typeof onError === 'function') {
        console.log('aquii')
        onError('erro na requisição', error);
      }
    }

  }

  render() {
    return (
      <div>
        {
          state.status === 'initial' ?
          <div class='flex items-center justify-center gap-2'>
             <daai-button-with-icon id='specialty'>
                <daai-stethoscope-icon />
              </daai-button-with-icon>
              <daai-button-with-icon id='start-recording' onClick={this.choosenMode}>
                <daai-mic-icon/>
              </daai-button-with-icon>
              <daai-button-with-icon id='button-support'>
                <daai-support-icon/>
              </daai-button-with-icon>
          </div> : ''
        }
        {
          state.status === 'choosen' ?
          <div class='flex items-center justify-center gap-2'>
             <daai-button-with-icon id='choose-local-consultation' onClick={this.startRecordingLocal}>
                Presencial
              </daai-button-with-icon>
              <daai-button-with-icon id='choose-telemedicine-consultation' onClick={this.startRecordingTelemedicine}>
                Telemedicina
              </daai-button-with-icon>
          </div> : ''
        }
        {
          state.status === 'recording' || state.status === 'resume' ?
          <div class='flex items-center justify-center gap-2'>
              <daai-button-with-icon id='pause-recording' onClick={this.pauseRecording}>
                <daai-pause-icon/>
              </daai-button-with-icon>
              <daai-button-with-icon id='button-finish' onClick={this.finishRecording}>
                <daai-finish-recording-icon/>
              </daai-button-with-icon>
          </div> : ''
        }
        {
          state.status === 'paused' ?
          <div class='flex items-center justify-center gap-2'>
              <daai-button-with-icon id='pause-recording-disabled' onClick={this.pauseRecording} disabled>
                <daai-pause-icon/>
              </daai-button-with-icon>
              <daai-button-with-icon id='button-resume' onClick={this.resumeRecording}>
                <daai-resume-recording-icon/>
              </daai-button-with-icon>
          </div> : ''
        }
        {
          state.status === 'finished' ?
          <div class='flex items-center justify-center gap-2'>
               <daai-button-with-icon id='start-recording' onClick={this.startRecordingLocal}>
                <daai-mic-icon/>
              </daai-button-with-icon>
          </div> : ''
        }
      </div>
    );
  }
}
