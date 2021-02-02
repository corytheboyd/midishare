import * as React from "react";
import { ButtonHTMLAttributes, useRef } from "react";
import { InlineCode } from "../lib/InlineCode";
import { Example } from "../lib/Example";

// TODO
// import { Keyboard, Runtime } from "@midishare/keyboard";

const Button: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = (props) => {
  return (
    <button
      className="bg-purple-500 text-white w-full rounded shadow hover:bg-purple-600 hover:shadow-md"
      {...props}
    />
  );
};

const Label: React.FC = (props) => {
  return <div className="text-sm font-bold text-purple-400" {...props} />;
};

const BasicExample: React.FC = () => {
  const runtimeRef = useRef<Runtime>();

  const keyboard = (
    <Keyboard runtime={runtimeRef} options={{ keyPressedColor: "purple" }} />
  );

  const noteButton = (
    <Button
      onMouseDown={() => runtimeRef.current.keyOn("C4", 100)}
      onMouseUp={() => runtimeRef.current.keyOff("C4")}
    >
      C
    </Button>
  );

  const chordButton = (
    <Button
      onMouseDown={() => {
        runtimeRef.current.keyOn("F3", 100);
        runtimeRef.current.keyOn("A3", 100);
        runtimeRef.current.keyOn("C3", 100);
        runtimeRef.current.keyOn("DsEb3", 100);
      }}
      onMouseUp={() => {
        runtimeRef.current.keyOff("F3");
        runtimeRef.current.keyOff("A3");
        runtimeRef.current.keyOff("C3");
        runtimeRef.current.keyOff("DsEb3");
      }}
    >
      F7
    </Button>
  );

  return (
    <div className="flex space-x-2">
      <div className="flex-grow">{keyboard}</div>
      <div className="flex flex-col w-20 space-y-2">
        <div className="space-y-1">
          <Label>Note</Label>
          {noteButton}
        </div>
        <div className="space-y-1">
          <Label>Chord</Label>
          {chordButton}
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------

const code = `
import * as React from "react";
import { useRef } from "react";
import { Keyboard } from "@midishare/keyboard";

export const HelloKeyboard: React.FC = () => {
  const runtimeRef = useRef<Runtime>();

  const keyboard = (
    <Keyboard runtime={runtimeRef} options={{ keyPressedColor: "purple" }} />
  );

  const noteButton = (
    <Button
      onMouseDown={() => runtimeRef.current.keyOn("C4", 100)}
      onMouseUp={() => runtimeRef.current.keyOff("C4")}
    >
      C
    </Button>
  );

  const chordButton = (
    <Button
      onMouseDown={() => {
        runtimeRef.current.keyOn("F3", 100);
        runtimeRef.current.keyOn("A3", 100);
        runtimeRef.current.keyOn("C3", 100);
        runtimeRef.current.keyOn("DsEb3", 100);
      }}
      onMouseUp={() => {
        runtimeRef.current.keyOff("F3");
        runtimeRef.current.keyOff("A3");
        runtimeRef.current.keyOff("C3");
        runtimeRef.current.keyOff("DsEb3");
      }}
    >
      F7
    </Button>
  );

  return (
    <div className="flex space-x-2">
      <div className="flex-grow">{keyboard}</div>
      <div className="flex flex-col w-20 space-y-2">
        <div className="space-y-1">
          <Label>Note</Label>
          {noteButton}
        </div>
        <div className="space-y-1">
          <Label>Chord</Label>
          {chordButton}
        </div>
      </div>
    </div>
  );
};
`.trim();

// ----------------------------------------------

export const Basic: React.FC = () => (
  <Example
    title="Hello, Keyboard!"
    example={<BasicExample />}
    code={code}
    description={
      <>
        <p>
          Creating a <InlineCode>Keyboard</InlineCode> requires one dependency,
          a <InlineCode>Runtime</InlineCode> instance.
        </p>
        <br />
        <p>
          The <InlineCode>Runtime()</InlineCode> constructor accepts a
          <InlineCode>RuntimeOptions</InlineCode> object. This can be used to
          change the accent color of active keys, for example.
        </p>
        <br />
        <p>
          Keys are pressed/released with the{" "}
          <InlineCode>Runtime.keyOn()</InlineCode> and{" "}
          <InlineCode>Runtime.keyOff()</InlineCode> functions.
        </p>
      </>
    }
  />
);
