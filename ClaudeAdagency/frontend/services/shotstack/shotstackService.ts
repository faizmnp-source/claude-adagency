export const buildShotstackPayload = (scenes: any[], voiceover: any) => {
  // This builds the JSON payload for the Shotstack API
  return {
    timeline: {
      soundtrack: {
        src: voiceover.audio_url || "https://s3.amazonaws.com/shotstack-assets/music/unstoppable.mp3",
        effect: "fadeOut"
      },
      tracks: [
        {
          clips: scenes.map((scene, index) => ({
            asset: {
              type: "video",
              src: scene.video_url || "https://s3.amazonaws.com/shotstack-assets/footage/skater.hd.mp4"
            },
            start: scenes.slice(0, index).reduce((acc, s) => acc + s.duration_seconds, 0),
            length: scene.duration_seconds
          }))
        },
        {
          clips: scenes.map((scene, index) => ({
            asset: {
              type: "html",
              html: `<p data-alignment="center">${scene.caption_overlay}</p>`,
              css: "p { color: #ffffff; font-family: 'Montserrat'; font-weight: bold; font-size: 40px; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); }"
            },
            start: scenes.slice(0, index).reduce((acc, s) => acc + s.duration_seconds, 0),
            length: scene.duration_seconds,
            position: "center",
            transition: {
              in: "fade",
              out: "fade"
            }
          }))
        }
      ]
    },
    output: {
      format: "mp4",
      resolution: "hd"
    }
  };
};
