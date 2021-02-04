import React, { useRef } from "react";

export const CopyTextInput: React.FC<{
  /**
   * The source data to be copied
   * */
  source: string;

  /**
   * The ID of this target to use with CopyTargetButton
   * */
  clipboardId?: string;
}> = (props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleLinkInputClick = () => {
    if (!inputRef.current) {
      return;
    }
    inputRef.current.select();
  };

  const optionalProps: React.InputHTMLAttributes<HTMLInputElement> = {};
  if (props.clipboardId) {
    optionalProps.id = props.clipboardId;
  }

  return (
    <input
      {...optionalProps}
      ref={inputRef}
      type="text"
      value={props.source}
      readOnly={true}
      className="w-full bg-gray-500 text-white text-xs h-5 rounded-sm px-1"
      onClick={handleLinkInputClick}
    />
  );
};
