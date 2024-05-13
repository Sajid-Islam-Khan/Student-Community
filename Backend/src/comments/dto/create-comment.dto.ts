import { IsNotEmpty } from "class-validator";

export class CreateCommentDto {
    @IsNotEmpty()
    userId: number;

    @IsNotEmpty()
    postId: number;
    
    content: string;
}
