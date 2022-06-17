import mongoose, { ConnectOptions, Collection } from 'mongoose'

class MongoHelper {
  private readonly defaultOptions: ConnectOptions = { maxPoolSize: 10 }

  async connect(uri: string, options?: ConnectOptions): Promise<void> {
    await mongoose
      .connect(uri, options || this.defaultOptions)
      .then(() => console.log('-> Connect to MongoDB server'))
  }

  async disconnect(): Promise<void> {
    await mongoose
      .disconnect()
      .then(() => console.log('-> Disconnected from MongoDB server'))
  }

  // get collection reference
  getCollection(collection: string): Collection {
    return mongoose.connection.collection(collection)
  }

  // remove mongo id from documents
  map(document: any): any {
    const { _id, ...data } = document
    return Object.assign({}, data, { id: _id })
  }
}

export const mongoHelper = new MongoHelper()
