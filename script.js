// 加载配置文件并更新页面内容
async function loadConfig() {
    try {
        const response = await fetch('config.json');
        const config = await response.json();
        updateContent(config);
    } catch (error) {
        console.error('Error loading config:', error);
    }
}

// 更新页面内容
function updateContent(config) {
    // 更新标题
    document.title = config.game.title;
    document.querySelector('.logo').textContent = config.game.title;
    document.querySelector('h1').textContent = `Play ${config.game.title}`;

    // 更新游戏iframe
    const iframe = document.querySelector('.game-container iframe');
    iframe.src = config.game.iframe_url;
    iframe.width = config.game.iframe_width;
    iframe.height = config.game.iframe_height;

    // 更新关于部分
    const aboutSection = document.querySelector('.about-section');
    aboutSection.innerHTML = `
        <h2>About ${config.game.title}</h2>
        <div class="about-content">
            <p>${config.about.description}</p>
            <div class="about-details">
                <p><strong>Version:</strong> ${config.about.version}</p>
                <p><strong>Developer:</strong> ${config.about.developer}</p>
                <p><strong>Publisher:</strong> ${config.about.publisher}</p>
            </div>
        </div>
    `;

    // 更新特性部分
    const featuresGrid = document.querySelector('.features-grid');
    featuresGrid.innerHTML = config.features.map(feature => `
        <div class="feature-card">
            <h3>${feature.title}</h3>
            <p>${feature.description}</p>
        </div>
    `).join('');

    // 更新控制说明部分
    const keyboardControls = document.querySelector('.keyboard-controls');
    const mobileControls = document.querySelector('.mobile-controls');

    keyboardControls.innerHTML = `
        <h3>Keyboard Controls</h3>
        <ul>
            ${Object.entries(config.controls.keyboard).map(([key, value]) => `
                <li><strong>${key}:</strong> ${value}</li>
            `).join('')}
        </ul>
    `;

    mobileControls.innerHTML = `
        <h3>Mobile Controls</h3>
        <ul>
            ${Object.entries(config.controls.mobile).map(([key, value]) => `
                <li><strong>${key}:</strong> ${value}</li>
            `).join('')}
        </ul>
    `;
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', loadConfig);

// 禁用不需要的页面滚动
window.addEventListener("wheel", (event) => event.preventDefault(), {
    passive: false,
});

// 禁用不需要的按键事件和空格滚动
window.addEventListener("keydown", (event) => {
    if (["ArrowUp", "ArrowDown", " "].includes(event.key)) {
        event.preventDefault();
    }
});

// 禁用右键菜单
document.addEventListener("contextmenu", (event) => event.preventDefault());

// 初始化 SDK
window.addEventListener('load', function() {
    // 游戏加载开始
    window.CrazyGames.SDK.game.sdkGameLoadingStart();

    // 监听 iframe 加载完成
    const gameFrame = document.querySelector('.game-container iframe');
    gameFrame.addEventListener('load', function() {
        // 游戏加载完成
        window.CrazyGames.SDK.game.sdkGameLoadingStop();
        
        // 通知游戏开始
        window.CrazyGames.SDK.game.gameplayStart();
    });
}); 