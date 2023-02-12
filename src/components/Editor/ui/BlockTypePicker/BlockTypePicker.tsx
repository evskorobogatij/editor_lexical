import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  LexicalEditor,
} from "lexical";
import { $setBlocksType_experimental, $wrapNodes } from "@lexical/selection";
import {
  $createQuoteNode,
  $createHeadingNode,
  $isHeadingNode,
} from "@lexical/rich-text";
import { FC } from "react";
import { BannerIcon } from "../../icons/Banner";
import { H1Icon } from "../../icons/H1Icon";
import { H2Icon } from "../../icons/H2Icon";
import { H3Icon } from "../../icons/H3Icon";
import { NormalTextIcon } from "../../icons/NormalTextIcon";
import { DropDown } from "../DropDown";
import classes from "./BlockType.module.scss";
import clsx from "clsx";

interface BlockTypePickerProps {
  buttonClassName: string;
  blockType: string;
  disabled?: boolean;
  editor: LexicalEditor;
  tooltip?: string;
}

export const BlockTypePicker: FC<BlockTypePickerProps> = ({
  buttonClassName,
  editor,
  blockType,
  tooltip,
  disabled = false,
}) => {
  const formatParagraph = () => {
    if (blockType !== "paragraph") {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection))
          $setBlocksType_experimental(selection, () => $createParagraphNode());
      });
    }
  };

  const formatH1Header = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $wrapNodes(selection, () => $createHeadingNode("h1"));
      }
    });
  };

  const formatH2Header = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $wrapNodes(selection, () => $createHeadingNode("h2"));
      }
    });
  };

  const formatH3Header = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $wrapNodes(selection, () => $createHeadingNode("h3"));
      }
    });
  };

  const formatSimpleBanner = () => {
    // if (blockType !== 'quote') {
    editor.update(() => {
      const selection = $getSelection();
      if (
        $isRangeSelection(selection)
        //  ||        DEPRECATED_$isGridSelection(selection)
      ) {
        $setBlocksType_experimental(selection, () => $createQuoteNode());
      }
    });
    // }
  };

  return (
    <DropDown
      buttonClassName={buttonClassName}
      icon={<NormalTextIcon />}
      disabled={disabled}
      stopCloseOnClickSelf={true}
      tooltip={tooltip}
    >
      <div className={classes.blockTypePicker} style={{ width: "200px" }}>
        <div className={classes.blockTypePickerMenu}>
          <div className={classes.blockTypePickerMenu_Title}>Заголовок</div>

          <button
            className={clsx(
              classes.blockTypePickerMenu_Item,
              blockType === "paragraph" &&
                classes.blockTypePickerMenu_Item_active
            )}
            onClick={formatParagraph}
          >
            <NormalTextIcon />
            <div>Обычный текст</div>
          </button>
          <button
            className={clsx(
              classes.blockTypePickerMenu_Item,
              blockType === "h1" && classes.blockTypePickerMenu_Item_active
            )}
            onClick={formatH1Header}
          >
            <H1Icon />
            <div>Заголовок 1</div>
          </button>
          <button
            className={clsx(
              classes.blockTypePickerMenu_Item,
              blockType === "h2" && classes.blockTypePickerMenu_Item_active
            )}
            onClick={formatH2Header}
          >
            <H2Icon />
            <div>Заголовок 2</div>
          </button>
          <button
            className={clsx(
              classes.blockTypePickerMenu_Item,
              blockType === "h3" && classes.blockTypePickerMenu_Item_active
            )}
            onClick={formatH3Header}
          >
            <H3Icon />
            <div>Заголовок 3</div>
          </button>
        </div>

        <div className={classes.blockTypePickerMenu_sep} />

        <div className={classes.blockTypePickerMenu}>
          <button
            role={"button"}
            className={clsx(
              classes.blockTypePickerMenu_Item,
              blockType === "quote" && classes.blockTypePickerMenu_Item_active
            )}
            onClick={formatSimpleBanner}
          >
            <BannerIcon />
            <div>Баннеры</div>
          </button>
        </div>
      </div>
    </DropDown>
  );
};
