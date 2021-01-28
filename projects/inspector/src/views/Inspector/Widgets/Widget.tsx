import * as React from "react";

type BaseProps = {
  title: JSX.Element;
};

export const Widget: React.FC<BaseProps> = (props) => {
  return (
    <div className="bg-gray-300 text-gray-800 text-xs h-full w-full flex flex-col flex flex-col rounded">
      <section className="text-center bg-gray-400 text-gray-600 font-bold py-0.5 px-2.5 rounded-t">
        {props.title}
      </section>

      <section className="p-1 flex flex-col items-center justify-center text-xs">
        {props.children}
      </section>
    </div>
  );
};
