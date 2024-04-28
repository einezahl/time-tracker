import { App, Editor, MarkdownView, Modal, Menu, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

interface WorkTimeElement{
	start_time: string;
	end_time: string;
	details: string;
	category: string;

}

export default class HelloWorldPlugin extends Plugin {

	async onload() {
		console.log("The plugin has been loaded.")
		this.addRibbonIcon('dice', 'Open Menu', (event) => {
			const menu = new Menu();

			menu.addItem((item) => 
				item
					.setTitle("Copy")
					.setIcon("documents")
					.onClick(() => {
						new Notice("Copied");
				})
			)
			menu.addItem((item) => 
				item
					.setTitle("Paste")
					.setIcon("paste")
					.onClick(() => {
						new Notice("Pasted");
				})
			)
			menu.showAtMouseEvent(event);
		});
		this.addCommand({
			id: "add-time-element",
			name: "Add work time element",
			callback: () => {
				new SampleModal(this.app, (workTimeElement) => {
					this.openWorktimeNoteAndInsertData(workTimeElement);
				}).open();
			}
		})
	}

	onunload() {
		console.log("The plugin has been unloaded.")

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async openWorktimeNoteAndInsertData(workTimeElement: WorkTimeElement) {
		const file = await this.findOrCreateFile("worktime.md");
		const leaf = this.app.workspace.getLeaf(true);
		await leaf.openFile(file);

		// Wait for the file to be fully loaded in the editor
		setTimeout(() => this.insertDataInWorktimeFile(workTimeElement, file), 500);
	}

	async findOrCreateFile(filename: string) {
		let file = this.app.vault.getAbstractFileByPath(filename);
		if (!file) {
			file = await this.app.vault.create(filename, "# Time Sheet\n"); // Create file with initial content if it does not exist
		}
		return file;
	}

	insertDataInWorktimeFile(workTimeElement: WorkTimeElement, file: TFile) {
		const editor = this.app.workspace.getActiveViewOfType(MarkdownView)?.editor;
		if (editor) {
			const doc = editor.getDoc();
			const workTimeString = `${workTimeElement.start_time} - ${workTimeElement.end_time}: ${workTimeElement.details} - ${workTimeElement.category}\n`;

			let found = false;
			const lineNumber = doc.lastLine();
			for (let i = 0; i <= lineNumber; i++) {
				if (doc.getLine(i).startsWith('# Time Sheet')) {
					doc.replaceRange(workTimeString, { line: i + 1, ch: 0 });
					found = true;
					break;
				}
			}

			if (!found) { // If '# Time Sheet' heading is not found
				doc.setValue(doc.getValue() + '\n# Time Sheet\n' + workTimeString);
			}
		}
	}
}

export class SampleModal extends Modal {
	workTimeElement: WorkTimeElement = {start_time: '', end_time: '', details: '', category: ''};
	onSubmit: (workTimeElement: WorkTimeElement) => void;

	constructor(app: App, onSubmit: (workTimeElement: WorkTimeElement) => void) {
		super(app);
		this.onSubmit = onSubmit;
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.createEl("h1", {
			text: "Enter work time details"
		})
		new Setting(contentEl)
			.setName("Start Time")
			.addText((text) => text.onChange(
				(value) => {
					this.workTimeElement.start_time = value
		}) );
		new Setting(contentEl)
			.setName("End Time")
			.addText((text) => text.onChange(
				(value) => {
					this.workTimeElement.end_time = value
		}) );
		new Setting(contentEl)
			.addText((text) => text.onChange(
				.setName("Details")
				(value) => {
					this.workTimeElement.details = value
		}) );
		new Setting(contentEl)
			.setName("Category")
			.addText((text) => text.onChange(
				(value) => {
					this.workTimeElement.category = value
		}) );
		new Setting(contentEl)
			.addButton((btn) =>
				btn
					.setButtonText("Submit")
					.setCta()
					.onClick(() => {
						console.log("test");
						console.log(this.workTimeElement);
						this.close();
						this.onSubmit(
							this.workTimeElement
					);
					}
				)
		)
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
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
