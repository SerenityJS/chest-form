# Chest Form

> **Create FormUI-like interactable forms using ChestUI.**

## Getting Started
1. **Install the Plugin:** Add the `chest-form` plugin to your SerenityJS server's `plugins` directory.

2. **Install the Typings:** Install the NPM package to your existing plugin project, this allows you to use the `chest-form` features in your own plugins!
    ```bash
    #npm
    npm install chest-form

    #yarn
    yarn add chest-form

    #bun
    bun add chest-form
    ```

3. **Import the Plugin Typings:** In your plugin's main file, import the `ChestFormPlugin` class.
    ```typescript
    import type { ChestFormPlugin } from "chest-form";
    ```

4. **Resolve the Plugin Instance:** Once your plugin is initialized, resolve the `ChestFormPlugin` instance to use its features.
    ```typescript
    import { Plugin } from "@serenityjs/plugins";

    import type { ChestFormPlugin } from "chest-form";

    class MyPlugin extends Plugin {
      public onInitialize(): void {
        // The resolve method fetches the ChestFormPlugin instance
        // And we use the ChestFormPlugin type to ensure type safety
        const { ChestForm } = this.resolve<ChestFormPlugin>("chest-form")!; // Notice the use of `!` can be unsafe if the plugin is not loaded correctly
      }
    }
    ```
## API Reference

### ChestForm Class
The `ChestForm` class provides methods to create and manage forms similar to the FormUI system, but using the single or double chest UI.

> **Example Usage**

```typescript
// Create a new ChestForm instance
const form = new ChestForm("Chest Form");

// Create a new ItemStack, and add it to a button
form.button(11, new ItemStack("minecraft:diamond"));
form.button(13, new ItemStack("minecraft:gold_ingot"));
form.button(15, new ItemStack("minecraft:iron_ingot"));

// Show the form to the player
form.show(origin, (index) => {
  // Handle the button click
  origin.sendMessage(`You clicked button at index: ${index}`);
});
```