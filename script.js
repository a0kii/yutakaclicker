document.addEventListener("DOMContentLoaded", function () {
    const clickCountElement = document.getElementById("click-count");
    const clickButton = document.getElementById("click-button");
    const warningText = document.getElementById("warning");

    if (window.Telegram && window.Telegram.WebApp) {
        const userAgent = navigator.userAgent;
        const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);

        if (!isMobile) {
            clickButton.style.display = "none";
            warningText.style.display = "block";
        }
    }

    let clickCount = 0;
    clickButton.addEventListener("click", () => {
        clickCount++;
        clickCountElement.textContent = clickCount;
    });

    const tg = window.Telegram.WebApp;

    tg.expand();

    tg.MainButton.setText("Закончить фарм");
    tg.MainButton.show();

    tg.MainButton.onClick(() => {
        const clickCount = document.getElementById("click-count").textContent;
        
        console.log("Отправка данных:", clickCount);

        try {
            tg.sendData(JSON.stringify({ clicks: clickCount }));
            console.log("✅ Данные отправлены!");
        } catch (error) {
            console.error("❌ Ошибка отправки данных:", error);
        }

        tg.close();
    });

});
