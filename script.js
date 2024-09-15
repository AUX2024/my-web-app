function showRegister() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('registerPage').style.display = 'block';
}

function showLogin() {
    document.getElementById('registerPage').style.display = 'none';
    document.getElementById('loginPage').style.display = 'block';
}

function login() {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let users = JSON.parse(localStorage.getItem('users')) || {};

    if (users[username] && users[username].password === password) {
        alert('登录成功');
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('tradePage').style.display = 'block';
        updateBalance(username);
    } else {
        alert('用户名或密码错误');
    }
}

function register() {
    let newUsername = document.getElementById('newUsername').value;
    let newPassword = document.getElementById('newPassword').value;
    let confirmPassword = document.getElementById('confirmPassword').value;

    if (newUsername && newPassword && confirmPassword && newPassword === confirmPassword) {
        let users = JSON.parse(localStorage.getItem('users')) || {};
        users[newUsername] = { username: newUsername, password: newPassword, balance: 0, trades: [] };
        localStorage.setItem('users', JSON.stringify(users));
        alert('注册成功');
        showLogin();
    } else {
        alert('请确保所有字段已填写且密码匹配');
    }
}

function openTrade(asset) {
    document.getElementById('tradeTitle').innerText = `交易：${asset}`;
    document.getElementById('tradeBox').style.display = 'block';
    document.getElementById('tradeBox').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function trade(action) {
    let amount = parseFloat(document.getElementById('tradeAmount').value);
    let username = document.getElementById('username').value;

    if (amount > 0 && username) {
        let users = JSON.parse(localStorage.getItem('users')) || {};
        let user = users[username];
        if (!user) {
            alert('用户不存在，请重新登录');
            return;
        }
        
        if (user.balance < amount) {
            alert('余额不足，无法进行交易');
            return;
        }

        alert(`您选择了${action === 'buy' ? '买入' : '卖出'} ${amount} 金额`);
        let trade = { amount: amount, type: action, result: null, time: new Date().toLocaleString() };
        user.trades.push(trade);
        localStorage.setItem('users', JSON.stringify(users));
        startCountdown(action, amount, username, user.trades.length - 1);
        document.getElementById('countdownModal').scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        alert('请输入有效的金额');
    }
}

function startCountdown(action, amount, username, tradeIndex) {
    let countdown = 60;
    document.getElementById('countdownModal').style.display = 'block';
    document.getElementById('countdownText').innerText = `倒计时: ${countdown}秒`;
    let interval = setInterval(function() {
        countdown--;
        document.getElementById('countdownText').innerText = `倒计时: ${countdown}秒`;
        if (countdown === 0) {
            clearInterval(interval);
            document.getElementById('countdownModal').style.display = 'none';
            calculateResult(username, tradeIndex);
        }
    }, 1000);
}

function calculateResult(username, tradeIndex) {
    let users = JSON.parse(localStorage.getItem('users')) || {};
    let user = users[username];
    let trade = user.trades[tradeIndex];

    let profitOrLoss = 0.16;  // 固定盈利16%
    let resultAmount = trade.amount * profitOrLoss;
    trade.result = resultAmount;
    user.balance += resultAmount;
    localStorage.setItem('users', JSON.stringify(users));

    alert(`交易结束！盈利 ¥${resultAmount.toFixed(2)}`);
    updateBalance(username);
}

function showHistory() {
    let username = document.getElementById('username').value;
    let users = JSON.parse(localStorage.getItem('users')) || {};
    let user = users[username];

    if (user && user.trades.length > 0) {
        let historyContent = document.getElementById('historyContent');
        historyContent.innerHTML = '';
        user.trades.forEach(trade => {
            let tradeElement = document.createElement('p');
            tradeElement.textContent = `${trade.time} - ${trade.type} ${trade.amount} 结果: ${trade.result ? trade.result.toFixed(2) : '待定'}`;
            historyContent.appendChild(tradeElement);
        });
        document.getElementById('historyModal').style.display = 'block';
    } else {
        document.getElementById('historyContent').innerText = '无交易记录';
        document.getElementById('historyModal').style.display = 'block';
    }
}

function closeHistory() {
    document.getElementById('historyModal').style.display = 'none';
}

function updateBalance(username) {
    let users = JSON.parse(localStorage.getItem('users')) || {};
    let user = users[username];
    document.querySelector('.balance-container').innerText = `余额: ¥${user.balance.toFixed(2)}`;
}

function logout() {
    document.getElementById('tradePage').style.display = 'none';
    document.getElementById('loginPage').style.display = 'block';
}

function openService() {
    window.open("https://kefu.moyu-b1.xyz/kefu/66e17e4c61ae4", "_blank");
}
