import {
  App,
  MarkdownPostProcessorContext,
  Plugin,
  PluginSettingTab,
  Setting,
} from "obsidian";
import { codePointSize } from "@codemirror/state";

// Remember to rename these classes and interfaces!

interface Settings {
  mySetting: string;
}

const DEFAULT_SETTINGS: Settings = {
  mySetting: "default",
};

export default class FrontmatterVariablesPlugin extends Plugin {
  settings: Settings;

  async onload() {
    await this.loadSettings();

    const regex = /{{\$frontmatter\.([a-zA-z-_]+)}}/g;

    this.registerMarkdownPostProcessor((element, context) => {
      ["p", "h1", "h2", "h3", "h4", "h5", "h6", "code"].forEach((selector) => {
        if (selector === "code") {
          element.findAll(selector).forEach((codeblock) => {
            const text = codeblock.innerText = codeblock.innerText.trim();

            const newText = text.replace(
              regex,
              this.replacePlaceholder(context),
            );

            console.log(newText);

            const newSpan = codeblock.createSpan({ text: newText });
            codeblock.replaceWith(newSpan);
          });
        } else {
          element.findAll(selector).forEach((element) => {
            element.innerText = element.innerText.trim().replace(
              regex,
              this.replacePlaceholder(context),
            );
          });
        }
      });

      ["li"].forEach((selector) => {
        element.findAll(selector).forEach((element) => {
          const code = element.find("code");

          if (code) {
            const text = code.innerText = code.innerText.trim();

            const newText = text.replace(
              regex,
              this.replacePlaceholder(context),
            );

            const newSpan = code.createSpan({ text: newText });
            code.replaceWith(newSpan);
          } else {
            const textNode = element.lastChild;
            if (textNode == null) {
              throw Error("Cannot find #text child node of <li>-node");
            }
            textNode.textContent = element.innerText.trim().replace(
              regex,
              this.replacePlaceholder(context),
            );
          }
        });
      });
    });

    // This adds a settings tab so the user can configure various aspects of the plugin
    this.addSettingTab(new SampleSettingTab(this.app, this));
  }

  private replacePlaceholder(context: MarkdownPostProcessorContext) {
    return (_: string, word: string) =>
      context.frontmatter[word] ?? "{{NO_VALUE}}";
  }

  onunload() {
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

class SampleSettingTab extends PluginSettingTab {
  plugin: FrontmatterVariablesPlugin;

  constructor(app: App, plugin: FrontmatterVariablesPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName("Setting #1")
      .setDesc("It's a secret")
      .addText((text) =>
        text
          .setPlaceholder("Enter your secret")
          .setValue(this.plugin.settings.mySetting)
          .onChange(async (value) => {
            this.plugin.settings.mySetting = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
