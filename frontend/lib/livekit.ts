/**
 * LiveKit Client configurations and helpers.
 * Handles configuration overrides for audio quality and packet loss behavior.
 */

export const LIVEKIT_ROOM_OPTIONS = {
  adaptiveStream: true,
  dynacast: true,
  publishDefaults: {
    audioPreset: {
      maxBitrate: 32000, // Optimize voice bandwidth
    },
    red: true, // Redundant Audio Data for packet loss recovery
    dtx: true, // Discontinuous transmission for battery savings
  },
};
