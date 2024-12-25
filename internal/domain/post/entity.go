package post

import (
	"time"

	"github.com/google/uuid"
)

type Post struct {
	Id     uuid.UUID `json:"id"`
	UserId uuid.UUID `json:"userId"`
	Text   string    `json:"text"`
	Date   time.Time `json:"date"`
}
