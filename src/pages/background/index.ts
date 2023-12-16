import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import 'webextension-polyfill';
import { Message, TsuriScoreRequestMessage, TsuriScoreResponseMessage } from '@pages/message';
import { tsuriScoreAPI } from '@hooks/api-call';

reloadOnUpdate('pages/background');

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate('pages/content/style.scss');

const calcTsuriScore = async (videoId: string): Promise<number> => {
  const tsuriScoreAPIResponse = await tsuriScoreAPI({ videoId: [videoId] });
  const tsuriScore = tsuriScoreAPIResponse.items[0].tsuriScore;
  return tsuriScore;
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const message = request as Message;

  if (message.type === 'TsuriScoreRequest') {
    (async () => {
      const tsuriScoreRequest = message as TsuriScoreRequestMessage;
      const tsuriScore = await calcTsuriScore(tsuriScoreRequest.videoId);
      const response: TsuriScoreResponseMessage = {
        type: 'TsuriScoreResponse',
        videoId: tsuriScoreRequest.videoId,
        tsuriScore: tsuriScore,
      };
      sendResponse(response);
    })();
    // To indicate that it will respond asynchronously
    return true;
  }
});
