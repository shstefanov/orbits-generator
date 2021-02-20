

const crypto = require("crypto");
crypto.createHmac("sha256", "secret").update("my message").digest("hex");


let n = 0;

console.time("test sha256")
for(let i = 0; i < 1000000; i++){
	crypto

		.createHmac("sha256", "secret")
		// .createHash("md5")
	
		.update(("-".repeat(1000)) + (n++))
		.digest("hex");
}
console.timeEnd("test sha256")
