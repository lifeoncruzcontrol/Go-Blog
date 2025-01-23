package main

import (
	"log"
	"net/http"

	"go-blog-api/db"
	"go-blog-api/entities"
	"go-blog-api/handlers"
	"go-blog-api/storage"
)

func main() {
	defer func() {
		if err := db.Client.Disconnect(db.Ctx); err != nil {
			log.Fatal("Error while disconnecting client: ", err)
		}
		db.Cancel() // Release the context
		log.Println("Shutdown cleanup complete")
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
		// case http.MethodPatch:
		// 	handlers.PatchTextByIdHandler(w, r)
		// case http.MethodDelete:
		// 	handlers.DeletePostByIdHandler(w, r)
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
