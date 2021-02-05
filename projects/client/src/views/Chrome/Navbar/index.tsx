import React from "react";
import { useQuery } from "react-query";
import { MaxWidthContent } from "../index";
import { BaseButton, BaseButtonProps } from "../../common/buttons/BaseButton";
import { Login } from "../../common/icons/sm/Login";
import { Logout } from "../../common/icons/sm/Logout";
import { UserProfile } from "@midishare/common";
import { getCurrentUser, queryKey } from "../../../lib/queries/getCurrentUser";
import { Routes } from "../../routes";

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
    className="px-2 py-1 text-sm hover:shadow hover:bg-gray-50 rounded transition"
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
    <MaxWidthContent>
      <div className="flex justify-center">
        <div className="flex-grow-0">
          <a className="font-bold font-mono" href="/">
            Midishare
          </a>
        </div>

        <div className="flex-grow flex justify-end items-center px-5 text-sm space-x-5">
          <NavButton to={Routes.SESSIONS}>Sessions</NavButton>
        </div>

        <div className="self-end">
          <div className="flex justify-end">
            <ProfileSection />
          </div>
        </div>
      </div>
    </MaxWidthContent>
  );
};
