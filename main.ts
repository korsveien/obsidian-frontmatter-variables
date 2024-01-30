import {App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile,} from 'obsidian';
import * as assert from "assert";

// Remember to rename these classes and interfaces!

interface Settings {
	mySetting: string;
}

const DEFAULT_SETTINGS: Settings = {
	mySetting: 'default'
}

export default class FrontmatterVariablesPlugin extends Plugin {
	settings: Settings;

	async onload() {
		await this.loadSettings();

		const regex = /{{([a-zA-Z-_]+)}}/g;

		this.registerMarkdownPostProcessor((element, context) => {
			element.findAll("p").forEach(element => {
				const text = element.innerText.trim();
				const replacedText = text.replace(regex, (_:string, word: string) => context.frontmatter[word] ?? "{{NO_VALUE}}");
				const newElement = element.createDiv({cls: 'cm-line', text: replacedText});
				element.replaceWith(newElement)
			})

			element.findAll("code").forEach(element => {
				const text = element.innerText.trim();
				const replacedText = text.replace(regex, (_:string, word: string) => context.frontmatter[word] ?? "{{NO_VALUE}}");
				const newElement = element.createSpan({text: replacedText});
				element.replaceWith(newElement)
			})
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));
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
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
