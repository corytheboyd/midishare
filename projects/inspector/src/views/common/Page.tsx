import * as React from "react";

export const Page: React.FC = (props) => {
  return <section className="h-full">{props.children}</section>;
};
