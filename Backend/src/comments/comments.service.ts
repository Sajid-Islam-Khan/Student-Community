import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comment.entity';
import { Repository } from 'typeorm';
import { Posts } from 'src/entities/post.entity';
import { User } from 'src/entities/user.entity';
import { Forum } from 'src/entities/forum.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private readonly commentRepo: Repository<Comment>,
    @InjectRepository(Posts) private readonly postRepo: Repository<Posts>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Forum) private readonly forumRepo: Repository<Forum>,
  ) { }


  async create(createCommentDto: CreateCommentDto, userId: number, postId: number): Promise<Comment> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    const comment = this.commentRepo.create({ ...createCommentDto, user, post })
    return await this.commentRepo.save(createCommentDto);
  }

  async findOne(id: number) {
    return await this.commentRepo.findOne({ where: { id: id } });
  }

  async remove(id: number): Promise<Comment> {
    const comment = await this.commentRepo.findOne({ where: { id: id } });
    if (!comment) {
      return undefined;
    }
    await this.commentRepo.remove(comment);
    return comment;
  }

  // async getCommentByPost(postId: number) {
  //   const comments = await this.postRepo.find({
  //     where: { id: postId },
  //     relations: ['comments']
  //   });
  //   return comments;
  // }


  async getCommentByPost(postId: number){
    const comments = await this.commentRepo.find({where: {postId: postId}});
    return comments;
  }

  async getCommentByForum(forunId: number) {
    const comments = await this.forumRepo.find({
      where: { id: forunId },
      relations: ['comments']
    });
    return comments;
  }
  //Sajid
  async countComments(): Promise<number> {
    return this.commentRepo.count();
  }
}
