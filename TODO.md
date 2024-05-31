# TODOS



PREREQ: Add encounter_cleared BOOLEAN column to area_instances table.

FLOW:
1. Client clicks on Area in the Map, Requesting a Zone Instance for that Zone (template)
2. Handler on server/worker runs services/expeditions/zoneCreator.js to create a Zone, if the character has the proper flags for the zone.
3. Server responds with the required data to instantiate first Area
4. Client Instantiates ExpeditionScene using the first area data
5. When client moves to second area, sends request to server for second area data
6. Handler on server/worker handles either giving area, or giving encounter:
    - If encounter, and !encounter_cleared, server creates Battlers, Battle, and provides information to client to start the encounter.
    - If not encounter, or encounter_cleared, server provides the next Area information, and continues from step 3.
7. If player had encounter, and wins encounter, client sends message saying it won the encounter, if the server agrees that the player won the encounter, the server will send the client the Area information, and will continue from step 3.

NOTE: Server will have to send both the area_instance row for the area, as well as the name of the zone, and the connections for the first area.  Client will need to register the id of the current zone_template that it is in, and the id of the area_instance that it is in, and when attempting to change areas, it will need to register the id of the area_instance it's trying to go to.

NOTE: If the player requests access to an area_instance that does not exist, the player will be transported back to their last Town visited.  If the player requests access to an area that they are not flagged for, they will receive an error message in console.

- Add BaseAreaScene
    - [ ] Refactor zonecreator so that there are never encounters in the first Area in a zone instance.
    - [ ] Takes ZoneTemplate as input most likely
    - [ ] Handle NavigationMenu and Automap.  Generate Areas and then load in client upon entering the Zone
    - [ ] For character to enter a new area screen, they must reach out to the server to get permission.  This allows for us to make sure the area they enter is in sync with what we see in the database.  For this reason, the client should probably only see the AreaInstance that they are currently in within a ZoneInstance, and not the ZoneInstance itself.  Areas are populated by querying the ZoneInstance/AreaInstances tables. 

- BattleSystem
    - [x] Create BattleScene
    - [x] Create Battle Tiles and Management Class
    - [x] Create Battler Tables and Battle Table 
    - [x] Integrate basic movement with server/client communication
    - [x] Create Battle Hotbar and Movement Hotbar
    - [x] Create Cooldown Animation
    - [ ] Create Singleton Class Called "BattleEncounterManager"
        - [ ] Should have functions to start the encounter scene (with the required data), create BattleInstance in the DB, and BattlerInstances for the party and enemies.
        - [ ] Integrate character party.  Character is always in a party of at least 1 (Themselves).  Battle encounter targets the party, not a single player, this way all party members will receive the message and go into combat together.
        - [ ] Add class to BaseAreaScene, and BaseTownScene
        - [ ] Class will listen for 'startBattleEncounter' message from server
        - [ ] Upon receiving message from server, Start the encounter
            - [ ] Message from server contains all required data to start encounter
        - [ ] Decide what will cause the server to send this message to the client. E.g. a player entering an area instance within a zone, leverages:
            - AreaInstance, EncounterTemplate, NpcTemplate, and Characters tables must be used in order to create the encounter.


- Add worldmap menu
    - [x] Create Icons for Towns, with Transitions
    - [x] Implement Scrolling / Zoom-out / Zoom-in
    - [x] Use Player Flags for Unlocked Zones, 1 flag per zone. 
        - [x] E.g. completing r1z1 will unlock flag 2, which is Tilford
    - [ ] If zoomed out, and location clicked on: Zoom in, open a prompt window "Travel to: Location?"
    - [x] Put a star icon or something on the current location    

- Redo Hotbar Menu (bottom left) Using menu system
    - [ ] Leverage the menu system
    - [ ] Add the tween growth of icons to the menu iconButton class as optional argument
    - [ ] Add hover sound effect as optional argument

- Redo Party Display Menu using Menu System
