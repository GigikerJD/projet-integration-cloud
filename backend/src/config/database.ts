import mongoose from "mongoose"

export const connectDB = async (): Promise<void> => {
    const MONGO_URI = process.env.MONGO_URI

    if (!MONGO_URI) {
        console.error("❌ MONGO_URI manquant dans le fichier .env")
        process.exit(1)
    }

    try {
        await mongoose.connect(MONGO_URI)
        console.log("✅ MongoDB connecté :", MONGO_URI)
    } catch (error) {
        console.error("❌ Erreur de connexion MongoDB :", error)
        process.exit(1)
    }
}

mongoose.connection.on("disconnected", () => {
    console.warn("⚠️  MongoDB déconnecté")
})

process.on("SIGINT", async () => {
    await mongoose.connection.close()
    console.log("🔌 Connexion MongoDB fermée (arrêt serveur)")
    process.exit(0)
})