import React from "react";
import { Link, LinkProps } from "react-router-dom";

type ButtonProps = {
  /**
   * Makes the button an anchor element, for external routing
   * */
  href?: string;

  /**
   * Makes the button a Link element, for internal routing
   * */
  to?: string;
};

export const Button: React.FC<
  ButtonProps & React.HTMLAttributes<HTMLButtonElement | HTMLAnchorElement>
> = ({ to, href, ...props }) => {
  if (to) {
    return (
      <Link to={to} {...props}>
        {props.children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} {...props}>
        {props.children}
      </a>
    );
  }

  return <button {...props}>{props.children}</button>;
};
