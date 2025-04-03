document.addEventListener("DOMContentLoaded", function () {
    const generateBtn = document.getElementById("generateQR");
    const blockBtn = document.getElementById("blockQR");
    const unblockBtn = document.getElementById("unblockQR");
    const qrImage = document.getElementById("qrImage");
    const statusText = document.getElementById("statusText");
    let qrId = null; // Store the generated QR ID

    // ✅ Generate QR Code
    generateBtn.addEventListener("click", function () {
        const textInput = document.getElementById("qrText").value;

        if (!textInput.trim()) {
            alert("Please enter text to generate QR!");
            return;
        }

        fetch("http://127.0.0.1:5000/generate_qr", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text: textInput })
        })
            .then(response => response.json())
            .then(data => {
                if (data.qr_code) {
                    qrImage.src = data.qr_code;
                    qrImage.style.display = "block";
                    qrId = data.qr_id; // Save the QR ID
                    statusText.textContent = "QR Code Status: Active";
                } else {
                    alert("Failed to generate QR!");
                }
            })
            .catch(error => console.error("Error:", error));
    });

    // ✅ Block QR Code
    blockBtn.addEventListener("click", function () {
        if (!qrId) {
            alert("Generate a QR code first!");
            return;
        }

        fetch("http://127.0.0.1:5000/block_qr", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ qr_id: qrId })
        })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    statusText.textContent = "QR Code Status: Blocked";
                } else {
                    alert("Failed to block QR!");
                }
            })
            .catch(error => console.error("Error:", error));
    });

    // ✅ Unblock QR Code
    unblockBtn.addEventListener("click", function () {
        if (!qrId) {
            alert("Generate a QR code first!");
            return;
        }

        fetch("http://127.0.0.1:5000/unblock_qr", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ qr_id: qrId })
        })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    statusText.textContent = "QR Code Status: Active";
                } else {
                    alert("Failed to unblock QR!");
                }
            })
            .catch(error => console.error("Error:", error));
    });
});
let userRole = '';

function setRole(role) {
    userRole = role;
    navigateTo('login');
}

function handleLogin(event) {
    event.preventDefault();

    // Capture the login details
    const email = document.getElementById('login-email').value;
    const name = document.getElementById('login-name').value;

    // Save details for use in the profile page
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userName', name);

    navigateTo('home');
}

function navigateTo(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');

    // Display login data in the profile page
    if (pageId === 'profile') {
        document.getElementById('profile-name').textContent = localStorage.getItem('userName');
        document.getElementById('profile-email').textContent = localStorage.getItem('userEmail');
    }
}
