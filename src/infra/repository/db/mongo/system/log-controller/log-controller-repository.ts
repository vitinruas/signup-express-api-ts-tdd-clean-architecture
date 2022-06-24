import { ILogRepository } from '../../../../../../main/decorators/log-controller-decorator-protocols'
import { mongoHelper } from '../../helpers/mongoHelper'

export class LogControllerMongoRepository implements ILogRepository {
  async logServerError(stack: string): Promise<void> {
    const collectionRef = mongoHelper.getCollection('serverErrors')

    const date = new Date().toLocaleDateString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })

    await collectionRef.insertOne({
      stack,
      date,
    })
  }
}
