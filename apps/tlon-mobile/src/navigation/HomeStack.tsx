import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import {
  Icon,
  Sheet,
  Text,
  View,
  XStack,
  YStack,
  useStyle,
} from '@tloncorp/ui';
import React, { useCallback, useEffect, useState } from 'react';
import type { ListRenderItemInfo, StyleProp, ViewStyle } from 'react-native';
import { SectionList } from 'react-native';

import { GroupListItem } from '../components/GroupListItem';
import { useWebviewPositionContext } from '../contexts/webview/position';
import * as db from '../db';
import type { TabParamList } from '../types';

type Props = BottomTabScreenProps<TabParamList, 'Groups'>;

export const HomeStack = ({ navigation }: Props) => {
  const [sortSheetOpen, setSortSheetOpen] = useState(false);
  const { setVisibility } = useWebviewPositionContext();

  const pinnedGroups = db.useQuery<db.Group>(
    'Group',
    db.groupQuery({ isPinned: true, sortBy: 'pinIndex' })
  );
  const otherGroups = db.useQuery<db.Group>(
    'Group',
    db.groupQuery({
      isPinned: false,
      sortBy: 'lastPostAt',
      sortDirection: 'desc',
    })
  );

  const renderGroup = useCallback(({ item }: ListRenderItemInfo<db.Group>) => {
    return <GroupListItem model={item} />;
  }, []);

  const contentContainerStyle = useStyle(
    {
      gap: '$s',
      padding: '$l',
    },
    { resolveValues: 'value' }
    // Shouldn't have to cast this, since gap and padding will resolve to
    // numeric values, but I think tamagui's types are off here.
  ) as StyleProp<ViewStyle>;

  const handleSheetOpenChange = (open: boolean) => {
    console.log(`open: ${open}`);
    setSortSheetOpen(open);
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <XStack>
          <Icon
            type="Filter"
            pressStyle={{
              backgroundColor: '$secondaryBackground',
              borderRadius: '$s',
            }}
            onPress={() => setSortSheetOpen(true)}
          />
          <Icon
            type="Add"
            pressStyle={{
              backgroundColor: '$secondaryBackground',
              borderRadius: '$s',
            }}
            onPress={() => {}}
          />
        </XStack>
      ),
    });

    const unsubscribe = navigation.addListener('tabPress', () => {
      // hide the webview from other tabs
      setVisibility(false);
    });

    return unsubscribe;
  }, [navigation, setVisibility]);

  return (
    <View backgroundColor="$background" flex={1}>
      <SectionList
        sections={[
          ...(pinnedGroups.length > 0
            ? [{ name: 'Pinned', data: Array.from(pinnedGroups) }]
            : []),
          {
            name: pinnedGroups.length > 0 ? 'Other' : undefined,
            data: Array.from(otherGroups),
          },
        ]}
        renderItem={renderGroup}
        renderSectionHeader={({ section }) =>
          section.name ? (
            <Text
              paddingHorizontal="$l"
              paddingVertical="$xl"
              fontSize={'$s'}
              color="$secondaryText"
            >
              {section.name}
            </Text>
          ) : null
        }
        stickySectionHeadersEnabled={false}
        contentContainerStyle={contentContainerStyle}
        keyExtractor={getGroupId}
      />
      <Sheet
        open={sortSheetOpen}
        onOpenChange={handleSheetOpenChange}
        modal
        dismissOnSnapToBottom
        snapPointsMode="percent"
        snapPoints={[30]}
      >
        <Sheet.Overlay />
        <Sheet.Frame borderTopLeftRadius="$l" borderTopRightRadius="$l">
          <Sheet.Handle />
          <YStack padding="$xl">
            <Text fontSize="$l" fontWeight="500" color="$blue">
              A → Z
            </Text>
            <Text fontSize="$l" fontWeight="500">
              A → Z
            </Text>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </View>
  );
};

function getGroupId(group: db.Group) {
  return group.id;
}
