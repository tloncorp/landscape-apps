import cn from 'classnames';
import React, { useRef, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Route, Routes, useMatch, useParams } from 'react-router';
import { Helmet } from 'react-helmet';
import ChatInput from '@/chat/ChatInput/ChatInput';
import ChatWindow from '@/chat/ChatWindow';
import Layout from '@/components/Layout/Layout';
import { ViewProps } from '@/types/groups';
import { useRouteGroup } from '@/state/groups/groups';
import ChannelHeader from '@/channels/ChannelHeader';
import { isGroups } from '@/logic/utils';
import MagnifyingGlassIcon from '@/components/icons/MagnifyingGlassIcon';
import useMedia, { useIsMobile } from '@/logic/useMedia';
import ChannelTitleButton from '@/channels/ChannelTitleButton';
import { useDragAndDrop } from '@/logic/DragAndDropContext';
import { useFullChannel } from '@/logic/channel';
import MagnifyingGlassMobileNavIcon from '@/components/icons/MagnifyingGlassMobileNavIcon';
import {
  useAddPostMutation,
  useLeaveMutation,
  useReplyPost,
} from '@/state/channel/channel';
import ChannelSearch from '@/channels/ChannelSearch';
import { useIsScrolling } from '@/logic/scroll';
import { useChatInputFocus } from '@/logic/ChatInputFocusContext';
import ChatThread from './ChatThread/ChatThread';

function ChatChannel({ title }: ViewProps) {
  const { isChatInputFocused } = useChatInputFocus();
  // TODO: We need to reroute users who can't read the channel
  // const navigate = useNavigate();
  const { chShip, chName, idTime, idShip } = useParams<{
    name: string;
    chShip: string;
    ship: string;
    chName: string;
    idShip: string;
    idTime: string;
  }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const groupFlag = useRouteGroup();
  const chFlag = `${chShip}/${chName}`;
  const nest = `chat/${chFlag}`;
  const isMobile = useIsMobile();
  const isSmall = useMedia('(max-width: 1023px)');
  const inThread = !!idTime;
  const inSearch = useMatch(`/groups/${groupFlag}/channels/${nest}/search/*`);
  const { mutateAsync: leaveChat } = useLeaveMutation();
  const { mutate: sendMessage } = useAddPostMutation(nest);
  const dropZoneId = `chat-input-dropzone-${chFlag}`;
  const { isDragging, isOver } = useDragAndDrop(dropZoneId);
  const chatReplyId = useMemo(() => searchParams.get('reply'), [searchParams]);
  const replyingWrit = useReplyPost(nest, chatReplyId);
  const scrollElementRef = useRef<HTMLDivElement>(null);
  const isScrolling = useIsScrolling(scrollElementRef);
  const root = `/groups/${groupFlag}/channels/${nest}`;
  // We only inset the bottom for groups, since DMs display the navbar
  // underneath this view
  const shouldApplyPaddingBottom = useMemo(
    () => isGroups && isMobile && !isChatInputFocused,
    [isMobile, isChatInputFocused]
  );

  const {
    group,
    groupChannel: channel,
    canWrite,
    compat: { compatible, text },
  } = useFullChannel({
    groupFlag,
    nest,
  });

  return (
    <>
      <Layout
        style={{
          paddingBottom: shouldApplyPaddingBottom ? 50 : 0,
        }}
        className="padding-bottom-transition flex-1 bg-white"
        header={
          <Routes>
            {!isMobile && (
              <Route
                path="search/:query?"
                element={
                  <>
                    <ChannelSearch
                      whom={nest}
                      root={root}
                      placeholder={
                        channel ? `Search in ${channel.meta.title}` : 'Search'
                      }
                    >
                      <ChannelTitleButton flag={groupFlag} nest={nest} />
                    </ChannelSearch>
                    <Helmet>
                      <title>
                        {channel && group
                          ? `${channel.meta.title} in ${group.meta.title} Search`
                          : 'Search'}
                      </title>
                    </Helmet>
                  </>
                }
              />
            )}
            <Route
              path="*"
              element={
                <ChannelHeader
                  groupFlag={groupFlag}
                  nest={nest}
                  prettyAppName="Chat"
                  leave={leaveChat}
                >
                  <Link
                    to="search/"
                    className={cn(
                      isMobile
                        ? ''
                        : 'default-focus flex h-6 w-6 items-center justify-center rounded hover:bg-gray-50'
                    )}
                    aria-label="Search Chat"
                  >
                    {isMobile ? (
                      <MagnifyingGlassMobileNavIcon className="h-6 w-6 text-gray-800" />
                    ) : (
                      <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
                    )}
                  </Link>
                </ChannelHeader>
              }
            />
          </Routes>
        }
        footer={
          <div
            className={cn(
              (isDragging || isOver) && !inThread
                ? ''
                : 'border-t-2 border-gray-50 p-3 sm:p-4'
            )}
          >
            {compatible && canWrite ? (
              <ChatInput
                key={chFlag}
                whom={chFlag}
                sendChatMessage={sendMessage}
                showReply
                autoFocus={!inThread && !inSearch}
                dropZoneId={dropZoneId}
                replyingWrit={replyingWrit || undefined}
                isScrolling={isScrolling}
              />
            ) : !canWrite && compatible ? null : (
              <div className="rounded-lg border-2 border-transparent bg-gray-50 px-2 py-1 leading-5 text-gray-600">
                {text}
              </div>
            )}
          </div>
        }
      >
        <Helmet>
          <title>
            {channel && group
              ? `${channel.meta.title} in ${group.meta.title} ${title}`
              : title}
          </title>
        </Helmet>
        <ChatWindow
          scrollElementRef={scrollElementRef}
          isScrolling={isScrolling}
          whom={chFlag}
          root={root}
        />
      </Layout>
      <Routes>
        {isSmall ? null : (
          <Route
            path="message/:idTime/:idReplyTime?"
            element={<ChatThread />}
          />
        )}
      </Routes>
    </>
  );
}

export default ChatChannel;
