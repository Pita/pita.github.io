import { genTemplateValues, template, transformCode } from "reco.io";
import { WorkerRequest, WorkerResponse } from "./workerTypes";

// eslint-disable-next-line
self.addEventListener("message", (message: MessageEvent<WorkerRequest>) => {
  try {
    const { regexStr, id, type } = message.data;

    const templateValues = genTemplateValues(regexStr);
    const unformattedCode = template(templateValues);
    let transormedCode;
    switch (type) {
      case "ts":
      case "js":
        transormedCode = transformCode(unformattedCode, type);
        break;
      default:
        throw new Error(`Unkown type: ${type}`);
    }

    const response: WorkerResponse = {
      id,
      code: transormedCode,
    };

    // @ts-ignore
    postMessage(response);
  } catch (e) {
    // @ts-ignore
    postMessage({
      id: message.data.id,
      error: e.message,
    });
  }
});
