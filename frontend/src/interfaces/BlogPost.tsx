interface BlogPost {
    id?: string;
    title: string;
    author: string;
    text: string;
    tags: string[];
    datetime?: string;
}

export default BlogPost;