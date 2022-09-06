import classNames from 'classnames';
import {
  Editor,
  EditorContent,
  Extension,
  JSONContent,
  useEditor,
} from '@tiptap/react';
import React, { useCallback, useMemo, useState } from 'react';
import Document from '@tiptap/extension-document';
import Blockquote from '@tiptap/extension-blockquote';
import Placeholder from '@tiptap/extension-placeholder';
import Bold from '@tiptap/extension-bold';
import Code from '@tiptap/extension-code';
import Italic from '@tiptap/extension-italic';
import Strike from '@tiptap/extension-strike';
import Link from '@tiptap/extension-link';
import Text from '@tiptap/extension-text';
import History from '@tiptap/extension-history';
import Paragraph from '@tiptap/extension-paragraph';
import HardBreak from '@tiptap/extension-hard-break';
import { useIsMobile } from '@/logic/useMedia';
import ChatInputMenu from '@/chat/ChatInputMenu/ChatInputMenu';
import { refPasteRule, Shortcuts } from '@/logic/tiptap';
import { ChatBlock, Cite } from '@/types/chat';
import { useChatStore } from '@/chat/useChatStore';

interface HandlerParams {
  editor: Editor;
}

interface useMessageEditorParams {
  whom?: string;
  content: JSONContent | string;
  placeholder?: string;
  onEnter: ({ editor }: HandlerParams) => boolean;
  onUpdate?: ({ editor }: HandlerParams) => void;
}

export function useMessageEditor({
  whom,
  content,
  placeholder,
  onEnter,
  onUpdate,
}: useMessageEditorParams) {
  const onReference = useCallback(
    (r) => {
      if (!whom) {
        return;
      }
      const { chats, setBlocks } = useChatStore.getState();
      const blocks = chats[whom]?.blocks || [];
      setBlocks(whom, [...blocks, { cite: r }]);
    },
    [whom]
  );

  const keyMapExt = useMemo(
    () =>
      Shortcuts({
        Enter: ({ editor }) => onEnter({ editor } as any),
        'Shift-Enter': ({ editor }) =>
          editor.commands.first(({ commands }) => [
            () => commands.newlineInCode(),
            () => commands.createParagraphNear(),
            () => commands.liftEmptyBlock(),
            () => commands.splitBlock(),
          ]),
      }),
    [onEnter]
  );

  return useEditor(
    {
      extensions: [
        Blockquote,
        Bold,
        Code.extend({ excludes: undefined }),
        Document,
        HardBreak,
        History.configure({ newGroupDelay: 100 }),
        Italic,
        Link.configure({
          openOnClick: false,
        }),
        keyMapExt,
        Paragraph,
        Placeholder.configure({ placeholder }),
        Strike,
        Text.extend({
          addPasteRules() {
            return [refPasteRule(onReference)];
          },
        }),
      ],
      content: content || '',
      editorProps: {
        attributes: {
          class: 'input-inner',
          'aria-label': 'Message editor with formatting menu',
        },
      },
      onUpdate: ({ editor }) => {
        if (onUpdate) {
          onUpdate({ editor } as HandlerParams);
        }
      },
    },
    [keyMapExt, placeholder]
  );
}

interface MessageEditorProps {
  editor: Editor;
  className?: string;
  inputClassName?: string;
}

export default function MessageEditor({
  editor,
  className,
  inputClassName,
}: MessageEditorProps) {
  const isMobile = useIsMobile();
  return (
    <div className={classNames('input block p-0', className)}>
      {/* This is nested in a div so that the bubble  menu is keyboard accessible */}
      <EditorContent
        className={classNames('w-full', inputClassName)}
        editor={editor}
      />
      {!isMobile ? <ChatInputMenu editor={editor} /> : null}
    </div>
  );
}
