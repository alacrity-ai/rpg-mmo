# Combat System

The combat system in this game is a live action system where every action, including movement, triggers a cooldown.  
Combat actions, like movement, abilities, item usage, etc, are all performed by Battler Instances.
A BattlerInstance is the representation of either a player character, or an NPC in a battle.  The battler_instance MySQL table tracks the stats, positions, names, etc of battler instances.
The battle itself is represented by a BattleInstance.  This is also tracked in MySQL.

## Combat System Overview

- **Type**: Live-action system where every action, including movement, triggers a cooldown.
- **Entities**:
    - **BattlerInstance**: Represents either a player character or an NPC in a battle.
    - **BattleInstance**: Represents the battle itself.

## High Level Implementation

### Communication Flow

1. **Client Joining Battle**:
    
    - The client joins a battle and the server adds their socket to a channel named 'battle-<battleInstanceId>'.
2. **Client Action Request**:
    
    - The client emits a socket event 'addBattlerAction', including:
        - `battleInstanceId`
        - `battlerId`
        - `actionType` (e.g., 'move', 'item', 'ability')
        - `actionData` (specific data for the action; for movement, it includes current and desired coordinates)
3. **Server Handling Action Request**:
    
    - The server's `battlerActionHandler` listens for 'addBattlerAction' events.
    - It queues an `addBattlerAction` task in Redis with the relevant details.
4. **Worker Processing Action**:
    
    - The worker polls Redis and sees the 'addBattlerAction' task.
    - It runs `processAddBattlerActionTask`, which:
        - Instantiates `BattleActionProcessor` (BAP).
        - Calls `BattleActionProcessor.processSingleAction` with the action details.
5. **BattleActionProcessor (BAP) Logic**:
    
    - **Action Type Handling**: BAP switches on `action.actionType` to call the appropriate method (e.g., ability, move, item).
    - **Cooldown Check**: Checks Redis for the battler’s cooldown status using 'cooldown:<battlerId>'.
        - If the battler is not on cooldown, the action proceeds.
    - **Business Logic**: Performs necessary updates, often involving database changes (e.g., health updates).
    - **Response Object**: Returns an object containing:
        - `success` (true/false)
        - `message` (description of the result)
        - `battlerId`
        - `actionType` (e.g., 'move')
        - `actionData` (e.g., old and new coordinates)
6. **Cooldown Update**:
    
    - BAP updates the Redis cooldown key with a new end time.
7. **Worker Task Result Handling**:
    
    - After BAP processes the action, the worker publishes the result to a Redis channel 'task-result:<taskId>'.
8. **Server Task Result Handling**:
    
    - The server subscribes to the task-result channel and processes the result.
    - It emits the result to all clients in the 'battle-<battleInstanceId>' channel as 'completedBattlerAction'.
9. **Client Response Handling**:
    
    - The client's `BattleActionResponseHandler` listens for 'completedBattlerAction' events.
    - The `handleCompletedBattlerAction` method updates the client game state/GUI based on the action type and result data.

