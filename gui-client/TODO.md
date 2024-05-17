### TODOS

For our next task, we'll need to build a menu system for the game.
Menus are essentially windows that pop up with elements inside them like Buttons, scrollbars, text areas, etc.
Menus will be used all over the game from item shops, to loging in, to interacting with NPCs.

- [ ] Menu System Possible elements (A menu may contain any combination or number of these elements)
    - Window (The window where all of the menu elements will reside in, size should be parameterized)
    - Tabs (Tab switch button) - Switches the menu to different pages
    - Text Areas - Able to define text areas in the window.  These are informational labels.
    - Text Inputs - Able to define text input areas in the window, e.g. for giving a login name or password
    - Graphic - Able to place graphics like character portraits, animations, etc within the menu
    - Tooltips - When hovering over clickable elements, a tooltip appears above the element
    - Clickable Buttons (Allowed to pass callback functions into this)
    - Clickable Text (Allowed to add callback functions into this)
    - Scrollable Area (Area of the window that's scrollable with scroll bars, regular window elements can be placed in here and will scroll, e.g. text areas, buttons)
    - Grid of clickable icons (Different from buttons, in that they don't have borders. Items in grids can have tooltips, but the icons are primarily for example, items to purchase, etc)
    - Confirmation windows (Windows that will popup over the window to confirm an action or cancel)
    - Close Button on top right corner (closes the window)
    - Make all other non window elements not clickable when active

The menu system should be generic enough that I can use it in many places in the game.  
Defining the topology of a menu should be straight forward and done in code so that each individual instantiation of a menu (e.g. character stat menu, shop windows, etc) are easy to define and can be easily improved upon / edited by devs.  It might make sense to have a BaseMenu class, and then have other menus inherit from this as well.

Let's first map out the whole class with the primary methods/functions/etc that we'll need.
And then we'll dive deeper into each element to flesh it out.  