import { BlockActorDataPacket, BlockPosition, ContainerId, ContainerOpenPacket, ContainerType, UpdateBlockFlagsType, UpdateBlockLayerType, UpdateBlockPacket } from "@serenityjs/protocol";
import { BlockIdentifier, BlockType, Container, Player } from "@serenityjs/core";
import { CompoundTag, IntTag, StringTag } from "@serenityjs/nbt";

class ChestFormContainer extends Container {
  public static readonly CHEST_TYPE = BlockType.get(BlockIdentifier.Chest);

  /**
   * The title of the container.
  */
  public readonly title: string;

  /**
   * The positions where the chests are placed.
  */
  protected placedPositions: Array<BlockPosition> = [];

  /**
   * The callback function to call when the container is shown.
  */
  protected showCallback: ((index: number) => void) | null = null;

  /**
   * Create a new ChestFormContainer.
   * @param title The title of the container.
   * @param size The size of the container, default is 27 (1 chest).
   */
  public constructor(title: string, size: number = 27) {
    // Call the parent constructor with the type, identifier, and size
    super(ContainerType.Container, ContainerId.None, size);

    // Set the title of the container
    this.title = title;
  }

  public override show(player: Player, callback?: (index: number) => void): void {
    // Call the original show method
    super.show(player);

    // Store the callback if provided
    this.showCallback = callback || null;

    // Get the player's position and floor it to get the block coordinates
    const { x, y, z } = player.position.floor();

    // Calculate the number of blocks needed to place the chest
    const blockCount = Math.ceil(this.size / 27)

    // Iterate through the number of blocks to place
    for (let i = 0; i < blockCount; i++) {
      // Create a new BlockPosition for each chest to be placed
      const position = new BlockPosition(x + i, y + 3, z);

      // Add the position to the placed positions array
      this.placedPositions.push(position);

      // Create a new UpdateBlockPacket to update the block at the position
      const updateBlock = new UpdateBlockPacket();
      updateBlock.networkBlockId = ChestFormContainer.CHEST_TYPE.getPermutation().networkId;
      updateBlock.position = position;
      updateBlock.layer = UpdateBlockLayerType.Normal;
      updateBlock.flags = UpdateBlockFlagsType.Network;

      // Create a new BlockActorDataPacket to set the block's data
      const blockData = new BlockActorDataPacket();
      blockData.position = position;
      blockData.nbt = new CompoundTag();

      // Add the block data to the packet
      blockData.nbt.add(new IntTag(x, "pairx"));
      blockData.nbt.add(new IntTag(y, "pairy"));
      blockData.nbt.add(new IntTag(z, "pairz"));
      blockData.nbt.add(new StringTag(this.title, "CustomName"));

      // Send the packet to the player to update the block
      player.send(updateBlock, blockData);
    }

    // Create a new ContainerOpenPacket to open the chest form
    const containerOpen = new ContainerOpenPacket();
    containerOpen.type = this.type;
    containerOpen.identifier = this.identifier;
    containerOpen.position = new BlockPosition(x, y + 3, z);
    containerOpen.uniqueId = -1n;

    // Delay the opening of the container to ensure the block update is processed first
    player.world.schedule(10).on(() => {
      // Send the container open packet to the player
      player.send(containerOpen);

      // Update the container's content
      this.update()
    });
  }

  public override close(player: Player, serverInitiated?: boolean, index: number = -1): void {
    // Call the original close method
    super.close(player, serverInitiated);

    // Check if the placed location is set
    if (this.placedPositions.length === 0) return;

    // Iterate through the placed positions to revert the blocks back to their original state
    for (const position of this.placedPositions) {
      // Get the block at the placed position
      const block = player.dimension.getBlock(position);

      // Create a new UpdateBlockPacket to revert the block back to its original state
      const updateBlock = new UpdateBlockPacket();
      updateBlock.networkBlockId = block.getPermutation().networkId;
      updateBlock.position = position;
      updateBlock.layer = UpdateBlockLayerType.Normal;
      updateBlock.flags = UpdateBlockFlagsType.Network;

      // Send the packet to the player to revert the block
      player.send(updateBlock);
    }

    // If a callback is provided, call it with the index
    if (this.showCallback) this.showCallback(index);

    // Reset the placed positions and callback
    this.placedPositions = [];
    this.showCallback = null;
  }
}

export { ChestFormContainer };
