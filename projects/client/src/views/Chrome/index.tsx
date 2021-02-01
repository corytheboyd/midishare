import React from "react";
import { useQuery } from "react-query";
import { Queries } from "../../lib/queryClient";

/**
 * @note Parent must have `flex`, `flex-col` classes
 * */
export const MaxWidthContent: React.FC = (props) => (
  <div className="w-full max-w-4xl self-center">{props.children}</div>
);

const LOGIN_URL = (() => {
  const url = new URL(process.env.SERVER_URL as string);
  url.pathname = "/auth/login";
  return url.toString();
})();

const LOGOUT_URL = (() => {
  const url = new URL(process.env.SERVER_URL as string);
  url.pathname = "/auth/logout";
  return url.toString();
})();

export const Navbar: React.FC = () => {
  const { isLoading, error, data, isFetching } = useQuery(
    [Queries.PROFILES, "me"],
    async () => {
      const url = new URL(process.env.SERVER_URL as string);
      url.pathname = `/api/v1/profiles/me`;

      const response = await fetch(url.toString(), {
        mode: "cors",
        credentials: "include",
      });

      if (response.status === 204) {
        return null;
      } else if (response.status === 200) {
        return await response.json();
      }
    }
  );

  return (
    <MaxWidthContent>
      <div className="flex justify-center">
        <div className="flex-grow-0">
          <a className="font-bold font-mono" href="/">
            Midishare
          </a>
        </div>

        <div className="self-end flex-grow">
          <div className="flex justify-end">
            {!data && <a href={LOGIN_URL}>Login</a>}

            {data && <a href={LOGOUT_URL}>Logout</a>}
          </div>
        </div>
      </div>
    </MaxWidthContent>
  );
};

export const Chrome: React.FC = (props) => {
  return (
    <div id="chrome" className="flex flex-col h-full">
      <nav className="flex flex-col p-4 border-b-2">
        <Navbar />
      </nav>

      <main id="main" className="flex-grow">
        {props.children}
      </main>

      <footer className="bg-gray-100 flex flex-col p-5">
        <MaxWidthContent>
          <div className="flex items-center justify-center">
            <span className="text-sm">© Midishare • 2021</span>
          </div>
        </MaxWidthContent>
      </footer>
    </div>
  );
};
