package main

import (
	"fmt"

	"net/http"

	"github.com/google/uuid"

	"time"
)

type post struct {
	ID     uuid.UUID `json:"id"`
	UserId int       `json:"userid"`
	Text   string    `json:"text"`
	Date   time.Time `json:"date"`
}

type user struct {
	UserId int    `json:"id"`
	Name   string `json:"name"`
}

// Initialize an empty slice of posts
var posts []post

var users = []user{
	{UserId: 0, Name: "Joe"},
	{UserId: 1, Name: "Meribeth"},
	{UserId: 2, Name: "Janice"},
}

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hello, you have requested: %s\n", r.URL.Path)
	})

	http.ListenAndServe(":8080", nil)
}
