<template>
  <div
    class="indicator-wrapper"
    :class="{
      showPageIndicator1: isActivePage1,
      showPageIndicator2: isActivePage2,
    }"
  >
    <div
      class="indicator"
      :class="{ isActive: isActivePage1 }"
      @click="$router.push('/timeSelector')"
    ></div>
    <div
      class="indicator"
      :class="{ isActive: isActivePage2 }"
      @click="$router.push('/typeSelector')"
    ></div>
  </div>
</template>
<script>
export default {
  name: "page-indicator",
  computed: {
    isActivePage1() {
      return this.$store.state.isActivePage1;
    },
    isActivePage2() {
      return this.$store.state.isActivePage2;
    },
  },
};
</script>

<style scoped>
.showPageIndicator1 {
  visibility: visible !important;
}

.showPageIndicator2 {
  visibility: visible !important;
}

.isActive {
  height: 2rem !important;
  width: 2rem !important;
  transition: 1s;
}

.indicator-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  visibility: hidden;
}

.indicator {
  border-radius: 50%;
  height: 1rem;
  width: 1rem;
  background-color: #005bb8;
  margin: 1rem;
}

.indicator:hover {
  cursor: pointer;
}
</style>
