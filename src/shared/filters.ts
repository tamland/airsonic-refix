import Vue from 'vue';


Vue.filter("duration", (value: number) => {
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
})

Vue.filter("dateTime", (value: string) => {
  return value;
})