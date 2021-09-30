<template>
  <div class="event-wrap">

    <diagnosis-top :symbol="symbol" name="diagnosisUp"></diagnosis-top>

    <div class="event-chart">
      <div class="event-chart-score">
        <sion-score :symbol="symbol" direction="up"></sion-score>
      </div>
      <div class="event-chart-phase">
   		  <tech-indi-diag :symbol="symbol" direction="up"></tech-indi-diag>
        <phase-diag :symbol="symbol" ></phase-diag>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props:[ 'symbol' ],
  components: {
    diagnosisTop: () => import(/* webpackPrefetch: true */ '@/components/view/sise/diag/diagnosisTop'),
    phaseDiag: () => import(/* webpackPrefetch: true */ '@/components/view/sise/diag/phaseDiag'),
    sionScore: () => import(/* webpackPrefetch: true */ '@/components/view/sise/diag/sionScore'),
    techIndiDiag: () => import(/* webpackPrefetch: true */ '@/components/view/sise/diag/techIndiDiag')
  },
}
</script>
