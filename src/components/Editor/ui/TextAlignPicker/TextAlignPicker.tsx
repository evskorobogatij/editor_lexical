import { FORMAT_ELEMENT_COMMAND, LexicalEditor } from "lexical";
import React, { useCallback } from "react";
import { AlignCenterIcon } from "../../icons/AlignCenter";
import { AlignLeftIcon } from "../../icons/AlignLeft";
import { AlignRightIcon } from "../../icons/AlignRight";
import { DropDown } from "../DropDown";

import classes from "./TextAlignPicker.module.scss";

interface TextAlignPickerProps {
  buttonClassName: string;
  disabled?: boolean;
  editor: LexicalEditor;
}
export const TextAlignPicker: React.FC<TextAlignPickerProps> = ({
  buttonClassName,
  editor,
  disabled = false,
}) => {
  const formatTextLeftAlign = useCallback(() => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
  }, [editor]);

  const formatTextCenterAlign = useCallback(() => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
  }, [editor]);

  const formatTextRightAlign = useCallback(() => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
  }, [editor]);

  return (
    <DropDown buttonClassName={buttonClassName} icon={<AlignLeftIcon />}>
      <div className={classes.textAlignPicker}>
        <button
          onClick={formatTextLeftAlign}
          className={classes.textAlignPicker_item}
          aria-label="left align"
        >
          <AlignLeftIcon />
        </button>

        <button
          onClick={formatTextCenterAlign}
          className={classes.textAlignPicker_item}
          aria-label="center align"
        >
          <AlignCenterIcon />
        </button>

        <button
          onClick={formatTextRightAlign}
          className={classes.textAlignPicker_item}
          aria-label="right align"
        >
          <AlignRightIcon />
        </button>
      </div>
    </DropDown>
  );
};
