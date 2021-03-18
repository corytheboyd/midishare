import React, { useCallback, useContext } from "react";
import classnames from "classnames";
import { PeerLaneProps } from "./index";
import { useMutation } from "react-query";
import { setSustainInverted } from "../../../../../lib/mutations/setSustainInverted";
import { queryClient } from "../../../../../lib/queryClient";
import { queryKey as getSessionQueryKey } from "../../../../../lib/queries/getSession";
import { Session } from "@midishare/common";
import { SessionShowContext } from "../SessionShowContext";

const pedImageUrl = (() => {
  const url = new URL(process.env.STATIC_CDN_URL as string);
  url.pathname = "/ped.png";
  return url.toString();
})();

export const KeyboardInfoWell: React.FC<PeerLaneProps> = (props) => {
  const context = useContext(SessionShowContext);

  // Canonical isPressed, directly from MIDI signal
  const isPressed = props.runtime.useStore((state) => state.sustain);

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
    setSustainInvertedMutation.mutate({
      id: context.session!.id,
      value: !context.localRuntimeOptions!.sustainInverted,
    });
  }, [context.session]);

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
