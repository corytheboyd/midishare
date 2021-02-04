import React, { ForwardedRef, forwardRef, HTMLProps } from "react";
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

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps &
    React.ButtonHTMLAttributes<HTMLButtonElement> &
    React.AnchorHTMLAttributes<HTMLAnchorElement>
>(({ to, href, ...props }, ref) => {
  if (to) {
    return (
      <Link to={to} ref={ref as ForwardedRef<HTMLAnchorElement>} {...props}>
        {props.children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} ref={ref as ForwardedRef<HTMLAnchorElement>} {...props}>
        {props.children}
      </a>
    );
  }

  return (
    <button ref={ref as ForwardedRef<HTMLButtonElement>} {...props}>
      {props.children}
    </button>
  );
});
Button.displayName = "Button";
