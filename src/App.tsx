import {
  Component,
  createEffect,
  createResource,
  createSignal,
  Show,
} from "solid-js";
import { toBase64 } from "js-base64";

import logo from "./logo.svg";

const App: Component = () => {
  const [search, setSearch] = createSignal<string>();
  const [data, setData] = createSignal<string>();
  const [blockchain, setBlockchain] = createSignal<string>();
  const [error, setError] = createSignal<boolean>(false);
  const [serverError, setServerError] = createSignal<boolean>(false);

  const imageencode = new TextEncoder();

  async function handleSubmit(e: any) {
    setError(false);
    setServerError(false);
    setData(undefined)
    e.preventDefault();
    const response = await fetch(
      "https://tidus-icon-api.herokuapp.com/api/assets/tokenassets?" +
        `contractAddress=` +
        search() +
        "&blockchain=" +
        blockchain(),
      {
        headers: {
          "Content-Type": "image/png",
        },
        mode: "cors",
      }
    );

    if (response.status === 500) setServerError(true);

    if (response.status === 200) {
      const data = response.url;
      const bytes = "";
      console.log(data);
      setData(data);
    }

    if (response.status === 404) setError(true);
  }

  createEffect(() => {
    console.log(data());
  });

  return (
    <div style={{ padding: "4rem" }}>
      <form action="" method="get" onsubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Contract address"
          onkeyup={(e) => setSearch(e.currentTarget.value)}
          required
        />
        <input
          type="text"
          placeholder="Blockchain"
          onkeyup={(e) => setBlockchain(e.currentTarget.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>

      <Show when={data()}>
        <p>searched address: {search}</p>
        {/* {JSON.stringify()} */}
        <img src={data()?.toString()} alt="" width={100} height={100} />
      </Show>

      <Show when={error()}>
        <p>searched address: {search}</p>
        Sorry we coudn't find what you were looking for
      </Show>

      <Show when={serverError()}>
        <p>searched address: {search}</p>
        Sorry, it seems we ran into an internal server error 😢. Did you use the right blockchain values?
      </Show>
      
    </div>
  );
};

export default App;
