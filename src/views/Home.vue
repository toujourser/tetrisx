<template>
  <div class="home">
    <header class="header">
      <div class="player-info">
        <span class="nickname">玩家昵称</span>
        <span class="level">当前关卡: 1</span>
        <span class="coins">金币: 0</span>
      </div>
    </header>

    <main class="main-content">
      <h1 class="game-title">迷宫探险家</h1>
      <div class="menu-buttons">
        <router-link to="/levels" class="menu-button start">开始游戏</router-link>
        <router-link to="/leaderboard" class="menu-button">排行榜</router-link>
        <router-link to="/shop" class="menu-button">商店</router-link>
      </div>
    </main>

    <footer class="footer">
      <p class="copyright">© 2023 迷宫探险家</p>
    </footer>
  </div>
</template>

<script setup>
// Home page component logic
</script>

<style lang="scss" scoped>
.home {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%);
  color: white;
}

.header {
  padding: 20px;
  background: rgba(0, 0, 0, 0.2);

  .player-info {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
  }
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;

  .game-title {
    font-size: 48px;
    margin-bottom: 50px;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  }

  .menu-buttons {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 80%;
    max-width: 300px;
  }

  .menu-button {
    padding: 15px 30px;
    border-radius: 25px;
    background: linear-gradient(45deg, #ff6b6b 0%, #ff8e8e 100%);
    color: white;
    text-decoration: none;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    }

    &.start {
      background: linear-gradient(45deg, #4CAF50 0%, #45a049 100%);
    }
  }
}

.footer {
  padding: 20px;
  text-align: center;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}
</style>