import { useCallback, useEffect, useMemo, useState } from 'react';
import cn from 'classnames';
import { useNavigate } from 'react-router';
import Dialog from '@/components/Dialog';
import {
  groupIsInitializing,
  useGang,
  useGangPreview,
  useGroupJoinInProgress,
  useRouteGroup,
} from '@/state/groups';
import GroupSummary from '@/groups/GroupSummary';
import useGroupJoin from '@/groups/useGroupJoin';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import {
  getFlagParts,
  getPrivacyFromPreview,
  isTalk,
  matchesBans,
  pluralRank,
  toTitleCase,
} from '@/logic/utils';
import { useConnectivityCheck } from '@/state/vitals';
import WidgetDrawer from '@/components/WidgetDrawer';
import { useIsMobile } from '@/logic/useMedia';
import ShipName from '@/components/ShipName';
import ShipConnection from '@/components/ShipConnection';
import Private16Icon from '@/components/icons/Private16Icon';
import Lock16Icon from '@/components/icons/Lock16Icon';
import Globe16Icon from '@/components/icons/Globe16Icon';
import GroupAvatar from '../GroupAvatar';

const LONG_JOIN_THRESHOLD = 10 * 1000;

function getGroupHeading(title: string, flag: string) {
  if (!title) return flag;
  return title.length > 60 ? `${title.slice(0, 59).trim()}...` : title;
}

export default function JoinGroupModal() {
  const [showLongJoinMessage, setShowLongJoinMessage] = useState(false);
  const navigate = useNavigate();
  const flag = useRouteGroup();
  const isMobile = useIsMobile();
  const nest = new URLSearchParams(window.location.search).get('nest');
  const id = new URLSearchParams(window.location.search).get('id');
  const type = new URLSearchParams(window.location.search).get('type');
  const gang = useGang(flag);
  const joinAlreadyInProgress = useGroupJoinInProgress(flag);
  const { ship } = getFlagParts(flag);
  const { data } = useConnectivityCheck(ship, { enabled: true });
  const { group, dismiss, reject, button, status } = useGroupJoin(
    flag,
    gang,
    true,
    nest && id && type ? { nest, id, type } : undefined
  );
  const preview = useGangPreview(flag);
  const privacy = preview ? getPrivacyFromPreview(preview) : null;
  const cordon = preview?.cordon || group?.cordon;
  const banned = cordon ? matchesBans(cordon, window.our) : null;

  const isJoining = status === 'loading' || joinAlreadyInProgress;
  const readyToNavigate = group && !groupIsInitializing(group);

  useEffect(() => {
    if (readyToNavigate && !isTalk) {
      navigate(`/groups/${flag}`);
    }
  }, [readyToNavigate, flag, navigate]);

  useEffect(() => {
    if (isJoining && !readyToNavigate && !showLongJoinMessage) {
      setTimeout(() => {
        setShowLongJoinMessage(true);
      }, LONG_JOIN_THRESHOLD);
    }
  }, [isJoining, readyToNavigate, showLongJoinMessage]);

  if (isMobile) {
    return (
      <WidgetDrawer
        open={true}
        onOpenChange={() => dismiss()}
        className="h-[60vh] px-8"
      >
        <div className="mt-6 flex w-full items-center">
          <GroupAvatar
            {...preview?.meta}
            className="flex-none"
            size="h-14 w-14"
          />
          <div className="ml-4">
            <h3
              className={cn(
                'mb-1 font-semibold',
                preview?.meta.title && 'text-xl leading-snug'
              )}
            >
              {getGroupHeading(preview?.meta.title || '', flag)}
            </h3>
            <p className="mb-1 text-gray-400">
              Hosted by <ShipName name={ship} />
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-gray-600">
              {privacy ? (
                <span className="inline-flex items-center space-x-1 capitalize">
                  {privacy === 'public' ? (
                    <Globe16Icon className="h-4 w-4" />
                  ) : privacy === 'private' ? (
                    <Lock16Icon className="h-4 w-4" />
                  ) : (
                    <Private16Icon className="h-4 w-4" />
                  )}
                  <span>{privacy}</span>
                </span>
              ) : null}
              {data && (
                <ShipConnection
                  type="combo"
                  ship={ship}
                  status={data?.status}
                  agent="channels-server"
                  app="channels"
                />
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex w-full items-center">
          <p>{preview?.meta.description}</p>
        </div>

        <div className="mt-12 flex w-full justify-end">
          {banned ? (
            <span className="inline-block px-2 font-semibold text-gray-600">
              {banned === 'ship'
                ? "You've been banned from this group"
                : `${toTitleCase(pluralRank(banned))} are banned`}
            </span>
          ) : (
            <>
              {gang.invite && status !== 'loading' ? (
                <button
                  className="button bg-red text-white dark:text-black"
                  onClick={reject}
                >
                  Reject Invite
                </button>
              ) : null}
              {isJoining ? (
                <div className="mt-4 flex w-full flex-col items-center">
                  <div className="flex items-center">
                    <span className="mr-2">
                      {showLongJoinMessage
                        ? 'Joining may take a bit...'
                        : 'Joining...'}
                    </span>
                    <LoadingSpinner className="h-5 w-4" />
                  </div>
                  {showLongJoinMessage && (
                    <p className="mt-3 px-8 text-sm text-gray-400">
                      No need to keep waiting here, the group will finish
                      joining in the background.
                    </p>
                  )}
                </div>
              ) : status === 'error' ? (
                <span className="text-red-500">Error</span>
              ) : (
                <button
                  className="button ml-2 bg-blue text-white dark:text-black"
                  onClick={button.action}
                  disabled={button.disabled}
                >
                  {button.text}
                </button>
              )}
            </>
          )}
        </div>
      </WidgetDrawer>
    );
  }

  return (
    <Dialog
      defaultOpen
      onOpenChange={() => dismiss()}
      containerClass="w-full max-w-md"
    >
      <div className="space-y-6">
        <h2 className="text-lg font-bold">Join This Group</h2>
        <GroupSummary flag={flag} preview={gang.preview} />
        <p>{gang.preview?.meta.description}</p>
        <div className="flex items-center justify-end space-x-2">
          <button
            className="secondary-button mr-auto bg-transparent"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
          {banned ? (
            <span className="inline-block px-2 font-semibold text-gray-600">
              {banned === 'ship'
                ? "You've been banned from this group"
                : `${toTitleCase(pluralRank(banned))} are banned`}
            </span>
          ) : (
            <>
              {gang.invite && status !== 'loading' ? (
                <button
                  className="button bg-red text-white dark:text-black"
                  onClick={reject}
                >
                  Reject Invite
                </button>
              ) : null}
              {status === 'loading' ? (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">Joining...</span>
                  <LoadingSpinner className="h-5 w-4" />
                </div>
              ) : status === 'error' ? (
                <span className="text-red-500">Error</span>
              ) : (
                <button
                  className="button ml-2 bg-blue text-white dark:text-black"
                  onClick={button.action}
                  disabled={button.disabled}
                >
                  {button.text}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </Dialog>
  );
}
