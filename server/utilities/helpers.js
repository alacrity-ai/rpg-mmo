const config = require('../config/config');

/**
 * Get cooldown duration based on ability's cooldown type.
 * @param {string} cooldownType - The cooldown type of the ability.
 * @returns {number} The cooldown duration in milliseconds.
 */
function getCooldownDuration(cooldownType) {
    switch (cooldownType) {
        case 'minimum':
            return config.cooldowns.minimum;
        case 'shorter':
            return config.cooldowns.shorter;
        case 'short':
            return config.cooldowns.short;
        case 'normal':
            return config.cooldowns.normal;
        case 'long':
            return config.cooldowns.long;
        case 'longest':
            return config.cooldowns.longest;
        default:
            return config.cooldowns.normal; // Default to normal if not specified
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

module.exports = {
    getRandomInt,
    getRandomFloat,
    getCooldownDuration
};
