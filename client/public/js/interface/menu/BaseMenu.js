import IconHelper from '../IconHelper.js'; // 
import SoundFXManager from '../../audio/SoundFXManager.js';
import { atlasToSprite } from '../../graphics/AtlasTools.js';


class BaseMenu {
    constructor(scene, x, y, width, height, backgroundColor = 0x000000, backgroundAlpha = 0.8, borderRadius = 10, spriteSheetKey = null, onClose = null, hasCloseButton = false, hasWindow = true, hasWindowBorder = false) {
        this.initParams = { scene, x, y, width, height, backgroundColor, backgroundAlpha, borderRadius, spriteSheetKey, onClose, hasCloseButton };

        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.backgroundColor = backgroundColor;
        this.backgroundAlpha = backgroundAlpha;
        this.borderRadius = borderRadius;
        this.tabs = { 0: [] }; // Initialize with a default tab
        this.currentTab = 0;
        this.spriteSheetKey = spriteSheetKey;
        this.iconHelper = new IconHelper(scene, 'icons'); // Initialize the IconHelper with the preloaded key
        this.onClose = onClose;
        this.hasCloseButton = hasCloseButton;
        this.textInputs = {}; // Store references to text inputs

        if (hasWindow) {
            this.addWindow(x, y, width, height, backgroundColor, backgroundAlpha, borderRadius, hasWindowBorder);
        }
        if (hasCloseButton) this.addCloseButton();

        // Initialize table properties
        this.currentPage = 0;
        this.maxVisibleRows = 7;
        this.selectedRow = null;
        this.rowData = [];
    }

    async addPortrait(x, y, atlasImagePath, tab = 0, callback = null, startingFrame = 0) {
        try {
            const spriteConfig = await atlasToSprite(this.scene, atlasImagePath, 10, startingFrame);
    
            // Create the sprite and add it to the scene
            const sprite = this.scene.add.sprite(x, y, spriteConfig.key).play(spriteConfig.animKey);
            this.addElementToTab(tab, sprite);
    
            const spriteWidth = 75;
            const spriteHeight = 100;
            const borderRadius = 10;
    
            // Create the mask shape (rounded rectangle)
            const maskShape = this.scene.add.graphics();
            maskShape.fillStyle(0xffffff, 1);
            maskShape.fillRoundedRect(x - spriteWidth / 2, y - spriteHeight / 2, spriteWidth, spriteHeight, borderRadius);
    
            // Create a mask from the shape and apply it to the sprite
            const mask = maskShape.createGeometryMask();
            sprite.setMask(mask);
    
            // Hide the mask shape itself (it's only needed for the mask)
            maskShape.setVisible(false);
    
            // Create the border graphics
            const border = this.scene.add.graphics();
            border.lineStyle(2, 0xffffff, 1);
            border.strokeRoundedRect(x - spriteWidth / 2, y - spriteHeight / 2, spriteWidth, spriteHeight, borderRadius);
    
            // Ensure the border is above the sprite
            border.depth = sprite.depth + 1;
            this.addElementToTab(tab, border);
    
            if (callback) {
                // Set interactivity on the sprite
                sprite.setInteractive({ useHandCursor: false })
                    .on('pointerdown', () => {
                        SoundFXManager.playSound('assets/sounds/menu/ui_3.wav');
                        callback();
                    })
                    .on('pointerover', () => {
                        SoundFXManager.playSound('assets/sounds/menu/ui_1.wav');
                        border.clear();
                        border.lineStyle(2, 0xffff00, 1); // Yellow border on hover
                        border.strokeRoundedRect(x - spriteWidth / 2, y - spriteHeight / 2, spriteWidth, spriteHeight, borderRadius);
                    })
                    .on('pointerout', () => {
                        border.clear();
                        border.lineStyle(2, 0xffffff, 1); // White border
                        border.strokeRoundedRect(x - spriteWidth / 2, y - spriteHeight / 2, spriteWidth, spriteHeight, borderRadius);
                    });
            }
    
            // Create a container to group all elements
            const container = this.scene.add.container(0, 0, [sprite, maskShape, border]);
            this.addElementToTab(tab, container);
    
            // Return the container
            return container;
        } catch (error) {
            console.error('Error loading portrait:', error);
        }
    }

    removePortrait(container, tab = 0) {
        if (container && container.list) {
            container.list.forEach(element => {
                element.destroy();
            });
            container.destroy();
            this.tabs[tab] = this.tabs[tab].filter(item => item !== container);
        }
    }    

    addTable(x, y, width, height, rowData, columnWidths, tab = 0, onRowSelected = null) {
        this.rowData = rowData;
        const container = this.scene.add.container(x, y);

        // Draw table background
        const tableArea = this.scene.add.graphics();
        tableArea.fillStyle(0x000000, 1);
        tableArea.fillRoundedRect(-width / 2, -height / 2, width, height, 10);
        tableArea.lineStyle(2, 0xffffff, 1);
        tableArea.strokeRoundedRect(-width / 2, -height / 2, width, height, 10);
        container.add(tableArea);

        // Define padding and row height
        const padding = 10;
        const rowHeight = 40;

        // Store references to text objects and backgrounds for easy hiding/showing
        const textObjects = [];
        const rowBackgrounds = [];

        // Function to render the table rows based on the current page
        const renderTable = () => {
            // Hide all existing text objects and backgrounds
            textObjects.forEach(text => text.setVisible(false));
            rowBackgrounds.forEach(bg => bg.setVisible(false));

            let offsetY = -height / 2 + padding;

            // Render the header row
            let offsetX = -width / 2 + padding;
            rowData[0].forEach((cell, cellIndex) => {
                const cellText = this.scene.add.text(offsetX, offsetY, cell.text, {
                    fontSize: '16px',
                    fill: '#ffcc00' // Yellow for header
                }).setOrigin(0, 0.5); // Center text vertically
                container.add(cellText);
                textObjects.push(cellText);
                offsetX += columnWidths[cellIndex] + padding; // Use column width and add padding between columns
            });

            offsetY += rowHeight; // Move to the next row position

            // Render the rest of the rows
            const startRow = this.currentPage * (this.maxVisibleRows - 1) + 1; // Skip the header row for pagination
            const endRow = startRow + (this.maxVisibleRows - 1);
            const rowsToDisplay = rowData.slice(startRow, endRow);

            rowsToDisplay.forEach((row, rowIndex) => {
                let offsetX = -width / 2 + padding;
                const rowIndexGlobal = startRow + rowIndex; // Global index of the row

                // Determine row background color
                const isSelected = this.selectedRow === rowIndexGlobal;
                const rowBackgroundColor = isSelected ? 0x00008B : 0x333333; // Dark blue if selected, grey otherwise
                const textColor = isSelected ? '#ffcc00' : '#ffffff'; // Yellow if selected, white otherwise

                // Draw row background
                const rowBackground = this.scene.add.graphics();
                rowBackground.fillStyle(rowBackgroundColor, 1);
                rowBackground.fillRoundedRect(-width / 2 + padding, offsetY - rowHeight / 2 + 5, width - padding * 2, rowHeight - 10, 5);
                container.add(rowBackground);
                rowBackgrounds.push(rowBackground);

                // Add interaction to row background
                rowBackground.setInteractive(new Phaser.Geom.Rectangle(-width / 2 + padding, offsetY - rowHeight / 2 + 5, width - padding * 2, rowHeight - 10), Phaser.Geom.Rectangle.Contains)
                    .on('pointerdown', () => {
                        SoundFXManager.playSound('assets/sounds/menu/ui_2.wav');
                        this.selectedRow = rowIndexGlobal;
                        renderTable();
                        if (onRowSelected) {
                            onRowSelected(this.selectedRow);
                        }
                    });

                row.forEach((cell, cellIndex) => {
                    const cellText = this.scene.add.text(offsetX, offsetY, cell.text, {
                        fontSize: '16px',
                        fill: textColor // Set text color based on selection state
                    }).setOrigin(0, 0.5); // Center text vertically
                    container.add(cellText);
                    textObjects.push(cellText);
                    offsetX += columnWidths[cellIndex] + padding; // Use column width and add padding between columns
                });
                offsetY += rowHeight; // Move to the next row position
            });
        };

        // Initial render of the table
        renderTable();

        // Add the container to the specified tab
        this.addElementToTab(tab, container);

        // Function to create pagination buttons
        const createPaginationButtons = () => {
            // Add up arrow
            const upArrow = this.scene.add.text(0, -height / 2 - 14, '▲', { fontSize: '20px', fill: '#ffffff' })
                .setOrigin(0.5)
                .setInteractive()
                .on('pointerdown', () => {
                    if (this.currentPage > 0) {
                        this.currentPage--;
                        renderTable();
                    }
                })
                .on('pointerover', () => {
                    upArrow.setStyle({ fill: '#ffff00' }); // Highlight in yellow
                })
                .on('pointerout', () => {
                    upArrow.setStyle({ fill: '#ffffff' }); // Revert to white
                });
            container.add(upArrow);

            // Add down arrow
            const downArrow = this.scene.add.text(0, height / 2 + 14, '▼', { fontSize: '20px', fill: '#ffffff' })
                .setOrigin(0.5)
                .setInteractive()
                .on('pointerdown', () => {
                    if ((this.currentPage + 1) * (this.maxVisibleRows - 1) < rowData.length - 1) {
                        this.currentPage++;
                        renderTable();
                    }
                })
                .on('pointerover', () => {
                    downArrow.setStyle({ fill: '#ffff00' }); // Highlight in yellow
                })
                .on('pointerout', () => {
                    downArrow.setStyle({ fill: '#ffffff' }); // Revert to white
                });
            container.add(downArrow);
        };

        // Create pagination buttons
        createPaginationButtons();
    }

    getSelectedRow() {
        const startRow = this.currentPage * (this.maxVisibleRows - 1) + 1;
        const selectedIndex = this.selectedRow - startRow;
        if (selectedIndex >= 0 && selectedIndex < this.rowData.length - 1) {
            return this.rowData[this.selectedRow];
        }
        return null;
    }

    addWindow(x, y, width, height, backgroundColor, backgroundAlpha, borderRadius, hasBorder = false) {
        const window = this.scene.add.graphics();
        window.fillStyle(backgroundColor, backgroundAlpha);
        window.fillRoundedRect(x - width / 2, y - height / 2, width, height, borderRadius);
    
        if (hasBorder) {
            window.lineStyle(2, 0xffffff, 1); // White border with 2px width
            window.strokeRoundedRect(x - width / 2, y - height / 2, width, height, borderRadius);
        }
    
        this.tabs[0].push(window); // Add window to the default tab
        return window;
    }
    

    addTab(name, callback, tooltip = null) {
        const tab = this.scene.add.text(this.x, this.y, name, { fontSize: '16px', fill: '#fff' })
            .setInteractive()
            .on('pointerdown', () => {
                this.switchTab(callback);
            });
        this.tabs[0].push(tab); // Add tab button to the default tab
        if (tooltip) this.addTooltip(tab, tooltip);
    }

    switchTab(newTab) {
        // Hide all elements of the current tab
        this.tabs[this.currentTab].forEach(element => element.setVisible(false));

        // Show all elements of the new tab
        this.currentTab = newTab;
        this.tabs[this.currentTab].forEach(element => element.setVisible(true));
    }

    addElementToTab(tab, element) {
        if (!this.tabs[tab]) {
            this.tabs[tab] = [];
        }
        this.tabs[tab].push(element);
    }

    addTextArea(x, y, width, height, text, style, tab = 0, textColor = '#ffffff') {
        const wrappedText = this.getWrappedText(text, width, style, textColor);
        const textArea = this.scene.add.text(x, y, wrappedText, { ...style, fill: textColor }).setWordWrapWidth(width);
        this.addElementToTab(tab, textArea);
    }
    
    getWrappedText(text, maxWidth, style, textColor) {
        const tempText = this.scene.add.text(0, 0, '', { ...style, fill: textColor });
        const words = text.split(' ');
        const spaceWidth = tempText.width; // Measure space width
        let line = '';
        let lineWidth = 0;
        let wrappedText = '';
    
        words.forEach(word => {
            tempText.setText(word);
            const wordWidth = tempText.width; // Measure word width
            if (lineWidth + wordWidth + spaceWidth > maxWidth) {
                wrappedText += line + '\n';
                line = word + ' ';
                lineWidth = wordWidth + spaceWidth;
            } else {
                line += word + ' ';
                lineWidth += wordWidth + spaceWidth;
            }
        });
    
        wrappedText += line;
        tempText.destroy(); // Destroy temporary text object
        return wrappedText;
    }    

    addTextInput(x, y, width, height, placeholder, tab = 0, maxLength = 50, isSecret = false, isName = false, allowSpaces = false) {
        const container = this.scene.add.container(x, y);
    
        // Create the text input background with a rounded white border
        const background = this.scene.add.graphics();
        background.fillStyle(0x000000, 1);
        background.fillRoundedRect(-width / 2, -height / 2, width, height, 10);
        background.lineStyle(2, 0xffffff, 1);
        background.strokeRoundedRect(-width / 2, -height / 2, width, height, 10);
    
        // Create the placeholder text
        const text = this.scene.add.text(0, 0, placeholder, { fontSize: '16px', fill: '#888888' }).setOrigin(0.5);
    
        // Add background and text to the container
        container.add(background);
        container.add(text);
    
        // Store the current input text
        let currentText = '';
    
        // Store the text input reference for future access
        this.textInputs[tab] = this.textInputs[tab] || [];
        const inputIndex = this.textInputs[tab].length;
        this.textInputs[tab].push({ container, text, currentText, background, width, height, placeholder });
    
        // Handle focus and blur
        container.setSize(width, height); // Set the container size for interaction
        container.setInteractive(); // Make the container interactive
        container.on('pointerdown', () => {
            if (this.scene.input.keyboard.enabled) {
                SoundFXManager.playSound('assets/sounds/menu/ui_2.wav');
                this.focusedInput = { tab, inputIndex };
                this.updateInputBorders();
                currentText = this.textInputs[tab][inputIndex].currentText; // Ensure currentText is synchronized on focus
            }
        });
    
        // Handle text input
        this.ignoreNextKeydown = false;
        this.scene.input.keyboard.on('keydown', (event) => {
            if (this.ignoreNextKeydown) {
                this.ignoreNextKeydown = false;
                return;
            }
            if (this.focusedInput && this.focusedInput.tab === tab && this.focusedInput.inputIndex === inputIndex) {
                if (event.key === "Backspace") {
                    SoundFXManager.playSound('assets/sounds/menu/ui_4.wav');
                    currentText = currentText.slice(0, -1); // Remove last character
                } else if (event.key.length === 1 && currentText.length < maxLength) {
                    SoundFXManager.playSound('assets/sounds/menu/ui_3.wav');
                    let char = event.key;
    
                    if (isName) {
                        if (!/[a-zA-Z]/.test(char)) return; // Allow only letters
                        if (!allowSpaces && char === ' ') return; // Disallow spaces if not allowed
                        char = char.toLowerCase(); // Convert to lowercase
                        if (currentText.length === 0) {
                            char = char.toUpperCase(); // First character uppercase
                        }
                    } else {
                        if (!allowSpaces && char === ' ') return; // Disallow spaces if not allowed
                    }
    
                    currentText += char; // Add character
                } else if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.TAB) {
                    event.preventDefault(); // Prevent default tab behavior
                    this.scene.input.keyboard.enabled = false; // Temporarily disable keyboard input
                    this.focusNextInput();
                    this.scene.input.keyboard.enabled = true; // Re-enable keyboard input
                    this.ignoreNextKeydown = true;
                }
                const displayText = isSecret ? '*'.repeat(currentText.length) : currentText;
                text.setText(displayText || placeholder); // Update text display, show placeholder if empty
                text.setStyle({ fill: currentText ? '#ffffff' : '#888888' }); // Change text color based on content
                this.textInputs[tab][inputIndex].currentText = currentText; // Update stored text
            }
        });
    
        // Add the container to the specified tab
        this.addElementToTab(tab, container);
    
        return this.textInputs[tab][inputIndex]; // Return the text input reference
    }
    
    
       
    clearTextInput(tab = 0, index = 0) {
        const textInput = this.textInputs[tab][index];
    
        if (!textInput) {
            console.error('Invalid text input provided to clearTextInput:', textInput);
            return;
        }
    
        // Clear the current text
        textInput.currentText = '';
    
        // Update the displayed text to show the placeholder
        textInput.text.setText(textInput.placeholder);
        textInput.text.setStyle({ fill: '#888888' }); // Change text color to placeholder color
    }
    
    
      
    focusNextInput() {
        if (this.focusedInput) {
            const { tab, inputIndex } = this.focusedInput;
            const inputs = this.textInputs[tab];
            if (inputs) {
                const nextIndex = (inputIndex + 1) % inputs.length;
                this.focusedInput = { tab, inputIndex: nextIndex };
                this.updateInputBorders();
            }
        }
    }
    
    updateInputBorders() {
        Object.keys(this.textInputs).forEach(tab => {
            this.textInputs[tab].forEach((input, index) => {
                input.background.clear();
                input.background.fillStyle(0x000000, 1);
                input.background.fillRoundedRect(-input.width / 2, -input.height / 2, input.width, input.height, 10);
                if (this.focusedInput && this.focusedInput.tab == tab && this.focusedInput.inputIndex == index) {
                    input.background.lineStyle(2, 0xffff00, 1); // Yellow border for focused input
                } else {
                    input.background.lineStyle(2, 0xffffff, 1); // White border for unfocused input
                }
                input.background.strokeRoundedRect(-input.width / 2, -input.height / 2, input.width, input.height, 10);
            });
        });
    }
    
    getTextInputValue(tab = 0, index = 0) {
        if (this.textInputs[tab] && this.textInputs[tab][index]) {
            return this.textInputs[tab][index].currentText;
        }
        return null;
    }    

    addStatBar(x, y, width, height, barColor, tooltip = null) {
        // Create a container to hold the bar and border
        const barContainer = this.scene.add.container(x, y);
    
        // Create the background of the bar (with a border)
        const border = this.scene.add.graphics();
        border.fillStyle(0x000000, 1);
        border.fillRoundedRect(-width / 2, -height / 2, width, height, 5); // Background with border radius
        border.lineStyle(2, 0xffffff, 1); // White border
        border.strokeRoundedRect(-width / 2, -height / 2, width, height, 5); // Draw border
    
        // Create the stat bar itself
        const statBar = this.scene.add.graphics();
        statBar.fillStyle(barColor, 1);
        statBar.fillRoundedRect(-width / 2, -height / 2 + 2, width - 4, height - 4, 5); // Inner bar with reduced size for border
    
        // Add both the border and the bar to the container
        barContainer.add(border);
        barContainer.add(statBar);
    
        // Store the stat bar graphics object in the container for easy access
        barContainer.statBar = statBar;
        barContainer.statBar.fillColor = barColor; // Ensure fillColor is set
        barContainer.maxWidth = width - 4; // Store max width for updates
        barContainer.height = height;
    
        // Add the bar container to the current tab
        this.addElementToTab(this.currentTab, barContainer);
    
        // Add tooltip if provided
        if (tooltip) {
            this.addTooltip(barContainer, tooltip);
        }
    
        // Return the bar container (which contains the stat bar)
        return barContainer;
    }
    
    updateStatBar(barContainer, currentStat, maxStat) {
        // Calculate the new width of the stat bar based on current and max stat
        const newWidth = (currentStat / maxStat) * barContainer.maxWidth;
    
        // Clear the previous bar and redraw it with the new width
        barContainer.statBar.clear();
        barContainer.statBar.fillStyle(barContainer.statBar.fillColor, 1);
        barContainer.statBar.fillRoundedRect(-barContainer.maxWidth / 2, -barContainer.height / 2 + 2, newWidth, barContainer.height - 4, 5);
    }

    addGraphic(x, y, key, tooltip = null, tab = 0, isAnimation = false) {
        let graphic;
        if (isAnimation) {
            graphic = this.scene.add.sprite(x, y, key).play(key); // Play the animation
        } else {
            graphic = this.scene.add.image(x, y, key);
        }
        this.addElementToTab(tab, graphic);
        if (tooltip) this.addTooltip(graphic, tooltip);
    }

    addTooltip(target, text) {
        const tooltip = this.scene.add.text(0, 0, text, { fontSize: '14px', fill: '#fff', backgroundColor: '#000000' })
            .setOrigin(0.5, 1)
            .setVisible(false);
    
        target.on('pointerover', () => {
            tooltip.setPosition(target.x, target.y - target.height / 2);
            tooltip.setVisible(true);
            // this.scene.children.bringToTop(tooltip); // Ensure the tooltip is on top
            tooltip.setDepth(1000);
        });
    
        target.on('pointerout', () => {
            tooltip.setVisible(false);
        });

        target.on('pointerdown', () => {
            tooltip.setVisible(false);
        });
    
        this.tabs[this.currentTab].push(tooltip); // Tooltips are associated with the current tab
        return tooltip;
    }    

    addButton(x, y, width, height, text, callback, tooltip = null, tab = 0, backgroundColor = 0x555555, textColor = '#fff', borderRadius = 10, fontSize = '16px', locked = false, soundOnClick = null) {
        // Create a container for the button
        const buttonContainer = this.scene.add.container(x, y);
    
        // Create the button background with rounded edges
        const buttonBackground = this.scene.add.graphics();
        buttonBackground.fillStyle(backgroundColor, 1);
        buttonBackground.fillRoundedRect(-width / 2, -height / 2, width, height, borderRadius);
        buttonBackground.setDepth(100);  // Set depth for the background
    
        if (!locked) {
            buttonBackground.lineStyle(2, 0xffffff, 1); // White border initially
            buttonBackground.strokeRoundedRect(-width / 2, -height / 2, width, height, borderRadius);
        }
    
        // Create the text
        const buttonText = this.scene.add.text(0, 0, text, { fontSize: fontSize, fill: textColor })
            .setOrigin(0.5, 0.5)
            .setDepth(100);  // Set depth for the text
    
        // Add background and text to the container
        buttonContainer.add(buttonBackground);
        buttonContainer.add(buttonText);
    
        if (!locked) {
            // Set interactivity on the container using the full dimensions of the button
            buttonContainer.setSize(width, height);
            buttonContainer.setInteractive({ useHandCursor: false }).on('pointerdown', () => {
                if (soundOnClick) {
                    SoundFXManager.playSound(soundOnClick);
                } else {
                    SoundFXManager.playSound('assets/sounds/menu/ui_5.wav');
                }
                callback();
            });
    
            // Set up hover events for highlighting the border (if desired)
            buttonContainer.on('pointerover', () => {
                SoundFXManager.playSound('assets/sounds/menu/ui_1.wav');
                buttonBackground.clear();
                buttonBackground.fillStyle(backgroundColor, 1);
                buttonBackground.fillRoundedRect(-width / 2, -height / 2, width, height, borderRadius);
                buttonBackground.lineStyle(2, 0xffff00, 1); // Yellow border on hover
                buttonBackground.strokeRoundedRect(-width / 2, -height / 2, width, height, borderRadius);
                buttonBackground.setDepth(100);  // Ensure depth is maintained on hover
            });
    
            buttonContainer.on('pointerout', () => {
                buttonBackground.clear();
                buttonBackground.fillStyle(backgroundColor, 1);
                buttonBackground.fillRoundedRect(-width / 2, -height / 2, width, height, borderRadius);
                buttonBackground.lineStyle(2, 0xffffff, 1); // White border
                buttonBackground.strokeRoundedRect(-width / 2, -height / 2, width, height, borderRadius);
                buttonBackground.setDepth(100);  // Ensure depth is maintained on hover out
            });
        }
    
        // Set the depth for the button container (if needed)
        buttonContainer.setDepth(101);
    
        // Add the button container to the specified tab
        this.addElementToTab(tab, buttonContainer);
    
        // Add tooltip if provided
        if (tooltip) buttonContainer.tooltip = this.addTooltip(buttonContainer, tooltip);
        return buttonContainer
    }
    
    
    addClickableText(x, y, text, callback, style, tooltip = null, tab = 0) {
        const originalColor = style.fill || '#fff'; // Default to white if no color is specified
        const hoverColor = '#ffff00'; // Yellow
    
        const clickableText = this.scene.add.text(x, y, text, style)
            .setInteractive()
            .on('pointerdown', () => {
                SoundFXManager.playSound('assets/sounds/menu/ui_5.wav');
                callback();
            })
            .on('pointerover', () => {
                SoundFXManager.playSound('assets/sounds/menu/ui_1.wav');
                clickableText.setStyle({ fill: hoverColor });
            })
            .on('pointerout', () => {
                clickableText.setStyle({ fill: originalColor });
            });
    
        this.addElementToTab(tab, clickableText);
        if (tooltip) this.addTooltip(clickableText, tooltip);
    }
    
    addScrollableArea(x, y, width, height, elements, tab = 0) {
        // Implementation for adding a scrollable area
    }

    addIconGrid(x, y, width, height, icons, tooltips = [], tab = 0) {
        icons.forEach((icon, index) => {
            const iconElement = this.scene.add.image(x + (index % width) * icon.width, y + Math.floor(index / width) * icon.height, icon.key)
                .setInteractive();
            this.addElementToTab(tab, iconElement);
            if (tooltips[index]) this.addTooltip(iconElement, tooltips[index]);
        });
    }

    addConfirmationWindow(text, confirmCallback, cancelCallback, tab = 0) {
        // Implementation for adding a confirmation window
    }

    addCloseButton() {
        // If doesn't have a close button
        if (!this.hasCloseButton) return;
        // If has close button
        const closeButton = this.scene.add.text(this.x + this.width / 2 - 20, this.y - this.height / 2 + 20, 'X', { fontSize: '16px', fill: '#fff' })
            .setInteractive()
            .on('pointerdown', () => {
                SoundFXManager.playSound('assets/sounds/menu/ui_4.wav');
                this.hide();
            })
            .on('pointerover', () => {
                SoundFXManager.playSound('assets/sounds/menu/ui_1.wav');
                closeButton.setStyle({ fill: '#ffff00' }); // Highlight in yellow
            })
            .on('pointerout', () => {
                closeButton.setStyle({ fill: '#fff' }); // Revert to white
            });
        this.tabs[0].push(closeButton); // Close button is added to the default tab
    }

    addIconButton(x, y, iconName, callback, tooltip = null, tab = 0, normalBorderColor = 0xffffff, hoverBorderColor = 0xffff00) {
        const iconButton = this.iconHelper.getIcon(iconName, true, normalBorderColor, hoverBorderColor);
        iconButton.setPosition(x, y);
        iconButton.on('pointerdown', () => {
            SoundFXManager.playSound('assets/sounds/menu/ui_2.wav');
            callback();
        });
        this.addElementToTab(tab, iconButton);
        if (tooltip) iconButton.tooltip = this.addTooltip(iconButton, tooltip);
        return iconButton;
    }

    addIcon(x, y, iconName, tooltip = null, tab = 0) {
        const icon = this.iconHelper.getIcon(iconName, false);
        icon.setPosition(x, y);
        this.addElementToTab(tab, icon);
        if (tooltip) this.addTooltip(icon, tooltip);
    }

    disableInteractions() {
        Object.values(this.tabs).flat().forEach(element => element.disableInteractive());
    }

    enableInteractions() {
        Object.values(this.tabs).flat().forEach(element => element.setInteractive());
    }

    show() {
        this.tabs[this.currentTab].forEach(element => element.setVisible(true));
        this.tabs[0].forEach(element => element.setVisible(true)); // Always show default tab elements
    }

    hide() {
        Object.values(this.tabs).flat().forEach(element => element.setVisible(false));
        
        // Reset focused input
        this.focusedInput = null;
        this.updateInputBorders(); // Update the borders to reflect the change
    
        if (this.onClose) {
            this.onClose();
        }
    }
    

    hideNoOnclose() {
        Object.values(this.tabs).flat().forEach(element => element.setVisible(false));
    }

    destroy() {
        Object.values(this.tabs).flat().forEach(element => element.destroy());
        this.tabs = { 0: [] }; // Reset tabs
    }

    reload() {
        this.destroy(); // Destroy current instance elements
        const { scene, x, y, width, height, backgroundColor, backgroundAlpha, borderRadius, spriteSheetKey, onClose, hasCloseButton } = this.initParams;
        new BaseMenu(scene, x, y, width, height, backgroundColor, backgroundAlpha, borderRadius, spriteSheetKey, onClose, hasCloseButton);
    }
}

export { BaseMenu }; // Exporting the class
