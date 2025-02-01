package entities

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Post struct {
	ID       primitive.ObjectID `json:"id" bson:"_id"`
	Title    string             `json:"title"`
	Username string             `json:"Username"`
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
	Tags      []string `json:"tags"`
	Usernames []string `json:"usernames"`
	Limit     int      `json:"limit"`
	LastID    string   `json:"lastid"`
}
