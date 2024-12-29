package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/google/uuid"
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

var newUserId int = 0

var users = []user{}

func createUserHandler(w http.ResponseWriter, r *http.Request) {
	newUser, err := createUserHandlerInternal(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(newUser)
}

func createUserHandlerInternal(r *http.Request) (user, error) {
	var newUser user
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&newUser); err != nil {
		log.Fatal(err)
		return user{}, err
	}
	newUser.UserId = newUserId
	newUserId++
	users = append(users, newUser)
	return newUser, nil
}

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hello, you have requested: %s\n", r.URL.Path)
	})

	http.HandleFunc("/users", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			createUserHandler(w, r)
		default:
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		}
	})

	http.ListenAndServe(":8080", nil)
}
