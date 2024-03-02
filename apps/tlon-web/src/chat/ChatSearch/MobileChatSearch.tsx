import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { VirtuosoHandle } from 'react-virtuoso';

import ChatSearchResults from '@/chat/ChatSearch/ChatSearchResults';
import SearchBar from '@/chat/ChatSearch/SearchBar';
import Layout from '@/components/Layout/Layout';
import { CHANNEL_SEARCH_RESULT_SIZE } from '@/constants';
import { useSafeAreaInsets } from '@/logic/native';
import useDebounce from '@/logic/useDebounce';
import useShowTabBar from '@/logic/useShowTabBar';
import { useChannelSearch } from '@/state/channel/channel';
import { useSearchState } from '@/state/chat/search';

export default function MobileChatSearch() {
  const params = useParams<{
    chShip?: string;
    chName?: string;
    ship?: string;
    query?: string;
  }>();
  const navigate = useNavigate();
  const location = useLocation();
  const insets = useSafeAreaInsets();
  const scrollerRef = useRef<VirtuosoHandle>(null);
  const [searchInput, setSearchInput] = useState(params.query || '');
  const showTabBar = useShowTabBar();
  const shouldApplyPaddingBottom = showTabBar;

  const whom =
    params.chShip && params.chName
      ? `${params.chShip}/${params.chName}`
      : params.ship!;
  const {
    scan,
    isLoading,
    fetchNextPage,
    oldestMessageSearched,
    depth,
    hasNextPage,
  } = useChannelSearch(`chat/${whom}`, params.query || '');
  const history = useSearchState.getState().history[whom];

  const root = location.pathname.split('/search')[0];
  const debouncedSearch = useDebounce((input: string) => {
    if (!input) {
      navigate(`${root}/search`);
      return;
    }

    navigate(`${root}/search/${encodeURIComponent(input)}`);
  }, 500);

  useEffect(() => {
    const numResults = scan.toArray().length;
    if (!isLoading && numResults < CHANNEL_SEARCH_RESULT_SIZE) {
      fetchNextPage();
    }
  }, [fetchNextPage, isLoading, scan, depth]);

  const setValue = (newValue: string) => {
    setSearchInput(newValue);
    debouncedSearch(newValue);
  };

  const repeatRecentSearch = (query: string) => {
    setSearchInput(query);
    navigate(`${root}/search/${encodeURIComponent(query)}`);
  };

  const showRecentQueries =
    !params.query && history && history.queries.length > 0;
  const showRecentResults =
    !params.query && history && history.lastQuery && history.lastQuery.result;

  return (
    <Layout
      className="flex-1 bg-white px-4"
      style={{ paddingBottom: shouldApplyPaddingBottom ? 50 : 0 }}
      header={
        <div className="mt-2 flex" style={{ paddingTop: insets.top }}>
          <SearchBar
            value={searchInput}
            setValue={setValue}
            placeholder="Search "
            isSmall={true}
          />
          <button
            className="ml-4 text-lg font-semibold"
            onClick={() => navigate(root)}
          >
            Cancel
          </button>
        </div>
      }
    >
      <div className="pb-4 z-30 flex h-full w-full flex-col pt-4">
        {showRecentQueries && (
          <div className="mb-4 flex flex-col items-start">
            <p className="mb-4 text-sm font-semibold text-gray-400">
              Recent Searches
            </p>
            {history.queries.map((query, i) => (
              <button
                key={i}
                className="mb-2 rounded-md bg-gray-50 px-3 py-2 text-lg hover:bg-gray-100 focus:bg-gray-100"
                onClick={() => repeatRecentSearch(query)}
              >
                "{query}"
              </button>
            ))}
          </div>
        )}

        {showRecentResults && (
          <p className="mb-4 text-sm font-semibold text-gray-400">
            Recent Search for "{history.lastQuery.query}"
          </p>
        )}

        <ChatSearchResults
          ref={scrollerRef}
          whom={whom}
          root={root}
          scan={showRecentResults ? history.lastQuery.result : scan}
          searchDetails={{
            numResults: showRecentResults
              ? history.lastQuery.result.size
              : scan.toArray().length,
            depth,
            oldestMessageSearched,
            searchComplete: !hasNextPage,
          }}
          isLoading={!showRecentResults && isLoading}
          query={
            showRecentResults ? history.lastQuery.query : params.query || ''
          }
          selected={-1}
          withHeader={!showRecentResults}
          endReached={fetchNextPage}
        />
      </div>
    </Layout>
  );
}
