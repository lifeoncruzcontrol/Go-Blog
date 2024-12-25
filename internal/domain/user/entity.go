package user

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	UserId       uuid.UUID `json:"userId"`
	Name         string    `json:"name"`
	Email        string    `json:"email"`
	CreationDate time.Time `json:"creationDate"`
}
