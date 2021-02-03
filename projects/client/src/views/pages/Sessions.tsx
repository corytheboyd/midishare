import React from "react";
import { Chrome, MaxWidthContent } from "../Chrome";
import { Play } from "../common/icons/sm/Play";
import { Button } from "../common/Button";
import { Helmet } from "react-helmet";
import { useMutation } from "react-query";

export const Sessions: React.FC = () => {
  const mutation = useMutation(async () => {
    const url = new URL(process.env.SERVER_URL as string);
    url.pathname = "/api/v1/sessions";

    const response = await fetch(url.toString(), {
      method: "POST",
      mode: "cors",
      credentials: "include",
    });

    console.debug("CREATE ROOM RESPONSE", response);
  });

  return (
    <Chrome>
      <Helmet>
        <title>Midishare • Sessions</title>
      </Helmet>

      <div className="flex flex-col mt-4 px-3">
        <MaxWidthContent>
          <div>
            <h1 className="text-xl font-bold font-serif">Create Session</h1>
            <p className="text-md text-gray-500">
              Starts a new real-time MIDI streaming session that you can invite
              someone to join.
            </p>
          </div>

          <div className="mt-2">
            {mutation.isLoading && <span>Creating...</span>}

            {mutation.isError && (
              <div>
                <span>Something went wrong with your request</span>
                <span className="font-mono">{mutation.error?.message}</span>
              </div>
            )}

            {!mutation.isLoading && (
              <Button
                onClick={() => mutation.mutate()}
                className="flex w-48 items-center justify-center space-x-1 px-2 py-1 rounded text-white bg-green-500 transition hover:shadow-md"
              >
                <div className="w-7 h-7">
                  <Play />
                </div>
                <span className="text-lg">Start Session</span>
              </Button>
            )}
          </div>
        </MaxWidthContent>
      </div>
    </Chrome>
  );
};
