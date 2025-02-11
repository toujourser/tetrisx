<template>
  <div class="game">
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
const mazeSize = ref(10) // 迷宫大小
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

// 生成迷宫
const generateMaze = () => {
  const size = mazeSize.value
  const newMaze = new Array(size * size).fill(1) // 初始化为墙

  const dfs = (x, y) => {
    const directions = [
      [0, -2], // 上
      [2, 0],  // 右
      [0, 2],  // 下
      [-2, 0]  // 左
    ].sort(() => Math.random() - 0.5)

    for (const [dx, dy] of directions) {
      const newX = x + dx
      const newY = y + dy
      if (newX >= 0 && newX < size && newY >= 0 && newY < size && newMaze[newY * size + newX] === 1) {
        newMaze[newY * size + newX] = 0 // 设置为路径
        newMaze[(y + dy/2) * size + (x + dx/2)] = 0 // 打通墙
        dfs(newX, newY)
      }
    }
  }

  // 从左上角开始生成
  newMaze[0] = 0
  dfs(0, 0)

  // 设置起点和终点
  startPosition.value = 0
  endPosition.value = size * size - 1

  // 确保终点可达
  const endX = size - 1
  const endY = size - 1
  
  // 如果终点被墙包围，打通一条到终点的路
  if (newMaze[endPosition.value] === 1) {
    newMaze[endPosition.value] = 0
    // 确保至少有一个相邻的格子是路径
    if (endX > 0 && newMaze[endY * size + (endX - 1)] === 0) {
      // 左边是路
      newMaze[endY * size + endX] = 0
    } else if (endY > 0 && newMaze[(endY - 1) * size + endX] === 0) {
      // 上边是路
      newMaze[endY * size + endX] = 0
    } else {
      // 如果周围都是墙，打通到左边的路
      for (let x = endX; x >= 0; x--) {
        newMaze[endY * size + x] = 0
      }
    }
  }

  maze.value = newMaze
  playerPosition.value = startPosition.value
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
onMounted(() => {
  generateMaze()
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
</style>