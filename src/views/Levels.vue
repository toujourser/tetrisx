<template>
  <div class="levels">
    <header class="header">
      <div class="progress">
        <span class="progress-text">已通关 0/50 关</span>
      </div>
      <router-link to="/" class="back-button">返回首页</router-link>
    </header>

    <main class="level-grid">
      <div v-for="level in 50" :key="level" class="level-item" :class="{ locked: level > 1 }" @click="handleLevelClick(level)">
        <div class="level-content">
          <template v-if="level <= 1">
            <span class="level-number">{{ level }}</span>
          </template>
          <template v-else>
            <span class="lock-icon">🔒</span>
          </template>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleLevelClick = (level) => {
  if (level <= 1) {
    router.push({
      path: '/game',
      query: { level }
    })
  }
}
</script>

<style lang="scss" scoped>
.levels {
  height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%);
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;

  .progress-text {
    font-size: 18px;
    font-weight: bold;
  }

  .back-button {
    padding: 8px 16px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    text-decoration: none;
    font-size: 14px;
    transition: background-color 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
}

.level-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 15px;
  padding: 10px;
  overflow-y: auto;

  .level-item {
    aspect-ratio: 1;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.2s, background-color 0.2s;

    &:not(.locked):hover {
      transform: scale(1.05);
      background: rgba(255, 255, 255, 0.2);
    }

    &.locked {
      background: rgba(0, 0, 0, 0.3);
      cursor: not-allowed;

      .lock-icon {
        font-size: 24px;
        opacity: 0.5;
      }
    }

    .level-content {
      font-size: 24px;
      font-weight: bold;
    }

    .level-number {
      color: #4CAF50;
    }
  }
}
</style>