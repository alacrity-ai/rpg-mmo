class AnimationScript {
    constructor(scene, battleGrid, usingBattler, targetBattler) {
        this.scene = scene;
        this.battleGrid = battleGrid;
        this.usingBattler = usingBattler;
        this.targetBattler = targetBattler;
    }

    execute() {
        throw new Error('Execute method should be implemented by child classes');
    }
}

export default AnimationScript;
