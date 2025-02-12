import mongoose, { Connection } from "mongoose";

interface MongooseConnection {
  conn: Connection | null;
  promise: Promise<Connection> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseConnection: MongooseConnection | undefined;
}

const globalForMongoose = global as typeof globalThis & {
  mongooseConnection?: MongooseConnection;
};

if (!globalForMongoose.mongooseConnection) {
  globalForMongoose.mongooseConnection = { conn: null, promise: null };
}

export async function connectToMongoDB(): Promise<Connection> {
  if (!process.env.MONGODB_URI) {
    console.error("❌ ERRO: MONGODB_URI não definida.");
    throw new Error("Defina a variável MONGODB_URI no .env");
  }

  const cached = globalForMongoose.mongooseConnection!;

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("🔄 Iniciando nova conexão com MongoDB...");
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI)
      .then((mongoose) => mongoose.connection);
  }

  try {
    cached.conn = await cached.promise;

    if (cached.conn.readyState !== 1) {
      console.error(`❌ Conexão falhou! Estado: ${cached.conn.readyState}`);
      throw new Error("Não foi possível conectar ao MongoDB.");
    }

    console.log("✅ Conexão estabelecida com MongoDB!");
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error("❌ Erro ao conectar ao MongoDB:", error);
    throw error;
  }
}

export async function refreshMongoDBConnection(): Promise<Connection> {
  if (!globalForMongoose.mongooseConnection) {
    throw new Error("Conexão com MongoDB não estabelecida.");
  }

  globalForMongoose.mongooseConnection.conn = null;
  globalForMongoose.mongooseConnection.promise = null;

  return connectToMongoDB();
}

export async function veryfyConnectionMongo() {
  try {
    const connection = await connectToMongoDB();

    if (!connection.readyState || connection.readyState !== 1) {
      const reconnection = await refreshMongoDBConnection();
      if (!reconnection.readyState || reconnection.readyState !== 1) {
        console.error(
          `Failed to connect to MongoDB! State: ${reconnection.readyState}`,
        );
        return { success: false, error: "Erro ao conectar ao banco de dados" };
      }
      return { success: true };
    }
    return { success: true };
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    return { success: false, error: "Erro ao conectar ao banco de dados" };
  }
}
