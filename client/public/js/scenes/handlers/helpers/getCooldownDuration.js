// utils/cooldownUtils.js

export function getCooldownDuration(settings, duration) {
    const cooldownSettings = settings.cooldowns;
    switch (duration) {
        case 'minimum':
            return cooldownSettings.minimum;
        case 'shorter':
            return cooldownSettings.shorter;
        case 'short':
            return cooldownSettings.short;
        case 'normal':
            return cooldownSettings.normal;
        case 'long':
            return cooldownSettings.long;
        case 'longer':
            return cooldownSettings.longer;
        default:
            return cooldownSettings.normal; // Default to normal if duration is unknown
    }
}

export default getCooldownDuration;