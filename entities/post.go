package entities

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Post struct {
	ID       primitive.ObjectID `json:"id" bson:"_id"`
	Username string             `json:"Username"`
	Text     string             `json:"text"`
	Datetime time.Time          `json:"datetime"`
}

type PostResponse struct {
	ID       interface{} `json:"id"`
	Datetime time.Time   `json:"datetime"`
}

type UpdateText struct {
	Text string `json:"text"`
}
