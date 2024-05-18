import IconHelper from '../IconHelper.js'; // Adjust the path as necessary

class BaseMenu {
    constructor(scene, x, y, width, height, backgroundColor = 0x000000, backgroundAlpha = 0.8, borderRadius = 10, spriteSheetKey = null, onClose = null, hasCloseButton = false) {
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
        this.iconHelper = spriteSheetKey ? new IconHelper(scene, spriteSheetKey) : null; // Initialize the IconHelper if spriteSheetKey is provided
        this.onClose = onClose;
        this.hasCloseButton = hasCloseButton;
        this.textInputs = {}; // Store references to text inputs

        this.addWindow(x, y, width, height, backgroundColor, backgroundAlpha, borderRadius);
        this.addCloseButton();
    }

    addWindow(x, y, width, height, backgroundColor, backgroundAlpha, borderRadius) {
        const window = this.scene.add.graphics();
        window.fillStyle(backgroundColor, backgroundAlpha);
        window.fillRoundedRect(x - width / 2, y - height / 2, width, height, borderRadius);
        this.tabs[0].push(window); // Add window to the default tab
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

    addTextInput(x, y, width, height, placeholder, tab = 0, maxLength = 50, isSecret = false) {
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
        this.textInputs[tab].push({ container, text, currentText, background, width, height });
    
        // Handle focus and blur
        container.setSize(width, height); // Set the container size for interaction
        container.setInteractive(); // Make the container interactive
        container.on('pointerdown', () => {
            if (this.scene.input.keyboard.enabled) {
                this.focusedInput = { tab, inputIndex };
                console.log('Focused Input:', this.focusedInput);
                this.updateInputBorders();
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
                    currentText = currentText.slice(0, -1); // Remove last character
                } else if (event.key.length === 1 && currentText.length < maxLength) {
                    currentText += event.key; // Add character
                } else if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.TAB) {
                    event.preventDefault(); // Prevent default tab behavior
                    this.scene.input.keyboard.enabled = false; // Temporarily disable keyboard input
                    this.focusNextInput();
                    this.scene.input.keyboard.enabled = true; // Re-enable keyboard input
                    this.ignoreNextKeydown = true;
                }
                const displayText = isSecret ? '*'.repeat(currentText.length) : currentText;
                text.setText(displayText || placeholder); // Update text display, show placeholder if empty
                this.textInputs[tab][inputIndex].currentText = currentText; // Update stored text
            }
        });
    
        // Add the container to the specified tab
        this.addElementToTab(tab, container);
    
        return container;
    }
    
    focusNextInput() {
        if (this.focusedInput) {
            const { tab, inputIndex } = this.focusedInput;
            const inputs = this.textInputs[tab];
            if (inputs) {
                const nextIndex = (inputIndex + 1) % inputs.length;
                this.focusedInput = { tab, inputIndex: nextIndex };
                this.updateInputBorders();
                console.log('Focused Input:', this.focusedInput);
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
        });

        target.on('pointerout', () => {
            tooltip.setVisible(false);
        });

        this.tabs[this.currentTab].push(tooltip); // Tooltips are associated with the current tab
    }

    addButton(x, y, width, height, text, callback, tooltip = null, tab = 0, backgroundColor = 0x555555, textColor = '#fff', borderRadius = 10) {
        // Create a container for the button
        const buttonContainer = this.scene.add.container(x, y);

        // Create the button background with rounded edges
        const buttonBackground = this.scene.add.graphics();
        buttonBackground.fillStyle(backgroundColor, 1);
        buttonBackground.fillRoundedRect(-width / 2, -height / 2, width, height, borderRadius);

        // Create the text
        const buttonText = this.scene.add.text(0, 0, text, { fontSize: '16px', fill: textColor })
            .setOrigin(0.5, 0.5);

        // Add background and text to the container
        buttonContainer.add(buttonBackground);
        buttonContainer.add(buttonText);

        // Set interactivity on the container using the full dimensions of the button
        buttonContainer.setSize(width, height);
        buttonContainer.setInteractive({ useHandCursor: true }).on('pointerdown', callback);

        // Set up hover events for highlighting the border (if desired)
        buttonContainer.on('pointerover', () => {
            buttonBackground.clear();
            buttonBackground.fillStyle(backgroundColor, 1);
            buttonBackground.fillRoundedRect(-width / 2, -height / 2, width, height, borderRadius);
            buttonBackground.lineStyle(2, 0xffff00, 1); // Yellow border on hover
            buttonBackground.strokeRoundedRect(-width / 2, -height / 2, width, height, borderRadius);
        });

        buttonContainer.on('pointerout', () => {
            buttonBackground.clear();
            buttonBackground.fillStyle(backgroundColor, 1);
            buttonBackground.fillRoundedRect(-width / 2, -height / 2, width, height, borderRadius);
            buttonBackground.lineStyle(2, 0xffffff, 1); // White border
            buttonBackground.strokeRoundedRect(-width / 2, -height / 2, width, height, borderRadius);
        });

        // Add the button container to the specified tab
        this.addElementToTab(tab, buttonContainer);

        // Add tooltip if provided
        if (tooltip) this.addTooltip(buttonContainer, tooltip);
    }

    addClickableText(x, y, text, callback, style, tooltip = null, tab = 0) {
        const clickableText = this.scene.add.text(x, y, text, style)
            .setInteractive()
            .on('pointerdown', callback);
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
            .on('pointerdown', () => this.hide());
        this.tabs[0].push(closeButton); // Close button is added to the default tab
    }

    addIconButton(x, y, iconName, callback, tooltip = null, tab = 0) {
        const iconButton = this.iconHelper.getIcon(iconName);
        iconButton.setPosition(x, y);
        iconButton.on('pointerdown', callback);
        this.addElementToTab(tab, iconButton);
        if (tooltip) this.addTooltip(iconButton, tooltip);
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
        if (this.onClose) {
            this.onClose();
        }
    }

    destroy() {
        Object.values(this.tabs).flat().forEach(element => element.destroy());
        this.tabs = { 0: [] }; // Reset tabs
    }
}

export { BaseMenu }; // Exporting the class
