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

export const NavButton: React.FC<BaseButtonProps> = (props) => (
  <BaseButton
    className="px-2 py-1 text-sm hover:text-gray-600 hover:shadow hover:bg-gray-200 rounded transition"
    {...props}
  >
    {props.children}
  </BaseButton>
);

const ProfileSection: React.FC = () => {
  const { isLoading, data } = useQuery<UserProfile | null>(
    queryKey(),
    () => getCurrentUser(),
    {
      refetchInterval: false,
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading) {
    return null;
  }

  if (!data) {
    return (
      <NavButton href={LOGIN_URL}>
        <div className="flex space-x-0.5 items-center">
          <div className="w-4 h-4 text-gray-500">
            <Login />
          </div>
          <div>Login</div>
        </div>
      </NavButton>
    );
  }

  return (
    <div className="flex items-center space-x-1">
      <img className="w-6 h-6 rounded" src={data.picture} alt={data.name} />

      <NavButton href={LOGOUT_URL}>
        <div className="flex space-x-0.5 items-center">
          <div className="w-4 h-4 text-gray-500">
            <Logout />
          </div>
          <div>Logout</div>
        </div>
      </NavButton>
    </div>
  );
};

export const Navbar: React.FC = () => {
  return (
    <nav className="flex flex-col py-2 px-3 lg:p-3 bg-gray-700 shadow-lg">
      <MaxWidthContent>
        <div className="flex flex-row w-full">
          <h1>
            <a className="text-sm font-bold" href="/">
              Midishare
            </a>
          </h1>

          <div className="flex-grow flex justify-end">
            <NavButton>
              <div className="w-5 h-5">
                <Menu />
              </div>
            </NavButton>
          </div>
        </div>
      </MaxWidthContent>
    </nav>
  );
};
