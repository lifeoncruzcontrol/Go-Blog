package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/google/uuid"

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
	newPost, err := CreatePostHandlerInternal(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(newPost)
}

func CreatePostHandlerInternal(r *http.Request) (entities.Post, error) {
	var newPost entities.Post
	if err := utils.DecodeJSON(r, &newPost); err != nil {
		log.Fatal(err)
		return entities.Post{}, err
	}
	newPost.ID = uuid.New()
	newPost.Datetime = time.Now()
	storage.PostsMap[newPost.ID.String()] = newPost
	return newPost, nil
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
