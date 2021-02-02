import React from "react";

type ButtonProps = {
  href?: string;
};

export const Button: React.FC<
  ButtonProps & React.HTMLAttributes<HTMLButtonElement | HTMLAnchorElement>
> = (props) => {
  if (props.href) {
    return <a {...props}>{props.children}</a>;
  }
  return <button {...props}>{props.children}</button>;
};
