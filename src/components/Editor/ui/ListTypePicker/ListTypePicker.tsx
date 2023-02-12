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

interface ListTypePickerProps {
  buttonClassName: string;
  disabled?: boolean;
  editor: LexicalEditor;
  isList: boolean;
  listType: ListType | undefined;
}
export const ListTypePicker: React.FC<ListTypePickerProps> = ({
  buttonClassName,
  editor,
  isList,
  listType,
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

  return (
    <DropDown icon={<MarkedListIcon />} buttonClassName={buttonClassName}>
      <div className={classes.listTypePicker}>
        {/* (isList && listType === "number" ? "active" : "") */}
        <button
          onClick={insertNumberList}
          className={clsx(
            classes.listTypePicker_item,
            isList && listType === "number" && classes.active
          )}
          aria-label="Insert list"
        >
          <NumberListIcon />
        </button>

        {/* (isList && listType === "bullet" ? "active" : "") */}
        <button
          onClick={insertMarkedList}
          className={clsx(
            classes.listTypePicker_item,
            isList && listType === "bullet" && classes.active
          )}
          aria-label="Insert bulled list"
        >
          <MarkedListIcon />
        </button>
      </div>
    </DropDown>
  );
};
