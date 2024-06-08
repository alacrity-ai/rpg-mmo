const logger = require('../../../utilities/logger')

class NPCScriptExecutor {
    constructor(battleActionProcessor, battlerInstance, battlerInstances, battleInstanceId) {
        this.battleActionProcessor = battleActionProcessor; // The BattleActionProcessor instance
        this.battlerInstance = battlerInstance; // The BattlerInstance running the script
        this.battlerInstances = battlerInstances; // All BattlerInstances in the battle
        this.battleInstanceId = battleInstanceId; // The ID of the BattleInstance
    }

    async runScript() {
        const { scriptPath, id: battlerId } = this.battlerInstance;
        if (!scriptPath) {
            throw new Error(`NPC script not found for battler ${battlerId}`);
        }
        // Import the NPC script class based on the scriptPath
        const ScriptClass = require(`./npc_scripts/${scriptPath}`);

        // Create an instance of the NPC script class
        const npcScript = new ScriptClass(this.battleActionProcessor, this.battlerInstance, this.battlerInstances, this.battleInstanceId);

        // Execute the NPC script, which will utilize the BattleActionProcessor, and return the result
        const actionResult = await npcScript.execute();
        return actionResult;
    }
}

module.exports = NPCScriptExecutor;
