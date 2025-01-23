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
    throw new Error("Por favor, defina a variável MONGODB_URI no arquivo .env");
  }

  const cached = globalForMongoose.mongooseConnection!;
  
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('Attempting MongoDB connection');
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI)
      .then((mongoose) => mongoose.connection);
  }

  try {
    cached.conn = await cached.promise;
    console.log("MongoDB connection established");
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error("Error connecting to MongoDB", error);
    throw error;
  }
}
