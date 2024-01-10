import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { decToUd } from '@urbit/api';
import { useCopy, useIsDmOrMultiDm } from '@/logic/utils';
import { canWriteChannel } from '@/logic/channel';
import { useAmAdmin, useGroup, useRouteGroup, useVessel } from '@/state/groups';
import {
  useAddDMReplyReactMutation,
  useDeleteDMReplyMutation,
  useMessageToggler,
} from '@/state/chat';
import IconButton from '@/components/IconButton';
import useEmoji from '@/state/emoji';
import BubbleIcon from '@/components/icons/BubbleIcon';
import FaceIcon from '@/components/icons/FaceIcon';
import XIcon from '@/components/icons/XIcon';
import { useChatDialog } from '@/chat/useChatStore';
import CopyIcon from '@/components/icons/CopyIcon';
import CheckIcon from '@/components/icons/CheckIcon';
import EmojiPicker from '@/components/EmojiPicker';
import ConfirmationModal from '@/components/ConfirmationModal';
import ActionMenu, { Action } from '@/components/ActionMenu';
import { useIsMobile } from '@/logic/useMedia';
import useGroupPrivacy from '@/logic/useGroupPrivacy';
import { captureGroupsAnalyticsEvent } from '@/logic/analytics';
import AddReactIcon from '@/components/icons/AddReactIcon';
import {
  useAddPostReactMutation,
  useAddReplyReactMutation,
  useDeletePostMutation,
  useDeleteReplyMutation,
  usePerms,
  usePostToggler,
} from '@/state/channel/channel';
import { emptyReply, Reply } from '@/types/channel';
import VisibleIcon from '@/components/icons/VisibleIcon';
import HiddenIcon from '@/components/icons/HiddenIcon';

export default function ReplyMessageOptions(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  whom: string;
  reply: Reply;
  openReactionDetails: () => void;
  showReply?: boolean;
}) {
  const { open, onOpenChange, whom, reply, openReactionDetails, showReply } =
    props;
  const whomParts = whom.split('/');
  const alreadyHaveHan =
    whomParts[0] === 'chat' ||
    whomParts[0] === 'heap' ||
    whomParts[0] === 'diary';
  const nest = alreadyHaveHan ? whom : `chat/${whom}`;
  const { seal, memo } = reply.seal.id ? reply : emptyReply;
  const groupFlag = useRouteGroup();
  const isAdmin = useAmAdmin(groupFlag);
  const threadParentId = seal['parent-id'];
  const { didCopy, doCopy } = useCopy(
    `/1/chan/${nest}/msg/${threadParentId}/${seal.id}`
  );
  const { open: pickerOpen, setOpen: setPickerOpen } = useChatDialog(
    whom,
    seal.id,
    'picker'
  );
  const { open: deleteOpen, setOpen: setDeleteOpen } = useChatDialog(
    whom,
    seal.id,
    'delete'
  );
  // TODO: add delete mutation for parent DMs
  const { chShip, chName } = useParams();
  const isParent = threadParentId === seal.id;
  const [, setSearchParams] = useSearchParams();
  const { load: loadEmoji } = useEmoji();
  const isMobile = useIsMobile();
  const isDMorMultiDM = useIsDmOrMultiDm(whom);
  const perms = usePerms(isDMorMultiDM ? `fake/nest/${whom}` : nest);
  const vessel = useVessel(groupFlag, window.our);
  const group = useGroup(groupFlag);
  const { privacy } = useGroupPrivacy(groupFlag);
  const canWrite = canWriteChannel(perms, vessel, group?.bloc);
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate: deleteReply, isLoading: isDeleteReplyLoading } =
    useDeleteReplyMutation();
  const { mutate: deleteChatMessage, isLoading: isDeleteChatMessageLoading } =
    useDeletePostMutation();
  const { mutate: deleteDMReply, isLoading: isDeleteDMReplyLoading } =
    useDeleteDMReplyMutation();
  const { mutate: addFeelToChat } = useAddPostReactMutation();
  const { mutate: addFeelToReply } = useAddReplyReactMutation();
  const { mutate: addDMReplyFeel } = useAddDMReplyReactMutation();
  const deleteLoading =
    isDeleteReplyLoading ||
    isDeleteChatMessageLoading ||
    isDeleteDMReplyLoading;

  const {
    show: showPost,
    hide: hidePost,
    isHidden: isPostHidden,
  } = usePostToggler(seal.id);
  const {
    show: showChatMessage,
    hide: hideChatMessage,
    isHidden: isMessageHidden,
  } = useMessageToggler(seal.id);
  const isHidden = useMemo(
    () => isMessageHidden || isPostHidden,
    [isMessageHidden, isPostHidden]
  );

  const onDelete = async () => {
    if (isMobile) {
      onOpenChange(false);
    }

    try {
      if (isDMorMultiDM) {
        deleteDMReply({
          whom,
          writId: threadParentId!,
          replyId: seal.id,
        });
      } else if (isParent) {
        deleteChatMessage({
          nest,
          time: decToUd(threadParentId),
        });
        navigate(`/groups/${groupFlag}/channels/chat/${chShip}/${chName}`);
      } else {
        deleteReply({
          nest,
          postId: threadParentId!,
          replyId: seal.id,
        });
      }
    } catch (e) {
      console.log('Failed to delete message', e);
    }
  };

  const onCopy = useCallback(() => {
    doCopy();

    if (isMobile) {
      setTimeout(() => {
        onOpenChange(false);
      }, 2000);
    }
  }, [doCopy, isMobile, onOpenChange]);

  const setReplyParam = useCallback(() => {
    setSearchParams({ reply: seal.id }, { replace: true });
  }, [seal, setSearchParams]);

  const onEmoji = useCallback(
    (emoji: { shortcodes: string }) => {
      if (isDMorMultiDM) {
        addDMReplyFeel({
          whom,
          writId: threadParentId!,
          replyId: seal.id,
          react: emoji.shortcodes,
        });
      } else if (isParent) {
        addFeelToChat({
          nest,
          postId: seal.id,
          react: emoji.shortcodes,
        });
      } else {
        addFeelToReply({
          nest,
          postId: threadParentId!,
          replyId: seal.id,
          react: emoji.shortcodes,
        });
      }
      captureGroupsAnalyticsEvent({
        name: 'react_item',
        groupFlag,
        chFlag: whom,
        channelType: 'chat',
        privacy,
      });
      setPickerOpen(false);
    },
    [
      nest,
      whom,
      groupFlag,
      privacy,
      seal,
      setPickerOpen,
      addFeelToChat,
      isDMorMultiDM,
      addFeelToReply,
      addDMReplyFeel,
      threadParentId,
      isParent,
    ]
  );

  const openPicker = useCallback(() => setPickerOpen(true), [setPickerOpen]);

  useEffect(() => {
    if (isMobile) {
      loadEmoji();
    }
  }, [isMobile, loadEmoji]);

  const toggleMsg = useCallback(
    () => (isMessageHidden ? showChatMessage() : hideChatMessage()),
    [isMessageHidden, showChatMessage, hideChatMessage]
  );

  const togglePost = useCallback(
    () => (isPostHidden ? showPost() : hidePost()),
    [isPostHidden, showPost, hidePost]
  );

  const showReactAction = canWrite;
  // TODO handle reply replies
  const showCopyAction = !!groupFlag;
  const showDeleteAction = isAdmin || window.our === memo.author;
  const reactionsCount = Object.keys(seal.reacts).length;

  const actions: Action[] = [];

  if (showReactAction) {
    actions.push({
      key: 'react',
      content: (
        <div className="flex items-center" aria-label="React">
          <AddReactIcon className="mr-2 h-6 w-6" />
          React
        </div>
      ),
      onClick: () => {
        navigate(`picker/${seal.id}`, {
          state: { backgroundLocation: location },
        });
      },
    });
  }

  if (reactionsCount > 0) {
    actions.push({
      key: 'show-all-reactions',
      content: (
        <div className="flex items-center">
          <FaceIcon className="mr-2 h-6 w-6" />
          View Reactions
        </div>
      ),
      onClick: () => openReactionDetails(),
      keepOpenOnClick: false,
    });
  }

  if (showReply) {
    actions.push({
      key: 'reply',
      content: (
        <div className="flex items-center">
          <BubbleIcon className="mr-2 h-6 w-6" />
          Reply
        </div>
      ),
      onClick: setReplyParam,
    });
  }

  if (showCopyAction) {
    actions.push({
      key: 'copy',
      content: (
        <div className="flex items-center">
          {didCopy ? (
            <CheckIcon className="mr-2 h-6 w-6" />
          ) : (
            <CopyIcon className="mr-2 h-6 w-6" />
          )}
          {didCopy ? 'Copied!' : 'Copy'}
        </div>
      ),
      onClick: onCopy,
      keepOpenOnClick: true,
    });
  }

  actions.push({
    key: 'hide',
    onClick: isDMorMultiDM ? toggleMsg : togglePost,
    content: (
      <div className="flex items-center">
        {isHidden ? (
          <>
            <VisibleIcon className="mr-2 h-6 w-6" />
            Show Message
          </>
        ) : (
          <>
            <HiddenIcon className="mr-2 h-6 w-6" />
            Hide Message
          </>
        )}
      </div>
    ),
  });

  if (showDeleteAction) {
    actions.push({
      key: 'delete',
      type: 'destructive',
      content: (
        <div className="flex items-center">
          <XIcon className="mr-2 h-6 w-6" />
          Delete
        </div>
      ),
      onClick: () => setDeleteOpen(true),
      keepOpenOnClick: true,
    });
  }

  if (!open && !isMobile) {
    return null;
  }

  return (
    <>
      {isMobile ? (
        <ActionMenu open={open} onOpenChange={onOpenChange} actions={actions} />
      ) : (
        <div className="absolute -top-5 right-2 z-10">
          <div
            data-testid="chat-message-options"
            className="sticky top-0 flex space-x-0.5 rounded-lg border border-gray-100 bg-white p-[1px] align-middle"
          >
            {showReactAction && (
              <EmojiPicker
                open={pickerOpen}
                setOpen={setPickerOpen}
                onEmojiSelect={onEmoji}
                withTrigger={false}
              >
                <IconButton
                  icon={<FaceIcon className="h-6 w-6 text-gray-400" />}
                  label="React"
                  showTooltip
                  aria-label="React"
                  action={openPicker}
                />
              </EmojiPicker>
            )}
            {showReply && (
              <IconButton
                icon={<BubbleIcon className="h-6 w-6 text-gray-400" />}
                label="Reply"
                showTooltip
                action={setReplyParam}
              />
            )}
            {showCopyAction && (
              <IconButton
                icon={
                  didCopy ? (
                    <CheckIcon className="h-6 w-6 text-gray-400" />
                  ) : (
                    <CopyIcon className="h-6 w-6 text-gray-400" />
                  )
                }
                label="Copy"
                showTooltip
                action={onCopy}
              />
            )}
            {reactionsCount > 0 && (
              <IconButton
                icon={
                  <span className="align-baseline font-semibold text-gray-400">
                    {reactionsCount}
                  </span>
                }
                label="View Reactions"
                action={openReactionDetails}
              />
            )}
            {showDeleteAction && (
              <IconButton
                icon={<XIcon className="h-6 w-6 text-red" />}
                label="Delete"
                showTooltip
                action={() => setDeleteOpen(true)}
              />
            )}
          </div>
        </div>
      )}
      <ConfirmationModal
        title="Delete Message"
        message="Are you sure you want to delete this message?"
        onConfirm={onDelete}
        open={deleteOpen}
        setOpen={setDeleteOpen}
        confirmText="Delete"
        loading={deleteLoading}
        closeOnClickOutside={true}
      />
    </>
  );
}
