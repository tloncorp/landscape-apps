/-  c=chat, g=groups
/-  meta
/-  ha=hark
/-  e=epic
/-  contacts
/+  default-agent, verb-lib=verb, dbug
/+  pac=dm
/+  ch=chat-hark, volume
/+  gra=graph-store
/+  epos-lib=saga
/+  wood-lib=wood
/+  mig=chat-graph
::  performance, keep warm
/+  chat-json
/*  desk-bill  %bill  /desk/bill
^-  agent:gall
=>
  |%
  +$  card  card:agent:gall
  ++  def-flag  `flag:c`[~zod %test]
  ++  wood-state
    ^-  state:wood-lib
    :*  ver=|
        odd=&
        veb=|
    ==
  ++  club-eq  2 :: reverb control: max number of forwards for clubs
  +$  current-state
    $:  %4
        chats=(map flag:c chat:c)
        dms=(map ship dm:c)
        clubs=(map id:club:c club:c)
        drafts=(map whom:c story:c)
        pins=(list whom:c)
        blocked=(set ship)
        blocked-by=(set ship)
        hidden-messages=(set id:c)
        bad=(set ship)
        inv=(set ship)
        voc=(map [flag:c id:c] (unit said:c))
        fish=(map [flag:c @] id:c)
        ::  true represents imported, false pending import
        imp=(map flag:c ?)
    ==
  --
=|  current-state
=*  state  -
=<
  %+  verb-lib  |
  %-  agent:dbug
  |_  =bowl:gall
  +*  this  .
      def   ~(. (default-agent this %|) bowl)
      cor   ~(. +> [bowl ~])
  ++  on-init
    ^-  (quip card _this)
    =^  cards  state
      abet:init:cor
    [cards this]
  ::
  ++  on-save  !>([state okay:c])
  ++  on-load
    |=  =vase
    ^-  (quip card _this)
    =^  cards  state
      abet:(load:cor vase)
    [cards this]
  ::
  ++  on-poke
    |=  [=mark =vase]
    ^-  (quip card _this)
    =^  cards  state
      abet:(poke:cor mark vase)
    [cards this]
  ++  on-watch
    |=  =path
    ^-  (quip card _this)
    =^  cards  state
      abet:(watch:cor path)
    [cards this]
  ::
  ++  on-peek   peek:cor
  ::
  ++  on-leave   on-leave:def
  ++  on-fail    on-fail:def
  ::
  ++  on-agent
    |=  [=wire =sign:agent:gall]
    ^-  (quip card _this)
    =^  cards  state
      abet:(agent:cor wire sign)
    [cards this]
  ++  on-arvo
    |=  [=wire sign=sign-arvo]
    ^-  (quip card _this)
    =^  cards  state
      abet:(arvo:cor wire sign)
    [cards this]
  --
|_  [=bowl:gall cards=(list card)]
+*  epos  ~(. epos-lib [bowl %chat-update okay:c])
    wood   ~(. wood-lib [bowl wood-state])
++  abet  [(flop cards) state]
++  cor   .
++  emit  |=(=card cor(cards [card cards]))
++  emil  |=(caz=(list card) cor(cards (welp (flop caz) cards)))
++  give  |=(=gift:agent:gall (emit %give gift))
++  now-id   `id:c`[our now]:bowl
++  init
  ^+  cor
  watch-groups
::  +load: load next state
++  load
  |=  =vase
  |^  ^+  cor
  =+  !<([old=versioned-state cool=epic:e] vase)
  |-
  ?-  -.old
    %0  $(old (state-0-to-1 old))
    %1  $(old (state-1-to-2 old))
    %2  $(old (state-2-to-3 old))
    %3  $(old (state-3-to-4 old))
    ::
      %4
    =.  state  old
    =.  cor  restore-missing-subs
    =.  cor  (emit %pass ca-area:ca-core:cor %agent [our.bowl dap.bowl] %poke %recheck-all-perms !>(0))
    =.  cor  (emit %pass ca-area:ca-core:cor %agent [our.bowl dap.bowl] %poke %leave-old-channels !>(0))
    ?:  =(okay:c cool)  cor
    :: =?  cor  bad  (emit (keep !>(old)))
    %-  (note:wood %ver leaf/"New Epic" ~)
    =.  cor  (emil (drop load:epos))
    =/  chats  ~(tap in ~(key by chats))
    |-
    ?~  chats
      cor
    =.  cor
      ca-abet:ca-upgrade:(ca-abed:ca-core i.chats)
    $(chats t.chats)
  ==
  ::
  ++  restore-missing-subs
    %+  roll
      ~(tap by chats)
    |=  [[=flag:c *] core=_cor]
    ca-abet:ca-safe-sub:(ca-abed:ca-core:core flag)
  ::
  ++  keep
    |=  bad=^vase
    ^-  card
    ~&  >  %keep
    [%pass /keep/chat %arvo %k %fard q.byk.bowl %keep %noun bad]
  ::
  +$  versioned-state
    $%  current-state
        state-3
        state-2
        state-1
        state-0
    ==
  +$  state-0
    $:  %0
        chats=(map flag:zero chat:zero)
        dms=(map ship dm:zero)
        clubs=(map id:club:zero club:zero)
        drafts=(map whom:zero story:zero)
        pins=(list whom:zero)
        bad=(set ship)
        inv=(set ship)
        voc=(map [flag:zero id:zero] (unit said:zero))
        fish=(map [flag:zero @] id:zero)
        ::  true represents imported, false pending import
        imp=(map flag:zero ?)
    ==
  +$  state-1
    $:  %1
        chats=(map flag:one chat:one)
        dms=(map ship dm:one)
        clubs=(map id:club:one club:one)
        drafts=(map whom:one story:one)
        pins=(list whom:one)
        bad=(set ship)
        inv=(set ship)
        voc=(map [flag:one id:one] (unit said:one))
        fish=(map [flag:one @] id:one)
        ::  true represents imported, false pending import
        imp=(map flag:one ?)
    ==
  +$  state-2
    $:  %2
        chats=(map flag:c chat:c)
        dms=(map ship dm:c)
        clubs=(map id:club:c club:c)
        drafts=(map whom:c story:c)
        pins=(list whom:c)
        bad=(set ship)
        inv=(set ship)
        voc=(map [flag:c id:c] (unit said:c))
        fish=(map [flag:c @] id:c)
        ::  true represents imported, false pending import
        imp=(map flag:c ?)
    ==
  ::
  +$  state-3
    $:  %3
        chats=(map flag:c chat:c)
        dms=(map ship dm:c)
        clubs=(map id:club:c club:c)
        drafts=(map whom:c story:c)
        pins=(list whom:c)
        blocked=(set ship)
        blocked-by=(set ship)
        bad=(set ship)
        inv=(set ship)
        voc=(map [flag:c id:c] (unit said:c))
        fish=(map [flag:c @] id:c)
        ::  true represents imported, false pending import
        imp=(map flag:c ?)
    ==
  +$  state-4  current-state
  ++  zero     zero:old:c
  ++  one      one:old:c
  ++  two      c
  ++  state-3-to-4
    |=  s=state-3
    ^-  state-4
    %*  .  *state-4
      dms     dms.s
      clubs   clubs.s
      drafts  drafts.s
      pins    pins.s
      blocked  blocked.s
      blocked-by  blocked-by.s
      hidden-messages  ~
      bad     bad.s
      inv     inv.s
      fish    fish.s
      voc     voc.s
      chats   chats.s
    ==
  ++  state-2-to-3
    |=  s=state-2
    ^-  state-3
    %*  .  *state-3
      dms     dms.s
      clubs   clubs.s
      drafts  drafts.s
      pins    pins.s
      blocked  ~
      blocked-by  ~
      bad     bad.s
      inv     inv.s
      fish    fish.s
      voc     voc.s
      chats   chats.s
    ==
  ++  state-1-to-2
    |=  s=state-1
    ^-  state-2
    %*  .  *state-2
      dms     dms.s
      clubs   (clubs-1-to-2 clubs.s)
      drafts  drafts.s
      pins    pins.s
      bad     bad.s
      inv     inv.s
      fish    fish.s
      voc     voc.s
      chats   chats.s
    ==
  ::
  ++  clubs-1-to-2
    |=  clubs=(map id:club:one club:one)
    ^-  (map id:club:two club:two)
    %-  ~(run by clubs)
    |=  =club:one
    [*heard:club:two club]
  ::
  ++  state-0-to-1
    |=  s=state-0
    ^-  state-1
    %*  .  *state-1
      dms     dms.s
      clubs   (clubs-0-to-1 clubs.s)
      drafts  drafts.s
      pins    pins.s
      bad     bad.s
      inv     inv.s
      fish    fish.s
      voc     voc.s
      chats   chats.s
    ==
  ++  clubs-0-to-1
    |=  clubs=(map id:club:zero club:zero)
    ^-  (map id:club:one club:one)
    %-  ~(run by clubs)
    |=  =club:zero
    [*remark:one club]
  --
::
++  watch-groups
  ^+  cor
  (emit %pass /groups %agent [our.bowl %groups] %watch /groups)
::
++  watch-epic
  |=  her=ship
  ^+  cor
  =/  =wire  /epic
  =/  =dock  [her dap.bowl]
  ?:  (~(has by wex.bowl) [wire dock])
    cor
  (emit %pass wire %agent [her dap.bowl] %watch /epic)
::
++  poke
  |=  [=mark =vase]
  |^  ^+  cor
  ?+    mark  ~|(bad-poke/mark !!)
  ::
      %noun
    =+  !<([head=term tail=*] vase)
    ?+  head  ~|(bad-poke/vase !!)
        %transfer-channel
      ?>  from-self
      =+  !<([* =flag:c new-group=flag:g new=flag:c before=@da] vase)
      =/  core  (ca-abed:ca-core flag)
      ca-abet:(ca-transfer-channel:core new-group new before)
    ::
        %import-channel
      ?>  from-self
      =+  !<([* =flag:c cr=create:c =log:c] vase)
      =.  cor  (create cr)
      ~&  "importing {<(wyt:log-on:c log)>} logs to {<flag>}"
      =/  core  (ca-abed:ca-core flag)
      ca-abet:(ca-apply-logs:core log)
    ==
  ::
      %import-flags
    =+  !<(flags=(set flag:c) vase)
    =.  imp  %-  ~(gas by *(map flag:c ?))
      ^-  (list [flag:c ?])
      %+  turn
        ~(tap in flags)
      |=(=flag:c [flag |])
    cor
      %graph-imports  (import !<(imports:c vase))
  ::
      %dm-imports     (import-dms !<(graph:gra:c vase))
      %club-imports   (import-clubs !<(club-imports:c vase))
  ::
      %dm-rsvp
    =+  !<(=rsvp:dm:c vase)
    di-abet:(di-rsvp:(di-abed:di-core ship.rsvp) ok.rsvp)
  ::
      %chat-pins
    =+  !<(ps=(list whom:c) vase)
    (pin ps)
  ::
      %chat-blocked
    ?<  from-self
    (has-blocked src.bowl)
  ::
      %chat-unblocked
    ?<  from-self
    (has-unblocked src.bowl)
  ::
      %chat-block-ship
    =+  !<(=ship vase)
    ?>  from-self
    (block ship)
  ::
      %chat-unblock-ship
    =+  !<(=ship vase)
    ?>  from-self
    (unblock ship)
  ::
      %chat-toggle-message
    =+  !<(toggle=message-toggle:c vase)
    ?>  from-self
    (toggle-message toggle)
  ::
      %flag
    =+  !<(f=flag:c vase)
    ?<  =(our.bowl p.f)
    (join [*flag:g f])
  ::
      %channel-join
    =+  !<(j=join:c vase)
    ?<  =(our.bowl p.chan.j)
    (join j)
  ::
      ?(%channel-leave %chat-leave)
    =+  !<(=leave:c vase)
    ?<  =(our.bowl p.leave)  :: cannot leave chat we host
    ca-abet:ca-leave:(ca-abed:ca-core leave)
  ::
      %leave-old-channels
    =/  groups-path  /(scot %p our.bowl)/groups/(scot %da now.bowl)/groups/noun
    =/  groups  .^(groups:g %gx groups-path)
    =/  chat-flags-from-groups
      %+  turn  ~(tap by groups)
    |=  [group-flag=flag:g group=group:g]
      %+  turn
        %+  skim  ~(tap by channels.group)
        |=  [=nest:g *]
        ?:(=(%chat p.nest) %.y %.n)
      |=  [=nest:g *]
      q.nest
    =/  chats-without-groups
      %+  skim  ~(tap in ~(key by chats))
      |=  =flag:g
      ?:(=((find [flag]~ (zing chat-flags-from-groups)) ~) %.y %.n)
    %+  roll
      chats-without-groups
    |=  [=flag:g core=_cor]
    ca-abet:ca-leave:(ca-abed:ca-core:core flag)
  ::
      %recheck-all-perms
    %+  roll
      ~(tap by chats)
    |=  [[=flag:c *] core=_cor]
    =/  ca  (ca-abed:ca-core:core flag)
    ca-abet:(ca-recheck:ca ~)
  ::
      %chat-draft
    =+  !<(=draft:c vase)
    ?>  =(src.bowl our.bowl)
    %_  cor
        drafts
       (~(put by drafts) p.draft q.draft)
    ==
  ::
      %chat-create
    =+  !<(req=create:c vase)
    (create req)
  ::
      ?(%chat-action-0 %chat-action)
    =+  !<(=action:c vase)
    =.  p.q.action  now.bowl
    =/  chat-core  (ca-abed:ca-core p.action)
    ?:  =(p.p.action our.bowl)
      ca-abet:(ca-update:chat-core q.action)
    ca-abet:(ca-proxy:chat-core q.action)
  ::
      %chat-remark-action
    =+  !<(act=remark-action:c vase)
    ?-  -.p.act
      %ship  di-abet:(di-remark-diff:(di-abed:di-core p.p.act) q.act)
      %flag  ca-abet:(ca-remark-diff:(ca-abed:ca-core p.p.act) q.act)
      %club  cu-abet:(cu-remark-diff:(cu-abed:cu-core p.p.act) q.act)
    ==
  ::
      %dm-action
    =+  !<(=action:dm:c vase)
    ::  don't allow anyone else to proxy through us
    ?.  =(src.bowl our.bowl)
      ~|("%dm-action poke failed: only allowed from self" !!)
    ::  don't proxy to self, creates an infinite loop
    ?:  =(p.action our.bowl)
      ~|("%dm-action poke failed: can't dm self" !!)
    di-abet:(di-proxy:(di-abed-soft:di-core p.action) q.action)
  ::
      %dm-diff
    =+  !<(=diff:dm:c vase)
    di-abet:(di-take-counter:(di-abed-soft:di-core src.bowl) diff)
  ::
      %club-create
    cu-abet:(cu-create:cu-core !<(=create:club:c vase))
  ::
      ?(%club-action %club-action-0)
    =+  !<(=action:club:c vase)
    =/  cu  (cu-abed p.action)
    cu-abet:(cu-diff:cu q.action)
  ::
      %dm-archive  di-abet:di-archive:(di-abed:di-core !<(ship vase))
  ==
  ++  join
    |=  =join:c
    ^+  cor
    ?<  (~(has by chats) chan.join)
    ca-abet:(ca-join:ca-core join)
  ::
  ++  create
    |=  req=create:c
    |^  ^+  cor
      ~_  leaf+"Create failed: check group permissions"
      ?>  can-nest
      ?>  ((sane %tas) name.req)
      =/  =flag:c  [our.bowl name.req]
      =|  =chat:c
      =/  =perm:c  [writers.req group.req]
      =.  perm.chat  perm
      =.  net.chat  [%pub ~]
      =.  chats  (~(put by chats) flag chat)
      ca-abet:(ca-init:(ca-abed:ca-core flag) req)
    ++  can-nest
      ^-  ?
      =/  gop  (~(got by groups) group.req)
      %-  ~(any in bloc.gop)
      ~(has in sects:(~(got by fleet.gop) our.bowl))
    ::
    ++  groups
      .^  groups:g
        %gx
        /(scot %p our.bowl)/groups/(scot %da now.bowl)/groups/noun
      ==
    --
  ::
  ++  pin
    |=  ps=(list whom:c)
    =.  pins  ps
    cor
  --
  ::
  ++  has-blocked
    |=  =ship
    ^+  cor
    ?<  (~(has in blocked-by) ship)
    ?<  =(our.bowl ship)
    =.  blocked-by  (~(put in blocked-by) ship)
    (give %fact ~[/ui] chat-blocked-by+!>(ship))
  ::
  ++  has-unblocked
    |=  =ship
    ^+  cor
    ?>  (~(has in blocked-by) ship)
    ?<  =(our.bowl ship)
    =.  blocked-by  (~(del in blocked-by) ship)
    (give %fact ~[/ui] chat-unblocked-by+!>(ship))
  ::
  ++  block
    |=  =ship
    ^+  cor
    ?<  (~(has in blocked) ship)
    ?<  =(our.bowl ship)
    =.  blocked  (~(put in blocked) ship)
    (emit %pass di-area:di-core:cor %agent [ship dap.bowl] %poke %chat-blocked !>(0))
  ::
  ++  unblock
    |=  =ship
    ^+  cor
    ?>  (~(has in blocked) ship)
    =.  blocked  (~(del in blocked) ship)
    (emit %pass di-area:di-core:cor %agent [ship dap.bowl] %poke %chat-unblocked !>(0))
  ::
  ++  toggle-message
    |=  toggle=message-toggle:c
    ^+  cor
    =.  hidden-messages
      ?-  -.toggle
        %hide  (~(put in hidden-messages) id.toggle)
        %show  (~(del in hidden-messages) id.toggle)
      ==
    (give %fact ~[/ui] chat-toggle-message+!>(toggle))
  ::
++  watch
  |=  =(pole knot)
  ^+  cor
  ?+    pole  ~|(bad-watch-path/path !!)
      [%imp ~]        ?>(from-self cor)
      [%clubs %ui ~]  ?>(from-self cor)
      [%briefs ~]  ?>(from-self cor)
      [%ui ~]  ?>(from-self cor)
      [%dm %invited ~]  ?>(from-self cor)
  ::
      [%epic ~]
    (give %fact ~ epic+!>(okay:c))
  ::
      [%said host=@ name=@ %msg sender=@ time=@ ~]
    =/  host=ship  (slav %p host.pole)
    =/  =flag:c     [host name.pole]
    =/  sender=ship  (slav %p sender.pole)
    =/  =id:c       [sender (slav %ud time.pole)]
    (watch-said flag id)
  ::
      [%hook host=@ name=@ rest=*]
    =,(pole (watch-hook [(slav %p host) name] rest))
  ::
      [%chat ship=@ name=@ rest=*]
    =/  =ship  (slav %p ship.pole)
    ?>  (ca-can-read:(ca-abed:ca-core [ship name.pole]) src.bowl)
    ca-abet:(ca-watch:(ca-abed:ca-core ship name.pole) rest.pole)
  ::
      [%dm ship=@ rest=*]
    =/  =ship  (slav %p ship.pole)
    di-abet:(di-watch:(di-abed:di-core ship) rest.pole)
  ::
      [%club id=@ rest=*]
    =/  =id:club:c  (slav %uv id.pole)
    cu-abet:(cu-watch:(cu-abed id) rest.pole)
  ==
::
++  agent
  |=  [=(pole knot) =sign:agent:gall]
  ^+  cor
  ?+    pole  ~|(bad-agent-wire/pole !!)
      ~  cor
  ::
      [%epic ~]
    (take-epic sign)
  ::
      [%contacts ship=@ ~]
    ?>  ?=(%poke-ack -.sign)
    ?~  p.sign  cor
    %-  (slog leaf/"Failed to heed contact {<ship>}" u.p.sign)
    cor
  ::
      [%hook host=@ name=@ rest=*]
    =,(pole (take-hook [(slav %p host) name] rest sign))
  ::
      [%said host=@ name=@ %msg sender=@ time=@ ~]
    =/  host=ship    (slav %p host.pole)
    =/  =flag:c      [host name.pole]
    =/  sender=ship  (slav %p sender.pole)
    =/  =id:c        [sender (slav %ud time.pole)]
    (take-said flag id sign)
  ::
      [%dm ship=@ rest=*]
    =/  =ship  (slav %p ship.pole)
    di-abet:(di-agent:(di-abed:di-core ship) rest.pole sign)
  ::
      [%club id=@ rest=*]
    =/  =id:club:c  (slav %uv id.pole)
    cu-abet:(cu-agent:(cu-abed id) rest.pole sign)

      [%chat ship=@ name=@ rest=*]
    =/  =ship  (slav %p ship.pole)
    ca-abet:(ca-agent:(ca-abed:ca-core ship name.pole) rest.pole sign)
  ::
      [%hark ~]
    ?>  ?=(%poke-ack -.sign)
    ?~  p.sign  cor
    %-  (slog leaf/"Failed to hark" u.p.sign)
    cor
  ::
      [%groups ~]
    ?+    -.sign  !!
      %kick  watch-groups
    ::
        %watch-ack
      %.  cor
      ?~  p.sign  same
      =/  =tank
        leaf/"Failed groups subscription in {<dap.bowl>}, unexpected"
      (slog tank u.p.sign)
    ::
        %fact
      ?.  =(act:mar:g p.cage.sign)  cor
      (take-groups !<(=action:g q.cage.sign))
    ==
  ==
++  give-kick
  |=  [pas=(list path) =cage]
  =.  cor  (give %fact pas cage)
  (give %kick ~ ~)
::
++  watch-hook
  |=  [=flag:g wer=path]
  ^+  cor
  ?:  (~(has by chats) flag)
    ca-abet:(ca-hook:(ca-abed:ca-core flag) wer)
  ?<  =(our.bowl p.flag)
  ?>  ?=([@ ~] wer)
  =/  time=@  (slav %ud i.wer)
  ?^  fis=(~(get by fish) [flag time])
    (give-kick ~ chat-said+!>((~(got by voc) flag u.fis)))
  =/  =path  (welp /hook/(scot %p p.flag)/[q.flag] wer)
  (emit %pass path %agent [p.flag dap.bowl] %watch path)
::
++  take-hook
  |=  [=flag:g wer=path =sign:agent:gall]
  ^+  cor
  ?>  ?=([@ ~] wer)
  =/  =path  (welp /hook/(scot %p p.flag)/[q.flag] wer)
  ?+    -.sign  cor
      %kick  (give %kick ~[path] ~)
      %watch-ack
    ?~  p.sign  cor
    (give %kick ~[path] ~)
  ::
      %fact
    ?.  =(%chat-said p.cage.sign)
      cor
    =+  !<(=said:c q.cage.sign)
    =/  time=@  (slav %ud i.wer)
    =.  fish    (~(put by fish) [flag time] id.q.said)
    (give-kick ~[path] cage.sign)
  ==
::
++  import-clubs
  |=  cus=club-imports:c
  =/  cus  ~(tap by cus)
  |-  ^+  cor
  ?~  cus
    cor
  =/  [=flag:c ships=(set ship) =association:met:c =graph:gra:c]
    i.cus
  =/  =id:club:c  (shax (jam flag))  :: TODO: determinstic, but collisions ig?
  =/  meta=data:meta
    [title description '' '']:metadatum.association
  =.  clubs  (~(put by clubs) id *heard:club:c *remark:c (graph-to-pact graph flag) ships ~ meta %done |)
  $(cus t.cus)
::
++  import-dms
  |=  =graph:gra:c
  ^+  cor
  =/  old-dms  (tap:orm-gra:c graph)
  =|  =remark:c
  =.  last-read.remark  now.bowl
  |-  =*  loop  $
  ?~  old-dms  cor
  =/  [ship=@ =node:gra:c]  i.old-dms
  ?.  ?=(%graph -.children.node)
    loop(old-dms t.old-dms)
  =.  dms
    (~(put by dms) ship (graph-to-pact p.children.node [ship (scot %p ship)]) remark %done |)
  loop(old-dms t.old-dms)
++  graph-to-pact
  |=    [=graph:gra:c =flag:c]
  ^-  pact:c
  %-  ~(gas pac *pact:c)
  %+  murn  (tap:orm-gra:c graph)
  |=  [=time =node:gra:c]
  ^-  (unit [_time writ:c])
  ?~  wit=(node-to-writ time node flag)
    ~
  `[time u.wit]
::  TODO: review crashing semantics
::        check graph ordering (backwards iirc)
++  node-to-writ
  |=  [=time =node:gra:c =flag:c]
  ^-  (unit writ:c)
  ?.  ?=(%& -.post.node)
    ~
  =*  pos  p.post.node
  :: using the received timestamp
  :: defends against shitty clients, bc we didn't enforce uniqueness last time
  :: but breaks referential transparency, so you can't quote migrated
  :: messages
  :: XX: probably change?
  :-  ~
  :-  [[author.pos time] ~ ~]
  [~ author.pos time-sent.pos story/(~(con nert:mig flag %chat) contents.pos)]
::
++  import
  |=  =imports:c
  ^+  cor
  =/  imports  ~(tap by imports)
  |-  =*  loop  $
  ?~  imports  cor
  =/  [=flag:c writers=(set ship) =association:met:c =update-log:gra:c =graph:gra:c]
    i.imports
  |^
  =/  =perm:c
    :_  group.association
    ?:(=(~ writers) ~ (silt (rap 3 'import/' (scot %p p.flag) '/' q.flag ~) ~))
  =/  =pact:c  (graph-to-pact graph flag)
  =/  =chat:c
    :*  net=?:(=(our.bowl p.flag) pub/~ sub/[p.flag | chi/~])
        *remark:c
        log=(import-log pact perm)
        perm
        pact
    ==
  =.  imp    (~(put by imp) flag &)
  =.  cor
    (give %fact ~[/imp] migrate-map+!>(imp))
  =.  chats  (~(put by chats) flag chat)
  =.  cor
    ca-abet:(ca-import:(ca-abed:ca-core flag) writers association)
  loop(imports t.imports)
  ::
  ++  import-log
    |=  [=pact:c =perm:c]
    ^-  log:c
    =/  =time  (fall (bind (ram:orm-log-gra:c update-log) head) *time)
    %+  gas:log-on:c  *log:c
    :~  [time %create perm pact]
    ==
  ::
  ++  orm  orm-gra:c
  --
::
++  watch-said
  |=  [=flag:c =id:c]
  ?.  (~(has by chats) flag)
    (proxy-said flag id)
  ca-abet:(ca-said:(ca-abed:ca-core flag) id)
++  said-wire
  |=  [=flag:c =id:c]
  ^-  wire
  /said/(scot %p p.flag)/[q.flag]/msg/(scot %p p.id)/(scot %ud q.id)
::
++  take-said
  |=  [=flag:c =id:c =sign:agent:gall]
  ^+  cor
  =/  wire  (said-wire flag id)
  ?+    -.sign  !!
      %watch-ack
    %.  cor
    ?~  p.sign  same
    (slog leaf/"Preview failed" u.p.sign)
  ::
      %kick
    ?:  (~(has by voc) [flag id])
      cor  :: subscription ended politely
    ::  XX: only versioned subscriptions should rewatch on kick
    (give %kick ~[wire] ~)
    :: (proxy-said flag id)
  ::
      %fact
    =.  cor
      (give %fact ~[wire] cage.sign)
    =.  cor
      (give %kick ~[wire] ~)
    ?+    p.cage.sign  ~|(funny-mark/p.cage.sign !!)
        %chat-said
      =+  !<(=said:c q.cage.sign)
      =.  voc  (~(put by voc) [flag id] `said)
      cor
    ::
        %chat-denied
      =.  voc  (~(put by voc) [flag id] ~)
      cor
    ==
  ==
::
++  proxy-said
  |=  [=flag:c =id:c]
  =/  =dock  [p.flag dap.bowl]
  =/  wire  (said-wire flag id)
  ?:  (~(has by wex.bowl) wire dock)
    cor
  (emit %pass wire %agent dock %watch wire)
::
++  take-epic
  |=  =sign:agent:gall
  ^+  cor
  ?+    -.sign  cor
      %kick
    (watch-epic src.bowl)
  ::
      %fact
    ?.  =(%epic p.cage.sign)
      %-  (note:wood %odd leaf/"!!! weird fact on /epic" ~)
      cor
    =+  !<(=epic:e q.cage.sign)
    ?.  =(epic okay:c)  :: is now our guy
      cor
    %+  roll  ~(tap by chats)
    |=  [[=flag:g =chat:c] out=_cor]
    ?.  =(src.bowl p.flag)
      out
    ca-abet:(ca-take-epic:(ca-abed:ca-core:out flag) epic)
  ::
      %watch-ack
    %.  cor
    ?~  p.sign  same
    (note:wood %odd leaf/"weird watch nack" u.p.sign)
  ==
::  TODO: more efficient?
::    perhaps a cached index of (jug group=flag chat=flag)
++  take-groups
  |=  =action:g
  =/  affected=(list flag:c)
    %+  murn  ~(tap by chats)
    |=  [=flag:c =chat:c]
    ?.  =(p.action group.perm.chat)  ~
    `flag
  =/  diff  q.q.action
  ?+  diff  cor
      [%fleet * %del ~]
    %-  (note:wood %veb leaf/"revoke perms for {<affected>}" ~)
    %+  roll  affected
    |=  [=flag:c co=_cor]
    ^+  cor
    %+  roll  ~(tap in p.diff)
    |=  [=ship ci=_cor]
    ^+  cor
    =/  ca  (ca-abed:ca-core:ci flag)
    ca-abet:(ca-revoke:ca ship)
  ::
    [%fleet * %add-sects *]    (recheck-perms affected ~)
    [%fleet * %del-sects *]    (recheck-perms affected ~)
    [%channel * %edit *]       (recheck-perms affected ~)
    [%channel * %del-sects *]  (recheck-perms affected ~)
    [%channel * %add-sects *]  (recheck-perms affected ~)
  ::
      [%cabal * %del *]
    =/  =sect:g  (slav %tas p.diff)
    %+  recheck-perms  affected
    (~(gas in *(set sect:g)) ~[p.diff])
  ==
::
++  recheck-perms
  |=  [affected=(list flag:c) sects=(set sect:g)]
  %-  (note:wood %veb leaf/"recheck permissions for {<affected>}" ~)
  %+  roll  affected
  |=  [=flag:c co=_cor]
  =/  ca  (ca-abed:ca-core:co flag)
  ca-abet:(ca-recheck:ca sects)
++  arvo
  |=  [=wire sign=sign-arvo]
  ^+  cor
  ~&  arvo/wire
  cor
++  peek
  |=  =path
  ^-  (unit (unit cage))
  ?+  path  [~ ~]
    [%x %imp ~]   ``migrate-map+!>(imp)
  ::
    [%x %chat ~]  ``flags+!>(~(key by chats))
  ::
    [%x %chats ~]  ``chats+!>(chats-light)
  ::
    [%x %clubs ~]  ``clubs+!>((~(run by clubs) |=(=club:c crew.club)))
  ::
    [%x %pins ~]  ``chat-pins+!>(pins)
  ::
    [%x %blocked ~]  ``ships+!>(blocked)
  ::
    [%x %blocked-by ~]  ``ships+!>(blocked-by)
  ::
    [%x %hidden-messages ~]  ``hidden-messages+!>(hidden-messages)
  ::
    [%x %briefs ~]  ``chat-briefs+!>(briefs)
  ::
    [%x %init ~]  ``noun+!>([briefs chats-light pins])
  ::
      [%x %init %talk ~]
    =-  ``noun+!>(-)
    :*  briefs
        chats-light
        (~(run by clubs) |=(=club:c crew.club))
        ~(key by accepted-dms)
        ~(key by pending-dms)
        pins
    ==
  ::
      [%x %chat @ @ *]
    =/  =ship  (slav %p i.t.t.path)
    =*  name   i.t.t.t.path
    ~&  [ship name]
    (ca-peek:(ca-abed:ca-core ship name) %x t.t.t.t.path)
  ::
      [%x %dm ~]
    ``ships+!>(~(key by accepted-dms))
  ::
      [%x %dm %invited ~]
    ``ships+!>(~(key by pending-dms))
  ::
      [%x %dm %archive ~]
    ``ships+!>(~(key by archived-dms))
  ::
      [%x %dm @ *]
    =/  =ship  (slav %p i.t.t.path)
    (di-peek:(di-abed:di-core ship) %x t.t.t.path)
  ::
      [%x %club @ *]
    (cu-peek:(cu-abed (slav %uv i.t.t.path)) %x t.t.t.path)
  ::
      [%x %draft @ $@(~ [@ ~])]
    =/  =whom:c
      ?^  t.t.t.path
        flag+[(slav %p i.t.t.path) i.t.t.t.path]
      %+  rash
      i.t.t.path
    ;~  pose
      (stag %ship ;~(pfix sig fed:ag))
      (stag %club club-id-rule:dejs:chat-json)
    ==
    =-  ``chat-draft+!>(-)
    `draft:c`[whom (~(gut by drafts) whom *story:c)]
  ::
      [%u %dm @ *]
    =/  =ship  (slav %p i.t.t.path)
    =/  has  (~(has by dms) ship)
    ?.  has
      ``loob+!>(|)
    ?~  t.t.t.path  ``loob+!>(has)
    (di-peek:(di-abed:di-core ship) %u t.t.t.path)
  ::
      [%u %club @ *]
    =/  =id:club:c  (slav %uv i.t.t.path)
    =/  has  (~(has by clubs) id)
    ?.  has
      ``loob+!>(|)
    ?~  t.t.t.path  ``loob+!>(has)
    (cu-peek:(cu-abed:cu-core id) %u t.t.t.path)
  ::
      [%u %chat @ @ *]
    =/  =flag:c
      :-  (slav %p i.t.t.path)
      (slav %tas i.t.t.t.path)
    =/  has  (~(has by chats) flag)
    ?.  has
      ``loob+!>(|)
    ?~  t.t.t.t.path  ``loob+!>(has)
    (ca-peek:(ca-abed:ca-core flag) %u t.t.t.t.path)
  ::
  ==
::
++  chats-light
  ^-  (map flag:c chat:c)
  %-  ~(run by chats)
  |=  =chat:c
  chat(pact *pact:c, log *log:c)
::
++  briefs
  ^-  briefs:c
  %-  ~(gas by *briefs:c)
  %+  welp
    %+  turn  ~(tap by clubs)
    |=  [=id:club:c =club:c]
    =/  loyal  (~(has in team.crew.club) our.bowl)
    =/  invited  (~(has in hive.crew.club) our.bowl)
    ?:  &(!loyal !invited)
      [club/id *time 0 ~]
    =/  cu  (cu-abed id)
    [club/id cu-brief:cu]
  %+  welp
    %+  murn  ~(tap in ~(key by dms))
    |=  =ship
    =/  di  (di-abed:di-core ship)
    ?:  ?=(?(%invited %archive) net.dm.di)  ~
    ?:  =([~ ~] pact.dm.di)  ~
    `[ship/ship di-brief:di]
  %+  turn  ~(tap in ~(key by chats))
  |=  =flag:c
  :-  flag/flag
  ca-brief:(ca-abed:ca-core flag)
++  give-brief
  |=  [=whom:c =brief:briefs:c]
  (give %fact ~[/briefs] chat-brief-update+!>([whom brief]))
::
++  want-hark
  |=  [flag=?(~ flag:g) kind=?(%msg %to-us)]
  %+  (fit-level:volume [our now]:bowl)
    ?~  flag  ~
    [%channel %chat flag]
  ?-  kind
    %to-us  %soft
    %msg    %loud
  ==
::
++  pass-hark
  |=  =new-yarn:ha
  ^-  card
  =/  =wire  /hark
  =/  =dock  [our.bowl %hark]
  =/  =cage  hark-action-1+!>([%new-yarn new-yarn])
  [%pass wire %agent dock %poke cage]
++  flatten
  |=  content=(list inline:c)
  ^-  cord
  %-  crip
  %-  zing
  %+  turn
    content
  |=  c=inline:c
  ^-  tape
  ?@  c  (trip c)
  ?-  -.c
      %break  ""
      %tag    (trip p.c)
      %block  (trip q.c)
      %link   (trip q.c)
      %ship   (scow %p p.c)
      ?(%code %inline-code)  ""
      ?(%italics %bold %strike %blockquote)  (trip (flatten p.c))
  ==
::
++  mentioned
  |=  [content=(list inline:c) =ship]
  ^-  ?
  |-
  ?~  content  %.n
  =/  head  i.content
  =/  tail  t.content
  ?@  head
    $(content tail)
  ?-  -.head
    ?(%break %tag %block %link %code %inline-code)  $(content tail)
    ::
      ?(%italics %bold %strike %blockquote)
    ?:  (mentioned p.head ship)  %.y
    $(content tail)
    ::
      %ship
    ?:  =(ship p.head)  %.y
    $(content tail)
  ==
::
++  check-writ-ownership
  |=  diff=diff:writs:c
  =*  her    p.p.diff
  =*  delta  q.diff
  =*  should  =(her src.bowl)
  ?-  -.delta
      %add  ?.(should | =(src.bowl author.p.delta))
      %del  should
      %add-feel  =(src.bowl p.delta)
      %del-feel  =(src.bowl p.delta)
  ==
::
++  diff-to-response
  |=  [=diff:writs:c =pact:c]
  ^-  (unit response:writs:c)
  =;  delta
    ?~  delta  ~
    `[p.diff delta]
  ?+  -.q.diff  q.diff
      %add
    =/  time=(unit time)  (~(get by dex.pact) p.diff)
    ?~  time  ~
    [%add p.q.diff u.time]
  ==
++  from-self  =(our src):bowl
++  cu-abed  cu-abed:cu-core
::
++  cu-core
  |_  [=id:club:c =club:c gone=_| counter=@ud]
  +*  cu-pact  ~(. pac pact.club)
  ++  cu-core  .
  ++  cu-abet
    ::  shouldn't need cleaning, but just in case
    =.  cu-core  cu-clean
    =.  clubs
      ?:  gone
        (~(del by clubs) id)
      (~(put by clubs) id club)
    cor
  ++  cu-abed
    |=  i=id:club:c
    ~|  no-club/i
    cu-core(id i, club (~(gut by clubs) i *club:c))
  ++  cu-clean
    =.  hive.crew.club
      %-  ~(rep in hive.crew.club)
      |=  [=ship hive=(set ship)]
      ?:  (~(has in team.crew.club) ship)  hive
      (~(put in hive) ship)
    cu-core
  ++  cu-out  (~(del in cu-circle) our.bowl)
  ++  cu-circle
    (~(uni in team.crew.club) hive.crew.club)
  ::
  ++  cu-area  `wire`/club/(scot %uv id)
  ::
  ++  cu-uid
    =/  uid  `@uv`(shax (jam ['clubs' (add counter eny.bowl)]))
    [uid cu-core(counter +(counter))]
  ::
  ++  cu-spin
    |=  [con=(list content:ha) but=(unit button:ha)]
    ^-  new-yarn:ha
    ::  hard coded desk because these shouldn't appear in groups
    =/  rope  [~ ~ %talk /club/(scot %uv id)]
    =/  link  /dm/(scot %uv id)
    [& & rope con link but]
  ::
  ++  cu-pass
    |%
    ++  act
      |=  [=ship =diff:club:c]
      ^-  card
      =/  =wire  (snoc cu-area %gossip)
      =/  =dock  [ship dap.bowl]
      =/  =cage  club-action+!>(`action:club:c`[id diff])
      [%pass wire %agent dock %poke cage]
    ::
    ++  gossip
      |=  =diff:club:c
      ^-  (list card)
      %+  turn  ~(tap in cu-out)
      |=  =ship
      (act ship diff)
    --
  ::
  ++  cu-init
    |=  [=net:club:c =create:club:c]
    =/  clab=club:c
      [*heard:club:c *remark:c *pact:c (silt our.bowl ~) hive.create *data:meta net |]
    cu-core(id id.create, club clab)
  ::
  ++  cu-brief  (brief:cu-pact our.bowl last-read.remark.club)
  ::
  ++  cu-create
    |=  =create:club:c
    =.  cu-core  (cu-init %done create)
    =.  cu-core  (cu-diff 0v0 [%init team hive met]:crew.club)
    =/  =notice:c
      :-  ''
      (rap 3 ' started a group chat with ' (scot %ud ~(wyt in hive.create)) ' other members' ~)
    =.  cor  (give-brief club/id cu-brief)
    =.  cu-core
      (cu-diff 0v0 [%writ now-id %add ~ our.bowl now.bowl notice/notice])
    cu-core
  ::
  ::  NB: need to be careful not to forward automatically generated
  ::  messages like this, each node should generate its own notice
  ::  messages, and never forward. XX: defend against?
  ++  cu-post-notice
    |=  [=ship =notice:c]
    =/  =id:c
      [ship now.bowl]
    =/  w-d=diff:writs:c  [id %add ~ ship now.bowl notice/notice]
    =.  pact.club  (reduce:cu-pact now.bowl w-d)
    (cu-give-writs-diff w-d)
  ::
  ++  cu-give-action
    |=  =action:club:c
    =/  =cage  club-action+!>(action)
    =.  cor
      (emit %give %fact ~[/clubs/ui] cage)
    cu-core
  ::
  ++  cu-give-writs-diff
    |=  =diff:writs:c
    =.  cor
      =/  =cage  writ-diff+!>(diff)
      (emit %give %fact ~[(welp cu-area /ui/writs)] cage)
    =/  response=(unit response:writs:c)  (diff-to-response diff pact.club)
    ?~  response  cu-core
    =.  cor
      =/  =cage  writ-response+!>(u.response)
      (emit %give %fact ~[(welp cu-area /ui/writs)] cage)
    cu-core
  ::
  ++  cu-diff
    |=  [=uid:club:c =delta:club:c]
    ::  generate a uid if we're hearing from a pre-upgrade ship or if we're sending
    =^  uid  cu-core
      ?:  |(from-self (lte uid club-eq))  cu-uid
      [uid cu-core]
    =/  diff  [uid delta]
    ?:  (~(has in heard.club) uid)  cu-core
    =.  heard.club  (~(put in heard.club) uid)
    =.  cor  (emil (gossip:cu-pass diff))
    =.  cu-core
      ?+  -.delta  (cu-give-action [id diff])
          %writ  cu-core
      ==
    ?-    -.delta
    ::
        %meta
      =.  met.crew.club  meta.delta
      cu-core
    ::
        %init
      ::  ignore if already initialized
      ?:  ?|  !=(~ hive.crew.club)
              !=(~ team.crew.club)
              !=(*data:meta met.crew.club)
          ==
        cu-core
      =:  hive.crew.club  hive.delta
          team.crew.club  team.delta
          met.crew.club   met.delta
      ==
      cu-core
    ::
        %writ
      =/  loyal  (~(has in team.crew.club) our.bowl)
      =/  invited  (~(has in hive.crew.club) our.bowl)
      ?:  &(!loyal !invited)
         cu-core
      =.  pact.club  (reduce:cu-pact now.bowl diff.delta)
      ?-  -.q.diff.delta
          ?(%del %add-feel %del-feel)  (cu-give-writs-diff diff.delta)
          %add
        =/  memo=memo:c  p.q.diff.delta
        =?  remark.club  =(author.memo our.bowl)
          remark.club(last-read `@da`(add now.bowl (div ~s1 100)))
        =.  cor  (give-brief club/id cu-brief)
        ?:  =(our.bowl author.memo)  (cu-give-writs-diff diff.delta)
        ?-  -.content.memo
            %notice  (cu-give-writs-diff diff.delta)
            %story
          =/  new-yarn
            %+  cu-spin
              :~  [%ship author.memo]
                  ': '
                  (flatten q.p.content.memo)
              ==
            ~
          =?  cor  (want-hark ~ %to-us)
            (emit (pass-hark new-yarn))
          (cu-give-writs-diff diff.delta)
        ==
      ==
    ::
        %team
      =*  ship  ship.delta
      =/  loyal  (~(has in team.crew.club) ship)
      ?:  &(!ok.delta loyal)
        ?.  =(our src):bowl
          cu-core
        cu-core(gone &)
      ?:  &(ok.delta loyal)  cu-core
      ?.  (~(has in hive.crew.club) ship)
        cu-core
      =.  hive.crew.club  (~(del in hive.crew.club) ship)
      ?.  ok.delta
        (cu-post-notice ship '' ' declined the invite')
      =.  cor  (give-brief club/id cu-brief)
      =.  team.crew.club  (~(put in team.crew.club) ship)
      =?  last-read.remark.club  =(ship our.bowl)  now.bowl
      (cu-post-notice ship '' ' joined the chat')
    ::
        %hive
      ?:  add.delta
        ?:  ?|  (~(has in hive.crew.club) for.delta)
                (~(has in team.crew.club) for.delta)
            ==
          cu-core
        =.  hive.crew.club   (~(put in hive.crew.club) for.delta)
        =^  new-uid  cu-core
          cu-uid
        =.  cor  (emit (act:cu-pass for.delta new-uid %init [team hive met]:crew.club))
        (cu-post-notice for.delta '' ' was invited to the chat')
      ?.  (~(has in hive.crew.club) for.delta)
        cu-core
      =.  hive.crew.club  (~(del in hive.crew.club) for.delta)
      (cu-post-notice for.delta '' ' was uninvited from the chat')
    ==
  ::
  ++  cu-remark-diff
    |=  diff=remark-diff:c
    ^+  cu-core
    =.  remark.club
      ?-  -.diff
        %watch    remark.club(watching &)
        %unwatch  remark.club(watching |)
        %read-at  !! ::  cu-core(last-read.remark.chat p.diff)
      ::
          %read
      =/  =time
        (fall (bind (ram:on:writs:c wit.pact.club) head) now.bowl)
      remark.club(last-read `@da`(add time (div ~s1 100)))  ::  greater than last
      ==
    =.  cor
      (give-brief club/id cu-brief)
    cu-core
  ::
  ++  cu-peek
    |=  [care=@tas =(pole knot)]
    ^-  (unit (unit cage))
    ?+  pole  [~ ~]
      [%writs rest=*]  (peek:cu-pact care rest.pole)
      [%crew ~]   ``club-crew+!>(crew.club)
    ::
        [%search %text skip=@ count=@ nedl=@ ~]
      %-  some
      %-  some
      :-  %chat-scan
      !>
      %^    text:search:cu-pact
          (slav %ud skip.pole)
        (slav %ud count.pole)
      nedl.pole
    ::
        [%search %mention skip=@ count=@ nedl=@ ~]
      %-  some
      %-  some
      :-  %chat-scan
      !>
      %^    mention:search:cu-pact
          (slav %ud skip.pole)
        (slav %ud count.pole)
      (slav %p nedl.pole)
    ==
  ::
  ++  cu-watch
    |=  =path
    ^+  cu-core
    ?>  =(src our):bowl
    ?+  path  !!
      [%ui ~]  cu-core
      [%ui %writs ~]  cu-core
    ==
  ::
  ++  cu-agent
    |=  [=wire =sign:agent:gall]
    ^+  cu-core
    ?+    wire  ~|(bad-club-take/wire !!)
        [%gossip ~]
      ?>  ?=(%poke-ack -.sign)
      ?~  p.sign  cu-core
      ::  TODO: handle?
      %-  (slog leaf/"Failed to gossip {<src.bowl>} {<id>}" u.p.sign)
      cu-core
    ==
  ::
  --
::
++  ca-core
  |_  [=flag:c =chat:c gone=_|]
  +*  ca-pact  ~(. pac pact.chat)
  ++  ca-core  .
  ::  TODO: archive??
  ++  ca-abet
    %_  cor
        chats
      ?:(gone (~(del by chats) flag) (~(put by chats) flag chat))
    ==
  ++  ca-abed
    |=  f=flag:c
    ca-core(flag f, chat (~(got by chats) f))
  ++  ca-area  `path`/chat/(scot %p p.flag)/[q.flag]
  ::  TODO: add metadata
  ::        maybe delay the watch?
  ++  ca-import
    |=  [writers=(set ship) =association:met:c]
    ^+  ca-core
    =?  ca-core  ?=(%sub -.net.chat)
      ca-sub
    (ca-remark-diff read/~)
  ::
  ++  ca-spin
    |=  [rest=path con=(list content:ha) but=(unit button:ha) lnk=path]
    ^-  new-yarn:ha
    =*  group  group.perm.chat
    =/  =nest:g  [dap.bowl flag]
    =/  rope  [`group `nest q.byk.bowl (welp /(scot %p p.flag)/[q.flag] rest)]
    =/  link
      (welp /groups/(scot %p p.group)/[q.group]/channels/chat/(scot %p p.flag)/[q.flag] ?~(lnk rest lnk))
    [& & rope con link but]
  ::
  ++  ca-watch
    |=  =(pole knot)
    ^+  ca-core
    ?+    pole  !!
        [%updates rest=*]  (ca-pub rest.pole)
        [%ui ~]            ?>(from-self ca-core)
        [%ui %writs ~]     ?>(from-self ca-core)
    ::
        [%said ship=@ time=@ *]
      =/  =ship  (slav %p ship.pole)
      =/  =time  (slav %ud time.pole)
      (ca-said ship time)
    ::
    ==
  ::
  ++  ca-hook
    |=  wer=path
    ?>  (ca-can-read src.bowl)
    ?>  ?=([@ ~] wer)
    =/  time=@   (slav %ud i.wer)
    =.  cor  (give-kick ~ %chat-said !>([flag (got:on:writs:c wit.pact.chat time)]))
    ca-core
  ::
  ++  ca-said
    |=  =id:c
    ^+  ca-core
    ?.  (ca-can-read src.bowl)
      =.  cor  (give-kick ~ chat-denied+!>(~))
      ca-core
    =/  [=time =writ:c]  (got:ca-pact id)
    =.  cor  (give-kick ~ %chat-said !>([flag writ]))
    ca-core
  ::
  ++  ca-upgrade
    ^+  ca-core
    ?.  ?=(%sub -.net.chat)  ca-core
    ?.  ?=(%dex -.saga.net.chat)  ca-core
    ?.  =(okay:c ver.saga.net.chat)
      %-  (note:wood %ver leaf/"%future-shock {<[ver.saga.net.chat flag]>}" ~)
      ca-core
    ca-make-chi
  ::
  ++  ca-pass
    |%
    ++  writer-sect
      |=  [ships=(set ship) =association:met:c]
      =/  =sect:g
        (rap 3 %chat '-' (scot %p p.flag) '-' q.flag ~)
      =/  title=@t
        (rap 3 'Writers: ' title.metadatum.association ~)
      =/  desc=@t
        (rap 3 'The writers role for the ' title.metadatum.association ' chat' ~)
      %+  poke-group  %import-writers
      :+  group.association   now.bowl
      [%cabal sect %add title desc '' '']
    ::
    ++  poke-group
      |=  [=term =action:g]
      ^+  ca-core
      =/  =dock      [our.bowl %groups]  :: XX: which ship?
      =/  =wire      (snoc ca-area term)
      =.  cor
        (emit %pass wire %agent dock %poke act:mar:g !>(action))
      ca-core
    ::
    ++  create-channel
      |=  [=term group=flag:g =channel:g]
      ^+  ca-core
      =/  =nest:g  [dap.bowl flag]
      (poke-group term group now.bowl %channel nest %add channel)
    ::
    ++  import-channel
      |=  =association:met:c
      =/  meta=data:meta:g
        [title description '' '']:metadatum.association
      (create-channel %import group.association meta now.bowl zone=%default %| ~)
    ::
    ++  add-channel
      |=  req=create:c
      %+  create-channel  %create
      [group.req =,(req [[title description '' ''] now.bowl %default | readers])]
    --
  ++  ca-init
    |=  req=create:c
    =/  =perm:c  [writers.req group.req]
    =.  cor
      (give-brief flag/flag ca-brief)
    =.  ca-core  (ca-update now.bowl %create perm *pact:c)
    (add-channel:ca-pass req)
  ::
  ++  ca-agent
    |=  [=(pole knot) =sign:agent:gall]
    ^+  ca-core
    ?+    pole  !!
        ~  :: noop wire, should only send pokes
      ca-core
    ::
        [%updates ~]
      (ca-take-update sign)
    ::
        [%create ~]
      ?>  ?=(%poke-ack -.sign)
      %.  ca-core  :: TODO rollback creation if poke fails?
      ?~  p.sign  same
      (slog leaf/"poke failed" u.p.sign)
    ::
        [%import ~]
      ?>  ?=(%poke-ack -.sign)
      ?~  p.sign
        ca-core
      %-  (slog u.p.sign)
      ca-core
    ::
    ==
  ::
  ++  ca-brief  (brief:ca-pact our.bowl last-read.remark.chat)
  ::
  ++  ca-peek
    |=  [care=@tas =(pole knot)]
    ~&  [care pole]
    ^-  (unit (unit cage))
    ?+    pole  [~ ~]
        [%writs rest=*]
      (peek:ca-pact care rest.pole)
    ::
        [%perm ~]
      ``chat-perm+!>(perm.chat)
    ::
        [%hark %link time=@ ~]
      =/  time  (slav %ud time.pole)
      ~&  ['got into chat' time]
      =/  maybe-writ=(unit writ:c)  (get:on:writs:c wit.pact.chat time)
      ?~  maybe-writ
        ``noun+!>(~)
      =/  memo  +.u.maybe-writ
      =*  group  group.perm.chat
      =/  rest=path
        ::  anything following op gets translated to a "scrollTo" on the
        ::  frontend notification
        ?~  replying.memo
          /op/(rsh 4 (scot %ui time))
        =/  id  u.replying.memo
        /message/(scot %p p.id)/(scot %ud q.id)/op/(rsh 4 (scot %ui time))
      =/  link=path
        ;:  welp
          /groups/(scot %p p.group)/[q.group]
          /channels/chat/(scot %p p.flag)/[q.flag]
          rest
        ==
      ``noun+!>(`link)
    ::
        [%search %text skip=@ count=@ nedl=@ ~]
      %-  some
      %-  some
      :-  %chat-scan
      !>
      %^    text:search:ca-pact
          (slav %ud skip.pole)
        (slav %ud count.pole)
      nedl.pole
    ::
        [%search %mention skip=@ count=@ nedl=@ ~]
      %-  some
      %-  some
      :-  %chat-scan
      !>
      %^    mention:search:ca-pact
          (slav %ud skip.pole)
        (slav %ud count.pole)
      (slav %p nedl.pole)
    ==
  ::
  ++  ca-revoke
    |=  her=ship
    %+  roll  ~(tap in ca-subscriptions)
    |=  [[=ship =path] ca=_ca-core]
    ?.  =(ship her)  ca
    ca(cor (emit %give %kick ~[path] `ship))
  ::
  ++  ca-recheck
    |=  sects=(set sect:g)
    ::  if we have sects, we need to delete them from writers
    =?  cor  &(!=(sects ~) =(p.flag our.bowl))
      =/  =cage  [act:mar:c !>([flag now.bowl %del-sects sects])]
      (emit %pass ca-area %agent [our.bowl dap.bowl] %poke cage)
    ::  if our read permissions restored, re-subscribe. If not, leave.
    =/  wecanread  (ca-can-read our.bowl)
    =.  ca-core
      ?:  wecanread
        ca-safe-sub
      ca-leave
    ::  if subs read permissions removed, kick
    %+  roll  ~(tap in ca-subscriptions)
    |=  [[=ship =path] ca=_ca-core]
    ?:  (ca-can-read:ca ship)  ca
    ca(cor (emit %give %kick ~[path] `ship))
  ::
  ++  ca-take-update
    |=  =sign:agent:gall
    ^+  ca-core
    ?+    -.sign  ca-core
        %kick
      ?>  ?=(%sub -.net.chat)
      ?:  =(%chi -.saga.net.chat)
        %-  (note:wood %ver leaf/"chi-kick: {<flag>}" ~)
        ca-sub
      %-  (note:wood %ver leaf/"wait-kick: {<flag>}" ~)
      ca-core
    ::
        %watch-ack
      =.  net.chat  [%sub src.bowl & %chi ~]
      ?~  p.sign  ca-core
      %-  (slog leaf/"Failed subscription" u.p.sign)
      ::  =.  gone  &
      ca-core
    ::
        %fact
      =*  cage  cage.sign
      ?+  p.cage  (ca-odd-update p.cage)
        %epic                           (ca-take-epic !<(epic:e q.cage))
        ?(%chat-logs %chat-logs-0)      (ca-apply-logs !<(logs:c q.cage))
        ?(%chat-update %chat-update-0)  (ca-update !<(update:c q.cage))
      ==
    ==
  ::
  ++  ca-odd-update
    |=  =mark
    ?.  (is-old:epos mark)
      ca-core
    ?.  ?=(%sub -.net.chat)
      ca-core
    ca-make-lev
  ::
  ++  ca-make-lev
    ?.  ?=(%sub -.net.chat)
       ca-core
    %-  (note:wood %ver leaf/"took lev epic: {<flag>}" ~)
    =.  saga.net.chat  lev/~
    =.  cor  (watch-epic p.flag)
    ca-core
  ::
  ++  ca-make-chi
    ?.  ?=(%sub -.net.chat)  ca-core
    %-  (note:wood %ver leaf/"took okay epic: {<flag>}" ~)
    =.  saga.net.chat  chi/~
    ?:  ca-has-sub  ca-core
    ca-sub
  ::
  ++  ca-take-epic
    |=  her=epic:e
    ^+  ca-core
    ?>  ?=(%sub -.net.chat)
    ?:  =(her okay:c)
      ca-make-chi
    ?:  (gth her okay:c)
      =.  saga.net.chat  dex/her
      %-  (note:wood %ver leaf/"took dex epic: {<[flag her]>}" ~)
      ca-core
    ca-make-lev
  ::
  ++  ca-proxy
    |=  =update:c
    ^+  ca-core
    ::  don't allow anyone else to proxy through us
    ?.  =(src.bowl our.bowl)
      ~|("%chat-action poke failed: only allowed from self" !!)
    ::  must have permission to write
    ?.  ca-can-write
      ~|("%chat-action poke failed: can't write to host" !!)
    =/  =dock  [p.flag dap.bowl]
    =/  =cage  [act:mar:c !>([flag update])]
    =.  cor
      (emit %pass ca-area %agent dock %poke cage)
    ca-core
  ::
  ++  ca-groups-scry
    =*  group  group.perm.chat
    /(scot %p our.bowl)/groups/(scot %da now.bowl)/groups/(scot %p p.group)/[q.group]
  ::
  ++  ca-am-host  =(p.flag our.bowl)
  ++  ca-from-host  |(=(p.flag src.bowl) =(p.group.perm.chat src.bowl))
  ++  ca-can-write
    ?:  ca-from-host  &
    =/  =path
      %+  welp  ca-groups-scry
      /channel/[dap.bowl]/(scot %p p.flag)/[q.flag]/can-write/(scot %p src.bowl)/noun
    =+  .^(write=(unit [bloc=? sects=(set sect:g)]) %gx path)
    ?~  write  |
    =/  perms  (need write)
    ?:  |(bloc.perms =(~ writers.perm.chat))  &
    !=(~ (~(int in writers.perm.chat) sects.perms))
  ::
  ++  ca-can-read
    |=  her=ship
    =/  =path
      %+  welp  ca-groups-scry
      /channel/[dap.bowl]/(scot %p p.flag)/[q.flag]/can-read/(scot %p her)/loob
    .^(? %gx path)
  ::
  ++  ca-pub
    |=  =path
    ^+  ca-core
    ?>  (ca-can-read src.bowl)
    =/  =logs:c
      ?~  path  log.chat
      =/  =time  (slav %da i.path)
      (lot:log-on:c log.chat `time ~)
    =.  cor  (give %fact ~ log:mar:c !>(logs))
    ca-core
  ::
  ++  ca-safe-sub
    ?:  |(ca-has-sub =(our.bowl p.flag))
      ca-core
    ca-sub
  ::
  ++  ca-has-sub
    ^-  ?
    (~(has by wex.bowl) [(snoc ca-area %updates) p.flag dap.bowl])
  ::
  ++  ca-sub
    ^+  ca-core
    =/  tim=(unit time)
      (bind (ram:log-on:c log.chat) head)
    =/  base=wire  (snoc ca-area %updates)
    =/  =path
      %+  weld  base
      ?~  tim  ~
      /(scot %da u.tim)
    =/  =card
      [%pass base %agent [p.flag dap.bowl] %watch path]
    =.  cor  (emit card)
    ca-core
  ++  ca-join
    |=  j=join:c
    ^+  ca-core
    ?>  |(=(p.group.j src.bowl) =(src.bowl our.bowl))
    =.  chats  (~(put by chats) chan.j *chat:c)
    =.  ca-core  (ca-abed chan.j)
    =.  last-read.remark.chat  now.bowl
    =.  group.perm.chat  group.j
    =.  cor  (give-brief flag/flag ca-brief)
    ca-sub
  ::
  ++  ca-leave
    =/  =dock  [p.flag dap.bowl]
    =/  =wire  (snoc ca-area %updates)
    =.  cor  (emit %pass wire %agent dock %leave ~)
    =.  cor  (emit %give %fact ~[/briefs] chat-leave+!>(flag))
    =.  gone  &
    ca-core
  ::
  ++  ca-apply-logs
    |=  =logs:c
    ^+  ca-core
    =/  updates=(list update:c)
      (tap:log-on:c logs)
    %+  roll  updates
    |=  [=update:c ca=_ca-core]
    (ca-update:ca update)
  ::
  ++  ca-subscriptions
    %+  roll  ~(val by sup.bowl)
    |=  [[=ship =path] out=(set [ship path])]
    ?.  =((scag 4 path) (snoc ca-area %updates))
      out
    (~(put in out) [ship path])
  ::
  ++  ca-give-updates
    |=  [=time d=diff:c]
    ^+  ca-core
    =/  paths=(set path)
      %-  ~(gas in *(set path))
      (turn ~(tap in ca-subscriptions) tail)
    =.  paths  (~(put in paths) (snoc ca-area %ui))
    =/  cag=cage  [upd:mar:c !>([time d])]
    =.  cor  (give %fact ~[/ui] act:mar:c !>([flag [time d]]))
    =?  cor  ?=(%writs -.d)
      =/  wire  ~[(welp ca-area /ui/writs)]
      %-  emil
      %+  welp
        ~[[%give %fact wire writ-diff+!>(p.d)]]
      =/  response=(unit response:writs:c)
        (diff-to-response p.d pact.chat)
      ?~  response  ~
      ~[[%give %fact wire writ-response+!>(u.response)]]
    =.  cor  (give %fact ~(tap in paths) cag)
    ca-core
  ::
  ++  ca-remark-diff
    |=  diff=remark-diff:c
    ^+  ca-core
    =.  cor
      (give %fact ~[(snoc ca-area %ui)] chat-remark-action+!>([flag diff]))
    =.  remark.chat
      ?-  -.diff
        %watch    remark.chat(watching &)
        %unwatch  remark.chat(watching |)
        %read-at  !! ::  ca-core(last-read.remark.chat p.diff)
      ::
          %read
      =/  =time
        (fall (bind (ram:on:writs:c wit.pact.chat) head) now.bowl)
      remark.chat(last-read `@da`(add time (div ~s1 100)))  ::  greater than last
      ==
    =.  cor
      (give-brief flag/flag ca-brief)
    ca-core
  ::
  ++  ca-update
    |=  [=time d=diff:c]
    ?>  ca-can-write
    ^+  ca-core
    =.  log.chat
      (put:log-on:c log.chat time d)
    =.  ca-core
      ?+  -.d  (ca-give-updates time d)
        %writs  ca-core
      ==
    ?-    -.d
        %add-sects
      ?>  ca-from-host
      =*  p  perm.chat
      =.  writers.p  (~(uni in writers.p) p.d)
      ca-core
    ::
        %del-sects
      ?>  ca-from-host
      =*  p  perm.chat
      =.  writers.p  (~(dif in writers.p) p.d)
      ca-core
    ::
        %create
      ?>  ca-from-host
      =.  perm.chat  p.d
      =.  pact.chat  q.d
      ca-core
    ::
        %writs
      =*  delta  q.p.d
      ::  accept the fact from host unconditionally, otherwise make
      ::  sure that it's coming from the right person
      ?>  ?|  ca-from-host
              &(ca-am-host (check-writ-ownership p.d))
          ==
      =.  pact.chat  (reduce:ca-pact time p.d)
      =.  ca-core  (ca-give-updates time d)
      ?-  -.delta
          ?(%del %add-feel %del-feel)  ca-core
          %add
        =/  memo=memo:c  p.delta
        =/  want-soft-notify  (want-hark flag %to-us)
        =/  want-loud-notify  (want-hark flag %msg)
        =?  remark.chat  =(author.memo our.bowl)
          remark.chat(last-read `@da`(add now.bowl (div ~s1 100)))
        =.  cor  (give-brief flag/flag ca-brief)
        ?-  -.content.memo
            %notice  ca-core
            %story
          =/  new-message-yarn  (ca-message-hark memo p.content.memo p.p.d)
          =/  from-me  =(author.memo our.bowl)
          =?  cor  &(want-loud-notify !from-me)
            (emit (pass-hark new-message-yarn))
          ?.  ?&  !=(author.memo our.bowl)
                  |(!=(~ replying.memo) (mentioned q.p.content.memo our.bowl))
              ==
            ca-core
          ?:  (mentioned q.p.content.memo our.bowl)
            =/  new-yarn  (ca-mention-hark memo p.content.memo p.p.d)
            =?  cor  &(want-soft-notify !want-loud-notify)
              (emit (pass-hark new-yarn))
            ca-core
          =/  replying  (need replying.memo)
          =/  op  (~(get pac pact.chat) replying)
          ?~  op  ca-core
          =/  opwrit  writ.u.op
          =/  in-replies
            %+  lien
              ~(tap in replied.opwrit)
            |=  =id:c
            =/  writ  (~(get pac pact.chat) id)
            ?~  writ  %.n
            =(author.writ.u.writ our.bowl)
          ?:  &(!=(author.opwrit our.bowl) !in-replies)  ca-core
          ?-  -.content.opwrit
              %notice  ca-core
              %story
            =?  cor  &(want-soft-notify !want-loud-notify)
              %-  emit  %-  pass-hark
              %-  ca-spin
                :^  /message/(scot %p p.replying)/(scot %ud q.replying)
                  :~  [%ship author.memo]
                      ' replied to your message “'
                      (flatten q.p.content.opwrit)
                      '”: '
                      [%ship author.memo]
                      ': '
                      (flatten q.p.content.memo)
                  ==
                  ~
                  ~
            ca-core
          ==
        ==
      ==
    ==
  ::
  ++  ca-mention-hark
    |=  [=memo:c =story:c op=id:c]
    =/  path
      ?~  replying.memo
        /op/(scot %p p.op)/(scot %ud q.op)
      =/  id  u.replying.memo
      /message/(scot %p p.id)/(scot %ud q.id)/op/(scot %p p.op)/(scot %ud q.op)
    %-  ca-spin
      :^  path
        :~  [%ship author.memo]
            ' mentioned you :'
            (flatten q.story)
        ==
        ~
        ~
  ::
  ++  ca-message-hark
    |=  [=memo:c =story:c op=id:c]
    %-  ca-spin
      :^  ~
        :~  [%ship author.memo]
            ': '
            (flatten q.story)
        ==
        ~
        /message/(scot %p p.op)/(scot %ud q.op)
  ::
  ++  ca-transfer-channel
    |=  [new-group=flag:g new=flag:c tim=time]
    =/  old=log:c  log.chat
    ::  we only need writs for the new channel because we'll compress
    ::  all the permissions into one create event
    =/  writ-log
      =<  +
      %^  (dip:log-on:c @)  log.chat  ~
      |=  [st=@ =time =diff:c]
      :_  [%.n st]
      ::  only keep writs
      ?.  ?=(%writs -.diff)  ~
      `diff
    ::  for the channel getting truncated we need to keep all permission
    ::  events, and only the writs after the time
    =/  filtered-log
        =<  +
        %^  (dip:log-on:c @)  log.chat  ~
        |=  [st=@ =time =diff:c]
        :_  [%.n st]
        ?:  ?=(%create -.diff)  `[%create p.diff ~ ~]
        ::  keep non-writ events
        ?.  ?=(%writs -.diff)  `diff
        ::  only keep writs after time
        ?.  (gth time tim)  ~
        `diff
    =+  .^(=group:g %gx (weld ca-groups-scry /noun))
    =/  =channel:g  (~(got by channels.group) [%chat flag])
    ::  don't allow moving to the same group or same channel
    ~|  'Must be a different group and channel'
    ?>  &(!=(group.perm.chat new-group) !=(flag new))
    ::  compressing permissions into create event for new channel
    =/  =create:c
      :*  new-group
          q.new
          title.meta.channel
          description.meta.channel
          readers.channel
          writers.perm.chat
      ==
    =/  =wire  (welp ca-area /import)
    =/  =dock  [our.bowl dap.bowl]
    =/  =cage  [%noun !>([%import-channel new create writ-log])]
    =.  cor  (emit %pass wire %agent dock %poke cage)
    ~&  ['new size:' ~(wyt by filtered-log) 'old-size:' ~(wyt by old)]
    =.  log.chat  filtered-log
    ca-core
  --
::
++  pending-dms
  (dms-by-net %invited ~)
::
++  accepted-dms
  (dms-by-net %inviting %done ~)
::
++  archived-dms
  (dms-by-net %archive ~)
::
++  dms-by-net
  |=  nets=(list net:dm:c)
  =/  nets  (~(gas in *(set net:dm:c)) nets)
  %-  ~(gas by *(map ship dm:c))
  %+  skim  ~(tap by dms)
  |=  [=ship =dm:c]
  (~(has in nets) net.dm)
::
++  give-invites
  |=  =ship
  =/  invites
  ?:  (~(has by dms) ship)   ~(key by pending-dms)
  (~(put in ~(key by pending-dms)) ship)
  (give %fact ~[/dm/invited] ships+!>(invites))
::
++  di-core
  |_  [=ship =dm:c gone=_|]
  +*  di-pact  ~(. pac pact.dm)
      di-hark  ~(. hark-dm:ch [now.bowl ship])
  ++  di-core  .
  ++  di-abet
    =.  dms
      ?:  gone  (~(del by dms) ship)
      (~(put by dms) ship dm)
    cor
  ++  di-abed
    |=  s=@p
    di-core(ship s, dm (~(got by dms) s))
  ::
  ++  di-abed-soft
    |=  s=@p
    =/  new=?  !(~(has by dms) s)
    =/  d
      %+  ~(gut by dms)  s
      =|  =remark:c
      =.  watching.remark  &
      [*pact:c remark ?:(=(src our):bowl %inviting %invited) |]
    ?.  &(new !=(src our):bowl)
      di-core(ship s, dm d)
    di-invited:di-core(ship s, dm d)
  ::
  ++  di-area  `path`/dm/(scot %p ship)
  ++  di-spin
    |=  [con=(list content:ha) but=(unit button:ha)]
    ^-  new-yarn:ha
    ::  hard coded desk because these shouldn't appear in groups
    =/  rope  [~ ~ %talk /dm/(scot %p ship)]
    =/  link  /dm/(scot %p ship)
    [& & rope con link but]
  ::
  ++  di-proxy
    |=  =diff:dm:c
    =.  di-core  (di-ingest-diff diff)
    =.  cor  (emit (proxy:di-pass diff))
    di-core
  ::
  ++  di-invited
    ^+  di-core
    =.  cor
      (emit (hark:di-pass invited:di-hark))
    di-core
  ::
  ++  di-notify
    |=  [=id:c =delta:writs:c]
    ^+  di-core
    ?.  watching.remark.dm  di-core
    ?:  =(our.bowl p.id)  di-core
    ?:  =(%invited net.dm)  di-core
    ?+  -.delta  di-core
        %add
      ?.  ?=(%story -.content.p.delta)  di-core
      =.  cor
        (emit (hark:di-pass (story:di-hark id p.content.p.delta)))
      di-core
    ==
  ++  di-archive
    =.  net.dm  %archive
    (di-post-notice '' ' archived the channel')
  ::
  ++  di-ingest-diff
    |=  =diff:dm:c
    =/  =path  (snoc di-area %ui)
    =.  cor  (emit %give %fact ~[path] writ-diff+!>(diff))
    =/  =wire  /contacts/(scot %p ship)
    =/  =cage  [act:mar:contacts !>(`action:contacts`[%heed ~[ship]])]
    =.  cor  (emit %pass wire %agent [our.bowl %contacts] %poke cage)
    =/  old-brief  di-brief
    =.  pact.dm  (reduce:di-pact now.bowl diff)
    =/  response=(unit response:writs:c)  (diff-to-response diff pact.dm)
    ~&  response
    =.  cor
      ?~  response   cor
      (give %fact ~[path] writ-response+!>(u.response))
    =?  cor  &(=(net.dm %invited) !=(ship our.bowl))
      (give-invites ship)
    =.  di-core
      (di-notify diff)
    ?-  -.q.diff
        ?(%del %add-feel %del-feel)  di-core
        %add
      =/  memo=memo:c  p.q.diff
      =?  remark.dm  =(author.memo our.bowl)
        remark.dm(last-read `@da`(add now.bowl (div ~s1 100)))
      =?  cor  &(!=(old-brief di-brief) !=(net.dm %invited))
        (give-brief ship/ship di-brief)
      ?:  from-self  di-core
      ?-  -.content.memo
          %notice  di-core
          %story
        =/  new-yarn
          %+  di-spin
            :~  [%ship author.memo]
                ?:  =(net.dm %invited)  ' has invited you to a direct message'
                ': '
                ?:(=(net.dm %invited) '' (flatten q.p.content.memo))
            ==
          ~
        =?  cor  (want-hark ~ %to-us)
          (emit (pass-hark new-yarn))
        di-core
      ==
    ==
  ::
  ++  di-take-counter
    |=  =diff:dm:c
    ?<  =(%archive net.dm)
    ?<  (~(has in blocked) ship)
    (di-ingest-diff diff)
  ::
  ++  di-post-notice
    |=  n=notice:c
    (di-ingest-diff [our now]:bowl %add ~ src.bowl now.bowl %notice n)
  ::
  ++  di-rsvp
    |=  ok=?
    =?  cor  =(our src):bowl
      (emit (proxy-rsvp:di-pass ok))
    ?>  |(=(src.bowl ship) =(our src):bowl)
    ::  TODO hook into archive
    ?.  ok
      %-  (note:wood %odd leaf/"gone {<ship>}" ~)
      ?:  =(src.bowl ship)
        di-core
      di-core(gone &)
    =.  net.dm  %done
    (di-post-notice '' ' joined the chat')
  ::
  ++  di-watch
    |=  =path
    ^+  di-core
    ?>  =(src.bowl our.bowl)
    ?+  path  !!
      [%ui ~]  di-core
      [%ui %writs ~]  di-core
    ==
  ::
  ++  di-agent
    |=  [=wire =sign:agent:gall]
    ^+  di-core
    ?+    wire  ~|(bad-dm-take/wire !!)
        [%hark ~]
      ?>  ?=(%poke-ack -.sign)
      ?~  p.sign  di-core
      ::  TODO: handle?
      %-  (slog leaf/"Failed to notify about dm {<ship>}" u.p.sign)
      di-core
    ::
        [%proxy ~]
      ?>  ?=(%poke-ack -.sign)
      ?~  p.sign  di-core
      ::  TODO: handle?
      %-  (slog leaf/"Failed to dm {<ship>}" u.p.sign)
      di-core
    ==
  ::
  ++  di-peek
    |=  [care=@tas =(pole knot)]
    ^-  (unit (unit cage))
    ?+    pole  [~ ~]
        [%writs rest=*]
      (peek:di-pact care rest.pole)
    ::
        [%search %text skip=@ count=@ nedl=@ ~]
      %-  some
      %-  some
      :-  %chat-scan
      !>
      %^    text:search:di-pact
          (slav %ud skip.pole)
        (slav %ud count.pole)
      nedl.pole
    ::
        [%search %mention skip=@ count=@ nedl=@ ~]
      %-  some
      %-  some
      :-  %chat-scan
      !>
      %^    mention:search:di-pact
          (slav %ud skip.pole)
        (slav %ud count.pole)
      (slav %p nedl.pole)
    ==
  ::
  ++  di-brief  (brief:di-pact our.bowl last-read.remark.dm)
  ++  di-remark-diff
    |=  diff=remark-diff:c
    ^+  di-core
    =.  remark.dm
      ?-  -.diff
        %watch    remark.dm(watching &)
        %unwatch  remark.dm(watching |)
        %read-at  !! ::  ca-core(last-read.remark.chat p.diff)
      ::
          %read   remark.dm(last-read now.bowl)
  ::    =/  [=time =writ:c]  (need (ram:on:writs:c writs.chat))
  ::    =.  last-read.remark.chat  time
  ::    ca-core
      ==
    =.  cor  (give-brief ship/ship di-brief)
    di-core
  ++  di-pass
    |%
    ++  hark
      |=  =cage
      (pass /hark [our.bowl %hark-store] %poke cage)
    ++  pass
      |=  [=wire =dock =task:agent:gall]
      ^-  card
      [%pass (welp di-area wire) %agent dock task]
    ++  poke-them  |=([=wire =cage] (pass wire [ship dap.bowl] %poke cage))
    ++  proxy-rsvp  |=(ok=? (poke-them /proxy dm-rsvp+!>([our.bowl ok])))
    ++  proxy  |=(=diff:dm:c (poke-them /proxy dm-diff+!>(diff)))
    --
  --
--
