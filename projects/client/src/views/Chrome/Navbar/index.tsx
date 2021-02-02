import React from "react";
import { useQuery } from "react-query";
import { Queries } from "../../../lib/queryClient";
import { Login } from "../../../lib/icons/sm/Login";
import { Logout } from "../../../lib/icons/sm/Logout";
import { MaxWidthContent } from "../index";
import { Button } from "../../common/Button";

type UserProfile = {
  name: string;
  picture: string;
  email: string;
};

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

const AuthButton: React.FC<{ href: string }> = (props) => (
  <Button className="px-2 py-1 flex space-x-0.5 items-center text-sm">
    {props.children}
  </Button>
);

const ProfileSection: React.FC = () => {
  const { isLoading, data } = useQuery<UserProfile>(
    [Queries.PROFILES, "me"],
    async () => {
      const url = new URL(process.env.SERVER_URL as string);
      url.pathname = `/api/v1/profiles/me`;

      const response = await fetch(url.toString(), {
        mode: "cors",
        credentials: "include",
      });

      if (response.status === 401) {
        return null;
      } else if (response.status === 200) {
        return await response.json();
      }
    },
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
      <AuthButton href={LOGIN_URL}>
        <div className="w-4 h-4 text-gray-500">
          <Login />
        </div>
        <div>Login</div>
      </AuthButton>
    );
  }

  return (
    <div className="flex items-center space-x-1">
      <img className="w-6 h-6 rounded" src={data.picture} alt={data.name} />

      <AuthButton href={LOGOUT_URL}>
        <div className="w-4 h-4 text-gray-500">
          <Logout />
        </div>
        <div>Logout</div>
      </AuthButton>
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

        <div className="self-end flex-grow">
          <div className="flex justify-end">
            <ProfileSection />
          </div>
        </div>
      </div>
    </MaxWidthContent>
  );
};
