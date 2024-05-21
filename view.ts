import { ItemView, WorkspaceLeaf } from "obsidian";
import { Chart } from 'chart.js';

export const VIEW_TYPE_EXAMPLE = "time-visualisation";

export class TimeVisualisation extends ItemView {
	chart: Chart | null = null;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return VIEW_TYPE_EXAMPLE;
	}

	getDisplayText() {
		return "Visualise Time Spent";
	}

	async onOpen() {
		const container = this.containerEl.children[1];
		container.empty();
		container.createEl("h4", { text: "Example view" });
		const script = document.createElement('script');
		script.onload = () => {
			this.drawChart();
		};
		document.body.appendChild(script);
		this.drawChart();
	}

	async onClose() {
		// Nothing to clean up.
	} 

	// Function to draw the chart
	drawChart() {
		const ctx = this.containerEl.children[1];
		this.chart = new Chart(ctx, {
			type: 'bar',
			data: {
			labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
			datasets: [{
			label: '# of Votes',
			data: [12, 19, 3, 5, 2, 3],
			backgroundColor: [
				'rgba(255, 99, 132, 0.2)',
				'rgba(54, 162, 235, 0.2)',
				'rgba(255, 206, 86, 0.2)',
				'rgba(75, 192, 192, 0.2)',
				'rgba(153, 102, 255, 0.2)',
				'rgba(255, 159, 64, 0.2)'
			],
			borderColor: [
				'rgba(255, 99, 132, 1)',
				'rgba(54, 162, 235, 1)',
				'rgba(255, 206, 86, 1)',
				'rgba(75, 192, 192, 1)',
				'rgba(153, 102, 255, 1)',
				'rgba(255, 159, 64, 1)'
			],
			borderWidth: 1
			}]
			},
			options: {
				scales: {
					y: {
						beginAtZero: true
					}
				}
			}
		});
	}
}
