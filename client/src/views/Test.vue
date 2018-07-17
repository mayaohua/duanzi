<template>
    <div class="wrap">
        <span class="demo-title">Pull-refresh and push-load</span>
        <div class="parent" ref="parentElm">
          <vue-scroll 
          :ops="ops"
          @refresh-start="handleRS"
          @load-before-deactivate="handleLBD"
          >
          <template
          v-for="(item, index) in amount"
          >
          <p 
          :key="index"
          :width="width"
          :index="index"
          :backgroundColor="item" style="height: 80px;">啦啦</p>
          <br v-if="index % 1 == 0" />
          </template>
          </vue-scroll>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            ops: {
              vuescroll: {
                mode: 'slide',
                pullRefresh: {
                  enable: true
                },
                pushLoad: {
                  enable: true
                }
              }
            },
            width: '',
            itemAmount: 16,
            refresh: 1
        }
    },
    computed: {
      amount() {
          function getRandom() {
              let str = "#";
              for(let i = 0; i < 6; i++) {
                  str += Math.floor(Math.random() * 16).toString(16);
              }
              return str;
          }
          return this.refresh && Array.apply(null, {
              length: this.itemAmount
          }).map(item => {
              return getRandom();
          })
      }
    },
    methods: {
      handleRS(vsInstance, refreshDom, done) {
        const vm = this;
        setTimeout(() => {
          this.refresh++;
          done();
        }, 1500);
      },
      handleLBD(vm, loadDom, done) {
        setTimeout(() => {
          this.itemAmount += 8;
          done();
        }, 500);
      }
    },
    mounted() {
        this.width = this.$refs['parentElm'].clientWidth / 16 + "rem";
    }
}
</script>

<!-- <style lang="stylus">
</style> -->