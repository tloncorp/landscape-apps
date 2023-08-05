import React, { useMemo, useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import SortIcon from '@/components/icons/SortIcon';
import { useIsMobile } from '@/logic/useMedia';
import useSidebarSort from '@/logic/useSidebarSort';
import ActionsModal, { Action } from '../ActionsModal';

type SidebarSorterProps = Omit<
  ReturnType<typeof useSidebarSort>,
  'sortChannels' | 'sortGroups' | 'sortRecordsBy'
>;

export default function SidebarSorter({
  sortOptions,
  setSortFn,
}: SidebarSorterProps) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const actions: Action[] = [];

  if (!isMobile) {
    actions.push({
      key: 'ordering',
      type: 'disabled',
      content: 'Group Ordering',
    });
  }

  Object.keys(sortOptions).forEach((k) => {
    actions.push({
      key: k,
      onClick: () => setSortFn(k),
      content: k,
    });
  });

  return (
    <ActionsModal
      open={open}
      onOpenChange={setOpen}
      actions={actions}
      asChild={false}
      triggerClassName="default-focus flex h-6 w-6 items-center rounded text-base font-semibold hover:bg-gray-50 sm:p-1"
      contentClassName="w-56"
      ariaLabel="Groups Sort Options"
    >
      <SortIcon className="h-6 w-6 text-gray-400 sm:h-4 sm:w-4" />
    </ActionsModal>
  );
}
