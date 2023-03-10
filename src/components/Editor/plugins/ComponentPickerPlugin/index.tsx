import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  LexicalTypeaheadMenuPlugin,
  TypeaheadOption,
  useBasicTypeaheadTriggerMatch,
} from "@lexical/react/LexicalTypeaheadMenuPlugin";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { $setBlocksType_experimental } from "@lexical/selection";
import { INSERT_TABLE_COMMAND } from "@lexical/table";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  FORMAT_ELEMENT_COMMAND,
  TextNode,
} from "lexical";
import { useCallback, useMemo, useState } from "react";
import * as React from "react";
import * as ReactDOM from "react-dom";

import classes from "./ComponentPickerPlugin.module.scss";
import { NumberListIcon } from "../../icons/NumberList";
import { MarkedListIcon } from "../../icons/MarkedList";
import { CheckListIcon } from "../../icons/CheckList";
import { BannerIcon } from "../../icons/Banner";
import { AlignLeftIcon } from "../../icons/AlignLeft";
import { AlignCenterIcon } from "../../icons/AlignCenter";
import { AlignRightIcon } from "../../icons/AlignRight";
import { H1Icon } from "../../icons/H1Icon";
import { H3Icon } from "../../icons/H3Icon";
import { H2Icon } from "../../icons/H2Icon";
import { LinkIcon } from "../../icons/LinkIcon";

import clsx from "clsx";
// import useModal from '../../hooks/useModal';
// import catTypingGif from "../../images/cat-typing.gif";

// import {INSERT_COLLAPSIBLE_COMMAND} from '../CollapsiblePlugin';
// import {InsertEquationDialog} from '../EquationsPlugin';
// import {INSERT_EXCALIDRAW_COMMAND} from '../ExcalidrawPlugin';
// import {INSERT_IMAGE_COMMAND, InsertImageDialog} from '../ImagesPlugin';
// import {InsertPollDialog} from '../PollPlugin';
// import {InsertNewTableDialog, InsertTableDialog} from '../TablePlugin';

class ComponentPickerOption extends TypeaheadOption {
  // What shows up in the editor
  title: string;
  // Icon for display
  icon?: JSX.Element;
  // For extra searching.
  keywords: Array<string>;
  // TBD
  keyboardShortcut?: string;
  // What happens when you select this option?
  onSelect: (queryString: string) => void;

  constructor(
    title: string,
    options: {
      icon?: JSX.Element;
      keywords?: Array<string>;
      keyboardShortcut?: string;
      onSelect: (queryString: string) => void;
    }
  ) {
    super(title);
    this.title = title;
    this.keywords = options.keywords || [];
    this.icon = options.icon;
    this.keyboardShortcut = options.keyboardShortcut;
    this.onSelect = options.onSelect.bind(this);
  }
}

function ComponentPickerMenuItem({
  index,
  isSelected,
  onClick,
  onMouseEnter,
  option,
}: {
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: ComponentPickerOption;
}) {
  // let className = "item";
  // if (isSelected) {
  //   className += " component_picker_poppup_item_selected";
  // }
  return (
    <li
      key={option.key}
      tabIndex={-1}
      className={clsx(
        "item",
        isSelected && classes.component_picker_poppup_item_selected
      )}
      ref={option.setRefElement}
      role="option"
      aria-selected={isSelected}
      id={"typeahead-item-" + index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      {option.icon}
      <span className={classes.component_picker_poppup_text}>
        {option.title}
      </span>
    </li>
  );
}

export default function ComponentPickerMenuPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  // const [modal, showModal] = useModal();
  const [queryString, setQueryString] = useState<string | null>(null);

  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch("/", {
    minLength: 0,
  });

  const getDynamicOptions = useCallback(() => {
    const options: Array<ComponentPickerOption> = [];

    if (queryString == null) {
      return options;
    }

    const fullTableRegex = new RegExp(/^([1-9]|10)x([1-9]|10)$/);
    const partialTableRegex = new RegExp(/^([1-9]|10)x?$/);

    const fullTableMatch = fullTableRegex.exec(queryString);
    const partialTableMatch = partialTableRegex.exec(queryString);

    if (fullTableMatch) {
      const [rows, columns] = fullTableMatch[0]
        .split("x")
        .map((n: string) => parseInt(n, 10));

      options.push(
        new ComponentPickerOption(`${rows}x${columns} Table`, {
          icon: <i className="icon table" />,
          keywords: ["table"],
          onSelect: () =>
            // @ts-ignore Correct types, but since they're dynamic TS doesn't like it.
            editor.dispatchCommand(INSERT_TABLE_COMMAND, { columns, rows }),
        })
      );
    } else if (partialTableMatch) {
      const rows = parseInt(partialTableMatch[0], 10);

      options.push(
        ...Array.from({ length: 5 }, (_, i) => i + 1).map(
          (columns) =>
            new ComponentPickerOption(`${rows}x${columns} Table`, {
              icon: <i className="icon table" />,
              keywords: ["table"],
              onSelect: () =>
                // @ts-ignore Correct types, but since they're dynamic TS doesn't like it.
                editor.dispatchCommand(INSERT_TABLE_COMMAND, { columns, rows }),
            })
        )
      );
    }

    return options;
  }, [editor, queryString]);

  const options = useMemo(() => {
    const baseOptions = [
      new ComponentPickerOption("?????????????? ??????????", {
        icon: <i className="icon paragraph" />,
        keywords: ["normal", "paragraph", "p", "text", "??????????", "??????????"],
        onSelect: () =>
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              $setBlocksType_experimental(selection, () =>
                $createParagraphNode()
              );
            }
          }),
      }),
      new ComponentPickerOption(`?????????????????? 1`, {
        icon: <H1Icon />,
        keywords: ["heading", "header", `h1`, "??????????????????"],
        onSelect: () =>
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              $setBlocksType_experimental(selection, () =>
                // @ts-ignore Correct types, but since they're dynamic TS doesn't like it.
                $createHeadingNode(`h1`)
              );
            }
          }),
      }),
      new ComponentPickerOption(`?????????????????? 2`, {
        icon: <H2Icon />,
        keywords: ["heading", "header", `h2`, "??????????????????"],
        onSelect: () =>
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              $setBlocksType_experimental(selection, () =>
                // @ts-ignore Correct types, but since they're dynamic TS doesn't like it.
                $createHeadingNode(`h2`)
              );
            }
          }),
      }),
      new ComponentPickerOption(`?????????????????? 3`, {
        icon: <H3Icon />,
        keywords: ["heading", "header", `h3`, "??????????????????"],
        onSelect: () =>
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              $setBlocksType_experimental(selection, () =>
                // @ts-ignore Correct types, but since they're dynamic TS doesn't like it.
                $createHeadingNode(`h3`)
              );
            }
          }),
      }),
      new ComponentPickerOption("?????????????????????? ????????????", {
        icon: <NumberListIcon />,
        keywords: [
          "numbered list",
          "ordered list",
          "ol",
          "?????????????????????? ????????????",
          "???????????????????????? ????????????",
        ],
        onSelect: () =>
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined),
      }),
      new ComponentPickerOption("???????????????????????? ????????????", {
        icon: <MarkedListIcon />,
        keywords: [
          "bulleted list",
          "unordered list",
          "ul",
          "???????????????????????? ????????????",
          "???????????????????????????? ????????????",
        ],
        onSelect: () =>
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined),
      }),
      new ComponentPickerOption("??????-????????", {
        icon: <CheckListIcon />,
        keywords: ["check list", "todo list", "????????????", "??????-????????"],
        onSelect: () =>
          editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined),
      }),
      new ComponentPickerOption("??????????", {
        icon: <BannerIcon />,
        keywords: ["??????????", "baner"],
        onSelect: () =>
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              $setBlocksType_experimental(selection, () => $createQuoteNode());
            }
          }),
      }),

      //
      new ComponentPickerOption("????????????", {
        icon: <LinkIcon />,
        keywords: ["link", "????????????"],
        onSelect: () =>
          editor.update(() => {
            const selection = $getSelection();
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
          }),
      }),

      // ...EmbedConfigs.map(
      //   (embedConfig) =>
      //     new ComponentPickerOption(`Embed ${embedConfig.contentName}`, {
      //       icon: embedConfig.icon,
      //       keywords: [...embedConfig.keywords, 'embed'],
      //       onSelect: () =>
      //         editor.dispatchCommand(INSERT_EMBED_COMMAND, embedConfig.type),
      //     }),
      // ),

      // new ComponentPickerOption('GIF', {
      //   icon: <i className="icon gif" />,
      //   keywords: ['gif', 'animate', 'image', 'file'],
      //   onSelect: () =>
      //     editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
      //       altText: 'Cat typing on a laptop',
      //       src: catTypingGif,
      //     }),
      // }),
      new ComponentPickerOption("???????????????????????? ??????????", {
        icon: <AlignLeftIcon />,
        keywords: ["align", "justify", "????????????????????????"],
        onSelect: () => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
        },
      }),

      new ComponentPickerOption("???????????????????????? ????-????????????", {
        icon: <AlignCenterIcon />,
        keywords: ["align", "justify", "????????????????????????"],
        onSelect: () => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
        },
      }),

      new ComponentPickerOption("???????????????????????? ????????????", {
        icon: <AlignRightIcon />,
        keywords: ["align", "justify", "????????????????????????"],
        onSelect: () => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
        },
      }),

      // ...["left", "center", "right"].map(
      //   (alignment) =>
      //     new ComponentPickerOption(`Align ${alignment}`, {
      //       icon: <i className={`icon ${alignment}-align`} />,
      //       keywords: ["align", "justify", alignment],
      //       onSelect: () =>
      //         // @ts-ignore Correct types, but since they're dynamic TS doesn't like it.
      //         editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment),
      //     })
      // ),
    ];

    const dynamicOptions = getDynamicOptions();

    return queryString
      ? [
          ...dynamicOptions,
          ...baseOptions.filter((option) => {
            return new RegExp(queryString, "gi").exec(option.title) ||
              option.keywords != null
              ? option.keywords.some((keyword) =>
                  new RegExp(queryString, "gi").exec(keyword)
                )
              : false;
          }),
        ]
      : baseOptions;
  }, [editor, getDynamicOptions, queryString]);

  const onSelectOption = useCallback(
    (
      selectedOption: ComponentPickerOption,
      nodeToRemove: TextNode | null,
      closeMenu: () => void,
      matchingString: string
    ) => {
      editor.update(() => {
        if (nodeToRemove) {
          nodeToRemove.remove();
        }
        selectedOption.onSelect(matchingString);
        closeMenu();
      });
    },
    [editor]
  );

  return (
    <>
      {/* {modal} */}
      <LexicalTypeaheadMenuPlugin<ComponentPickerOption>
        onQueryChange={setQueryString}
        onSelectOption={onSelectOption}
        triggerFn={checkForTriggerMatch}
        options={options}
        menuRenderFn={(
          anchorElementRef,
          { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }
        ) =>
          anchorElementRef.current && options.length
            ? ReactDOM.createPortal(
                <div className={classes.component_picker_poppup}>
                  <ul>
                    {options.map((option, i: number) => (
                      <ComponentPickerMenuItem
                        index={i}
                        isSelected={selectedIndex === i}
                        onClick={() => {
                          setHighlightedIndex(i);
                          selectOptionAndCleanUp(option);
                        }}
                        onMouseEnter={() => {
                          setHighlightedIndex(i);
                        }}
                        key={option.key}
                        option={option}
                      />
                    ))}
                  </ul>
                </div>,
                anchorElementRef.current
              )
            : null
        }
      />
    </>
  );
}
