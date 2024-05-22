// services/dialogues/blacksmithDialogue.js

const BaseDialogue = require('./BaseDialogue');

class BlacksmithDialogue extends BaseDialogue {
  constructor(npcDialogueInstance) {
    super(npcDialogueInstance);
  }

  async getDialogueText() {
    const state = await this.getCurrentState();
    switch (state) {
      case 0:
        return "Hello, adventurer! What can I do for you today?";
      case 1:
        return "I see you need some new gear. What are you looking for?";
      case 2:
        return "Here's your new sword. Good luck on your journey!";
      default:
        return "I don't have anything more to say to you.";
    }
  }

  async handleState(action) {
    const state = await this.getCurrentState();
    switch (state) {
      case 0:
        if (action === 'ask_for_gear') {
          await this.transitionState(1);
        }
        break;
      case 1:
        if (action === 'buy_sword') {
          // Assuming buyItem is a method in some service
          await this.services.shopHandler.buyItem(this.npcDialogueInstance.character_id, 'sword');
          await this.transitionState(2);
        }
        break;
      case 2:
        if (action === 'thank') {
          await this.transitionState(0);
        }
        break;
      default:
        break;
    }
  }
}

module.exports = BlacksmithDialogue;
