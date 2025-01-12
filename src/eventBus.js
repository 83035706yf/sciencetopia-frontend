// eventBus.js
import { reactive, onUnmounted } from 'vue'

const listeners = reactive(new Map())

export const eventBus = {
  on(event, callback) {
    if (!listeners.has(event)) {
      listeners.set(event, new Set())
    }
    listeners.get(event).add(callback)
  },
  off(event, callback) {
    if (listeners.has(event)) {
      listeners.get(event).delete(callback)
    }
  },
  emit(event, ...args) {
    if (listeners.has(event)) {
      for (const callback of listeners.get(event)) {
        callback(...args)
      }
    }
  },
}

export const useEventBus = (event, callback) => {
  eventBus.on(event, callback)
  onUnmounted(() => eventBus.off(event, callback))
}
