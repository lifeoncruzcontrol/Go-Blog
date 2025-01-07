package main

import (
	"time"

	"github.com/google/uuid"
)

type post struct {
	ID       uuid.UUID `json:"id"`
	Username string    `json:"Username"`
	Text     string    `json:"text"`
	Datetime time.Time `json:"datetime"`
}
