import {
  FORMAT_ELEMENT_COMMAND,
  INDENT_CONTENT_COMMAND,
  LexicalEditor,
  OUTDENT_CONTENT_COMMAND,
} from "lexical";
import React, { useCallback } from "react";
import { AlignCenterIcon } from "../../icons/AlignCenter2";
import { AlignLeftIcon } from "../../icons/AlignLeft2";
import { AlignRightIcon } from "../../icons/AlignRight2";
import { DropDown } from "../DropDown";
import { Devider } from "../../../Divider";

import classes from "./TextAlignPicker.module.scss";
import { LeftParagraphIcon } from "../../icons/LeftParagraphIcon2";
import { RightParagraphIcon } from "../../icons/RightParagraphIcon2";
import { ToolbarButton } from "../../../ToolbarButton";

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
        <ToolbarButton
          handleClick={formatTextLeftAlign}
          className={classes.textAlignPicker_item}
          ariaLabeles="left align"
          icon={<AlignLeftIcon />}
          tooltip={"По левому краю"}
          tooltipType={"bottom"}
        />

        <ToolbarButton
          handleClick={formatTextCenterAlign}
          className={classes.textAlignPicker_item}
          ariaLabeles="center align"
          icon={<AlignCenterIcon />}
          tooltip={"По-центру"}
          tooltipType={"bottom"}
        />

        <ToolbarButton
          handleClick={formatTextRightAlign}
          className={classes.textAlignPicker_item}
          ariaLabeles="right align"
          icon={<AlignRightIcon />}
          tooltip={"По правоу краю"}
          tooltipType={"bottom"}
        />

        <Devider />

        <ToolbarButton
          className={classes.textAlignPicker_item}
          handleClick={indentContent}
          icon={<LeftParagraphIcon />}
          ariaLabeles={"Увеличить отступ"}
          tooltip={"Увеличить отступ"}
          tooltipType={"bottom"}
        />

        <ToolbarButton
          className={classes.textAlignPicker_item}
          handleClick={outdentContent}
          icon={<RightParagraphIcon />}
          ariaLabeles={"Уменьшить отступ"}
          tooltip={"Уменьшить отступ"}
          tooltipType={"bottom"}
        />
      </div>
    </DropDown>
  );
};
