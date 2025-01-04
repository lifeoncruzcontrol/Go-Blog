package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/google/uuid"
)

type post struct {
	ID       uuid.UUID `json:"id"`
	Username string    `json:"Username"`
	Text     string    `json:"text"`
	Datetime time.Time `json:"datetime"`
}

// Initialize an empty slice of posts
var posts = []post{}

func getAllPostsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(posts)
}

func createPostHandler(w http.ResponseWriter, r *http.Request) {
	newPost, err := createPostHandlerInternal(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(newPost)
}

func createPostHandlerInternal(r *http.Request) (post, error) {
	var newPost post
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&newPost); err != nil {
		log.Fatal(err)
		return post{}, err
	}
	newPost.ID = uuid.New()
	newPost.Datetime = time.Now()
	posts = append(posts, newPost)
	return newPost, nil
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			w.Header().Set("Allow", http.MethodPost)
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
			return
		}
		if r.URL.Path != "/" {
			http.NotFound(w, r)
			return
		}
		w.Write([]byte("Hello world"))
	})

	mux.HandleFunc("/posts", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			createPostHandler(w, r)
		case http.MethodGet:
			getAllPostsHandler(w, r)
		default:
			w.Header().Set("Allow", http.MethodPost)
			w.Header().Set("Allow", http.MethodGet)
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
			return
		}
	})

	log.Println("Starting server on :8080")
	err := http.ListenAndServe(":8080", mux)
	log.Fatal(err)
}
