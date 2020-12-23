// eslint-disable-next-line
import Worker from "worker-loader!./reco.worker";
import { useState, useEffect } from "react";
import { WorkerRequest, WorkerResponse } from "./workerTypes";

export const useWebWorker = () => {
  const [worker, setWorker] = useState<Worker | null>(null);
  useEffect(() => {
    const newWorker = new Worker();
    setWorker(newWorker);

    return () => {
      newWorker.terminate();
    };
  }, []);

  const generate = (options: {
    regexStr: string;
    type: string;
  }): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!worker) {
        reject(new Error("Worker not initialized yet"));
        return;
      }

      const id = Math.random().toString().substr(2);
      const messageListener = (message: MessageEvent<WorkerResponse>) => {
        if (message.data.id !== id) {
          return;
        }

        worker.removeEventListener("message", messageListener);

        if (message.data?.code) {
          resolve(message.data.code);
        } else {
          reject(message.data?.error);
        }
      };

      worker.addEventListener("message", messageListener);
      const requestMessage: WorkerRequest = {
        id,
        regexStr: options.regexStr,
        type: options.type,
      };

      worker.postMessage(requestMessage);
    });
  };

  return { generate };
};
