import { ItemStack, Player } from "@serenityjs/core";

import { ChestFormContainer } from "./container";

class ChestForm {
  /**
   * The container that holds the items for the chest form.
  */
  public readonly container: ChestFormContainer;

  /**
   * Create a new ChestForm.
   * @param title The title of the chest form.
   * @param size The size of the chest form, either "single" for a single chest (27 slots) or "double" for a double chest (54 slots).
   */
  public constructor(title: string, size: "single" | "double" = "single") {
    // Create a new container with the type of Container and no specific ID
    this.container = new ChestFormContainer(title, size === "single" ? 27 : 54);
  }

  /**
   * Set the item stack at the specified slot in the container.
   * @param slot The slot index to set the item stack in.
   * @param itemStack The item stack to set in the specified slot.
   */
  public button(slot: number, itemStack: ItemStack): void {
    // Set the item stack at the specified slot in the container
    this.container.setItem(slot, itemStack);
  }

  /**
   * Show the chest form to the player.
   * @param player The player to show the chest form to.
   * @param callback The callback function to call when an item is selected.
   */
  public show(player: Player, callback: (index: number) => void): void {
    // Show the container to the player
    this.container.show(player, callback);
  }
}

export { ChestForm, ChestFormContainer };