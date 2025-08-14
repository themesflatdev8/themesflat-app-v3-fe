import { CHROME_EXTENSION_ID } from "@/config/env";

export const checkInstallExtension = ({ cb }: any) => {
  try {
    chrome.runtime.sendMessage(
      CHROME_EXTENSION_ID,
      { type: "ms-ext" },
      (res: any) => {
        const lastError = chrome.runtime.lastError;
        if (lastError) {
          cb({ status: false });
          return;
        }
        cb({ status: true });
      }
    );
  } catch (error) {
    cb({ status: false });
  }
};

// chrome.runtime.onMessageExternal.addListener(
//   function(request, sender, sendResponse) {
//     const { type = '' } = request;

//     if (type) {
//       sendResponse(type);
//     }
//   },
// );
