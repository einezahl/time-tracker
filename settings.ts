import { App, PluginSettingTab, Setting, Notice } from 'obsidian';
import MyPlugin from './main';

export class WorkTimeSettings extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h3', {text: 'Categories'});
		this.plugin.settings.categories.forEach((category, index)=> {
			const setting = new Setting(containerEl)
				.setName(`Category ${index + 1}`)
				.addText(text => text
					.setValue(category)
					.onChange(async (value) => {
						this.plugin.settings.categories[index] = value;
						await this.plugin.saveSettings();
				})
				);
			setting.addButton(button => button
				.setButtonText('Remove')
				.setCta()
				.onClick(async () => {
					this.plugin.settings.categories.splice(index, 1);
					await this.plugin.saveSettings();
					this.display();
				})
			)
			setting.addButton(button => button
				.setButtonText('Add Category')
				.setCta()
				.onClick(async () => {
					this.plugin.settings.categories.push('New Category')
					await this.plugin.saveSettings();
					this.display();
				})
			)
		});
	}
}
