<template>
  <div class="game">
    <div v-if="isGenerating" class="loading-overlay">
      <div class="loading-content">生成迷宫中...</div>
    </div>
    <header class="game-header">
      <div class="game-info">
        <span class="level-number">第 {{ currentLevel }} 关</span>
        <div class="timer">剩余时间: {{ remainingTime }}s</div>
      </div>
      <div class="item-bar">
        <div class="item" v-for="(count, item) in items" :key="item">
          <span class="item-icon">{{ getItemIcon(item) }}</span>
          <span class="item-count">{{ count }}</span>
        </div>
      </div>
    </header>

    <main class="game-main">
      <div class="maze-container" ref="mazeContainer">
        <div class="maze" :style="{ gridTemplateColumns: `repeat(${mazeSize}, 1fr)` }">
          <div v-for="(cell, index) in maze" :key="index" 
               class="cell" 
               :class="{
                 'wall': cell === 1,
                 'path': cell === 0,
                 'start': index === startPosition,
                 'end': index === endPosition
               }">
            <div v-if="index === playerPosition" class="player">🚶</div>
          </div>
        </div>
      </div>
    </main>

    <footer class="game-controls">
      <div class="control-buttons">
        <button class="control-btn" @touchstart="move('up')" @touchend="stopMove">↑</button>
        <div class="horizontal-controls">
          <button class="control-btn" @touchstart="move('left')" @touchend="stopMove">←</button>
          <button class="control-btn" @touchstart="move('right')" @touchend="stopMove">→</button>
        </div>
        <button class="control-btn" @touchstart="move('down')" @touchend="stopMove">↓</button>
      </div>
      <button class="pause-btn" @click="togglePause">{{ isPaused ? '继续' : '暂停' }}</button>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const currentLevel = ref(parseInt(route.query.level) || 1)
const mazeSize = ref(Math.min(10 + Math.floor((currentLevel.value - 1) / 2), 20)) // 迷宫大小随关卡增加
const maze = ref([]) // 迷宫数据
const playerPosition = ref(0) // 玩家位置
const startPosition = ref(0) // 起点位置
const endPosition = ref(0) // 终点位置
const isPaused = ref(false) // 游戏暂停状态
const remainingTime = ref(60) // 剩余时间
const timer = ref(null) // 计时器

// 游戏道具状态
const items = ref({
  key: 0,
  speed: 0,
  portal: 0
})

// 获取道具图标
const getItemIcon = (item) => {
  const icons = {
    key: '🔑',
    speed: '⚡',
    portal: '🌀'
  }
  return icons[item]
}

const isGenerating = ref(false) // 添加生成状态标记

// 迷宫缓存
const mazeCache = new Map()

// 生成迷宫
const generateMaze = async () => {
  isGenerating.value = true
  const size = mazeSize.value
  const cacheKey = `${size}-${currentLevel.value}`

  // 检查缓存
  if (mazeCache.has(cacheKey)) {
    maze.value = mazeCache.get(cacheKey)
    playerPosition.value = startPosition.value
    isGenerating.value = false
    return
  }

  const newMaze = new Array(size * size).fill(1)
  const branchProbability = Math.min(0.3 + (currentLevel.value - 1) * 0.05, 0.8)
  const timeout = setTimeout(() => {
    if (isGenerating.value) {
      isGenerating.value = false
      alert('迷宫生成超时，请重试')
    }
  }, 5000) // 5秒超时

  try {
    // 简化的迷宫生成算法
    const generatePath = () => {
      newMaze[0] = 0 // 起点
      newMaze[size * size - 1] = 0 // 终点
      let current = 0
      const stack = [current]
      const visited = new Set([current])

      while (stack.length > 0) {
        current = stack.pop()
        const x = current % size
        const y = Math.floor(current / size)

        const neighbors = [
          [x, y - 2], // 上
          [x + 2, y], // 右
          [x, y + 2], // 下
          [x - 2, y]  // 左
        ].filter(([nx, ny]) => 
          nx >= 0 && nx < size && ny >= 0 && ny < size && 
          !visited.has(ny * size + nx)
        )

        if (neighbors.length > 0) {
          stack.push(current)
          const [nx, ny] = neighbors[Math.floor(Math.random() * neighbors.length)]
          const nextCell = ny * size + nx
          const wallX = (x + nx) / 2
          const wallY = (y + ny) / 2

          if (Math.random() < branchProbability) {
            newMaze[wallY * size + wallX] = 0 // 打通墙
            newMaze[nextCell] = 0 // 设置通路
            visited.add(nextCell)
            stack.push(nextCell)
          }
        }
      }
    }

    generatePath()
    mazeCache.set(cacheKey, [...newMaze])
    maze.value = newMaze
    playerPosition.value = startPosition.value
  } finally {
    clearTimeout(timeout)
    isGenerating.value = false
  }
}

// 移动控制
const move = (direction) => {
  if (isPaused.value) return

  const size = mazeSize.value
  const currentPos = playerPosition.value
  let newPos = currentPos

  switch (direction) {
    case 'up':
      if (currentPos >= size) newPos = currentPos - size
      break
    case 'right':
      if (currentPos % size < size - 1) newPos = currentPos + 1
      break
    case 'down':
      if (currentPos < size * (size - 1)) newPos = currentPos + size
      break
    case 'left':
      if (currentPos % size > 0) newPos = currentPos - 1
      break
  }

  // 检查是否可以移动（不是墙）
  if (maze.value[newPos] === 0) {
    playerPosition.value = newPos

    // 检查是否到达终点
    if (newPos === endPosition.value) {
      // 清除当前计时器
      clearInterval(timer.value)
      
      // 保存当前关卡进度
      const completedLevels = JSON.parse(localStorage.getItem('completedLevels') || '[]')
      if (!completedLevels.includes(currentLevel.value)) {
        completedLevels.push(currentLevel.value)
        localStorage.setItem('completedLevels', JSON.stringify(completedLevels))
      }
      
      // 更新关卡并重新开始游戏
      currentLevel.value++
      remainingTime.value = 60
      generateMaze()
      startTimer()
      
      // 显示通关提示
      alert(`恭喜通关！进入第 ${currentLevel.value} 关`)
    }
  }
}

const stopMove = () => {
  // 停止持续移动的逻辑
}

// 暂停游戏
const togglePause = () => {
  isPaused.value = !isPaused.value
  if (isPaused.value) {
    clearInterval(timer.value)
  } else {
    startTimer()
  }
}

// 开始计时
const startTimer = () => {
  timer.value = setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value--
    } else {
      clearInterval(timer.value)
      alert('时间到！游戏结束')
      // TODO: 处理游戏结束逻辑
    }
  }, 1000)
}

// 生命周期钩子
onMounted(async () => {
  await generateMaze()
  startTimer()
})

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})
</script>

<style lang="scss" scoped>
.game {
  height: 100vh;
  background: #1a1a1a;
  color: white;
  display: flex;
  flex-direction: column;
}

.game-header {
  padding: 15px;
  background: rgba(0, 0, 0, 0.3);

  .game-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;

    .level-number {
      font-size: 18px;
      font-weight: bold;
    }

    .timer {
      font-size: 18px;
      color: #4CAF50;
    }
  }

  .item-bar {
    display: flex;
    gap: 15px;

    .item {
      display: flex;
      align-items: center;
      gap: 5px;
      background: rgba(255, 255, 255, 0.1);
      padding: 5px 10px;
      border-radius: 15px;

      .item-icon {
        font-size: 20px;
      }

      .item-count {
        font-size: 16px;
      }
    }
  }
}

.game-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;

  .maze-container {
    width: 100%;
    max-width: 500px;
    aspect-ratio: 1;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
    padding: 10px;
    
    .maze {
      width: 100%;
      height: 100%;
      display: grid;
      gap: 2px;
      background: rgba(0, 0, 0, 0.2);
      padding: 2px;
      border-radius: 8px;

      .cell {
        position: relative;
        width: 100%;
        height: 100%;
        border-radius: 4px;

        &.wall {
          background: #333;
        }

        &.path {
          background: rgba(255, 255, 255, 0.05);
        }

        &.start {
          background: #4CAF50;
        }

        &.end {
          background: #f44336;
        }

        .player {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 20px;
          z-index: 1;
        }
      }
    }
  }
}

.game-controls {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;

  .control-buttons {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;

    .horizontal-controls {
      display: flex;
      gap: 20px;
    }
  }

  .control-btn {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: none;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s;

    &:active {
      background: rgba(255, 255, 255, 0.2);
    }
  }

  .pause-btn {
    padding: 8px 20px;
    border-radius: 20px;
    border: none;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
}
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;

  .loading-content {
    color: white;
    font-size: 24px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }
}
</style>