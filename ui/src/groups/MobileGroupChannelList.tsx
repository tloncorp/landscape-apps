import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGroupFlag, useGroup, useAmAdmin } from '@/state/groups';
import ChannelList, { ChannelSorter } from '@/groups/GroupSidebar/ChannelList';
import GroupAvatar from '@/groups/GroupAvatar';
import CaretLeft16Icon from '@/components/icons/CaretLeft16Icon';
import Add16Icon from '@/components/icons/Add16Icon';
import ReconnectingSpinner from '@/components/ReconnectingSpinner';
import HostConnection from '@/channels/HostConnection';
import { getFlagParts } from '@/logic/utils';
import { useConnectivityCheck } from '@/state/vitals';
import MobileHeader from '@/components/MobileHeader';
import AddIconMobileNav from '@/components/icons/AddIconMobileNav';

export default function MobileGroupChannelList() {
  const flag = useGroupFlag();
  const group = useGroup(flag);
  const isAdmin = useAmAdmin(flag);
  const location = useLocation();
  const host = getFlagParts(flag).ship;
  const { data } = useConnectivityCheck(host);
  const saga = group?.saga || null;

  return (
    <>
      <MobileHeader
        title={
          <div className="flex items-center justify-center">
            <div className="flex w-full items-center justify-center space-x-1">
              <h1 className="text-[18px] text-gray-800 line-clamp-1">
                {group?.meta.title}
              </h1>
              <HostConnection ship={host} status={data?.status} saga={saga} />
            </div>
          </div>
        }
        action={
          <div className="flex flex-row items-center space-x-3">
            <ReconnectingSpinner />
            <ChannelSorter isMobile={true} />
            {isAdmin && (
              <Link
                className="default-focus flex items-center p-1 text-base"
                to={`/groups/${flag}/channels/new`}
                state={{ backgroundLocation: location }}
              >
                <AddIconMobileNav className="h-8 w-8 text-black" />
              </Link>
            )}
          </div>
        }
        pathBack="/"
      />
      <ChannelList />
    </>
  );
}
