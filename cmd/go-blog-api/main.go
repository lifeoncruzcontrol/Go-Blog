package main

import (
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

var postsMap map[string]post

func main() {
	postsMap = make(map[string]post)
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
			vars := r.URL.Query()
			id := vars.Get("id")
			if id != "" {
				getPostByIDHandler(w, r)
			} else {
				getAllPostsHandler(w, r)
			}
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
