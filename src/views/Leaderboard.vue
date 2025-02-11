<template>
  <div class="leaderboard">
    <header class="header">
      <router-link to="/" class="back-button">返回首页</router-link>
      <h1 class="title">排行榜</h1>
    </header>

    <main class="leaderboard-content">
      <div class="ranking-list">
        <div v-for="(player, index) in topPlayers" :key="index" class="ranking-item">
          <div class="rank" :class="{ 'top-3': index < 3 }">#{{ index + 1 }}</div>
          <div class="player-info">
            <span class="name">{{ player.name }}</span>
            <span class="score">{{ player.score }}分</span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
const topPlayers = [
  { name: '玩家1', score: 1000 },
  { name: '玩家2', score: 850 },
  { name: '玩家3', score: 720 },
  { name: '玩家4', score: 650 },
  { name: '玩家5', score: 580 },
]
</script>

<style lang="scss" scoped>
.leaderboard {
  height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%);
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 40px;

  .back-button {
    padding: 8px 16px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    text-decoration: none;
    font-size: 14px;
    transition: background-color 0.2s;
    margin-right: 20px;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }

  .title {
    font-size: 36px;
    margin: 0;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  }
}

.leaderboard-content {
  flex: 1;
  display: flex;
  justify-content: center;
}

.ranking-list {
  width: 100%;
  max-width: 600px;
}

.ranking-item {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  margin-bottom: 10px;
  padding: 15px 20px;
  border-radius: 10px;
  transition: transform 0.2s;

  &:hover {
    transform: translateX(5px);
  }

  .rank {
    font-size: 24px;
    font-weight: bold;
    margin-right: 20px;
    min-width: 40px;

    &.top-3 {
      color: #ffd700;
    }
  }

  .player-info {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .name {
      font-size: 18px;
    }

    .score {
      font-weight: bold;
      color: #4CAF50;
    }
  }
}
</style>