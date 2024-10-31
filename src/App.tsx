import { useEffect, useState } from "react";
import "./App.css";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

function useIsWindowReady() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    function checkReady() {
      if (window.cypressReady) {
        setIsReady(true);
      } else {
        // Retry after a delay if window.isReady isn't true yet
        setTimeout(checkReady, 50); // You can adjust the interval as needed
      }
    }

    checkReady();
  }, []);

  return isReady;
}

function App() {
  const isReady = useIsWindowReady();

  const [response, setResponse] = useState<string>();

  useEffect(() => {
    if (!isReady) return;

    console.log(window.msw.worker.listHandlers());
    fetch("/foo/bar")
      .then(async (request) => await request.json())
      .then((response) => {
        console.log("response", response);
        setResponse(response.source);
      });
  }, [isReady]);

  if (!isReady) return null;

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card" id="response">
        response is {response}
      </div>
    </>
  );
}

export default App;
