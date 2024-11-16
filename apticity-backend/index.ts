import express from "express";

const app = express();
app.use(express.json());

app.post("/verify-wallet", async (req, res) => {
    const { address, signedMessage, originalMessage } = req.body;

    // Verify the wallet signature here
    try {
        const isValid = await verifySignature(address, signedMessage, originalMessage);
        if (isValid) {
            res.json({ message: "Wallet verified successfully" });
        } else {
            res.status(400).json({ error: "Invalid signature" });
        }
    } catch (error) {
        console.error("Verification failed:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Add your custom `verifySignature` function here (specific to Aptos SDK)
const verifySignature = async (address: string, signedMessage: string, originalMessage: string) => {
    // Use Aptos SDK or a library for signature verification
    return true; // Replace with actual verification logic
};

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
