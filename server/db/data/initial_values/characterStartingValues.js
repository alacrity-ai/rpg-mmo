// db/data/initial_values/characterStartingValues.js

const classStartingAbilitiesMap = {
  rogue: ['rogueAttack', 'throw', 'fanDaggers', 'toxicVial', 'assassinate', 'bandage'],
  monk: ['monkAttack'],
  ranger: ['rangerAttack'],
  reaver: ['reaverAttack'],
  paladin: ['paladinAttack'],
  warrior: ['warriorAttack'],
  shaman: ['shamanAttack'],
  priest: ['priestAttack'],
  druid: ['druidAttack'],
  arcanist: ['arcanistAttack'],
  elementalist: ['elementalistAttack'],
  necromancer: ['necromancerAttack']
};

const characterStartingFlagsMap = {
  EldergroveTownSceneUnlocked: 1,
  EldersWoodUnlocked: 1
};

module.exports = { classStartingAbilitiesMap, characterStartingFlagsMap };
