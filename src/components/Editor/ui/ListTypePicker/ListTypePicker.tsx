import { LexicalEditor } from "lexical";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_CHECK_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode,
} from "@lexical/list";
import React, { useCallback } from "react";
import { MarkedListIcon } from "../../icons/MarkedList2";
import { NumberListIcon } from "../../icons/NumberList";
import { DropDown } from "../DropDown";
import classes from "./ListTypePicker.module.scss";
import type { ListType } from "../../plugins/FloatingTextFormatToolbarPlugin";
import clsx from "clsx";
import { ToolbarButton } from "../../../ToolbarButton";
import { CheckListIcon } from "../../icons/CheckList";

interface ListTypePickerProps {
  buttonClassName: string;
  disabled?: boolean;
  editor: LexicalEditor;
  isList: boolean;
  listType: ListType | undefined;
  tooltip?: string;
}
export const ListTypePicker: React.FC<ListTypePickerProps> = ({
  buttonClassName,
  editor,
  isList,
  listType,
  tooltip,
  disabled = false,
}) => {
  const insertNumberList = useCallback(() => {
    if (listType !== "number")
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    else editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
  }, [editor, listType]);

  const insertMarkedList = useCallback(() => {
    if (listType !== "bullet")
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    else editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
  }, [editor, listType]);

  const insertCheckList = useCallback(() => {
    if (listType !== "check")
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    else editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
  }, [editor, listType]);

  return (
    <DropDown
      icon={<MarkedListIcon />}
      buttonClassName={buttonClassName}
      tooltip={tooltip}
    >
      <div className={classes.listTypePicker}>
        {/* (isList && listType === "number" ? "active" : "") */}
        <ToolbarButton
          handleClick={insertNumberList}
          className={clsx(
            classes.listTypePicker_item,
            isList && listType === "number" && classes.active
          )}
          ariaLabeles="Insert list"
          icon={<NumberListIcon />}
          tooltip={"Нумированый список"}
          tooltipType={"bottom"}
        />

        {/* (isList && listType === "bullet" ? "active" : "") */}
        <ToolbarButton
          handleClick={insertMarkedList}
          className={clsx(
            classes.listTypePicker_item,
            isList && listType === "bullet" && classes.active
          )}
          ariaLabeles="Insert bulled list"
          icon={<MarkedListIcon />}
          tooltip={"Маркированый список"}
          tooltipType={"bottom"}
        />

        <ToolbarButton
          handleClick={insertCheckList}
          className={clsx(
            classes.listTypePicker_item,
            isList && listType === "check" && classes.active
          )}
          ariaLabeles="Insert check list"
          icon={<CheckListIcon />}
          tooltip={"Чек-лист"}
          tooltipType={"bottom"}
        />
      </div>
    </DropDown>
  );
};
