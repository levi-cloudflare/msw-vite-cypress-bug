import { http, HttpResponse } from "msw";
import { SetupWorker } from "msw/browser";

// Declare global (window) properties
declare global {
  interface Window {
    // mock service worker
    msw: {
      worker: SetupWorker;
      ready: boolean;
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
        http.get("/foo/bar", () => {
          return HttpResponse.json({ response: "cypress override" });
        })
      );

      window.cypressReady = true;
    });

    cy.get("#response").should("have.text", "cypress override");
  });
});
