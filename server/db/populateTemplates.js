const db = require('./database.js');
const objectTemplates = require('./templates/objectTemplates.js');
const npcTemplates = require('./templates/npcTemplates.js');
const itemTemplates = require('./templates/itemTemplates.js');
const charactersPremade = require('./templates/charactersPremade.js');

// Function to clear and populate templates
function populateTemplates() {
    db.serialize(() => {
        db.run('DELETE FROM object_templates', (err) => {
            if (err) {
                console.error("Error clearing object templates", err);
                return;
            }
            console.log("Cleared object templates.");
            objectTemplates.forEach(obj => {
                db.run('INSERT INTO object_templates (name, description, is_collectible, item_template_id) VALUES (?, ?, ?, ?)', 
                    [obj.name, obj.description, obj.is_collectible, obj.item_template_id || null]);  // Use null for non-collectible objects
            });
        });

        db.run('DELETE FROM npc_templates', (err) => {
            if (err) {
                console.error("Error clearing NPC templates", err);
                return;
            }
            console.log("Cleared NPC templates.");
            npcTemplates.forEach(npc => {
                db.run('INSERT INTO npc_templates (name, description, behavior_type, base_stats) VALUES (?, ?, ?, ?)', 
                [npc.name, npc.description, npc.behavior_type, npc.base_stats],
                (err) => {
                    if (err) {
                        console.error("Error inserting NPC template data", err);
                    }
                });
            });
        });
        

        db.run('DELETE FROM item_templates', (err) => {
            if (err) {
            console.error("Error clearing item templates", err);
            return;
            }
            console.log("Cleared item templates.");
            itemTemplates.forEach(item => {
            db.run('INSERT INTO item_templates (name, description, item_type, is_equipment, equipment_type, slot, stats, is_collectible, use_effect) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [item.name, item.description, item.item_type, item.is_equipment, item.equipment_type, item.slot, item.stats, item.is_collectible, item.use_effect]);
            });
        });

        // db.run('DELETE FROM characters', (err) => {
        //     if (err) {
        //         console.error("Error clearing characters", err);
        //         return;
        //     }
        //     console.log("Cleared characters.");
        //     charactersPremade.forEach(character => {
        //         db.run('INSERT INTO characters (user_id, name, class, base_stats, current_stats, current_zone_id) VALUES (?, ?, ?, ?, ?, ?)', 
        //         [character.user_id, character.name, character.class, character.base_stats, character.current_stats, character.current_zone_id], 
        //         (err) => {
        //             if (err) {
        //                 console.error("Error inserting character data", err);
        //             }
        //         });
        //     });
        // });
        
    });
}

populateTemplates();
