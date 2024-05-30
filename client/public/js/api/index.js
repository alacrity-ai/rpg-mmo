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
import battlerApi from './battler';

export default {
  battle: battleApi,
  battler: battlerApi,
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
