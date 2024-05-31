import characterApi from './character';
import partyApi from './party';
import zoneApi from './zone';
import combatApi from './combat';
import authApi from './auth';
import npcApi from './npc';
import shopApi from './shop';
import chatApi from './chat';
import itemApi from './item';
import battleApi from './battle';
import battlerActionApi from './battlerAction';

export default {
  battlerAction: battlerActionApi,
  battle: battleApi,
  character: characterApi,
  party: partyApi,
  zone: zoneApi,
  combat: combatApi,
  auth: authApi,
  npc: npcApi,
  shop: shopApi,
  chat: chatApi,
  item: itemApi,
};
