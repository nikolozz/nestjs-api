import { CreateSubscriberDto } from '../dto/createSubscriber.dto';

export interface Subscriber {
  id: number;
  email: string;
  name: string;
}

interface SubscribersService {
  addSubscriber(subscriber: CreateSubscriberDto): Promise<Subscriber>;
  getAllSubscribers(params: {}): Promise<{ data: Subscriber[] }>;
  removeSubscriber(params: { id: number }): Promise<void>;
}

export default SubscribersService;
