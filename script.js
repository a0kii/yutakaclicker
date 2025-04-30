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
	let clickTimestamps = [];
	const maxClicksPer3s = 28;

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

	// Анимация кнопки
	// clickButton.style.transition = "transform 0.15s ease"; // Перенесено в CSS

	// Функция для создания всплывающего текста +1
	function showPlusOne(event) {
		const plusOne = document.createElement('div');
		plusOne.textContent = '+1';
		plusOne.classList.add('plus-one');
		document.body.appendChild(plusOne); // Добавляем на страницу

		// Позиционируем относительно клика (если событие доступно)
		const x = event.clientX || (clickButton.offsetLeft + clickButton.offsetWidth / 2);
		const y = event.clientY || clickButton.offsetTop;

		// Рандомизируем горизонтальное положение для разнообразия
		const randomXOffset = Math.random() * 40 - 20; // от -20px до +20px

		plusOne.style.left = `${x + randomXOffset}px`;
		plusOne.style.top = `${y}px`;

		// Удаляем элемент после завершения анимации
		plusOne.addEventListener('animationend', () => {
			plusOne.remove();
		});
	}

	clickButton.addEventListener("click", (event) => { // Добавляем event
		const now = Date.now();

		// Удаляем старые клики (старше 3 секунд)
		clickTimestamps = clickTimestamps.filter(t => now - t <= 3000);
		clickTimestamps.push(now);

		// Проверка на бота
		if (clickTimestamps.length > maxClicksPer3s) {
			fullScreenWarning.style.display = "flex";
			setTimeout(() => {
				fullScreenWarning.style.display = "none";
			}, 2000);
			return;
		}

		clickButton.style.transform = "scale(1.15)";
		setTimeout(() => {
			clickButton.style.transform = "scale(1)";
		}, 150);

		clickCount++;
		clickCountElement.textContent = clickCount;

		showPlusOne(event); // Вызываем функцию для показа +1
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
