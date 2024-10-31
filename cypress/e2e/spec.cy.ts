import { http, HttpResponse } from "msw";
import { SetupWorker } from "msw/browser";
// import { http, HttpResponse } from "../../node_modules/msw/lib/core";

// Declare global (window) properties
declare global {
  interface Window {
    // mock service worker
    msw: {
      worker: SetupWorker;
      ready: boolean;
      http: typeof http;
      HttpResponse: typeof HttpResponse;
    };
    cypressReady: boolean;
  }
}

describe("template spec", () => {
  it("passes", () => {
    cy.visit("/");

    cy.window().should("have.property", "mswReady", true);

    cy.window().then((window) => {
      console.log("registering new handler");
      window.msw.worker.use(
        window.msw.http.get("/foo/bar", () => {
          return window.msw.HttpResponse.json({ source: "cypress override" });
        })
      );

      window.cypressReady = true;
    });

    cy.get("#response").should("have.text", "cypress override");
  });
});
