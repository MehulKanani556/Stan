const axios = require("axios");

async function run() {
    try {
        // 1. create dummy user
        const regRes = await axios.post("http://localhost:8000/api/register", {
            name: "TestUser",
            email: "test_checkout@example.com",
            password: "password123",
            contactNo: "1234567890"
        }).catch(e => e.response);

        // 2. login to get token
        const loginRes = await axios.post("http://localhost:8000/api/userLogin", {
            emailOrPhone: "test_checkout@example.com",
            password: "password123"
        });
        const token = loginRes.data.token || loginRes.data.data?.token;

        // 3. fetch any game to use its ID
        const gamesRes = await axios.get("http://localhost:8000/api/getAllGames");
        const game = gamesRes.data.games[0] || gamesRes.data[0] || gamesRes.data.data[0];
        if (!game) {
            console.log("No games found!");
            return;
        }

        // 4. try order create
        const payload = {
            items: [{
                game: game._id,
                name: game.title,
                platform: "android",
                price: 50
            }],
            amount: 50,
            fanCoinsUsed: 0,
            fanCoinDiscount: 0
        };

        console.log("Sending payload", payload);

        const orderRes = await axios.post("http://localhost:8000/api/order/create", payload, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log("Success:", orderRes.data);

    } catch (err) {
        if (err.response) {
            console.log("Error response status:", err.response.status);
            console.log("Error response data:", JSON.stringify(err.response.data, null, 2));
        } else {
            console.log("Error:", err.message);
        }
    }
}
run();
