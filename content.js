const _b = window.browser || chrome;

function applyVolume(volume) {
  document.querySelectorAll("audio, video").forEach((el) => {
    el.volume = Math.max(0, Math.min(1, volume));
  });

  if (!window._volumeObserver) {
    window._volumeObserver = new MutationObserver(() => {
      document.querySelectorAll("audio, video").forEach((el) => {
        el.volume = Math.max(0, Math.min(1, window._currentVolume ?? 1));
      });
    });
    window._volumeObserver.observe(document.body, { childList: true, subtree: true });
  }

  window._currentVolume = volume;
}

_b.runtime.onMessage.addListener((message) => {
  if (message.type === "SET_VOLUME") applyVolume(message.volume);
});

_b.runtime.sendMessage({ type: "GET_TAB_VOLUME" })
  .then?.((response) => { if (response?.volume !== undefined) applyVolume(response.volume); })
  .catch?.(() => {});