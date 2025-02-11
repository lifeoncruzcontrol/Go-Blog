interface BlogPost {
    _id: string;
    title: string;
    username: string;
    text: string;
    tags: string[];
    dateTime: any;
}

export default BlogPost;