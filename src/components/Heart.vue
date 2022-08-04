<script setup lang="ts">
import HeartBeatLine from '../../docs/alone.svg';
import HeartSvg from './heart.svg';
import { ComponentPublicInstance, onMounted, ref, watch } from "vue";
import { normalize, sampleAll, statistics } from "../utils/sample";
import { animate } from "../utils/animation";

const svgRef = ref<ComponentPublicInstance>();

const left = ref('0');
const lineLeft = ref('0');
const lineTop = ref('0');
const top = ref('0');
const scale = ref(1);
const color = ref(0);
const height = ref('0');

const indicatorSize = 4;
const duration = ref(10000);

onMounted(() => {
  let svg = svgRef.value!.$el as SVGElement;
  let g: SVGGElement = svg.getElementsByTagName('g')[0];
  const points = sampleAll([...g.getElementsByTagName('path')], 1);
  const { min, size } = statistics(points, 0.5);

  height.value = size.y + 'px';
  lineTop.value = min.y + 0.5 + 'px';


  const fn = animate(normalize(points), 10000);
  const reset = fn(point => {
    lineLeft.value = min.x + size.x * point.x + 1.5 - indicatorSize / 2 + 'px';
    left.value = min.x + size.x * point.x - indicatorSize / 2 + 'px';
    top.value = min.y + size.y * point.y - indicatorSize / 2 + 'px';
    scale.value = 1 + point.y * 0.618;
    color.value = 127 + 255 * point.y / 2;
  });

  watch(duration, newDuration => {
    reset(parseFloat(newDuration as any));
  });

  return () => {
    reset();
  };
});

</script>

<template>
  <div class="container">
    <HeartBeatLine ref="svgRef" class="graph" />
    <span class="indicator" :style="{ left, top, width: indicatorSize + 'px', height: indicatorSize + 'px' }" />
    <span class="indicator-line" :style="{ left: lineLeft, height, top: lineTop }" />
    <div class="controls">
      <label>
        Speed({{ duration / 1000 }}s):
        <input type="range" min="10000" max="30000" step="1000" v-model="duration">
      </label>
    </div>
    <HeartSvg
        class="heart"
        :style="{
          transform: `scale3d(${scale}, ${scale}, ${scale})`,
          stroke: `rgb(${color}, 0, 0)`,
          fill: `rgb(${color}, 0, 0)`,
        }"
    />
  </div>
</template>

<style scoped>

.graph {
  width: 375px;
  height: 50px;
}

.container {
  position: relative;
  width: min-content;
  margin: auto;
}

.indicator {
  position: absolute;
  display: block;
  border-radius: 50%;
  background-color: blue;
}

.indicator-line {
  position: absolute;
  background-color: blue;
  width: 1px;
}

.heart {
  display: block;
  margin: auto;
  width: 100px;
  height: 100px;
}

.controls {
  width: min-content;
  margin: 24px auto 48px;
}
</style>
