import BlogPost from "./BlogPost";

interface GetPostsResponse {
    data: BlogPost[];
    pagination: {
        limit: number | null,
        nextCursor: string,
        totalDocuments: number | null,
        totalPages: number | null
    }
}

export default GetPostsResponse;