import { http, HttpResponse } from "msw";
import { SetupWorker, setupWorker } from "msw/browser";

const handler = http.get("/foo/bar", () => {
  return HttpResponse.json({ source: "initial handler" });
});

// Declare global (window) properties
declare global {
  interface Window {
    // mock service worker
    msw: {
      worker: SetupWorker;
    };
    mswReady: boolean;
    cypressReady: boolean;
  }
}

// Starts the mock service worker for local development or Cypress tests.
const startWorker = async () => {
  const worker = setupWorker(handler);

  await worker.start();
  window.msw = { worker };
  window.mswReady = true;
};

export { startWorker };
