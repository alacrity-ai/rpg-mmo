# Combat System

The combat system in this game is a live-action system where every action, including movement, triggers a cooldown. Combat actions, like movement, abilities, item usage, etc., are all performed by Battler Instances. A BattlerInstance is the representation of either a player character or an NPC in a battle. The battler_instance MySQL table tracks the stats, positions, names, etc., of battler instances. The battle itself is represented by a BattleInstance. This is also tracked in MySQL.

## Combat System Overview

- **Type**: Live-action system where every action, including movement, triggers a cooldown.
- **Entities**:
    - **BattlerInstance**: Represents either a player character or an NPC in a battle.
    - **BattleInstance**: Represents the battle itself.

## High-Level Implementation

### Communication Flow

1. **Client Joining Battle**:
    
    - The client joins a battle, and the server adds their socket to a channel named 'battle-<battleInstanceId>'.
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

### Command Flow from Start to End of Battle

#### 1. **Battle Initialization**

- **Client Requests Battle Instance**:
    
    - The client sends a request to the server to join or create a battle instance via the 'getBattleInstance' event.
- **Server Enqueues Battle Instance Task**:
    
    - The server receives the request and enqueues a `getBattleInstance` task in Redis.
    - A callback function is set to handle the result of the task.

#### 2. **Creating/Retrieving Battle Instance**

- **Worker Processes `getBattleInstance` Task**:
    
    - A worker picks up the `getBattleInstance` task and uses `BattleCreator` to either create a new battle instance or retrieve an existing one from the database.
    - The worker publishes the result to the `task-result` channel in Redis.
- **Server Handles Battle Instance Result**:
    
    - The server, subscribed to the `task-result` channel, processes the result of the `getBattleInstance` task.
    - The server updates the client's socket with the battle and battler IDs and sends the battle instance details back to the client.

#### 3. **Starting NPC Scripts**

- **Server Enqueues `startBattlerScripts` Task**:
    
    - Upon successfully sending the battle instance details to the client, the server enqueues a `startBattlerScripts` task with a delay of a few seconds.
- **Worker Processes `startBattlerScripts` Task**:
    
    - A worker picks up the `startBattlerScripts` task and retrieves the battle instance and all associated `BattlerInstances` from the database.
    - For each NPC `BattlerInstance` with a script, the worker enqueues an initial `runScriptAction` task.

#### 4. **Running NPC Scripts**

- **Worker Processes `runScriptAction` Task**:
    
    - A worker picks up the `runScriptAction` task and retrieves the `BattlerInstance` and its current phase.
    - The worker uses `NPCScriptExecutor` to run the script for the NPC.
    - The script determines the action based on the current phase and directly uses the `BattleActionProcessor` to process the action.
    - The `BattleActionProcessor` validates and executes the action, then updates the database with the result.
    - The script publishes the result to the `task-result` channel in Redis.
- **Enqueuing Next Phase**:
    
    - After processing the action, the `NPCScriptExecutor` enqueues the next `runScriptAction` task with a delay, ensuring the next phase will be executed in the future.

#### 5. **Handling Player Actions**

- **Client Requests Player Action**:
    
    - A client sends a request to perform an action (e.g., move, item, ability) via the 'addBattlerAction' event.
- **Server Enqueues Player Action Task**:
    
    - The server enqueues an `addBattlerAction` task in Redis with the details of the action.
- **Worker Processes Player Action Task**:
    
    - A worker picks up the `addBattlerAction` task and processes it using the `BattleActionProcessor`.
    - The action is validated, executed, and the result is updated in the database.
    - The worker publishes the result of the action to the `task-result` channel in Redis.
- **Server Handles Action Result**:
    
    - The server processes the result from the `task-result` channel.
    - The server sends the action result to all clients in the battle instance via the appropriate socket channel.

#### 6. **Continuous NPC and Player Actions**

- **Ongoing NPC Script Execution**:
    
    - NPC scripts continue to execute in phases, with each phase enqueuing the next `runScriptAction` task and directly using the `BattleActionProcessor` for actions.
- **Ongoing Player Actions**:
    
    - Players continue to send action requests, and the server and workers handle these actions, updating all clients with the results.

#### 7. **Ending the Battle**

- **Determining Battle End**:
    
    - The battle ends when a victory condition is met (e.g., all enemies defeated, player defeated).
    - The server or a worker determines that the battle has ended based on the state of the `BattlerInstances`.
- **Finalizing the Battle**:
    
    - The server sends a final update to all clients indicating the end of the battle and the result (victory/defeat).
    - Any remaining tasks related to the battle instance are cleaned up or ignored.
- **Post-Battle Processing**:
    
    - The server may perform additional post-battle processing, such as updating player stats, distributing rewards, or saving progress.