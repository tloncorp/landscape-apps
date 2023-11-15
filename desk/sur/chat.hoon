/-  g=groups, d=channel, dos=chat-2, uno=chat-1, zer=chat-0
/-  meta
|%
++  old
  |%
  ++  zero  zer
  ++  one   uno
  ++  two   dos
  --
::
::  $id: an identifier for chat messages
+$  id     (pair ship time)
::  $writ: a chat message
+$  writ   [seal essay]
::  $reply: a chat reply
+$  reply   [reply-seal memo:d]
::  $react: either an emoji identifier like :wave: or a URL for custom
+$  react   @ta
::  $scan: search results
+$  scan  (list reference)
::  $blocked: a set of ships that the user has blocked
+$  blocked  (set ship)
+$  blocked-by  (set ship)
+$  hidden-messages  (set id)
+$  message-toggle
  $%  [%hide =id]
      [%show =id]
  ==
+$  reference
  $%  [%writ =writ]
      [%reply =id =reply]
  ==
::
::  $seal: the id of a chat and its meta-responses
::
::    id: the id of the message
::    time: the time the message was received
::    replies: set of replies to a message
::    reacts: reactions to a message
::
+$  seal
  $:  =id
      time=id-post:d
      =reacts
      =replies
      meta=reply-meta
  ==
+$  reply-meta
  $:  reply-count=@ud
      last-repliers=(set ship)
      last-reply=(unit time)
  ==
::
::  $reply-seal: chat reply metadata
+$  reply-seal
  $:  =id
      parent-id=id
      time=id-post:d
      =reacts
  ==
::
::  $essay: a chat message with metadata
+$  essay  [memo:d %chat =kind]
::  $kind: whether or not the chat is a system message
+$  kind  $@(~ [%notice ~])
::  $reacts: a set of reactions to a chat message
+$  reacts  (map ship react)
::
::  $pact: a double indexed map of chat messages, id -> time -> message
::
+$  pact
  $:  wit=writs
      dex=index
  ==
::
::  $paged-writs: a set of time ordered chat messages, with page cursors
::
+$  paged-writs
  $:  =writs
      newer=(unit id)
      older=(unit id)
      total=@ud
  ==
::
::  $writs: a set of time ordered chat messages
::
++  writs
  =<  writs
  |%
  +$  writs
    ((mop time writ) lte)
  ++  on
    ((^on time writ) lte)
  +$  diff
    (pair id delta)
  +$  delta
    ::  time and meta are units because we won't have it when we send,
    ::  but we need it upon receipt
    $%  [%add =memo:d =kind time=(unit time)]
        [%del ~]
        [%reply =id meta=(unit reply-meta) =delta:replies]
        [%add-react =ship =react]
        [%del-react =ship]
    ==
  +$  response  [=id response=response-delta]
  +$  response-delta
    $%  [%add =memo:d =time]
        [%del ~]
        [%reply =id meta=(unit reply-meta) delta=response-delta:replies]
        [%add-react =ship =react]
        [%del-react =ship]
    ==
  --
::
::  $replies: a set of time ordered chat replies
::
++  replies
  =<  replies
  |%
  +$  replies
    ((mop time reply) lte)
  ++  on
    ((^on time reply) lte)
  +$  delta
    $%  [%add =memo:d time=(unit time)]
        [%del ~]
        [%add-react =ship =react]
        [%del-react =ship]
    ==
  +$  response-delta
    $%  [%add =memo:d =time]
        [%del ~]
        [%add-react =ship =react]
        [%del-react =ship]
    ==
  --
::
::  $index: a map of chat message id to server received message time
::
+$  index   (map id time)
::
::  $club: a direct line of communication between multiple parties
::
::    uses gossip to ensure all parties keep in sync
::
++  club
  =<  club
  |%
  ::  $id: an identification signifier for a $club
  ::
  +$  id  @uvH
  ::  $net: status of club
  ::
  +$  net  ?(%archive %invited %done)
  +$  club  [=heard =remark =pact =crew]
  ::
  ::  $crew: a container for the metadata for the club
  ::
  ::    team: members that have accepted an invite
  ::    hive: pending members that have been invited
  ::    met: metadata representing club
  ::    net: status
  ::    pin: should the $club be pinned to the top
  ::
  +$  crew
    $:  team=(set ship)
        hive=(set ship)
        met=data:meta
        =net
        pin=_|
    ==
  ::  $rsvp: a $club invitation response
  ::
  +$  rsvp    [=id =ship ok=?]
  ::  $create: a request to create a $club with a starting set of ships
  ::
  +$  create
    [=id hive=(set ship)]
  ::  $invite: the contents to send in an invitation to someone
  ::
  +$  invite  [=id team=(set ship) hive=(set ship) met=data:meta]
  ::  $uid: unique identifier for each club action
  ::
  +$  uid    @uv
  ::  $heard: the set of action uid's we've already heard
  ::
  +$  heard  (set uid)
  ::
  +$  diff    (pair uid delta)
  ::
  +$  delta
    $%  [%writ =diff:writs]
        [%meta meta=data:meta]
        [%team =ship ok=?]
        [%hive by=ship for=ship add=?]
        [%init team=(set ship) hive=(set ship) met=data:meta]
    ==
  ::
  +$  action  (pair id diff)
  --
::
::  $dm: a direct line of communication between two ships
::
::    net: status of dm
::    id: a message identifier
::    action: an update to the dm
::    rsvp: a response to a dm invitation
::
++  dm
  =<  dm
  |%
  +$  dm
    $:  =pact
        =remark
        =net
        pin=_|
    ==
  +$  net       ?(%inviting %invited %archive %done)
  +$  id        (pair ship time)
  +$  diff      diff:writs
  +$  action    (pair ship diff)
  +$  rsvp      [=ship ok=?]
  --
::
::  $whom: a polymorphic identifier for chats
::
+$  whom
  $%  [%ship p=ship]
      [%club p=id:club]
  ==
::
::  $unreads: a map of club/dm unread information
::
::    unread: the last time a message was read, how many messages since,
::    and the id of the last read message
::
++  unreads
  =<  unreads
  |%
  +$  unreads
    (map whom unread)
  +$  unread
    $:  recency=time
        count=@ud
        unread-id=(unit id)
        threads=(map id id)
    ==
  +$  update
    (pair whom unread)
  --
::
+$  remark
  [last-read=time watching=_| unread-threads=(set id)]
::
+$  remark-action
  (pair whom remark-diff)
::
+$  remark-diff
  $%  [%read ~]
      [%read-at p=time]
      [?(%watch %unwatch) ~]
  ==
--
