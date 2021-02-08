import { Chrome, MaxWidthContent } from "../Chrome";
import React from "react";

type NotFoundProps = {
  message?: string;
};

const DEFAULT_MESSAGE = "The requested content was not found.";

export const NotFound: React.FC<NotFoundProps> = (props) => {
  const message = props.message || DEFAULT_MESSAGE;
  return (
    <Chrome>
      <div className="flex flex-col mt-3">
        <MaxWidthContent>
          <div className="flex flex-col items-center space-y-3">
            <h1 className="font-serif font-bold text-3xl">Not Found</h1>
            <p>{message}</p>
          </div>
        </MaxWidthContent>
      </div>
    </Chrome>
  );
};
