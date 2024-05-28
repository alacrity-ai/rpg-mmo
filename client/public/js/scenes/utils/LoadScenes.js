// utils/loadScenes.js
export async function loadScenes() {
    const context = import.meta.glob('../town/**/!(BaseTownScene).js');
    const scenes = [];
    console.log(scenes);

    for (const key in context) {
        const sceneModule = await context[key]();
        const sceneClass = sceneModule.default;
        if (sceneClass.prototype instanceof Phaser.Scene) {
            scenes.push(sceneClass);
        }
    }

    return scenes;
}
