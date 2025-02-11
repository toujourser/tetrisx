<template>
  <div class="shop">
    <header class="header">
      <router-link to="/" class="back-button">返回首页</router-link>
      <div class="coins">金币: 0</div>
    </header>

    <main class="shop-content">
      <h1 class="shop-title">商店</h1>
      <div class="items-grid">
        <div v-for="item in shopItems" :key="item.id" class="shop-item">
          <div class="item-image">{{ item.icon }}</div>
          <div class="item-info">
            <h3>{{ item.name }}</h3>
            <p>{{ item.description }}</p>
            <button class="buy-button" :disabled="item.price > 0">
              {{ item.price }} 金币
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
const shopItems = [
  {
    id: 1,
    name: '额外生命',
    description: '获得一次重生机会',
    price: 100,
    icon: '❤️'
  },
  {
    id: 2,
    name: '时间加速',
    description: '获得10秒额外时间',
    price: 50,
    icon: '⏰'
  },
  {
    id: 3,
    name: '提示道具',
    description: '显示正确路径3秒',
    price: 75,
    icon: '💡'
  }
]
</script>

<style lang="scss" scoped>
.shop {
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

  .coins {
    font-size: 18px;
    font-weight: bold;
  }
}

.shop-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;

  .shop-title {
    font-size: 36px;
    margin-bottom: 40px;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  }
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 1200px;
}

.shop-item {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }

  .item-image {
    font-size: 40px;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
  }

  .item-info {
    flex: 1;

    h3 {
      margin: 0 0 5px;
      font-size: 18px;
    }

    p {
      margin: 0 0 15px;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
    }
  }

  .buy-button {
    width: 100%;
    padding: 8px;
    border: none;
    border-radius: 20px;
    background: linear-gradient(45deg, #4CAF50 0%, #45a049 100%);
    color: white;
    font-weight: bold;
    cursor: pointer;
    transition: opacity 0.2s;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &:not(:disabled):hover {
      opacity: 0.9;
    }
  }
}
</style>