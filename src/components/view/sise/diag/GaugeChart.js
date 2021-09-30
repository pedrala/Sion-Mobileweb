import { mixins } from 'vue-chartjs'
import { GaugeChart } from './CustomGauge.js'

const { reactiveProp } = mixins
import ChartJsPluginDataLabels from 'chartjs-plugin-datalabels'

export default {
  extends: GaugeChart,
  mixins: [reactiveProp],
  props: ['options'],
  mounted () {
    Chart.plugins.unregister(ChartJsPluginDataLabels);
    this.addPlugin(ChartJsPluginDataLabels);
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    this.renderChart(this.chartData, this.options)
  }
}
