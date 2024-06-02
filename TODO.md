# TODOS


What We DID:
We refactored the zone instance creation and all the requisite tables (area_instances, zone_instances, zone_templates).
zone creator is now creating a properly linked zone_instance, and area_instances with all the information they need to instantiate ExpeditionScene.
We just added binding the characterId to the socket on character login (We should validate that's working)
- [x] Next we need to create the createParty call in:
    client api
    partyHandler (server)
    partyTasks
    and link it in the worker.js, and in the index.js
    Then make sure the client creates a party immediately on login with the character.
    Verify this is the case.

    - [x] After that, we can then create a client endpoint on clicking a map location that is green, or red.
    It will:
        make a new client api request to the server called requestExpedition(party_id, zone template name)
        request expedition will ask the server to create a zone_instance, and then the server will return the first area_instance to the client
        The client will then instantiate the expeditionscene from the area_instance data.

        Update: We have achieved up to this point, with some caveats:
        1) Flag checking has been added in the processRequestZoneTask but is commented out
        2) Custom cursor behaving strangely, resolved by removing custom cursor updating from the update method.

        THEN:
        - [x] We will work on rendering the partial map, and the navigation controls.
        We will make sure that navigating to the next zone does the following:
            new client api call: requestAreaInstance(current_area_instance_id, area_instance_id we are going to).
            we'll need in the zoneHandler (or areaHandler) a requisite handler
            we'll need a zoneTasks task for processRequestAreaInstanceTask
                This will check that the current_area_instance is `cleared` and that the `encounter_cleared` is true, if there is an encounter, if it is, it will give the client the request area_instance data.
            The client, upon receiving this data, will instantiate a new areascene from the data.
        
        THEN HANDLE ENCOUNTERS:
            - [x] If the area has an encounter, raise a popup window that says something like "Detected a hostile presence!" with two buttons: Battle and Retreat
                - Battle starts the encounter
                - Retreat sends the player back to the previous area
            - [x] In the scenario that a player goes into an area, chooses Battle, that player will go into the battle instance.  The other players in the party may not have gone to that area yet.  When they enter the area, they'll get the same prompt.  We therefore need to check to see if the battle is already in progress.  If it is, the player will join the battle in progress, if it is not, the player will make a request to the server to instantiate a new battle instance, and join it.


                THEN:
                    - [ ] We will figure out how to determine when an encounter is finished.
                    Probably some API call from the client saying that they killed all the enemies in the encounter, then the server will verify, and update the area_instance to show the encounter is cleared, and that they can return to the area_instance scene.
                        We can make a debug command that simply drops all the health of the enemy team to 0 to test this.  We have the win condition checks in the BattleManager.
                    - [ ] We will need to handle the Retreat option.
                    - [ ] Keep in mind we may need to handle more cleanup scenarios for battle instances
                    - [ ] When the player team wins a battle, we need to make sure to superimpose the current health / mana of the battler onto the characters.
                            If for some reason the character is buffed beyond their maxhp, we need to make sure that the health we superimpose isn't higher than the max hp/mp.

                    THEN:
                        - [ ] Delete the entire database, and then rerun the server to create and populate the tables.
                            Verify that the game is still able to run, including creating a character from scratch, entering an area, and going into battle.
                        - [ ] Do basic multiplayer testing. 
                            - [ ] Can two separate accounts that are logged in both have their own instanced areas and combat?
                            - [ ] Add basic party invite functionality to join two characters into one party.
                            - [ ] Verify that partied characters enter the same area instance
                            - [ ] Verify that partied characters enter the same combat encounter

                        THEN:
                            - [ ] Begin planning ability system
                            - [ ] Begin planning enemy script system

THEN:
    Modify the trans


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
    - [x] Refactor zonecreator so that there are never encounters in the first Area in a zone instance.
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

