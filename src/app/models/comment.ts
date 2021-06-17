export class PostComment {
  constructor(
    public comment_ID: number,
    public comment_post_ID: number,
    public comment_author: string,
    public comment_date: Date,
    public comment_content: string,
    public user_id: number
  ){}
}
