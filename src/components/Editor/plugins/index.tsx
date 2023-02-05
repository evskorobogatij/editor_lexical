import "./index.css";

import { $isCodeHighlightNode } from "@lexical/code";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  mergeRegister,
  $findMatchingParent,
  $getNearestNodeOfType,
} from "@lexical/utils";
import {
  $getSelection,
  $isRootOrShadowRoot,
  $isRangeSelection,
  $isTextNode,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  LexicalEditor,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_CHECK_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode,
} from "@lexical/list";
import { $wrapNodes } from "@lexical/selection";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { $setBlocksType_experimental } from "@lexical/selection";
import { useCallback, useEffect, useRef, useState } from "react";
import * as React from "react";
import { createPortal } from "react-dom";

import { getDOMRangeRect } from "../utils/getDOMRangeRect";
import { getSelectedNode } from "../utils/getSelectedNode";
import { setFloatingElemPosition } from "../utils/setFloatingElemPosition";

import { BoldIcon } from "../icons/Bold";
import { ItalicIcon } from "../icons/Italic";
import { UnderlineIcon } from "../icons/Underline";
import { StrikethroughIcon } from "../icons/Strikethrough";
import { NumberListIcon } from "../icons/NumberList";
import { MarkedListIcon } from "../icons/MarkedList";
import { CheckListIcon } from "../icons/CheckList";
import { LinkIcon } from "../icons/LinkIcon";
import { Devider } from "../../Divider";
import { AlignLeftIcon } from "../icons/AlignLeft";
import { AlignCenterIcon } from "../icons/AlignCenter";
import { AlignRightIcon } from "../icons/AlignRight";
import { BannerIcon } from "../icons/Banner";
import { H1Icon } from "../icons/H1Icon";
import { H2Icon } from "../icons/H2Icon";
import { H3Icon } from "../icons/H3Icon";

type ListType = "number" | "bullet" | "check";

function TextFormatFloatingToolbar({
  editor,
  anchorElem,
  isLink,
  isBold,
  isItalic,
  isUnderline,
  isCode,
  isStrikethrough,
  isSubscript,
  isSuperscript,
  isList,
  listType,
}: {
  editor: LexicalEditor;
  anchorElem: HTMLElement;
  isBold: boolean;
  isCode: boolean;
  isItalic: boolean;
  isLink: boolean;
  isStrikethrough: boolean;
  isSubscript: boolean;
  isSuperscript: boolean;
  isUnderline: boolean;
  isList: boolean;
  listType: ListType | undefined;
}): JSX.Element {
  const popupCharStylesEditorRef = useRef<HTMLDivElement | null>(null);

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

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

  const formatTextLeftAlign = useCallback(() => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
  }, [editor]);

  const formatTextCenterAlign = useCallback(() => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
  }, [editor]);

  const formatTextRightAlign = useCallback(() => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
  }, [editor]);

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

  const insertComment = () => {
    // editor.dispatchCommand(INSERT_INLINE_COMMAND, undefined);
  };

  const updateTextFormatFloatingToolbar = useCallback(() => {
    const selection = $getSelection();

    const popupCharStylesEditorElem = popupCharStylesEditorRef.current;
    const nativeSelection = window.getSelection();

    if (popupCharStylesEditorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();
    if (
      selection !== null &&
      nativeSelection !== null &&
      !nativeSelection.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const rangeRect = getDOMRangeRect(nativeSelection, rootElement);

      setFloatingElemPosition(rangeRect, popupCharStylesEditorElem, anchorElem);
    }
  }, [editor, anchorElem]);

  useEffect(() => {
    const scrollerElem = anchorElem.parentElement;

    const update = () => {
      editor.getEditorState().read(() => {
        updateTextFormatFloatingToolbar();
      });
    };

    window.addEventListener("resize", update);
    if (scrollerElem) {
      scrollerElem.addEventListener("scroll", update);
    }

    return () => {
      window.removeEventListener("resize", update);
      if (scrollerElem) {
        scrollerElem.removeEventListener("scroll", update);
      }
    };
  }, [editor, updateTextFormatFloatingToolbar, anchorElem]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateTextFormatFloatingToolbar();
    });
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateTextFormatFloatingToolbar();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateTextFormatFloatingToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, updateTextFormatFloatingToolbar]);

  return (
    <div ref={popupCharStylesEditorRef} className="floating-text-format-popup">
      {editor.isEditable() && (
        <>
          <button
            onClick={formatH1Header}
            className={"popup-item spaced "}
            aria-label="Format text H1"
          >
            <H1Icon />
          </button>
          <button
            onClick={formatH2Header}
            className={"popup-item spaced "}
            aria-label="Format text H2"
          >
            <H2Icon />
          </button>
          <button
            onClick={formatH3Header}
            className={"popup-item spaced "}
            aria-label="Format text H2"
          >
            <H3Icon />
          </button>
          <Devider />
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
            }}
            className={"popup-item spaced " + (isBold ? "active" : "")}
            aria-label="Format text as bold"
          >
            {/* <i className="format bold" />{" "} */}
            <BoldIcon />
          </button>
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
            }}
            className={"popup-item spaced " + (isItalic ? "active" : "")}
            aria-label="Format text as italics"
          >
            <ItalicIcon />
          </button>
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
            }}
            className={"popup-item spaced " + (isUnderline ? "active" : "")}
            aria-label="Format text to underlined"
          >
            <UnderlineIcon />
          </button>
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
            }}
            className={"popup-item spaced " + (isStrikethrough ? "active" : "")}
            aria-label="Format text with a strikethrough"
          >
            <StrikethroughIcon />
          </button>

          <Devider />
          {/* <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript");
            }}
            className={"popup-item spaced " + (isSubscript ? "active" : "")}
            title="Subscript"
            aria-label="Format Subscript"
          >
            <i className="format subscript" />
          </button>
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript");
            }}
            className={"popup-item spaced " + (isSuperscript ? "active" : "")}
            title="Superscript"
            aria-label="Format Superscript"
          >
            <i className="format superscript" />
          </button> */}

          {/* <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
            }}
            className={"popup-item spaced " + (isCode ? "active" : "")}
            aria-label="Insert code block"
          >
            <i className="format code" />
          </button> */}

          {/* <button
            onClick={insertLink}
            className={"popup-item spaced " + (isLink ? "active" : "")}
            aria-label="Insert link"
          >
            <i className="format link" />
          </button> */}

          <button
            onClick={insertNumberList}
            className={
              "popup-item spaced " +
              (isList && listType === "number" ? "active" : "")
            }
            aria-label="Insert list"
          >
            <NumberListIcon />
          </button>

          <button
            onClick={insertMarkedList}
            className={
              "popup-item spaced " +
              (isList && listType === "bullet" ? "active" : "")
            }
            aria-label="Insert bulled list"
          >
            <MarkedListIcon />
          </button>

          <button
            onClick={insertCheckList}
            className={
              "popup-item spaced " +
              (isList && listType === "check" ? "active" : "")
            }
            aria-label="Insert check list"
          >
            <CheckListIcon />
          </button>

          <Devider />

          <button
            onClick={formatTextLeftAlign}
            className={"popup-item spaced"}
            aria-label="left align"
          >
            <AlignLeftIcon />
          </button>

          <button
            onClick={formatTextCenterAlign}
            className={"popup-item spaced"}
            aria-label="center align"
          >
            <AlignCenterIcon />
          </button>

          <button
            onClick={formatTextRightAlign}
            className={"popup-item spaced"}
            aria-label="right align"
          >
            <AlignRightIcon />
          </button>

          <Devider />
          <button
            onClick={insertLink}
            className={"popup-item spaced "}
            aria-label="Insert link"
          >
            <LinkIcon />
          </button>

          <button
            onClick={formatSimpleBanner}
            className={"popup-item spaced"}
            aria-label="Insert banner"
          >
            <BannerIcon />
          </button>
        </>
      )}
      {/* <button
        onClick={insertComment}
        className={"popup-item spaced insert-comment"}
        aria-label="Insert comment"
      >
        <i className="format add-comment" />
      </button> */}
    </div>
  );
}

function useFloatingTextFormatToolbar(
  editor: LexicalEditor,
  anchorElem: HTMLElement
): JSX.Element | null {
  const [isText, setIsText] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isCode, setIsCode] = useState(false);

  const [isList, setIsList] = useState(false);
  const [listType, setListType] = useState<ListType | undefined>(undefined);

  const updatePopup = useCallback(() => {
    editor.getEditorState().read(() => {
      // Should not to pop up the floating toolbar when using IME input
      if (editor.isComposing()) {
        return;
      }
      const selection = $getSelection();
      const nativeSelection = window.getSelection();
      const rootElement = editor.getRootElement();

      if (
        nativeSelection !== null &&
        (!$isRangeSelection(selection) ||
          rootElement === null ||
          !rootElement.contains(nativeSelection.anchorNode))
      ) {
        setIsText(false);
        return;
      }

      if (!$isRangeSelection(selection)) {
        return;
      }

      const node = getSelectedNode(selection);

      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const elementKey = element.getKey();

      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsSubscript(selection.hasFormat("subscript"));
      setIsSuperscript(selection.hasFormat("superscript"));
      setIsCode(selection.hasFormat("code"));

      // Update links
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }

      //lists
      console.log("NODE IS ", node.getType(), parent?.getType());

      if ($isListNode(element)) {
        setIsList(true);
        const parentList = $getNearestNodeOfType<ListNode>(
          anchorNode,
          ListNode
        );
        const type = parentList
          ? parentList.getListType()
          : element.getListType();
        console.log(type);
        setListType(type);
      } else {
        setIsList(false);
        setListType(undefined);
      }

      if (
        !$isCodeHighlightNode(selection.anchor.getNode()) &&
        selection.getTextContent() !== ""
      ) {
        setIsText($isTextNode(node));
      } else {
        setIsText(false);
      }
    });
  }, [editor]);

  useEffect(() => {
    document.addEventListener("selectionchange", updatePopup);
    return () => {
      document.removeEventListener("selectionchange", updatePopup);
    };
  }, [updatePopup]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(() => {
        updatePopup();
      }),
      editor.registerRootListener(() => {
        if (editor.getRootElement() === null) {
          setIsText(false);
        }
      })
    );
  }, [editor, updatePopup]);

  if (!isText || isLink) {
    return null;
  }

  return createPortal(
    <TextFormatFloatingToolbar
      editor={editor}
      anchorElem={anchorElem}
      isLink={isLink}
      isBold={isBold}
      isItalic={isItalic}
      isStrikethrough={isStrikethrough}
      isSubscript={isSubscript}
      isSuperscript={isSuperscript}
      isUnderline={isUnderline}
      isCode={isCode}
      isList={isList}
      listType={listType}
    />,
    anchorElem
  );
}

export default function FloatingTextFormatToolbarPlugin({
  anchorElem = document.body,
}: {
  anchorElem?: HTMLElement;
}): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  return useFloatingTextFormatToolbar(editor, anchorElem);
}
