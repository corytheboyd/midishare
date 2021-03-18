import React from "react";
import { useQuery } from "react-query";
import { MaxWidthContent } from "../index";
import { BaseButton, BaseButtonProps } from "../../common/buttons/BaseButton";
import { Login } from "../../common/icons/sm/Login";
import { Logout } from "../../common/icons/sm/Logout";
import { UserProfile } from "@midishare/common";
import { getCurrentUser, queryKey } from "../../../lib/queries/getCurrentUser";
import { Routes } from "../../routes";
import { Menu } from "../../common/icons/md/Menu";

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

const NavButton: React.FC<BaseButtonProps> = (props) => (
  <BaseButton
    className="px-2 py-1 text-sm hover:text-gray-600 hover:shadow hover:bg-gray-200 rounded transition"
    {...props}
  >
    {props.children}
  </BaseButton>
);

const MobileNavMenu: React.FC<{ open: boolean }> = (props) => {
  return (
    <>
      <div className="bg-black absolute top-0 right-0 w-full h-full opacity-75" />
      <div className="absolute mt-11 right-0 focus:outline-none bg-gray-700 text-gray-800 w-full opacity-100">
        {props.children}
      </div>
    </>
  );
};

const MobileNavMenuButton: React.FC<{
  label: string;
  description?: string;
}> = (props) => {
  return (
    <BaseButton className="bg-gray-800 py-2 text-right pr-2">
      <span className="font-bold text-gray-200">{props.label}</span>
      {props.description && (
        <p className="text-xs text-gray-400">{props.description}</p>
      )}
    </BaseButton>
  );
};

export const Navbar: React.FC = () => {
  const currentUserQuery = useQuery<UserProfile | null>(
    queryKey(),
    getCurrentUser,
    {
      refetchInterval: false,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <>
      <nav className="flex flex-col py-2 px-3 lg:p-3 bg-gray-700 shadow-lg">
        <MaxWidthContent>
          <div className="flex flex-row w-full">
            <h1>
              <a className="text-sm font-bold" href="/">
                Midishare
              </a>
            </h1>

            <div className="flex-grow flex items-center justify-end space-x-2">
              {currentUserQuery.data && (
                <div>
                  <img
                    className="h-6 w-6 rounded"
                    src={currentUserQuery.data.picture}
                    alt={currentUserQuery.data.name}
                  />
                </div>
              )}

              <NavButton>
                <div className="w-5 h-5">
                  <Menu />
                </div>
              </NavButton>
            </div>
          </div>
        </MaxWidthContent>
      </nav>

      <MobileNavMenu open={true}>
        <div className="flex flex-col justify-end space-y-2 py-2 text-sm">
          <MobileNavMenuButton
            label="Sessions"
            description="Create or join a session"
          />
          <MobileNavMenuButton
            label="Discussion"
            description="The Midishare discussion forum"
          />
          <MobileNavMenuButton
            label="Releases"
            description="Check out recent Midishare changes"
          />

          {currentUserQuery.data && <MobileNavMenuButton label="Logout" />}
        </div>
      </MobileNavMenu>
    </>
  );
};
