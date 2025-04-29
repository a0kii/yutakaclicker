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
    let lastClickTime = 0;
    const minInterval = 200;

    const fullScreenWarning = document.createElement("div");
    fullScreenWarning.id = "click-warning";
    fullScreenWarning.textContent = "Воу-воу-воу, полегче!";
    Object.assign(fullScreenWarning.style, {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        color: "white",
        fontSize: "32px",
        zIndex: 9999,
        display: "none"
    });
    document.body.appendChild(fullScreenWarning);

    clickButton.addEventListener("click", () => {
        const now = Date.now();
        const interval = now - lastClickTime;

        if (interval < minInterval) {
            fullScreenWarning.style.display = "flex";
            setTimeout(() => {
                fullScreenWarning.style.display = "none";
            }, 1500);
            return;
        }

        lastClickTime = now;
        clickCount++;
        clickCountElement.textContent = clickCount;
    });

    const tg = window.Telegram.WebApp;

    tg.expand();
    tg.MainButton.setText("Отправить данные");
    tg.MainButton.show();

    tg.MainButton.onClick(() => {
        const clickCount = document.getElementById("click-count").textContent;

        try {
            tg.sendData(JSON.stringify({ clicks: parseInt(clickCount, 10) }));
            console.log("✅ Данные отправлены:", clickCount);
        } catch (error) {
            console.error("❌ Ошибка отправки данных:", error);
        }

        tg.close();
    });
});
