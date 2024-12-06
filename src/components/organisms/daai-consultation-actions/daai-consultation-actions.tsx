import { Component, h } from '@stencil/core';
import state from '../../../Store/RecorderComponentStore';


@Component({
  tag: 'daai-consultation-actions',
  styleUrl: 'daai-consultation-actions.css',
  shadow: false,
})
export class DaaiConsultationActions {

  startRecordingLocal(){
    state.status = 'recording'
  }


  startRecordingTelemedicine(){
   // futuro
  }

  pauseRecording(){
    state.status = 'paused'
  }

  resumeRecording(){
    state.status = 'resume'
  }

  finishRecording(){
    state.status = 'finished'
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
              <daai-button-with-icon id='start-recording' onClick={this.startRecordingLocal}>
                <daai-mic-icon/>
              </daai-button-with-icon>
              <daai-button-with-icon id='button-support'>
                <daai-support-icon/>
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
