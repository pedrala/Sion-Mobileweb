import Chart from 'chart.js'
import { generateChart } from 'vue-chartjs'

// Extend on of the default charts
// http://www.chartjs.org/docs/latest/developers/charts.html
Chart.defaults.GaugeChart = Chart.defaults.gauge
Chart.controllers.GaugeChart = Chart.controllers.gauge.extend({
  name: 'GaugeChart'
})

export const GaugeChart = generateChart('gauge-chart', 'GaugeChart')
