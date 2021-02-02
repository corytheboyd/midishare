import React from "react";
import { Chrome, MaxWidthContent } from "../Chrome";
import { Play } from "../common/icons/sm/Play";

export const CreateSession: React.FC = () => {
  return (
    <Chrome>
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
            <button className="flex items-center justify-center space-x-1 px-2 py-1 rounded border-2 border-green-400 text-green-500 transition hover:shadow-md">
              <div className="w-7 h-7">
                <Play />
              </div>
              <span className="text-lg">Start Session</span>
            </button>
          </div>
        </MaxWidthContent>
      </div>
    </Chrome>
  );
};
