::  TODO: move outside /desk directory, don't ship this
::
::DONE  assert things about state
::DONE  test all actions that don't require cross-ship comms
::TODO  test cross-ship comms (will do manual)
::
::  - test that partial checkpoint is partial
::  - test join, leave, read, read-at
::  - test permissions
::
/-  spider, c=channel, g=groups, e=epic
/+  s=strandio
=,  strand=strand:spider
^-  thread:spider
|=  arg=vase
=/  m  (strand ,vase)
^-  form:m
=/  verb  (fall !<((unit ?) arg) |)
=/  group  %hackers
=/  chan  %hackweek
=/  app  %channels
=/  server  (cat 3 app '-server')
;<  our=ship  bind:m  get-our:s
=/  =nest:c  [%diary our chan]
|^
=/  m  (strand ,vase)
;<  ~  band:m  (poke-our:s %hood %kiln-nuke !>([%groups &]))
;<  ~  band:m  (poke-our:s %hood %kiln-revive !>(%groups))
;<  ~  band:m
  =/  m  (strand ,~)
  ?.  verb  (pure:m ~)
  ;<  ~  band:m  (poke-our:s app %verb !>(%loud))
  (poke-our:s server %verb !>(%loud))
;<  ~  band:m  (group-create group 'hacking' 'hacked' '' '' [%open ~ ~] ~ |)
;<  ~  band:m
  (act %create %diary chan [our group] 'hack week' 'hacking all week' ~ ~)
::  make a bunch of posts
::
=|  count=@ud
|-
;<  =id-post:c  band:m  (add-post count)
?:  (lth count 30)
  $(count +(count))
::  leave a single comment on the last post
::
;<  now=@da  band:m  get-time:s
=/  =memo:c   [~[[%inline ~['hacking is bad']]] our now]
;<  ~  band:m  (act %channel nest %post %reply id-post %add memo)
::
::  ensure that we've got all the same posts on both sides
::
;<  posts=v-posts:c  band:m  (check-post-count +(count))
;<  sst=server-state  band:m  get-server-state
?>  (eq !>(posts) !>(posts:(~(got by channels.sst) nest)))
::
::  nuke %diary and re-join the channel.  ensure we only got a partial
::  checkpoint
::
:: ;<  ~  band:m  (poke-our:s %hood %kiln-nuke !>([app |]))
:: ;<  ~  band:m  (poke-our:s %hood %kiln-revive !>(%groups))
:: ;<  ~  band:m  (act %channel nest %join [our group])
:: ;<  *  band:m  (check-post-count 20)
:: ::
:: ::  post another essay, ensure we got it
:: ::
:: =.  count  +(count)
:: ;<  *  band:m  (add-post count)
:: ;<  *  band:m  (check-post-count 21)
::
;<  ~  band:m  test-c-diary
;<  ~  band:m  test-c-post
::
(pure:m !>(%success))
::
+$  state         [%0 channels=v-channels:c voc=(map [nest:c plan:c] (unit said:c)) pins=(list nest:c)]
+$  server-state  [%0 channels=v-channels:c]
::
++  eq
  |=  [a=vase b=vase]
  ^-  ?
  ?:  =(q.a q.b)  &
  %-  (slog 'need' (sell a) 'have' (sell b) ~)
  |
::
++  neq
  |=  [a=vase b=vase]
  ^-  ?
  ?:  !=(q.a q.b)  &
  %-  (slog 'need different' (sell a) ~)
  |
::
++  strand
  |*  a=mold
  |%
  ++  def  (^strand a)
  ++  form  form:def
  ++  pure  pure:def
  ++  bind  bind:def
  ++  band
    |*  b=mold
    =/  m  (strand ,a)
    |=  [m-b=(strand-form-raw:rand b) fun=$-(b form:m)]
    ^-  form:m
    ;<  ~  bind:m  (sleep:s `@dr`0)
    ((bind:m b) m-b fun)
  --
::
++  act
  |=  =a-channels:c
  =/  m  (strand ,~)
  ^-  form:m
  (poke-our:s app %channel-action !>(a-channels))
::
++  group-create
  |=  =create:g
  =/  m  (strand ,~)
  ^-  form:m
  (poke-our:s %groups %group-create !>(create))
::
++  dbug
  |=  =dude:gall
  =/  m  (strand ,~)
  ^-  form:m
  (poke-our:s dude %dbug !>([%state '']))
::
++  get-channel
  =/  m  (strand ,v-channel:c)
  ^-  form:m
  ;<  st=state  band:m  get-state
  (pure:m (~(got by channels.st) nest))
::
++  get-state
  =/  m  (strand ,state)
  ^-  form:m
  ;<  =bowl:spider  band:m  get-bowl:s
  %-  pure:m
  =-  !<(state vase)
  !<  [[%negotiate *] =vase]
  .^  vase
      /gx/(scot %p our.bowl)/[app]/(scot %da now.bowl)/dbug/state/noun
  ==
::
++  get-server-state
  =/  m  (strand ,server-state)
  ^-  form:m
  ;<  =bowl:spider  band:m  get-bowl:s
  %-  pure:m
  =-  !<(server-state vase)
  !<  [[%negotiate *] =vase]
  .^  vase
      /gx/(scot %p our.bowl)/[server]/(scot %da now.bowl)/dbug/state/noun
  ==
::
++  check-post-count
  |=  count=@ud
  =/  m  (strand ,v-posts:c)
  ^-  form:m
  ;<  channel=v-channel:c  band:m  get-channel
  ?>  (eq !>(count) !>(~(wyt by posts.channel)))
  (pure:m posts.channel)
::
++  add-post
  |=  count=@ud
  =/  m  (strand ,id-post:c)
  ^-  form:m
  ;<  send=@da  band:m  get-time:s
  =/  =essay:c  [[~ our send] %diary (cat 3 'on hacking #' (scot %ud count)) '']
  ;<  ~  bind:m  (act %channel nest %post %add essay)
  (pure:m send)
::
++  add-reply
  |=  [=id-post:c text=cord]
  =/  m  (strand ,id-reply:c)
  ^-  form:m
  ;<  send=@da  band:m  get-time:s
  =/  =memo:c  [~[[%inline ~[text]]] our send]
  ;<  ~  bind:m  (act %channel nest %post %reply id-post %add memo)
  (pure:m send)
::
::  test non-post diary commands
::
++  test-c-diary
  =/  m  (strand ,~)
  ^-  form:m
  ;<  ~  band:m  (act %channel nest %add-writers %del-role ~ ~)
  ::
  ;<  now=@da  band:m  get-time:s
  ;<  old=v-channel:c  band:m  get-channel
  ?>  (neq !>(%grid) !>(view.view.old))
  ?>  (neq !>(%alpha) !>(sort.sort.old))
  ?>  (neq !>(&) !>((~(has in writers.perm.perm.old) %add-role)))
  ?>  (neq !>(|) !>((~(has in writers.perm.perm.old) %del-role)))
  ?>  (neq !>(`~[now]) !>(order.order.old))
  ::
  ;<  ~  band:m  (act %channel nest %view %grid)
  ;<  ~  band:m  (act %channel nest %sort %alpha)
  ;<  ~  band:m  (act %channel nest %add-writers %add-role ~ ~)
  ;<  ~  band:m  (act %channel nest %del-writers %del-role ~ ~)
  ;<  ~  band:m  (act %channel nest %order ~ now ~)
  ::
  ;<  new=v-channel:c  band:m  get-channel
  ?>  (eq !>(%grid) !>(view.view.new))
  ?>  (eq !>(%alpha) !>(sort.sort.new))
  ?>  (eq !>(&) !>((~(has in writers.perm.perm.new) %add-role)))
  ?>  (eq !>(|) !>((~(has in writers.perm.perm.new) %del-role)))
  ?>  (eq !>(`~[now]) !>(order.order.new))
  ::
  ?>  (eq !>(+(rev.view.old)) !>(rev.view.new))
  ?>  (eq !>(+(rev.sort.old)) !>(rev.sort.new))
  ?>  (eq !>(+(+(rev.perm.old))) !>(rev.perm.new))
  ?>  (eq !>(+(rev.order.old)) !>(rev.order.new))
  (pure:m ~)
::
::  test post diary commands
::
++  test-c-post
  =/  m  (strand ,~)
  ^-  form:m
  ;<  old=v-channel:c  band:m  get-channel
  =/  count=@ud  ~(wyt by posts.old)
  ;<  id=id-post:c  band:m  (add-post 1.000)
  ;<  new=v-channel:c  band:m  get-channel
  ?>  (eq !>(+(count)) !>(~(wyt by posts.new)))
  ?>  (eq !>(&) !>((has:on-v-posts:c posts.new id)))
  ::
  =/  =essay:c  [[~ our id] %diary 'yes' '']
  ;<  ~  band:m  (act %channel nest %post %edit id essay)
  ;<  new=v-post:c  band:m  (get-post id)
  ?>  (eq !>([%diary 'yes' '']) !>(kind-data.new))
  ::
  ?>  (eq !>(~) !>(reacts.new))
  ;<  ~  band:m  (act %channel nest %post %add-react id our ':smile:')
  ;<  new=v-post:c  band:m  (get-post id)
  =/  react  (~(got by reacts.new) our)
  ?>  (eq !>([0 `':smile:']) !>(react))
  ::
  ;<  ~  band:m  (act %channel nest %post %del-react id our)
  ;<  new=v-post:c  band:m  (get-post id)
  =/  react  (~(got by reacts.new) our)
  ?>  (eq !>([1 ~]) !>(react))
  ::
  ;<  ~  band:m  (act %channel nest %post %del id)
  ;<  new=v-channel:c  band:m  get-channel
  ?>  (eq !>(~) !>((got:on-v-posts:c posts.new id)))
  ::
  (pure:m ~)
::
++  get-post
  |=  =id-post:c
  =/  m  (strand ,v-post:c)
  ^-  form:m
  ;<  channel=v-channel:c  band:m  get-channel
  (pure:m (need (got:on-v-posts:c posts.channel id-post)))
::  test diary reply commands
::
++  test-c-reply
  =/  m  (strand ,~)
  ^-  form:m
  ;<  =id-post:c  band:m  (add-post 1.001)
  ::
  ;<  id=id-reply:c  band:m  (add-reply id-post 'hi')
  ;<  reply=v-reply:c  band:m  (get-reply id-post id)
  ?>  (eq !>([~ ~['hi']]) !>(content.reply))
  ::
  ;<  ~  band:m  (act %channel nest %post %reply id-post %add-react id our ':smile:')
  ;<  new=v-reply:c  band:m  (get-reply id-post id)
  =/  react  (~(got by reacts.reply) our)
  ?>  (eq !>([0 `':smile:']) !>(react))
  ::
  ;<  ~  band:m  (act %channel nest %post %reply id-post %del-react id our)
  ;<  new=v-reply:c  band:m  (get-reply id-post id)
  =/  react  (~(got by reacts.reply) our)
  ?>  (eq !>([1 ~]) !>(react))
  ::
  ;<  ~  band:m  (act %channel nest %post %reply id-post %del id)
  ;<  post=v-post:c  band:m  (get-post id-post)
  ?>  (eq !>(~) !>((got:on-v-replies:c replies.post id)))
  ::
  (pure:m ~)
::
++  get-reply
  |=  [=id-post:c =id-reply:c]
  =/  m  (strand ,v-reply:c)
  ^-  form:m
  ;<  post=v-post:c  band:m  (get-post id-post)
  (pure:m (need (got:on-v-replies:c replies.post id-reply)))
--
