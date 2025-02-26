const buildHtml = (scripts: string[]) => {
    return `
<html>
  <head>
  ${scripts.join('\n')}
  </head>
  <body>
  </body>
</html>
`;
};

export const htmlWithVirtualMic = buildHtml([
    `
  <script>
    navigator.mediaDevices.getUserMedia = () => {    
      /* Create oscilator audio */          
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const destination = audioContext.createMediaStreamDestination();
      oscillator.connect(destination);
      oscillator.start();
      return Promise.resolve(destination.stream);
    };
  </script>
    `,
]);