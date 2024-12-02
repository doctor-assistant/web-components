  import { Component, h } from '@stencil/core';
import state from '../../../Store/RecorderComponentStore';

  @Component({
    tag: 'daai-mic',
    styleUrl: 'daai-mic.css',
    shadow: false,
  })
  export class DaaiMic {

    async componentDidLoad() {
      await this.requestMicrophonePermission();
    }

    // Função que solicita permissão para o microfone
    async requestMicrophonePermission() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        state.microphonePermission = true
        console.log('Permissão concedida para o microfone');
      } catch (error) {
        console.error('Permissão do microfone negada ou erro ao acessar:', error);
        alert('Permissão para acessar o microfone é necessária para continuar!');
      }
    }

    handleClick(){
      state.openModalConfig = true
    }

    render() {
      console.log(state.status,'state.status')
      console.log(state.openModalConfig,'state.openModalConfig')

      return (
        <div class='flex items-center justify-center bg-white gap-2'>
          <daai-logo-icon></daai-logo-icon>
          <div class='flex items-center justify-center'>
        {state.microphonePermission === false ? (
          <daai-text text='Aguardando autorização do microfone' />
        ) : state.status === 'initial' ? (
          <div class='mt-4'>
            <daai-mic-animation id='animation-test' />
          </div>
        ) : (state.status === 'recording' || state.status === 'paused') ? (
          <daai-recording-animation
            id='animation-recording'
            status="recording"
            animationRecordingColor="#F43F5E"
            animationPausedColor="#009CB1"
          />
        ) : null}
      </div>
          <daai-button-with-icon id='config-mic' onClick={this.handleClick}>
            <daai-config-mic-icon></daai-config-mic-icon>
          </daai-button-with-icon>
      </div>
      );
    }
  }
