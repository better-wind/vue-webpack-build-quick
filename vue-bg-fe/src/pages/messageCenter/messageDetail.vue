<template>
  <div>
    <div class="title">
      <span>消息详情</span>
    </div>
    <v-detail-view :detailConfig="detailConfig"/>
  </div>
</template>
<script>
  import vDetailView from '@/components/messageCenter/detailView'
  export default {
    name:'messageDetail',
    created(){

    },
    computed: {

    },
    data: () => ({
      detailConfig:{
        type:'view',
      }
    }),
    methods: {

    },
    components: {
      vDetailView
    },
  }
</script>

