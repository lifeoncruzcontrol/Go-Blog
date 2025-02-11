import BlogPost from "./BlogPost";

interface GetPostsResponse {
    data: BlogPost[];
    pagination: {
        limit: number,
        nextCursor: string,
        totalDocuments: number,
        totalPages: number
    }
}

export default GetPostsResponse;