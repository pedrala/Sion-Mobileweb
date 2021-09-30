<template>
 <div style="display:flex; height:100%; padding-bottom:15px;">
   <sionScore style="flex:6;" :symbol="symbol"></sionScore>
   <tech-indi-diag style="flex:4;" :symbol="symbol"></tech-indi-diag>
 </div>
</template>

<script>
export default {
  props:['symbol'] ,
  components: {
    sionScore: () => import(/* webpackPrefetch: true */ '@/components/view/sise/diag/sionScore'),
    techIndiDiag: () => import(/* webpackPrefetch: true */ '@/components/view/sise/diag/techIndiDiag')
  },
  data() {
    return {

    };
  },
  methods: {
  },
  created() {
  },
  mounted() {

  },
  beforeDestroy() {
  }
}
</script>
