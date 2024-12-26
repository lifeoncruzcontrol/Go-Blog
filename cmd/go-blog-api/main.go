package main

import (
	"fmt"

	"net/http"

	"github.com/google/uuid"

	"time"
)

type post struct {
	ID     uuid.UUID `json:"id"`
	UserId uuid.UUID `json:"userid"`
	Text   string    `json:"text"`
	Date   time.Time `json:"date"`
}

type user struct {
	UserId uuid.UUID `json:"id"`
	Name   string    `json:"name"`
}

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hello, you have requested: %s\n", r.URL.Path)
	})

	http.ListenAndServe(":8080", nil)
}
