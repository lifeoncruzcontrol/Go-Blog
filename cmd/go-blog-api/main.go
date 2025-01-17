package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"time"

	"go-blog-api/entities"
	"go-blog-api/handlers"
	"go-blog-api/storage"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	mongoURI := os.Getenv("MONGO_URI")
	if mongoURI == "" {
		log.Fatal("Missing MONGO_URI variable")
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Fatal("Error connecting to database")
		return
	}

	defer func() {
		if err := client.Disconnect(ctx); err != nil {
			panic(err)
		}
	}()
	storage.PostsMap = make(map[string]entities.Post)
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
			handlers.CreatePostHandler(w, r)
		case http.MethodGet:
			urlVars := r.URL.Query()
			id := urlVars.Get("id")
			if id != "" {
				handlers.GetPostByIDHandler(w, r)
			} else {
				handlers.GetAllPostsHandler(w)
			}
		case http.MethodPatch:
			handlers.PatchTextByIdHandler(w, r)
		case http.MethodDelete:
			handlers.DeletePostByIdHandler(w, r)
		default:
			w.Header().Set("Allow", http.MethodPost)
			w.Header().Set("Allow", http.MethodGet)
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
			return
		}
	})

	log.Println("Starting server on :8080")
	err = http.ListenAndServe(":8080", mux)
	log.Fatal(err)
}
