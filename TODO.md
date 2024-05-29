# TODOS

- Add worldmap menu
    - [x] Create Icons for Towns, with Transitions
    - [x] Implement Scrolling / Zoom-out / Zoom-in
    - [x] Use Player Flags for Unlocked Zones, 1 flag per zone. 
        - [x] E.g. completing r1z1 will unlock flag 2, which is Tilford
    - [ ] If zoomed out, and location clicked on: Zoom in, open a prompt window "Travel to: Location?"
    - [ ] Put a star icon or something on the current location    

- Add BaseAreaScene
    - [ ] Takes ZoneTemplate as input most likely
    - [ ] Handle NavigationMenu and Automap.  Generate Areas and then load in client upon entering the Zone

- Redo Hotbar Menu (bottom left) Using menu system
    - [ ] Leverage the menu system
    - [ ] Add the tween growth of icons to the menu iconButton class as optional argument
    - [ ] Add hover sound effect as optional argument

- Redo Party Display Menu using Menu System
