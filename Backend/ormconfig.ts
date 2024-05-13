import { User } from './src/entities/user.entity';
import { Feedback } from './src/entities/feedback.entity';
import { AboutUs } from './src/entities/about-us.entity';
import { FriendRequest } from './src/entities/friend-request.entity';
import { JobPost } from './src/entities/job-post.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { Posts } from 'src/entities/post.entity';
import { Admin } from './src/entities/admin.entity';
import { messages } from 'src/entities/message.entity';
import { wallets } from 'src/entities/wallet.entity';
import { events } from 'src/entities/event.entity';
import { Badge } from 'src/entities/badge.entity';
import { Comment } from 'src/entities/comment.entity';
import { Faq } from 'src/entities/faq.entity';
import { Forum } from 'src/entities/forum.entity';
import { UserProfile } from 'src/entities/user-profile.entity';
import { Subscription } from 'src/entities/subscription.entity';
import { Notification } from 'src/entities/notification.entity';


const config: PostgresConnectionOptions = {
  type: 'postgres',
  database: 'test',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '43228',
  entities: [User, Feedback, FriendRequest, Notification, Subscription, JobPost, AboutUs, Posts, Admin, messages, wallets, events, Badge, Comment, Faq, Forum, UserProfile],
  synchronize: true,
};

export default config;
