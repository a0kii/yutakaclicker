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
	fullScreenWarning.textContent = "Слишком быстро!";
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

	function showPlusOne(event) {
		const plusOne = document.createElement('div');
		plusOne.textContent = '+1';
		plusOne.classList.add('plus-one');
		document.body.appendChild(plusOne);

		const x = event.clientX || (clickButton.offsetLeft + clickButton.offsetWidth / 2);
		const y = event.clientY || clickButton.offsetTop;

		const randomXOffset = Math.random() * 40 - 20;

		plusOne.style.left = `${x + randomXOffset}px`;
		plusOne.style.top = `${y}px`;

		plusOne.addEventListener('animationend', () => {
			plusOne.remove();
		});
	}

	clickButton.addEventListener("click", (event) => {
		const now = Date.now();

		clickTimestamps = clickTimestamps.filter(t => now - t <= 3000);
		clickTimestamps.push(now);

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

		showPlusOne(event);
	});

	const tg = window.Telegram.WebApp;

	tg.expand();
	tg.MainButton.setText("Отправить данные");
	tg.MainButton.show();

	tg.MainButton.onClick(() => {
		const clickCount = document.getElementById("click-count").textContent;

		try {
			tg.sendData(JSON.stringify({ clicks: parseInt(clickCount, 10) }));
		} catch (error) {
			console.error("error sending message to telegram", error);
		}

		tg.close();
	});
});
