import {
  FORMAT_ELEMENT_COMMAND,
  INDENT_CONTENT_COMMAND,
  LexicalEditor,
  OUTDENT_CONTENT_COMMAND,
} from "lexical";
import React, { useCallback } from "react";
import { AlignCenterIcon } from "../../icons/AlignCenter";
import { AlignLeftIcon } from "../../icons/AlignLeft2";
import { AlignRightIcon } from "../../icons/AlignRight";
import { DropDown } from "../DropDown";
import { Devider } from "../../../Divider";

import classes from "./TextAlignPicker.module.scss";
import { LeftParagraphIcon } from "../../icons/LeftParagraphIcon";
import { RightParagraphIcon } from "../../icons/RightParagraphIcon";

interface TextAlignPickerProps {
  buttonClassName: string;
  disabled?: boolean;
  editor: LexicalEditor;
  tooltip?: string;
}
export const TextAlignPicker: React.FC<TextAlignPickerProps> = ({
  buttonClassName,
  editor,
  tooltip,
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

  const outdentContent = useCallback(() => {
    editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
  }, [editor]);

  const indentContent = useCallback(() => {
    editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
  }, [editor]);

  return (
    <DropDown
      buttonClassName={buttonClassName}
      tooltip={tooltip}
      icon={<AlignLeftIcon />}
    >
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

        <Devider />

        <button
          className={classes.textAlignPicker_item}
          onClick={indentContent}
        >
          <LeftParagraphIcon />
        </button>

        <button
          className={classes.textAlignPicker_item}
          onClick={outdentContent}
        >
          <RightParagraphIcon />
        </button>
      </div>
    </DropDown>
  );
};
