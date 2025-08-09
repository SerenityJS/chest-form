import { ContainerName, Packet } from "@serenityjs/protocol";
import { Plugin, PluginPriority } from "@serenityjs/plugins";

import { ChestForm, ChestFormContainer } from "./form";

class ChestFormPlugin extends Plugin {
  // Makes sure the plugin is loaded first
  public readonly priority: PluginPriority = PluginPriority.High;

  /**
   * The ChestFormContainer class that is used to create chest forms.
  */
  public readonly ChestFormContainer = ChestFormContainer;

  /**
   * The ChestForm class that is used to create a chest form.
  */
  public readonly ChestForm = ChestForm;

  /**
   * Constructor for the ChestFormPlugin.
   */
  public constructor() {
    super("chest-form", "0.1.2");
  }

  public override onInitialize(): void {
    this.logger.info("Initialized and ready to rock!");

    // Listen for item stack requests
    this.serenity.network.before(Packet.ItemStackRequest, ({ packet, connection }) => {
      // Get the player instance from the connection
      const player = this.serenity.getPlayerByConnection(connection);
      if (!player) return false; // If no player is found, do not proceed

      // Iterate through the requests in the packet
      for (const request of packet.requests) {
        for (const action of request.actions) {
          // Check if the action is a take or place action
          if (action.takeOrPlace) {
            const takeOrPlace = action.takeOrPlace;

            const source = player.getContainer(takeOrPlace.source.container.identifier);
            const destination = player.getContainer(takeOrPlace.destination.container.identifier);

            if (destination instanceof ChestFormContainer) {
              // Get the source container and inventory
              const source = player.getContainer(takeOrPlace.source.container.identifier)!;
              const inventory = player.getContainer(ContainerName.Inventory)!;

              // Get the item stack from the source container
              const stack = source.takeItem(takeOrPlace.source.slot, takeOrPlace.amount);

              // If the stack is valid, add it to the inventory
              if (stack) inventory.addItem(stack)

              // Update the source and destination containers
              inventory.update();
              destination.update();

              return false; // Prevent the default behavior for item stack requests in ChestForm
            }

            if (source instanceof ChestFormContainer) {
              // Get the item stack from the source container
              const stack = source.getItem(takeOrPlace.source.slot);

              // Check if the stack is valid
              if (!stack) return false; // If no stack is found, do not proceed

              // Get the selected slot from the take or place action
              const selectedSlot = takeOrPlace.source.slot;

              // Close the chest form if the player is trying to take an item from it
              source.close(player, true, selectedSlot);

              return false; // Prevent the default behavior for item stack requests in ChestForm
            }
          }

          // Check if the action is a swap action
          if (action.swap) {
            // Get the swap action
            const swap = action.swap;

            // Get the source and destination containers
            const source = player.getContainer(swap.source.container.identifier)!;
            const destination = player.getContainer(swap.destination.container.identifier)!;

            // Check if the destination is a ChestFormContainer
            if (destination instanceof ChestFormContainer) {
              // Get the item stack from the source container
              const stack = destination.getItem(swap.destination.slot);

              // Check if the stack is valid
              if (!stack) return false; // If no stack is found, do not proceed

              // Get the inventory container
              const inventory = player.getContainer(ContainerName.Inventory)!;

              // Get the item stack from the source container
              const sourceStack = source.getItem(swap.source.slot);

              // If the source stack is valid, add it to the inventory
              if (sourceStack) {
                // Add the source stack to the inventory
                inventory.addItem(sourceStack);

                // Clear the source slot in the ChestFormContainer
                source.clearSlot(swap.source.slot);
              }

              // Get the selected slot from the swap action
              const selectedSlot = swap.destination.slot;

              // Close the chest form if the player is trying to swap an item in it
              destination.close(player, true, selectedSlot);

              return false; // Prevent the default behavior for item stack requests in ChestForm 
            }

            // Check if the source is a ChestFormContainer
            if (source instanceof ChestFormContainer) {
              return false; // Prevent the default behavior for item stack requests in ChestForm
            }
          }

          // Check if the action is a drop action
          if (action.drop) {
            // Get the drop action
            const drop = action.drop;

            // Get the source container
            const source = player.getContainer(drop.source.container.identifier);

            // Check if the source is a ChestFormContainer
            if (source instanceof ChestFormContainer) {
              // Get the item stack from the source container
              const stack = source.getItem(drop.source.slot);

              // Check if the stack is valid
              if (!stack) return false; // If no stack is found, do not proceed

              // Get the selected slot from the drop action
              const selectedSlot = drop.source.slot;

              // Close the chest form if the player is trying to drop an item from it
              source.close(player, true, selectedSlot);

              return false; // Prevent the default behavior for item stack requests in ChestForm
            }
          }
        }
      }

      // Prevent the default behavior for item stack requests in ChestForm
      return true;
    });
  }
}

export default new ChestFormPlugin();

export { ChestFormPlugin, ChestForm, ChestFormContainer };
