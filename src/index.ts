import { Plugin, PluginPriority } from "@serenityjs/plugins";
import { WorldEvent } from "@serenityjs/core";

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
    super("chest-form", "0.2.0");
  }

  public override onInitialize(): void {
    this.logger.info("Initialized and ready to rock!");

    // Listen for player container interaction events
    this.serenity.before(WorldEvent.PlayerContainerInteraction, ({ sourceContainer, destinationContainer, sourceSlot }) => {
      // If the source container and destination container are not ChestFormContainers, allow the interaction
      if (!(sourceContainer instanceof ChestFormContainer) && !(destinationContainer instanceof ChestFormContainer)) {
        return true;
      }

      // Cancel interaction if the source container is a ChestFormContainer
      if (!(sourceContainer instanceof ChestFormContainer)) return false;

      // Call the callback function with the selected slot index
      sourceContainer.callCallback(sourceSlot);

      // Cancel the interaction to prevent item movement
      return false;
    });
  }
}

export default new ChestFormPlugin();

export { ChestFormPlugin, ChestForm, ChestFormContainer };
