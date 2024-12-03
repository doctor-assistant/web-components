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

    async requestMicrophonePermission() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        state.microphonePermission = true;
        console.log('Permissão concedida para o microfone');

        const devices = await navigator.mediaDevices.enumerateDevices();
        const microphones = devices
          .filter(device => device.kind === 'audioinput')
          .map(device => device.label || 'Microfone sem nome');

        state.availableMicrophones = microphones;

        console.log('Microfones disponíveis:',  state.availableMicrophones);

        stream.getTracks().forEach(track => track.stop());
      } catch (error) {
        console.error('Permissão do microfone negada ou erro ao acessar:', error);
      }
    }

    handleClick(){
      //@ts-ignore
      this.addEventListener('interface', (event) => {
        console.log(event.detail); // Aqui você acessa o 'detail' do evento
        if (event.detail.configMic) {
          // Lógica para lidar com a configuração do microfone
          console.log('Configuração de microfone ativada!');
        }
      });
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
