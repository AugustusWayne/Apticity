# Apticity 🎨✨  
**AI-Generated NFT Art Platform on Aptos Blockchain**  
Deployed at : apticity-chi.vercel.app

**Transaction Hash (Devnet)**: `0x336c5b1d8315380357146af24deebd10e2f3280cd38bdcbd66f2784795621365`  

---

## 🌟 **Overview**  
Apticity is a platform that bridges cutting-edge AI art generation with blockchain technology, allowing users to create, customize, and mint unique NFTs on the Aptos blockchain.  

---

## 🚀 **Features**  
1. **AI Art Generation**:  
   - Generate 5 unique images using AI (e.g., OpenAI DALL-E, DeepAI).  
   - "Surprise Me" button for random creative prompts.  

2. **NFT Minting**:  
   - Preview and select images to mint as NFTs.  
   - Add metadata like name, description, and collection logo.  

3. **Wallet Integration**:  
   - Supports **Petra Wallet** and **Martian Wallet** for secure blockchain interactions.  

4. **IPFS Metadata Storage**:  
   - Stores NFT metadata and artwork securely on IPFS.  

---

## 🏗️ **Tech Stack**  

### **Frontend**  
- **Framework**: React (TypeScript)  
- **Styling**: TailwindCSS  
- **Wallet SDK**: Aptos TypeScript SDK  

### **Backend**  
- **Framework**: Node.js (Express)  
- **AI Art Generation**: OpenAI/DALL-E or DeepAI APIs

### **Smart Contracts**  
- **Language**: Move  
- **Blockchain**: Aptos  

---

## 🔧 **Setup Instructions**  

1. **Clone the Repository**:  
   ```bash  
   git clone https://github.com/M-DEV-1/apticity.git  
   cd apticity  
   ```  

2. **Install Dependencies**:  
   ```bash  
   cd apticity-frontend  
   npm install  
   cd ../apticity-backend  
   npm install  
   ```  

3. **Start Development Servers**:  
   - **Frontend**:  
     ```bash  
     cd apticity-frontend  
     npm start  
     ```  
   - **Backend**:  
     ```bash  
     cd apticity-backend  
     npm start  
     ```  

4. **Deploy Move Contracts**:  
   - Deploy the contracts to Aptos devnet using the Move CLI.  

---

## 📜 **Usage Flow**  

1. **Landing Page**:  
   - Connect your wallet and enter a prompt to generate AI art.  

2. **Generate AI Art**:  
   - Redirect to a page showcasing 5 AI-generated images.  

3. **Mint NFTs**:  
   - Select desired images, add metadata, and confirm the minting transaction.  

4. **Success Page**:  
   - View minted NFT details and explore on-chain records.  

---

## 🧑‍💻 **Contributing**  
1. Fork the repository.  
2. Create a new branch for your feature:  
   ```bash  
   git checkout -b feature-name  
   ```  
3. Commit changes and push:  
   ```bash  
   git add .  
   git commit -m "Add feature name"  
   git push origin feature-name  
   ```  
4. Open a pull request.  

---

## 🛠️ **Future Enhancements**  
- Add NFT Marketplace functionality.  
- Implement dynamic pricing for minting.  
- Enhance AI prompt generation with themes and styles.  

---
