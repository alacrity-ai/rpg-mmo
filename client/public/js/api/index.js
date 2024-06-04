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
import battlerApi from './battler';
import settingsApi from './settings';
import partyAPI from './party';

export default {
  party: partyAPI,
  battlerAction: battlerActionApi,
  battler: battlerApi,
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
  settings: settingsApi,
};
