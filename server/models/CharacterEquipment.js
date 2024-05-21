/**
 * Class representing a character's equipment.
 */
class CharacterEquipment {
    /**
     * Create a character's equipment.
     * @param {Object} params - The parameters for creating a character's equipment.
     * @param {number} params.id - The ID of the character equipment.
     * @param {number} params.character_id - The ID of the character.
     * @param {number} [params.main_hand] - The item ID equipped in the main hand.
     * @param {number} [params.off_hand] - The item ID equipped in the off hand.
     * @param {number} [params.two_hand] - The item ID equipped in both hands.
     * @param {number} [params.ammo] - The item ID equipped as ammo.
     * @param {number} [params.head] - The item ID equipped on the head.
     * @param {number} [params.chest] - The item ID equipped on the chest.
     * @param {number} [params.hands] - The item ID equipped on the hands.
     * @param {number} [params.waist] - The item ID equipped on the waist.
     * @param {number} [params.feet] - The item ID equipped on the feet.
     * @param {number} [params.ring1] - The item ID equipped on the first ring slot.
     * @param {number} [params.ring2] - The item ID equipped on the second ring slot.
     * @param {number} [params.neck] - The item ID equipped on the neck.
     */
    constructor({ id, character_id, main_hand, off_hand, two_hand, ammo, head, chest, hands, waist, feet, ring1, ring2, neck }) {
      this.id = id;
      this.characterId = character_id;
      this.mainHand = main_hand;
      this.offHand = off_hand;
      this.twoHand = two_hand;
      this.ammo = ammo;
      this.head = head;
      this.chest = chest;
      this.hands = hands;
      this.waist = waist;
      this.feet = feet;
      this.ring1 = ring1;
      this.ring2 = ring2;
      this.neck = neck;
    }
  }
  
  module.exports = CharacterEquipment;
  
  /**
   * Example usage:
   * 
   * const characterEquipment = new CharacterEquipment({
   *   id: 1,
   *   character_id: 1,
   *   main_hand: 101,
   *   off_hand: 102,
   *   two_hand: null,
   *   ammo: 201,
   *   head: 301,
   *   chest: 302,
   *   hands: 303,
   *   waist: 304,
   *   feet: 305,
   *   ring1: 401,
   *   ring2: 402,
   *   neck: 501
   * });
   * 
   * console.log(characterEquipment);
   * // CharacterEquipment {
   * //   id: 1,
   * //   characterId: 1,
   * //   mainHand: 101,
   * //   offHand: 102,
   * //   twoHand: null,
   * //   ammo: 201,
   * //   head: 301,
   * //   chest: 302,
   * //   hands: 303,
   * //   waist: 304,
   * //   feet: 305,
   * //   ring1: 401,
   * //   ring2: 402,
   * //   neck: 501
   * // }
   */
  