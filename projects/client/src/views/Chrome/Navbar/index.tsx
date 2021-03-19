import React, { useState } from "react";
import { useQuery } from "react-query";
import { MaxWidthContent } from "../index";
import { BaseButton, BaseButtonProps } from "../../common/buttons/BaseButton";
import { UserProfile } from "@midishare/common";
import { getCurrentUser, queryKey } from "../../../lib/queries/getCurrentUser";
import { Routes } from "../../routes";
import { Menu } from "../../common/icons/md/Menu";
import { MobileNavMenu, MobileNavMenuButton } from "./MobileNav";

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

const RELEASES_URL = "https://github.com/corytheboyd/midishare/releases";
const DISCUSSION_URL = "https://github.com/corytheboyd/midishare/discussions";

const NavButton: React.FC<BaseButtonProps> = (props) => (
  <BaseButton
    className="px-2 py-1 text-sm hover:text-gray-600 hover:bg-gray-200 rounded transition"
    {...props}
  >
    {props.children}
  </BaseButton>
);

export const Navbar: React.FC = () => {
  const currentUserQuery = useQuery<UserProfile | null>(
    queryKey(),
    getCurrentUser,
    {
      refetchInterval: false,
      refetchOnWindowFocus: false,
    }
  );

  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <>
      <nav className="flex flex-col py-2 px-3 md:p-3 bg-gray-700 shadow-lg">
        <MaxWidthContent>
          <div className="flex flex-row w-full">
            <h1>
              <a className="text-sm font-bold" href="/">
                Midishare
              </a>
            </h1>

            <div className="flex-grow flex items-center justify-end space-x-2">
              <div className="hidden lg:block space-x-2">
                <NavButton href={RELEASES_URL} target="_blank">
                  Releases
                </NavButton>
                <NavButton href={DISCUSSION_URL} target="_blank">
                  Discussion
                </NavButton>
                <NavButton to={Routes.SESSIONS}>Sessions</NavButton>
              </div>

              {currentUserQuery.data && (
                <div>
                  <img
                    className="h-6 w-6 rounded"
                    src={currentUserQuery.data.picture}
                    alt={currentUserQuery.data.name}
                  />
                </div>
              )}

              {currentUserQuery.data && (
                <div className="hidden lg:block">
                  <NavButton href={LOGOUT_URL}>Logout</NavButton>
                </div>
              )}

              {currentUserQuery.data === null && (
                <div className="hidden lg:block">
                  <NavButton href={LOGIN_URL}>Login</NavButton>
                </div>
              )}

              <div className="lg:hidden">
                <NavButton onClick={() => setMobileNavOpen(!mobileNavOpen)}>
                  <div className="w-5 h-5">
                    <Menu />
                  </div>
                </NavButton>
              </div>
            </div>
          </div>
        </MaxWidthContent>
      </nav>

      <MobileNavMenu
        open={mobileNavOpen}
        requestClose={() => setMobileNavOpen(false)}
      >
        <div className="flex flex-col justify-end space-y-2 py-2 text-sm">
          <MobileNavMenuButton
            label="Sessions"
            description="Create or join a session"
            to={Routes.SESSIONS}
            onClick={() => setMobileNavOpen(false)}
          />
          <MobileNavMenuButton
            label="Releases"
            description="Check out recent Midishare changes"
            href={RELEASES_URL}
            target="_blank"
            onClick={() => setMobileNavOpen(false)}
          />
          <MobileNavMenuButton
            label="Discussion"
            description="The Midishare discussion forum"
            href={DISCUSSION_URL}
            target="_blank"
            onClick={() => setMobileNavOpen(false)}
          />
          {currentUserQuery.data && (
            <MobileNavMenuButton label="Logout" href={LOGOUT_URL} />
          )}
          {currentUserQuery.data === null && (
            <MobileNavMenuButton label="Login" href={LOGIN_URL} />
          )}
        </div>
      </MobileNavMenu>
    </>
  );
};
