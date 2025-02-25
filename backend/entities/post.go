package entities

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Post struct {
	ID       primitive.ObjectID `json:"id" bson:"_id"`
	Title    string             `json:"title"`
	Author   string             `json:"author"`
	Text     string             `json:"text"`
	Tags     []string           `json:"tags" bson:"tags"`
	Datetime time.Time          `json:"datetime"`
}

type PostResponse struct {
	ID       interface{} `json:"id"`
	Datetime time.Time   `json:"datetime"`
	Tags     []string    `json:"tags,omitempty" bson:"tags,omitempty"`
}

type UpdateText struct {
	Text string `json:"text"`
}

type FilterRequest struct {
	Tags       []string `json:"tags"`
	Authors    []string `json:"authors"`
	Limit      int      `json:"limit"`
	NextCursor string   `json:"nextcursor"`
}

type Pagination struct {
	Limit          int    `json:"limit"`
	CurrCursor     string `json:"currcursor"`
	NextCursor     string `json:"nextCursor"`
	TotalDocuments int64  `json:"totalDocuments,omitempty"`
	TotalPages     int    `json:"totalPages,omitempty"`
}

type Response struct {
	Data       []Post     `json:"data"`
	Pagination Pagination `json:"pagination"`
}
