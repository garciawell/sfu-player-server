const os = require('os')

address = '18.217.182.229'

module.exports = {
    listenIp: '0.0.0.0',
    listenPort: process.env.PORT || 3016,
    sslCrt: '../ssl/local-wtp.wiseup.com.pem',
    sslKey: '../ssl/local-wtp.wiseup.com-key.pem',
    
    mediasoup: {
      // Worker settings
      numWorkers : Object.keys(os.cpus()).length,
      worker: {
        rtcMinPort: 40000,
        rtcMaxPort: 49999,
        logLevel: 'warn',
        logTags: [
          'info',
          'ice',
          'dtls',
          'rtp',
          'srtp',
          'rtcp',
          // 'rtx',
          // 'bwe',
          // 'score',
          // 'simulcast',
          // 'svc'
        ],
      },
      // Router settings
      router: {
        mediaCodecs:
          [
            {
              kind: 'audio',
              mimeType: 'audio/opus',
              clockRate: 48000,
              channels: 2
            },
            {
              kind: 'video',
              mimeType: 'video/h264',
              clockRate: 90000,
              parameters:
                {
                  'x-google-start-bitrate': 1000
                }
            },
            {
              kind: 'screen',
              mimeType: 'video/VP8',
              clockRate: 90000,
              parameters:
                {
                  'x-google-start-bitrate': 1000
                }
            },
          ]
      },
    // WebRtcTransport settings
    webRtcTransport: {
        listenIps: [
          {
            ip: "0.0.0.0",
            announcedIp: address,
          }
        ],
        maxIncomingBitrate: 1500000,
        initialAvailableOutgoingBitrate: 1000000
    },
    }
  };
  
