import { render } from "react-dom";
import * as React from "react";
import { Chrome } from "./chrome";
import { GetStarted } from "./views/GetStarted";
import { useStore } from "./store";
import { Inspector } from "./views/Inspector";
import { MessageStream } from "./views/Inspector/MessageStream";

const App: React.FC = () => {
  const ready = useStore((state) => state.ready);

  return (
    <MessageStream
      renderRow={(data: { message: string; timestamp: number }) => (
        <span>
          `${data.timestamp}: ${data.message}`
        </span>
      )}
    />
  );

  return <Chrome>{ready ? <Inspector /> : <GetStarted />}</Chrome>;
};

render(<App />, document.getElementById("root"));
