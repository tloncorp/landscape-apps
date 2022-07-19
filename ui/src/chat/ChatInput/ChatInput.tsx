import { Editor, JSONContent } from '@tiptap/react';
import { debounce } from 'lodash';
import cn from 'classnames';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useChatState, useChatDraft, usePact } from '@/state/chat';
import { ChatInline, ChatMemo, ChatStory } from '@/types/chat';
import MessageEditor, { useMessageEditor } from '@/components/MessageEditor';
import Avatar from '@/components/Avatar';
import ShipName from '@/components/ShipName';
import AddIcon from '@/components/icons/AddIcon';
import X16Icon from '@/components/icons/X16Icon';
import { useChatInfo, useChatStore } from '@/chat/useChatStore';
import ChatInputMenu from '@/chat/ChatInputMenu/ChatInputMenu';
import { useIsMobile } from '@/logic/useMedia';

interface ChatInputProps {
  whom: string;
  replying?: string;
  showReply?: boolean;
  className?: string;
  sendDisabled?: boolean;
  sendMessage: (whom: string, memo: ChatMemo) => void;
}

function convertMarkType(type: string): string {
  switch (type) {
    case 'italic':
      return 'italics';
    case 'code':
      return 'inline-code';
    case 'link':
      return 'href';
    default:
      return type;
  }
}

function convertTipTapType(type: string): string {
  switch (type) {
    case 'italics':
      return 'italic';
    case 'inline-code':
      return 'code';
    default:
      return type;
  }
}

function tipTapToString(json: JSONContent): string {
  if (json.content) {
    if (json.content.length === 1) {
      if (json.type === 'blockquote') {
        const parsed = tipTapToString(json.content[0]);
        return Array.isArray(parsed)
          ? parsed.reduce((sum, item) => sum + item, '')
          : parsed;
      }

      return tipTapToString(json.content[0]);
    }

    return json.content.reduce((sum, item) => sum + tipTapToString(item), '');
  }

  if (json.marks && json.marks.length > 0) {
    const first = json.marks.pop();

    if (!first) {
      throw new Error('Unsure what this is');
    }

    if (first.type === 'link' && first.attrs) {
      return first.attrs.href;
    }

    return tipTapToString(json);
  }

  return json.text || '';
}

// this will be replaced with more sophisticated logic based on
// what we decide will be the message format
function parseTipTapJSON(json: JSONContent): ChatInline[] | ChatInline {
  if (json.content) {
    if (json.content.length === 1) {
      if (json.type === 'blockquote') {
        const parsed = parseTipTapJSON(json.content[0]);
        return {
          blockquote: Array.isArray(parsed) ? parsed : [parsed],
        } as ChatInline;
      }

      return parseTipTapJSON(json.content[0]);
    }

    /* Only allow two or less consecutive breaks */
    const breaksAdded: JSONContent[] = [];
    let count = 0;
    json.content.forEach((item) => {
      if (item.type === 'paragraph' && !item.content) {
        if (count === 1) {
          breaksAdded.push(item);
          count += 1;
        }
        return;
      }

      breaksAdded.push(item);

      if (item.type === 'paragraph' && item.content) {
        breaksAdded.push({ type: 'paragraph' });
        count = 1;
      }
    });

    return breaksAdded.reduce(
      (message, contents) => message.concat(parseTipTapJSON(contents)),
      [] as ChatInline[]
    );
  }

  if (json.marks && json.marks.length > 0) {
    const first = json.marks.pop();

    if (!first) {
      throw new Error('Unsure what this is');
    }

    if (first.type === 'link' && first.attrs) {
      return {
        link: {
          href: first.attrs.href,
          content: json.text || first.attrs.href,
        },
      };
    }

    return {
      [convertMarkType(first.type)]: parseTipTapJSON(json),
    } as unknown as ChatInline;
  }

  if (json.type === 'paragraph') {
    return {
      break: null,
    };
  }

  return json.text || '';
}

function wrapParagraphs(content: JSONContent[]) {
  let currentContent = content;
  const newContent: JSONContent[] = [];

  let index = currentContent.findIndex((item) => item.type === 'paragraph');
  while (index !== -1) {
    const head = currentContent.slice(0, index);
    const tail = currentContent.slice(index + 1, currentContent.length);

    if (head.length !== 0) {
      newContent.push({
        type: 'paragraph',
        content: head,
      });
    } else {
      newContent.push({
        type: 'paragraph',
      });
    }

    currentContent = tail;
    index = currentContent.findIndex((item) => item.type === 'paragraph');
  }

  if (newContent.length !== 0 && currentContent.length !== 0) {
    newContent.push({
      type: 'paragraph',
      content: currentContent,
    });
  }

  return newContent.length !== 0
    ? newContent
    : [{ type: 'paragraph', content }];
}

/* this parser is still imperfect */
function parseChatMessage(message: ChatStory): JSONContent {
  const parser = (inline: ChatInline): JSONContent => {
    if (typeof inline === 'string') {
      return { type: 'text', text: inline };
    }

    if ('blockquote' in inline) {
      return {
        type: 'blockquote',
        content: wrapParagraphs(inline.blockquote.map(parser)),
      };
    }

    const keys = Object.keys(inline);
    const simple = keys.find((k) => ['code', 'tag'].includes(k));
    if (simple) {
      return {
        type: 'text',
        marks: [{ type: convertTipTapType(simple) }],
        text: (inline as any)[simple] || '',
      };
    }

    const recursive = keys.find((k) =>
      ['bold', 'italics', 'strike', 'inline-code'].includes(k)
    );
    if (recursive) {
      const item = (inline as any)[recursive];
      const hasNestedContent = typeof item === 'object';
      const content = hasNestedContent ? parser(item) : item;

      if (hasNestedContent) {
        const marks = content.marks ? content.marks : [];

        return {
          type: 'text',
          marks: marks.concat([{ type: convertTipTapType(recursive) }]),
          text: content.text,
        };
      }

      return {
        type: 'text',
        marks: [{ type: convertTipTapType(recursive) }],
        text: content,
      };
    }

    return { type: 'paragraph' };
  };

  if (message.inline.length === 0) {
    return {
      type: 'doc',
      content: [{ type: 'paragraph' }],
    };
  }

  const content = wrapParagraphs(message.inline.map(parser));
  return {
    type: 'doc',
    content,
  };
}

export default function ChatInput({
  whom,
  showReply = false,
  replying,
  className = '',
  sendDisabled = false,
  sendMessage,
}: ChatInputProps) {
  const draft = useChatDraft(whom);
  const pact = usePact(whom);
  const chatInfo = useChatInfo(whom);
  const reply = replying || chatInfo?.replying || null;
  const replyingWrit = reply && pact.writs.get(pact.index[reply]);
  const ship = replyingWrit && replyingWrit.memo.author;
  const isMobile = useIsMobile();

  const closeReply = useCallback(() => {
    useChatStore.getState().reply(whom, null);
  }, [whom]);

  const onUpdate = useMemo(
    () =>
      debounce(({ editor }) => {
        if (!whom) {
          return;
        }

        const data = parseTipTapJSON(editor?.getJSON());
        useChatState.getState().draft(whom, {
          inline: Array.isArray(data) ? data : [data],
          block: [],
        });
      }, 1000),
    [whom]
  );

  useEffect(() => () => onUpdate.cancel(), [onUpdate]);

  const onSubmit = useCallback(
    async (editor: Editor) => {
      if (!editor.getText()) {
        return;
      }

      const data = parseTipTapJSON(editor?.getJSON());
      console.log(editor.getJSON());
      const memo: ChatMemo = {
        replying: reply,
        author: `~${window.ship || 'zod'}`,
        sent: Date.now(),
        content: {
          story: {
            inline: Array.isArray(data) ? data : [data],
            block: [],
          },
        },
      };

      sendMessage(whom, memo);
      useChatState.getState().draft(whom, { inline: [], block: [] });
      editor?.commands.setContent('');
      setTimeout(() => closeReply(), 0);
    },
    [reply, whom, sendMessage, closeReply]
  );

  const messageEditor = useMessageEditor({
    content: '',
    placeholder: 'Message',
    onEnter: useCallback(
      ({ editor }) => {
        onSubmit(editor);
        return true;
      },
      [onSubmit]
    ),
    onUpdate,
  });

  useEffect(() => {
    if (whom) {
      messageEditor?.commands.setContent('');
      useChatState.getState().getDraft(whom);
    }
  }, [whom, messageEditor]);

  useEffect(() => {
    if (reply) {
      messageEditor?.commands.focus();
    }
  }, [reply, messageEditor]);

  useEffect(() => {
    if (draft && messageEditor) {
      const current = tipTapToString(messageEditor.getJSON());
      const newDraft = tipTapToString(parseChatMessage(draft));
      if (current !== newDraft) {
        messageEditor.commands.setContent(parseChatMessage(draft), true);
      }
    }
  }, [draft, messageEditor]);

  const onClick = useCallback(
    () => messageEditor && onSubmit(messageEditor),
    [messageEditor, onSubmit]
  );

  if (!messageEditor) {
    return null;
  }

  return (
    <>
      <div className={cn('flex w-full items-end space-x-2', className)}>
        <div className="flex-1">
          {showReply && ship && reply ? (
            <div className="mb-4 flex items-center justify-start font-semibold">
              <span className="text-gray-600">Replying to</span>
              <Avatar size="xs" ship={ship} className="ml-2" />
              <ShipName name={ship} showAlias className="ml-2" />
              <button className="icon-button ml-auto" onClick={closeReply}>
                <X16Icon className="h-4 w-4" />
              </button>
            </div>
          ) : null}
          <div className="flex items-center justify-end">
            <MessageEditor editor={messageEditor} className="w-full" />
            <button
              // this is not contained by relative because of a bug in radix popovers
              className="absolute mr-2 hidden text-gray-600 hover:text-gray-800"
              aria-label="Add attachment"
              onClick={() => {
                sendMessage(whom, {
                  replying: null,
                  author: `~${window.ship || 'zod'}`,
                  sent: Date.now(),
                  content: {
                    story: {
                      inline: [],
                      block: [
                        {
                          image: {
                            src: 'https://nyc3.digitaloceanspaces.com/hmillerdev/nocsyx-lassul/2022.3.21..22.06.42-FBqq4mCVkAM8Cs5.jpeg',
                            width: 750,
                            height: 599,
                            alt: '',
                          },
                        },
                      ],
                    },
                  },
                });
              }}
            >
              <AddIcon className="h-6 w-4" />
            </button>
          </div>
        </div>
        <button className="button" disabled={sendDisabled} onClick={onClick}>
          Send
        </button>
      </div>
      {isMobile && messageEditor.isFocused ? (
        <ChatInputMenu editor={messageEditor} />
      ) : null}
    </>
  );
}
