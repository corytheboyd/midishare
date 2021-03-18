import React, { useCallback } from "react";
import classnames from "classnames";
import { PeerLaneProps } from "./index";
import { useStore } from "../../../../../lib/store";
import { useMutation } from "react-query";
import { setSustainInverted } from "../../../../../lib/mutations/setSustainInverted";
import { queryClient } from "../../../../../lib/queryClient";
import { queryKey as getSessionQueryKey } from "../../../../../lib/queries/getSession";
import { queryKey as getCurrentUserQueryKey } from "../../../../../lib/queries/getCurrentUser";
import { Session, UserProfile } from "@midishare/common";
import { useParams } from "react-router-dom";

const pedImageUrl = (() => {
  const url = new URL(process.env.STATIC_CDN_URL as string);
  url.pathname = "/ped.png";
  return url.toString();
})();

export const KeyboardInfoWell: React.FC<PeerLaneProps> = (props) => {
  // TODO this is technically a bit of a coupling concern-- what if the URL
  //  structure changes? it's weird to have hierarchically deep components
  //  depend on that. however, this project is tiny so I am letting it slide.
  const urlParams = useParams<{ id: string }>();

  const isPressed = props.runtime.useStore((state) => state.sustain);
  const isSustainInverted = useStore((state) => state.sustainInverted);

  const setSustainInvertedMutation = useMutation<
    Session,
    Error,
    Parameters<typeof setSustainInverted>[0]
  >(setSustainInverted, {
    onSuccess: (data, variables) => {
      queryClient.setQueryData(getSessionQueryKey(variables.id), data);
    },
  });

  const handleInvertSustain = useCallback(() => {
    // TODO I have written this logic TOO MANY TIMES, something is off about
    //  either/all of the Session schema, missing helper functions, etc.
    const session = queryClient.getQueryData(
      getSessionQueryKey(urlParams.id)
    ) as Session;
    const currentUser = queryClient.getQueryData(
      getCurrentUserQueryKey()
    ) as UserProfile;
    const isCurrentUserHost = currentUser.sub === session.participants.host;

    setSustainInvertedMutation.mutate({
      id: urlParams.id,
      value: isCurrentUserHost
        ? !session.runtimeOptions.host.sustainInverted
        : !session.runtimeOptions.guest.sustainInverted,
    });
  }, [setSustainInverted, isSustainInverted]);

  return (
    <div
      className={classnames(
        "bg-yellow-100 p-1 rounded-full shadow-lg transition-all",
        {
          "cursor-pointer": props.isLocal,
          "opacity-25": !isPressed,
          "shadow-sm": isPressed,
        }
      )}
      onClick={handleInvertSustain}
    >
      <img className="h-10" src={pedImageUrl} alt="Pedal symbol" />
    </div>
  );
};
