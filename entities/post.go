package entities

import (
	"time"

	"github.com/google/uuid"
)

type Post struct {
	ID       uuid.UUID `json:"id"`
	Username string    `json:"Username"`
	Text     string    `json:"text"`
	Datetime time.Time `json:"datetime"`
}

type PostResponse struct {
	ID       interface{} `json:"id"`
	Datetime time.Time   `json:"datetime"`
}

type UpdateText struct {
	Text string `json:"text"`
}
