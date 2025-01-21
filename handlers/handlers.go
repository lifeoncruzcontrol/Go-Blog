package handlers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"go-blog-api/db"
	"go-blog-api/entities"
	"go-blog-api/storage"
	"go-blog-api/utils"
)

func GetAllPostsHandler(w http.ResponseWriter) {
	var posts []entities.Post // Create a new slice for easier encoding
	for _, p := range storage.PostsMap {
		posts = append(posts, p)
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(posts)
}

func GetPostByIDHandler(w http.ResponseWriter, r *http.Request) {
	urlVars := r.URL.Query()
	id := urlVars.Get("id")
	if id == "" {
		http.Error(w, "ID missing", http.StatusBadRequest)
		return
	}

	post, exists := storage.PostsMap[id]

	if !exists {
		http.Error(w, "Post not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(post)
}

func CreatePostHandler(w http.ResponseWriter, r *http.Request) {
	var newPost entities.Post
	if err := utils.DecodeJSON(r, &newPost); err != nil {
		log.Printf("Error decoding JSON: %v", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	newPost.Datetime = time.Now()
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	doc, err := db.Posts.InsertOne(ctx, newPost)
	if err != nil {
		log.Printf("Error saving new post to database: %v", err)
		http.Error(w, "Failed to save post", http.StatusInternalServerError)
		return
	}
	res := entities.PostResponse{
		ID:       doc.InsertedID,
		Datetime: newPost.Datetime,
	}
	w.Header().Set("Content-Type", "application/json")
	// Encode and send the newPost result back to the client
	if err := json.NewEncoder(w).Encode(res); err != nil {
		// Log any JSON encoding error
		log.Printf("Error encoding response: %v", err)

		// Return a 500 error if response encoding fails
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
}

func PatchTextByIdHandler(w http.ResponseWriter, r *http.Request) {
	urlVars := r.URL.Query()
	id := urlVars.Get("id")
	if id == "" {
		http.Error(w, "ID missing", http.StatusBadRequest)
		return
	}
	post, exist := storage.PostsMap[id]
	if !exist {
		http.Error(w, "Post does not exist for that ID", http.StatusNotFound)
		return
	}
	var updatedText entities.UpdateText
	if err := utils.DecodeJSON(r, &updatedText); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	post.Text = updatedText.Text
	storage.PostsMap[id] = post
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(post)
}

func DeletePostByIdHandler(w http.ResponseWriter, r *http.Request) {
	urlVars := r.URL.Query()
	id := urlVars.Get("id")
	if id == "" {
		http.Error(w, "ID missing", http.StatusBadRequest)
		return
	}
	_, exist := storage.PostsMap[id]

	if !exist {
		http.Error(w, "Post does not exist for that ID", http.StatusNotFound)
		return
	}
	delete(storage.PostsMap, id)
	w.WriteHeader(http.StatusNoContent)
}
