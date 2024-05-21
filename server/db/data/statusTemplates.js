const statusTemplates = [
    {
      name: 'Poison',
      description: 'Reduces health over time.',
      effect_type: 'debuff',
      effect_details: JSON.stringify({
        health_reduction: 5,
        duration: 10 // in seconds
      })
    },
    {
      name: 'Heal',
      description: 'Increases health over time.',
      effect_type: 'buff',
      effect_details: JSON.stringify({
        health_increase: 5,
        duration: 10 // in seconds
      })
    },
    {
      name: 'Strength Buff',
      description: 'Increases strength temporarily.',
      effect_type: 'buff',
      effect_details: JSON.stringify({
        strength_increase: 10,
        duration: 20 // in seconds
      })
    },
    {
      name: 'Slow',
      description: 'Reduces speed temporarily.',
      effect_type: 'debuff',
      effect_details: JSON.stringify({
        speed_reduction: 2,
        duration: 15 // in seconds
      })
    },
    {
      name: 'Shield',
      description: 'Increases defense temporarily.',
      effect_type: 'buff',
      effect_details: JSON.stringify({
        defense_increase: 20,
        duration: 25 // in seconds
      })
    }
  ];
  
  module.exports = statusTemplates;
  